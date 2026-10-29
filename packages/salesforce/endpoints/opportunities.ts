import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { SalesforceOpportunityEntity } from '../schema/database';
import {
	cloneableFields,
	createableNames,
	escapeSoql,
	soqlWhere,
} from '../utils';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { flattenFields, salesforceCall } from './shared';

const LABEL = 'opportunity';

export const createOpportunity: SalesforceEndpoints['createOpportunity'] =
	async (ctx, input) => {
		const body = flattenFields(input);

		const response = await salesforceCall<{
			id: string;
			success?: boolean;
		}>(ctx, 'sobjects/Opportunity', { method: 'POST', body });

		await cacheEntity(
			ctx.db?.opportunity,
			SalesforceOpportunityEntity,
			{
				Id: response.id,
				...body,
			},
			{ label: LABEL },
		);

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
	const response = await salesforceCall<{ Id: string }>(
		ctx,
		`sobjects/Opportunity/${input.id}`,
		{ method: 'GET' },
	);

	await cacheEntity(
		ctx.db?.opportunity,
		SalesforceOpportunityEntity,
		response,
		{
			label: LABEL,
		},
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
		const queryClause = soqlWhere(input.query);
		const whereStr = queryClause ? ` WHERE ${queryClause}` : '';
		const q = `SELECT Id, Name, StageName, CloseDate, Amount, AccountId FROM Opportunity${whereStr} LIMIT ${limit}${offsetStr}`;

		const response = await salesforceCall<{
			totalSize: number;
			done: boolean;
			records: Array<Record<string, unknown>>;
			nextRecordsUrl?: string;
		}>(ctx, 'query', { method: 'GET', query: { q } });

		await cacheEntities(
			ctx.db?.opportunity,
			SalesforceOpportunityEntity,
			response.records,
			{ label: LABEL },
		);

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
		await salesforceCall<void>(ctx, `sobjects/Opportunity/${input.id}`, {
			method: 'DELETE',
		});

		await evictEntity(ctx.db?.opportunity, input.id, LABEL);

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
		const response = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/OpportunityLineItem',
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
		const orig = await salesforceCall<Record<string, unknown>>(
			ctx,
			`sobjects/Opportunity/${input.opportunityId}`,
			{ method: 'GET' },
		);
		const describe = await salesforceCall<{
			fields?: Array<{ name?: string; createable?: boolean }>;
		}>(ctx, 'sobjects/Opportunity/describe', { method: 'GET' });
		const fieldsToClone = cloneableFields(orig, createableNames(describe));

		if (input.name) fieldsToClone.Name = input.name;

		const created = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/Opportunity',
			{ method: 'POST', body: fieldsToClone },
		);

		if (input.cloneProducts) {
			const lineItemsRes = await salesforceCall<{
				records: Array<Record<string, unknown>>;
			}>(ctx, 'query', {
				method: 'GET',
				query: {
					q: `SELECT PricebookEntryId, Quantity, UnitPrice FROM OpportunityLineItem WHERE OpportunityId = '${escapeSoql(input.opportunityId)}'`,
				},
			});

			for (const item of lineItemsRes.records ?? []) {
				await salesforceCall<void>(ctx, 'sobjects/OpportunityLineItem', {
					method: 'POST',
					body: {
						OpportunityId: created.id,
						PricebookEntryId: item.PricebookEntryId,
						Quantity: item.Quantity,
						UnitPrice: item.UnitPrice,
					},
				});
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
			conditions.push(`Pricebook2Id = '${escapeSoql(input.pricebookId)}'`);
		const queryClause = soqlWhere(input.query);
		if (queryClause) conditions.push(queryClause);

		const whereStr = ` WHERE ${conditions.join(' AND ')}`;
		const q = `SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice, IsActive FROM PricebookEntry${whereStr} LIMIT ${limit}`;

		const response = await salesforceCall<{
			records: Array<Record<string, unknown>>;
		}>(ctx, 'query', { method: 'GET', query: { q } });

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
	const queryClause = soqlWhere(input.query);
	const whereStr = queryClause ? ` WHERE ${queryClause}` : '';
	const q = `SELECT Id, Name, IsActive, IsStandard FROM Pricebook2${whereStr} LIMIT ${limit}`;

	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });

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
		const response = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/Opportunity',
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
		await salesforceCall<void>(ctx, `sobjects/Opportunity/${input.id}`, {
			method: 'DELETE',
		});

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
		const queryClause = soqlWhere(input.query);
		const whereStr = queryClause ? ` WHERE ${queryClause}` : '';
		const q = `SELECT Id, Name, StageName, Amount FROM Opportunity${whereStr} LIMIT ${input.limit ?? 200}`;

		const response = await salesforceCall<{
			records: Array<Record<string, unknown>>;
		}>(ctx, 'query', { method: 'GET', query: { q } });

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
		const response = await salesforceCall<{ Id: string }>(
			ctx,
			`sobjects/Opportunity/${input.id}`,
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

export const updateOpportunity: SalesforceEndpoints['updateOpportunity'] =
	async (ctx, input) => {
		const { id, ...fields } = input;
		const body = flattenFields(fields);
		await salesforceCall<void>(ctx, `sobjects/Opportunity/${id}`, {
			method: 'PATCH',
			body,
		});
		await cacheEntity(
			ctx.db?.opportunity,
			SalesforceOpportunityEntity,
			{
				Id: id,
				...body,
			},
			{ label: LABEL },
		);
		await logEventFromContext(
			ctx,
			'salesforce.opportunity.update',
			{ id },
			'completed',
		);
		return { success: true };
	};

export const updateOpportunityById: SalesforceEndpoints['updateOpportunityById'] =
	updateOpportunity as unknown as SalesforceEndpoints['updateOpportunityById'];

export const searchOpportunities: SalesforceEndpoints['searchOpportunities'] =
	async (ctx, input) => {
		const terms: string[] = [];
		if (input.name) terms.push(`Name LIKE '%${escapeSoql(input.name)}%'`);
		if (input.accountId)
			terms.push(`AccountId = '${escapeSoql(input.accountId)}'`);
		if (input.stageName)
			terms.push(`StageName = '${escapeSoql(input.stageName)}'`);
		if (input.isClosed !== undefined)
			terms.push(`IsClosed = ${input.isClosed}`);
		const whereStr = terms.length > 0 ? ` WHERE ${terms.join(' AND ')}` : '';
		const q = `SELECT Id, Name, StageName, CloseDate, Amount, AccountId, IsClosed FROM Opportunity${whereStr} LIMIT ${input.limit ?? 50}`;
		const response = await salesforceCall<{
			records: Array<Record<string, unknown>>;
		}>(ctx, 'query', { method: 'GET', query: { q } });
		await cacheEntities(
			ctx.db?.opportunity,
			SalesforceOpportunityEntity,
			response.records,
			{ label: LABEL },
		);
		await logEventFromContext(
			ctx,
			'salesforce.opportunity.search',
			input,
			'completed',
		);
		return { records: response.records ?? [] };
	};
