import { logEventFromContext } from 'corsair/core';
import type { CompanyenrichEndpoints } from '..';
import { makeCompanyEnrichRequest } from '../client';
import type {
	GeoCountry,
	GeoRegionsResponse,
	GeoSearchCitiesResponse,
	GeoSearchCountriesResponse,
	GeoSearchStatesResponse,
} from './types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './types';

// Geo reference data. Every endpoint in this group is free (docs:
// https://docs.companyenrich.com/reference/get_v2-geo-regions.md and the
// /v2/geo search pages).

export const geoRegions: CompanyenrichEndpoints['geoRegions'] = async (
	ctx,
	input,
) => {
	CompanyenrichEndpointInputSchemas.geoRegions.parse(input);

	// Returns every region with the country codes it covers (docs:
	// https://docs.companyenrich.com/reference/get_v2-geo-regions.md).
	const response = await makeCompanyEnrichRequest<GeoRegionsResponse>(
		'/v2/geo/regions',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = CompanyenrichEndpointOutputSchemas.geoRegions.parse(response);

	await logEventFromContext(
		ctx,
		'companyenrich.geo.regions',
		{ count: parsed.items.length },
		'completed',
	);

	return parsed;
};

export const geoGetCountry: CompanyenrichEndpoints['geoGetCountry'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CompanyenrichEndpointInputSchemas.geoGetCountry.parse(input);

	// Two-letter code lookup; no credit cost (docs:
	// https://docs.companyenrich.com/reference/get_v2-geo-countries-countrycode.md).
	const response = await makeCompanyEnrichRequest<GeoCountry>(
		`/v2/geo/countries/${encodeURIComponent(parsedInput.countryCode)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed =
		CompanyenrichEndpointOutputSchemas.geoGetCountry.parse(response);

	await logEventFromContext(
		ctx,
		'companyenrich.geo.getCountry',
		{ count: 1 },
		'completed',
	);

	return parsed;
};

export const geoSearchCountries: CompanyenrichEndpoints['geoSearchCountries'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.geoSearchCountries.parse(input);

		// Literal, case-insensitive substring search with cursor pagination (docs:
		// https://docs.companyenrich.com/reference/post_v2-geo-countries.md).
		const response = await makeCompanyEnrichRequest<GeoSearchCountriesResponse>(
			'/v2/geo/countries',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.geoSearchCountries.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.geo.searchCountries',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};

export const geoSearchStates: CompanyenrichEndpoints['geoSearchStates'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.geoSearchStates.parse(input);

		// Same substring search and cursor pagination, optionally narrowed to
		// country codes (docs:
		// https://docs.companyenrich.com/reference/post_v2-geo-states.md).
		const response = await makeCompanyEnrichRequest<GeoSearchStatesResponse>(
			'/v2/geo/states',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.geoSearchStates.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.geo.searchStates',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};

export const geoSearchCities: CompanyenrichEndpoints['geoSearchCities'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.geoSearchCities.parse(input);

		// Optional state and country filters; the returned city ID is what company
		// search filters accept (docs:
		// https://docs.companyenrich.com/reference/post_v2-geo-cities.md).
		const response = await makeCompanyEnrichRequest<GeoSearchCitiesResponse>(
			'/v2/geo/cities',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			CompanyenrichEndpointOutputSchemas.geoSearchCities.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.geo.searchCities',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};
