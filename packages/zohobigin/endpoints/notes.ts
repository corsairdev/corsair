import { logEventFromContext } from 'corsair/core';
import type { ZohoBiginEndpoints } from '..';
import { makeZohoBiginRequest } from '../client';
import type { ZohoBiginEndpointOutputs } from './types';

export const createNotes: ZohoBiginEndpoints['createNotes'] = async (
	ctx,
	input,
) => {
	const { data } = input;
	const response = await makeZohoBiginRequest<
		ZohoBiginEndpointOutputs['createNotes']
	>('Notes', ctx.key, {
		method: 'POST',
		body: { data },
	});

	await logEventFromContext(ctx, 'zohobigin.notes.create', {}, 'completed');
	return response;
};

export const createRecordNotes: ZohoBiginEndpoints['createRecordNotes'] =
	async (ctx, input) => {
		const { module, recordId, data } = input;
		const response = await makeZohoBiginRequest<
			ZohoBiginEndpointOutputs['createRecordNotes']
		>(`${module}/${recordId}/Notes`, ctx.key, {
			method: 'POST',
			body: { data: [data] },
		});

		await logEventFromContext(
			ctx,
			'zohobigin.notes.createRecordNotes',
			{ module, recordId },
			'completed',
		);
		return response;
	};

export const deleteNote: ZohoBiginEndpoints['deleteNote'] = async (
	ctx,
	input,
) => {
	const { module, recordId, noteId } = input;
	const response = await makeZohoBiginRequest<
		ZohoBiginEndpointOutputs['deleteNote']
	>(`${module}/${recordId}/Notes/${noteId}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'zohobigin.notes.deleteNote',
		{ module, recordId, noteId },
		'completed',
	);
	return response;
};

export const deleteNotes: ZohoBiginEndpoints['deleteNotes'] = async (
	ctx,
	input,
) => {
	const { ids } = input;
	const response = await makeZohoBiginRequest<
		ZohoBiginEndpointOutputs['deleteNotes']
	>('Notes', ctx.key, {
		method: 'DELETE',
		query: { ids: ids.join(',') },
	});

	await logEventFromContext(
		ctx,
		'zohobigin.notes.deleteNotes',
		{ ids },
		'completed',
	);
	return response;
};

export const getAllNotes: ZohoBiginEndpoints['getAllNotes'] = async (
	ctx,
	input,
) => {
	const { page, per_page, fields } = input;
	const response = await makeZohoBiginRequest<
		ZohoBiginEndpointOutputs['getAllNotes']
	>('Notes', ctx.key, {
		method: 'GET',
		query: { page, per_page, fields },
	});

	await logEventFromContext(ctx, 'zohobigin.notes.getAll', {}, 'completed');
	return response;
};

export const getRecordNotes: ZohoBiginEndpoints['getRecordNotes'] = async (
	ctx,
	input,
) => {
	const { module, recordId, page, per_page, fields } = input;
	const response = await makeZohoBiginRequest<
		ZohoBiginEndpointOutputs['getRecordNotes']
	>(`${module}/${recordId}/Notes`, ctx.key, {
		method: 'GET',
		query: { page, per_page, fields },
	});

	await logEventFromContext(
		ctx,
		'zohobigin.notes.getRecordNotes',
		{ module, recordId },
		'completed',
	);
	return response;
};

export const updateNote: ZohoBiginEndpoints['updateNote'] = async (
	ctx,
	input,
) => {
	const { module, recordId, noteId, data } = input;
	const response = await makeZohoBiginRequest<
		ZohoBiginEndpointOutputs['updateNote']
	>(`${module}/${recordId}/Notes/${noteId}`, ctx.key, {
		method: 'PUT',
		body: { data: [data] },
	});

	await logEventFromContext(
		ctx,
		'zohobigin.notes.updateNote',
		{ module, recordId, noteId },
		'completed',
	);
	return response;
};
