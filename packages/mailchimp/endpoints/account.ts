import { logEventFromContext } from 'corsair/core';

import { makeMailchimpRequest } from '../client';
import type { MailchimpEndpoints } from '../index';
import type { MailchimpEndpointOutputs } from './types';

export const ping: MailchimpEndpoints['accountPing'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['accountPing']
	>('/ping', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'mailchimp.account.ping',
		{ ...(input ?? {}) },
		'completed',
	);
	return response;
};

export const root: MailchimpEndpoints['accountRoot'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['accountRoot']
	>('/', ctx.key, {
		method: 'GET',
		query: {
			fields: input?.fields?.join(','),
			exclude_fields: input?.exclude_fields?.join(','),
		},
	});

	await logEventFromContext(
		ctx,
		'mailchimp.account.root',
		{ ...(input ?? {}) },
		'completed',
	);
	return response;
};
