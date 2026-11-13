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

const COLLECTION_FRAGMENT = `
fragment CollectionFields on Collection {
  id
  title
  handle
  descriptionHtml
  updatedAt
  sortOrder
  productsCount { count }
}`;

const LIST_QUERY = `
query CollectionsList($first: Int, $after: String, $query: String) {
  collections(first: $first, after: $after, query: $query) {
    edges { node { ...CollectionFields } cursor }
    pageInfo { hasNextPage endCursor }
  }
}
${COLLECTION_FRAGMENT}`;

const GET_QUERY = `
query CollectionGet($id: ID!) {
  collection(id: $id) { ...CollectionFields }
}
${COLLECTION_FRAGMENT}`;

const CREATE_MUTATION = `
mutation CollectionCreate($collection: CollectionCreateInput!) {
  collectionCreate(collection: $collection) {
    collection { ...CollectionFields }
    userErrors { field message }
  }
}
${COLLECTION_FRAGMENT}`;

// Shopify documents that if any product is already in the collection, the
// whole call fails and nothing is added. That surfaces as a userError, which
// call() throws on, so a partial add cannot be reported as success.
const ADD_PRODUCTS_MUTATION = `
mutation CollectionAddProducts($id: ID!, $productIds: [ID!]!) {
  collectionAddProducts(id: $id, productIds: $productIds) {
    collection { ...CollectionFields }
    userErrors { field message }
  }
}
${COLLECTION_FRAGMENT}`;

export const list = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['collectionsList'],
): Promise<ShopifyEndpointOutputs['collectionsList']> =>
	call(
		ctx,
		{
			event: 'collections.list',
			input: Inputs.collectionsList,
			output: Outputs.collectionsList,
		},
		input,
		({ first, after, query }) => ({
			query: LIST_QUERY,
			variables: { first: first ?? DEFAULT_PAGE_SIZE, after, query },
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.collections.edges.length }) },
	);

export const get = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['collectionsGet'],
): Promise<ShopifyEndpointOutputs['collectionsGet']> =>
	call(
		ctx,
		{
			event: 'collections.get',
			input: Inputs.collectionsGet,
			output: Outputs.collectionsGet,
		},
		input,
		({ id }) => ({ query: GET_QUERY, variables: { id }, replaySafe: true }),
	);

export const create = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['collectionsCreate'],
): Promise<ShopifyEndpointOutputs['collectionsCreate']> =>
	call(
		ctx,
		{
			event: 'collections.create',
			input: Inputs.collectionsCreate,
			output: Outputs.collectionsCreate,
			mutation: true,
		},
		input,
		(collection) => ({
			query: CREATE_MUTATION,
			variables: { collection },
			payloadKey: 'collectionCreate',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as {
					collectionCreate: { collection?: unknown };
				};
				return { collection: payload.collectionCreate.collection };
			},
			log: (_, result) => ({ collectionId: result.collection.id }),
		},
	);

export const addProducts = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['collectionsAddProducts'],
): Promise<ShopifyEndpointOutputs['collectionsAddProducts']> =>
	call(
		ctx,
		{
			event: 'collections.addProducts',
			input: Inputs.collectionsAddProducts,
			output: Outputs.collectionsAddProducts,
			mutation: true,
		},
		input,
		({ id, productIds }) => ({
			query: ADD_PRODUCTS_MUTATION,
			variables: { id, productIds },
			payloadKey: 'collectionAddProducts',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as {
					collectionAddProducts: { collection?: unknown };
				};
				return { collection: payload.collectionAddProducts.collection };
			},
			log: ({ productIds }) => ({ count: productIds.length }),
		},
	);
