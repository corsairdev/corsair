import { logEventFromContext } from 'corsair/core';
import type { MailcheckEndpoints } from '..';
import type { MailcheckEndpointOutputs } from './types';
import { makeMailcheckRequest } from '../client';

export const validateDomain: MailcheckEndpoints['validateDomain'] = async (ctx, input) => {
	// Mailcheck.co single API validates email; for domain validation use admin@{domain}
	const checkEmail = `admin@${input.domain}`;
	const response = await makeMailcheckRequest<MailcheckEndpointOutputs['validateDomain']>(
		'/v1/emails:checkSingle',
		ctx.key,
		{ method: 'POST', body: { email: checkEmail } },
	);

	await logEventFromContext(ctx, 'mailcheck.validate_domain', { ...input }, 'completed');
	return response;
};
