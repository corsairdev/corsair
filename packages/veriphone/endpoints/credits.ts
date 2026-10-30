import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeVeriphoneRequest } from '../client';
import type { CreditsInput, CreditsResponse } from './types';
import { CreditsInputSchema, CreditsResponseSchema } from './types';
import type { VeriphoneEndpointContext } from './verify-phone-number';

/**
 * Return the account balance and usage, split by lookup mode.
 *
 * API: GET /v3/credits
 * Docs: https://veriphone.io/docs/v3#v3credits
 */
export async function getCredits(
	ctx: VeriphoneEndpointContext,
	input: CreditsInput,
): Promise<CreditsResponse> {
	if (!ctx.key) {
		throw new AuthMissingError('veriphone', 'api_key');
	}

	CreditsInputSchema.parse(input);

	// Provider returns unvalidated JSON; validated by the schema below.
	const response = await makeVeriphoneRequest<unknown>('v3/credits', ctx.key);

	const parsed = CreditsResponseSchema.parse(response);

	await logEventFromContext(ctx, 'veriphone.credits', {}, 'completed');

	return parsed;
}
