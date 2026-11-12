import { asRecord } from 'corsair/core';
import type { HappyScribeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

// unknown: raw is the list envelope until the output schema validates it.
// Style guides arrive under `style_guides`; the plugin exposes them as
// styleGuides.
function styleGuideList(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record || record.style_guides === undefined) return raw;
	const { style_guides, ...rest } = record;
	return { ...rest, styleGuides: style_guides };
}

// unknown: raw is the list envelope until the output schema validates it.
function memberList(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record) return raw;
	return {
		...record,
		nextPageUrl: asRecord(asRecord(record._links)?.next)?.url,
	};
}

export const listGlossaries: HappyScribeEndpoints['glossariesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'glossaries.list',
			input: Inputs.glossariesList,
			output: Outputs.glossariesList,
		},
		input,
		({ organizationId }) => ({
			method: 'GET',
			path: '/glossaries',
			query: { organization_id: organizationId },
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.glossaries.length }) },
	);

export const listStyleGuides: HappyScribeEndpoints['styleGuidesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'styleGuides.list',
			input: Inputs.styleGuidesList,
			output: Outputs.styleGuidesList,
		},
		input,
		({ organizationId }) => ({
			method: 'GET',
			path: '/style_guides',
			query: { organization_id: organizationId },
			replaySafe: true,
		}),
		{
			shape: styleGuideList,
			log: (_, result) => ({ count: result.styleGuides.length }),
		},
	);

export const listOrganizations: HappyScribeEndpoints['organizationsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'organizations.list',
			input: Inputs.organizationsList,
			output: Outputs.organizationsList,
		},
		input,
		() => ({
			method: 'GET',
			path: '/organizations',
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.organizations.length }) },
	);

export const listMemberships: HappyScribeEndpoints['membershipsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'memberships.list',
			input: Inputs.membershipsList,
			output: Outputs.membershipsList,
		},
		input,
		({ organizationId, page }) => ({
			method: 'GET',
			path: '/organization_memberships',
			query: { organization_id: organizationId, page },
			replaySafe: true,
		}),
		{
			shape: memberList,
			log: (_, result) => ({
				count: result.members.length,
				hasMore: result.nextPageUrl !== undefined,
			}),
		},
	);

export const addMembership: HappyScribeEndpoints['membershipsAdd'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'memberships.add',
			input: Inputs.membershipsAdd,
			output: Outputs.membershipsAdd,
		},
		input,
		({ organizationId, email, role }) => ({
			method: 'POST',
			path: '/organization_memberships',
			body: { organization_id: organizationId, email, role },
		}),
		{
			log: (parsed) => ({
				organizationId: parsed.organizationId,
				role: parsed.role,
			}),
		},
	);

export const updateMembershipRole: HappyScribeEndpoints['membershipsUpdateRole'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'memberships.updateRole',
				input: Inputs.membershipsUpdateRole,
				output: Outputs.membershipsUpdateRole,
			},
			input,
			({ membershipId, role }) => ({
				method: 'PATCH',
				path: `/organization_memberships/${segment(membershipId)}`,
				body: { role },
			}),
			{
				log: (parsed) => ({
					membershipId: parsed.membershipId,
					role: parsed.role,
				}),
			},
		);

export const removeMembership: HappyScribeEndpoints['membershipsRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'memberships.remove',
			input: Inputs.membershipsRemove,
			output: Outputs.membershipsRemove,
		},
		input,
		({ membershipId }) => ({
			method: 'DELETE',
			path: `/organization_memberships/${segment(membershipId)}`,
		}),
		{
			shape: (raw) => raw ?? {},
			log: (parsed) => ({ membershipId: parsed.membershipId }),
		},
	);
