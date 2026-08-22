import { logEventFromContext } from 'corsair/core';
import type { MailcheckEndpoints } from '..';
import type { MailcheckEndpointOutputs } from './types';
import { makeMailcheckRequest } from '../client';

export const validateDomain: MailcheckEndpoints['validateDomain'] = async (ctx, input) => {
	const response = await makeMailcheckRequest<MailcheckEndpointOutputs['validateDomain']>(
		`domain/${input.domain}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'mailcheck.validate_domain', { ...input }, 'completed');
	return response;
};
