import type { AdyntelEndpoints } from '..';
import { call } from './call';
import {
	AdyntelEndpointInputSchemas as Inputs,
	AdyntelEndpointOutputSchemas as Outputs,
} from './types';

export const ads: AdyntelEndpoints['metaAds'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meta.ads',
			input: Inputs.metaAds,
			output: Outputs.metaAds,
		},
		input,
		(parsed) => ({ path: 'facebook', operation: 'facebookAds', body: parsed }),
		{
			// Two things to fix up, both verified against the live API:
			//
			// - A 204 means the domain had no reachable Facebook page, or the
			//   page was not public. Adyntel does not charge for it, so it is an
			//   empty result rather than an error.
			// - `results` comes back as flat ad records on one call and as one
			//   array per page on the next, for the same domain. Flatten both so
			//   a caller always reads `results[i].ad_archive_id`.
			shape: (raw) => {
				const body = (raw ?? {}) as { results?: unknown };
				if (!Array.isArray(body.results)) return body;

				return {
					...body,
					results: body.results.flatMap((entry) =>
						Array.isArray(entry) ? entry : [entry],
					),
				};
			},
			log: (_, result) => ({
				pageId: result.page_id ?? undefined,
				adCount: result.number_of_ads ?? undefined,
				jobId: result.jobId ?? undefined,
			}),
		},
	);

export const adSearch: AdyntelEndpoints['metaAdSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'meta.adSearch',
			input: Inputs.metaAdSearch,
			output: Outputs.metaAdSearch,
		},
		input,
		(parsed) => ({
			path: 'facebook_ad_search',
			operation: 'facebookAdSearch',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				adCount: result.number_of_ads ?? undefined,
				hasMore: result.continuation_token ? true : undefined,
			}),
		},
	);
