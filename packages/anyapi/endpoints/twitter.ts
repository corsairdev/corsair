import type { AnyApiEndpoints } from '..';
import { runSku } from './call';

export const search: AnyApiEndpoints['twitterSearch'] = (ctx, input) =>
	runSku(ctx, 'twitterSearch', 'twitter.search', 'twitter.search', input);
