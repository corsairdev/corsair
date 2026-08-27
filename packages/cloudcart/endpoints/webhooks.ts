import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createWebhook: CloudcartEndpoints['createWebhook'] = async (ctx, input) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['createWebhook']>('webhooks', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.webhooks.createWebhook', { ...input }, 'completed');
	return result;
};

export const getWebhook: CloudcartEndpoints['getWebhook'] = async (ctx, input) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['getWebhook']>(`webhooks/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(ctx, 'cloudcart.webhooks.getWebhook', { ...input }, 'completed');
	return result;
};

export const listWebhooks: CloudcartEndpoints['listWebhooks'] = async (ctx, input) => {
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['listWebhooks']>('webhooks', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(ctx, 'cloudcart.webhooks.listWebhooks', { ...input }, 'completed');
	return result;
};

export const updateWebhook: CloudcartEndpoints['updateWebhook'] = async (ctx, input) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['updateWebhook']>(`webhooks/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(ctx, 'cloudcart.webhooks.updateWebhook', { ...input }, 'completed');
	return result;
};

export const deleteWebhook: CloudcartEndpoints['deleteWebhook'] = async (ctx, input) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<CloudcartEndpointOutputs['deleteWebhook']>(`webhooks/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'cloudcart.webhooks.deleteWebhook', { ...input }, 'completed');
	return result;
};
