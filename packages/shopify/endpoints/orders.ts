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
  # Customer.displayName is not selected: on an app without customer PII
  # access Shopify returns no data at all for it, losing the whole order. The
  # id and email address are nulled individually instead.
  customer {
    id
    defaultEmailAddress { emailAddress }
  }
}`;

const LIST_QUERY = `
query OrdersList($first: Int, $after: String, $query: String, $sortKey: OrderSortKeys, $reverse: Boolean) {
  orders(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
    edges {
      node {
        ...OrderFields
        # The fragment deliberately omits lineItems: selecting it there as well
        # as in a query's own selection makes GraphQL reject the document for
        # conflicting arguments. Each query selects its page once.
        lineItems(first: 20) {
          edges { node { id title quantity sku variant { id } originalUnitPriceSet { shopMoney { amount currencyCode } } } cursor }
          pageInfo { hasNextPage endCursor }
        }
      }
      cursor
    }
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
// `jobResult`. Selecting `order` at the top level fails validation, which is
// what the live schema reports.
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

/**
 * Reads the order back while its cancellation is still being applied.
 *
 * A cancellation job cannot be polled: `Job.query` is a `QueryRoot`, which
 * GraphQL refuses to spread a job result into, and `QueryRoot.job` exposes no
 * result. What is observable is the order itself. A verified live cancel
 * returns `done: false` with `cancelledAt: null`, and the order carries
 * `cancelledAt` a few seconds later. So the check is the order's own state,
 * which is also what the caller asked about.
 */
const ORDER_STATE_QUERY = `
query OrderCancelState($id: ID!) {
  order(id: $id) {
    ...OrderFields
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
		{
			// The query returns `{ order: { id, lineItems } }`, but the operation's
			// output describes only the connection, so the page is unwrapped here.
			// An order that does not exist is an error rather than an empty page:
			// a blank list would look like an order with no line items.
			shape: (raw) => {
				// unknown: the connection is validated by the output schema after
				// this unwrapping.
				const data = raw as {
					order?: { lineItems?: unknown } | null;
				};
				if (!data.order) {
					throw new ShopifyAPIError(
						'orders.listLineItems found no order with that id',
						{ status: 200 },
					);
				}
				return { lineItems: data.order.lineItems };
			},
			log: (_, result) => ({ count: result.lineItems.edges.length }),
		},
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

/**
 * Waits until the order shows the cancellation, then returns it.
 *
 * The mutation answers before the job finishes: a verified live call returned
 * `done: false` with `cancelledAt: null`, and the order carried `cancelledAt`
 * a few seconds later. The job itself cannot be polled, so the order's own
 * state is what is read, which is also the thing the caller asked about.
 *
 * Only the order read is repeated, never the mutation: it has already run, and
 * sending it again would fail with "order is already cancelled". The wait is
 * bounded, and a cancellation that never lands is an error rather than a silent
 * null.
 */
async function awaitCancellation(
	// unknown: the order is parsed by the operation's output schema.
	started: { order?: unknown; done?: boolean | null; status?: string | null },
	orderId: string,
	run: (
		query: string,
		// unknown: variables differ per operation and are sent as JSON.
		variables: Record<string, unknown>,
	) => Promise<Record<string, unknown>>,
): Promise<{ order: unknown }> {
	const isCancelled = (order: unknown): boolean => {
		const record = order as { cancelledAt?: string | null } | null;
		return typeof record?.cancelledAt === 'string';
	};

	if (started.status === 'FAILED') {
		throw new ShopifyUserError('orders.cancel was rejected', [
			{ message: 'the cancellation job reported failure' },
		]);
	}
	if (isCancelled(started.order)) return { order: started.order };

	const deadline = Date.now() + CANCEL_POLL_TIMEOUT_MS;
	while (Date.now() < deadline) {
		await new Promise((resolve) =>
			setTimeout(resolve, CANCEL_POLL_INTERVAL_MS),
		);
		const polled = await readOrderState(run, orderId);
		const order = (polled.order ?? null) as {
			cancelledAt?: string | null;
		} | null;
		if (order && typeof order.cancelledAt === 'string') {
			return { order };
		}
	}

	// The order exists but never reported a cancellation within the window.
	// Returning it would say the cancel succeeded when it may not have.
	throw new ShopifyAPIError(
		`orders.cancel did not cancel the order within ${
			CANCEL_POLL_TIMEOUT_MS / 1000
		}s; it may still be running`,
		{ status: 200 },
	);
}

/** How many times a throttled order read is retried before giving up. */
const CANCEL_POLL_MAX_ATTEMPTS = 4;

/**
 * Reads the order's cancellation state, retrying only the read on a throttle.
 *
 * The read has no side effect, so repeating it is free; the mutation that
 * started the job is not repeated, because it has already run.
 */
async function readOrderState(
	run: (
		query: string,
		// unknown: variables differ per operation and are sent as JSON.
		variables: Record<string, unknown>,
		// unknown: the response holds one field per operation; only `order` is
		// read here.
	) => Promise<Record<string, unknown>>,
	orderId: string,
): Promise<Record<string, unknown>> {
	// unknown: a rejection reason has no static type; only its message and
	// retryAfter are read before it is rethrown.
	let lastError: unknown;
	for (let attempt = 0; attempt < CANCEL_POLL_MAX_ATTEMPTS; attempt += 1) {
		try {
			return await run(ORDER_STATE_QUERY, { id: orderId });
		} catch (error) {
			// Only a throttle is worth repeating here: the query was refused
			// before running, and the wait is the one Shopify asked for.
			const throttled =
				(error instanceof ShopifyAPIError &&
					(error.code === 'THROTTLED' || error.status === 429)) ||
				(error instanceof Error && /throttl/i.test(error.message));
			if (!throttled) throw error;
			lastError = error;
			const wait =
				error instanceof ShopifyAPIError && error.retryAfter
					? error.retryAfter
					: CANCEL_POLL_INTERVAL_MS;
			await new Promise((resolve) => setTimeout(resolve, wait));
		}
	}
	throw lastError instanceof Error
		? lastError
		: new ShopifyAPIError('orders.cancel state read kept being throttled', {
				status: 429,
			});
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
			after: async (raw, parsed, run) => {
				// unknown: the mutation payload's data half; each field is read
				// by name below and the output schema validates the result.
				const payload = raw as {
					orderCancel?: {
						job?: { id?: string | null; done?: boolean | null } | null;
						jobResult?: {
							done?: boolean | null;
							status?: string | null;
							errors?: { code?: string; message?: string }[] | null;
							// unknown: validated by the output schema downstream.
							order?: unknown;
						} | null;
					};
				};
				const failed = payload.orderCancel?.jobResult?.errors ?? [];
				if (failed.length > 0) {
					const detail = failed[0]?.message ?? 'the cancellation failed';
					throw new ShopifyUserError(`orders.cancel was rejected: ${detail}`, [
						{ message: detail },
					]);
				}
				return awaitCancellation(
					{
						order: payload.orderCancel?.jobResult?.order,
						done: payload.orderCancel?.jobResult?.done,
						status: payload.orderCancel?.jobResult?.status,
					},
					parsed.id,
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
