import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const createWebhook: InsightoaiEndpoints['createWebhook'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['createWebhook']
	>('/api/v1/outbound_webhook', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.webhooksTelephony.createWebhook',
		{},
		'completed',
	);
	return result;
};

export const updateWebhookById: InsightoaiEndpoints['updateWebhookById'] =
	async (ctx, input) => {
		const { webhook_id, ...body } = input;
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['updateWebhookById']
		>(`/api/v1/outbound_webhook/${webhook_id}`, ctx.key, {
			method: 'PUT',
			body,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.webhooksTelephony.updateWebhookById',
			{ webhookId: webhook_id },
			'completed',
		);
		return result;
	};

export const deleteWebhookById: InsightoaiEndpoints['deleteWebhookById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteWebhookById']
		>(`/api/v1/outbound_webhook/${input.webhook_id}`, ctx.key, {
			method: 'DELETE',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.webhooksTelephony.deleteWebhookById',
			{ webhookId: input.webhook_id },
			'completed',
		);
		return result;
	};

export const retrieveWebhookLog: InsightoaiEndpoints['retrieveWebhookLog'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['retrieveWebhookLog']
		>(`/api/v1/outbound_webhook/${input.webhook_id}/logs`, ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.webhooksTelephony.retrieveWebhookLog',
			{ webhookId: input.webhook_id },
			'completed',
		);
		return result;
	};

export const readTwilioAuthList: InsightoaiEndpoints['readTwilioAuthList'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['readTwilioAuthList']
		>('/api/v1/channel/twilio/list', ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.webhooksTelephony.readTwilioAuthList',
			{},
			'completed',
		);
		return result;
	};

// Twilio auth token/SID are credentials — never logged, only the record id.
export const updateTwilioAuthById: InsightoaiEndpoints['updateTwilioAuthById'] =
	async (ctx, input) => {
		const { twilio_auth_id, ...body } = input;
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['updateTwilioAuthById']
		>(`/api/v1/channel/twilio/${twilio_auth_id}`, ctx.key, {
			method: 'PUT',
			body,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.webhooksTelephony.updateTwilioAuthById',
			{ twilioAuthId: twilio_auth_id },
			'completed',
		);
		return result;
	};

export const deleteTwilioAuthById: InsightoaiEndpoints['deleteTwilioAuthById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteTwilioAuthById']
		>(`/api/v1/channel/twilio/${input.twilio_auth_id}`, ctx.key, {
			method: 'DELETE',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.webhooksTelephony.deleteTwilioAuthById',
			{ twilioAuthId: input.twilio_auth_id },
			'completed',
		);
		return result;
	};

// WhatsApp access tokens/secrets are credentials — never logged, only the record id.
// Path is PUT/DELETE /api/v1/user/{userwhatsapp_id}/user_whats_app per Insighto's
// published op surface: `userwhatsapp_id` is the WhatsApp-connection resource id
// that lives under the /user/{id}/… nesting (same id the API returns for the link),
// not a separate "account id" field.
export const updateUserwhatsappById: InsightoaiEndpoints['updateUserwhatsappById'] =
	async (ctx, input) => {
		const { userwhatsapp_id, ...body } = input;
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['updateUserwhatsappById']
		>(`/api/v1/user/${userwhatsapp_id}/user_whats_app`, ctx.key, {
			method: 'PUT',
			body,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.webhooksTelephony.updateUserwhatsappById',
			{ userwhatsappId: userwhatsapp_id },
			'completed',
		);
		return result;
	};

export const deleteUserwhatsappById: InsightoaiEndpoints['deleteUserwhatsappById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteUserwhatsappById']
		>(`/api/v1/user/${input.userwhatsapp_id}/user_whats_app`, ctx.key, {
			method: 'DELETE',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.webhooksTelephony.deleteUserwhatsappById',
			{ userwhatsappId: input.userwhatsapp_id },
			'completed',
		);
		return result;
	};
