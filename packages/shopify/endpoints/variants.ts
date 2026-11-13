import type {
	ShopifyContext,
	ShopifyEndpointInputs,
	ShopifyEndpointOutputs,
} from '..';
import { call } from './call';
import { DEFAULT_PAGE_SIZE } from './schemas';
import {
	ShopifyEndpointInputSchemas as Inputs,
	ShopifyEndpointOutputSchemas as Outputs,
} from './types';

const VARIANT_FRAGMENT = `
fragment VariantFields on ProductVariant {
  id
  title
  sku
  price
  compareAtPrice
  inventoryQuantity
  inventoryItem { id }
}`;

// `productId` is passed as a search filter rather than nesting under
// Product.variants: the top-level connection is the only one that accepts a
// cursor and a page size, which is what makes paging past one product work.
const LIST_QUERY = `
query VariantsList($first: Int, $after: String, $query: String) {
  productVariants(first: $first, after: $after, query: $query) {
    edges { node { ...VariantFields } cursor }
    pageInfo { hasNextPage endCursor }
  }
}
${VARIANT_FRAGMENT}`;

const UPDATE_MUTATION = `
mutation VariantsUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    productVariants { ...VariantFields }
    userErrors { field message }
  }
}
${VARIANT_FRAGMENT}`;

export const list = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['variantsList'],
): Promise<ShopifyEndpointOutputs['variantsList']> =>
	call(
		ctx,
		{
			event: 'variants.list',
			input: Inputs.variantsList,
			output: Outputs.variantsList,
		},
		input,
		({ first, after, query, productId }) => ({
			query: LIST_QUERY,
			variables: {
				first: first ?? DEFAULT_PAGE_SIZE,
				after,
				// A product id is an ID filter in the search syntax, not part of
				// the path, and it combines with any caller filter.
				query: [`product_id:${gidNumericPart(productId)}`, query]
					.filter(Boolean)
					.join(' AND '),
			},
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.productVariants.edges.length }) },
	);

export const update = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['variantsUpdate'],
): Promise<ShopifyEndpointOutputs['variantsUpdate']> =>
	call(
		ctx,
		{
			event: 'variants.update',
			input: Inputs.variantsUpdate,
			output: Outputs.variantsUpdate,
			mutation: true,
		},
		input,
		({ productId, id, sku, barcode, barcodeType, ...fields }) => ({
			query: UPDATE_MUTATION,
			// `ProductVariantsBulkInput` has no top-level `sku` or `barcode`.
			// The SKU lives on the variant's inventory item, and a barcode goes
			// in the `barcodes` list, which replaced the deprecated `barcode`
			// field. Sending either at the top level fails validation and takes
			// the rest of the update with it.
			variables: {
				productId,
				variants: [
					{
						id,
						...definedOnly(fields),
						...(sku !== undefined ? { inventoryItem: { sku } } : {}),
						...(barcode !== undefined
							? {
									barcodes: [{ value: barcode, type: barcodeType ?? 'UPC' }],
								}
							: {}),
					},
				],
			},
			payloadKey: 'productVariantsBulkUpdate',
		}),
		{
			shape: (raw) => {
				// unknown: the mutation payload's data half; the output schema
				// validates it after this narrowing.
				const payload = raw as {
					productVariantsBulkUpdate: { productVariants?: unknown };
				};
				return {
					productVariants: payload.productVariantsBulkUpdate.productVariants,
				};
			},
			log: (_, result) => ({ count: result.productVariants.length }),
		},
	);

/**
 * Shopify's search syntax takes the bare numeric id for an `id`-typed filter,
 * not the `gid://` form, so `product_id:gid://shopify/Product/1` matches
 * nothing. A caller that passes the already-numeric id is left alone.
 */
export function gidNumericPart(value: string): string {
	const match = /\/(\d+)$/.exec(value);
	return match?.[1] ?? value;
}

function definedOnly(
	fields: Record<string, string | undefined>,
): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined) out[key] = value;
	}
	return out;
}
