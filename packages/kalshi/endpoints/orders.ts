import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { KalshiEndpoints } from '..';
import { makeKalshiRequest } from '../client';
import {
	KalshiEndpointInputSchemas,
	KalshiEndpointOutputSchemas,
} from './types';

export const list: KalshiEndpoints['ordersList'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.ordersList.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/portfolio/orders', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.orders.list',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.ordersList.parse(response);
};

export const get: KalshiEndpoints['ordersGet'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.ordersGet.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest(
		`/portfolio/orders/${encodeURIComponent(parsed.order_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'kalshi.orders.get',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.ordersGet.parse(response);
};

export const create: KalshiEndpoints['ordersCreate'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.ordersCreate.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest(
		'/portfolio/events/orders',
		ctx.key,
		{
			method: 'POST',
			body: parsed,
		},
	);

	await logEventFromContext(
		ctx,
		'kalshi.orders.create',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.ordersCreate.parse(response);
};

export const amend: KalshiEndpoints['ordersAmend'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.ordersAmend.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const { order_id: orderId, subaccount, ...body } = parsed;
	const response = await makeKalshiRequest(
		`/portfolio/events/orders/${encodeURIComponent(orderId)}/amend`,
		ctx.key,
		{ method: 'POST', body, query: { subaccount } },
	);

	await logEventFromContext(
		ctx,
		'kalshi.orders.amend',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.ordersAmend.parse(response);
};

export const cancel: KalshiEndpoints['ordersCancel'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.ordersCancel.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest(
		`/portfolio/events/orders/${encodeURIComponent(parsed.order_id)}`,
		ctx.key,
		{
			method: 'DELETE',
			query: {
				subaccount: parsed.subaccount,
				market_ticker: parsed.market_ticker,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'kalshi.orders.cancel',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.ordersCancel.parse(response);
};

export const batchCreate: KalshiEndpoints['ordersBatchCreate'] = async (
	ctx,
	input,
) => {
	const parsed = KalshiEndpointInputSchemas.ordersBatchCreate.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest(
		'/portfolio/events/orders/batched',
		ctx.key,
		{ method: 'POST', body: parsed },
	);

	await logEventFromContext(
		ctx,
		'kalshi.orders.batchCreate',
		{ count: parsed.orders.length },
		'completed',
	);
	return KalshiEndpointOutputSchemas.ordersBatchCreate.parse(response);
};

export const Orders = {
	list,
	get,
	create,
	amend,
	cancel,
	batchCreate,
} as const;
