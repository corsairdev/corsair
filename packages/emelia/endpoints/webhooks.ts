import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRestRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

// Webhooks (/webhook) — method + path verified per page; create/delete body
// detail NOT FOUND. Create keeps the documented-minimal fields (campaign to
// watch, callback URL, event names); delete identifies by URL per docs prose.

export const list: EmeliaEndpoints['listWebhooks'] = async (ctx, input) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['listWebhooks']
	>('/webhook', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'emelia.webhooks.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: EmeliaEndpoints['createWebhook'] = async (ctx, input) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['createWebhook']
	>('/webhook', ctx.key, {
		method: 'POST',
		body: {
			campaignId: input.campaignId,
			url: input.url,
			events: input.events,
		},
	});

	await logEventFromContext(
		ctx,
		'emelia.webhooks.create',
		{ campaignId: input.campaignId },
		'completed',
	);
	return response;
};

export const remove: EmeliaEndpoints['deleteWebhook'] = async (ctx, input) => {
	const response = await makeEmeliaRestRequest<
		EmeliaEndpointOutputs['deleteWebhook']
	>('/webhook', ctx.key, {
		method: 'DELETE',
		body: { url: input.url },
	});

	await logEventFromContext(
		ctx,
		'emelia.webhooks.remove',
		{ url: input.url },
		'completed',
	);
	return response;
};
