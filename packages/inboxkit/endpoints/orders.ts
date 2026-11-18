import type { InboxkitEndpoints } from '..';
import { call } from './call';

export const place: InboxkitEndpoints['ordersPlace'] = (ctx, input) =>
	call(ctx, 'ordersPlace', input, (body) => ({
		method: 'POST',
		path: '/v1/api/orders',
		body,
	}));
