import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, pickBody, pickQuery } from './call';
import type { SearchMsearchInput } from './types';

export const run: ElasticsearchEndpoints['searchRun'] = (ctx, input) =>
	call(ctx, 'searchRun', 'search.run', input, {
		// POST: the documented alternative to GET-with-body, which Node's
		// fetch rejects outright.
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_search`,
		body: (parsed) => {
			const { index: _index, ...body } = parsed;
			return body;
		},
	});

export const count: ElasticsearchEndpoints['searchCount'] = (ctx, input) =>
	call(ctx, 'searchCount', 'search.count', input, {
		// Without a body the documented GET works; with a query body, POST is
		// the documented alternative to GET-with-body.
		method: input?.query !== undefined ? 'POST' : 'GET',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_count`,
		body: (parsed) => {
			const body: Record<string, unknown> = {};
			if (parsed.query !== undefined) body.query = parsed.query;
			return body;
		},
	});

// Serialize typed msearch sub-searches into the newline-delimited
// header/body pairs the multi-search API requires.
export function msearchToNdjson(parsed: SearchMsearchInput): string {
	if (parsed.searches === undefined) return parsed.ndjson ?? '';
	const lines: string[] = [];
	for (const search of parsed.searches) {
		const header: Record<string, unknown> = {};
		if (search.index !== undefined) header.index = search.index;
		lines.push(JSON.stringify(header));
		const body: Record<string, unknown> = {};
		if (search.query !== undefined) body.query = search.query;
		if (search.from !== undefined) body.from = search.from;
		if (search.size !== undefined) body.size = search.size;
		lines.push(JSON.stringify(body));
	}
	return `${lines.join('\n')}\n`;
}

export const msearch: ElasticsearchEndpoints['searchMsearch'] = (ctx, input) =>
	call(ctx, 'searchMsearch', 'search.msearch', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_msearch`,
		body: (parsed) => msearchToNdjson(parsed),
		mediaType: () => 'application/x-ndjson',
	});

export const msearchTemplate: ElasticsearchEndpoints['searchMsearchTemplate'] =
	(ctx, input) =>
		call(ctx, 'searchMsearchTemplate', 'search.msearchTemplate', input, {
			method: 'POST',
			path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_msearch/template`,
			body: (parsed) => {
				if (parsed.ndjson !== undefined) return parsed.ndjson;
				const lines: string[] = [];
				for (const search of parsed.searches ?? []) {
					const header: Record<string, unknown> = {};
					if (search.index !== undefined) header.index = search.index;
					lines.push(JSON.stringify(header));
					lines.push(
						JSON.stringify({ id: search.id, params: search.params ?? {} }),
					);
				}
				return `${lines.join('\n')}\n`;
			},
			mediaType: () => 'application/x-ndjson',
		});

export const template: ElasticsearchEndpoints['searchTemplate'] = (
	ctx,
	input,
) =>
	call(ctx, 'searchTemplate', 'search.template', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_search/template`,
		body: (parsed) => pickBody(parsed, ['id', 'source', 'params']),
	});

export const termsEnum: ElasticsearchEndpoints['searchTermsEnum'] = (
	ctx,
	input,
) =>
	call(ctx, 'searchTermsEnum', 'search.termsEnum', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_terms_enum`,
		body: (parsed) =>
			pickBody(parsed, ['field', 'string', 'size', 'case_insensitive']),
	});

export const fieldCaps: ElasticsearchEndpoints['searchFieldCaps'] = (
	ctx,
	input,
) =>
	call(ctx, 'searchFieldCaps', 'search.fieldCaps', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_field_caps`,
		query: (parsed) => pickQuery(parsed, ['fields']),
	});

export const shards: ElasticsearchEndpoints['searchShards'] = (ctx, input) =>
	call(ctx, 'searchShards', 'search.shards', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_search_shards`,
		query: (parsed) => pickQuery(parsed, ['routing', 'preference', 'local']),
	});

export const openPointInTime: ElasticsearchEndpoints['searchOpenPointInTime'] =
	(ctx, input) =>
		call(ctx, 'searchOpenPointInTime', 'search.openPointInTime', input, {
			method: 'POST',
			path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_pit`,
			query: (parsed) =>
				pickQuery(parsed, ['keep_alive', 'preference', 'routing']),
		});

export const rankEval: ElasticsearchEndpoints['searchRankEval'] = (
	ctx,
	input,
) =>
	call(ctx, 'searchRankEval', 'search.rankEval', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_rank_eval`,
		body: (parsed) => pickBody(parsed, ['requests', 'metric']),
	});

export const vectorTile: ElasticsearchEndpoints['searchVectorTile'] = (
	ctx,
	input,
) =>
	call(ctx, 'searchVectorTile', 'search.vectorTile', input, {
		// Binary protobuf response: the JSON client cannot carry it.
		binary: true,
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_mvt/${encodeURIComponent(parsed.field)}/${parsed.zoom}/${parsed.x}/${parsed.y}`,
		query: (parsed) =>
			pickQuery(parsed, [
				'exact_bounds',
				'extent',
				'grid_agg',
				'grid_precision',
				'grid_type',
				'size',
				'with_labels',
			]),
	});

export const eql: ElasticsearchEndpoints['searchEql'] = (ctx, input) =>
	call(ctx, 'searchEql', 'search.eql', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_eql/search`,
		query: (parsed) =>
			pickQuery(parsed, [
				'wait_for_completion_timeout',
				'keep_alive',
				'keep_on_completion',
			]),
		body: (parsed) => pickBody(parsed, ['query', 'size', 'event_category']),
	});

export const asyncSubmit: ElasticsearchEndpoints['searchAsyncSubmit'] = (
	ctx,
	input,
) =>
	call(ctx, 'searchAsyncSubmit', 'search.asyncSubmit', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_async_search`,
		query: (parsed) =>
			pickQuery(parsed, [
				'wait_for_completion_timeout',
				'keep_alive',
				'keep_on_completion',
			]),
		body: (parsed) => pickBody(parsed, ['query', 'from', 'size']),
	});

export const graphExplore: ElasticsearchEndpoints['searchGraphExplore'] = (
	ctx,
	input,
) =>
	call(ctx, 'searchGraphExplore', 'search.graphExplore', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_graph/explore`,
		query: (parsed) => pickQuery(parsed, ['timeout']),
		body: (parsed) => pickBody(parsed, ['vertices']),
	});

export const validateQuery: ElasticsearchEndpoints['searchValidateQuery'] = (
	ctx,
	input,
) =>
	call(ctx, 'searchValidateQuery', 'search.validateQuery', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_validate/query`,
		query: (parsed) =>
			pickQuery(parsed, ['q', 'explain', 'rewrite', 'all_shards']),
		body: (parsed) => pickBody(parsed, ['query']),
	});
