import { logEventFromContext } from 'corsair/core';
import { makeCrowterminalRequest } from '../client';
import type { CrowterminalEndpoints } from '../index';
import type { CrowterminalEndpointOutputs } from './types';

export const create: CrowterminalEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeCrowterminalRequest<
		CrowterminalEndpointOutputs['webhooksCreate']
	>('/api/agent/webhooks', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'crowterminal.webhooks.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: CrowterminalEndpoints['webhooksList'] = async (
	ctx,
	input,
) => {
	const response = await makeCrowterminalRequest<
		CrowterminalEndpointOutputs['webhooksList']
	>('/api/agent/webhooks', ctx.key);

	await logEventFromContext(
		ctx,
		'crowterminal.webhooks.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: CrowterminalEndpoints['webhooksUpdate'] = async (
	ctx,
	input,
) => {
	const { webhookId, ...body } = input;
	const response = await makeCrowterminalRequest<
		CrowterminalEndpointOutputs['webhooksUpdate']
	>(`/api/agent/webhooks/${webhookId}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'crowterminal.webhooks.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteWebhook: CrowterminalEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeCrowterminalRequest<
		CrowterminalEndpointOutputs['webhooksDelete']
	>(`/api/agent/webhooks/${input.webhookId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'crowterminal.webhooks.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const test: CrowterminalEndpoints['webhooksTest'] = async (
	ctx,
	input,
) => {
	const response = await makeCrowterminalRequest<
		CrowterminalEndpointOutputs['webhooksTest']
	>('/api/agent/webhooks/test', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'crowterminal.webhooks.test',
		{ ...input },
		'completed',
	);
	return response;
};
