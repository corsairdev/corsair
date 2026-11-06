import type { AdyntelEndpoints } from '..';
import { call } from './call';
import type { LinkedInAdsInput } from './types';
import {
	AdyntelEndpointInputSchemas as Inputs,
	AdyntelEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Adyntel takes `date_filter` as either a preset string or a
 * `{ startdate, enddate }` object. The input schema splits those into three
 * named fields so a caller never builds an object for "last 30 days"; this
 * puts them back in the form the API reads.
 */
function toDateFilter(
	filter: LinkedInAdsInput['date_filter'],
): string | { startdate: string; enddate: string } | undefined {
	if (!filter) return undefined;
	if (filter.preset) return filter.preset;
	if (filter.startdate && filter.enddate) {
		return { startdate: filter.startdate, enddate: filter.enddate };
	}
	return undefined;
}

export const ads: AdyntelEndpoints['linkedinAds'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'linkedin.ads',
			input: Inputs.linkedinAds,
			output: Outputs.linkedinAds,
		},
		input,
		(parsed) => {
			const { date_filter, ...rest } = parsed;
			return {
				path: 'linkedin',
				operation: 'linkedinAds',
				body: { ...rest, date_filter: toDateFilter(date_filter) },
			};
		},
		{
			// A 204 means no ads, or the scrape passed its 60 second sync limit.
			shape: (raw) => raw ?? {},
			log: (_, result) => ({
				pageId: result.page_id ?? undefined,
				adCount: result.total_ads ?? undefined,
				hasMore: result.continuation_token ? true : undefined,
				jobId: result.jobId ?? undefined,
			}),
		},
	);

export const keywordSearch: AdyntelEndpoints['linkedinKeywordSearch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'linkedin.keywordSearch',
			input: Inputs.linkedinKeywordSearch,
			output: Outputs.linkedinKeywordSearch,
		},
		input,
		(parsed) => ({
			path: 'linkedin-keyword-search',
			operation: 'linkedinKeywordSearch',
			body: parsed,
		}),
		{
			log: (_, result) => ({
				adCount: result.total_ads ?? undefined,
				hasMore: result.continuation_token ? true : undefined,
			}),
		},
	);
