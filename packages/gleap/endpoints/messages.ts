import { logEventFromContext } from 'corsair/core';
import type { GleapEndpoints } from '..';
import { makeGleapRequest } from '../client';
import type {
	MessagesCreateOutput,
	MessagesCreateThreadOutput,
	MessagesDeleteOutput,
	MessagesGetThreadOutput,
	MessagesListOutput,
	MessagesUpdateOutput,
} from './types';
import {
	GleapEndpointInputSchemas,
	GleapEndpointOutputSchemas,
} from './types';

export const list: GleapEndpoints['messagesList'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.messagesList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		ticket: parsed.ticket,
		paginated: parsed.paginated,
		before: parsed.before,
		limit: parsed.limit,
		skip: parsed.skip,
	};
	const response = await makeGleapRequest<MessagesListOutput>(
		'/messages',
		ctx.key,
		{
			method: 'GET',
			query,
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.messagesList.parse(response);
	const count = Array.isArray(output) ? output.length : output.items.length;
	await logEventFromContext(
		ctx,
		'gleap.messages.list',
		{ count },
		'completed',
	);
	return output;
};

export const create: GleapEndpoints['messagesCreate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.messagesCreate.parse(input);
	const { project, ...body } = parsed;
	const response = await makeGleapRequest<MessagesCreateOutput>(
		'/messages',
		ctx.key,
		{
			method: 'POST',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.messagesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.messages.create',
		{ ticketId: parsed.ticket },
		'completed',
	);
	return output;
};

export const update: GleapEndpoints['messagesUpdate'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.messagesUpdate.parse(input);
	const { messageId, project, ...body } = parsed;
	const response = await makeGleapRequest<MessagesUpdateOutput>(
		`/messages/${encodeURIComponent(messageId)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.messagesUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.messages.update',
		{ messageId },
		'completed',
	);
	return output;
};

export const del: GleapEndpoints['messagesDelete'] = async (ctx, input) => {
	const parsed = GleapEndpointInputSchemas.messagesDelete.parse(input);
	const response = await makeGleapRequest<MessagesDeleteOutput>(
		`/messages/${encodeURIComponent(parsed.messageId)}`,
		ctx.key,
		{
			method: 'DELETE',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.messagesDelete.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.messages.delete',
		{ messageId: parsed.messageId },
		'completed',
	);
	return output;
};

export const getThread: GleapEndpoints['messagesGetThread'] = async (
	ctx,
	input,
) => {
	const parsed = GleapEndpointInputSchemas.messagesGetThread.parse(input);
	const response = await makeGleapRequest<MessagesGetThreadOutput>(
		`/messages/${encodeURIComponent(parsed.messageId)}/thread`,
		ctx.key,
		{
			method: 'GET',
			projectId: parsed.project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output = GleapEndpointOutputSchemas.messagesGetThread.parse(response);
	const count = Array.isArray(output)
		? output.length
		: (output.messages?.length ?? 0);
	await logEventFromContext(
		ctx,
		'gleap.messages.getThread',
		{ messageId: parsed.messageId, count },
		'completed',
	);
	return output;
};

export const createThread: GleapEndpoints['messagesCreateThread'] = async (
	ctx,
	input,
) => {
	const parsed = GleapEndpointInputSchemas.messagesCreateThread.parse(input);
	const { messageId, project, ...body } = parsed;
	const response = await makeGleapRequest<MessagesCreateThreadOutput>(
		`/messages/${encodeURIComponent(messageId)}/thread`,
		ctx.key,
		{
			method: 'POST',
			body,
			projectId: project ?? ctx.options?.projectId,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const output =
		GleapEndpointOutputSchemas.messagesCreateThread.parse(response);
	await logEventFromContext(
		ctx,
		'gleap.messages.createThread',
		{ messageId },
		'completed',
	);
	return output;
};
