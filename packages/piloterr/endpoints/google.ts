import type { PiloterrEndpoints } from '..';
import { call } from './call';
import {
	PiloterrEndpointInputSchemas as Inputs,
	PiloterrEndpointOutputSchemas as Outputs,
} from './types';

const V2 = '/v2';

export const search: PiloterrEndpoints['googleSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'google.search',
			input: Inputs.googleSearch,
			output: Outputs.googleSearch,
		},
		input,
		({
			query,
			tbs,
			location,
			uule,
			googleDomain,
			gl,
			hl,
			cr,
			lr,
			page,
			num,
			safe,
			fields,
		}) => ({
			method: 'GET',
			path: `${V2}/google/search`,
			query: {
				query,
				tbs,
				location,
				uule,
				google_domain: googleDomain,
				gl,
				hl,
				cr,
				lr,
				page,
				num,
				safe,
				fields,
			},
		}),
		{
			log: (_, page) => ({
				organicResults: page.organic_results?.length ?? 0,
			}),
		},
	);

export const searchAutocomplete: PiloterrEndpoints['googleSearchAutocomplete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'google.searchAutocomplete',
				input: Inputs.googleSearchAutocomplete,
				output: Outputs.googleSearchAutocomplete,
			},
			input,
			({ query, cp, googleDomain, gl, hl, cr, lr, fields }) => ({
				method: 'GET',
				path: `${V2}/google/search/autocomplete`,
				query: {
					query,
					cp,
					google_domain: googleDomain,
					gl,
					hl,
					cr,
					lr,
					fields,
				},
			}),
			{
				log: (_, result) => ({
					suggestions: result.suggestions?.length ?? 0,
				}),
			},
		);

export const news: PiloterrEndpoints['googleNews'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'google.news',
			input: Inputs.googleNews,
			output: Outputs.googleNews,
		},
		input,
		({ query, page, googleDomain, gl, hl, cr, lr, fields }) => ({
			method: 'GET',
			path: `${V2}/google/news`,
			query: {
				query,
				page,
				google_domain: googleDomain,
				gl,
				hl,
				cr,
				lr,
				fields,
			},
		}),
		{
			log: (_, page) => ({
				organicResults: page.organic_results?.length ?? 0,
			}),
		},
	);
