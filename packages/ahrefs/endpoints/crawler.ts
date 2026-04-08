import { logEventFromContext } from 'corsair/core';
import type { AhrefsEndpoints } from '..';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpointOutputs } from './types';

export const getIpRanges: AhrefsEndpoints['crawlerIpRanges'] = async (ctx, input) => {
	const result = await makeAhrefsRequest<AhrefsEndpointOutputs['crawlerIpRanges']>(
		'/v3/crawler-ip-ranges',
		ctx.key,
		{ query: { ...input } },
	);

	// Crawler IP ranges are infrastructure-level data that change infrequently and are not
	// meaningfully cacheable in the SEO-focused DB schema — no DB write is performed here.

	await logEventFromContext(ctx, 'ahrefs.crawler.getIpRanges', { ...input }, 'completed');
	return result;
};

export const getPublicIps: AhrefsEndpoints['crawlerPublicIps'] = async (ctx, input) => {
	const result = await makeAhrefsRequest<AhrefsEndpointOutputs['crawlerPublicIps']>(
		'/v3/public-ip-addresses',
		ctx.key,
		{ query: { ...input } },
	);

	// Public crawler IPs are infrastructure-level data — no DB write is performed here.

	await logEventFromContext(ctx, 'ahrefs.crawler.getPublicIps', { ...input }, 'completed');
	return result;
};
