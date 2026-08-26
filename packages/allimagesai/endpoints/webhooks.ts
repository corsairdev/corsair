import { logEventFromContext } from 'corsair/core';
import { makeAllimagesaiRequest } from '../client';
import type { AllimagesaiEndpoints } from '../index';
import { safely } from './persist';
import type { AllimagesaiEndpointOutputs } from './types';
import {
	AllimagesaiEndpointInputSchemas,
	AllimagesaiEndpointOutputSchemas,
} from './types';

/** Provider default when `events` is omitted, per WebhookSubscribeRequest. */
const DEFAULT_WEBHOOK_EVENTS = ['print.failed', 'print.completed'];

/**
 * `POST /v1/api-keys/webhook/subscribe` — register a callback endpoint.
 *
 * Answers 201 with `{ webhookId }`. The event list is not readable back from
 * the provider, so it is recorded here at subscribe time.
 * https://developer.all-images.ai/all-images.ai-api/api-reference/api-keys-webhook
 */
export const create: AllimagesaiEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	// The binder does not parse endpoint inputs, so validate here or an untyped
	// caller could register a malformed URL or an unsupported event name.
	const parsed = AllimagesaiEndpointInputSchemas.webhooksCreate.parse(input);

	const body: Record<string, unknown> = { url: parsed.url };
	if (parsed.events) body.events = parsed.events;

	const response = await makeAllimagesaiRequest<
		AllimagesaiEndpointOutputs['webhooksCreate']
	>('api-keys/webhook/subscribe', ctx.key, {
		method: 'POST',
		body,
		schema: AllimagesaiEndpointOutputSchemas.webhooksCreate,
	});

	if (response?.webhookId && ctx.db.webhooks) {
		await safely(`webhook ${response.webhookId}`, () =>
			ctx.db.webhooks.upsertByEntityId(response.webhookId, {
				id: response.webhookId,
				url: parsed.url,
				events: parsed.events ?? DEFAULT_WEBHOOK_EVENTS,
				created_at: new Date(),
			}),
		);
	}

	await logEventFromContext(
		ctx,
		'allimagesai.webhooks.create',
		{ url: parsed.url, events: parsed.events ?? DEFAULT_WEBHOOK_EVENTS },
		'completed',
	);

	return response;
};

/**
 * `GET /v1/api-keys/webhook/{apiKeyWebhookId}` — read a registered webhook.
 *
 * The provider echoes the API key back in `apiKeyId`; the client redacts it
 * before this function ever sees the value. The response carries no `events`,
 * so a previously cached subscription is the only source for that list.
 * https://developer.all-images.ai/all-images.ai-api/api-reference/api-keys
 */
export const get: AllimagesaiEndpoints['webhooksGet'] = async (ctx, input) => {
	const { apiKeyWebhookId } =
		AllimagesaiEndpointInputSchemas.webhooksGet.parse(input);

	const response = await makeAllimagesaiRequest<
		AllimagesaiEndpointOutputs['webhooksGet']
	>(`api-keys/webhook/${encodeURIComponent(apiKeyWebhookId)}`, ctx.key, {
		method: 'GET',
		schema: AllimagesaiEndpointOutputSchemas.webhooksGet,
	});

	if (response?.id && ctx.db.webhooks) {
		await safely(`webhook ${response.id}`, async () => {
			// upsertByEntityId replaces the stored `data` wholesale rather than
			// merging, and this response carries no `events`. Writing it blindly
			// would erase the event list recorded at subscribe time, so read the
			// existing row first and merge over it. Never store apiKeyId.
			const existing = await ctx.db.webhooks.findByEntityId(response.id);
			await ctx.db.webhooks.upsertByEntityId(response.id, {
				...(existing?.data ?? {}),
				id: response.id,
				url: response.url ?? existing?.data?.url ?? null,
			});
		});
	}

	await logEventFromContext(
		ctx,
		'allimagesai.webhooks.get',
		{ apiKeyWebhookId },
		'completed',
	);

	return response;
};
