import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const query: GristEndpoints['sql.query'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['sql.query'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest(`/docs/${docIdStr}/sql`, ctx.key, {
		method: 'POST',
		body: {
			sql: parsedInput.sql,
			...(parsedInput.args !== undefined ? { args: parsedInput.args } : {}),
			...(parsedInput.timeout !== undefined
				? { timeout: parsedInput.timeout }
				: {}),
		},
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed = GristEndpointOutputSchemas['sql.query'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.sql.query',
		{ docId: parsedInput.docId, count: parsed.records.length },
		'completed',
	);
	return parsed;
};

export const queryGet: GristEndpoints['sql.queryGet'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['sql.queryGet'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const response = await makeGristRequest(`/docs/${docIdStr}/sql`, ctx.key, {
		method: 'GET',
		query: { q: parsedInput.q },
		baseUrl: ctx.options?.baseUrl,
	});
	const parsed = GristEndpointOutputSchemas['sql.queryGet'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.sql.queryGet',
		{ docId: parsedInput.docId, count: parsed.records.length },
		'completed',
	);
	return parsed;
};
