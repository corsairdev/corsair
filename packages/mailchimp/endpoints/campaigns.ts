import { logEventFromContext } from 'corsair/core';

import { makeMailchimpRequest } from '../client';
import type { MailchimpEndpoints } from '../index';
import type { MailchimpEndpointOutputs } from './types';

export const list: MailchimpEndpoints['campaignsList'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsList']
	>('/campaigns', ctx.key, {
		method: 'GET',
		query: {
			type: input?.type,
			status: input?.status,
			count: input?.count,
			offset: input?.offset,
			fields: input?.fields?.join(','),
			exclude_fields: input?.exclude_fields?.join(','),
		},
	});

	if (ctx.db.campaigns && Array.isArray(response?.campaigns)) {
		for (const campaign of response.campaigns) {
			try {
				await ctx.db.campaigns.upsertByEntityId(campaign.id, { ...campaign });
			} catch {
				// Best-effort persistence.
			}
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: MailchimpEndpoints['campaignsGet'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsGet']
	>(`/campaigns/${input.campaign_id}`, ctx.key, { method: 'GET' });

	if (response?.id && ctx.db.campaigns) {
		try {
			await ctx.db.campaigns.upsertByEntityId(response.id, { ...response });
		} catch {
			// Best-effort persistence.
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: MailchimpEndpoints['campaignsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsCreate']
	>('/campaigns', ctx.key, { method: 'POST', body: { ...input } });

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: MailchimpEndpoints['campaignsUpdate'] = async (
	ctx,
	input,
) => {
	const { campaign_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsUpdate']
	>(`/campaigns/${campaign_id}`, ctx.key, { method: 'PATCH', body });

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const remove: MailchimpEndpoints['campaignsRemove'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsRemove']
	>(`/campaigns/${input.campaign_id}`, ctx.key, { method: 'DELETE' });

	if (ctx.db.campaigns) {
		try {
			await ctx.db.campaigns.deleteByEntityId(input.campaign_id);
		} catch {
			// Persistence is best-effort; the remote deletion already succeeded.
		}
	}

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.remove',
		{ ...input },
		'completed',
	);
	return response;
};

export const getContent: MailchimpEndpoints['campaignsGetContent'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsGetContent']
	>(`/campaigns/${input.campaign_id}/content`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.getContent',
		{ ...input },
		'completed',
	);
	return response;
};

export const setContent: MailchimpEndpoints['campaignsSetContent'] = async (
	ctx,
	input,
) => {
	const { campaign_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsSetContent']
	>(`/campaigns/${campaign_id}/content`, ctx.key, { method: 'PUT', body });

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.setContent',
		{ ...input },
		'completed',
	);
	return response;
};

export const sendTest: MailchimpEndpoints['campaignsSendTest'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsSendTest']
	>(`/campaigns/${input.campaign_id}/actions/test`, ctx.key, {
		method: 'POST',
		body: { test_emails: input.test_emails, send_type: input.send_type },
	});

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.sendTest',
		{ ...input },
		'completed',
	);
	return response;
};

export const schedule: MailchimpEndpoints['campaignsSchedule'] = async (
	ctx,
	input,
) => {
	const { campaign_id, ...body } = input;
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsSchedule']
	>(`/campaigns/${campaign_id}/actions/schedule`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.schedule',
		{ ...input },
		'completed',
	);
	return response;
};

export const unschedule: MailchimpEndpoints['campaignsUnschedule'] = async (
	ctx,
	input,
) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsUnschedule']
	>(`/campaigns/${input.campaign_id}/actions/unschedule`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.unschedule',
		{ ...input },
		'completed',
	);
	return response;
};

// Immediately sends the campaign. Guard behind explicit intent in callers.
export const send: MailchimpEndpoints['campaignsSend'] = async (ctx, input) => {
	const response = await makeMailchimpRequest<
		MailchimpEndpointOutputs['campaignsSend']
	>(`/campaigns/${input.campaign_id}/actions/send`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'mailchimp.campaigns.send',
		{ ...input },
		'completed',
	);
	return response;
};
