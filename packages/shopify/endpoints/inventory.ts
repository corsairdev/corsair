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
const LIST_QUERY = `
query InventoryList($id: ID!) {
  inventoryItem(id: $id) {
    id
    sku
    tracked
    inventoryLevels(first: 50) {
      edges {
        node {
          id
          isActive
          updatedAt
          item { id sku }
          location { id name }
          quantities(names: ["available"]) { name quantity }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;

// Shopify names this argument by field path, so the same value also lands in
// the input object. `changeFromQuantity` is deliberately omitted: it turns the
// write into a compare-and-swap, and this endpoint is a plain delta.
const ADJUST_MUTATION = `
mutation InventoryAdjust($input: InventoryAdjustQuantitiesInput!) {
  inventoryAdjustQuantities(input: $input) {
    inventoryAdjustmentGroup {
      createdAt
      reason
      changes { name delta }
    }
    userErrors { field message }
  }
}`;

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
		({ inventoryItemId }) => ({
			query: LIST_QUERY,
			variables: { id: inventoryItemId },
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
		({ inventoryItemId, locationId, delta, reason }) => ({
			query: ADJUST_MUTATION,
			variables: {
				input: {
					reason,
					name: 'available',
					changes: [{ inventoryItemId, locationId, delta }],
				},
			},
			payloadKey: 'inventoryAdjustQuantities',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
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
