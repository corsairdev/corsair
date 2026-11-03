import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';
export const listWebhooks: LeverEndpoints['listWebhooks'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listWebhooks']>(
		ctx,
		'/webhooks',
		{ method: 'GET', query: input },
	);
	await logEventFromContext(ctx, 'lever.webhooks.list', input, 'completed');
	return response;
};

export const createWebhook: LeverEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['createWebhook']
	>(ctx, '/webhooks', { method: 'POST', body: input });
	await logEventFromContext(ctx, 'lever.webhooks.create', input, 'completed');
	return response;
};

export const updateWebhook: LeverEndpoints['updateWebhook'] = async (
	ctx,
	input,
) => {
	const { webhookId, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['updateWebhook']
	>(ctx, leverPathParameter('/webhooks/{webhookId}', 'webhookId', webhookId), {
		method: 'PUT',
		body,
	});
	await logEventFromContext(ctx, 'lever.webhooks.update', input, 'completed');
	return response;
};

export const deleteWebhook: LeverEndpoints['deleteWebhook'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['deleteWebhook']
	>(
		ctx,
		leverPathParameter('/webhooks/{webhookId}', 'webhookId', input.webhookId),
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'lever.webhooks.delete', input, 'completed');
	return response;
};
