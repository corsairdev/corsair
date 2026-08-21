import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { SalesforceContactEntity } from '../schema/database';
import { escapeSoql, soqlWhere } from '../utils';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import { flattenFields, salesforceCall } from './shared';

const LABEL = 'contact';

export const createContact: SalesforceEndpoints['createContact'] = async (
	ctx,
	input,
) => {
	const body = flattenFields(input);

	const response = await salesforceCall<{
		id: string;
		success?: boolean;
	}>(ctx, 'sobjects/Contact', { method: 'POST', body });

	await cacheEntity(
		ctx.db?.contact,
		SalesforceContactEntity,
		{
			Id: response.id,
			...body,
		},
		{ label: LABEL },
	);

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
	const response = await salesforceCall<{
		Id: string;
		LastName?: string;
	}>(ctx, `sobjects/Contact/${input.id}`, {
		method: 'GET',
		query: input.fields ? { fields: input.fields.join(',') } : undefined,
	});

	await cacheEntity(ctx.db?.contact, SalesforceContactEntity, response, {
		label: LABEL,
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
	const queryClause = soqlWhere(input.query);
	if (queryClause) conditions.push(queryClause);

	const whereStr =
		conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
	const q = `SELECT Id, FirstName, LastName, Email, Phone, AccountId FROM Contact${whereStr} LIMIT ${limit}${offsetStr}`;

	const response = await salesforceCall<{
		totalSize: number;
		done: boolean;
		records: Array<Record<string, unknown>>;
		nextRecordsUrl?: string;
	}>(ctx, 'query', { method: 'GET', query: { q } });

	await cacheEntities(
		ctx.db?.contact,
		SalesforceContactEntity,
		response.records,
		{ label: LABEL },
	);

	await logEventFromContext(ctx, 'salesforce.contact.list', input, 'completed');
	return response;
};

export const deleteContact: SalesforceEndpoints['deleteContact'] = async (
	ctx,
	input,
) => {
	await salesforceCall<void>(ctx, `sobjects/Contact/${input.id}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db?.contact, input.id, LABEL);

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
		await salesforceCall<void>(ctx, `sobjects/Contact/${input.contactId}`, {
			method: 'PATCH',
			body: { AccountId: input.accountId },
		});

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
		const response = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/Contact',
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
		const response = await salesforceCall<{
			records: Array<Record<string, unknown>>;
		}>(ctx, 'query', { method: 'GET', query: { q } });

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
		await salesforceCall<void>(ctx, `sobjects/Contact/${input.id}`, {
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
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			'sobjects/Contact/describe',
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
	const response = await salesforceCall<{ Id: string }>(
		ctx,
		`sobjects/Contact/${input.id}`,
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

export const updateContact: SalesforceEndpoints['updateContact'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } = input;
	const body = flattenFields(fields);
	await salesforceCall<void>(ctx, `sobjects/Contact/${id}`, {
		method: 'PATCH',
		body,
	});
	await cacheEntity(
		ctx.db?.contact,
		SalesforceContactEntity,
		{
			Id: id,
			...body,
		},
		{ label: LABEL },
	);
	await logEventFromContext(
		ctx,
		'salesforce.contact.update',
		{ id },
		'completed',
	);
	return { success: true };
};

export const updateContactById: SalesforceEndpoints['updateContactById'] =
	updateContact as unknown as SalesforceEndpoints['updateContactById'];

export const searchContacts: SalesforceEndpoints['searchContacts'] = async (
	ctx,
	input,
) => {
	const terms: string[] = [];
	if (input.name) terms.push(`Name LIKE '%${escapeSoql(input.name)}%'`);
	if (input.email) terms.push(`Email LIKE '%${escapeSoql(input.email)}%'`);
	if (input.phone) terms.push(`Phone LIKE '%${escapeSoql(input.phone)}%'`);
	if (input.accountId)
		terms.push(`AccountId = '${escapeSoql(input.accountId)}'`);
	if (input.title) terms.push(`Title LIKE '%${escapeSoql(input.title)}%'`);
	const whereStr = terms.length > 0 ? ` WHERE ${terms.join(' AND ')}` : '';
	const q = `SELECT Id, FirstName, LastName, Email, Phone, AccountId, Title FROM Contact${whereStr} LIMIT ${input.limit ?? 50}`;
	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });
	await cacheEntities(
		ctx.db?.contact,
		SalesforceContactEntity,
		response.records,
		{ label: LABEL },
	);
	await logEventFromContext(
		ctx,
		'salesforce.contact.search',
		input,
		'completed',
	);
	return { records: response.records ?? [] };
};
