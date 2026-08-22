import { logEventFromContext } from 'corsair/core';
import type { MailcheckEndpoints } from '..';
import type { MailcheckEndpointOutputs } from './types';
import { makeMailcheckRequest } from '../client';

export const verifyEmail: MailcheckEndpoints['verifyEmail'] = async (ctx, input) => {
	const response = await makeMailcheckRequest<MailcheckEndpointOutputs['verifyEmail']>(
		'verify',
		ctx.key,
		{
			method: 'POST',
			body: {
				email: input.email,
				verify: input.verify ?? true,
				check_breach: input.check_breach ?? false,
			},
		},
	);

	await logEventFromContext(ctx, 'mailcheck.verify_email', { ...input }, 'completed');
	return response;
};