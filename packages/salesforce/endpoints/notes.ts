import { logEventFromContext } from 'corsair/core';
import type { SalesforceEndpoints } from '..';
import { makeSalesforceRequest } from '../client';

export const createNote: SalesforceEndpoints['createNote'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesforceRequest<{
		id: string;
		success?: boolean;
	}>('sobjects/Note', ctx.key, { method: 'POST', body: input });

	await logEventFromContext(ctx, 'salesforce.note.create', input, 'completed');
	return response;
};

export const getNote: SalesforceEndpoints['getNote'] = async (ctx, input) => {
	const response = await makeSalesforceRequest<{
		Id: string;
		Title?: string;
		Body?: string;
	}>(`sobjects/Note/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'salesforce.note.get', input, 'completed');
	return response;
};

export const listNotes: SalesforceEndpoints['listNotes'] = async (
	ctx,
	input,
) => {
	const limit = input.limit ?? 200;
	const conditions: string[] = [];
	if (input.parentId) conditions.push(`ParentId = '${input.parentId}'`);
	if (input.query) conditions.push(input.query);

	const whereStr =
		conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
	const q = `SELECT Id, Title, Body, ParentId, CreatedDate FROM Note${whereStr} LIMIT ${limit}`;

	const response = await makeSalesforceRequest<{
		records: Array<Record<string, unknown>>;
	}>('query', ctx.key, { method: 'GET', query: { q } });

	await logEventFromContext(ctx, 'salesforce.note.list', input, 'completed');
	return { records: response.records ?? [] };
};

export const deleteNote: SalesforceEndpoints['deleteNote'] = async (
	ctx,
	input,
) => {
	await makeSalesforceRequest<void>(`sobjects/Note/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(ctx, 'salesforce.note.delete', input, 'completed');
	return { success: true };
};

/** @deprecated */
export const createNoteRecordWithContentTypeHeader: SalesforceEndpoints['createNoteRecordWithContentTypeHeader'] =
	async (ctx, input) => {
		const response = await makeSalesforceRequest<{ id: string }>(
			'sobjects/Note',
			ctx.key,
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
		await makeSalesforceRequest<void>(`sobjects/Note/${input.id}`, ctx.key, {
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
		const response = await makeSalesforceRequest<{ Id: string }>(
			`sobjects/Note/${input.id}`,
			ctx.key,
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
		const response = await makeSalesforceRequest<Record<string, unknown>>(
			input.id ? `sobjects/Note/${input.id}` : 'sobjects/Note/describe',
			ctx.key,
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
