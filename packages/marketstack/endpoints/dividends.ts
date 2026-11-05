import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { joinSymbols, makeMarketstackRequest } from '../client';
import type { MarketstackEndpoints } from '../index';
import type { GetDividendsResponse } from './types';
import { GetDividendsInputSchema, GetDividendsResponseSchema } from './types';

export const getDividends: MarketstackEndpoints['getDividends'] = async (
	ctx,
	input,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { symbols, dateFrom, dateTo, limit, offset } =
		GetDividendsInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<GetDividendsResponse>(
		'dividends',
		ctx.key,
		{
			query: {
				symbols: joinSymbols(symbols),
				date_from: dateFrom,
				date_to: dateTo,
				limit,
				offset,
			},
		},
	);

	const response = GetDividendsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'marketstack.dividends.get',
		{ symbols, dateFrom, dateTo },
		'completed',
	);

	return response;
};
