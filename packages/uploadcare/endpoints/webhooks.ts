import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';
import { makeUploadcareRequest } from '../client';
import type { UploadcareWebhook, WebhooksListResponse } from './types';

export const list: UploadcareEndpoints['webhooksList'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<WebhooksListResponse>('webhooks/', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'uploadcare.webhooks.list', { ...input }, 'completed');
	return response;
};

export const create: UploadcareEndpoints['webhookCreate'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<UploadcareWebhook>('webhooks/', ctx.key, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(ctx, 'uploadcare.webhooks.create', { ...input }, 'completed');
	return response;
};

export const update: UploadcareEndpoints['webhookUpdate'] = async (ctx, input) => {
	const { webhook_id, ...body } = input;
	const response = await makeUploadcareRequest<UploadcareWebhook>(`webhooks/${webhook_id}/`, ctx.key, {
		method: 'PUT',
		body,
	});
	await logEventFromContext(ctx, 'uploadcare.webhooks.update', { ...input }, 'completed');
	return response;
};

export const deleteWebhook: UploadcareEndpoints['webhookDelete'] = async (ctx, input) => {
	await makeUploadcareRequest<void>(`webhooks/${input.webhook_id}/`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(ctx, 'uploadcare.webhooks.delete', { ...input }, 'completed');
	return { success: true };
};
