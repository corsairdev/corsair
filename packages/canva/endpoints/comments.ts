import { logEventFromContext } from 'corsair/core';
import { makeCanvaRequest } from '../client';
import type { CanvaEndpoints } from '../index';
import { loggable } from './mappers';
import { seg } from './shared';
import type { CanvaEndpointOutputs } from './types';

export const createThread: CanvaEndpoints['commentsCreateThread'] = async (
	ctx,
	input,
) => {
	const { designId, message_plaintext, assignee_id } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['commentsCreateThread']
	>(`v1/designs/${seg(designId)}/comments`, ctx.key, {
		method: 'POST',
		body: {
			message_plaintext,
			...(assignee_id !== undefined && { assignee_id }),
		},
	});

	await logEventFromContext(
		ctx,
		'canva.comments.createThread',
		loggable(input),
		'completed',
	);
	return result;
};

export const getThread: CanvaEndpoints['commentsGetThread'] = async (
	ctx,
	input,
) => {
	const { designId, threadId } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['commentsGetThread']
	>(`v1/designs/${seg(designId)}/comments/${seg(threadId)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'canva.comments.getThread',
		loggable(input),
		'completed',
	);
	return result;
};

export const createReply: CanvaEndpoints['commentsCreateReply'] = async (
	ctx,
	input,
) => {
	const { designId, threadId, message_plaintext } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['commentsCreateReply']
	>(`v1/designs/${seg(designId)}/comments/${seg(threadId)}/replies`, ctx.key, {
		method: 'POST',
		body: { message_plaintext },
	});

	await logEventFromContext(
		ctx,
		'canva.comments.createReply',
		loggable(input),
		'completed',
	);
	return result;
};

export const listReplies: CanvaEndpoints['commentsListReplies'] = async (
	ctx,
	input,
) => {
	const { designId, threadId, continuation, limit } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['commentsListReplies']
	>(`v1/designs/${seg(designId)}/comments/${seg(threadId)}/replies`, ctx.key, {
		method: 'GET',
		query: {
			...(continuation !== undefined && { continuation }),
			...(limit !== undefined && { limit }),
		},
	});

	await logEventFromContext(
		ctx,
		'canva.comments.listReplies',
		{ designId, threadId },
		'completed',
	);
	return result;
};

export const getReply: CanvaEndpoints['commentsGetReply'] = async (
	ctx,
	input,
) => {
	const { designId, threadId, replyId } = input;
	const result = await makeCanvaRequest<
		CanvaEndpointOutputs['commentsGetReply']
	>(
		`v1/designs/${seg(designId)}/comments/${seg(threadId)}/replies/${seg(replyId)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'canva.comments.getReply',
		loggable(input),
		'completed',
	);
	return result;
};
