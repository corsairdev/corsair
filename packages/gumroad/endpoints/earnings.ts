import type { GumroadEndpoints } from '..';
import { call } from './call';

export const get: GumroadEndpoints['earningsGet'] = (ctx, input) =>
	call(ctx, 'earningsGet', 'earnings.get', '/earnings', input, {
		toQuery: (parsed) => ({ year: parsed.year }),
	});
