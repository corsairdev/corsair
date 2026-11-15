import type { AnyApiEndpoints } from '..';
import { runSku } from './call';

export const search: AnyApiEndpoints['googleSearch'] = (ctx, input) =>
	runSku(ctx, 'googleSearch', 'google.search', 'google.search', input);
