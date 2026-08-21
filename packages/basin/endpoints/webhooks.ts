import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { safeDbDelete, safeDbUpsert, toWebhookRecord } from '../utils';
import type { BasinEndpointOutputs } from './types';

export const create: BasinEndpoints['webhooksCreate'] = async (ctx, input) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['webhooksCreate']>(
		'form_webhooks',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);

	if (result.id) {
		await safeDbUpsert(
			ctx.db.webhooks,
			result.id,
			toWebhookRecord(result),
			'webhook',
		);
	}

	await logEventFromContext(
		ctx,
		'basin.webhooks.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const listForForm: BasinEndpoints['webhooksListForForm'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {
		query: String(input.form_id),
	};
	if (input.page !== undefined) query.page = input.page;

	const result = await makeBasinRequest<
		BasinEndpointOutputs['webhooksListForForm']
	>('form_webhooks', ctx.key, { method: 'GET', query });

	const webhooksList = Array.isArray(result)
		? result
		: (result as { form_webhooks?: unknown[] }).form_webhooks;

	if (Array.isArray(webhooksList)) {
		for (const wh of webhooksList) {
			if (wh && typeof wh === 'object' && 'id' in wh) {
				await safeDbUpsert(
					ctx.db.webhooks,
					(wh as { id: string | number }).id,
					toWebhookRecord(wh as Parameters<typeof toWebhookRecord>[0]),
					'webhook',
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'basin.webhooks.listForForm',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: BasinEndpoints['webhooksGet'] = async (ctx, input) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['webhooksGet']>(
		`form_webhooks/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	if (result.id) {
		await safeDbUpsert(
			ctx.db.webhooks,
			result.id,
			toWebhookRecord(result),
			'webhook',
		);
	}

	await logEventFromContext(
		ctx,
		'basin.webhooks.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: BasinEndpoints['webhooksList'] = async (ctx, input = {}) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const result = await makeBasinRequest<BasinEndpointOutputs['webhooksList']>(
		'form_webhooks',
		ctx.key,
		{ method: 'GET', query },
	);

	const webhooksList = Array.isArray(result)
		? result
		: (result as { form_webhooks?: unknown[] }).form_webhooks;

	if (Array.isArray(webhooksList)) {
		for (const wh of webhooksList) {
			if (wh && typeof wh === 'object' && 'id' in wh) {
				await safeDbUpsert(
					ctx.db.webhooks,
					(wh as { id: string | number }).id,
					toWebhookRecord(wh as Parameters<typeof toWebhookRecord>[0]),
					'webhook',
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'basin.webhooks.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: BasinEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeBasinRequest<BasinEndpointOutputs['webhooksUpdate']>(
		`form_webhooks/${id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	if (result.id) {
		await safeDbUpsert(
			ctx.db.webhooks,
			result.id,
			toWebhookRecord(result),
			'webhook',
		);
	}

	await logEventFromContext(
		ctx,
		'basin.webhooks.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteWebhook: BasinEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeBasinRequest<BasinEndpointOutputs['webhooksDelete']>(
		`form_webhooks/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await safeDbDelete(ctx.db.webhooks, input.id, 'webhook');

	await logEventFromContext(
		ctx,
		'basin.webhooks.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const Webhooks = {
	create,
	listForForm,
	get,
	list,
	update,
	delete: deleteWebhook,
};
