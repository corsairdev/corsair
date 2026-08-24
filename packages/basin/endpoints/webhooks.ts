import { logEventFromContext } from 'corsair/core';
import type { BasinEndpoints } from '..';
import { makeBasinRequest } from '../client';
import { BasinEndpointInputSchemas, BasinEndpointOutputSchemas } from './types';

export const list: BasinEndpoints['webhooksList'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.webhooksList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (validated.page !== undefined) query.page = validated.page;
	if (validated.query !== undefined) query.query = validated.query;

	const res = await makeBasinRequest<unknown>('form_webhooks', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BasinEndpointOutputSchemas.webhooksList.parse(res);
	await logEventFromContext(
		ctx,
		'basin.webhooks.list',
		{ ...validated },
		'completed',
	);
	return response;
};

export const get: BasinEndpoints['webhooksGet'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.webhooksGet.parse(input);
	const res = await makeBasinRequest<unknown>(
		`form_webhooks/${validated.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BasinEndpointOutputSchemas.webhooksGet.parse(res);
	await logEventFromContext(
		ctx,
		'basin.webhooks.get',
		{ ...validated },
		'completed',
	);
	return response;
};

export const create: BasinEndpoints['webhooksCreate'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.webhooksCreate.parse(input);
	const { form_webhook, ...rest } = validated;
	const body = form_webhook ? { form_webhook } : { form_webhook: rest };

	const res = await makeBasinRequest<unknown>('form_webhooks', ctx.key, {
		method: 'POST',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.webhooksCreate.parse(res);
	// A webhook URL can embed a token or signing secret in its path or query,
	// so log the identifiers and which fields were set, never the URL.
	await logEventFromContext(
		ctx,
		'basin.webhooks.create',
		{
			form_id: validated.form_id ?? validated.form_webhook?.form_id,
			fields: Object.keys(body.form_webhook ?? {}),
		},
		'completed',
	);
	return response;
};

export const update: BasinEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const validated = BasinEndpointInputSchemas.webhooksUpdate.parse(input);
	const { id, form_webhook, ...rest } = validated;
	const body = form_webhook ? { form_webhook } : { form_webhook: rest };

	const res = await makeBasinRequest<unknown>(`form_webhooks/${id}`, ctx.key, {
		method: 'PUT',
		body: body as Record<string, unknown>,
	});
	const response = BasinEndpointOutputSchemas.webhooksUpdate.parse(res);
	// Same reasoning as create: identifiers and field names only.
	await logEventFromContext(
		ctx,
		'basin.webhooks.update',
		{ id, fields: Object.keys(body.form_webhook ?? {}) },
		'completed',
	);
	return response;
};

export const deleteWebhook: BasinEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const validated = BasinEndpointInputSchemas.webhooksDelete.parse(input);
	const res = await makeBasinRequest<unknown>(
		`form_webhooks/${validated.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const response = BasinEndpointOutputSchemas.webhooksDelete.parse(res);
	await logEventFromContext(
		ctx,
		'basin.webhooks.delete',
		{ ...validated },
		'completed',
	);
	return response;
};
