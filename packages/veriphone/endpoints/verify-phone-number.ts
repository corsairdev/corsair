import type { EventLoggingContext } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeVeriphoneRequest } from '../client';
import type {
	VerifyPhoneNumberInput,
	VerifyPhoneNumberResponse,
} from './types';
import {
	VerifyPhoneNumberInputSchema,
	VerifyPhoneNumberResponseSchema,
} from './types';

// Narrow context: endpoints only read the key and the event-logging fields.
// The binder passes the full plugin context at runtime; the narrowed type
// keeps unit tests assertion-free. Assignment to the plugin tree holds via
// the bivariant endpoint signature (see core/endpoints CorsairEndpoint).
export type VeriphoneEndpointContext = EventLoggingContext & {
	key: string;
};

/**
 * Verify a phone number and retrieve carrier and country information.
 *
 * API: GET /v3/verify
 * Docs: https://veriphone.io/docs/v3#verify
 */
export async function verifyPhoneNumber(
	ctx: VeriphoneEndpointContext,
	input: VerifyPhoneNumberInput,
): Promise<VerifyPhoneNumberResponse> {
	if (!ctx.key) {
		throw new AuthMissingError('veriphone', 'api_key');
	}

	// Reject invalid input before any provider call (a verification costs
	// credits, so malformed phone numbers must never reach the API).
	const parsedInput = VerifyPhoneNumberInputSchema.parse(input);

	// Provider returns unvalidated JSON; validated by the schema below.
	const response = await makeVeriphoneRequest<unknown>('v3/verify', ctx.key, {
		query: {
			phone: parsedInput.phone,
			default_country: parsedInput.default_country,
			mode: parsedInput.mode,
			record: parsedInput.record,
		},
	});

	const parsed = VerifyPhoneNumberResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		'veriphone.verifyPhoneNumber',
		{ mode: parsedInput.mode ?? 'static' },
		'completed',
	);

	return parsed;
}
