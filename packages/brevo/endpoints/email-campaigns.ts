import { logEventFromContext } from 'corsair/core';
import { makeBrevoRequest } from '../client';
import type { BrevoEndpoints } from '../index';
import { BrevoEndpointInputSchemas, BrevoEndpointOutputSchemas } from './types';

export const list: BrevoEndpoints['emailCampaignsList'] = async (
	ctx,
	input,
) => {
	const parsed = BrevoEndpointInputSchemas.emailCampaignsList.parse(input);
	const query: Record<string, string | number | undefined> = {};
	if (parsed?.type) query.type = parsed.type;
	if (parsed?.status) query.status = parsed.status;
	if (parsed?.limit !== undefined) query.limit = parsed.limit;
	if (parsed?.offset !== undefined) query.offset = parsed.offset;
	if (parsed?.sort) query.sort = parsed.sort;

	const raw = await makeBrevoRequest<unknown>('emailCampaigns', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BrevoEndpointOutputSchemas.emailCampaignsList.parse(raw);

	if (response.campaigns && ctx.db?.campaigns) {
		try {
			for (const campaign of response.campaigns) {
				await ctx.db.campaigns.upsertByEntityId(String(campaign.id), {
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
	const parsed = BrevoEndpointInputSchemas.emailCampaignsGet.parse(input);
	const raw = await makeBrevoRequest<unknown>(
		`emailCampaigns/${parsed.campaignId}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BrevoEndpointOutputSchemas.emailCampaignsGet.parse(raw);

	if (response.id && ctx.db?.campaigns) {
		try {
			await ctx.db.campaigns.upsertByEntityId(String(response.id), {
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
	const parsed = BrevoEndpointInputSchemas.emailCampaignsCreate.parse(input);
	const raw = await makeBrevoRequest<unknown>('emailCampaigns', ctx.key, {
		method: 'POST',
		body: parsed,
	});
	const response = BrevoEndpointOutputSchemas.emailCampaignsCreate.parse(raw);

	if (response.id && ctx.db?.campaigns) {
		try {
			await ctx.db.campaigns.upsertByEntityId(String(response.id), {
				id: response.id,
				name: parsed.name,
				subject: parsed.subject,
				scheduledAt: parsed.scheduledAt,
			});
		} catch (error) {
			console.warn('Failed to save campaign to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.create',
		{ id: response.id, name: parsed.name },
		'completed',
	);

	return response;
};

export const update: BrevoEndpoints['emailCampaignsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = BrevoEndpointInputSchemas.emailCampaignsUpdate.parse(input);
	const { campaignId, ...body } = parsed;
	await makeBrevoRequest<unknown>(`emailCampaigns/${campaignId}`, ctx.key, {
		method: 'PUT',
		body,
	});

	const refreshed = BrevoEndpointOutputSchemas.emailCampaignsGet.parse(
		await makeBrevoRequest<unknown>(`emailCampaigns/${campaignId}`, ctx.key, {
			method: 'GET',
		}),
	);

	if (ctx.db?.campaigns) {
		try {
			await ctx.db.campaigns.upsertByEntityId(String(refreshed.id), {
				id: refreshed.id,
				name: refreshed.name,
				subject: refreshed.subject,
				type: refreshed.type,
				status: refreshed.status,
				scheduledAt: refreshed.scheduledAt,
				createdAt: refreshed.createdAt,
				modifiedAt: refreshed.modifiedAt,
			});
		} catch (error) {
			console.warn('Failed to save campaign to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.update',
		{ campaignId },
		'completed',
	);

	return BrevoEndpointOutputSchemas.emailCampaignsUpdate.parse({
		success: true,
	});
};

export const deleteCampaign: BrevoEndpoints['emailCampaignsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = BrevoEndpointInputSchemas.emailCampaignsDelete.parse(input);
	await makeBrevoRequest<unknown>(
		`emailCampaigns/${parsed.campaignId}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	if (ctx.db?.campaigns) {
		try {
			await ctx.db.campaigns.deleteByEntityId(String(parsed.campaignId));
		} catch (error) {
			console.warn('Failed to delete campaign from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.delete',
		{ campaignId: parsed.campaignId },
		'completed',
	);

	return BrevoEndpointOutputSchemas.emailCampaignsDelete.parse({
		success: true,
	});
};

export const sendNow: BrevoEndpoints['emailCampaignsSendNow'] = async (
	ctx,
	input,
) => {
	const parsed = BrevoEndpointInputSchemas.emailCampaignsSendNow.parse(input);
	await makeBrevoRequest<unknown>(
		`emailCampaigns/${parsed.campaignId}/sendNow`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.sendNow',
		{ campaignId: parsed.campaignId },
		'completed',
	);

	return BrevoEndpointOutputSchemas.emailCampaignsSendNow.parse({
		success: true,
	});
};

export const sendTest: BrevoEndpoints['emailCampaignsSendTest'] = async (
	ctx,
	input,
) => {
	const parsed = BrevoEndpointInputSchemas.emailCampaignsSendTest.parse(input);
	await makeBrevoRequest<unknown>(
		`emailCampaigns/${parsed.campaignId}/sendTest`,
		ctx.key,
		{
			method: 'POST',
			body: {
				emailTo: parsed.emailTo,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'brevo.emailCampaigns.sendTest',
		{ campaignId: parsed.campaignId, recipientCount: parsed.emailTo.length },
		'completed',
	);

	return BrevoEndpointOutputSchemas.emailCampaignsSendTest.parse({
		success: true,
	});
};
