import type { NeutrinoEndpoints } from '..';
import { call } from './call';
import {
	NeutrinoEndpointInputSchemas as Inputs,
	NeutrinoEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Forward geocoding from a full address or its parts. Neutrino takes either
 * `address` on its own or the structured fields, and answers every location it
 * matched rather than one.
 */
export const address: NeutrinoEndpoints['geocodeAddress'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'geocode.address',
			input: Inputs.geocodeAddress,
			output: Outputs.geocodeAddress,
		},
		input,
		({
			address: full,
			houseNumber,
			street,
			city,
			state,
			postalCode,
			country,
			languageCode,
		}) => ({
			method: 'GET',
			path: '/geocode-address',
			query: {
				address: full,
				'house-number': houseNumber,
				street,
				city,
				state,
				'postal-code': postalCode,
				country,
				'language-code': languageCode,
			},
		}),
		{
			log: (_, result) => ({
				found: result.found ?? undefined,
				matches: result.locations?.length ?? 0,
			}),
		},
	);

/**
 * Reverse geocoding from a coordinate, with both a country-specific address and
 * a structured one that has the same fields everywhere.
 */
export const reverse: NeutrinoEndpoints['geocodeReverse'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'geocode.reverse',
			input: Inputs.geocodeReverse,
			output: Outputs.geocodeReverse,
		},
		input,
		({ latitude, longitude, languageCode }) => ({
			method: 'GET',
			path: '/geocode-reverse',
			query: {
				latitude,
				longitude,
				'language-code': languageCode,
			},
		}),
		{
			log: (_, result) => ({
				found: result.found ?? undefined,
				country: result.country ?? undefined,
				city: result.city ?? undefined,
			}),
		},
	);

/**
 * Card facts from a BIN: the brand, category, type and issuing country, plus
 * whether the caller's IP looks consistent with that country.
 */
export const binLookup: NeutrinoEndpoints['binLookup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'commerce.binLookup',
			input: Inputs.binLookup,
			output: Outputs.binLookup,
		},
		input,
		({ binNumber }) => ({
			method: 'GET',
			path: '/bin-lookup',
			query: { 'bin-number': binNumber },
		}),
		{
			log: (_, result) => ({
				brand: result['card-type'] ?? undefined,
				category: result['card-category'] ?? undefined,
				country: result['country-code'] ?? undefined,
			}),
		},
	);

/**
 * Converts between currencies, units and number bases. `from-type` and
 * `to-type` are the unit codes Neutrino publishes, so they are passed through
 * rather than enumerated here.
 */
export const convert: NeutrinoEndpoints['convert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'commerce.convert',
			input: Inputs.convert,
			output: Outputs.convert,
		},
		input,
		({ fromValue, fromType, toType }) => ({
			method: 'GET',
			path: '/convert',
			query: {
				'from-value': fromValue,
				'from-type': fromType,
				'to-type': toType,
			},
		}),
		{
			log: (_, result) => ({
				result: result.result ?? undefined,
				valid: result.valid ?? undefined,
			}),
		},
	);
