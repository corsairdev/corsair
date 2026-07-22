import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';
import { escapeSoql } from '../utils';

export const createCampaign: SalesforceEndpoints['createCampaign'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		id: string;
		success?: boolean;
	}>('sobjects/Campaign', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(
		ctx,
		'salesforce.campaign.create',
		input,
		'completed',
	);
	return response;
};

export const getCampaign: SalesforceEndpoints['getCampaign'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{ Id: string }>(
		`sobjects/Campaign/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'salesforce.campaign.get', input, 'completed');
	return response;
};

export const listCampaigns: SalesforceEndpoints['listCampaigns'] = async (
	ctx,
	input,
) => {
	const limit = input.limit ?? 200;
	const whereStr = input.query ? ` WHERE ${escapeSoql(input.query)}` : '';
	const q = `SELECT Id, Name, Type, Status, StartDate, EndDate, IsActive FROM Campaign${whereStr} LIMIT ${limit}`;

	const response = await makeSalesforceRequest<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
	}>('query', ctx.key, { method: 'GET', query: { q } });

	await logEventFromContext(
		ctx,
		'salesforce.campaign.list',
		input,
		'completed',
	);
	return response;
};

export const deleteCampaign: SalesforceEndpoints['deleteCampaign'] = async (
	ctx,
	input,
) => {
	await makeSalesforceRequest<void>(`sobjects/Campaign/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'salesforce.campaign.delete',
		input,
		'completed',
	);
	return { success: true };
};

export const addContactToCampaign: SalesforceEndpoints['addContactToCampaign'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ id: string }>(
			'sobjects/CampaignMember',
			ctx.key,
			{
				method: 'POST',
				body: {
					CampaignId: input.campaignId,
					ContactId: input.contactId,
					Status: input.status,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.campaign.add_contact',
			input,
			'completed',
		);
		return response;
	};

export const addLeadToCampaign: SalesforceEndpoints['addLeadToCampaign'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ id: string }>(
			'sobjects/CampaignMember',
			ctx.key,
			{
				method: 'POST',
				body: {
					CampaignId: input.campaign_id,
					LeadId: input.lead_id,
					Status: input.status,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.campaign.add_lead',
			input,
			'completed',
		);
		return response;
	};

export const removeFromCampaign: SalesforceEndpoints['removeFromCampaign'] =
	async (ctx, input) => {
		let memberIdToDelete = input.campaign_member_id;

		if (!memberIdToDelete && input.member_id) {
			const safeMemberId = escapeSoql(input.member_id);
			const res = await makeSalesforceRequest<{
				records: Array<{ Id: string }>;
			}>('query', ctx.key, {
				method: 'GET',
				query: {
					q: `SELECT Id FROM CampaignMember WHERE ContactId = '${safeMemberId}' OR LeadId = '${safeMemberId}' LIMIT 1`,
				},
			});
			if (res.records?.[0]) memberIdToDelete = res.records[0].Id;
		}

		if (!memberIdToDelete) {
			throw new Error(
				'Either campaign_member_id or valid member_id (Contact/Lead ID) must be provided',
			);
		}

		await makeSalesforceRequest<void>(
			`sobjects/CampaignMember/${memberIdToDelete}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.campaign.remove_member',
			input,
			'completed',
		);
		return { success: true };
	};

export const searchCampaigns: SalesforceEndpoints['searchCampaigns'] = async (
	ctx,
	input,
) => {
	const terms: string[] = [];
	if (input.name) terms.push(`Name LIKE '%${escapeSoql(input.name)}%'`);
	if (input.type) terms.push(`Type = '${escapeSoql(input.type)}'`);
	if (input.status) terms.push(`Status = '${escapeSoql(input.status)}'`);

	const whereStr = terms.length > 0 ? ` WHERE ${terms.join(' AND ')}` : '';
	const q = `SELECT Id, Name, Type, Status, StartDate, EndDate FROM Campaign${whereStr} LIMIT 50`;

	const response = await makeSalesforceRequest<{
		records: Array<Record<string, unknown>>;
	}>('query', ctx.key, { method: 'GET', query: { q } });

	await logEventFromContext(
		ctx,
		'salesforce.campaign.search',
		input,
		'completed',
	);
	return { records: response.records ?? [] };
};

/** @deprecated */
export const createCampaignRecordViaPost: SalesforceEndpoints['createCampaignRecordViaPost'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ id: string }>(
			'sobjects/Campaign',
			ctx.key,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'salesforce.campaign.create_record_deprecated',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const removeCampaignObjectById: SalesforceEndpoints['removeCampaignObjectById'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(
			`sobjects/Campaign/${input.id}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.campaign.remove_deprecated',
			input,
			'completed',
		);
		return { success: true };
	};

/** @deprecated */
export const retrieveCampaignDataWithErrorHandling: SalesforceEndpoints['retrieveCampaignDataWithErrorHandling'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			input.id ? `sobjects/Campaign/${input.id}` : 'sobjects/Campaign/describe',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.campaign.retrieve_data_deprecated',
			input,
			'completed',
		);
		return { metadata: response };
	};

/** @deprecated */
export const retrieveSpecificCampaignObjectDetails: SalesforceEndpoints['retrieveSpecificCampaignObjectDetails'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ Id: string }>(
			`sobjects/Campaign/${input.id}`,
			ctx.key,
			{
				method: 'GET',
				query: input.fields ? { fields: input.fields.join(',') } : undefined,
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.campaign.retrieve_specific_deprecated',
			input,
			'completed',
		);
		return response;
	};
