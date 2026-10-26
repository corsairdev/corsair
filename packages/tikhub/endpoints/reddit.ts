import type { TikHubEndpoints } from '..';
import { call } from './call';

// TikHub defaults need_format to false (the raw nested GraphQL payload). The
// compact form keeps results and pagination and is far smaller, so it is the
// default here; callers can still pass need_format: false.
export const search: TikHubEndpoints['redditSearch'] = (ctx, input) =>
	call(
		ctx,
		'redditSearch',
		'reddit.search',
		'/api/v1/reddit/app/fetch_dynamic_search',
		input,
		(parsed) => ({ ...parsed, need_format: parsed.need_format ?? true }),
	);
