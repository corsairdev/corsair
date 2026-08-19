import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { SalesforceLeadEntity } from '../schema/database';
import { escapeSoql, soqlWhere } from '../utils';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { flattenFields, salesforceCall } from './shared';

const LABEL = 'lead';

export const createLead: SalesforceEndpoints['createLead'] = async (
	ctx,
	input,
) => {
	const body = flattenFields(input);

	const response = await salesforceCall<{
		id: string;
		success?: boolean;
	}>(ctx, 'sobjects/Lead', { method: 'POST', body });

	await cacheEntity(
		ctx.db?.lead,
		SalesforceLeadEntity,
		{
			Id: response.id,
			...body,
		},
		{ label: LABEL },
	);

	await logEventFromContext(ctx, 'salesforce.lead.create', input, 'completed');
	return response;
};

export const getLead: SalesforceEndpoints['getLead'] = async (ctx, input) => {
	const response = await salesforceCall<{ Id: string }>(
		ctx,
		`sobjects/Lead/${input.id}`,
		{ method: 'GET' },
	);

	await cacheEntity(ctx.db?.lead, SalesforceLeadEntity, response, {
		label: LABEL,
	});

	await logEventFromContext(ctx, 'salesforce.lead.get', input, 'completed');
	return response;
};

export const listLeads: SalesforceEndpoints['listLeads'] = async (
	ctx,
	input,
) => {
	const limit = input.limit ?? 200;
	const offsetStr = input.offset ? ` OFFSET ${input.offset}` : '';
	const queryClause = soqlWhere(input.query);
	const whereStr = queryClause ? ` WHERE ${queryClause}` : '';
	const q = `SELECT Id, FirstName, LastName, Company, Email, Status FROM Lead${whereStr} LIMIT ${limit}${offsetStr}`;

	const response = await salesforceCall<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
		nextRecordsUrl?: string;
	}>(ctx, 'query', { method: 'GET', query: { q } });

	await cacheEntities(ctx.db?.lead, SalesforceLeadEntity, response.records, {
		label: LABEL,
	});

	await logEventFromContext(ctx, 'salesforce.lead.list', input, 'completed');
	return response;
};

export const deleteLead: SalesforceEndpoints['deleteLead'] = async (
	ctx,
	input,
) => {
	await salesforceCall<void>(ctx, `sobjects/Lead/${input.id}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db?.lead, input.id, LABEL);

	await logEventFromContext(ctx, 'salesforce.lead.delete', input, 'completed');
	return { success: true };
};

export const applyLeadAssignmentRules: SalesforceEndpoints['applyLeadAssignmentRules'] =
	async (ctx, input) => {
		const headers: Record<string, string> = {};
		if (input.assignmentRuleId) {
			headers['Sforce-Auto-Assign'] = input.assignmentRuleId;
		} else {
			headers['Sforce-Auto-Assign'] = 'TRUE';
		}

		await salesforceCall<void>(ctx, `sobjects/Lead/${input.leadId}`, {
			method: 'PATCH',
			body: {},
			headers,
		});

		await logEventFromContext(
			ctx,
			'salesforce.lead.apply_assignment_rules',
			input,
			'completed',
		);
		return { success: true };
	};

/** @deprecated */
export const createLeadWithSpecifiedContentType: SalesforceEndpoints['createLeadWithSpecifiedContentType'] =
	async (ctx, input) => {
		const response = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/Lead',
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'salesforce.lead.create_deprecated',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const deleteALeadObjectByItsId: SalesforceEndpoints['deleteALeadObjectByItsId'] =
	async (ctx, input) => {
		await salesforceCall<void>(ctx, `sobjects/Lead/${input.id}`, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'salesforce.lead.delete_deprecated',
			input,
			'completed',
		);
		return { success: true };
	};

export const retrieveLeadById: SalesforceEndpoints['retrieveLeadById'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<{ Id: string }>(
		ctx,
		`sobjects/Lead/${input.id}`,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.lead.retrieve_by_id',
		input,
		'completed',
	);
	return response;
};

/** @deprecated */
export const retrieveLeadDataWithVariousResponses: SalesforceEndpoints['retrieveLeadDataWithVariousResponses'] =
	async (ctx, input) => {
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			input.id ? `sobjects/Lead/${input.id}` : 'sobjects/Lead/describe',
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.lead.retrieve_various_deprecated',
			input,
			'completed',
		);
		return { records: [response] };
	};

export const updateLead: SalesforceEndpoints['updateLead'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } = input;
	const body = flattenFields(fields);
	await salesforceCall<void>(ctx, `sobjects/Lead/${id}`, {
		method: 'PATCH',
		body,
	});
	await cacheEntity(
		ctx.db?.lead,
		SalesforceLeadEntity,
		{
			Id: id,
			...body,
		},
		{ label: LABEL },
	);
	await logEventFromContext(ctx, 'salesforce.lead.update', { id }, 'completed');
	return { success: true };
};

export const updateLeadByIdWithJsonPayload: SalesforceEndpoints['updateLeadByIdWithJsonPayload'] =
	updateLead as unknown as SalesforceEndpoints['updateLeadByIdWithJsonPayload'];

export const searchLeads: SalesforceEndpoints['searchLeads'] = async (
	ctx,
	input,
) => {
	const terms: string[] = [];
	if (input.name) terms.push(`Name LIKE '%${escapeSoql(input.name)}%'`);
	if (input.email) terms.push(`Email LIKE '%${escapeSoql(input.email)}%'`);
	if (input.phone) terms.push(`Phone LIKE '%${escapeSoql(input.phone)}%'`);
	if (input.company)
		terms.push(`Company LIKE '%${escapeSoql(input.company)}%'`);
	if (input.status) terms.push(`Status = '${escapeSoql(input.status)}'`);
	if (input.title) terms.push(`Title LIKE '%${escapeSoql(input.title)}%'`);
	const whereStr = terms.length > 0 ? ` WHERE ${terms.join(' AND ')}` : '';
	const q = `SELECT Id, FirstName, LastName, Company, Email, Status, Phone FROM Lead${whereStr} LIMIT ${input.limit ?? 50}`;
	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });
	await cacheEntities(ctx.db?.lead, SalesforceLeadEntity, response.records, {
		label: LABEL,
	});
	await logEventFromContext(ctx, 'salesforce.lead.search', input, 'completed');
	return { records: response.records ?? [] };
};
