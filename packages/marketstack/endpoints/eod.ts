import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { joinSymbols, makeMarketstackRequest } from '../client';
import type { MarketstackEndpoints } from '../index';
import type { GetEodResponse } from './types';
import { GetEodInputSchema, GetEodResponseSchema } from './types';

export const getEod: MarketstackEndpoints['getEod'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { symbols, exchange, sort, dateFrom, dateTo, limit, offset } =
		GetEodInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<GetEodResponse>(
		'eod',
		ctx.key,
		{
			query: {
				symbols: joinSymbols(symbols),
				exchange,
				sort,
				date_from: dateFrom,
				date_to: dateTo,
				limit,
				offset,
			},
		},
	);

	const response = GetEodResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'marketstack.eod.get',
		{ symbols, exchange, dateFrom, dateTo },
		'completed',
	);

	return response;
};
