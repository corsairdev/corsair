import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';
import { EMAIL_STATUS_TYPES } from './types';

type WebhookRow = {
	url?: string | null;
	status?: string | null;
	event_format?: string | null;
	delivery_info?: number | null;
	single_event?: number | null;
	max_parallel?: number | null;
	updated_at?: string | null;
	events?: {
		email_status?: string[] | null;
		spam_block?: string[] | null;
	} | null;
};

/** UniOne keys webhooks by URL, so the mirror does too. */
function webhookRow(object: WebhookRow | undefined, fallbackUrl?: string) {
	const url = object?.url ?? fallbackUrl;
	if (!url) return undefined;
	return {
		url,
		status: object?.status,
		event_format: object?.event_format,
		delivery_info: object?.delivery_info,
		single_event: object?.single_event,
		max_parallel: object?.max_parallel,
		events: object?.events,
		updated_at: object?.updated_at,
	};
}

export const set: UnioneEndpoints['webhook']['set'] = async (ctx, input) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['webhookSet']>(
		'webhook/set.json',
		ctx.key,
		{ body: { ...input } },
	);

	const row = webhookRow(response.object, input.url);
	if (row) await maybeUpsert(ctx.db.webhooks, row.url, row);
	await logEventFromContext(
		ctx,
		'unione.webhook.set',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const get: UnioneEndpoints['webhook']['get'] = async (ctx, input) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['webhookGet']>(
		'webhook/get.json',
		ctx.key,
		{ body: { url: input.url } },
	);

	const row = webhookRow(response.object, input.url);
	if (row) await maybeUpsert(ctx.db.webhooks, row.url, row);
	await logEventFromContext(
		ctx,
		'unione.webhook.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: UnioneEndpoints['webhook']['list'] = async (ctx) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['webhookList']
	>('webhook/list.json', ctx.key, { body: {} });

	for (const object of response.objects ?? []) {
		const row = webhookRow(object);
		if (row) await maybeUpsert(ctx.db.webhooks, row.url, row);
	}
	await logEventFromContext(ctx, 'unione.webhook.list', {}, 'completed');
	return response;
};

export const remove: UnioneEndpoints['webhook']['delete'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['webhookDelete']
	>('webhook/delete.json', ctx.key, { body: { url: input.url } });

	await logEventFromContext(
		ctx,
		'unione.webhook.delete',
		{ ...input },
		'completed',
	);
	return response;
};

/**
 * The event names UniOne accepts in `webhook.set`. UniOne publishes no method
 * for these, so the list is local and mirrors the callback-format docs.
 */
export const types: UnioneEndpoints['webhook']['types'] = async (ctx) => {
	const response: UnioneEndpointOutputs['webhookTypes'] = {
		email_status: [...EMAIL_STATUS_TYPES],
		spam_block: ['*'],
	};
	await logEventFromContext(ctx, 'unione.webhook.types', {}, 'completed');
	return response;
};
