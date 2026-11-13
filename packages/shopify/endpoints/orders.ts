import type {
	ShopifyContext,
	ShopifyEndpointInputs,
	ShopifyEndpointOutputs,
} from '..';
import { ShopifyAPIError } from '../client';
import { call, ShopifyUserError } from './call';
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
query OrderGet($id: ID!, $lineItemsFirst: Int, $lineItemsAfter: String) {
  order(id: $id) {
    ...OrderFields
    lineItems(first: $lineItemsFirst, after: $lineItemsAfter) {
      edges { node { id title quantity sku variant { id } originalUnitPriceSet { shopMoney { amount currencyCode } } } cursor }
      pageInfo { hasNextPage endCursor }
    }
  }
}
${ORDER_FRAGMENT}`;

// An order with more line items than one page needs a way to read the rest, so
// the page is addressable on its own and `orders.get` can ask for a specific
// page of them.
const LINE_ITEMS_QUERY = `
query OrderLineItems($id: ID!, $first: Int, $after: String) {
  order(id: $id) {
    id
    lineItems(first: $first, after: $after) {
      edges {
        node {
          id
          title
          quantity
          sku
          variant { id }
          originalUnitPriceSet { shopMoney { amount currencyCode } }
        }
        cursor
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;

// `OrderCancelPayload` has no `order` field in 2026-10: cancellation is a job.
// The payload carries `job` and `jobResult`, and the order arrives inside
// `jobResult` once the job finishes. Selecting `order` here fails validation,
// which is what the live schema reports.
const CANCEL_MUTATION = `
mutation OrderCancel($orderId: ID!, $reason: OrderCancelReason!, $restock: Boolean!, $notifyCustomer: Boolean!, $refundOriginalPayment: Boolean!) {
  orderCancel(orderId: $orderId, reason: $reason, restock: $restock, notifyCustomer: $notifyCustomer, refundMethod: { originalPaymentMethodsRefund: $refundOriginalPayment }) {
    job { id done }
    jobResult {
      done
      status
      errors { code message }
      order { ...OrderFields }
    }
    orderCancelUserErrors { field message }
  }
}
${ORDER_FRAGMENT}`;

// Reads the cancel job again while it is still running. A job that starts
// asynchronously reports `done: false` on the first response.
const CANCEL_JOB_QUERY = `
query OrderCancelJob($id: ID!) {
  job(id: $id) {
    id
    done
    query {
      ... on OrderCancelJobResult {
        done
        status
        errors { code message }
        order { ...OrderFields }
      }
    }
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
		({ id, lineItemsFirst, lineItemsAfter }) => ({
			query: GET_QUERY,
			variables: {
				id,
				lineItemsFirst: lineItemsFirst ?? 20,
				lineItemsAfter,
			},
			replaySafe: true,
		}),
	);

export const listLineItems = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs['ordersListLineItems'],
): Promise<ShopifyEndpointOutputs['ordersListLineItems']> =>
	call(
		ctx,
		{
			event: 'orders.listLineItems',
			input: Inputs.ordersListLineItems,
			output: Outputs.ordersListLineItems,
		},
		input,
		({ id, first, after }) => ({
			query: LINE_ITEMS_QUERY,
			variables: { id, first: first ?? DEFAULT_PAGE_SIZE, after },
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.lineItems.edges.length }) },
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

/** How often the cancel job is re-read, and for how long in total. */
const CANCEL_POLL_INTERVAL_MS = 500;
const CANCEL_POLL_TIMEOUT_MS = 15_000;

type CancelJobResult = {
	done?: boolean | null;
	status?: string | null;
	errors?: { code?: string; message?: string }[] | null;
	// unknown: the order is validated by the operation's output schema after
	// this job result is unwrapped, so it is not typed here.
	order?: unknown;
};

/**
 * Waits for the cancellation job and returns the cancelled order.
 *
 * Shopify runs `orderCancel` as a job. A job that finishes inline reports its
 * result straight away; one that does not has to be read again until it does.
 * Returning before then would either report a failure as success or hand back
 * no order at all, so the wait is bounded and a job that never finishes is an
 * error rather than a silent null.
 */
async function awaitCancelJob(
	first: CancelJobResult,
	jobId: string | null | undefined,
	run: (
		query: string,
		// unknown: variables differ per operation and are sent as JSON.
		variables: Record<string, unknown>,
		// unknown: the polled response holds one field per operation; only
		// `job` is read here.
	) => Promise<Record<string, unknown>>,
	// unknown: the order is parsed by the operation's output schema.
): Promise<{ order: unknown }> {
	let current = first;
	const deadline = Date.now() + CANCEL_POLL_TIMEOUT_MS;

	while (!current.done) {
		if (!jobId) {
			throw new ShopifyAPIError(
				'orders.cancel started a job but returned no job id to poll',
				{ status: 200 },
			);
		}
		if (Date.now() > deadline) {
			throw new ShopifyAPIError(
				`orders.cancel job ${jobId} did not finish within ${
					CANCEL_POLL_TIMEOUT_MS / 1000
				}s`,
				{ status: 200 },
			);
		}
		await new Promise((resolve) =>
			setTimeout(resolve, CANCEL_POLL_INTERVAL_MS),
		);
		const polled = await run(CANCEL_JOB_QUERY, { id: jobId });
		const job = polled.job as
			| { done?: boolean | null; query?: CancelJobResult | null }
			| null
			| undefined;
		current = job?.query ?? { done: job?.done ?? false };
	}

	if (current.status === 'FAILED' || (current.errors?.length ?? 0) > 0) {
		const detail =
			current.errors?.[0]?.message ?? 'the cancellation job failed';
		// A failed cancel is permanent for this input, so it is raised as a
		// rejection rather than returned as a half-filled order.
		throw new ShopifyUserError(`orders.cancel was rejected: ${detail}`, [
			{ message: detail },
		]);
	}
	if (!current.order) {
		throw new ShopifyAPIError(
			'orders.cancel finished without returning the order',
			{ status: 200 },
		);
	}
	return { order: current.order };
}

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
			after: async (raw, _parsed, run) => {
				// unknown: the mutation payload's data half; each field is read
				// by name below and the output schema validates the result.
				const payload = raw as {
					orderCancel?: {
						job?: { id?: string | null; done?: boolean | null } | null;
						jobResult?: CancelJobResult | null;
					};
				};
				const job = payload.orderCancel?.job;
				return awaitCancelJob(
					payload.orderCancel?.jobResult ?? { done: job?.done ?? false },
					job?.id,
					run,
				);
			},
			log: (_, result) => ({
				orderId: (result.order as { id?: string }).id ?? 'unknown',
			}),
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
