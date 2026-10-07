/**
 * Data layer for the Inventory screen, mirroring LSC's Sample Inventory
 * Management dashboard: batches assigned to a rep (ProductBatchItem),
 * inventory operations (transfers, returns, adjustments, disbursements),
 * product requests and inventory counts. Read-only; what comes back is
 * whatever the signed-in user's sharing allows.
 */
import { executeGraphQL } from './graphqlClient';
import type {
  GetInventoryCountsQuery,
  GetInventoryOperationsQuery,
  GetInventoryQuery,
  GetProductRequestsQuery,
} from './graphql-operations-types';
import GET_INVENTORY from './queries/GetInventory.graphql?raw';
import GET_INVENTORY_COUNTS from './queries/GetInventoryCounts.graphql?raw';
import GET_INVENTORY_OPERATIONS from './queries/GetInventoryOperations.graphql?raw';
import GET_PRODUCT_REQUESTS from './queries/GetProductRequests.graphql?raw';

type Field<T> = { value?: T | null; displayValue?: string | null } | null | undefined;

const raw = <T>(field: Field<T>): T | null => field?.value ?? null;
const label = (field: Field<string>): string | null =>
  field?.displayValue ?? field?.value ?? null;

function nodes<T>(
  connection: { edges?: ({ node?: T | null } | null)[] | null } | null | undefined
): T[] {
  return (connection?.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is T => node != null);
}

/** Batches expiring within this many days are flagged as expiring soon. */
export const EXPIRING_SOON_DAYS = 90;

export type ExpiryState = 'expired' | 'soon' | 'ok' | 'none';

export interface InventoryItem {
  id: string;
  product: string | null;
  batch: string | null;
  location: string | null;
  assignee: string | null;
  quantity: number;
  expiration: string | null;
  expiry: ExpiryState;
  active: boolean;
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const data = await executeGraphQL<GetInventoryQuery, undefined>(GET_INVENTORY);
  const now = Date.now();
  const soon = now + EXPIRING_SOON_DAYS * 86_400_000;
  return nodes(data.uiapi.query.ProductBatchItem).map((node) => {
    const expiration = raw(node.ExpirationDate);
    const time = expiration ? new Date(expiration).getTime() : null;
    return {
      id: node.Id,
      product: raw(node.Product?.Name),
      batch: raw(node.ProductionBatch?.Name),
      location: raw(node.Location?.Name),
      assignee: raw(node.Assignee?.Name),
      quantity: raw(node.RemainingQuantity) ?? 0,
      expiration,
      expiry: time === null ? 'none' : time < now ? 'expired' : time <= soon ? 'soon' : 'ok',
      active: raw(node.IsActive) ?? false,
    };
  });
}

export interface InventoryOperationRow {
  id: string;
  name: string;
  type: string | null;
  status: string | null;
  created: string | null;
  from: string | null;
  to: string | null;
  comment: string | null;
}

export async function fetchInventoryOperations(): Promise<InventoryOperationRow[]> {
  const data = await executeGraphQL<GetInventoryOperationsQuery, undefined>(
    GET_INVENTORY_OPERATIONS
  );
  return nodes(data.uiapi.query.InventoryOperation).map((node) => ({
    id: node.Id,
    name: raw(node.Name) ?? node.Id,
    type: label(node.OperationType),
    status: label(node.Status),
    created: raw(node.CreatedDate),
    from: raw(node.SourceLocation?.Name),
    to: raw(node.DestinationLocation?.Name),
    comment: raw(node.Comment),
  }));
}

export interface ProductRequestRow {
  id: string;
  number: string;
  status: string | null;
  shipment: string | null;
  needBy: string | null;
  created: string | null;
  destination: string | null;
}

export async function fetchProductRequests(): Promise<ProductRequestRow[]> {
  const data = await executeGraphQL<GetProductRequestsQuery, undefined>(GET_PRODUCT_REQUESTS);
  return nodes(data.uiapi.query.ProductRequest).map((node) => ({
    id: node.Id,
    number: raw(node.ProductRequestNumber) ?? node.Id,
    status: label(node.Status),
    shipment: label(node.ShipmentType),
    needBy: raw(node.NeedByDate),
    created: raw(node.CreatedDate),
    destination: raw(node.DestinationLocation?.Name),
  }));
}

export interface InventoryCountRow {
  id: string;
  name: string;
  status: string | null;
  type: string | null;
  purpose: string | null;
  location: string | null;
  user: string | null;
  planned: string | null;
  completed: string | null;
}

export async function fetchInventoryCounts(): Promise<InventoryCountRow[]> {
  const data = await executeGraphQL<GetInventoryCountsQuery, undefined>(GET_INVENTORY_COUNTS);
  return nodes(data.uiapi.query.InventoryCountAssessment).map((node) => ({
    id: node.Id,
    name: raw(node.Name) ?? node.Id,
    status: label(node.Status),
    type: label(node.Type),
    purpose: label(node.Purpose),
    location: raw(node.Location?.Name),
    user: raw(node.LocationPrimaryUser?.Name),
    planned: raw(node.PlannedStartDateTime),
    completed: raw(node.ActualEndDateTime),
  }));
}
