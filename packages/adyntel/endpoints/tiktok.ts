import type { AdyntelEndpoints } from '..';
import { AdyntelAPIError } from '../client';
import { call } from './call';
import {
	AdyntelEndpointInputSchemas as Inputs,
	AdyntelEndpointOutputSchemas as Outputs,
} from './types';

/**
 * `tiktok_search` and `tiktok_ad_details` answer `{ code, data }` and send a
 * non-zero code with a 200. Left unchecked, a failure would parse as a result
 * with no ads, which reads exactly like a company running no ads.
 */
// unknown: the parsed body of a TikTok response, before the output schema runs.
function assertTikTokCode(raw: unknown, operation: string): void {
	if (!raw || typeof raw !== 'object') return;
	const code = (raw as { code?: unknown }).code;
	if (typeof code === 'number' && code !== 0) {
		throw new AdyntelAPIError(`Adyntel ${operation} returned code ${code}`, {
			operation,
			body: raw,
		});
	}
}

export const ads: AdyntelEndpoints['tiktokAds'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tiktok.ads',
			input: Inputs.tiktokAds,
			output: Outputs.tiktokAds,
		},
		input,
		(parsed) => ({ path: 'tiktok', operation: 'tiktokAds', body: parsed }),
		{
			// A 204 means the company runs no TikTok ads.
			shape: (raw) => raw ?? {},
			log: (_, result) => ({
				handle: result.handle ?? undefined,
				adCount: result.brand_ads?.length,
				influencerCount: result.influencers?.length,
				jobId: result.jobId ?? undefined,
			}),
		},
	);

export const keywordSearch: AdyntelEndpoints['tiktokKeywordSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tiktok.keywordSearch',
			input: Inputs.tiktokKeywordSearch,
			output: Outputs.tiktokKeywordSearch,
		},
		input,
		(parsed) => ({
			path: 'tiktok_search',
			operation: 'tiktokSearch',
			body: parsed,
		}),
		{
			shape: (raw) => {
				assertTikTokCode(raw, 'tiktok.keywordSearch');
				return raw;
			},
			log: (_, result) => ({
				adCount: result.data?.length,
				hasMore: result.has_more ?? undefined,
			}),
		},
	);

export const adDetails: AdyntelEndpoints['tiktokAdDetails'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tiktok.adDetails',
			input: Inputs.tiktokAdDetails,
			output: Outputs.tiktokAdDetails,
		},
		input,
		(parsed) => ({
			path: 'tiktok_ad_details',
			operation: 'tiktokAdDetails',
			body: parsed,
		}),
		{
			shape: (raw) => {
				assertTikTokCode(raw, 'tiktok.adDetails');
				return raw;
			},
			log: (_, result) => ({
				advertiser: result.data?.advertiser?.name ?? undefined,
			}),
		},
	);
