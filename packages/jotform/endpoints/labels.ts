import { logEventFromContext } from 'corsair/core';
import type { JotformEndpoints } from '..';
import { makeJotformRequest } from '../client';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './types';

export const get: JotformEndpoints['labels.get'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['labels.get'].parse(input);
	const response = await makeJotformRequest(
		`/label/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = JotformEndpointOutputSchemas['labels.get'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.labels.get',
		{ labelId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const create: JotformEndpoints['labels.create'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['labels.create'].parse(input);
	const body = new URLSearchParams({
		name: parsedInput.name,
		...(parsedInput.color ? { color: parsedInput.color } : {}),
		...(parsedInput.parent ? { parent: parsedInput.parent } : {}),
	}).toString();

	const response = await makeJotformRequest('/label', ctx.key, {
		method: 'POST',
		body,
		contentType: 'application/x-www-form-urlencoded',
	});
	const parsed = JotformEndpointOutputSchemas['labels.create'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.labels.create',
		{ status: 'success' },
		'completed',
	);
	return parsed;
};

export const update: JotformEndpoints['labels.update'] = async (ctx, input) => {
	const parsedInput = JotformEndpointInputSchemas['labels.update'].parse(input);
	const { id, ...updateData } = parsedInput;
	const response = await makeJotformRequest(
		`/label/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'PUT', body: updateData },
	);
	const parsed = JotformEndpointOutputSchemas['labels.update'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.labels.update',
		{ labelId: id },
		'completed',
	);
	return parsed;
};

export const deleteLabel: JotformEndpoints['labels.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput = JotformEndpointInputSchemas['labels.delete'].parse(input);
	const response = await makeJotformRequest(
		`/label/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const parsed = JotformEndpointOutputSchemas['labels.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.labels.delete',
		{ labelId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const getResources: JotformEndpoints['labels.getResources'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['labels.getResources'].parse(input);
	const query: Record<string, string | number | undefined> = {};
	if (parsedInput.offset !== undefined) query.offset = parsedInput.offset;
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.orderby !== undefined) query.orderby = parsedInput.orderby;
	if (parsedInput.status !== undefined) query.status = parsedInput.status;

	const response = await makeJotformRequest(
		`/label/${encodeURIComponent(parsedInput.id)}/resources`,
		ctx.key,
		{ method: 'GET', query },
	);
	const parsed =
		JotformEndpointOutputSchemas['labels.getResources'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.labels.getResources',
		{
			labelId: parsedInput.id,
			count: Array.isArray(parsed.content) ? parsed.content.length : 0,
		},
		'completed',
	);
	return parsed;
};

export const addResources: JotformEndpoints['labels.addResources'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JotformEndpointInputSchemas['labels.addResources'].parse(input);
	const response = await makeJotformRequest(
		`/label/${encodeURIComponent(parsedInput.id)}/add-resources`,
		ctx.key,
		{ method: 'PUT', body: { resources: parsedInput.resources } },
	);
	const parsed =
		JotformEndpointOutputSchemas['labels.addResources'].parse(response);
	await logEventFromContext(
		ctx,
		'jotform.labels.addResources',
		{ labelId: parsedInput.id, count: parsedInput.resources.length },
		'completed',
	);
	return parsed;
};

export const removeResources: JotformEndpoints['labels.removeResources'] =
	async (ctx, input) => {
		const parsedInput =
			JotformEndpointInputSchemas['labels.removeResources'].parse(input);
		const response = await makeJotformRequest(
			`/label/${encodeURIComponent(parsedInput.id)}/remove-resources`,
			ctx.key,
			{ method: 'PUT', body: { resources: parsedInput.resources } },
		);
		const parsed =
			JotformEndpointOutputSchemas['labels.removeResources'].parse(response);
		await logEventFromContext(
			ctx,
			'jotform.labels.removeResources',
			{ labelId: parsedInput.id, count: parsedInput.resources.length },
			'completed',
		);
		return parsed;
	};
