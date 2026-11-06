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
			// A 204 means the domain had no reachable Facebook page, or the page
			// was not public. Adyntel does not charge for it, so it is an empty
			// result rather than an error.
			shape: (raw) => raw ?? {},
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
