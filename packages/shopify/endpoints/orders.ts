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

const ORDER_FRAGMENT = `
fragment OrderFields on Order {
  id
  name
  createdAt
  updatedAt
  processedAt
  cancelledAt
  closedAt
  email
  phone
  note
  tags
  currencyCode
  displayFinancialStatus
  displayFulfillmentStatus
  cancelReason
  totalPriceSet { shopMoney { amount currencyCode } presentmentMoney { amount currencyCode } }
  totalTaxSet { shopMoney { amount currencyCode } }
  subtotalPriceSet { shopMoney { amount currencyCode } }
  totalDiscountsSet { shopMoney { amount currencyCode } }
  customer {
    id
    displayName
    defaultEmailAddress { emailAddress }
  }
  lineItems(first: 20) {
    edges {
      node {
        id
        title
        quantity
        sku
        variant { id }
        originalUnitPriceSet { shopMoney { amount currencyCode } }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

const LIST_QUERY = `
query OrdersList($first: Int, $after: String, $query: String, $sortKey: OrderSortKeys, $reverse: Boolean) {
  orders(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
    edges { node { ...OrderFields } cursor }
    pageInfo { hasNextPage endCursor }
  }
}
${ORDER_FRAGMENT}`;

const GET_QUERY = `
query OrderGet($id: ID!) {
  order(id: $id) { ...OrderFields }
}
${ORDER_FRAGMENT}`;

const CANCEL_MUTATION = `
mutation OrderCancel($orderId: ID!, $reason: OrderCancelReason!, $restock: Boolean!, $notifyCustomer: Boolean!, $refundOriginalPayment: Boolean!) {
  orderCancel(orderId: $orderId, reason: $reason, restock: $restock, notifyCustomer: $notifyCustomer, refundMethod: { originalPaymentMethodsRefund: $refundOriginalPayment }) {
    order { ...OrderFields }
    userErrors { field message }
  }
}
${ORDER_FRAGMENT}`;

const MARK_AS_PAID_MUTATION = `
mutation OrderMarkAsPaid($input: OrderMarkAsPaidInput!) {
  orderMarkAsPaid(input: $input) {
    order { ...OrderFields }
    userErrors { field message }
  }
}
${ORDER_FRAGMENT}`;

const CLOSE_MUTATION = `
mutation OrderClose($input: OrderCloseInput!) {
  orderClose(input: $input) {
    order { ...OrderFields }
    userErrors { field message }
  }
}
${ORDER_FRAGMENT}`;

export const list = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['ordersList'],
): Promise<ShopifyEndpointOutputs['ordersList']> =>
	call(
		ctx,
		{
			event: 'orders.list',
			input: Inputs.ordersList,
			output: Outputs.ordersList,
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
		{ log: (_, result) => ({ count: result.orders.edges.length }) },
	);

export const get = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['ordersGet'],
): Promise<ShopifyEndpointOutputs['ordersGet']> =>
	call(
		ctx,
		{ event: 'orders.get', input: Inputs.ordersGet, output: Outputs.ordersGet },
		input,
		({ id }) => ({ query: GET_QUERY, variables: { id }, replaySafe: true }),
	);

// `orderCancel` cancels the order but does not move money unless it is asked
// to. The deprecated `refund` flag defaulted to refunding the original payment
// method, so the replacement `refundMethod` is sent explicitly as false.
const CANCEL_DEFAULTS = {
	reason: 'CUSTOMER',
	restock: false,
	notifyCustomer: false,
	refundOriginalPayment: false,
} as const;

export const cancel = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['ordersCancel'],
): Promise<ShopifyEndpointOutputs['ordersCancel']> =>
	call(
		ctx,
		{
			event: 'orders.cancel',
			input: Inputs.ordersCancel,
			output: Outputs.ordersCancel,
			mutation: true,
		},
		input,
		({ id, reason, restock, notifyCustomer }) => ({
			query: CANCEL_MUTATION,
			variables: {
				orderId: id,
				reason: reason ?? CANCEL_DEFAULTS.reason,
				restock: restock ?? CANCEL_DEFAULTS.restock,
				notifyCustomer: notifyCustomer ?? CANCEL_DEFAULTS.notifyCustomer,
				refundOriginalPayment: CANCEL_DEFAULTS.refundOriginalPayment,
			},
			payloadKey: 'orderCancel',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as { orderCancel: { order?: unknown } };
				return { order: payload.orderCancel.order };
			},
			log: (_, result) => ({ orderId: result.order.id }),
		},
	);

export const markAsPaid = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['ordersMarkAsPaid'],
): Promise<ShopifyEndpointOutputs['ordersMarkAsPaid']> =>
	call(
		ctx,
		{
			event: 'orders.markAsPaid',
			input: Inputs.ordersMarkAsPaid,
			output: Outputs.ordersMarkAsPaid,
			mutation: true,
		},
		input,
		({ id }) => ({
			query: MARK_AS_PAID_MUTATION,
			variables: { input: { id } },
			payloadKey: 'orderMarkAsPaid',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as { orderMarkAsPaid: { order?: unknown } };
				return { order: payload.orderMarkAsPaid.order };
			},
			log: (_, result) => ({ orderId: result.order.id }),
		},
	);

export const close = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['ordersClose'],
): Promise<ShopifyEndpointOutputs['ordersClose']> =>
	call(
		ctx,
		{
			event: 'orders.close',
			input: Inputs.ordersClose,
			output: Outputs.ordersClose,
			mutation: true,
		},
		input,
		({ id }) => ({
			query: CLOSE_MUTATION,
			variables: { input: { id } },
			payloadKey: 'orderClose',
		}),
		{
			// unknown: the mutation payload's data half; the output schema
			// validates it after this narrowing.
			shape: (raw) => {
				const payload = raw as { orderClose: { order?: unknown } };
				return { order: payload.orderClose.order };
			},
			log: (_, result) => ({ orderId: result.order.id }),
		},
	);
