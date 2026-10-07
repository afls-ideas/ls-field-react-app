/**
 * Turns errors from the object layer into something a rep can act on.
 *
 * Messages were observed against the org (262-lsdo-july):
 *  - "Schedule the visit within the next 100 days."           (future visit limit)
 *  - "Planned start time can't be after the planned end time of a visit."
 *  - "We couldn't perform the action because this visit is submitted and locked."
 * Conflict and time-off rules are configurable per org and were not blocking
 * there, so those patterns are best-effort; unknown messages pass through
 * verbatim because they are the org's own validation text.
 */
import { GraphQLRequestError } from '@/api/graphqlClient';

export type ValidationKind =
  | 'future-limit'
  | 'time-order'
  | 'locked'
  | 'conflict'
  | 'time-off'
  | 'other';

export type ValidationField = 'start' | null;

export interface ExplainedError {
  kind: ValidationKind;
  /** The form field this error belongs under, when it clearly belongs to one. */
  field: ValidationField;
  message: string;
}

const PREFIXES = /^(GraphQL Error:\s*)?([A-Z][A-Z0-9_]+:\s*)?/;

function rawMessages(error: unknown): string[] {
  if (error instanceof GraphQLRequestError) return error.errors.map((e) => e.message);
  if (error instanceof Error) return [error.message];
  return [String(error)];
}

function classify(message: string): Omit<ExplainedError, 'message'> & { message?: string } {
  if (/within the next \d+ days?/i.test(message)) return { kind: 'future-limit', field: 'start' };
  if (/start time can'?t be after/i.test(message)) return { kind: 'time-order', field: 'start' };
  if (/submitted and locked|is locked/i.test(message)) {
    return {
      kind: 'locked',
      field: null,
      message: "This visit is submitted and locked, so it can't be changed.",
    };
  }
  if (/conflict|overlap|double.?book/i.test(message)) return { kind: 'conflict', field: 'start' };
  if (/time off|downtime|holiday|business hours/i.test(message)) {
    return { kind: 'time-off', field: 'start' };
  }
  return { kind: 'other', field: null };
}

/** One entry per distinct server message, with prefixes like "FIELD_CUSTOM_VALIDATION_EXCEPTION:" removed. */
export function explainErrors(error: unknown): ExplainedError[] {
  const seen = new Set<string>();
  const result: ExplainedError[] = [];
  for (const raw of rawMessages(error)) {
    const cleaned = raw.replace(PREFIXES, '').trim() || 'Something went wrong';
    if (seen.has(cleaned)) continue;
    seen.add(cleaned);
    const { message, ...rest } = classify(cleaned);
    result.push({ ...rest, message: message ?? cleaned });
  }
  return result;
}

export function isLockedError(error: unknown): boolean {
  return explainErrors(error).some((e) => e.kind === 'locked');
}
