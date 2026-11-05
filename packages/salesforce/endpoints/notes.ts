import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { escapeSoql, soqlWhere } from '../utils';
import { flattenFields, salesforceCall } from './shared';

export const createNote: SalesforceEndpoints['createNote'] = async (
	ctx,
	input,
) => {
	const response = await salesforceCall<{
		id: string;
		success?: boolean;
	}>(ctx, 'sobjects/Note', { method: 'POST', body: flattenFields(input) });

	await logEventFromContext(ctx, 'salesforce.note.create', input, 'completed');
	return response;
};

export const getNote: SalesforceEndpoints['getNote'] = async (ctx, input) => {
	const response = await salesforceCall<{
		Id: string;
		Title?: string;
		Body?: string;
	}>(ctx, `sobjects/Note/${input.id}`, { method: 'GET' });

	await logEventFromContext(ctx, 'salesforce.note.get', input, 'completed');
	return response;
};

export const listNotes: SalesforceEndpoints['listNotes'] = async (
	ctx,
	input,
) => {
	const limit = input.limit ?? 200;
	const conditions: string[] = [];
	if (input.parentId)
		conditions.push(`ParentId = '${escapeSoql(input.parentId)}'`);
	const queryClause = soqlWhere(input.query);
	if (queryClause) conditions.push(queryClause);

	const whereStr =
		conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
	const q = `SELECT Id, Title, Body, ParentId, CreatedDate FROM Note${whereStr} LIMIT ${limit}`;

	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });

	await logEventFromContext(ctx, 'salesforce.note.list', input, 'completed');
	return { records: response.records ?? [] };
};

export const deleteNote: SalesforceEndpoints['deleteNote'] = async (
	ctx,
	input,
) => {
	await salesforceCall<void>(ctx, `sobjects/Note/${input.id}`, {
		method: 'DELETE',
	});

	await logEventFromContext(ctx, 'salesforce.note.delete', input, 'completed');
	return { success: true };
};

/** @deprecated */
export const createNoteRecordWithContentTypeHeader: SalesforceEndpoints['createNoteRecordWithContentTypeHeader'] =
	async (ctx, input) => {
		const response = await salesforceCall<{ id: string }>(
			ctx,
			'sobjects/Note',
			{ method: 'POST', body: input },
		);

		await logEventFromContext(
			ctx,
			'salesforce.note.create_record_deprecated',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const removeNoteObjectById: SalesforceEndpoints['removeNoteObjectById'] =
	async (ctx, input) => {
		await salesforceCall<void>(ctx, `sobjects/Note/${input.id}`, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'salesforce.note.remove_deprecated',
			input,
			'completed',
		);
		return { success: true };
	};

/** @deprecated */
export const getNoteByIdWithFields: SalesforceEndpoints['getNoteByIdWithFields'] =
	async (ctx, input) => {
		const response = await salesforceCall<{ Id: string }>(
			ctx,
			`sobjects/Note/${input.id}`,
			{
				method: 'GET',
				query: input.fields ? { fields: input.fields.join(',') } : undefined,
			},
		);

		await logEventFromContext(
			ctx,
			'salesforce.note.get_by_id_with_fields_deprecated',
			input,
			'completed',
		);
		return response;
	};

/** @deprecated */
export const retrieveNoteObjectInformation: SalesforceEndpoints['retrieveNoteObjectInformation'] =
	async (ctx, input) => {
		const response = await salesforceCall<Record<string, unknown>>(
			ctx,
			input.id ? `sobjects/Note/${input.id}` : 'sobjects/Note/describe',
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'salesforce.note.retrieve_info_deprecated',
			input,
			'completed',
		);
		return { metadata: response };
	};

export const updateNote: SalesforceEndpoints['updateNote'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } = input;
	const body = flattenFields(fields);
	await salesforceCall<void>(ctx, `sobjects/Note/${id}`, {
		method: 'PATCH',
		body,
	});
	await logEventFromContext(ctx, 'salesforce.note.update', { id }, 'completed');
	return { success: true };
};

export const updateSpecificNoteById: SalesforceEndpoints['updateSpecificNoteById'] =
	updateNote as unknown as SalesforceEndpoints['updateSpecificNoteById'];

export const searchNotes: SalesforceEndpoints['searchNotes'] = async (
	ctx,
	input,
) => {
	const terms: string[] = [];
	if (input.title) terms.push(`Title LIKE '%${escapeSoql(input.title)}%'`);
	if (input.body) terms.push(`Body LIKE '%${escapeSoql(input.body)}%'`);
	if (input.parentId) terms.push(`ParentId = '${escapeSoql(input.parentId)}'`);
	const whereStr = terms.length > 0 ? ` WHERE ${terms.join(' AND ')}` : '';
	const q = `SELECT Id, Title, Body, ParentId, OwnerId FROM Note${whereStr} LIMIT ${input.limit ?? 50}`;
	const response = await salesforceCall<{
		records: Array<Record<string, unknown>>;
	}>(ctx, 'query', { method: 'GET', query: { q } });
	await logEventFromContext(ctx, 'salesforce.note.search', input, 'completed');
	return { records: response.records ?? [] };
};
