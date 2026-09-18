import { logEventFromContext } from 'corsair/core';
import type { ZenserpEndpoints } from '..';
import { makeZenserpRequest } from '../client';
import {
	CountriesResponseSchema,
	LanguagesResponseSchema,
	ListCountriesInputSchema,
	ListLanguagesInputSchema,
	ListLocationsInputSchema,
	ListSearchEnginesInputSchema,
	LocationsResponseSchema,
	SearchEnginesResponseSchema,
} from './types';

export const listCountries: ZenserpEndpoints['metadataListCountries'] = async (
	ctx,
	rawInput,
) => {
	ListCountriesInputSchema.parse(rawInput);
	const response = CountriesResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v2/gl', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'zenserp.metadata.listCountries',
		{ count: response.length },
		'completed',
	);
	return response;
};

export const listLocations: ZenserpEndpoints['metadataListLocations'] = async (
	ctx,
	rawInput,
) => {
	const input = ListLocationsInputSchema.parse(rawInput);
	const response = LocationsResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v2/locations', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'zenserp.metadata.listLocations',
		{ count: response.length },
		'completed',
	);
	return response;
};

export const listSearchEngines: ZenserpEndpoints['metadataListSearchEngines'] =
	async (ctx, rawInput) => {
		ListSearchEnginesInputSchema.parse(rawInput);
		const response = SearchEnginesResponseSchema.parse(
			await makeZenserpRequest<unknown>('/api/v2/search_engines', ctx.key),
		);
		await logEventFromContext(
			ctx,
			'zenserp.metadata.listSearchEngines',
			{ count: response.length },
			'completed',
		);
		return response;
	};

export const listLanguages: ZenserpEndpoints['metadataListLanguages'] = async (
	ctx,
	rawInput,
) => {
	ListLanguagesInputSchema.parse(rawInput);
	const response = LanguagesResponseSchema.parse(
		await makeZenserpRequest<unknown>('/api/v2/hl', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'zenserp.metadata.listLanguages',
		{ count: response.length },
		'completed',
	);
	return response;
};
