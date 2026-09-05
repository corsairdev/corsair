import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { VeriphoneEndpoints } from '..';
import { makeVeriphoneRequest } from '../client';
import { VerifyInputSchema, VerifyResponseSchema } from './types';

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

	// Reject invalid input before any provider call (a verification costs
	// credits, so malformed phone numbers must never reach the API).
	const parsedInput = VerifyInputSchema.parse(input);

	// `unknown` because the provider returns unvalidated JSON; it is narrowed
	// by VerifyResponseSchema.parse below before crossing the endpoint boundary.
	const response = await makeVeriphoneRequest<unknown>('v3/verify', ctx.key, {
		query: {
			phone: parsedInput.phone,
			default_country: parsedInput.default_country,
			mode: parsedInput.mode,
			record: parsedInput.record,
		},
	});

	const parsed = VerifyResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'veriphone.verify',
		{ mode: parsedInput.mode },
		'completed',
	);

	return parsed;
};
