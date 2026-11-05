import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const verify: HunterioEndpoints['emailVerifierVerify'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.emailVerifierVerify.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailVerifierVerify']
	>('/email-verifier', ctx.key, {
		method: 'GET',
		query: {
			email: parsed.email,
			domain_metadata: parsed.domain_metadata,
		},
	});

	// 202 means the provider queued the verification (`data` absent); the
	// output schema keeps `data` optional so both outcomes parse.
	const parsedResponse =
		HunterioEndpointOutputSchemas.emailVerifierVerify.parse(response);

	// The verified address is PII; the event carries no payload.
	await logEventFromContext(
		ctx,
		'hunterio.emailVerifier.verify',
		{},
		'completed',
	);

	return parsedResponse;
};
