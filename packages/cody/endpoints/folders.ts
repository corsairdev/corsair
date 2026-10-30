import { logEventFromContext } from 'corsair/core';
import { makeCodyRequest } from '../client';
import type { CodyContext } from '../index';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

export const list = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.foldersList.parse(input ?? {});

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/folders', ctx.key, {
		method: 'GET',
		query: {
			keyword: parsed.keyword ?? parsed.search,
			page: parsed.page,
			per_page: parsed.per_page,
		},
	});

	const response = CodyEndpointOutputSchemas.foldersList.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.folders.list',
		{ keyword: parsed.keyword ?? parsed.search, page: parsed.page },
		'completed',
	);

	return response;
};

export const create = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.foldersCreate.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>('/folders', ctx.key, {
		method: 'POST',
		body: { name: parsed.name },
	});

	const response = CodyEndpointOutputSchemas.foldersCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.folders.create',
		{ name: parsed.name },
		'completed',
	);

	return response;
};

export const get = async (
	ctx: CodyContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before provider request.
	input: unknown,
) => {
	const parsed = CodyEndpointInputSchemas.foldersGet.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>(
		`/folders/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const response = CodyEndpointOutputSchemas.foldersGet.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.folders.get',
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
	const parsed = CodyEndpointInputSchemas.foldersUpdate.parse(input);

	// unknown: provider JSON response is validated by Zod output schema below.
	const raw = await makeCodyRequest<unknown>(
		`/folders/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{
			method: 'POST',
			body: { name: parsed.name },
		},
	);

	const response = CodyEndpointOutputSchemas.foldersUpdate.parse(raw);

	await logEventFromContext(
		ctx,
		'cody.folders.update',
		{ id: parsed.id, name: parsed.name },
		'completed',
	);

	return response;
};
