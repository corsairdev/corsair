import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';
import { EMAIL_STATUS_TYPES } from './types';

export const set: UnioneEndpoints['webhook']['set'] = async (ctx, input) => {
	const response = await makeUnioneRequest<UnioneEndpointOutputs['webhookSet']>(
		'webhook/set.json',
		ctx.key,
		{ body: { ...input } },
	);

	const object = response.object;
	if (object?.id !== undefined) {
		await maybeUpsert(ctx.db.webhooks, object.id, {
			id: object.id,
			url: object.url ?? input.url,
			status: object.status,
			events: object.events,
		});
	}
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

	const object = response.object;
	if (object?.id !== undefined) {
		await maybeUpsert(ctx.db.webhooks, object.id, {
			id: object.id,
			url: object.url ?? input.url,
			status: object.status,
			events: object.events,
		});
	}
	await logEventFromContext(
		ctx,
		'unione.webhook.get',
		{ ...input },
		'completed',
	);
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

export const types: UnioneEndpoints['webhook']['types'] = async (ctx) => {
	const response: UnioneEndpointOutputs['webhookTypes'] = {
		email_status: [...EMAIL_STATUS_TYPES],
		spam_block: ['*'],
	};
	await logEventFromContext(ctx, 'unione.webhook.types', {}, 'completed');
	return response;
};
