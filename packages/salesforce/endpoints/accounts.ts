import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';
import { escapeSoql } from '../utils';

export const createAccount: SalesforceEndpoints['createAccount'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		id: string;
		success: boolean;
	}>('sobjects/Account', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'salesforce.account.created',
		input,
		'completed',
	);
	return response;
};

export const getAccount: SalesforceEndpoints['getAccount'] = async (
	ctx,
	input,
) => {
	const fields =
		input.fields?.join(',') ||
		'Id,Name,Type,Industry,Phone,Website,CreatedDate';
	const response = await makeSalesforceRequest<{
		Id: string;
		[key: string]: unknown;
	}>(`sobjects/Account/${input.id}?fields=${fields}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'salesforce.account.get', input, 'completed');
	return response;
};

export const listAccounts: SalesforceEndpoints['listAccounts'] = async (
	ctx,
	input,
) => {
	const fieldsStr = input.fields?.length
		? input.fields.join(', ')
		: 'Id, Name, Type, Industry, Phone, Website';
	const limit = input.limit ?? 200;
	const offsetStr = input.offset ? ` OFFSET ${input.offset}` : '';
	const whereStr = input.query ? ` WHERE ${escapeSoql(input.query)}` : '';
	const q = `SELECT ${fieldsStr} FROM Account${whereStr} LIMIT ${limit}${offsetStr}`;

	const response = await makeSalesforceRequest<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
		nextRecordsUrl?: string;
	}>('query', ctx.key, { method: 'GET', query: { q } });

	await logEventFromContext(ctx, 'salesforce.account.list', input, 'completed');
	return response;
};

export const searchAccounts: SalesforceEndpoints['searchAccounts'] = async (
	ctx,
	input,
) => {
	const terms: string[] = [];
	if (input.name) terms.push(`Name LIKE '%${escapeSoql(input.name)}%'`);
	if (input.industry) terms.push(`Industry = '${escapeSoql(input.industry)}'`);
	if (input.type) terms.push(`Type = '${escapeSoql(input.type)}'`);
	if (input.phone) terms.push(`Phone LIKE '%${escapeSoql(input.phone)}%'`);

	const whereClause = terms.length > 0 ? ` WHERE ${terms.join(' AND ')}` : '';
	const limit = input.limit ?? 50;
	const q = `SELECT Id, Name, Type, Industry, Phone, Website FROM Account${whereClause} LIMIT ${limit}`;

	const response = await makeSalesforceRequest<{
		records: Array<Record<string, unknown>>;
	}>('query', ctx.key, { method: 'GET', query: { q } });

	await logEventFromContext(
		ctx,
		'salesforce.account.search',
		input,
		'completed',
	);
	return { records: response.records ?? [] };
};

export const deleteAccount: SalesforceEndpoints['deleteAccount'] = async (
	ctx,
	input,
) => {
	await makeSalesforceRequest<void>(`sobjects/Account/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'salesforce.account.deleted',
		input,
		'completed',
	);
	return { success: true };
};

export const accountCreationWithContentTypeOption: SalesforceEndpoints['accountCreationWithContentTypeOption'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{
			id: string;
			success: boolean;
		}>('sobjects/Account', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'salesforce.account.creation_with_content_type',
			input,
			'completed',
		);
		return response;
	};

export const fetchAccountByIdWithQuery: SalesforceEndpoints['fetchAccountByIdWithQuery'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{
			Id: string;
			[key: string]: unknown;
		}>(`sobjects/Account/${input.id}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'salesforce.account.fetch_by_id_with_query',
			input,
			'completed',
		);
		return response;
	};

export const removeAccountByUniqueIdentifier: SalesforceEndpoints['removeAccountByUniqueIdentifier'] =
	async (ctx, input) => {
		await makeSalesforceRequest<void>(`sobjects/Account/${input.id}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'salesforce.account.remove_by_unique_identifier',
			input,
			'completed',
		);
		return { success: true };
	};

export const retrieveAccountDataAndErrorResponses: SalesforceEndpoints['retrieveAccountDataAndErrorResponses'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			`sobjects/Account/${input.id}/describe`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.account.retrieve_data_and_error_responses',
			input,
			'completed',
		);
		return { objectDescribe: response };
	};
