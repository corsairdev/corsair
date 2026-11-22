import type { PipelineCrmEndpoints } from '..';
import { call } from './call';
import {
	conditionsQuery,
	PipelineCrmEndpointInputSchemas as Inputs,
	PipelineCrmEndpointOutputSchemas as Outputs,
} from './types';

const V3 = '/api/v3';

export const list: PipelineCrmEndpoints['notesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.list',
			input: Inputs.notesList,
			output: Outputs.notesList,
		},
		input,
		({ conditions, page, perPage }) => ({
			method: 'GET',
			path: `${V3}/notes`,
			query: { ...conditionsQuery(conditions), page, per_page: perPage },
		}),
		{ log: (_, page_) => ({ count: page_.entries.length }) },
	);

export const create: PipelineCrmEndpoints['notesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.create',
			input: Inputs.notesCreate,
			output: Outputs.notesCreate,
		},
		input,
		({
			dealId,
			companyId,
			personId,
			userId,
			noteCategoryId,
			notifyUserIds,
			title,
			content,
		}) => ({
			method: 'POST',
			path: `${V3}/notes`,
			body: {
				note: {
					title,
					content,
					user_id: userId,
					deal_id: dealId,
					company_id: companyId,
					person_id: personId,
					note_category_id: noteCategoryId,
					notify_user_ids: notifyUserIds,
				},
			},
		}),
		{ log: (_, note) => ({ noteId: note.id ?? undefined }) },
	);

export const get: PipelineCrmEndpoints['notesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.get',
			input: Inputs.notesGet,
			output: Outputs.notesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `${V3}/notes/${id}` }),
		{ log: (_, note) => ({ noteId: note.id ?? undefined }) },
	);

export const update: PipelineCrmEndpoints['notesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.update',
			input: Inputs.notesUpdate,
			output: Outputs.notesUpdate,
		},
		input,
		({ id, userId, noteCategoryId, notifyUserIds, title, content }) => ({
			method: 'PUT',
			path: `${V3}/notes/${id}`,
			body: {
				note: {
					title,
					content,
					user_id: userId,
					note_category_id: noteCategoryId,
					notify_user_ids: notifyUserIds,
				},
			},
		}),
		{ log: ({ id }) => ({ noteId: id }) },
	);

export const deleteNote: PipelineCrmEndpoints['notesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.delete',
			input: Inputs.notesDelete,
			output: Outputs.notesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `${V3}/notes/${id}` }),
		{ log: ({ id }) => ({ noteId: id }) },
	);
