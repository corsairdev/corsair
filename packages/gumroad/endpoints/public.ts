import type { GumroadEndpoints } from '..';
import { call } from './call';

// Unauthenticated public reads served from the profile subdomain, not the API
// host ("https://[seller].gumroad.com/l/:permalink.json"); the Bearer header
// from the stored key is harmless here.
export const product: GumroadEndpoints['publicProduct'] = (ctx, input) =>
	call(
		ctx,
		'publicProduct',
		'public.product',
		`/l/${encodeURIComponent(input.permalink)}.json`,
		input,
		{
			baseUrl: (parsed) => `https://${parsed.seller}.gumroad.com`,
		},
	);

export const profile: GumroadEndpoints['publicProfile'] = (ctx, input) =>
	call(ctx, 'publicProfile', 'public.profile', '/.json', input, {
		baseUrl: (parsed) => `https://${parsed.username}.gumroad.com`,
	});
