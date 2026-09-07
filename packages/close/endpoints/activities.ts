import { makeCloseRequest } from '../client';
import type { CloseContext } from '../index';
import type {
	ActivitiesCreateNoteInput,
	ActivitiesCreateNoteResponse,
	ActivitiesListCallsInput,
	ActivitiesListCallsResponse,
	ActivitiesListEmailsInput,
	ActivitiesListEmailsResponse,
	ActivitiesListNotesInput,
	ActivitiesListNotesResponse,
} from './types';
import {
	ActivitiesCreateNoteInputSchema,
	ActivitiesCreateNoteResponseSchema,
	ActivitiesListCallsInputSchema,
	ActivitiesListCallsResponseSchema,
	ActivitiesListEmailsInputSchema,
	ActivitiesListEmailsResponseSchema,
	ActivitiesListNotesInputSchema,
	ActivitiesListNotesResponseSchema,
} from './types';

export const activitiesListNotes = async (
	ctx: CloseContext,
	input?: ActivitiesListNotesInput,
): Promise<ActivitiesListNotesResponse> => {
	const parsedInput = input
		? ActivitiesListNotesInputSchema.parse(input)
		: undefined;
	const res = await makeCloseRequest<unknown>('activity/note/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return ActivitiesListNotesResponseSchema.parse(res);
};

export const activitiesCreateNote = async (
	ctx: CloseContext,
	input: ActivitiesCreateNoteInput,
): Promise<ActivitiesCreateNoteResponse> => {
	const parsedInput = ActivitiesCreateNoteInputSchema.parse(input);
	const res = await makeCloseRequest<unknown>('activity/note/', ctx.key, {
		method: 'POST',
		body: parsedInput as Record<string, unknown>,
	});
	return ActivitiesCreateNoteResponseSchema.parse(res);
};

export const activitiesListCalls = async (
	ctx: CloseContext,
	input?: ActivitiesListCallsInput,
): Promise<ActivitiesListCallsResponse> => {
	const parsedInput = input
		? ActivitiesListCallsInputSchema.parse(input)
		: undefined;
	const res = await makeCloseRequest<unknown>('activity/call/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return ActivitiesListCallsResponseSchema.parse(res);
};

export const activitiesListEmails = async (
	ctx: CloseContext,
	input?: ActivitiesListEmailsInput,
): Promise<ActivitiesListEmailsResponse> => {
	const parsedInput = input
		? ActivitiesListEmailsInputSchema.parse(input)
		: undefined;
	const res = await makeCloseRequest<unknown>('activity/email/', ctx.key, {
		method: 'GET',
		query: parsedInput,
	});
	return ActivitiesListEmailsResponseSchema.parse(res);
};
