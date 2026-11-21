import { logEventFromContext } from 'corsair/core';
import type { MailerLiteEndpoints } from '..';
import type { MailerLiteEndpointOutputs } from './types';
import { makeMailerLiteRequest } from '../client';

export const get: MailerLiteEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeMailerLiteRequest<MailerLiteEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'mailerlite.example.get', { ...input }, 'completed');
	return response;
};
