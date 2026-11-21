import { logEventFromContext } from 'corsair/core';
import type { MailcoachEndpoints } from '..';
import type { MailcoachEndpointOutputs } from './types';
import { makeMailcoachRequest } from '../client';

export const get: MailcoachEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeMailcoachRequest<MailcoachEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'mailcoach.example.get', { ...input }, 'completed');
	return response;
};
