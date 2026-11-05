import type { ExcelEndpoints } from '../index';
import { sessionHeaders, workbookBase } from '../workbook-path';
import { callExcel } from './call';
import {
	ChartsAddInputSchema,
	ChartsDeleteInputSchema,
	ChartsGetInputSchema,
	ChartsListInputSchema,
	ChartsSetDataInputSchema,
	ChartsUpdateInputSchema,
	chartListSchema,
	chartSchema,
	emptyOutputSchema,
} from './types';

function chartUrl(
	base: string,
	worksheet: string,
	chart?: string,
	suffix = '',
): string {
	const root = `${base}/worksheets/${encodeURIComponent(worksheet)}/charts`;
	if (chart === undefined) {
		return `${root}${suffix}`;
	}
	return `${root}/${encodeURIComponent(chart)}${suffix}`;
}

function pageQuery(top: number | undefined, skip: number | undefined) {
	return { $top: top, $skip: skip };
}

export const list: ExcelEndpoints['chartsList'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.charts.list',
		ChartsListInputSchema,
		chartListSchema,
		input,
		(body) => ({
			method: 'GET',
			url: chartUrl(workbookBase(body), body.worksheet),
			headers: sessionHeaders(body.sessionId),
			query: pageQuery(body.top, body.skip),
		}),
		(_body, response) => ({ count: response.value.length }),
	);
};

export const get: ExcelEndpoints['chartsGet'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.charts.get',
		ChartsGetInputSchema,
		chartSchema,
		input,
		(body) => ({
			method: 'GET',
			url: chartUrl(workbookBase(body), body.worksheet, body.chart),
			headers: sessionHeaders(body.sessionId),
		}),
		(body, response) => ({
			chart: body.chart,
			name: response.name ?? null,
		}),
	);
};

export const add: ExcelEndpoints['chartsAdd'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.charts.add',
		ChartsAddInputSchema,
		chartSchema,
		input,
		(body) => ({
			method: 'POST',
			url: chartUrl(workbookBase(body), body.worksheet, undefined, '/add'),
			headers: sessionHeaders(body.sessionId),
			body: {
				type: body.type,
				sourceData: body.sourceData,
				...(body.seriesBy !== undefined ? { seriesBy: body.seriesBy } : {}),
			},
		}),
		(body, response) => ({
			type: body.type,
			chart: response.id,
		}),
	);
};

export const update: ExcelEndpoints['chartsUpdate'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.charts.update',
		ChartsUpdateInputSchema,
		chartSchema,
		input,
		(body) => ({
			method: 'PATCH',
			url: chartUrl(workbookBase(body), body.worksheet, body.chart),
			headers: sessionHeaders(body.sessionId),
			body: {
				...(body.name !== undefined ? { name: body.name } : {}),
				...(body.height !== undefined ? { height: body.height } : {}),
				...(body.width !== undefined ? { width: body.width } : {}),
				...(body.left !== undefined ? { left: body.left } : {}),
				...(body.top !== undefined ? { top: body.top } : {}),
			},
		}),
		(body, response) => ({
			chart: body.chart,
			name: response.name ?? null,
		}),
	);
};

export const remove: ExcelEndpoints['chartsDelete'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.charts.delete',
		ChartsDeleteInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: chartUrl(workbookBase(body), body.worksheet, body.chart),
			headers: sessionHeaders(body.sessionId),
		}),
		(body) => ({ chart: body.chart }),
	);
};

export const setData: ExcelEndpoints['chartsSetData'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.charts.setData',
		ChartsSetDataInputSchema,
		emptyOutputSchema,
		input,
		(body) => ({
			method: 'POST',
			url: chartUrl(workbookBase(body), body.worksheet, body.chart, '/setData'),
			headers: sessionHeaders(body.sessionId),
			body: {
				sourceData: body.sourceData,
				...(body.seriesBy !== undefined ? { seriesBy: body.seriesBy } : {}),
			},
		}),
		(body) => ({ chart: body.chart }),
	);
};
