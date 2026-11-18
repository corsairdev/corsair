import type { DataForSeoEndpoints } from '..';
import { call } from './call';

export const googleOrganic: DataForSeoEndpoints['serpGoogleOrganic'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'serpGoogleOrganic',
		'serp.googleOrganic',
		{
			method: 'POST',
			path: '/v3/serp/google/organic/live/advanced',
		},
		input,
	);

export const googleNews: DataForSeoEndpoints['serpGoogleNews'] = (ctx, input) =>
	call(
		ctx,
		'serpGoogleNews',
		'serp.googleNews',
		{
			method: 'POST',
			path: '/v3/serp/google/news/live/advanced',
		},
		input,
	);

export const locations: DataForSeoEndpoints['serpLocations'] = (ctx, input) =>
	call(
		ctx,
		'serpLocations',
		'serp.locations',
		input && 'country' in input && input.country
			? {
					method: 'GET',
					path: '/v3/serp/google/locations/{country}',
					pathParams: (parsed: { country: string }) => ({
						country: parsed.country.toLowerCase(),
					}),
				}
			: { method: 'GET', path: '/v3/serp/google/locations' },
		input,
	);

export const languages: DataForSeoEndpoints['serpLanguages'] = (ctx, input) =>
	call(
		ctx,
		'serpLanguages',
		'serp.languages',
		{
			method: 'GET',
			path: '/v3/serp/google/languages',
		},
		input,
	);
