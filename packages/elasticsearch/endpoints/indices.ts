import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call } from './call';

export const list: ElasticsearchEndpoints['indicesList'] = (ctx, input) =>
	call(ctx, 'indicesList', 'indices.list', input, {
		path: (parsed) =>
			parsed.index
				? `/_cat/indices/${encodeIndexTarget(parsed.index)}`
				: '/_cat/indices',
		query: () => ({ format: 'json' }),
	});

export const get: ElasticsearchEndpoints['indicesGet'] = (ctx, input) =>
	call(ctx, 'indicesGet', 'indices.get', input, {
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}`,
	});
