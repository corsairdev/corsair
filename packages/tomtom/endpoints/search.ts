import type { TomTomEndpoints } from '..';
import { point } from '../client';
import { call } from './call';
import {
	TomTomEndpointInputSchemas,
	TomTomEndpointOutputSchemas,
} from './types';

export const fuzzySearch: TomTomEndpoints['searchFuzzy'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'search.fuzzy',
			input: TomTomEndpointInputSchemas.fuzzySearch,
			output: TomTomEndpointOutputSchemas.fuzzySearch,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `search/2/search/${encodeURIComponent(parsed.query)}.json`,
			query: {
				typeahead: parsed.typeahead,
				limit: parsed.limit,
				ofs: parsed.offset,
				countrySet: parsed.country_set,
				language: parsed.language,
				lat: parsed.lat,
				lon: parsed.lon,
				radius: parsed.radius,
			},
		}),
		{
			log: (parsed, result) => ({
				limit: parsed.limit ?? 10,
				results: result.results.length,
				total: result.summary?.totalResults ?? undefined,
			}),
		},
	);

export const geocode: TomTomEndpoints['searchGeocode'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'search.geocode',
			input: TomTomEndpointInputSchemas.geocode,
			output: TomTomEndpointOutputSchemas.geocode,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `search/2/geocode/${encodeURIComponent(parsed.query)}.json`,
			query: {
				limit: parsed.limit,
				ofs: parsed.offset,
				countrySet: parsed.country_set,
				language: parsed.language,
				lat: parsed.lat,
				lon: parsed.lon,
			},
		}),
		{ log: (_parsed, result) => ({ results: result.results?.length ?? 0 }) },
	);

export const reverseGeocode: TomTomEndpoints['searchReverseGeocode'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'search.reverseGeocode',
			input: TomTomEndpointInputSchemas.reverseGeocode,
			output: TomTomEndpointOutputSchemas.reverseGeocode,
		},
		input,
		(parsed) => ({
			method: 'GET',
			// The comma is a documented part of the path segment, so it is left
			// literal: `52.378,4.9`, the way TomTom's own examples spell it.
			path: `search/2/reverseGeocode/${point(parsed.latitude, parsed.longitude)}.json`,
			query: { radius: parsed.radius, language: parsed.language },
		}),
		{ log: (_parsed, result) => ({ addresses: result.addresses.length }) },
	);
