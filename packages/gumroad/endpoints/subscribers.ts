import type { GumroadEndpoints } from '..';
import { call } from './call';

export const list: GumroadEndpoints['subscribersList'] = (ctx, input) =>
	call(
		ctx,
		'subscribersList',
		'subscribers.list',
		`/products/${encodeURIComponent(input.product_id)}/subscribers`,
		input,
		{
			toQuery: (parsed) => ({
				email: parsed.email,
				paginated: parsed.paginated,
				page_key: parsed.page_key,
			}),
		},
	);
