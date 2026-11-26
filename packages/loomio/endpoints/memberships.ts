import type { LoomioEndpoints } from '..';
import { call, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
	relatedQuery,
} from './types';

export const list: LoomioEndpoints['membershipsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memberships.list',
			input: Inputs.membershipsList,
			output: Outputs.membershipsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/memberships',
			query: {
				group_id: parsed.group_id,
				limit: parsed.limit,
				offset: parsed.offset,
				...relatedQuery(parsed),
			},
		}),
		{
			shape: (raw, parsed) =>
				withPaging(raw, 'memberships', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.memberships.length }),
		},
	);

export const manage: LoomioEndpoints['membershipsManage'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'memberships.manage',
			input: Inputs.membershipsManage,
			output: Outputs.membershipsManage,
		},
		input,
		// The controller checks `remove_absent.to_i == 1`, and true.to_i raises
		// in Ruby, so the flag goes out as 1 or 0 (documented legacy values).
		({ group_id, emails, remove_absent }) => ({
			method: 'POST',
			path: '/memberships',
			body: {
				group_id,
				emails,
				remove_absent:
					remove_absent === undefined ? undefined : remove_absent ? 1 : 0,
			},
		}),
		{
			// Counts only: the email lists are personal data.
			log: ({ group_id }, result) => ({
				groupId: group_id,
				added: result.added_emails?.length ?? 0,
				removed: result.removed_emails?.length ?? 0,
			}),
		},
	);
