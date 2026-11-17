import { randomUUID } from 'node:crypto';
import type {
	ShopifyContext,
	ShopifyEndpointInputs,
	ShopifyEndpointOutputs,
} from '..';
import { call } from './call';
import {
	ShopifyEndpointInputSchemas as Inputs,
	ShopifyEndpointOutputSchemas as Outputs,
} from './types';

// `quantities` requires the names it should return. Listing only `available`
// keeps the cost down; `on_hand` is the other name Shopify defines.
//
// `inventoryLevels` is a connection: a store with stock at more than one page
// of locations needs the cursor to read the rest, so `first` and `after` come
// from the caller.
const LIST_QUERY = `
query InventoryList($id: ID!, $first: Int, $after: String) {
  inventoryItem(id: $id) {
    id
    sku
    tracked
    inventoryLevels(first: $first, after: $after) {
      edges {
        node {
          id
          isActive
          updatedAt
          item { id sku }
          location { id name }
          quantities(names: ["available"]) { name quantity }
        }
        cursor
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;

// Two requirements from the live 2026-10 schema, both verified by running the
// mutation without them:
//
//   - `InventoryChangeInput.changeFromQuantity` is mandatory: Shopify answers
//     `must include the following argument: changeFromQuantity` when it is
//     absent. Sending `null` explicitly skips the compare-and-swap check, which
//     is what a plain delta wants.
//   - The `@idempotent(key:)` directive is required. The key is derived from
//     the change itself, so a retry of the same adjustment reuses it (Shopify
//     applies it once) while a genuinely new adjustment gets a new key.
const ADJUST_MUTATION = `
mutation InventoryAdjust($input: InventoryAdjustQuantitiesInput!, $idempotencyKey: String!) {
  inventoryAdjustQuantities(input: $input) @idempotent(key: $idempotencyKey) {
    inventoryAdjustmentGroup {
      createdAt
      reason
      changes { name delta }
    }
    userErrors { field message }
  }
}`;

/**
 * A key for one logical adjustment: the caller's, or a fresh one per call.
 *
 * A key derived from the change itself (item, location, delta, reason) made two
 * separate identical adjustments share a key, and Shopify replayed the first
 * result for the second without applying it: verified live on 2026-11-15, two
 * `+1` calls left the quantity at 1 while both reported success.
 *
 * A fresh key per call is safe with the plugin's retry rules. Core retries by
 * re-invoking the endpoint, which only happens here for a THROTTLED answer, and
 * Shopify rejects a throttled request before it runs. A 5xx or a dropped
 * connection on this write is not retried at all (error-handlers.ts). A caller
 * that retries on its own passes `idempotencyKey` and reuses it.
 */
export function adjustmentIdempotencyKey(input: {
	idempotencyKey?: string;
}): string {
	return input.idempotencyKey ?? `inventory-adjust:${randomUUID()}`;
}

export const list = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['inventoryList'],
): Promise<ShopifyEndpointOutputs['inventoryList']> =>
	call(
		ctx,
		{
			event: 'inventory.list',
			input: Inputs.inventoryList,
			output: Outputs.inventoryList,
		},
		input,
		({ inventoryItemId, first, after }) => ({
			query: LIST_QUERY,
			variables: { id: inventoryItemId, first: first ?? 50, after },
			replaySafe: true,
		}),
		{ log: () => ({}) },
	);

export const adjust = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['inventoryAdjust'],
): Promise<ShopifyEndpointOutputs['inventoryAdjust']> =>
	call(
		ctx,
		{
			event: 'inventory.adjust',
			input: Inputs.inventoryAdjust,
			output: Outputs.inventoryAdjust,
			mutation: true,
		},
		input,
		({
			inventoryItemId,
			locationId,
			delta,
			reason,
			changeFromQuantity,
			idempotencyKey,
		}) => ({
			query: ADJUST_MUTATION,
			variables: {
				input: {
					reason,
					name: 'available',
					changes: [
						{
							inventoryItemId,
							locationId,
							delta,
							// Explicitly null unless the caller supplied the
							// current quantity, which turns the write into a
							// compare-and-swap. The field must be present either
							// way or Shopify rejects the request.
							changeFromQuantity: changeFromQuantity ?? null,
						},
					],
				},
				idempotencyKey: adjustmentIdempotencyKey({ idempotencyKey }),
			},
			payloadKey: 'inventoryAdjustQuantities',
		}),
		{
			shape: (raw) => {
				// unknown: the mutation payload's data half; the output schema
				// validates it after this narrowing.
				const payload = raw as {
					inventoryAdjustQuantities: { inventoryAdjustmentGroup?: unknown };
				};
				return {
					inventoryAdjustmentGroup:
						payload.inventoryAdjustQuantities.inventoryAdjustmentGroup,
				};
			},
			log: ({ delta }) => ({ delta }),
		},
	);
