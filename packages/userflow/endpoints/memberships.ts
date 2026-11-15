import type { UserflowEndpoints } from '..';
import { call } from './call';
import {
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Memberships have no collection of their own: Userflow documents removing one
 * and nothing else. They are written by embedding them in `users.upsert` and
 * read by expanding a user or group, which is why there is only a remove here.
 *
 * The endpoint addresses the pair by query parameters rather than a path.
 */
export const remove: UserflowEndpoints['membershipsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memberships.remove',
			input: Inputs.membershipsRemove,
			output: Outputs.membershipsRemove,
		},
		input,
		({ user_id, group_id }) => ({
			method: 'DELETE',
			path: '/group_memberships',
			query: { user_id, group_id },
		}),
		{
			// Idempotent: a pair that was never a membership still answers
			// deleted. State what was asked for.
			shape: (raw, parsed) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				deleted: true,
				user_id: parsed.user_id,
				group_id: parsed.group_id,
			}),
			log: ({ user_id, group_id }) => ({ user_id, group_id }),
		},
	);
