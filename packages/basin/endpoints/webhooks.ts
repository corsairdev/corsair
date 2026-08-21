import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['webhooksList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.page !== undefined) query.page = input.page;
	if (input?.query !== undefined) query.query = input.query;

	const res = await makeBasinRequest<unknown>('form_webhooks', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.webhooksList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.webhooks.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['webhooksGet'] = async (ctx, input) => {
	const res = await makeBasinRequest<unknown>(
		`form_webhooks/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BasinEndpointOutputSchemas.webhooksGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.webhooks.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: BasinEndpoints['webhooksCreate'] = async (ctx, input) => {
	const { form_webhook, ...rest } = input;
	const body = form_webhook ? { form_webhook } : { form_webhook: rest };

	const res = await makeBasinRequest<unknown>('form_webhooks', ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.webhooksCreate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.webhooks.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: BasinEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const { id, form_webhook, ...rest } = input;
	const body = form_webhook ? { form_webhook } : { form_webhook: rest };

	const res = await makeBasinRequest<unknown>(`form_webhooks/${id}`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.webhooksUpdate.parse(res);
	await logEventFromContext(
		ctx,
		'basin.webhooks.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteWebhook: BasinEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const res = await makeBasinRequest<unknown>(
		`form_webhooks/${input.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = BasinEndpointOutputSchemas.webhooksDelete.parse(res);
	await logEventFromContext(
		ctx,
		'basin.webhooks.delete',
		{ ...input },
		'completed',
	);
	return response;
};
