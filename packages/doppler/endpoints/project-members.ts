import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { compact, dopplerCall, seg } from './shared';
import type { DopplerEndpointOutputs } from './types';

/** Lists a project's members - workplace users, groups, invites, and service accounts. */
export const list: DopplerEndpoints['projectMembersList'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		page: number;
		members: DopplerEndpointOutputs['projectMembersList']['members'];
	}>(ctx, 'projects/project/members', {
		query: compact({
			project: input.project,
			page: input.page,
			per_page: input.perPage,
		}),
	});

	await logEventFromContext(
		ctx,
		'doppler.projectMembers.list',
		{ ...auditPayload(input, ['project']), returned: result.members.length },
		'completed',
	);
	return result;
};

/** Retrieves a single project member by type and slug. */
export const get: DopplerEndpoints['projectMembersGet'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		member: DopplerEndpointOutputs['projectMembersGet'];
	}>(
		ctx,
		`projects/project/members/member/${seg(input.type)}/${seg(input.slug)}`,
		{
			query: { project: input.project },
		},
	);

	await logEventFromContext(
		ctx,
		'doppler.projectMembers.get',
		auditPayload(input, ['project', 'type', 'slug']),
		'completed',
	);
	return result.member;
};

/** Removes a member from a project. */
export const remove: DopplerEndpoints['projectMembersDelete'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<
		DopplerEndpointOutputs['projectMembersDelete']
	>(
		ctx,
		`projects/project/members/member/${seg(input.type)}/${seg(input.slug)}`,
		{
			method: 'DELETE',
			query: { project: input.project },
		},
	);

	await logEventFromContext(
		ctx,
		'doppler.projectMembers.delete',
		auditPayload(input, ['project', 'type', 'slug']),
		'completed',
	);
	return result;
};
