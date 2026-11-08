import type { FoursquareEndpoints } from '..';
import { call, csv, fieldsWith, queryOf } from './call';
import {
	FoursquareEndpointInputSchemas as Inputs,
	FoursquareEndpointOutputSchemas as Outputs,
} from './types';

export const search: FoursquareEndpoints['placesSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'places.search',
			input: Inputs.placesSearch,
			output: Outputs.placesSearch,
		},
		input,
		({
			query,
			ll,
			near,
			ne,
			sw,
			radius,
			fsq_category_ids,
			fsq_chain_ids,
			exclude_fsq_chain_ids,
			exclude_all_chains,
			min_price,
			max_price,
			open_now,
			open_at,
			sort,
			tel_format,
			fields,
			limit,
		}) => ({
			method: 'GET',
			path: '/places/search',
			query: queryOf({
				query,
				ll,
				near,
				ne,
				sw,
				radius,
				fsq_category_ids: csv(fsq_category_ids),
				fsq_chain_ids: csv(fsq_chain_ids),
				exclude_fsq_chain_ids: csv(exclude_fsq_chain_ids),
				exclude_all_chains,
				min_price,
				max_price,
				open_now,
				open_at,
				sort,
				tel_format,
				fields: fieldsWith(fields, ['fsq_place_id']),
				limit,
			}),
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const get: FoursquareEndpoints['placesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'places.get',
			input: Inputs.placesGet,
			output: Outputs.placesGet,
		},
		input,
		({ fsq_place_id, fields }) => ({
			method: 'GET',
			path: `/places/${encodeURIComponent(fsq_place_id)}`,
			query: queryOf({ fields: fieldsWith(fields, ['fsq_place_id']) }),
		}),
		{
			log: (_, result) => ({ fsqPlaceId: result.fsq_place_id }),
		},
	);

export const autocomplete: FoursquareEndpoints['placesAutocomplete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'places.autocomplete',
			input: Inputs.placesAutocomplete,
			output: Outputs.placesAutocomplete,
		},
		input,
		({ query, ll, radius, types, bias, session_token, limit }) => ({
			method: 'GET',
			path: '/autocomplete',
			query: queryOf({
				query,
				ll,
				radius,
				types: csv(types),
				bias,
				session_token,
				limit,
			}),
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const tips: FoursquareEndpoints['placesTips'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'places.tips',
			input: Inputs.placesTips,
			output: Outputs.placesTips,
		},
		input,
		({ fsq_place_id, limit, sort, fields }) => ({
			method: 'GET',
			path: `/places/${encodeURIComponent(fsq_place_id)}/tips`,
			query: queryOf({
				limit,
				sort,
				fields: fieldsWith(fields, ['fsq_tip_id']),
			}),
		}),
		{
			// The API answers a bare array; the key names what it holds.
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error('Foursquare returned an unexpected tips body');
				}
				return { tips: raw };
			},
			log: (_, result) => ({ count: result.tips.length }),
		},
	);

export const photos: FoursquareEndpoints['placesPhotos'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'places.photos',
			input: Inputs.placesPhotos,
			output: Outputs.placesPhotos,
		},
		input,
		({ fsq_place_id, limit, sort, classifications }) => ({
			method: 'GET',
			path: `/places/${encodeURIComponent(fsq_place_id)}/photos`,
			query: queryOf({
				limit,
				sort,
				classifications: csv(classifications),
			}),
		}),
		{
			shape: (raw) => {
				if (!Array.isArray(raw)) {
					throw new Error('Foursquare returned an unexpected photos body');
				}
				return { photos: raw };
			},
			log: (_, result) => ({ count: result.photos.length }),
		},
	);

export const match: FoursquareEndpoints['placesMatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'places.match',
			input: Inputs.placesMatch,
			output: Outputs.placesMatch,
		},
		input,
		({ name, address, city, state, postal_code, cc, ll, fields }) => ({
			method: 'GET',
			path: '/places/match',
			query: queryOf({
				name,
				address,
				city,
				state,
				postal_code,
				cc,
				ll,
				fields: fieldsWith(fields, ['fsq_place_id']),
			}),
		}),
		{
			log: (_, result) => ({
				matched: result.place !== null && result.place !== undefined,
				matchScore: result.match_score ?? undefined,
			}),
		},
	);
