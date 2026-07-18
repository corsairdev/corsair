import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const getContactById: InsightoaiEndpoints['getContactById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['getContactById']
	>(`/api/v1/contact/${input.contact_id}`, ctx.key, {
		method: 'GET',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.contacts.getContactById',
		{ contactId: input.contact_id },
		'completed',
	);
	return result;
};

export const getListOfContacts: InsightoaiEndpoints['getListOfContacts'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getListOfContacts']
		>('/api/v1/contact', ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.contacts.getListOfContacts',
			{},
			'completed',
		);
		return result;
	};

// Per project convention, contact PII (email, phone, name) is never logged — only a safe
// completion signal.
export const upsertContactByEmailOrPhoneNumber: InsightoaiEndpoints['upsertContactByEmailOrPhoneNumber'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['upsertContactByEmailOrPhoneNumber']
		>('/api/v1/contact/upsert', ctx.key, {
			method: 'POST',
			body: input,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.contacts.upsertContactByEmailOrPhoneNumber',
			{},
			'completed',
		);
		return result;
	};

export const deleteContactsInBulk: InsightoaiEndpoints['deleteContactsInBulk'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteContactsInBulk']
		>('/api/v1/contact/multiple', ctx.key, {
			method: 'DELETE',
			body: input,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.contacts.deleteContactsInBulk',
			{ itemCount: input.contact_ids.length },
			'completed',
		);
		return result;
	};

export const createContactCustomField: InsightoaiEndpoints['createContactCustomField'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['createContactCustomField']
		>('/api/v1/contact_custom_field', ctx.key, {
			method: 'POST',
			body: input,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.contacts.createContactCustomField',
			{},
			'completed',
		);
		return result;
	};

export const readContactCustomFieldList: InsightoaiEndpoints['readContactCustomFieldList'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['readContactCustomFieldList']
		>('/api/v1/contact_custom_field/list', ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.contacts.readContactCustomFieldList',
			{},
			'completed',
		);
		return result;
	};

export const readCampaignContactList: InsightoaiEndpoints['readCampaignContactList'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['readCampaignContactList']
		>(`/api/v1/campaign/contact/list/${input.campaign_id}`, ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.contacts.readCampaignContactList',
			{ campaignId: input.campaign_id },
			'completed',
		);
		return result;
	};

// Broadcast message text is never logged — only the recipient count and widget id.
export const sendMessagesToContacts: InsightoaiEndpoints['sendMessagesToContacts'] =
	async (ctx, input) => {
		const { widget_id, ...body } = input;
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['sendMessagesToContacts']
		>(`/api/v1/messaging/${widget_id}/contacts`, ctx.key, {
			method: 'POST',
			body,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.contacts.sendMessagesToContacts',
			{ widgetId: widget_id, itemCount: input.contact_ids.length },
			'completed',
		);
		return result;
	};

export const readContactSyncLogList: InsightoaiEndpoints['readContactSyncLogList'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['readContactSyncLogList']
		>('/api/v1/contact_sync_log/list', ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.contacts.readContactSyncLogList',
			{},
			'completed',
		);
		return result;
	};
