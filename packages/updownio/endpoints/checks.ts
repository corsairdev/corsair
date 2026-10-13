import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeUpdownIORequest } from '../client';
import type { UpdownIOEndpoints } from '../index';
import { ChecksResponseSchema, ListChecksInputSchema } from './types';

export const list: UpdownIOEndpoints['checksList'] = async (ctx, rawInput) => {
	ListChecksInputSchema.parse(rawInput);
	if (!ctx.key.trim()) throw new AuthMissingError('updownio', 'api_key');
	const response = ChecksResponseSchema.parse(
		await makeUpdownIORequest('/checks', ctx.key, {
			requiresAuth: true,
		}),
	);
	if (ctx.db.checks) {
		try {
			for (const check of response) {
				await ctx.db.checks.upsertByEntityId(check.token, check);
			}
		} catch (error) {
			console.warn('Failed to save checks to database:', error);
		}
	}
	await logEventFromContext(
		ctx,
		'updownio.checks.list',
		{ count: response.length },
		'completed',
	);
	return response;
};
