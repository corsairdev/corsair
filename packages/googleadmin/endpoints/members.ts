import type { GoogleAdminEndpoints } from '..';
import { segment } from '../client';
import { call, pageCount } from './call';
import {
	GoogleAdminEndpointInputSchemas as Inputs,
	GoogleAdminEndpointOutputSchemas as Outputs,
} from './types';

/** The four documented operations on the members collection, plus hasMember. */
export const list: GoogleAdminEndpoints['membersList'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'members.list',
			input: Inputs.membersList,
			output: Outputs.membersList,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/groups/${segment(input.groupKey)}/members`,
			query: {
				includeDerivedMembership: input.includeDerivedMembership ?? undefined,
				roles: input.roles ?? undefined,
				maxResults: input.maxResults ?? undefined,
				pageToken: input.pageToken ?? undefined,
			},
		}),
		(result) => pageCount(result.members),
	);

export const get: GoogleAdminEndpoints['membersGet'] = async (ctx, rawInput) =>
	call(
		ctx,
		{
			event: 'members.get',
			input: Inputs.membersGet,
			output: Outputs.membersGet,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/groups/${segment(input.groupKey)}/members/${segment(input.memberKey)}`,
		}),
	);

/**
 * members.hasMember answers `{ isMember }`. It reads as a read and is one: the
 * call changes nothing upstream.
 */
export const hasMember: GoogleAdminEndpoints['membersHasMember'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'members.hasMember',
			input: Inputs.membersHasMember,
			output: Outputs.membersHasMember,
		},
		rawInput,
		(input) => ({
			method: 'GET',
			path: `/groups/${segment(input.groupKey)}/hasMember/${segment(input.memberKey)}`,
		}),
		(result) => ({ isMember: result.isMember }),
	);

export const insert: GoogleAdminEndpoints['membersInsert'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'members.insert',
			input: Inputs.membersInsert,
			output: Outputs.membersInsert,
		},
		rawInput,
		(input) => ({
			method: 'POST',
			path: `/groups/${segment(input.groupKey)}/members`,
			body: {
				email: input.email,
				...(input.role ? { role: input.role } : {}),
				...(input.type ? { type: input.type } : {}),
				...(input.delivery_settings
					? { delivery_settings: input.delivery_settings }
					: {}),
			},
		}),
	);

/**
 * members.patch is the documented patch-semantics method, so changing a role
 * alone does not reset the delivery preference. The docs note the delivery
 * preference is honoured by `insert`, `update` and `get`.
 */
export const update: GoogleAdminEndpoints['membersUpdate'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'members.update',
			input: Inputs.membersUpdate,
			output: Outputs.membersUpdate,
		},
		rawInput,
		(input) => ({
			method: 'PATCH',
			path: `/groups/${segment(input.groupKey)}/members/${segment(input.memberKey)}`,
			body: {
				...(input.role ? { role: input.role } : {}),
				...(input.delivery_settings
					? { delivery_settings: input.delivery_settings }
					: {}),
			},
		}),
	);

export const remove: GoogleAdminEndpoints['membersDelete'] = async (
	ctx,
	rawInput,
) =>
	call(
		ctx,
		{
			event: 'members.delete',
			input: Inputs.membersDelete,
			output: Outputs.membersDelete,
		},
		rawInput,
		(input) => ({
			method: 'DELETE',
			path: `/groups/${segment(input.groupKey)}/members/${segment(input.memberKey)}`,
		}),
	);
