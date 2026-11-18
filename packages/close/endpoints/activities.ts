import { closeResourcePath, makeCloseRequestForCtx } from '../client';
import type { CloseContext } from '../index';
import type {
	ActivitiesCreateCallInput,
	ActivitiesCreateCallResponse,
	ActivitiesCreateNoteInput,
	ActivitiesCreateNoteResponse,
	ActivitiesCreateSmsInput,
	ActivitiesCreateSmsResponse,
	ActivitiesDeleteCallInput,
	ActivitiesDeleteCallResponse,
	ActivitiesListCallsInput,
	ActivitiesListCallsResponse,
	ActivitiesListEmailsInput,
	ActivitiesListEmailsResponse,
	ActivitiesListNotesInput,
	ActivitiesListNotesResponse,
} from './types';
import {
	ActivitiesCreateCallInputSchema,
	ActivitiesCreateCallResponseSchema,
	ActivitiesCreateNoteInputSchema,
	ActivitiesCreateNoteResponseSchema,
	ActivitiesCreateSmsInputSchema,
	ActivitiesCreateSmsResponseSchema,
	ActivitiesDeleteCallInputSchema,
	ActivitiesDeleteCallResponseSchema,
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
	const parsedInput =
		input === undefined
			? undefined
			: ActivitiesListNotesInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'activity/note/', {
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
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'activity/note/', {
		method: 'POST',
		body: parsedInput as Record<string, unknown>,
	});
	return ActivitiesCreateNoteResponseSchema.parse(res);
};

export const activitiesListCalls = async (
	ctx: CloseContext,
	input?: ActivitiesListCallsInput,
): Promise<ActivitiesListCallsResponse> => {
	const parsedInput =
		input === undefined
			? undefined
			: ActivitiesListCallsInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'activity/call/', {
		method: 'GET',
		query: parsedInput,
	});
	return ActivitiesListCallsResponseSchema.parse(res);
};

export const activitiesCreateCall = async (
	ctx: CloseContext,
	input: ActivitiesCreateCallInput,
): Promise<ActivitiesCreateCallResponse> => {
	const parsedInput = ActivitiesCreateCallInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'activity/call/', {
		method: 'POST',
		body: parsedInput as Record<string, unknown>,
	});
	return ActivitiesCreateCallResponseSchema.parse(res);
};

export const activitiesDeleteCall = async (
	ctx: CloseContext,
	input: ActivitiesDeleteCallInput,
): Promise<ActivitiesDeleteCallResponse> => {
	const parsedInput = ActivitiesDeleteCallInputSchema.parse(input);
	await makeCloseRequestForCtx<unknown>(
		ctx,
		closeResourcePath('activity/call', parsedInput.id),
		{
			method: 'DELETE',
		},
	);
	return ActivitiesDeleteCallResponseSchema.parse({
		success: true,
		id: parsedInput.id,
	});
};

export const activitiesCreateSms = async (
	ctx: CloseContext,
	input: ActivitiesCreateSmsInput,
): Promise<ActivitiesCreateSmsResponse> => {
	const parsedInput = ActivitiesCreateSmsInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'activity/sms/', {
		method: 'POST',
		body: parsedInput as Record<string, unknown>,
	});
	return ActivitiesCreateSmsResponseSchema.parse(res);
};

export const activitiesListEmails = async (
	ctx: CloseContext,
	input?: ActivitiesListEmailsInput,
): Promise<ActivitiesListEmailsResponse> => {
	const parsedInput =
		input === undefined
			? undefined
			: ActivitiesListEmailsInputSchema.parse(input);
	const res = await makeCloseRequestForCtx<unknown>(ctx, 'activity/email/', {
		method: 'GET',
		query: parsedInput,
	});
	return ActivitiesListEmailsResponseSchema.parse(res);
};
