import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call } from './call';

export const get: ElasticsearchEndpoints['documentsGet'] = (ctx, input) =>
	call(ctx, 'documentsGet', 'documents.get', input, {
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_doc/${encodeURIComponent(parsed.id)}`,
		notFoundIsResult: true,
	});
