import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const create: AsanaEndpoints['webhooksCreate'] = async (ctx, input) => {
	const { data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['webhooksCreate']>(
		'webhooks',
		ctx.key,
		{ method: 'POST', body: { data }, query },
	);

	await logEventFromContext(
		ctx,
		'asana.webhooks.create',
		{ resource: data.resource },
		'completed',
	);
	return result;
};

export const deleteWebhook: AsanaEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const { webhook_gid, opt_pretty } = input;
	const result = await makeAsanaRequest<AsanaEndpointOutputs['webhooksDelete']>(
		`webhooks/${webhook_gid}`,
		ctx.key,
		{ method: 'DELETE', query: { opt_pretty } },
	);

	await logEventFromContext(
		ctx,
		'asana.webhooks.delete',
		{ webhook_gid },
		'completed',
	);
	return result;
};

export const getList: AsanaEndpoints['webhooksGetList'] = async (
	ctx,
	input,
) => {
	const { workspace, resource, limit, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		workspace,
		resource,
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['webhooksGetList']
	>('webhooks', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'asana.webhooks.getList',
		{ workspace },
		'completed',
	);
	return result;
};

export const update: AsanaEndpoints['webhooksUpdate'] = async (ctx, input) => {
	const { webhook_gid, data, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['webhooksUpdate']>(
		`webhooks/${webhook_gid}`,
		ctx.key,
		{ method: 'PUT', body: { data }, query },
	);

	await logEventFromContext(
		ctx,
		'asana.webhooks.update',
		{ webhook_gid },
		'completed',
	);
	return result;
};
