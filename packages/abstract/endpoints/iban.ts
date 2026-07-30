import { logEventFromContext } from 'corsair/core';
import { makeAbstractRequest } from '../client';
import type { AbstractEndpoints } from '../index';
import type { AbstractEndpointOutputs } from './types';

/**
 * Validate the format and country code of an IBAN number. Use after
 * collecting an IBAN to ensure it is correctly formatted.
 *
 * API: GET ibanvalidation.abstractapi.com/v1
 * Docs: https://www.abstractapi.com/api/iban-validation-api
 */
export const validate: AbstractEndpoints['ibanValidate'] = async (
	ctx,
	input,
) => {
	const apiKey =
		ctx.options.ibanApiKey ?? (await ctx.keys.get_iban_api_key()) ?? ctx.key;

	const response = await makeAbstractRequest<
		AbstractEndpointOutputs['ibanValidate']
	>('ibanValidation', '', apiKey, {
		query: {
			iban: input.iban,
		},
	});

	if (ctx.db.ibanValidations) {
		try {
			await ctx.db.ibanValidations.upsertByEntityId(response.iban, {
				iban: response.iban,
				isValid: response.is_valid,
				checkedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save IBAN validation result to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'abstract.iban.validate',
		{ ...input },
		'completed',
	);

	return response;
};
