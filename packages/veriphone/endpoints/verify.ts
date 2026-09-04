import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { VeriphoneEndpoints } from '..';
import { makeVeriphoneRequest } from '../client';
import { VerifyResponseSchema } from './types';

/**
 * Verify a phone number and retrieve carrier and country information.
 *
 * API: GET /v3/verify
 * Docs: https://veriphone.io/docs/v3#verify
 *
 * Note: `record: true` saves the result to the account verification
 * history on the provider side, so this endpoint is classified with
 * `riskLevel: 'write'` even though verification itself is a lookup.
 */
export const verify: VeriphoneEndpoints['verify'] = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('veriphone', 'api_key');
	}

	const response = await makeVeriphoneRequest<unknown>('v3/verify', ctx.key, {
		query: {
			phone: input.phone,
			default_country: input.default_country,
			mode: input.mode,
			record: input.record,
		},
	});

	const parsed = VerifyResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'veriphone.verify',
		{ mode: input.mode },
		'completed',
	);

	return parsed;
};
