import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';

export const createOpportunity: SalesforceEndpoints['createOpportunity'] =
	async (ctx, input) => {
		const { CustomFields, ...rest } = input;
		const body = { ...rest, ...(CustomFields ?? {}) };

		const response = await makeSalesforceRequest<{
			id: string;
			success?: boolean;
		}>('sobjects/Opportunity', ctx.key, { method: 'POST', body });

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.create',
			input,
			'completed',
		);
		return response;
	};

export const getOpportunity: SalesforceEndpoints['getOpportunity'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{ Id: string }>(
		`sobjects/Opportunity/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.opportunity.get',
		input,
		'completed',
	);
	return response;
};

export const listOpportunities: SalesforceEndpoints['listOpportunities'] =
	async (ctx, input) => {
		const limit = input.limit ?? 200;
		const offsetStr = input.offset ? ` OFFSET ${input.offset}` : '';
		const whereStr = input.query ? ` WHERE ${input.query}` : '';
		const q = `SELECT Id, Name, StageName, CloseDate, Amount, AccountId FROM Opportunity${whereStr} LIMIT ${limit}${offsetStr}`;

		const response = await makeSalesforceRequest<{
			totalSize: number;
			done: boolean;
			records: Array<Record<string, unknown>>;
			nextRecordsUrl?: string;
		}>('query', ctx.key, { method: 'GET', query: { q } });

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.list',
			input,
			'completed',
		);
		return response;
	};

export const deleteOpportunity: SalesforceEndpoints['deleteOpportunity'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(
			`sobjects/Opportunity/${input.id}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.delete',
			input,
			'completed',
		);
		return { success: true };
	};

export const addOpportunityLineItem: SalesforceEndpoints['addOpportunityLineItem'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ id: string }>(
			'sobjects/OpportunityLineItem',
			ctx.key,
			{
				method: 'POST',
				body: input,
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.add_line_item',
			input,
			'completed',
		);
		return response;
	};

export const cloneOpportunityWithProducts: SalesforceEndpoints['cloneOpportunityWithProducts'] =
	async (ctx, input) => {
		const orig = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/Opportunity/${input.opportunityId}`,
			ctx.key,
			{ method: 'GET' },
		);

		const {
			Id,
			CreatedDate,
			CreatedById,
			LastModifiedDate,
			LastModifiedById,
			SystemModstamp,
			...fieldsToClone
		} = orig;

		if (input.name) fieldsToClone.Name = input.name;

		const created = await makeSalesforceRequest<{ id: string }>(
			'sobjects/Opportunity',
			ctx.key,
			{ method: 'POST', body: fieldsToClone },
		);

		if (input.cloneProducts) {
			const lineItemsRes = await makeSalesforceRequest<{
				records: Array<Record<string, unknown>>;
			}>('query', ctx.key, {
				method: 'GET',
				query: {
					q: `SELECT PricebookEntryId, Quantity, UnitPrice FROM OpportunityLineItem WHERE OpportunityId = '${input.opportunityId}'`,
				},
			});

			for (const item of lineItemsRes.records ?? []) {
				await makeSalesforceRequest<void>(
					'sobjects/OpportunityLineItem',
					ctx.key,
					{
						method: 'POST',
						body: {
							OpportunityId: created.id,
							PricebookEntryId: item.PricebookEntryId,
							Quantity: item.Quantity,
							UnitPrice: item.UnitPrice,
						},
					},
				);
			}
		}

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.clone',
			input,
			'completed',
		);
		return { id: created.id };
	};

export const listPricebookEntries: SalesforceEndpoints['listPricebookEntries'] =
	async (ctx, input) => {
		const limit = input.limit ?? 200;
		const conditions = ['IsActive = true'];
		if (input.pricebookId)
			conditions.push(`Pricebook2Id = '${input.pricebookId}'`);
		if (input.query) conditions.push(input.query);

		const whereStr = ` WHERE ${conditions.join(' AND ')}`;
		const q = `SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice, IsActive FROM PricebookEntry${whereStr} LIMIT ${limit}`;

		const response = await makeSalesforceRequest<{
			records: Array<Record<string, unknown>>;
		}>('query', ctx.key, { method: 'GET', query: { q } });

		await logEventFromContext(
			ctx,
			'salesforce.pricebook_entries.list',
			input,
			'completed',
		);
		return { records: response.records ?? [] };
	};

export const listPricebooks: SalesforceEndpoints['listPricebooks'] = async (
	ctx,
	input,
) => {
	const limit = input.limit ?? 200;
	const whereStr = input.query ? ` WHERE ${input.query}` : '';
	const q = `SELECT Id, Name, IsActive, IsStandard FROM Pricebook2${whereStr} LIMIT ${limit}`;

	const response = await makeSalesforceRequest<{
		records: Array<Record<string, unknown>>;
	}>('query', ctx.key, { method: 'GET', query: { q } });

	await logEventFromContext(
		ctx,
		'salesforce.pricebooks.list',
		input,
		'completed',
	);
	return { records: response.records ?? [] };
};

/** @deprecated */
export const createOpportunityRecord: SalesforceEndpoints['createOpportunityRecord'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ id: string }>(
			'sobjects/Opportunity',
			ctx.key,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.create_deprecated',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const removeOpportunityById: SalesforceEndpoints['removeOpportunityById'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(
			`sobjects/Opportunity/${input.id}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.remove_deprecated',
			input,
			'completed',
		);
		return { success: true };
	};

export const retrieveOpportunitiesData: SalesforceEndpoints['retrieveOpportunitiesData'] =
	async (ctx, input) => {
		const whereStr = input.query ? ` WHERE ${input.query}` : '';
		const q = `SELECT Id, Name, StageName, Amount FROM Opportunity${whereStr}`;

		const response = await makeSalesforceRequest<{
			records: Array<Record<string, unknown>>;
		}>('query', ctx.key, { method: 'GET', query: { q } });

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.retrieve_data',
			input,
			'completed',
		);
		return { records: response.records ?? [] };
	};

/** @deprecated */
export const retrieveOpportunityByIdWithOptionalFields: SalesforceEndpoints['retrieveOpportunityByIdWithOptionalFields'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ Id: string }>(
			`sobjects/Opportunity/${input.id}`,
			ctx.key,
			{
				method: 'GET',
				query: input.fields ? { fields: input.fields.join(',') } : undefined,
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.opportunity.retrieve_by_id_deprecated',
			input,
			'completed',
		);
		return response;
	};
