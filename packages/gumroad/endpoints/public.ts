import type { GumroadEndpoints } from '..';
import { call } from './call';

// Unauthenticated public reads served from the profile subdomain, not the API
// host ("https://[seller].gumroad.com/l/:permalink.json"); the Bearer header
// from the stored key is harmless here. Live-verified 2026-11-05: the product
// page answers on the subdomain host, but the profile endpoint does not
// (the docs' own subdomain cURL 404s); the apex path form
// https://gumroad.com/<username>.json is the one that answers.
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
	call(
		ctx,
		'publicProfile',
		'public.profile',
		`/${encodeURIComponent(input.username)}.json`,
		input,
		{ baseUrl: () => 'https://gumroad.com' },
	);
