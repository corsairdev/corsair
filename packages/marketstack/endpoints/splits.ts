import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { joinSymbols, makeMarketstackRequest } from '../client';
import type { MarketstackEndpoints } from '../index';
import type { GetSplitsResponse } from './types';
import { GetSplitsInputSchema, GetSplitsResponseSchema } from './types';

export const getSplits: MarketstackEndpoints['getSplits'] = async (
	ctx,
	input,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('marketstack', 'api_key');
	}

	const { symbols, dateFrom, dateTo, limit, offset } =
		GetSplitsInputSchema.parse(input);

	const rawResponse = await makeMarketstackRequest<GetSplitsResponse>(
		'splits',
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

	const response = GetSplitsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'marketstack.splits.get',
		{ symbols, dateFrom, dateTo },
		'completed',
	);

	return response;
};
