import { logEventFromContext } from 'corsair/core';
import type { MailcheckEndpoints } from '..';
import type { MailcheckEndpointOutputs } from './types';
import { makeMailcheckRequest } from '../client';

export const verifyEmail: MailcheckEndpoints['verifyEmail'] = async (ctx, input) => {
	const response = await makeMailcheckRequest<MailcheckEndpointOutputs['verifyEmail']>(
		'/v1/emails:checkSingle',
		ctx.key,
		{
			method: 'POST',
			body: {
				email: input.email,
			},
		},
	);

	await logEventFromContext(ctx, 'mailcheck.verify_email', { ...input }, 'completed');
	return response;
};