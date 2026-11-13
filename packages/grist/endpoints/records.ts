import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['records.list'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['records.list'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.filter !== undefined) query.filter = parsedInput.filter;
	if (parsedInput.sort !== undefined) query.sort = parsedInput.sort;
	if (parsedInput.limit !== undefined) query.limit = parsedInput.limit;
	if (parsedInput.hidden !== undefined) query.hidden = parsedInput.hidden;
	if (parsedInput.cellFormat !== undefined)
		query.cellFormat = parsedInput.cellFormat;

	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/records`,
		ctx.key,
		{
			method: 'GET',
			query: Object.keys(query).length > 0 ? query : undefined,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['records.list'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.records.list',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsed.records.length,
		},
		'completed',
	);
	return parsed;
};

export const add: GristEndpoints['records.add'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['records.add'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.noparse !== undefined) query.noparse = parsedInput.noparse;

	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/records`,
		ctx.key,
		{
			method: 'POST',
			body: { records: parsedInput.records },
			query: Object.keys(query).length > 0 ? query : undefined,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['records.add'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.records.add',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsed.records.length,
		},
		'completed',
	);
	return parsed;
};

export const update: GristEndpoints['records.update'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['records.update'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.noparse !== undefined) query.noparse = parsedInput.noparse;

	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/records`,
		ctx.key,
		{
			method: 'PATCH',
			body: { records: parsedInput.records },
			query: Object.keys(query).length > 0 ? query : undefined,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['records.update'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.records.update',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsedInput.records.length,
		},
		'completed',
	);
	return parsed;
};

export const replace: GristEndpoints['records.replace'] = async (
	ctx,
	input,
) => {
	const parsedInput = GristEndpointInputSchemas['records.replace'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.noparse !== undefined) query.noparse = parsedInput.noparse;
	if (parsedInput.onmany !== undefined) query.onmany = parsedInput.onmany;
	if (parsedInput.noadd !== undefined) query.noadd = parsedInput.noadd;
	if (parsedInput.noupdate !== undefined) query.noupdate = parsedInput.noupdate;
	if (parsedInput.allow_empty_require !== undefined)
		query.allow_empty_require = parsedInput.allow_empty_require;

	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/records`,
		ctx.key,
		{
			method: 'PUT',
			body: { records: parsedInput.records },
			query: Object.keys(query).length > 0 ? query : undefined,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['records.replace'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.records.replace',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsedInput.records.length,
		},
		'completed',
	);
	return parsed;
};

export const deleteRecords: GristEndpoints['records.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput = GristEndpointInputSchemas['records.delete'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/records/delete`,
		ctx.key,
		{
			method: 'POST',
			body: parsedInput.recordIds,
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['records.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.records.delete',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsedInput.recordIds.length,
		},
		'completed',
	);
	return parsed;
};
