import { logEventFromContext } from 'corsair/core';
import { makeCodyRequest } from '../client';
import type { CodyContext } from '../index';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

export const list = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.documentsList.parse(input ?? {});

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/documents', ctx.key, {
		method: 'GET',
		query: {
			folder_id: parsed.folder_id,
			conversation_id: parsed.conversation_id,
			keyword: parsed.keyword ?? parsed.search,
			page: parsed.page,
			per_page: parsed.per_page,
		},
	});

	const response = CodyEndpointOutputSchemas.documentsList.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.documents.list',
		{
			folder_id: parsed.folder_id,
			conversation_id: parsed.conversation_id,
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
	const parsed = CodyEndpointInputSchemas.documentsCreate.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/documents', ctx.key, {
		method: 'POST',
		body: {
			name: parsed.name,
			content: parsed.content,
			content_type: parsed.content_type,
			folder_id: parsed.folder_id,
		},
	});

	const response = CodyEndpointOutputSchemas.documentsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.documents.create',
		{ name: parsed.name },
		'completed',
	);

	return response;
};

export const createFromFile = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.documentsCreateFromFile.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/documents/file', ctx.key, {
		method: 'POST',
		body: {
			key: parsed.key,
			folder_id: parsed.folder_id,
		},
	});

	const response = CodyEndpointOutputSchemas.documentsCreateFromFile.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.documents.createFromFile',
		{ key: parsed.key },
		'completed',
	);

	return response;
};

export const createFromWebpage = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed =
		CodyEndpointInputSchemas.documentsCreateFromWebpage.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/documents/webpage', ctx.key, {
		method: 'POST',
		body: {
			url: parsed.url,
			folder_id: parsed.folder_id,
		},
	});

	const response =
		CodyEndpointOutputSchemas.documentsCreateFromWebpage.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.documents.createFromWebpage',
		{ url: parsed.url },
		'completed',
	);

	return response;
};

export const get = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.documentsGet.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>(
		`/documents/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const response = CodyEndpointOutputSchemas.documentsGet.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.documents.get',
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
	const parsed = CodyEndpointInputSchemas.documentsDelete.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>(
		`/documents/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const response = CodyEndpointOutputSchemas.documentsDelete.parse(
		raw ?? { data: true },
	);

	await logEventFromContext(
		ctx,
		'cody.documents.delete',
		{ id: parsed.id },
		'completed',
	);

	return response;
};
