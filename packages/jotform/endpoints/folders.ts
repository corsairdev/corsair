import { logEventFromContext } from 'corsair/core';
import type { JotformEndpoints } from '..';
import { makeJotformEndpointRequest } from '../client';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './types';

export const get: JotformEndpoints['folders.get'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['folders.get'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		`/folder/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = JotformEndpointOutputSchemas['folders.get'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.folders.get',
		{ folderId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const create: JotformEndpoints['folders.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['folders.create'].parse(input);
	const body = new URLSearchParams({
		name: parsedInput.name,
		...(parsedInput.color ? { color: parsedInput.color } : {}),
		...(parsedInput.parent ? { parent: parsedInput.parent } : {}),
	}).toString();

	const response = await makeJotformEndpointRequest(ctx, '/folder', ctx.key, {
		method: 'POST',
		body,
		contentType: 'application/x-www-form-urlencoded',
	});
	const parsed = JotformEndpointOutputSchemas['folders.create'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.folders.create',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const update: JotformEndpoints['folders.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['folders.update'].parse(input);
	const { id, ...updateData } = parsedInput;
	const response = await makeJotformEndpointRequest(
		ctx,
		`/folder/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'PUT', body: updateData },
	);
	const parsed = JotformEndpointOutputSchemas['folders.update'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.folders.update',
		{ folderId: id },
		'completed',
	);
	return parsed;
};

export const deleteFolder: JotformEndpoints['folders.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['folders.delete'].parse(input);
	const response = await makeJotformEndpointRequest(
		ctx,
		`/folder/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed = JotformEndpointOutputSchemas['folders.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.folders.delete',
		{ folderId: parsedInput.id },
		'completed',
	);
	return parsed;
};
