import type { ContactOutEndpoints } from '..';
import { call } from './call';

export const stats: ContactOutEndpoints['accountStats'] = (ctx, input) =>
	call(ctx, 'accountStats', 'account.stats', 'GET', 'v1/stats', input);
