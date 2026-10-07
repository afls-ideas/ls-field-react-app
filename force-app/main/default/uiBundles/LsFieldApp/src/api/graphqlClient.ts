/**
 * Thin GraphQL client: createDataSDK + sdk.graphql with centralized error
 * handling. Mutations are routed to sdk.graphql.mutate and everything else to
 * sdk.graphql.query (the SDK rejects an operation sent to the wrong method).
 * Use with gql-tagged queries and generated operation types for type-safe calls.
 */
import { createDataSDK } from '@salesforce/platform-sdk';

/**
 * True when the operation's first definition is a `mutation`. Strips GraphQL
 * comments first so a leading `# ...` line can't mask the keyword. Queries
 * (named or anonymous `{ ... }` shorthand) and subscriptions fall through to
 * query().
 */
function isMutation(operation: string): boolean {
  return /^\s*mutation\b/.test(operation.replace(/#[^\n\r]*/g, ''));
}

/** A GraphQL response that carried errors; keeps the raw entries for callers that map them. */
export class GraphQLRequestError extends Error {
  readonly errors: { message: string; path?: unknown; extensions?: unknown }[];

  constructor(errors: { message: string; path?: unknown; extensions?: unknown }[]) {
    super(`GraphQL Error: ${errors.map(e => e.message).join('; ')}`);
    this.name = 'GraphQLRequestError';
    this.errors = errors;
  }
}

export async function executeGraphQL<TData, TVariables>(
  operation: string,
  variables?: TVariables
): Promise<TData> {
  const data = await createDataSDK();
  const result = isMutation(operation)
    ? await data.graphql!.mutate<TData, TVariables>({
        mutation: operation,
        variables: variables,
      })
    : await data.graphql!.query<TData, TVariables>({
        query: operation,
        variables: variables,
        // The SDK caches reads for 300s by default, which hides our own writes
        // (edits and new records would not show up until it expired).
        cacheControl: 'no-cache',
      });

  if (result.errors?.length) {
    throw new GraphQLRequestError(result.errors);
  }

  if (result.data == null) {
    throw new Error('GraphQL response data is null');
  }

  return result.data;
}
