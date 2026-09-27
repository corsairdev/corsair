import { logEventFromContext } from 'corsair/core';
import { makeWorkablePublicRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import {
	compactQuery,
	parseEndpointInput,
	parseEndpointOutput,
} from './shared';
import type { WorkableEndpointOutputs } from './types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './types';

/**
 * Unauthenticated job-board listing. Falls back to the connected account's
 * subdomain when the caller doesn't name one, since a lot of callers will
 * just want "our own" public postings - but unlike every other endpoint in
 * this plugin, a subdomain can also be passed explicitly to look up any
 * Workable-hosted careers page, connected or not.
 */
export const list: WorkableEndpoints['publicJobsList'] = async (ctx, input) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.publicJobsList,
		input,
	);
	const subdomain =
		valid.subdomain ??
		ctx.options?.account ??
		(await ctx.keys?.get_account?.()) ??
		'';
	if (!subdomain) {
		throw new Error(
			'workable.publicJobs.list requires a subdomain, either explicitly or via a connected Workable account',
		);
	}

	const raw = await makeWorkablePublicRequest<
		WorkableEndpointOutputs['publicJobsList']
	>(subdomain, compactQuery({ details: valid.details }));
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.publicJobsList,
		raw,
	);
	await logEventFromContext(
		ctx,
		'workable.public_jobs.list',
		{ subdomain },
		'completed',
	);
	return response;
};

/**
 * Unauthenticated location listing for a public careers page - one entry per
 * country with its public-job count.
 * @see https://workable.readme.io/reference/apiaccountssubdomainlocations
 */
export const listLocations: WorkableEndpoints['publicLocationsList'] = async (
	ctx,
	input,
) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.publicLocationsList,
		input,
	);
	const subdomain =
		valid.subdomain ??
		ctx.options?.account ??
		(await ctx.keys?.get_account?.()) ??
		'';
	if (!subdomain) {
		throw new Error(
			'workable.publicLocations.list requires a subdomain, either explicitly or via a connected Workable account',
		);
	}

	const raw = await makeWorkablePublicRequest<
		WorkableEndpointOutputs['publicLocationsList']
	>(subdomain, undefined, '/locations');
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.publicLocationsList,
		raw,
	);
	await logEventFromContext(
		ctx,
		'workable.public_locations.list',
		{ subdomain },
		'completed',
	);
	return response;
};
