import { asRecord } from 'corsair/core';
import type { KeywordEndpoints } from '..';
import { definedQuery, projectSegment, segment } from '../client';
import { call } from './call';
import {
	KeywordEndpointInputSchemas as Inputs,
	KeywordEndpointOutputSchemas as Outputs,
} from './types';

export const metrics: KeywordEndpoints['metricsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'metrics.get',
			input: Inputs.metricsGet,
			output: Outputs.metricsGet,
		},
		input,
		({ projectName, tagId, timeframe }) => ({
			method: 'GET',
			path: `/groups/${projectSegment(projectName)}/metrics`,
			query: definedQuery({ tagId, timeframe }),
		}),
		{ log: ({ projectName }) => ({ projectName }) },
	);

// Rank history is a POST with the keyword IDs in the body and the day range in
// the query, which is how Keyword documents it.
export const rankChart: KeywordEndpoints['rankChart'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rankChart',
			input: Inputs.rankChart,
			output: Outputs.rankChart,
		},
		input,
		({ keywordIds, limit }) => ({
			method: 'POST',
			path: '/keywords/chart',
			query: definedQuery({ action: 'bulkChart', limit }),
			body: { kwid: keywordIds.map(String) },
		}),
		{
			shape: cleanRankChart,
			log: (_, result) => ({ keywords: result.data.length }),
		},
	);

export const competitors: KeywordEndpoints['competitors'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'competitors',
			input: Inputs.competitors,
			output: Outputs.competitors,
		},
		input,
		({ projectName, keywordId, dateRange }) => ({
			method: 'GET',
			path: `/metrics/${projectSegment(projectName)}/competitors/${segment(keywordId)}/history`,
			query: definedQuery({ dateRange }),
		}),
		{
			log: ({ projectName, keywordId }, result) => ({
				projectName,
				keywordId: String(keywordId),
				snapshots: result.data.length,
			}),
		},
	);

export const regions: KeywordEndpoints['regionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'regions.list',
			input: Inputs.regionsList,
			output: Outputs.regionsList,
		},
		input,
		({ projectName }) => ({
			method: 'GET',
			path: `/groups/${projectSegment(projectName)}/regions`,
		}),
		{
			log: ({ projectName }, result) => ({
				projectName,
				count: result.data.length,
			}),
		},
	);

export const rankingUrls: KeywordEndpoints['rankingUrls'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'rankingUrls',
			input: Inputs.rankingUrls,
			output: Outputs.rankingUrls,
		},
		input,
		({ projectName, page }) => ({
			method: 'GET',
			path: `/groups/${projectSegment(projectName)}/keywords/ranking-urls`,
			query: definedQuery({ page }),
		}),
		{
			log: ({ projectName }, result) => ({
				projectName,
				count: result.data.length,
			}),
		},
	);

// `Date.UTC(2026,10,13)`: Highcharts text with a zero-based month.
const HIGHCHARTS_DATE = /^Date\.UTC\((\d{4}),(\d{1,2}),(\d{1,2})\)$/;
// `<kwid>|<the keyword's auth key>`.
const KWID_WITH_AUTH = /^(\d+)\|[^|]+$/;

function isoDate(value: string): string {
	const match = HIGHCHARTS_DATE.exec(value);
	if (!match) return value;
	const [, year, month, day] = match;
	return `${year}-${String(Number(month) + 1).padStart(2, '0')}-${day?.padStart(2, '0')}`;
}

/**
 * Each keyword's chart `data` is a tuple (live, 11-14): series lists, a label,
 * `<kwid>|<keyword auth key>` and a ranking-URL summary. The auth key is cut
 * from that string, since it is a credential like the `auth` attributes, and
 * series dates sent as `Date.UTC(...)` text become `YYYY-MM-DD`.
 */
// unknown: raw is the response body; the output schema validates the result.
function cleanRankChart(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record || !Array.isArray(record.data)) return raw;
	return {
		...record,
		data: record.data.map((keyword) => {
			const entry = asRecord(keyword);
			if (!entry || !Array.isArray(entry.data)) return keyword;
			return { ...entry, data: entry.data.map(cleanChartPart) };
		}),
	};
}

// unknown: one element of the chart tuple, of any of its kinds.
function cleanChartPart(part: unknown): unknown {
	if (typeof part === 'string') return part.replace(KWID_WITH_AUTH, '$1');
	if (!Array.isArray(part)) return part;
	return part.map((series) => {
		const record = asRecord(series);
		if (!record || !Array.isArray(record.data)) return series;
		return {
			...record,
			data: record.data.map((point) =>
				Array.isArray(point) && typeof point[0] === 'string'
					? [isoDate(point[0]), ...point.slice(1)]
					: point,
			),
		};
	});
}
