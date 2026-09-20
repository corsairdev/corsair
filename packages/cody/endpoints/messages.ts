import { logEventFromContext } from 'corsair/core';
import { makeCodyRequest } from '../client';
import type { CodyContext } from '../index';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

export const list = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.messagesList.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/messages', ctx.key, {
		method: 'GET',
		query: {
			conversation_id: parsed.conversation_id,
			includes: parsed.includes,
		},
	});

	const response = CodyEndpointOutputSchemas.messagesList.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.messages.list',
		{ conversation_id: parsed.conversation_id },
		'completed',
	);

	return response;
};

export const send = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.messagesSend.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/messages', ctx.key, {
		method: 'POST',
		body: {
			content: parsed.content,
			conversation_id: parsed.conversation_id,
		},
	});

	const response = CodyEndpointOutputSchemas.messagesSend.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.messages.send',
		{ conversation_id: parsed.conversation_id },
		'completed',
	);

	return response;
};

export const get = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.messagesGet.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>(
		`/messages/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'GET',
			query: { includes: parsed.includes },
		},
	);

	const response = CodyEndpointOutputSchemas.messagesGet.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.messages.get',
		{ id: parsed.id },
		'completed',
	);

	return response;
};

export const sendForStream = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.messagesSendForStream.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/messages/stream', ctx.key, {
		method: 'POST',
		body: {
			content: parsed.content,
			conversation_id: parsed.conversation_id,
			redirect: parsed.redirect ?? false,
		},
	});

	const response = CodyEndpointOutputSchemas.messagesSendForStream.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.messages.sendForStream',
		{ conversation_id: parsed.conversation_id },
		'completed',
	);

	return response;
};
