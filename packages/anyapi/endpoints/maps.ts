import type { AnyApiEndpoints } from '..';
import { runSku } from './call';

export const search: AnyApiEndpoints['mapsSearch'] = (ctx, input) =>
	runSku(ctx, 'mapsSearch', 'maps.search', 'maps.search', input);
