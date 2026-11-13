import { logEventFromContext } from 'corsair/core';
import type { GosquaredEndpoints } from '..';
import { makeGosquaredRequest } from '../client';
import type { GosquaredEndpointOutputs } from './types';
import {
	GosquaredEndpointInputSchemas,
	GosquaredEndpointOutputSchemas,
} from './types';

export const getChats: GosquaredEndpoints['chat.getChats'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['chat.getChats'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.limit !== undefined) query.limit = parsed.limit;
	if (parsed.from) query.from = parsed.from;
	if (parsed.to) query.to = parsed.to;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['chat.getChats']
	>('/chat/v1/chats', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['chat.getChats'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.chat.getChats',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getChat: GosquaredEndpoints['chat.getChat'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['chat.getChat'].parse(input);
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['chat.getChat']
	>(`/chat/v1/chats/${encodeURIComponent(parsed.chat_id)}`, ctx.key, {
		method: 'GET',
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['chat.getChat'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.chat.getChat',
		{ chatId: parsed.chat_id },
		'completed',
	);

	return parsedResponse;
};

export const getChatFeed: GosquaredEndpoints['chat.getChatFeed'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['chat.getChatFeed'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.limit !== undefined) query.limit = parsed.limit;
	if (parsed.from) query.from = parsed.from;
	if (parsed.to) query.to = parsed.to;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['chat.getChatFeed']
	>(`/chat/v1/chats/${encodeURIComponent(parsed.chat_id)}/feed`, ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['chat.getChatFeed'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.chat.getChatFeed',
		{ chatId: parsed.chat_id },
		'completed',
	);

	return parsedResponse;
};

export const archiveChat: GosquaredEndpoints['chat.archiveChat'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['chat.archiveChat'].parse(input);
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['chat.archiveChat']
	>(`/chat/v1/chats/${encodeURIComponent(parsed.chat_id)}/archive`, ctx.key, {
		method: 'POST',
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['chat.archiveChat'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.chat.archiveChat',
		{ chatId: parsed.chat_id },
		'completed',
	);

	return parsedResponse;
};

export const unarchiveChat: GosquaredEndpoints['chat.unarchiveChat'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['chat.unarchiveChat'].parse(input);
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['chat.unarchiveChat']
	>(`/chat/v1/chats/${encodeURIComponent(parsed.chat_id)}/unarchive`, ctx.key, {
		method: 'POST',
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['chat.unarchiveChat'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.chat.unarchiveChat',
		{ chatId: parsed.chat_id },
		'completed',
	);

	return parsedResponse;
};

export const sendMessage: GosquaredEndpoints['chat.sendMessage'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['chat.sendMessage'].parse(input);
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.auth) query.auth = parsed.auth;

	// `unknown` because message body payload contains dynamic values.
	const body: Record<string, unknown> = {
		content: parsed.content,
	};
	if (parsed.from) body.from = parsed.from;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['chat.sendMessage']
	>(`/chat/v1/chats/${encodeURIComponent(parsed.chat_id)}/messages`, ctx.key, {
		method: 'POST',
		body,
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['chat.sendMessage'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.chat.sendMessage',
		{ chatId: parsed.chat_id },
		'completed',
	);

	return parsedResponse;
};
