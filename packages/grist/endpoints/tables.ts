import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['tables.list'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['tables.list'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['tables.list'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.tables.list',
		{ docId: parsedInput.docId, count: parsed.tables.length },
		'completed',
	);
	return parsed;
};

export const create: GristEndpoints['tables.create'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['tables.create'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables`,
		ctx.key,
		{
			method: 'POST',
			body: { tables: parsedInput.tables },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['tables.create'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.tables.create',
		{ docId: parsedInput.docId, count: parsed.tables.length },
		'completed',
	);
	return parsed;
};

export const update: GristEndpoints['tables.update'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['tables.update'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables`,
		ctx.key,
		{
			method: 'PATCH',
			body: { tables: parsedInput.tables },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['tables.update'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.tables.update',
		{ docId: parsedInput.docId, count: parsedInput.tables.length },
		'completed',
	);
	return parsed;
};
