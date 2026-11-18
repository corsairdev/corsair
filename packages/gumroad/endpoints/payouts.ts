import type { GumroadEndpoints } from '..';
import { call } from './call';

export const list: GumroadEndpoints['payoutsList'] = (ctx, input) =>
	call(ctx, 'payoutsList', 'payouts.list', '/payouts', input, {
		toQuery: (parsed) => ({
			after: parsed.after,
			before: parsed.before,
			page_key: parsed.page_key,
			include_upcoming: parsed.include_upcoming,
		}),
	});

export const get: GumroadEndpoints['payoutsGet'] = (ctx, input) =>
	call(
		ctx,
		'payoutsGet',
		'payouts.get',
		`/payouts/${encodeURIComponent(input.id)}`,
		input,
		{
			toQuery: (parsed) => ({
				include_sales: parsed.include_sales,
				include_transactions: parsed.include_transactions,
			}),
		},
	);

export const upcoming: GumroadEndpoints['payoutsUpcoming'] = (ctx, input) =>
	call(ctx, 'payoutsUpcoming', 'payouts.upcoming', '/payouts/upcoming', input, {
		toQuery: (parsed) => ({
			include_sales: parsed.include_sales,
			include_transactions: parsed.include_transactions,
		}),
	});
