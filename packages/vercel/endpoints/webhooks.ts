import { makeAuthenticatedVercelRequest, seg } from '../client';
import { compactBody, defineEndpoint, pickQuery } from './common';
import {
	VercelWebhooksInputSchemas as In,
	VercelWebhooksOutputSchemas as Out,
} from './webhooks-types';

/** A receiver URL can carry its own token in the query string; log without it. */
function urlForLog(url: string): string {
	const parsed = new URL(url);
	return `${parsed.origin}${parsed.pathname}`;
}

export const getWebhooks = defineEndpoint({
	event: 'vercel.webhooks.getWebhooks',
	input: In.getWebhooks,
	output: Out.getWebhooks,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest('/v1/webhooks', ctx, {
			teamId: input.teamId,
			query: pickQuery(input, ['projectId']),
		}),
});

export const getWebhook = defineEndpoint({
	event: 'vercel.webhooks.getWebhook',
	input: In.getWebhook,
	output: Out.getWebhook,
	run: async (ctx, input) =>
		makeAuthenticatedVercelRequest(`/v1/webhooks/${seg(input.id)}`, ctx, {
			teamId: input.teamId,
		}),
});

export const createWebhook = defineEndpoint({
	event: 'vercel.webhooks.createWebhook',
	input: In.createWebhook,
	output: Out.createWebhook,
	// The response carries the signing secret; it is returned to the caller
	// (needed to verify deliveries) and never logged.
	run: async (ctx, input) => {
		const { teamId, ...body } = input;
		return makeAuthenticatedVercelRequest('/v1/webhooks', ctx, {
			method: 'POST',
			teamId,
			body: compactBody(body),
		});
	},
	logInput: ({ url, ...rest }) => ({ ...rest, url: urlForLog(url) }),
});

export const deleteWebhook = defineEndpoint({
	event: 'vercel.webhooks.deleteWebhook',
	input: In.deleteWebhook,
	output: Out.deleteWebhook,
	run: async (ctx, input) => {
		await makeAuthenticatedVercelRequest(`/v1/webhooks/${seg(input.id)}`, ctx, {
			method: 'DELETE',
			teamId: input.teamId,
		});
		// 204 No Content: reaching here means Vercel removed it.
		return { deleted: true, id: input.id };
	},
});
