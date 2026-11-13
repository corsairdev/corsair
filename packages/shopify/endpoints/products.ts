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

// Cost is charged per field returned, so the variant connection inside the
// fragment is capped: a product list does not need every variant of every
// product, and an uncapped connection multiplies the cost of each page.
const PRODUCT_FRAGMENT = `
fragment ProductFields on Product {
  id
  title
  handle
  status
  vendor
  productType
  tags
  createdAt
  updatedAt
  publishedAt
  descriptionHtml
  totalInventory
  onlineStoreUrl
  variants(first: 10) {
    edges {
      node {
        id
        title
        sku
        price
        compareAtPrice
        inventoryQuantity
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const LIST_QUERY = `
query ProductsList($first: Int, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
  products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
    edges { node { ...ProductFields } cursor }
    pageInfo { hasNextPage endCursor }
  }
}
${PRODUCT_FRAGMENT}`;

const GET_QUERY = `
query ProductGet($id: ID!) {
  product(id: $id) { ...ProductFields }
}
${PRODUCT_FRAGMENT}`;

// ProductCreateInput has no `variants` field: Shopify creates the initial
// variant through `productSet` or a separate mutation, so this stays a plain
// product write.
const CREATE_MUTATION = `
mutation ProductCreate($product: ProductCreateInput!) {
  productCreate(product: $product) {
    product { ...ProductFields }
    userErrors { field message }
  }
}
${PRODUCT_FRAGMENT}`;

const UPDATE_MUTATION = `
mutation ProductUpdate($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    product { ...ProductFields }
    userErrors { field message }
  }
}
${PRODUCT_FRAGMENT}`;

// productDelete takes `input: ProductDeleteInput!`, not a bare `id` argument.
// `productDeleteOperation` is the polling handle for the asynchronous form:
// with `synchronous: false` Shopify applies the delete in the background and
// returns nothing else to track it with.
const DELETE_MUTATION = `
mutation ProductDelete($input: ProductDeleteInput!, $synchronous: Boolean!) {
  productDelete(input: $input, synchronous: $synchronous) {
    deletedProductId
    productDeleteOperation {
      id
      status
    }
    userErrors { field message }
  }
}`;

export const list = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['productsList'],
): Promise<ShopifyEndpointOutputs['productsList']> =>
	call(
		ctx,
		{
			event: 'products.list',
			input: Inputs.productsList,
			output: Outputs.productsList,
		},
		input,
		({ first, after, query, sortKey, reverse }) => ({
			query: LIST_QUERY,
			variables: {
				first: first ?? DEFAULT_PAGE_SIZE,
				after,
				query,
				sortKey,
				reverse,
			},
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.products.edges.length }) },
	);

export const get = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['productsGet'],
): Promise<ShopifyEndpointOutputs['productsGet']> =>
	call(
		ctx,
		{
			event: 'products.get',
			input: Inputs.productsGet,
			output: Outputs.productsGet,
		},
		input,
		({ id }) => ({ query: GET_QUERY, variables: { id }, replaySafe: true }),
	);

export const create = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['productsCreate'],
): Promise<ShopifyEndpointOutputs['productsCreate']> =>
	call(
		ctx,
		{
			event: 'products.create',
			input: Inputs.productsCreate,
			output: Outputs.productsCreate,
			mutation: true,
		},
		input,
		(product) => ({
			query: CREATE_MUTATION,
			variables: { product },
			payloadKey: 'productCreate',
		}),
		{
			// The mutation payload holds `product` beside `userErrors`; the
			// output schema describes just the data half.
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as {
					productCreate: { product?: unknown };
				};
				return { product: payload.productCreate.product };
			},
			log: (_, result) => ({ productId: result.product.id }),
		},
	);

export const update = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['productsUpdate'],
): Promise<ShopifyEndpointOutputs['productsUpdate']> =>
	call(
		ctx,
		{
			event: 'products.update',
			input: Inputs.productsUpdate,
			output: Outputs.productsUpdate,
			mutation: true,
		},
		input,
		(product) => ({
			query: UPDATE_MUTATION,
			variables: { product },
			payloadKey: 'productUpdate',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as {
					productUpdate: { product?: unknown };
				};
				return { product: payload.productUpdate.product };
			},
			log: (_, result) => ({ productId: result.product.id }),
		},
	);

export const remove = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['productsDelete'],
): Promise<ShopifyEndpointOutputs['productsDelete']> =>
	call(
		ctx,
		{
			event: 'products.delete',
			input: Inputs.productsDelete,
			output: Outputs.productsDelete,
			mutation: true,
		},
		input,
		({ id, synchronous }) => ({
			query: DELETE_MUTATION,
			variables: { input: { id }, synchronous: synchronous ?? true },
			payloadKey: 'productDelete',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as {
					productDelete: {
						deletedProductId?: unknown;
						// unknown: validated by the output schema after this
						// narrowing.
						productDeleteOperation?: unknown;
					};
				};
				return {
					deletedProductId: payload.productDelete.deletedProductId,
					productDeleteOperation: payload.productDelete.productDeleteOperation,
				};
			},
			log: (_, result) => ({ productId: result.deletedProductId ?? undefined }),
		},
	);
