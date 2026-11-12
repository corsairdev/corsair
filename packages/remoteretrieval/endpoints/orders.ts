import type { RemoteRetrievalEndpoints } from '..';
import type { RemoteRetrievalQuery } from '../client';
import { call } from './call';
import {
	RemoteRetrievalEndpointInputSchemas as Inputs,
	RemoteRetrievalEndpointOutputSchemas as Outputs,
} from './types';

/** Checks that the key works and reports the account it belongs to. */
export const validate: RemoteRetrievalEndpoints['validate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'validate',
			input: Inputs.validate,
			output: Outputs.validate,
		},
		input,
		() => ({ method: 'GET', path: '/validate/user', replayable: true }),
		{
			log: (_, result) => ({
				email: result.email ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

/**
 * Creates one or more orders.
 *
 * This books a real logistics job: a box ships to a named employee at a home
 * address. Every order in the array is therefore validated in full before the
 * request goes out, including the two cross-field rules the API enforces —
 * `return_add_srv: 2` needs the new employee, and `ins_active: 1` needs an amount.
 */
export const create: RemoteRetrievalEndpoints['ordersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.create',
			input: Inputs.ordersCreate,
			output: Outputs.ordersCreate,
		},
		input,
		({ orders }) => ({
			method: 'POST',
			path: '/create-order',
			body: { orders },
			// A replay books the whole batch again, and the API offers no idempotency
			// key, so this is never resent.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				orders: parsed.orders.length,
				order: result.order ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

/**
 * Orders whose payment has not completed. They are on hold until it does, so this
 * is the queue to chase rather than a list of ready jobs.
 */
export const pending: RemoteRetrievalEndpoints['pendingOrders'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'orders.pending',
			input: Inputs.pendingOrders,
			output: Outputs.pendingOrders,
		},
		input,
		({ page }) => ({
			method: 'GET',
			path: '/pending-orders',
			query: { page },
			replayable: true,
		}),
		{
			log: (_, result) => ({ orders: result.length }),
		},
	);

/** Orders whose payment has completed and which are ready to process. */
export const newOrders: RemoteRetrievalEndpoints['newOrders'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.new',
			input: Inputs.newOrders,
			output: Outputs.newOrders,
		},
		input,
		({ page }) => ({
			method: 'GET',
			path: '/new-orders',
			query: { page },
			replayable: true,
		}),
		{
			log: (_, result) => ({ orders: result.length }),
		},
	);

/**
 * Orders whose return leg has started but whose device has not arrived yet. The
 * `shipments.send_status` and `return_status` fields are the ones that move.
 */
export const inprogress: RemoteRetrievalEndpoints['inprogressOrders'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'orders.inprogress',
			input: Inputs.inprogressOrders,
			output: Outputs.inprogressOrders,
		},
		input,
		({ page }) => ({
			method: 'GET',
			path: '/inprogress-orders',
			query: { page },
			replayable: true,
		}),
		{
			log: (_, result) => ({ orders: result.length }),
		},
	);

/**
 * The paging values for `/orders`.
 *
 * The response's `next` is a full link such as `…/orders?cursor=abc`, and callers
 * pass it back as `cursor`. Sending that link as the cursor value would ask for
 * `?cursor=https%3A…`, so a link is read for its query values instead; the request
 * still goes to the fixed API host. A bare cursor value is sent as it is.
 */
function ordersPageQuery(cursor: string | undefined): RemoteRetrievalQuery {
	if (cursor === undefined) return {};
	if (!/^https?:\/\//i.test(cursor)) return { cursor };
	try {
		return Object.fromEntries(new URL(cursor).searchParams);
	} catch {
		return { cursor };
	}
}

/**
 * Every order with its payment and shipping status.
 *
 * This is the only list route with a pagination envelope, and the docs say to page
 * by the response's own `next` link rather than a page number.
 */
export const list: RemoteRetrievalEndpoints['ordersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.list',
			input: Inputs.ordersList,
			output: Outputs.ordersList,
		},
		input,
		({ cursor }) => ({
			method: 'GET',
			path: '/orders',
			query: ordersPageQuery(cursor),
			replayable: true,
		}),
		{
			log: (_, result) => ({
				orders: result.results?.length ?? 0,
				hasNext: result.next !== null && result.next !== undefined,
			}),
		},
	);

/**
 * One order's detail.
 *
 * The route is `device_returns` and takes the id as the `oid` query parameter, not
 * as a path segment, so it reads a little unlike the rest.
 */
export const get: RemoteRetrievalEndpoints['orderGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.get',
			input: Inputs.orderGet,
			output: Outputs.orderGet,
		},
		input,
		({ oid }) => ({
			method: 'GET',
			path: '/device_returns',
			query: { oid },
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				oid: parsed.oid,
				found: result.length > 0,
			}),
		},
	);

/** The company record the key belongs to: its name, address and creation date. */
export const company: RemoteRetrievalEndpoints['companyGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'company.get',
			input: Inputs.companyGet,
			output: Outputs.companyGet,
		},
		input,
		() => ({ method: 'GET', path: '/company-details', replayable: true }),
		{
			log: (_, result) => ({ company: result.company_name ?? undefined }),
		},
	);

/**
 * The live per-device prices.
 *
 * Worth reading before a bulk create: it is what an order will cost, and it is the
 * only place `Monitor_27` is explained as the 24-to-27-inch band.
 */
export const prices: RemoteRetrievalEndpoints['prices'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'prices',
			input: Inputs.prices,
			output: Outputs.prices,
		},
		input,
		() => ({ method: 'GET', path: '/get-device-prices', replayable: true }),
		{
			log: (_, result) => ({ devices: result.length }),
		},
	);
