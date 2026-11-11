import type { UserflowEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UserflowEndpointInputSchemas as Inputs,
	UserflowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The Accounts API is a separate surface from the Users API. It authenticates
 * with a *personal* key (`pak_…`) tied to a member login, not an environment
 * key, and manages team resources inside one account.
 *
 * The account id goes in the path for members and invites, so every operation
 * here takes it explicitly.
 */

export const listAccounts: UserflowEndpoints['accountsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.list',
			input: Inputs.accountsList,
			output: Outputs.accountsList,
		},
		input,
		({ limit, starting_after, order_by }) => ({
			method: 'GET',
			path: '/accounts',
			query: { limit, starting_after, order_by },
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);

export const getAccount: UserflowEndpoints['accountsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.get',
			input: Inputs.accountsGet,
			output: Outputs.accountsGet,
		},
		input,
		({ id, expand }) => ({
			method: 'GET',
			path: `/accounts/${segment(id)}`,
			query: { expand },
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const listMembers: UserflowEndpoints['membersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.list',
			input: Inputs.membersList,
			output: Outputs.membersList,
		},
		input,
		({ account_id, limit, starting_after, email, role, order_by }) => ({
			method: 'GET',
			path: `/accounts/${segment(account_id)}/members`,
			query: { limit, starting_after, email, role, order_by },
		}),
		{
			log: ({ account_id }, result) => ({
				account: account_id,
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);

export const getMember: UserflowEndpoints['membersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.get',
			input: Inputs.membersGet,
			output: Outputs.membersGet,
		},
		input,
		({ account_id, id }) => ({
			method: 'GET',
			path: `/accounts/${segment(account_id)}/members/${segment(id)}`,
		}),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

export const updateMember: UserflowEndpoints['membersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.update',
			input: Inputs.membersUpdate,
			output: Outputs.membersUpdate,
		},
		input,
		({ account_id, id, ...body }) => ({
			method: 'PATCH',
			path: `/accounts/${segment(account_id)}/members/${segment(id)}`,
			body,
		}),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				role: parsed.role,
				permissions: parsed.permissions?.length ?? 0,
			}),
		},
	);

export const removeMember: UserflowEndpoints['membersRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.remove',
			input: Inputs.membersRemove,
			output: Outputs.membersRemove,
		},
		input,
		({ account_id, id }) => ({
			method: 'DELETE',
			path: `/accounts/${segment(account_id)}/members/${segment(id)}`,
		}),
		{
			shape: (raw, parsed) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				id: parsed.id,
				deleted: true,
			}),
			log: ({ account_id, id }) => ({ account: account_id, id }),
		},
	);

export const listInvites: UserflowEndpoints['invitesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invites.list',
			input: Inputs.invitesList,
			output: Outputs.invitesList,
		},
		input,
		({ account_id, limit, starting_after }) => ({
			method: 'GET',
			path: `/accounts/${segment(account_id)}/invites`,
			query: { limit, starting_after },
		}),
		{
			log: ({ account_id }, result) => ({
				account: account_id,
				count: result.data?.length ?? 0,
				hasMore: result.has_more ?? false,
			}),
		},
	);

export const getInvite: UserflowEndpoints['invitesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invites.get',
			input: Inputs.invitesGet,
			output: Outputs.invitesGet,
		},
		input,
		({ account_id, id }) => ({
			method: 'GET',
			path: `/accounts/${segment(account_id)}/invites/${segment(id)}`,
		}),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

/**
 * Sends the invitation email. A pending invite for the same address, or an
 * existing member with it, makes this answer 400 rather than send twice.
 */
export const createInvite: UserflowEndpoints['invitesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invites.create',
			input: Inputs.invitesCreate,
			output: Outputs.invitesCreate,
		},
		input,
		({ account_id, ...body }) => ({
			method: 'POST',
			path: `/accounts/${segment(account_id)}/invites`,
			body,
		}),
		{
			log: (parsed, result) => ({
				account: parsed.account_id,
				id: result.id ?? undefined,
				role: parsed.role,
			}),
		},
	);

export const deleteInvite: UserflowEndpoints['invitesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invites.delete',
			input: Inputs.invitesDelete,
			output: Outputs.invitesDelete,
		},
		input,
		({ account_id, id }) => ({
			method: 'DELETE',
			path: `/accounts/${segment(account_id)}/invites/${segment(id)}`,
		}),
		{
			shape: (raw, parsed) => ({
				...(typeof raw === 'object' && raw !== null ? raw : {}),
				id: parsed.id,
				deleted: true,
			}),
			log: ({ account_id, id }) => ({ account: account_id, id }),
		},
	);
