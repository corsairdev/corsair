import type { InboxkitEndpoints } from '..';
import { call } from './call';

export const get: InboxkitEndpoints['accountGet'] = (ctx, input) =>
	call(ctx, 'accountGet', input, () => ({
		method: 'GET',
		path: '/v1/api/account',
	}));
