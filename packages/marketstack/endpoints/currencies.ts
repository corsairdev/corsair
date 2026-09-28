import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeMarketstackRequest } from '../client';
import type { MarketstackEndpoints } from '../index';
import type { ListCurrenciesResponse } from './types';
import {
	ListCurrenciesInputSchema,
	ListCurrenciesResponseSchema,
} from './types';

export const listCurrencies: MarketstackEndpoints['listCurrencies'] = async (
	ctx,
	input,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { limit, offset } = ListCurrenciesInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<ListCurrenciesResponse>(
		'currencies',
		ctx.key,
		{
			query: { limit, offset },
		},
	);

	const response = ListCurrenciesResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'marketstack.currencies.list',
		{},
		'completed',
	);

	return response;
};
