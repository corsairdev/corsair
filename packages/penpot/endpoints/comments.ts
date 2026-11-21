import type { PenpotEndpoints } from '..';
import { call } from './call';
import {
	PenpotEndpointInputSchemas as Inputs,
	PenpotEndpointOutputSchemas as Outputs,
} from './types';

/** Penpot's id for a page's root frame. */
const ROOT_FRAME_ID = '00000000-0000-0000-0000-000000000000';

export const threadsList: PenpotEndpoints['commentsThreadsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.threadsList',
			input: Inputs.commentsThreadsList,
			output: Outputs.commentsThreadsList,
		},
		input,
		() => 'get-comment-threads',
		{
			body: ({ fileId }) => ({ fileId }),
			log: (_, threads) => ({ count: threads.length }),
		},
	);

export const threadGet: PenpotEndpoints['commentsThreadGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.threadGet',
			input: Inputs.commentsThreadGet,
			output: Outputs.commentsThreadGet,
		},
		input,
		() => 'get-comment-thread',
		{
			body: (input) => ({ fileId: input.fileId, id: input.id }),
			log: (_, thread) => ({ threadId: thread.id ?? undefined }),
		},
	);

export const threadCreate: PenpotEndpoints['commentsThreadCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'comments.threadCreate',
			input: Inputs.commentsThreadCreate,
			output: Outputs.commentsThreadCreate,
		},
		input,
		() => 'create-comment-thread',
		{
			// The RPC requires a frame; the page root frame has the zero uuid.
			body: ({ frameId, ...rest }) => ({
				...rest,
				frameId: frameId ?? ROOT_FRAME_ID,
			}),
			log: (_, thread) => ({ threadId: thread.id ?? undefined }),
		},
	);

export const list: PenpotEndpoints['commentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.list',
			input: Inputs.commentsList,
			output: Outputs.commentsList,
		},
		input,
		() => 'get-comments',
		{
			body: ({ threadId }) => ({ threadId }),
			log: (_, comments) => ({ count: comments.length }),
		},
	);

export const create: PenpotEndpoints['commentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'comments.create',
			input: Inputs.commentsCreate,
			output: Outputs.commentsCreate,
		},
		input,
		() => 'create-comment',
		{
			body: (input) => input,
			log: (_, comment) => ({ commentId: comment.id ?? undefined }),
		},
	);
