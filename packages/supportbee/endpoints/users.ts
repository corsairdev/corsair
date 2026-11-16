import type { SupportbeeEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import {
	SupportbeeEndpointInputSchemas as Inputs,
	SupportbeeEndpointOutputSchemas as Outputs,
} from './types';

export const list: SupportbeeEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		({ with_invited, with_roles, type }) => ({
			method: 'GET',
			path: '/users',
			query: queryOf({ with_invited, with_roles, type }),
		}),
		{
			log: (_, result) => ({ count: result.users.length }),
		},
	);

export const create: SupportbeeEndpoints['usersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.create',
			input: Inputs.usersCreate,
			output: Outputs.usersCreate,
		},
		input,
		({
			email,
			name,
			role,
			team_ids,
			type,
			can_members_access_group_tickets,
			email_domains,
		}) => ({
			method: 'POST',
			path: '/users',
			body: {
				user: {
					name,
					...(email === undefined ? {} : { email }),
					...(role === undefined ? {} : { role }),
					...(team_ids === undefined ? {} : { team_ids }),
					...(type === undefined ? {} : { type }),
					...(can_members_access_group_tickets === undefined
						? {}
						: { can_members_access_group_tickets }),
					...(email_domains === undefined ? {} : { email_domains }),
				},
			},
		}),
		{
			log: (_, result) => ({ userId: result.user.id }),
		},
	);

export const get: SupportbeeEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		({ id, max_tickets }) => ({
			method: 'GET',
			path: `/users/${segment(id)}`,
			query: queryOf({ max_tickets }),
		}),
		{
			log: (parsed, result) => ({
				userId: parsed.id,
				role: result.user.role ?? undefined,
			}),
		},
	);

export const update: SupportbeeEndpoints['usersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: Inputs.usersUpdate,
			output: Outputs.usersUpdate,
		},
		input,
		({
			id,
			email,
			name,
			role,
			team_ids,
			type,
			can_members_access_group_tickets,
			email_domains,
		}) => ({
			method: 'PUT',
			path: `/users/${segment(id)}`,
			body: {
				user: {
					...(email === undefined ? {} : { email }),
					...(name === undefined ? {} : { name }),
					...(role === undefined ? {} : { role }),
					...(team_ids === undefined ? {} : { team_ids }),
					...(type === undefined ? {} : { type }),
					...(can_members_access_group_tickets === undefined
						? {}
						: { can_members_access_group_tickets }),
					...(email_domains === undefined ? {} : { email_domains }),
				},
			},
		}),
		{
			log: (parsed) => ({ userId: parsed.id }),
		},
	);

export const listMembers: SupportbeeEndpoints['usersListMembers'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.listMembers',
			input: Inputs.usersListMembers,
			output: Outputs.usersListMembers,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/users/${segment(id)}/members`,
		}),
		{
			log: (parsed, result) => ({
				groupId: parsed.id,
				count: result.users.length,
			}),
		},
	);

export const addMember: SupportbeeEndpoints['usersAddMember'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.addMember',
			input: Inputs.usersAddMember,
			output: Outputs.usersAddMember,
		},
		input,
		({ id, member_id }) => ({
			method: 'POST',
			path: `/users/${segment(id)}/members`,
			body: { member: { id: member_id } },
		}),
		{
			// The docs show `{ user }`; the live API answers `{ member }`. The
			// added member is returned as `user` either way.
			shape: (raw) =>
				raw && typeof raw === 'object' && 'member' in raw && !('user' in raw)
					? { user: raw.member }
					: raw,
			log: (parsed, result) => ({
				groupId: parsed.id,
				memberId: parsed.member_id,
				userId: result.user.id,
			}),
		},
	);
