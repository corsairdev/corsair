import type { AdyntelEndpoints } from '..';
import { call } from './call';
import {
	AdyntelEndpointInputSchemas as Inputs,
	AdyntelEndpointOutputSchemas as Outputs,
} from './types';

export const ads: AdyntelEndpoints['googleAds'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'google.ads',
			input: Inputs.googleAds,
			output: Outputs.googleAds,
		},
		input,
		(parsed) => ({ path: 'google', operation: 'googleAds', body: parsed }),
		{
			// A 204 means no ads were found, or the scrape passed its 60 second
			// sync limit. Adyntel does not charge for it.
			shape: (raw) => raw ?? {},
			log: (_, result) => ({
				adCount: result.total_ad_count ?? undefined,
				countryCode: result.country_code ?? undefined,
				hasMore: result.continuation_token ? true : undefined,
			}),
		},
	);

export const shopping: AdyntelEndpoints['googleShopping'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'google.shopping',
			input: Inputs.googleShopping,
			output: Outputs.googleShopping,
		},
		input,
		(parsed) => ({
			path: 'google_shopping',
			operation: 'googleShopping',
			body: parsed,
		}),
		{
			// Three answers reach the output schema: ads inline, `{ id }` for a
			// queued DataForSEO scrape, and `{ status, message }` on a 204.
			shape: (raw) => raw ?? {},
			log: (_, result) => ({
				adCount: result.ads?.length,
				taskId: result.id ?? undefined,
			}),
		},
	);

export const shoppingStatus: AdyntelEndpoints['googleShoppingStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'google.shoppingStatus',
			input: Inputs.googleShoppingStatus,
			output: Outputs.googleShoppingStatus,
		},
		input,
		(parsed) => ({
			path: 'google_shopping_status',
			operation: 'googleShoppingStatus',
			body: parsed,
		}),
		{
			shape: (raw) => raw ?? {},
			log: (_, result) => ({
				adCount: result.ads?.length,
				pending: result.status !== null && result.status !== undefined,
			}),
		},
	);
