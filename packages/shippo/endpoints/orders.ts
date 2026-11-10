import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { bracketList, call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const list: ShippoEndpoints['ordersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.list',
			input: Inputs.ordersList,
			output: Outputs.ordersList,
		},
		input,
		({
			page,
			results,
			order_status,
			shop_app,
			placed_at_gte,
			placed_at_lte,
			shippo_account_id,
		}) => ({
			method: 'GET',
			path: '/orders',
			query: {
				page,
				results,
				...bracketList('order_status', order_status),
				shop_app,
				placed_at_gte,
				placed_at_lte,
			},
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: ShippoEndpoints['ordersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.get',
			input: Inputs.ordersGet,
			output: Outputs.ordersGet,
		},
		input,
		({ order_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/orders/${segment(order_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			// Orders carry buyer names and addresses; log the id and status only.
			log: ({ order_id }, result) => ({
				orderId: order_id,
				status: result.order_status ?? undefined,
			}),
		},
	);

export const create: ShippoEndpoints['ordersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.create',
			input: Inputs.ordersCreate,
			output: Outputs.ordersCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/orders',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (parsed, result) => ({
				orderId: result.object_id ?? undefined,
				orderNumber: parsed.order_number,
				status: result.order_status ?? undefined,
			}),
		},
	);
