import { logEventFromContext } from 'corsair/core';
import { makeCodyRequest } from '../client';
import type { CodyContext } from '../index';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

export const list = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.conversationsList.parse(input ?? {});

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/conversations', ctx.key, {
		method: 'GET',
		query: {
			bot_id: parsed.bot_id,
			keyword: parsed.keyword ?? parsed.search,
			includes: parsed.includes,
			page: parsed.page,
			per_page: parsed.per_page,
		},
	});

	const response = CodyEndpointOutputSchemas.conversationsList.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.conversations.list',
		{
			bot_id: parsed.bot_id,
			keyword: parsed.keyword ?? parsed.search,
			page: parsed.page,
		},
		'completed',
	);

	return response;
};

export const create = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.conversationsCreate.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/conversations', ctx.key, {
		method: 'POST',
		body: {
			name: parsed.name,
			bot_id: parsed.bot_id,
			document_ids: parsed.document_ids,
		},
	});

	const response = CodyEndpointOutputSchemas.conversationsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.conversations.create',
		{ name: parsed.name, bot_id: parsed.bot_id },
		'completed',
	);

	return response;
};

export const get = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.conversationsGet.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>(
		`/conversations/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'GET',
			query: { includes: parsed.includes },
		},
	);

	const response = CodyEndpointOutputSchemas.conversationsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.conversations.get',
		{ id: parsed.id },
		'completed',
	);

	return response;
};

export const update = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.conversationsUpdate.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>(
		`/conversations/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'POST',
			body: {
				name: parsed.name,
				bot_id: parsed.bot_id,
				document_ids: parsed.document_ids,
			},
		},
	);

	const response = CodyEndpointOutputSchemas.conversationsUpdate.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.conversations.update',
		{ id: parsed.id },
		'completed',
	);

	return response;
};

export const del = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.conversationsDelete.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>(
		`/conversations/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const response = CodyEndpointOutputSchemas.conversationsDelete.parse(
		raw ?? { data: true },
	);

	await logEventFromContext(
		ctx,
		'cody.conversations.delete',
		{ id: parsed.id },
		'completed',
	);

	return response;
};
