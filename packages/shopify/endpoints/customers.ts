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

/**
 * `email` and `phone` are not fields on Customer in 2026-10, only on
 * `CustomerInput`, so a read that asks for them fails the whole query. The
 * address comes back through `defaultEmailAddress` instead.
 */
const CUSTOMER_FRAGMENT = `
fragment CustomerFields on Customer {
  id
  displayName
  firstName
  lastName
  state
  note
  tags
  createdAt
  updatedAt
  numberOfOrders
  taxExempt
  verifiedEmail
  amountSpent { amount currencyCode }
  defaultEmailAddress { emailAddress marketingState }
  defaultPhoneNumber { phoneNumber }
}`;

const LIST_QUERY = `
query CustomersList($first: Int, $after: String, $query: String) {
  customers(first: $first, after: $after, query: $query) {
    edges { node { ...CustomerFields } cursor }
    pageInfo { hasNextPage endCursor }
  }
}
${CUSTOMER_FRAGMENT}`;

const GET_QUERY = `
query CustomerGet($id: ID!) {
  customer(id: $id) { ...CustomerFields }
}
${CUSTOMER_FRAGMENT}`;

const CREATE_MUTATION = `
mutation CustomerCreate($input: CustomerInput!) {
  customerCreate(input: $input) {
    customer { ...CustomerFields }
    userErrors { field message }
  }
}
${CUSTOMER_FRAGMENT}`;

const UPDATE_MUTATION = `
mutation CustomerUpdate($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer { ...CustomerFields }
    userErrors { field message }
  }
}
${CUSTOMER_FRAGMENT}`;

export const list = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['customersList'],
): Promise<ShopifyEndpointOutputs['customersList']> =>
	call(
		ctx,
		{
			event: 'customers.list',
			input: Inputs.customersList,
			output: Outputs.customersList,
		},
		input,
		({ first, after, query }) => ({
			query: LIST_QUERY,
			variables: { first: first ?? DEFAULT_PAGE_SIZE, after, query },
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.customers.edges.length }) },
	);

export const get = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['customersGet'],
): Promise<ShopifyEndpointOutputs['customersGet']> =>
	call(
		ctx,
		{
			event: 'customers.get',
			input: Inputs.customersGet,
			output: Outputs.customersGet,
		},
		input,
		({ id }) => ({ query: GET_QUERY, variables: { id }, replaySafe: true }),
	);

export const create = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['customersCreate'],
): Promise<ShopifyEndpointOutputs['customersCreate']> =>
	call(
		ctx,
		{
			event: 'customers.create',
			input: Inputs.customersCreate,
			output: Outputs.customersCreate,
			mutation: true,
		},
		input,
		(customer) => ({
			query: CREATE_MUTATION,
			variables: { input: customer },
			payloadKey: 'customerCreate',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as { customerCreate: { customer?: unknown } };
				return { customer: payload.customerCreate.customer };
			},
			log: (_, result) => ({ customerId: result.customer.id }),
		},
	);

export const update = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['customersUpdate'],
): Promise<ShopifyEndpointOutputs['customersUpdate']> =>
	call(
		ctx,
		{
			event: 'customers.update',
			input: Inputs.customersUpdate,
			output: Outputs.customersUpdate,
			mutation: true,
		},
		input,
		(customer) => ({
			query: UPDATE_MUTATION,
			variables: { input: customer },
			payloadKey: 'customerUpdate',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as { customerUpdate: { customer?: unknown } };
				return { customer: payload.customerUpdate.customer };
			},
			log: (_, result) => ({ customerId: result.customer.id }),
		},
	);
