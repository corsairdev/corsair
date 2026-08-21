import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { escapeSoql, soqlWhere } from '../utils';
import { flattenFields, salesforceCall } from './shared';

export const createCampaign: SalesforceEndpoints['createCampaign'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<{
		id: string;
		success?: boolean;
	}>(ctx, 'sobjects/Campaign', { method: 'POST', body: flattenFields(input) });

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
	const response = await salesforceCall<{ Id: string }>(
		ctx,
		`sobjects/Campaign/${input.id}`,
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
	const queryClause = soqlWhere(input.query);
	const whereStr = queryClause ? ` WHERE ${queryClause}` : '';
	const q = `SELECT Id, Name, Type, Status, StartDate, EndDate, IsActive FROM Campaign${whereStr} LIMIT ${limit}`;

	const response = await salesforceCall<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });

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
	await salesforceCall<void>(ctx, `sobjects/Campaign/${input.id}`, {
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
		const response = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/CampaignMember',
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
		const response = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/CampaignMember',
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
			if (!input.campaign_id) {
				throw new Error(
					'campaign_id is required when looking up CampaignMember by member_id',
				);
			}
			const safeMemberId = escapeSoql(input.member_id);
			const safeCampaignId = escapeSoql(input.campaign_id);
			const res = await salesforceCall<{
				records: Array<{ Id: string }>;
			}>(ctx, 'query', {
				method: 'GET',
				query: {
					q: `SELECT Id FROM CampaignMember WHERE CampaignId = '${safeCampaignId}' AND (ContactId = '${safeMemberId}' OR LeadId = '${safeMemberId}') LIMIT 1`,
				},
			});
			memberIdToDelete = res.records?.[0]?.Id;
			if (!memberIdToDelete) {
				throw new Error(
					'No CampaignMember found for the requested campaign and member',
				);
			}
		}

		if (!memberIdToDelete) {
			throw new Error(
				'Either campaign_member_id or valid member_id (Contact/Lead ID) must be provided',
			);
		}

		await salesforceCall<void>(
			ctx,
			`sobjects/CampaignMember/${memberIdToDelete}`,
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
	const q = `SELECT Id, Name, Type, Status, StartDate, EndDate FROM Campaign${whereStr} LIMIT ${input.limit ?? 50}`;

	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });

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
		const response = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/Campaign',
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
		await salesforceCall<void>(ctx, `sobjects/Campaign/${input.id}`, {
			method: 'DELETE',
		});

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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			'sobjects/Campaign/describe',
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
		const response = await salesforceCall<{ Id: string }>(
			ctx,
			`sobjects/Campaign/${input.id}`,
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

export const updateCampaign: SalesforceEndpoints['updateCampaign'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } = input;
	const body = flattenFields(fields);
	await salesforceCall<void>(ctx, `sobjects/Campaign/${id}`, {
		method: 'PATCH',
		body,
	});
	await logEventFromContext(
		ctx,
		'salesforce.campaign.update',
		{ id },
		'completed',
	);
	return { success: true };
};

export const updateCampaignByIdWithJson: SalesforceEndpoints['updateCampaignByIdWithJson'] =
	updateCampaign as unknown as SalesforceEndpoints['updateCampaignByIdWithJson'];
