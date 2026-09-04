import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { VeriphoneEndpoints } from '..';
import { makeVeriphoneRequest } from '../client';
import { CoverageResponseSchema } from './types';

/**
 * List countries where Current (`mode=current`) lookups are available.
 *
 * API: GET /v3/coverage/current (public, unauthenticated per docs, but the
 * plugin still sends the configured API key when present — the provider
 * accepts authenticated calls to this endpoint).
 * Docs: https://veriphone.io/docs/v3#v3coveragecurrent
 */
export const get: VeriphoneEndpoints['coverage'] = async (ctx, _input) => {
	if (!ctx.key) {
		throw new AuthMissingError('veriphone', 'api_key');
	}

	const response = await makeVeriphoneRequest<unknown>(
		'v3/coverage/current',
		ctx.key,
	);

	const parsed = CoverageResponseSchema.parse(response);

	await logEventFromContext(ctx, 'veriphone.coverage', {}, 'completed');

	return parsed;
};
