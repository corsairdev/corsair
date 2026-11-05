import type { ExcelEndpoints } from '../index';
import { sessionHeaders, workbookBase } from '../workbook-path';
import { callExcel } from './call';
import {
	NamesAddInputSchema,
	NamesGetInputSchema,
	NamesListInputSchema,
	NamesRangeInputSchema,
	NamesUpdateInputSchema,
	namedItemListSchema,
	namedItemSchema,
	rangeSchema,
} from './types';

function pageQuery(top: number | undefined, skip: number | undefined) {
	return { $top: top, $skip: skip };
}

function namesRoot(input: {
	driveId?: string;
	itemId?: string;
	itemPath?: string;
	worksheet?: string;
}): string {
	const base = workbookBase(input);
	if (input.worksheet !== undefined) {
		return `${base}/worksheets/${encodeURIComponent(input.worksheet)}/names`;
	}
	return `${base}/names`;
}

export const list: ExcelEndpoints['namesList'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.names.list',
		NamesListInputSchema,
		namedItemListSchema,
		input,
		(body) => ({
			method: 'GET',
			url: namesRoot(body),
			headers: sessionHeaders(body.sessionId),
			query: pageQuery(body.top, body.skip),
		}),
		(_body, response) => ({ count: response.value.length }),
	);
};

export const get: ExcelEndpoints['namesGet'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.names.get',
		NamesGetInputSchema,
		namedItemSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${namesRoot(body)}/${encodeURIComponent(body.name)}`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body, response) => ({
			name: body.name,
			type: response.type ?? null,
		}),
	);
};

export const add: ExcelEndpoints['namesAdd'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.names.add',
		NamesAddInputSchema,
		namedItemSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${namesRoot(body)}/add`,
			headers: sessionHeaders(body.sessionId),
			body: {
				name: body.name,
				reference: body.reference,
				...(body.comment !== undefined ? { comment: body.comment } : {}),
			},
		}),
		(body, response) => ({
			name: response.name,
			requested: body.name,
		}),
	);
};

export const update: ExcelEndpoints['namesUpdate'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.names.update',
		NamesUpdateInputSchema,
		namedItemSchema,
		input,
		(body) => ({
			method: 'PATCH',
			url: `${namesRoot(body)}/${encodeURIComponent(body.name)}`,
			headers: sessionHeaders(body.sessionId),
			body: {
				...(body.comment !== undefined ? { comment: body.comment } : {}),
				...(body.visible !== undefined ? { visible: body.visible } : {}),
			},
		}),
		(body, response) => ({
			name: body.name,
			visible: response.visible ?? null,
		}),
	);
};

export const range: ExcelEndpoints['namesRange'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.names.range',
		NamesRangeInputSchema,
		rangeSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${namesRoot(body)}/${encodeURIComponent(body.name)}/range`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body, response) => ({
			name: body.name,
			address: response.address,
		}),
	);
};
