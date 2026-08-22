import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest, mapPool, UnioneAPIError } from '../client';
import type { UnioneEndpointOutputs } from './types';

/**
 * UniOne publishes no bulk validation method, so a batch is fanned out over
 * `email-validation/single.json`. Two at a time keeps a large list from
 * tripping the per-key rate limit.
 */
const VALIDATION_CONCURRENCY = 2;

type ValidationResult =
	UnioneEndpointOutputs['emailValidateBatch']['results'][number];

export const batch: UnioneEndpoints['emailValidation']['batch'] = async (
	ctx,
	input,
) => {
	// A failure on one address must not discard the addresses that succeeded,
	// so each rejection is recorded in place rather than failing the batch.
	const results = await mapPool<string, ValidationResult>(
		input.emails,
		VALIDATION_CONCURRENCY,
		async (email) => {
			try {
				return await makeUnioneRequest<ValidationResult>(
					'email-validation/single.json',
					ctx.key,
					{ body: { email } },
				);
			} catch (error) {
				return {
					status: 'error',
					email,
					cause:
						error instanceof UnioneAPIError || error instanceof Error
							? error.message
							: 'Unknown validation error',
				};
			}
		},
	);

	const failed = results.filter((result) => result.status === 'error').length;
	await logEventFromContext(
		ctx,
		'unione.emailValidation.batch',
		{ count: input.emails.length, failed },
		'completed',
	);

	return { status: failed === 0 ? 'success' : 'partial', results };
};
