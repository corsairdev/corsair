import { logEventFromContext } from 'corsair/core';
import type { MailcheckEndpoints } from '..';
import { checkSingleEmail } from '../client';
import type { MailcheckEndpointOutputs } from './types';

export const validateDomain: MailcheckEndpoints['validateDomain'] = async (
	ctx,
	input,
) => {
	// Mailcheck has no dedicated domain endpoint; checking admin@{domain}
	// surfaces the domain-level signals (MX, disposability, catch-all).
	const checkEmail = `admin@${input.domain}`;
	const response = await checkSingleEmail<
		MailcheckEndpointOutputs['validateDomain']
	>(checkEmail, ctx.key);

	await logEventFromContext(
		ctx,
		'mailcheck.validate_domain',
		{ ...input },
		'completed',
	);
	return response;
};
