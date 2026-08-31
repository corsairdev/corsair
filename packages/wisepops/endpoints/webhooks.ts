import { logEventFromContext } from 'corsair/core';
import type { WisepopsEndpoints } from '..';
import { makeWisepopsRequest } from '../client';
import type { WisepopsEndpointOutputs } from './types';

export const createWebhook: WisepopsEndpoints['webhookCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['webhookCreate']
	>('api2/hooks', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'wisepops.webhook.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteWebhook: WisepopsEndpoints['webhookDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['webhookDelete']
	>('api2/hooks', ctx.key, {
		method: 'DELETE',
		query: { hook_id: input.hook_id },
	});

	await logEventFromContext(
		ctx,
		'wisepops.webhook.delete',
		{ ...input },
		'completed',
	);
	return response;
};
