import type { GumroadEndpoints } from '..';
import { call } from './call';

export const list: GumroadEndpoints['salesList'] = (ctx, input) =>
	call(ctx, 'salesList', 'sales.list', '/sales', input, {
		toQuery: (parsed) => ({
			after: parsed.after,
			before: parsed.before,
			product_id: parsed.product_id,
			email: parsed.email,
			order_id: parsed.order_id,
			name: parsed.name,
			license_key: parsed.license_key,
			page_key: parsed.page_key,
		}),
	});

export const get: GumroadEndpoints['salesGet'] = (ctx, input) =>
	call(
		ctx,
		'salesGet',
		'sales.get',
		`/sales/${encodeURIComponent(input.id)}`,
		input,
	);
