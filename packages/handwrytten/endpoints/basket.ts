import { logEventFromContext } from 'corsair/core';
import type { HandwryttenEndpoints } from '..';
import { makeHandwryttenRequest } from '../client';
import type {
	BasketClearResponse,
	BasketCountResponse,
	BasketSendResponse,
} from './types';
import {
	HandwryttenEndpointInputSchemas,
	HandwryttenEndpointOutputSchemas,
} from './types';

export const count: HandwryttenEndpoints['basket.count'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['basket.count'].parse(input);
	const response = await makeHandwryttenRequest<BasketCountResponse>(
		'/basket/count',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['basket.count'].parse(response);
	await logEventFromContext(
		ctx,
		'handwrytten.basket.count',
		{ count: parsed.count ?? 0 },
		'completed',
	);
	return parsed;
};

export const clear: HandwryttenEndpoints['basket.clear'] = async (
	ctx,
	input,
) => {
	HandwryttenEndpointInputSchemas['basket.clear'].parse(input);
	const response = await makeHandwryttenRequest<BasketClearResponse>(
		'/basket/clear',
		ctx.key,
		{
			method: 'POST',
			body: {},
		},
	);
	const parsed =
		HandwryttenEndpointOutputSchemas['basket.clear'].parse(response);
	await logEventFromContext(ctx, 'handwrytten.basket.clear', {}, 'completed');
	return parsed;
};

export const send: HandwryttenEndpoints['basket.send'] = async (ctx, input) => {
	const parsedInput =
		HandwryttenEndpointInputSchemas['basket.send'].parse(input);
	const response = await makeHandwryttenRequest<BasketSendResponse>(
		'/basket/send',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed = HandwryttenEndpointOutputSchemas['basket.send'].parse(response);
	await logEventFromContext(ctx, 'handwrytten.basket.send', {}, 'completed');
	return parsed;
};
