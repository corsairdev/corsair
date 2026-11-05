import type { ExcelEndpoints } from '../index';
import { sessionHeaders, workbookBase } from '../workbook-path';
import { callExcel } from './call';
import {
	emptyOutputSchema,
	WorksheetsAddInputSchema,
	WorksheetsDeleteInputSchema,
	WorksheetsGetInputSchema,
	WorksheetsListInputSchema,
	WorksheetsUpdateInputSchema,
	worksheetListSchema,
	worksheetSchema,
} from './types';

function pageQuery(top: number | undefined, skip: number | undefined) {
	return { $top: top, $skip: skip };
}

export const list: ExcelEndpoints['worksheetsList'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.worksheets.list',
		WorksheetsListInputSchema,
		worksheetListSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${workbookBase(body)}/worksheets`,
			headers: sessionHeaders(body.sessionId),
			query: pageQuery(body.top, body.skip),
		}),
		(_body, response) => ({
			count: response.value.length,
		}),
	);
};

export const get: ExcelEndpoints['worksheetsGet'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.worksheets.get',
		WorksheetsGetInputSchema,
		worksheetSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${workbookBase(body)}/worksheets/${encodeURIComponent(body.worksheet)}`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body, response) => ({
			worksheet: body.worksheet,
			name: response.name,
		}),
	);
};

export const add: ExcelEndpoints['worksheetsAdd'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.worksheets.add',
		WorksheetsAddInputSchema,
		worksheetSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/worksheets/add`,
			headers: sessionHeaders(body.sessionId),
			body: body.name === undefined ? {} : { name: body.name },
		}),
		(_body, response) => ({
			worksheet: response.name,
		}),
	);
};

export const update: ExcelEndpoints['worksheetsUpdate'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.worksheets.update',
		WorksheetsUpdateInputSchema,
		worksheetSchema,
		input,
		(body) => ({
			method: 'PATCH',
			url: `${workbookBase(body)}/worksheets/${encodeURIComponent(body.worksheet)}`,
			headers: sessionHeaders(body.sessionId),
			body: {
				...(body.name !== undefined ? { name: body.name } : {}),
				...(body.position !== undefined ? { position: body.position } : {}),
			},
		}),
		(body, response) => ({
			worksheet: body.worksheet,
			name: response.name,
		}),
	);
};

export const remove: ExcelEndpoints['worksheetsDelete'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.worksheets.delete',
		WorksheetsDeleteInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: `${workbookBase(body)}/worksheets/${encodeURIComponent(body.worksheet)}`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body) => ({
			worksheet: body.worksheet,
		}),
	);
};
