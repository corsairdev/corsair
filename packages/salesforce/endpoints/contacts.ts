import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';
import { escapeSoql } from '../utils';

export const createContact: SalesforceEndpoints['createContact'] = async (
	ctx,
	input,
) => {
	const { CustomFields, ...rest } = input;
	const body = { ...rest, ...(CustomFields ?? {}) };

	const response = await makeSalesforceRequest<{
		id: string;
		success?: boolean;
	}>('sobjects/Contact', ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'salesforce.contact.create',
		input,
		'completed',
	);
	return response;
};

export const getContact: SalesforceEndpoints['getContact'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		Id: string;
		LastName?: string;
	}>(`sobjects/Contact/${input.id}`, ctx.key, {
		method: 'GET',
		query: input.fields ? { fields: input.fields.join(',') } : undefined,
	});

	await logEventFromContext(ctx, 'salesforce.contact.get', input, 'completed');
	return response;
};

export const listContacts: SalesforceEndpoints['listContacts'] = async (
	ctx,
	input,
) => {
	const limit = input.limit ?? 200;
	const offsetStr = input.offset ? ` OFFSET ${input.offset}` : '';
	const conditions: string[] = [];
	if (input.accountId)
		conditions.push(`AccountId = '${escapeSoql(input.accountId)}'`);
	if (input.query) conditions.push(escapeSoql(input.query));

	const whereStr =
		conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
	const q = `SELECT Id, FirstName, LastName, Email, Phone, AccountId FROM Contact${whereStr} LIMIT ${limit}${offsetStr}`;

	const response = await makeSalesforceRequest<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
		nextRecordsUrl?: string;
	}>('query', ctx.key, { method: 'GET', query: { q } });

	await logEventFromContext(ctx, 'salesforce.contact.list', input, 'completed');
	return response;
};

export const deleteContact: SalesforceEndpoints['deleteContact'] = async (
	ctx,
	input,
) => {
	await makeSalesforceRequest<void>(`sobjects/Contact/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'salesforce.contact.delete',
		input,
		'completed',
	);
	return { success: true };
};

export const associateContactToAccount: SalesforceEndpoints['associateContactToAccount'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(
			`sobjects/Contact/${input.contactId}`,
			ctx.key,
			{
				method: 'PATCH',
				body: { AccountId: input.accountId },
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.contact.associate_account',
			input,
			'completed',
		);
		return { success: true };
	};

/** @deprecated */
export const createNewContactWithJsonHeader: SalesforceEndpoints['createNewContactWithJsonHeader'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ id: string }>(
			'sobjects/Contact',
			ctx.key,
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'salesforce.contact.create_deprecated',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const queryContactsByName: SalesforceEndpoints['queryContactsByName'] =
	async (ctx, input) => {
		const q = `SELECT Id, FirstName, LastName, Email FROM Contact WHERE Name LIKE '%${escapeSoql(input.name)}%'`;
		const response = await makeSalesforceRequest<{
			records: Array<Record<string, unknown>>;
		}>('query', ctx.key, { method: 'GET', query: { q } });

		await logEventFromContext(
			ctx,
			'salesforce.contact.query_by_name_deprecated',
			input,
			'completed',
		);
		return { records: response.records ?? [] };
	};

/** @deprecated */
export const removeASpecificContactById: SalesforceEndpoints['removeASpecificContactById'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(`sobjects/Contact/${input.id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'salesforce.contact.remove_deprecated',
			input,
			'completed',
		);
		return { success: true };
	};

/** @deprecated */
export const retrieveContactInfoWithStandardResponses: SalesforceEndpoints['retrieveContactInfoWithStandardResponses'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			input.id ? `sobjects/Contact/${input.id}` : 'sobjects/Contact/describe',
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.contact.retrieve_info_deprecated',
			input,
			'completed',
		);
		return { metadata: response };
	};

export const getContactById: SalesforceEndpoints['getContactById'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{ Id: string }>(
		`sobjects/Contact/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'salesforce.contact.get_by_id',
		input,
		'completed',
	);
	return response;
};
