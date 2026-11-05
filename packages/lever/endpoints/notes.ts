import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withNotePath = (opportunityId: string, noteId?: string): string => {
	const base = leverPathParameter(
		'/opportunities/{opportunityId}/notes',
		'opportunityId',
		opportunityId,
	);
	return noteId === undefined
		? base
		: leverPathParameter(`${base}/{noteId}`, 'noteId', noteId);
};

export const listNotes: LeverEndpoints['listNotes'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listNotes']>(
		ctx,
		withNotePath(input.opportunityId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.notes.list', input, 'completed');
	return response;
};

export const retrieveNote: LeverEndpoints['retrieveNote'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['retrieveNote']>(
		ctx,
		withNotePath(input.opportunityId, input.noteId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.notes.retrieve', input, 'completed');
	return response;
};

export const createNote: LeverEndpoints['createNote'] = async (ctx, input) => {
	const { opportunityId, perform_as, note_id, ...body } = input;
	const response = await makeLeverRequest<LeverEndpointOutputs['createNote']>(
		ctx,
		withNotePath(opportunityId),
		{ method: 'POST', body, query: { perform_as, note_id } },
	);
	await logEventFromContext(ctx, 'lever.notes.create', input, 'completed');
	return response;
};

export const updateNote: LeverEndpoints['updateNote'] = async (ctx, input) => {
	const { opportunityId, noteId, ...body } = input;
	const response = await makeLeverRequest<LeverEndpointOutputs['updateNote']>(
		ctx,
		withNotePath(opportunityId, noteId),
		{ method: 'PUT', body },
	);
	await logEventFromContext(ctx, 'lever.notes.update', input, 'completed');
	return response;
};

export const deleteNote: LeverEndpoints['deleteNote'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['deleteNote']>(
		ctx,
		withNotePath(input.opportunityId, input.noteId),
		{ method: 'DELETE' },
	);
	await logEventFromContext(ctx, 'lever.notes.delete', input, 'completed');
	return response;
};
