import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import { makeGristRequest } from '../client';
import { GristEndpointInputSchemas, GristEndpointOutputSchemas } from './types';

export const list: GristEndpoints['columns.list'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['columns.list'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/columns`,
		ctx.key,
		{
			method: 'GET',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['columns.list'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.columns.list',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsed.columns.length,
		},
		'completed',
	);
	return parsed;
};

export const add: GristEndpoints['columns.add'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['columns.add'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/columns`,
		ctx.key,
		{
			method: 'POST',
			body: { columns: parsedInput.columns },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['columns.add'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.columns.add',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsed.columns.length,
		},
		'completed',
	);
	return parsed;
};

export const update: GristEndpoints['columns.update'] = async (ctx, input) => {
	const parsedInput = GristEndpointInputSchemas['columns.update'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/columns`,
		ctx.key,
		{
			method: 'PATCH',
			body: { columns: parsedInput.columns },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['columns.update'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.columns.update',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsedInput.columns.length,
		},
		'completed',
	);
	return parsed;
};

export const replace: GristEndpoints['columns.replace'] = async (
	ctx,
	input,
) => {
	const parsedInput = GristEndpointInputSchemas['columns.replace'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/columns`,
		ctx.key,
		{
			method: 'PUT',
			body: { columns: parsedInput.columns },
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['columns.replace'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.columns.replace',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			count: parsedInput.columns.length,
		},
		'completed',
	);
	return parsed;
};

export const deleteColumn: GristEndpoints['columns.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput = GristEndpointInputSchemas['columns.delete'].parse(input);
	const docIdStr = encodeURIComponent(parsedInput.docId);
	const tableIdStr = encodeURIComponent(parsedInput.tableId);
	const colIdStr = encodeURIComponent(parsedInput.colId);
	const response = await makeGristRequest<unknown>(
		`/docs/${docIdStr}/tables/${tableIdStr}/columns/${colIdStr}`,
		ctx.key,
		{
			method: 'DELETE',
			baseUrl: ctx.options?.baseUrl,
		},
	);
	const parsed = GristEndpointOutputSchemas['columns.delete'].parse(response);
	await logEventFromContext(
		ctx,
		'grist.columns.delete',
		{
			docId: parsedInput.docId,
			tableId: parsedInput.tableId,
			colId: parsedInput.colId,
		},
		'completed',
	);
	return parsed;
};
