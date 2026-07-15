import { logEventFromContext } from 'corsair/core';
import { LinkedInAPIError, makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

type Query = Record<
	string,
	string | number | boolean | ReadonlyArray<string> | undefined
>;

export const getCompanyInfo: LinkedInEndpoints['GetCompanyInfo'] = async (
	ctx,
	input,
) => {
	let roleAssignee = input.role_assignee;

	if (!roleAssignee) {
		const me = await makeAuthenticatedLinkedInRequest<
			LinkedInEndpointOutputs['GetMyInfo']
		>('/v2/userinfo', ctx, { method: 'GET' });
		const memberId = me.sub ?? me.id;
		if (!memberId) {
			throw new LinkedInAPIError(
				'Could not determine the authenticated member id to list organizations.',
			);
		}
		roleAssignee = `urn:li:person:${memberId}`;
	}

	const query: Query = {
		q: 'roleAssignee',
		roleAssignee,
		state: input.state ?? 'APPROVED',
	};
	if (input.role && input.role.length > 0) {
		// Pass the array through so it serializes as repeated role= keys;
		// a comma-joined value is not parsed as multiple filters by LinkedIn.
		query.role = input.role;
	}
	// organizationAcls is paginated; without start/count LinkedIn returns
	// only the first page, silently truncating members with many roles.
	if (input.start !== undefined) query.start = input.start;
	if (input.count !== undefined) query.count = input.count;

	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetCompanyInfo']
	>('/v2/organizationAcls', ctx, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'linkedin.organizations.getCompanyInfo',
		{ ...input },
		'completed',
	);
	return result;
};

export const getNetworkSize: LinkedInEndpoints['GetNetworkSize'] = async (
	ctx,
	input,
) => {
	// Follower-statistics elements vary by metric; we only read the follower
	// counts, so the rest of the element shape is intentionally untyped.
	type FollowerStatsResponse = {
		elements?: Array<Record<string, unknown>>;
	};

	const result = await makeAuthenticatedLinkedInRequest<FollowerStatsResponse>(
		'/v2/organizationalEntityFollowerStatistics',
		ctx,
		{
			method: 'GET',
			query: { q: 'organizationHandle', organization: input.organization_urn },
		},
	);

	const stats = result.elements?.[0];
	const totalFollowerCount = stats?.totalFollowerCount;
	const organizationFollowerCount = stats?.organizationFollowerCount;

	await logEventFromContext(
		ctx,
		'linkedin.organizations.getNetworkSize',
		{ ...input },
		'completed',
	);

	return {
		totalFollowerCount:
			typeof totalFollowerCount === 'number' ? totalFollowerCount : undefined,
		organizationFollowerCount:
			typeof organizationFollowerCount === 'number'
				? organizationFollowerCount
				: undefined,
		elements: result.elements,
	};
};

export const getOrgPageStats: LinkedInEndpoints['GetOrgPageStats'] = async (
	ctx,
	input,
) => {
	const query: Query = {
		q: 'organization',
		organization: input.organization_urn,
	};
	if (input.start !== undefined) query.start = input.start;
	if (input.count !== undefined) query.count = input.count;
	if (input.time_integrated?.start && input.time_integrated?.end) {
		query.timeIntervals = `(timeDuration:(start:${input.time_integrated.start},end:${input.time_integrated.end}))`;
	}

	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetOrgPageStats']
	>('/v2/organizationPageStatistics', ctx, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'linkedin.organizations.getPageStats',
		{ ...input },
		'completed',
	);
	return result;
};

export const getShareStats: LinkedInEndpoints['GetShareStats'] = async (
	ctx,
	input,
) => {
	const query: Query = {
		q: 'organization',
		organization: input.organization_urn,
	};
	if (input.start !== undefined) query.start = input.start;
	if (input.count !== undefined) query.count = input.count;
	if (input.time_integrated?.start && input.time_integrated?.end) {
		query.timeIntervals = `(timeDuration:(start:${input.time_integrated.start},end:${input.time_integrated.end}))`;
	}

	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetShareStats']
	>('/v2/organizationalEntityShareStatistics', ctx, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'linkedin.organizations.getShareStats',
		{ ...input },
		'completed',
	);
	return result;
};
