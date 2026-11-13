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
		{ log: (_, result) => ({ keywords: result.data.length }) },
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
