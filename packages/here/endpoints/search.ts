import { HERE_HOSTS, makeHereRequest } from '../client';
import type { HereEndpoints } from '../index';
import { runHereEndpoint } from './call';
import {
	AutocompleteInputSchema,
	AutocompleteResponseSchema,
	AutosuggestInputSchema,
	AutosuggestResponseSchema,
	BrowseInputSchema,
	BrowseResponseSchema,
	DiscoverInputSchema,
	DiscoverResponseSchema,
	GeocodeInputSchema,
	GeocodeResponseSchema,
	LookupInputSchema,
	LookupResponseSchema,
	ReverseGeocodeInputSchema,
	ReverseGeocodeResponseSchema,
} from './types';

export const autosuggest: HereEndpoints['autosuggest'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.search.autosuggest',
		AutosuggestInputSchema,
		AutosuggestResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.autosuggest, '/v1/autosuggest', apiKey, {
				query: validated,
			}),
	);

export const autocomplete: HereEndpoints['autocomplete'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.search.autocomplete',
		AutocompleteInputSchema,
		AutocompleteResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.autocomplete, '/v1/autocomplete', apiKey, {
				query: validated,
			}),
	);

export const browse: HereEndpoints['browse'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.search.browse',
		BrowseInputSchema,
		BrowseResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.browse, '/v1/browse', apiKey, {
				query: validated,
			}),
	);

export const discover: HereEndpoints['discover'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.search.discover',
		DiscoverInputSchema,
		DiscoverResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.discover, '/v1/discover', apiKey, {
				query: validated,
			}),
	);

export const geocode: HereEndpoints['geocode'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.search.geocode',
		GeocodeInputSchema,
		GeocodeResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.geocode, '/v1/geocode', apiKey, {
				query: validated,
			}),
	);

export const reverseGeocode: HereEndpoints['reverseGeocode'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.search.reverseGeocode',
		ReverseGeocodeInputSchema,
		ReverseGeocodeResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.revgeocode, '/v1/revgeocode', apiKey, {
				query: validated,
			}),
	);

export const lookup: HereEndpoints['lookup'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.search.lookup',
		LookupInputSchema,
		LookupResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.lookup, '/v1/lookup', apiKey, {
				query: validated,
			}),
	);
