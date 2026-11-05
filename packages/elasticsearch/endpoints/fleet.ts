import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, pickBody, pickQuery } from './call';
import { msearchToNdjson } from './search';

export const search: ElasticsearchEndpoints['fleetSearch'] = (ctx, input) =>
	call(ctx, 'fleetSearch', 'fleet.search', input, {
		method: 'POST',
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_fleet/_fleet_search`,
		query: (parsed) => ({
			// Comma-separated checkpoint list per the spec's array param.
			wait_for_checkpoints: parsed.wait_for_checkpoints?.join(','),
		}),
		body: (parsed) => pickBody(parsed, ['query', 'from', 'size']),
	});

export const msearch: ElasticsearchEndpoints['fleetMsearch'] = (ctx, input) =>
	call(ctx, 'fleetMsearch', 'fleet.msearch', input, {
		method: 'POST',
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_fleet/_fleet_msearch`,
		query: (parsed) => ({
			wait_for_checkpoints: parsed.wait_for_checkpoints?.join(','),
		}),
		body: (parsed) => msearchToNdjson(parsed),
		mediaType: () => 'application/x-ndjson',
	});

export const globalCheckpoints: ElasticsearchEndpoints['fleetGlobalCheckpoints'] =
	(ctx, input) =>
		call(ctx, 'fleetGlobalCheckpoints', 'fleet.globalCheckpoints', input, {
			path: (parsed) =>
				`/${encodeIndexTarget(parsed.index)}/_fleet/global_checkpoints`,
			query: (parsed) => ({
				...pickQuery(parsed, ['wait_for_advance', 'wait_for_index', 'timeout']),
				checkpoints: parsed.checkpoints?.join(','),
			}),
		});
