import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { VeriphoneEndpoints } from '..';
import { makeVeriphoneRequest } from '../client';
import { CreditsResponseSchema } from './types';

/**
 * Return the account balance and usage, split by lookup mode.
 *
 * API: GET /v3/credits
 * Docs: https://veriphone.io/docs/v3#v3credits
 */
export const get: VeriphoneEndpoints['credits'] = async (ctx, _input) => {
	if (!ctx.key) {
		throw new AuthMissingError('veriphone', 'api_key');
	}

	const response = await makeVeriphoneRequest<unknown>('v3/credits', ctx.key);

	const parsed = CreditsResponseSchema.parse(response);

	await logEventFromContext(ctx, 'veriphone.credits', {}, 'completed');

	return parsed;
};
