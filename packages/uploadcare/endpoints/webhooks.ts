import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';
import { makeUploadcareRequest } from '../client';
import type {
	UploadcareWebhook,
	WebhookCreateInput,
	WebhooksListResponse,
	WebhookUpdateInput,
} from './types';

function withoutSigningSecret(
	input: WebhookCreateInput | WebhookUpdateInput,
): Omit<WebhookCreateInput | WebhookUpdateInput, 'signing_secret'> {
	const { signing_secret: _secret, ...safe } = input;
	return safe;
}

export const list: UploadcareEndpoints['webhooksList'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<WebhooksListResponse>(
		'/webhooks/',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'uploadcare.webhooks.list',
		input,
		'completed',
	);
	return response;
};

export const create: UploadcareEndpoints['webhookCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeUploadcareRequest<UploadcareWebhook>(
		'/webhooks/',
		ctx.key,
		{ method: 'POST', body: input },
	);
	await logEventFromContext(
		ctx,
		'uploadcare.webhooks.create',
		withoutSigningSecret(input),
		'completed',
	);
	return response;
};

export const update: UploadcareEndpoints['webhookUpdate'] = async (
	ctx,
	input,
) => {
	const { webhook_id, ...body } = input;
	const response = await makeUploadcareRequest<UploadcareWebhook>(
		`/webhooks/${webhook_id}/`,
		ctx.key,
		{ method: 'PUT', body },
	);
	await logEventFromContext(
		ctx,
		'uploadcare.webhooks.update',
		withoutSigningSecret(input),
		'completed',
	);
	return response;
};

export const deleteWebhook: UploadcareEndpoints['webhookDelete'] = async (
	ctx,
	input,
) => {
	await makeUploadcareRequest<void>(`/webhooks/${input.webhook_id}/`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'uploadcare.webhooks.delete',
		input,
		'completed',
	);
	return { success: true as const };
};

export const deleteByUrl: UploadcareEndpoints['webhookDeleteByUrl'] = async (
	ctx,
	input,
) => {
	await makeUploadcareRequest<void>('/webhooks/unsubscribe/', ctx.key, {
		method: 'DELETE',
		formData: { target_url: input.target_url },
		mediaType: 'application/x-www-form-urlencoded',
	});
	await logEventFromContext(
		ctx,
		'uploadcare.webhooks.deleteByUrl',
		input,
		'completed',
	);
	return { success: true as const };
};
