import { logEventFromContext } from 'corsair/core';
import type { TokenMetricsEndpoints } from '..';
import { makeTokenMetricsRequest } from '../client';
import { ListTokensInputSchema, TokensResponseSchema } from './types';

export const list: TokenMetricsEndpoints['tokensList'] = async (
	ctx,
	rawInput,
) => {
	const input = ListTokensInputSchema.parse(rawInput);
	const response = TokensResponseSchema.parse(
		await makeTokenMetricsRequest<unknown>('/tokens', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'tokenmetrics.tokens.list',
		{ count: response.data.length },
		'completed',
	);
	return response;
};
