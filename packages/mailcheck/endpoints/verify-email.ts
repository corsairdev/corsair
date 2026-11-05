import { logEventFromContext } from 'corsair/core';
import type { MailcheckEndpoints } from '..';
import { makeMailcheckRequest } from '../client';
import {
	MailcheckEndpointInputSchemas,
	MailcheckEndpointOutputSchemas,
} from './types';

export const verifyEmail: MailcheckEndpoints['verifyEmail'] = async (
	ctx,
	input,
) => {
	const parsed = MailcheckEndpointInputSchemas.verifyEmail.parse(input);
	const response = await makeMailcheckRequest<unknown>(
		'/v1/singleEmail:check',
		ctx.key,
		{
			method: 'POST',
			body: { email: parsed.email },
		},
	);
	const output = MailcheckEndpointOutputSchemas.verifyEmail.parse(
		response ?? {},
	);
	await logEventFromContext(ctx, 'mailcheck.email.verify', {}, 'completed');
	return output;
};
