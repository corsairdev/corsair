import type { CorsairPluginSubscribeResult } from 'corsair/core';
import type { ZoominfoAuthContext } from '../auth';
import { resolveZoominfoToken } from '../auth';
import { makeZoominfoRequest } from '../client';
import type { ZoominfoWebhookRecord } from './types';
import {
	ZoominfoWebhookListSchema,
	ZoominfoWebhookRecordSchema,
	ZoominfoWebhookTokenSchema,
} from './types';

/**
 * ctx is the account context `keyBuilder` receives, plus the webhook-signature
 * setter used to persist the verification token.
 */
export type ZoominfoSubscribeContext = ZoominfoAuthContext & {
	keys: { set_webhook_signature: (value: string) => Promise<unknown> };
	options?: { baseUrl?: string };
};

/**
 * Contact and Company are the only object types ZoomInfo supports and Update is
 * the only event, so one webhook with both subscriptions covers the whole
 * surface. Full payloads carry the changed attributes as well, which is what
 * the update handlers log.
 */
const SUBSCRIPTIONS = [
	{ eventType: 'Update', objectType: 'Contact', fullPayload: true },
	{ eventType: 'Update', objectType: 'Company', fullPayload: true },
] as const;

const WEBHOOK_TITLE = 'Corsair';

/**
 * Arms the ZoomInfo webhook for this account and hands Hub the two values it
 * needs: the webhook id inbound deliveries are routed on, and the verification
 * token they are checked against.
 *
 * Follows the order ZoomInfo's Monitoring API docs recommend — create disabled,
 * confirm the target URL is reachable, then enable — so a webhook is never live
 * before the token that guards it has been stored.
 */
export async function zoominfoSubscribe(
	ctx: ZoominfoSubscribeContext,
	input: { webhookUrl: string },
): Promise<CorsairPluginSubscribeResult | null> {
	const baseUrl = ctx.options?.baseUrl;
	const token = await resolveZoominfoToken(ctx, { baseUrl });
	const call = <T>(
		path: string,
		options: {
			method?: 'GET' | 'POST' | 'PUT';
			body?: Record<string, unknown>;
		},
	) => makeZoominfoRequest<T>(path, token, { ...options, baseUrl });

	// A reconnect would otherwise leave the previous webhook firing at the same
	// URL, and ZoomInfo has no upsert. Reusing it keeps one webhook per account.
	const existing = await findWebhookByUrl(call, input.webhookUrl);

	const webhook =
		existing ??
		ZoominfoWebhookRecordSchema.parse(
			await call<unknown>('webhooks', {
				method: 'POST',
				body: {
					title: WEBHOOK_TITLE,
					enabled: false,
					targetUrl: input.webhookUrl,
					subscriptions: SUBSCRIPTIONS,
				},
			}),
		);

	// Create returns the first verification token inline; an existing webhook
	// never reveals its token again, so reuse means rotating to a fresh one.
	const verificationToken =
		webhook.verificationToken ??
		ZoominfoWebhookTokenSchema.parse(
			await call<unknown>(`webhooks/${webhook.id}/token`, { method: 'POST' }),
		).verificationToken;

	// Stored before the webhook is enabled: a delivery that arrives without a
	// token to check it against is rejected by verifyZoominfoWebhookSignature.
	await ctx.keys.set_webhook_signature(verificationToken);

	await call<unknown>(`webhooks/${webhook.id}`, {
		method: 'PUT',
		body: { enabled: true, subscriptions: SUBSCRIPTIONS },
	});

	return {
		webhookLink: { linkType: 'tenant_external_id', externalId: webhook.id },
		webhookSecret: verificationToken,
	};
}

async function findWebhookByUrl(
	call: <T>(
		path: string,
		options: { method?: 'GET' | 'POST' | 'PUT' },
	) => Promise<T>,
	webhookUrl: string,
): Promise<ZoominfoWebhookRecord | null> {
	const listed = ZoominfoWebhookListSchema.safeParse(
		await call<unknown>('webhooks', { method: 'GET' }),
	);
	if (!listed.success) return null;

	return (
		listed.data.webhooks.find((hook) => hook.targetUrl === webhookUrl) ?? null
	);
}
