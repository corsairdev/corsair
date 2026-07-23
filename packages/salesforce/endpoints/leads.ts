import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';

export const createLead: SalesforceEndpoints['createLead'] = async (
	ctx,
	input,
) => {
	const { CustomFields, ...rest } = input;
	const body = { ...rest, ...(CustomFields ?? {}) };

	const response = await makeSalesforceRequest<{
		id: string;
		success?: boolean;
	}>('sobjects/Lead', ctx.key, { method: 'POST', body });

	await logEventFromContext(ctx, 'salesforce.lead.create', input, 'completed');
	return response;
};

export const getLead: SalesforceEndpoints['getLead'] = async (ctx, input) => {
	const response = await makeSalesforceRequest<{ Id: string }>(
		`sobjects/Lead/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'salesforce.lead.get', input, 'completed');
	return response;
};

export const listLeads: SalesforceEndpoints['listLeads'] = async (
	ctx,
	input,
) => {
	const limit = input.limit ?? 200;
	const offsetStr = input.offset ? ` OFFSET ${input.offset}` : '';
	const whereStr = input.query ? ` WHERE ${input.query}` : '';
	const q = `SELECT Id, FirstName, LastName, Company, Email, Status FROM Lead${whereStr} LIMIT ${limit}${offsetStr}`;

	const response = await makeSalesforceRequest<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
		nextRecordsUrl?: string;
	}>('query', ctx.key, { method: 'GET', query: { q } });

	await logEventFromContext(ctx, 'salesforce.lead.list', input, 'completed');
	return response;
};

export const deleteLead: SalesforceEndpoints['deleteLead'] = async (
	ctx,
	input,
) => {
	await makeSalesforceRequest<void>(`sobjects/Lead/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

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

		await makeSalesforceRequest<void>(
			`sobjects/Lead/${input.leadId}`,
			ctx.key,
			{
				method: 'PATCH',
				body: {},
				headers,
			},
		);

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
		const response = await makeSalesforceRequest<{ id: string }>(
			'sobjects/Lead',
			ctx.key,
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
		await makeSalesforceRequest<void>(`sobjects/Lead/${input.id}`, ctx.key, {
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
	const response = await makeSalesforceRequest<{ Id: string }>(
		`sobjects/Lead/${input.id}`,
		ctx.key,
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
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			input.id ? `sobjects/Lead/${input.id}` : 'sobjects/Lead/describe',
			ctx.key,
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
