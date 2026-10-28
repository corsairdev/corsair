import type { InstantlyContext, InstantlyEndpoints } from '..';
import { segment } from '../client';
import { INSTANTLY_WEBHOOK_SECRET_HEADER } from '../webhooks/types';
import { call } from './call';
import type { InstantlyWebhookSubscription } from './types';

// Instantly returns each webhook's headers, including the secret Corsair
// verifies deliveries with. Values are masked so they never reach an agent.
export function redactHeaders<T extends Partial<InstantlyWebhookSubscription>>(
	webhook: T,
): T {
	if (!webhook.headers) return webhook;
	return {
		...webhook,
		headers: Object.fromEntries(
			Object.keys(webhook.headers).map((name) => [name, '[redacted]']),
		),
	};
}

async function webhookSecret(
	ctx: InstantlyContext,
): Promise<string | undefined> {
	if (ctx.options?.webhookSecret) return ctx.options.webhookSecret;
	try {
		return (await ctx.keys?.get_webhook_signature()) ?? undefined;
	} catch {
		return undefined;
	}
}

export const list: InstantlyEndpoints['webhooksList'] = async (ctx, input) => {
	const result = await call(
		ctx,
		'webhooksList',
		'webhooks.list',
		input,
		(query) => ({ method: 'GET', path: '/webhooks', query }),
		{ log: (_, page) => ({ count: page.items.length }) },
	);
	return { ...result, items: result.items.map(redactHeaders) };
};

// Webhooks need Instantly's Hypergrowth plan or higher.
export const create: InstantlyEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const secret = await webhookSecret(ctx);
	const result = await call(
		ctx,
		'webhooksCreate',
		'webhooks.create',
		input,
		({ attach_secret, headers, ...body }) => {
			// Without a secret Corsair would reject every delivery, so refuse
			// before creating a webhook that can only fail.
			if (attach_secret && !secret) {
				throw new Error(
					'No Instantly webhook secret is set. Set one with keys.set_webhook_signature (or the webhookSecret option), or pass attach_secret: false for a URL outside Corsair.',
				);
			}
			return {
				method: 'POST',
				path: '/webhooks',
				body: {
					...body,
					headers:
						attach_secret && secret
							? { ...headers, [INSTANTLY_WEBHOOK_SECRET_HEADER]: secret }
							: headers,
				},
			};
		},
		{
			log: ({ event_type, campaign, attach_secret }, webhook) => ({
				webhookId: webhook.id,
				eventType: event_type,
				campaignId: campaign,
				secretAttached: Boolean(attach_secret && secret),
			}),
		},
	);
	return redactHeaders(result);
};

export const remove: InstantlyEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) =>
	redactHeaders(
		await call(
			ctx,
			'webhooksDelete',
			'webhooks.delete',
			input,
			({ id }) => ({ method: 'DELETE', path: `/webhooks/${segment(id)}` }),
			{ log: ({ id }) => ({ webhookId: id }) },
		),
	);

export const listEventTypes: InstantlyEndpoints['webhooksListEventTypes'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'webhooksListEventTypes',
		'webhooks.listEventTypes',
		input,
		() => ({ method: 'GET', path: '/webhooks/event-types' }),
		{ log: (_, result) => ({ count: result.event_types?.length ?? 0 }) },
	);
