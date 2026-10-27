import type { AnyApiEndpoints } from '..';
import { runSku } from './call';

export const search: AnyApiEndpoints['redditSearch'] = (ctx, input) =>
	runSku(ctx, 'redditSearch', 'reddit.search', 'reddit.search', input);
