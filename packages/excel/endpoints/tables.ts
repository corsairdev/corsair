import type { ExcelEndpoints } from '../index';
import { sessionHeaders, workbookBase } from '../workbook-path';
import { callExcel } from './call';
import {
	emptyOutputSchema,
	TablesAddColumnInputSchema,
	TablesAddInputSchema,
	TablesAddRowsInputSchema,
	TablesDeleteColumnInputSchema,
	TablesDeleteInputSchema,
	TablesDeleteRowInputSchema,
	TablesGetInputSchema,
	TablesListColumnsInputSchema,
	TablesListInputSchema,
	TablesListRowsInputSchema,
	TablesUpdateInputSchema,
	tableColumnListSchema,
	tableColumnSchema,
	tableListSchema,
	tableRowListSchema,
	tableRowSchema,
	tableSchema,
} from './types';

function pageQuery(top: number | undefined, skip: number | undefined) {
	return { $top: top, $skip: skip };
}

function tableBase(input: {
	driveId?: string;
	itemId?: string;
	itemPath?: string;
	worksheet?: string;
	table: string;
}): string {
	const root = workbookBase(input);
	const table = encodeURIComponent(input.table);
	if (input.worksheet !== undefined) {
		return `${root}/worksheets/${encodeURIComponent(input.worksheet)}/tables/${table}`;
	}
	return `${root}/tables/${table}`;
}

export const list: ExcelEndpoints['tablesList'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.tables.list',
		TablesListInputSchema,
		tableListSchema,
		input,
		(body) => {
			const root = workbookBase(body);
			const url =
				body.worksheet === undefined
					? `${root}/tables`
					: `${root}/worksheets/${encodeURIComponent(body.worksheet)}/tables`;
			return {
				method: 'GET',
				url,
				headers: sessionHeaders(body.sessionId),
				query: pageQuery(body.top, body.skip),
			};
		},
		(_body, response) => ({ count: response.value.length }),
	);
};

export const get: ExcelEndpoints['tablesGet'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.tables.get',
		TablesGetInputSchema,
		tableSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${workbookBase(body)}/tables/${encodeURIComponent(body.table)}`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body, response) => ({
			table: body.table,
			name: response.name,
		}),
	);
};

export const add: ExcelEndpoints['tablesAdd'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.tables.add',
		TablesAddInputSchema,
		tableSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/tables/add`,
			headers: sessionHeaders(body.sessionId),
			body: { address: body.address, hasHeaders: body.hasHeaders },
		}),
		(_body, response) => ({ name: response.name }),
	);
};

export const update: ExcelEndpoints['tablesUpdate'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.tables.update',
		TablesUpdateInputSchema,
		tableSchema,
		input,
		(body) => ({
			method: 'PATCH',
			url: `${workbookBase(body)}/tables/${encodeURIComponent(body.table)}`,
			headers: sessionHeaders(body.sessionId),
			body: {
				...(body.name !== undefined ? { name: body.name } : {}),
				...(body.showHeaders !== undefined
					? { showHeaders: body.showHeaders }
					: {}),
				...(body.showTotals !== undefined
					? { showTotals: body.showTotals }
					: {}),
				...(body.style !== undefined ? { style: body.style } : {}),
			},
		}),
		(body, response) => ({
			table: body.table,
			name: response.name,
		}),
	);
};

export const remove: ExcelEndpoints['tablesDelete'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.tables.delete',
		TablesDeleteInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: `${workbookBase(body)}/tables/${encodeURIComponent(body.table)}`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body) => ({ table: body.table }),
	);
};

export const listRows: ExcelEndpoints['tablesListRows'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.tables.listRows',
		TablesListRowsInputSchema,
		tableRowListSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${tableBase(body)}/rows`,
			headers: sessionHeaders(body.sessionId),
			query: pageQuery(body.top, body.skip),
		}),
		(body, response) => ({
			table: body.table,
			count: response.value.length,
		}),
	);
};

export const addRows: ExcelEndpoints['tablesAddRows'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.tables.addRows',
		TablesAddRowsInputSchema,
		tableRowSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/tables/${encodeURIComponent(body.table)}/rows`,
			headers: sessionHeaders(body.sessionId),
			body: {
				values: body.values,
				...(body.index !== undefined ? { index: body.index } : {}),
			},
		}),
		(body, response) => ({
			table: body.table,
			index: response.index ?? null,
		}),
	);
};

export const deleteRow: ExcelEndpoints['tablesDeleteRow'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.tables.deleteRow',
		TablesDeleteRowInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: `${workbookBase(body)}/tables/${encodeURIComponent(body.table)}/rows/${body.index}`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body) => ({
			table: body.table,
			index: body.index,
		}),
	);
};

export const listColumns: ExcelEndpoints['tablesListColumns'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.tables.listColumns',
		TablesListColumnsInputSchema,
		tableColumnListSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${tableBase(body)}/columns`,
			headers: sessionHeaders(body.sessionId),
			query: pageQuery(body.top, body.skip),
		}),
		(body, response) => ({
			table: body.table,
			count: response.value.length,
		}),
	);
};

export const addColumn: ExcelEndpoints['tablesAddColumn'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.tables.addColumn',
		TablesAddColumnInputSchema,
		tableColumnSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/tables/${encodeURIComponent(body.table)}/columns/add`,
			headers: sessionHeaders(body.sessionId),
			body: {
				values: body.values,
				...(body.index !== undefined ? { index: body.index } : {}),
			},
		}),
		(body, response) => ({
			table: body.table,
			name: response.name,
		}),
	);
};

export const deleteColumn: ExcelEndpoints['tablesDeleteColumn'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.tables.deleteColumn',
		TablesDeleteColumnInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: `${workbookBase(body)}/tables/${encodeURIComponent(body.table)}/columns/${encodeURIComponent(body.column)}`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body) => ({
			table: body.table,
			column: body.column,
		}),
	);
};
