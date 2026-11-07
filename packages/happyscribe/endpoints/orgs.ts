import type { HappyScribeEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HappyScribeEndpointInputSchemas as Inputs,
	HappyScribeEndpointOutputSchemas as Outputs,
} from './types';

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
		{ log: (_, result) => ({ count: result.styleGuides.length }) },
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
		({ organizationId }) => ({
			method: 'GET',
			path: '/organization_memberships',
			query: { organization_id: organizationId },
			replaySafe: true,
		}),
		{ log: (_, result) => ({ count: result.members.length }) },
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
