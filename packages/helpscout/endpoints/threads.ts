import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const list: HelpScoutEndpoints['threads.list'] = async (ctx, input) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['threads.list'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['threads.list']
	>(
		`/conversations/${encodeURIComponent(String(parsedInput.conversationId))}/threads`,
		ctx.key,
		{
			method: 'GET',
			query: {
				page: parsedInput.page,
			},
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['threads.list'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.threads.list',
		{
			conversationId: String(parsedInput.conversationId),
			count: parsed._embedded.threads.length,
		},
		'completed',
	);

	return parsed;
};

export const createReply: HelpScoutEndpoints['threads.createReply'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['threads.createReply'].parse(input);
	const { conversationId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['threads.createReply']
	>(
		`/conversations/${encodeURIComponent(String(conversationId))}/reply`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['threads.createReply'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.threads.createReply',
		{ conversationId: String(conversationId) },
		'completed',
	);

	return parsed;
};

export const createNote: HelpScoutEndpoints['threads.createNote'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['threads.createNote'].parse(input);
	const { conversationId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['threads.createNote']
	>(
		`/conversations/${encodeURIComponent(String(conversationId))}/notes`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['threads.createNote'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.threads.createNote',
		{ conversationId: String(conversationId) },
		'completed',
	);

	return parsed;
};

export const createChat: HelpScoutEndpoints['threads.createChat'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['threads.createChat'].parse(input);
	const { conversationId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['threads.createChat']
	>(
		`/conversations/${encodeURIComponent(String(conversationId))}/chats`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['threads.createChat'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.threads.createChat',
		{ conversationId: String(conversationId) },
		'completed',
	);

	return parsed;
};

export const createPhone: HelpScoutEndpoints['threads.createPhone'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['threads.createPhone'].parse(input);
	const { conversationId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['threads.createPhone']
	>(
		`/conversations/${encodeURIComponent(String(conversationId))}/phones`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['threads.createPhone'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.threads.createPhone',
		{ conversationId: String(conversationId) },
		'completed',
	);

	return parsed;
};

export const createCustomer: HelpScoutEndpoints['threads.createCustomer'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['threads.createCustomer'].parse(input);
		const { conversationId, ...body } = parsedInput;

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['threads.createCustomer']
		>(
			`/conversations/${encodeURIComponent(String(conversationId))}/customer`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'threads.createCustomer'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.threads.createCustomer',
			{ conversationId: String(conversationId) },
			'completed',
		);

		return parsed;
	};

export const update: HelpScoutEndpoints['threads.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['threads.update'].parse(input);
	const { conversationId, threadId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['threads.update']
	>(
		`/conversations/${encodeURIComponent(String(conversationId))}/threads/${encodeURIComponent(String(threadId))}`,
		ctx.key,
		{
			method: 'PATCH',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['threads.update'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.threads.update',
		{
			conversationId: String(conversationId),
			threadId: String(threadId),
		},
		'completed',
	);

	return parsed;
};

export const getOriginalSource: HelpScoutEndpoints['threads.getOriginalSource'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['threads.getOriginalSource'].parse(input);

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['threads.getOriginalSource']
		>(
			`/conversations/${encodeURIComponent(String(parsedInput.conversationId))}/threads/${encodeURIComponent(String(parsedInput.threadId))}/original-source`,
			ctx.key,
			{
				method: 'GET',
			},
		);

		const parsed =
			HelpScoutEndpointOutputSchemas['threads.getOriginalSource'].parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'helpscout.threads.getOriginalSource',
			{
				conversationId: String(parsedInput.conversationId),
				threadId: String(parsedInput.threadId),
			},
			'completed',
		);

		return parsed;
	};
