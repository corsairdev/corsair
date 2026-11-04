import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call } from './call';

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
