import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	OrdersAddToBasketResponse,
	OrdersCancelResponse,
	OrdersGetResponse,
	OrdersSendSingleResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const sendSingle: HandwryttenEndpoints['orders.sendSingle'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['orders.sendSingle'].parse(input);
	const response = await makeHandwryttenRequest<OrdersSendSingleResponse>(
		'/orders/singleStepOrder',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['orders.sendSingle'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.orders.sendSingle',
		{ orderId: parsed.order_id, cardId: parsedInput.card_id },
		'completed',
	);
	return parsed;
};

export const addToBasket: HandwryttenEndpoints['orders.addToBasket'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['orders.addToBasket'].parse(input);
	const response = await makeHandwryttenRequest<OrdersAddToBasketResponse>(
		'/orders/placeBasket',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['orders.addToBasket'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.orders.addToBasket',
		{ orderId: parsed.order_id, cardId: parsedInput.card_id },
		'completed',
	);
	return parsed;
};

export const get: HandwryttenEndpoints['orders.get'] = async (ctx, input) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['orders.get'].parse(input);
	const response = await makeHandwryttenRequest<OrdersGetResponse>(
		'/orders/details',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = HandwryttenEndpointOutputSchemas['orders.get'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.orders.get',
		{ orderId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const cancel: HandwryttenEndpoints['orders.cancel'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['orders.cancel'].parse(input);
	const response = await makeHandwryttenRequest<OrdersCancelResponse>(
		'/orders/cancel',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['orders.cancel'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.orders.cancel',
		{ orderId: parsedInput.order_id },
		'completed',
	);
	return parsed;
};
