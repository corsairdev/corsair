import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { SalesforceAccountEntity } from '../schema/database';
import { escapeSoql } from '../utils';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { flattenFields, salesforceCall, soqlList } from './shared';

const LABEL = 'account';
const DEFAULT_FIELDS = [
	'Id',
	'Name',
	'Type',
	'Industry',
	'Phone',
	'Website',
	'OwnerId',
	'CreatedDate',
	'LastModifiedDate',
];

export const createAccount: SalesforceEndpoints['createAccount'] = async (
	ctx,
	input,
) => {
	const body = flattenFields(input);
	const response = await salesforceCall<{
		id: string;
		success: boolean;
		errors?: unknown[];
	}>(ctx, 'sobjects/Account', { method: 'POST', body });

	await cacheEntity(
		ctx.db?.account,
		SalesforceAccountEntity,
		{
			Id: response.id,
			...body,
		},
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'salesforce.account.created',
		{ Name: input.Name },
		'completed',
	);
	return response;
};

export const getAccount: SalesforceEndpoints['getAccount'] = async (
	ctx,
	input,
) => {
	const fields = input.fields?.join(',') || DEFAULT_FIELDS.join(',');
	const response = await salesforceCall<{
		Id: string;
		Name?: string;
	}>(ctx, `sobjects/Account/${input.id}`, { method: 'GET', query: { fields } });

	await cacheEntity(ctx.db?.account, SalesforceAccountEntity, response, {
		label: LABEL,
	});

	await logEventFromContext(ctx, 'salesforce.account.get', input, 'completed');
	return response;
};

export const listAccounts: SalesforceEndpoints['listAccounts'] = async (
	ctx,
	input,
) => {
	const fields = input.fields?.length ? input.fields : DEFAULT_FIELDS;
	const q = soqlList('Account', fields, input);

	const response = await salesforceCall<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
		nextRecordsUrl?: string;
	}>(ctx, 'query', { method: 'GET', query: { q } });

	await cacheEntities(
		ctx.db?.account,
		SalesforceAccountEntity,
		response.records,
		{ label: LABEL },
	);

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

	const q = soqlList('Account', DEFAULT_FIELDS, {
		limit: input.limit ?? 50,
		query: terms.length > 0 ? terms.join(' AND ') : undefined,
	});

	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });

	await cacheEntities(
		ctx.db?.account,
		SalesforceAccountEntity,
		response.records,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'salesforce.account.search',
		input,
		'completed',
	);
	return { records: response.records ?? [] };
};

export const updateAccount: SalesforceEndpoints['updateAccount'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } = input;
	const body = flattenFields(fields);
	await salesforceCall<void>(ctx, `sobjects/Account/${id}`, {
		method: 'PATCH',
		body,
	});

	await cacheEntity(
		ctx.db?.account,
		SalesforceAccountEntity,
		{
			Id: id,
			...body,
		},
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'salesforce.account.update',
		{ id },
		'completed',
	);
	return { success: true };
};

export const deleteAccount: SalesforceEndpoints['deleteAccount'] = async (
	ctx,
	input,
) => {
	await salesforceCall<void>(ctx, `sobjects/Account/${input.id}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db?.account, input.id, LABEL);

	await logEventFromContext(
		ctx,
		'salesforce.account.deleted',
		input,
		'completed',
	);
	return { success: true };
};

export const accountCreationWithContentTypeOption: SalesforceEndpoints['accountCreationWithContentTypeOption'] =
	createAccount as unknown as SalesforceEndpoints['accountCreationWithContentTypeOption'];

export const fetchAccountByIdWithQuery: SalesforceEndpoints['fetchAccountByIdWithQuery'] =
	async (ctx, input) => {
		const fields = input.fields
			? input.fields.split(',').map((f) => f.trim())
			: undefined;
		return await getAccount(ctx, { id: input.id, fields });
	};

export const removeAccountByUniqueIdentifier: SalesforceEndpoints['removeAccountByUniqueIdentifier'] =
	deleteAccount as unknown as SalesforceEndpoints['removeAccountByUniqueIdentifier'];

export const retrieveAccountDataAndErrorResponses: SalesforceEndpoints['retrieveAccountDataAndErrorResponses'] =
	async (ctx, input) => {
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			'sobjects/Account/describe',
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

export const updateAccountObjectById: SalesforceEndpoints['updateAccountObjectById'] =
	updateAccount as unknown as SalesforceEndpoints['updateAccountObjectById'];
