import { logEventFromContext } from 'corsair/core';
import { makeWorkablePublicRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { compactQuery } from './shared';
import type { WorkableEndpointOutputs } from './types';

/**
 * Unauthenticated job-board listing. Falls back to the connected account's
 * subdomain when the caller doesn't name one, since a lot of callers will
 * just want "our own" public postings - but unlike every other endpoint in
 * this plugin, a subdomain can also be passed explicitly to look up any
 * Workable-hosted careers page, connected or not.
 */
export const list: WorkableEndpoints['publicJobsList'] = async (ctx, input) => {
	const subdomain =
		input.subdomain ??
		ctx.options?.account ??
		(await ctx.keys?.get_account?.()) ??
		'';
	if (!subdomain) {
		throw new Error(
			'workable.publicJobs.list requires a subdomain, either explicitly or via a connected Workable account',
		);
	}

	const response = await makeWorkablePublicRequest<
		WorkableEndpointOutputs['publicJobsList']
	>(subdomain, compactQuery({ details: input.details }));
	await logEventFromContext(
		ctx,
		'workable.public_jobs.list',
		{ subdomain },
		'completed',
	);
	return response;
};
