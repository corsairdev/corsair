import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { isProoflyFailure, prooflyFailure, prooflyGet } from '../client';
import type { ProoflyContext } from '../context';
import type { ListActivityInput, ListActivityResponse } from './types';
import { ListActivityInputSchema, ListActivityResponseSchema } from './types';

export const listActivity: CorsairEndpoint<
	ProoflyContext,
	ListActivityInput,
	ListActivityResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('proofly', 'api_key');
	}
	ListActivityInputSchema.parse(input);
	const body = await prooflyGet<unknown>(ctx.key, '/activity');
	if (isProoflyFailure(body)) throw prooflyFailure('/activity', body);
	const result = ListActivityResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'proofly.activity.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};
