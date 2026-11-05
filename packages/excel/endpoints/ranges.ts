import type { ExcelEndpoints } from '../index';
import { odataQuoted, sessionHeaders, workbookBase } from '../workbook-path';
import { callExcel } from './call';
import {
	emptyOutputSchema,
	RangesClearInputSchema,
	RangesGetInputSchema,
	RangesUpdateInputSchema,
	RangesUsedInputSchema,
	rangeSchema,
} from './types';

function rangeUrl(
	base: string,
	worksheet: string,
	address: string,
	suffix = '',
): string {
	return `${base}/worksheets/${encodeURIComponent(worksheet)}/range(address='${odataQuoted(address)}')${suffix}`;
}

export const get: ExcelEndpoints['rangesGet'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.ranges.get',
		RangesGetInputSchema,
		rangeSchema,
		input,
		(body) => ({
			method: 'GET',
			url: rangeUrl(workbookBase(body), body.worksheet, body.address),
			headers: sessionHeaders(body.sessionId),
		}),
		(body, response) => ({
			worksheet: body.worksheet,
			address: response.address,
		}),
	);
};

export const usedRange: ExcelEndpoints['rangesUsed'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.ranges.usedRange',
		RangesUsedInputSchema,
		rangeSchema,
		input,
		(body) => {
			const flag =
				body.valuesOnly === undefined
					? ''
					: `(valuesOnly=${body.valuesOnly ? 'true' : 'false'})`;
			return {
				method: 'GET',
				url: `${workbookBase(body)}/worksheets/${encodeURIComponent(body.worksheet)}/usedRange${flag}`,
				headers: sessionHeaders(body.sessionId),
			};
		},
		(body, response) => ({
			worksheet: body.worksheet,
			address: response.address,
		}),
	);
};

export const update: ExcelEndpoints['rangesUpdate'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.ranges.update',
		RangesUpdateInputSchema,
		rangeSchema,
		input,
		(body) => ({
			method: 'PATCH',
			url: rangeUrl(workbookBase(body), body.worksheet, body.address),
			headers: sessionHeaders(body.sessionId),
			body: {
				...(body.values !== undefined ? { values: body.values } : {}),
				...(body.formulas !== undefined ? { formulas: body.formulas } : {}),
				...(body.numberFormat !== undefined
					? { numberFormat: body.numberFormat }
					: {}),
			},
		}),
		(body, response) => ({
			worksheet: body.worksheet,
			address: response.address,
		}),
	);
};

export const clear: ExcelEndpoints['rangesClear'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.ranges.clear',
		RangesClearInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'POST',
			url: rangeUrl(workbookBase(body), body.worksheet, body.address, '/clear'),
			headers: sessionHeaders(body.sessionId),
			body: body.applyTo === undefined ? {} : { applyTo: body.applyTo },
		}),
		(body) => ({
			worksheet: body.worksheet,
			address: body.address,
		}),
	);
};
