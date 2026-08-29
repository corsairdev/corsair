import { logEventFromContext } from 'corsair/core';
import { makeBrevoRequest } from '../client';
import type { BrevoEndpoints } from '../index';
import type { BrevoEndpointOutputs } from './types';

export const list: BrevoEndpoints['emailCampaignsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.type) query.type = input.type;
	if (input?.status) query.status = input.status;
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;
	if (input?.sort) query.sort = input.sort;

	const response = await makeBrevoRequest<
		BrevoEndpointOutputs['emailCampaignsList']
	>('emailCampaigns', ctx.key, {
		method: 'GET',
		query,
	});

	if (response.campaigns && ctx.db?.campaigns) {
		try {
			for (const campaign of response.campaigns) {
				await ctx.db?.campaigns.upsertByEntityId(String(campaign.id), {
					id: campaign.id,
					name: campaign.name,
					subject: campaign.subject,
					type: campaign.type,
					status: campaign.status,
					scheduledAt: campaign.scheduledAt,
					createdAt: campaign.createdAt,
					modifiedAt: campaign.modifiedAt,
				});
			}
		} catch (error) {
			console.warn('Failed to save campaigns to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.list',
		{ count: response.count ?? response.campaigns?.length ?? 0 },
		'completed',
	);

	return response;
};

export const get: BrevoEndpoints['emailCampaignsGet'] = async (ctx, input) => {
	const response = await makeBrevoRequest<
		BrevoEndpointOutputs['emailCampaignsGet']
	>(`emailCampaigns/${input.campaignId}`, ctx.key, {
		method: 'GET',
	});

	if (response.id && ctx.db?.campaigns) {
		try {
			await ctx.db?.campaigns.upsertByEntityId(String(response.id), {
				id: response.id,
				name: response.name,
				subject: response.subject,
				type: response.type,
				status: response.status,
				scheduledAt: response.scheduledAt,
				createdAt: response.createdAt,
				modifiedAt: response.modifiedAt,
			});
		} catch (error) {
			console.warn('Failed to save campaign to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.get',
		{ id: response.id, name: response.name },
		'completed',
	);

	return response;
};

export const create: BrevoEndpoints['emailCampaignsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeBrevoRequest<
		BrevoEndpointOutputs['emailCampaignsCreate']
	>('emailCampaigns', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (response.id && ctx.db?.campaigns) {
		try {
			await ctx.db?.campaigns.upsertByEntityId(String(response.id), {
				id: response.id,
				name: input.name,
				subject: input.subject,
				scheduledAt: input.scheduledAt,
			});
		} catch (error) {
			console.warn('Failed to save campaign to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.create',
		{ id: response.id, name: input.name },
		'completed',
	);

	return response;
};

export const update: BrevoEndpoints['emailCampaignsUpdate'] = async (
	ctx,
	input,
) => {
	const { campaignId, ...body } = input;
	await makeBrevoRequest<void>(`emailCampaigns/${campaignId}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.update',
		{ campaignId },
		'completed',
	);

	return { success: true };
};

export const deleteCampaign: BrevoEndpoints['emailCampaignsDelete'] = async (
	ctx,
	input,
) => {
	await makeBrevoRequest<void>(`emailCampaigns/${input.campaignId}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db?.campaigns) {
		try {
			await ctx.db?.campaigns.deleteByEntityId(String(input.campaignId));
		} catch (error) {
			console.warn('Failed to delete campaign from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.delete',
		{ campaignId: input.campaignId },
		'completed',
	);

	return { success: true };
};

export const sendNow: BrevoEndpoints['emailCampaignsSendNow'] = async (
	ctx,
	input,
) => {
	await makeBrevoRequest<void>(
		`emailCampaigns/${input.campaignId}/sendNow`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.sendNow',
		{ campaignId: input.campaignId },
		'completed',
	);

	return { success: true };
};

export const sendTest: BrevoEndpoints['emailCampaignsSendTest'] = async (
	ctx,
	input,
) => {
	await makeBrevoRequest<void>(
		`emailCampaigns/${input.campaignId}/sendTest`,
		ctx.key,
		{
			method: 'POST',
			body: {
				emailTo: input.emailTo,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.sendTest',
		{ campaignId: input.campaignId, emailTo: input.emailTo },
		'completed',
	);

	return { success: true };
};
