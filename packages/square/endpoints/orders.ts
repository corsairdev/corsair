import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/orders/calculate (CalculateOrder). */
export const calculate: SquareEndpoints['ordersCalculate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.ordersCalculate.parse(rawInput);
	return callSquare(ctx, '/v2/orders/calculate', {
		method: 'POST',
		readOnly: true,
		body: input,
		output: SquareEndpointOutputSchemas.ordersCalculate,
		event: 'orders.calculate',
	});
};

/** GET /v2/orders/{order_id} (RetrieveOrder). */
export const get: SquareEndpoints['ordersGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.ordersGet.parse(rawInput);
	return callSquare(ctx, '/v2/orders/{order_id}', {
		path: { order_id: input.order_id },
		output: SquareEndpointOutputSchemas.ordersGet,
		event: 'orders.get',
		logged: { order_id: input.order_id },
	});
};

/** POST /v2/orders/search (SearchOrders). */
export const search: SquareEndpoints['ordersSearch'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.ordersSearch.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/orders/search', {
		method: 'POST',
		readOnly: true,
		body: input,
		output: SquareEndpointOutputSchemas.ordersSearch,
		event: 'orders.search',
	});
};

/** PUT /v2/orders/{order_id} (UpdateOrder). */
export const update: SquareEndpoints['ordersUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.ordersUpdate.parse(rawInput);
	const { order_id, ...body } = input;
	return callSquare(ctx, '/v2/orders/{order_id}', {
		method: 'PUT',
		body,
		path: { order_id },
		output: SquareEndpointOutputSchemas.ordersUpdate,
		event: 'orders.update',
		logged: { order_id },
	});
};

/** POST /v2/orders (CreateOrder). */
export const create: SquareEndpoints['ordersCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.ordersCreate.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/orders', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.ordersCreate,
		event: 'orders.create',
	});
};

/** POST /v2/orders/{order_id}/pay (PayOrder). */
export const pay: SquareEndpoints['ordersPay'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.ordersPay.parse(rawInput);
	const { order_id, ...body } = input;
	return callSquare(ctx, '/v2/orders/{order_id}/pay', {
		method: 'POST',
		body,
		path: { order_id },
		output: SquareEndpointOutputSchemas.ordersPay,
		event: 'orders.pay',
		logged: { order_id },
	});
};
