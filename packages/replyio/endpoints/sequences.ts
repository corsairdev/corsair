import { logEventFromContext } from 'corsair/core';
import { makeReplyioRequest } from '../client';
import type { ReplyioEndpoint, ReplyioEndpointContext } from './context';
import type { ReplyioEndpointOutputs } from './types';

export const list: ReplyioEndpoint<'sequencesList'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input?.top !== undefined) query.top = input.top;
	if (input?.skip !== undefined) query.skip = input.skip;
	if (input?.status !== undefined) query.status = input.status;
	if (input?.ownerUserId !== undefined) query.ownerUserId = input.ownerUserId;
	if (input?.folderId !== undefined) query.folderId = input.folderId;
	if (input?.isArchived !== undefined) query.isArchived = input.isArchived;
	if (input?.name !== undefined) query.name = input.name;
	if (input?.createdAfter !== undefined)
		query.createdAfter = input.createdAfter;
	if (input?.sortBy !== undefined) query.sortBy = input.sortBy;
	if (input?.sortDirection !== undefined)
		query.sortDirection = input.sortDirection;

	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['sequencesList']
	>('sequences', ctx.key, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'replyio.sequences.list',
		{ top: input?.top, skip: input?.skip },
		'completed',
	);
	return response;
};

export const get: ReplyioEndpoint<'sequencesGet'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['sequencesGet']
	>(`sequences/${input.sequenceId}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'replyio.sequences.get',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return response;
};

export const deleteSequence: ReplyioEndpoint<'sequencesDelete'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	await makeReplyioRequest(`sequences/${input.sequenceId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'replyio.sequences.delete',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return { success: true };
};

export const start: ReplyioEndpoint<'sequencesStart'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['sequencesStart']
	>(`sequences/${input.sequenceId}/start`, ctx.key, { method: 'POST' });

	await logEventFromContext(
		ctx,
		'replyio.sequences.start',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return response;
};

export const pause: ReplyioEndpoint<'sequencesPause'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['sequencesPause']
	>(`sequences/${input.sequenceId}/pause`, ctx.key, { method: 'POST' });

	await logEventFromContext(
		ctx,
		'replyio.sequences.pause',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return response;
};

export const archive: ReplyioEndpoint<'sequencesArchive'> = async (
	ctx: ReplyioEndpointContext,
	input,
) => {
	const response = await makeReplyioRequest<
		ReplyioEndpointOutputs['sequencesArchive']
	>(`sequences/${input.sequenceId}/archive`, ctx.key, { method: 'POST' });

	await logEventFromContext(
		ctx,
		'replyio.sequences.archive',
		{ sequenceId: input.sequenceId },
		'completed',
	);
	return response;
};
