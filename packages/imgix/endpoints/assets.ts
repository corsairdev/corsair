import { logEventFromContext } from 'corsair/core';
import type { ImgixEndpoints } from '..';
import { makeImgixRequest } from '../client';
import { ImgixEndpointInputSchemas, ImgixEndpointOutputSchemas } from './types';

// Helper to encode origin paths preserving slashes
function encodePath(originPath: string): string {
	return originPath
		.split('/')
		.map((part) => encodeURIComponent(part))
		.join('/');
}

export const list: ImgixEndpoints['assets.list'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['assets.list'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.filter !== undefined) query.filter = parsedInput.filter;
	if (parsedInput.sort !== undefined) query.sort = parsedInput.sort;
	if (parsedInput.fields !== undefined) query.fields = parsedInput.fields;
	if (parsedInput.page_cursor !== undefined)
		query['page[cursor]'] = parsedInput.page_cursor;
	if (parsedInput.page_size !== undefined)
		query['page[limit]'] = parsedInput.page_size;

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: `assets/${encodeURIComponent(parsedInput.source_id)}`,
		query,
	});

	const parsed = ImgixEndpointOutputSchemas['assets.list'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.assets.list',
		{ source_id: parsedInput.source_id, count: parsed.data.length },
		'completed',
	);

	return parsed;
};

export const get: ImgixEndpoints['assets.get'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['assets.get'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.fields !== undefined) query.fields = parsedInput.fields;

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: `assets/${encodeURIComponent(parsedInput.source_id)}/${encodePath(parsedInput.origin_path)}`,
		query,
	});

	const parsed = ImgixEndpointOutputSchemas['assets.get'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.assets.get',
		{ source_id: parsedInput.source_id },
		'completed',
	);

	return parsed;
};

export const update: ImgixEndpoints['assets.update'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['assets.update'].parse(input);

	const body = {
		data: {
			id: `${parsedInput.source_id}/${parsedInput.origin_path}`,
			type: 'assets',
			attributes: {
				custom_fields: parsedInput.custom_fields,
			},
		},
	};

	const response = await makeImgixRequest(ctx.key, {
		method: 'PATCH',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}/assets/${encodePath(parsedInput.origin_path)}`,
		body,
	});

	const parsed = ImgixEndpointOutputSchemas['assets.update'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.assets.update',
		{ source_id: parsedInput.source_id },
		'completed',
	);

	return parsed;
};

export const addFromOrigin: ImgixEndpoints['assets.addFromOrigin'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ImgixEndpointInputSchemas['assets.addFromOrigin'].parse(input);

	const response = await makeImgixRequest(ctx.key, {
		method: 'POST',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}/assets/add/${encodePath(parsedInput.origin_path)}`,
	});

	// imgix answers a queued add with an empty 202 body, which arrives as '' or undefined
	const parsed = ImgixEndpointOutputSchemas['assets.addFromOrigin'].parse(
		response === '' || response === undefined ? {} : response,
	);

	await logEventFromContext(
		ctx,
		'imgix.assets.addFromOrigin',
		{ source_id: parsedInput.source_id },
		'completed',
	);

	return parsed;
};

export const upload: ImgixEndpoints['assets.upload'] = async (ctx, input) => {
	const parsedInput = ImgixEndpointInputSchemas['assets.upload'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.overwrite !== undefined) {
		query.overwrite = parsedInput.overwrite;
	}

	const buffer = Buffer.from(parsedInput.content_base64, 'base64');
	const uploadBody = new Blob([buffer], {
		type: parsedInput.content_type ?? 'application/octet-stream',
	});

	const response = await makeImgixRequest(ctx.key, {
		method: 'POST',
		path: `sources/${encodeURIComponent(parsedInput.source_id)}/upload/${encodePath(parsedInput.origin_path)}`,
		query,
		body: uploadBody,
		headers: {
			'Content-Type': parsedInput.content_type ?? 'application/octet-stream',
		},
	});

	const parsed = ImgixEndpointOutputSchemas['assets.upload'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.assets.upload',
		{ source_id: parsedInput.source_id, byteCount: buffer.length },
		'completed',
	);

	return parsed;
};
