import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackEndpoints } from '../index';
import type { ListExchangesResponse } from './types';
import {
	GetExchangeInputSchema,
	GetExchangeWireResponseSchema,
	ListExchangesInputSchema,
	ListExchangesResponseSchema,
} from './types';

export const getExchange: MarketstackEndpoints['getExchange'] = async (
	ctx,
	input,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { mic } = GetExchangeInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<unknown>(
		`exchanges/${encodeURIComponent(mic)}`,
		ctx.key,
	);

	const response = GetExchangeWireResponseSchema.parse(rawResponse).data;

	await logEventFromContext(
		ctx,
		'marketstack.exchanges.get',
		{ mic },
		'completed',
	);

	return response;
};

export const listExchanges: MarketstackEndpoints['listExchanges'] = async (
	ctx,
	input,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { search, limit, offset } = ListExchangesInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<ListExchangesResponse>(
		'exchanges',
		ctx.key,
		{
			query: { search, limit, offset },
		},
	);

	const response = ListExchangesResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'marketstack.exchanges.list',
		{ search },
		'completed',
	);

	return response;
};
