import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest, mapPool } from '../client';
import type { UnioneEndpointOutputs } from './types';

const VALIDATION_CONCURRENCY = 2;

export const batch: UnioneEndpoints['emailValidation']['batch'] = async (
	ctx,
	input,
) => {
	const results = await mapPool(input.emails, VALIDATION_CONCURRENCY, (email) =>
		makeUnioneRequest<UnioneEndpointOutputs['emailValidateRetry']>(
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

export const retry: UnioneEndpoints['emailValidation']['retry'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['emailValidateRetry']
	>('email-validation/single.json', ctx.key, { body: { email: input.email } });

	await logEventFromContext(
		ctx,
		'unione.emailValidation.retry',
		{ ...input },
		'completed',
	);
	return response;
};
