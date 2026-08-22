import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest, mapPool } from '../client';
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
	// A transport failure or a non-2xx from UniOne (a bad key, an exhausted
	// quota, a rate limit) applies to the whole batch, not to one address, so
	// it propagates. Only per-address verdicts carried in a successful response
	// belong in `results` - swallowing a 401 here would report every address as
	// merely "invalid".
	const results = await mapPool<string, ValidationResult>(
		input.emails,
		VALIDATION_CONCURRENCY,
		(email) =>
			makeUnioneRequest<ValidationResult>(
				'email-validation/single.json',
				ctx.key,
				{ body: { email } },
			),
	);

	await logEventFromContext(
		ctx,
		'unione.emailValidation.batch',
		{ count: input.emails.length },
		'completed',
	);

	return { status: 'success', results };
};
