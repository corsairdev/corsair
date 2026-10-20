import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { TURSO_API_BASE, tursoFetchJson } from '../client';
import type { TursoEndpoints } from '../index';
import {
	ValidateApiTokenInputSchema,
	ValidateApiTokenResponseSchema,
} from './types';

/**
 * Validates the configured API token and reports when it expires.
 *
 * API: GET https://api.turso.tech/v1/auth/validate
 * Docs: https://docs.turso.tech/api-reference/tokens/validate
 *
 * `exp` is unix epoch seconds, or -1 when the token never expires.
 *
 * @param ctx - Corsair plugin context carrying the resolved API token.
 * @param rawInput - No parameters; validated for shape only.
 * @returns The token's expiry.
 */
export const validate: TursoEndpoints['validateApiToken'] = async (
	ctx,
	rawInput,
) => {
	if (!ctx.key) {
		throw new AuthMissingError('turso', 'api_key');
	}

	ValidateApiTokenInputSchema.parse(rawInput ?? {});

	const raw = await tursoFetchJson(`${TURSO_API_BASE}/v1/auth/validate`, {
		apiKey: ctx.key,
	});
	const response = ValidateApiTokenResponseSchema.parse(raw);

	// Only the expiry is logged — never the token itself.
	await logEventFromContext(
		ctx,
		'turso.tokens.validate',
		{ exp: response.exp },
		'completed',
	);

	return response;
};
