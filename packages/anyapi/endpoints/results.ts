import type { AnyApiEndpoints } from '..';
import { call, splitControls } from './call';

// Free: re-reads a result cached for about 15 minutes after its run.
export const get: AnyApiEndpoints['resultsGet'] = (ctx, input) =>
	call(ctx, 'resultsGet', 'results.get', input, (parsed) => {
		const { rest, query } = splitControls(parsed);
		return {
			method: 'GET',
			path: `/v1/results/${encodeURIComponent(rest.resultId)}`,
			query,
		};
	});
