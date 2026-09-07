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

export const activitiesListNotes = async (
	ctx: CloseContext,
	input?: ActivitiesListNotesInput,
): Promise<ActivitiesListNotesResponse> => {
	const res = await makeCloseRequest<ActivitiesListNotesResponse>(
		'activity/note/',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
	return res;
};

export const activitiesCreateNote = async (
	ctx: CloseContext,
	input: ActivitiesCreateNoteInput,
): Promise<ActivitiesCreateNoteResponse> => {
	const res = await makeCloseRequest<ActivitiesCreateNoteResponse>(
		'activity/note/',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);
	return res;
};

export const activitiesListCalls = async (
	ctx: CloseContext,
	input?: ActivitiesListCallsInput,
): Promise<ActivitiesListCallsResponse> => {
	const res = await makeCloseRequest<ActivitiesListCallsResponse>(
		'activity/call/',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
	return res;
};

export const activitiesListEmails = async (
	ctx: CloseContext,
	input?: ActivitiesListEmailsInput,
): Promise<ActivitiesListEmailsResponse> => {
	const res = await makeCloseRequest<ActivitiesListEmailsResponse>(
		'activity/email/',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);
	return res;
};
