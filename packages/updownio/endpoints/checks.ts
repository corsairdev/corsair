import { logEventFromContext } from 'corsair/core';
import { makeUpdownIORequest } from '../client';
import type { UpdownIOEndpoints } from '../index';
import { ChecksResponseSchema, ListChecksInputSchema } from './types';

export const list: UpdownIOEndpoints['checksList'] = async (ctx, rawInput) => {
	ListChecksInputSchema.parse(rawInput);
	const response = ChecksResponseSchema.parse(
		await makeUpdownIORequest<unknown>('/checks', ctx.key, {
			requiresAuth: true,
		}),
	);
	await logEventFromContext(
		ctx,
		'updownio.checks.list',
		{ count: response.length },
		'completed',
	);
	return response;
};
