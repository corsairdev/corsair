import type { SimplesatEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SimplesatEndpointInputSchemas as Inputs,
	SimplesatEndpointOutputSchemas as Outputs,
} from './types';

export const get: SimplesatEndpoints['teamMembersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teamMembers.get',
			input: Inputs.teamMembersGet,
			output: Outputs.teamMembersGet,
		},
		input,
		({ team_member_id }) => ({
			method: 'GET',
			path: `/api/v1/team-members/${segment(team_member_id)}`,
		}),
		{ log: ({ team_member_id }) => ({ teamMemberId: team_member_id }) },
	);

/**
 * The same create-or-update route the customer write uses: a team member is
 * matched on `external_id` or `email`, so re-sending one updates it.
 */
export const create: SimplesatEndpoints['teamMembersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teamMembers.create',
			input: Inputs.teamMembersCreate,
			output: Outputs.teamMembersCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/api/v1/team-members', body }),
		{ log: (_, result) => ({ teamMemberId: result.id ?? undefined }) },
	);
