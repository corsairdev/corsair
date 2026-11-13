import { logEventFromContext } from 'corsair/core';
import type { FolkEndpoints } from '..';
import { makeFolkRequest } from '../client';
import type {
	NotesCreateResponse,
	NotesDeleteResponse,
	NotesGetResponse,
	NotesListResponse,
	NotesUpdateResponse,
} from './types';
import { FolkEndpointInputSchemas, FolkEndpointOutputSchemas } from './types';

export const list: FolkEndpoints['notesList'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.notesList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.cursor !== undefined) query.cursor = parsedInput.cursor;
	if (parsedInput.entityId !== undefined)
		query['entity.id'] = parsedInput.entityId;
	if (parsedInput.query !== undefined) query.query = parsedInput.query;
	if (parsedInput.createdAfter !== undefined)
		query.createdAfter = parsedInput.createdAfter;
	if (parsedInput.createdBefore !== undefined)
		query.createdBefore = parsedInput.createdBefore;

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<NotesListResponse>(
		'/notes',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed = FolkEndpointOutputSchemas.notesList.parse(response);

	await logEventFromContext(
		ctx,
		'folk.notes.list',
		{ count: parsed.data.items.length },
		'completed',
	);

	return parsed;
};

export const get: FolkEndpoints['notesGet'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.notesGet.parse(input);

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<NotesGetResponse>(
		`/notes/${encodeURIComponent(parsedInput.noteId)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = FolkEndpointOutputSchemas.notesGet.parse(response);

	await logEventFromContext(
		ctx,
		'folk.notes.get',
		{ noteId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const create: FolkEndpoints['notesCreate'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.notesCreate.parse(input);
	const { idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<NotesCreateResponse>(
		'/notes',
		ctx.key,
		{
			method: 'POST',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.notesCreate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.notes.create',
		{ noteId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const update: FolkEndpoints['notesUpdate'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.notesUpdate.parse(input);
	const { noteId, idempotencyKey, ...body } = parsedInput;

	const headers: Record<string, string> = {};
	if (idempotencyKey) {
		headers['Idempotency-Key'] = idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<NotesUpdateResponse>(
		`/notes/${encodeURIComponent(noteId)}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.notesUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'folk.notes.update',
		{ noteId: parsed.data.id },
		'completed',
	);

	return parsed;
};

export const deleteNote: FolkEndpoints['notesDelete'] = async (ctx, input) => {
	const parsedInput = FolkEndpointInputSchemas.notesDelete.parse(input);
	const headers: Record<string, string> = {};
	if (parsedInput.idempotencyKey) {
		headers['Idempotency-Key'] = parsedInput.idempotencyKey;
	}

	// `unknown` because response JSON from makeFolkRequest is untrusted until validated by Zod schema below.
	const response: unknown = await makeFolkRequest<NotesDeleteResponse>(
		`/notes/${encodeURIComponent(parsedInput.noteId)}`,
		ctx.key,
		{
			method: 'DELETE',
			headers,
		},
	);

	const parsed = FolkEndpointOutputSchemas.notesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'folk.notes.delete',
		{ noteId: parsed.data.id },
		'completed',
	);

	return parsed;
};
