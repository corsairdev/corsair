import { logEventFromContext } from 'corsair/core';
import type { MailcheckEndpoints } from '..';
import { checkSingleEmail } from '../client';
import type { MailcheckEndpointOutputs } from './types';

export const verifyEmail: MailcheckEndpoints['verifyEmail'] = async (
	ctx,
	input,
) => {
	const response = await checkSingleEmail<
		MailcheckEndpointOutputs['verifyEmail']
	>(input.email, ctx.key);

	await logEventFromContext(
		ctx,
		'mailcheck.verify_email',
		{ ...input },
		'completed',
	);
	return response;
};
