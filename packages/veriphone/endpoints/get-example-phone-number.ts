import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeVeriphoneRequest } from '../client';
import type {
	GetExamplePhoneNumberInput,
	GetExamplePhoneNumberResponse,
} from './types';
import {
	GetExamplePhoneNumberInputSchema,
	GetExamplePhoneNumberResponseSchema,
} from './types';
import type { VeriphoneEndpointContext } from './verify-phone-number';

/**
 * Retrieve an example phone number for a country and line type.
 *
 * API: GET /v2/example
 * Caveat: absent from the official v2/v3 references fetched 2026-09-09;
 * documented by the RapidAPI Veriphone mirror (`type`, `country_code`).
 * Confirm the country code before calling.
 */
export async function getExamplePhoneNumber(
	ctx: VeriphoneEndpointContext,
	input: GetExamplePhoneNumberInput,
): Promise<GetExamplePhoneNumberResponse> {
	if (!ctx.key) {
		throw new AuthMissingError('veriphone', 'api_key');
	}

	const parsedInput = GetExamplePhoneNumberInputSchema.parse(input);

	// Provider returns unvalidated JSON; validated by the schema below.
	const response = await makeVeriphoneRequest<unknown>('v2/example', ctx.key, {
		query: {
			country_code: parsedInput.country_code,
			type: parsedInput.type,
		},
	});

	const parsed = GetExamplePhoneNumberResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'veriphone.getExamplePhoneNumber',
		{ country_code: parsedInput.country_code },
		'completed',
	);

	return parsed;
}
