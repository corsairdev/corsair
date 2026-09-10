import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeVeriphoneRequest } from '../client';
import type { CoverageInput, CoverageResponse } from './types';
import { CoverageInputSchema, CoverageResponseSchema } from './types';
import type { VeriphoneEndpointContext } from './verify-phone-number';

/**
 * List countries where Current (`mode=current`) lookups are available.
 *
 * API: GET /v3/coverage/current
 * Docs: https://veriphone.io/docs/v3#v3coveragecurrent
 * Public endpoint per docs, but the plugin sends the configured API key
 * when present — the provider accepts authenticated calls to it.
 */
export async function getCoverage(
	ctx: VeriphoneEndpointContext,
	input: CoverageInput,
): Promise<CoverageResponse> {
	if (!ctx.key) {
		throw new AuthMissingError('veriphone', 'api_key');
	}

	CoverageInputSchema.parse(input);

	// Provider returns unvalidated JSON; validated by the schema below.
	const response = await makeVeriphoneRequest<unknown>(
		'v3/coverage/current',
		ctx.key,
	);

	const parsed = CoverageResponseSchema.parse(response);

	await logEventFromContext(ctx, 'veriphone.coverage', {}, 'completed');

	return parsed;
}
