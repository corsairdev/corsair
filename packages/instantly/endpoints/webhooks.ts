import { asRecord } from 'corsair/core';
import type { InstantlyContext, InstantlyEndpoints } from '..';
import { segment } from '../client';
import { resolveWebhookSecret } from '../webhooks/secret';
import { INSTANTLY_WEBHOOK_SECRET_HEADER } from '../webhooks/types';
import { call } from './call';

// Webhook results can carry the secret Corsair verifies deliveries with: in
// `headers`, which Instantly returns on every webhook, and possibly echoed
// elsewhere (a test delivery's response). protect() masks every header value
// and any copy of the configured secret before a result reaches the caller,
// including a write returned unverified (raw body + parse_warning).

// unknown: walks a JSON result of any shape; each level is narrowed below.
export function scrubSecrets(
	value: unknown,
	secret: string | undefined,
	// unknown: same shape as the input, with secrets masked.
): unknown {
	if (typeof value === 'string') {
		return secret && value.includes(secret)
			? value.split(secret).join('[redacted]')
			: value;
	}
	if (Array.isArray(value))
		return value.map((item) => scrubSecrets(item, secret));
	const record = asRecord(value);
	if (!record) return value;
	// unknown: values keep whatever type the response had.
	const out: Record<string, unknown> = {};
	for (const [key, item] of Object.entries(record)) {
		const headers = key === 'headers' ? asRecord(item) : null;
		out[key] = headers
			? Object.fromEntries(
					Object.keys(headers).map((name) => [name, '[redacted]']),
				)
			: scrubSecrets(item, secret);
	}
	return out;
}

async function protect<T>(ctx: InstantlyContext, result: T): Promise<T> {
	const secret = await resolveWebhookSecret(ctx.options, ctx.keys);
	// scrubSecrets keeps the shape and only replaces string values, so the
	// result is still a T.
	return scrubSecrets(result, secret) as T;
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
	return protect(ctx, result);
};

// Webhooks need Instantly's Hypergrowth plan or higher.
export const create: InstantlyEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const secret = await resolveWebhookSecret(ctx.options, ctx.keys);
	const result = await call(
		ctx,
		'webhooksCreate',
		'webhooks.create',
		input,
		({ attach_secret, headers, ...body }) => {
			// Without a secret Corsair would reject every delivery, so refuse
			// before creating a webhook that can only fail.
			// Instantly would send the secret in clear text to an http:// URL,
			// where anyone on the path could read it and forge deliveries.
			if (attach_secret && body.target_hook_url.startsWith('http://')) {
				throw new Error(
					'Refusing to send the webhook secret to an http:// URL. Use https, or pass attach_secret: false for a URL outside Corsair.',
				);
			}
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
	return protect(ctx, result);
};

export const remove: InstantlyEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) =>
	protect(
		ctx,
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

export const get: InstantlyEndpoints['webhooksGet'] = async (ctx, input) =>
	protect(
		ctx,
		await call(
			ctx,
			'webhooksGet',
			'webhooks.get',
			input,
			({ id }) => ({ method: 'GET', path: `/webhooks/${segment(id)}` }),
			{ log: ({ id }) => ({ id }) },
		),
	);

export const update: InstantlyEndpoints['webhooksUpdate'] = async (
	ctx,
	input,
) =>
	protect(
		ctx,
		await call(
			ctx,
			'webhooksUpdate',
			'webhooks.update',
			input,
			({ id, ...body }) => ({
				method: 'PATCH',
				path: `/webhooks/${segment(id)}`,
				body,
			}),
			{ log: ({ id }) => ({ id }) },
		),
	);

export const test: InstantlyEndpoints['webhooksTest'] = async (ctx, input) =>
	protect(
		ctx,
		await call(
			ctx,
			'webhooksTest',
			'webhooks.test',
			input,
			({ id }) => ({ method: 'POST', path: `/webhooks/${segment(id)}/test` }),
			{ log: ({ id }) => ({ id }) },
		),
	);

export const resume: InstantlyEndpoints['webhooksResume'] = async (
	ctx,
	input,
) =>
	protect(
		ctx,
		await call(
			ctx,
			'webhooksResume',
			'webhooks.resume',
			input,
			({ id }) => ({ method: 'POST', path: `/webhooks/${segment(id)}/resume` }),
			{ log: ({ id }) => ({ id }) },
		),
	);
