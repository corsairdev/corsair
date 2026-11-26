import type { LoomioEndpoints } from '..';
import { segment } from '../client';
import { call, withPaging } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
} from './types';

// Server API (/api/server0): self-hosted installs only, authenticated with the
// install's SERVER_API_KEY instead of a user's key. Responses are plain JSON
// (not the User API's compound records). Logs carry ids only, never emails.

const identityPath = (p: { identity_type: string; uid: string }) =>
	`/users/identity/${segment(p.identity_type)}/${segment(p.uid)}`;

export const groupsList: LoomioEndpoints['serverGroupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.groups.list',
			input: Inputs.serverGroupsList,
			output: Outputs.serverGroupsList,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'GET',
			path: '/groups',
			query: { limit: parsed.limit, offset: parsed.offset },
		}),
		{
			shape: (raw, parsed) => withPaging(raw, 'groups', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.groups.length }),
		},
	);

export const membershipsList: LoomioEndpoints['serverMembershipsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'server.memberships.list',
			input: Inputs.serverMembershipsList,
			output: Outputs.serverMembershipsList,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'GET',
			path: '/memberships',
			query: {
				group_id: parsed.group_id,
				limit: parsed.limit,
				offset: parsed.offset,
			},
		}),
		{
			shape: (raw, parsed) =>
				withPaging(raw, 'memberships', parsed.offset ?? 0),
			log: (_, result) => ({ count: result.memberships.length }),
		},
	);

export const membershipsSync: LoomioEndpoints['serverMembershipsSync'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'server.memberships.sync',
			input: Inputs.serverMembershipsSync,
			output: Outputs.serverMembershipsSync,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'POST',
			path: '/memberships',
			body: parsed,
		}),
		{
			log: ({ group_id }, result) => ({
				groupId: group_id,
				added: result.added_emails?.length ?? 0,
				removed: result.removed_emails?.length ?? 0,
			}),
		},
	);

export const membershipsUpdate: LoomioEndpoints['serverMembershipsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'server.memberships.update',
			input: Inputs.serverMembershipsUpdate,
			output: Outputs.serverMembershipsUpdate,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'PATCH',
			path: `/memberships/${segment(parsed.id)}`,
			body: {
				membership: { admin: parsed.admin, delegate: parsed.delegate },
			},
			resourceScoped: true,
		}),
		{
			log: ({ id }) => ({ membershipId: id }),
		},
	);

export const membershipsRevoke: LoomioEndpoints['serverMembershipsRevoke'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'server.memberships.revoke',
			input: Inputs.serverMembershipsRevoke,
			output: Outputs.serverMembershipsRevoke,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'DELETE',
			path: `/memberships/${segment(parsed.id)}`,
			resourceScoped: true,
		}),
		{
			log: ({ id }) => ({ membershipId: id }),
		},
	);

export const usersList: LoomioEndpoints['serverUsersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.users.list',
			input: Inputs.serverUsersList,
			output: Outputs.serverUsersList,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'GET',
			path: '/users',
			query: { is_admin: parsed.is_admin },
		}),
		{
			log: (_, result) => ({ count: result.users.length }),
		},
	);

export const usersCreate: LoomioEndpoints['serverUsersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.users.create',
			input: Inputs.serverUsersCreate,
			output: Outputs.serverUsersCreate,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'POST',
			path: '/users',
			body: { user: parsed },
		}),
		{
			log: (_, result) => ({ userId: result.user.id }),
		},
	);

export const usersGet: LoomioEndpoints['serverUsersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.users.get',
			input: Inputs.serverUsersGet,
			output: Outputs.serverUsersGet,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'GET',
			path: `/users/${segment(parsed.id)}`,
			resourceScoped: true,
		}),
		{
			log: ({ id }) => ({ userId: id }),
		},
	);

export const usersUpdate: LoomioEndpoints['serverUsersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.users.update',
			input: Inputs.serverUsersUpdate,
			output: Outputs.serverUsersUpdate,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'PATCH',
			path: `/users/${segment(parsed.id)}`,
			body: {
				user: {
					name: parsed.name,
					username: parsed.username,
					email: parsed.email,
					is_admin: parsed.is_admin,
				},
			},
			resourceScoped: true,
		}),
		{
			log: ({ id }) => ({ userId: id }),
		},
	);

export const usersDelete: LoomioEndpoints['serverUsersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.users.delete',
			input: Inputs.serverUsersDelete,
			output: Outputs.serverUsersDelete,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'DELETE',
			path: `/users/${segment(parsed.id)}`,
			resourceScoped: true,
		}),
		{
			log: ({ id }) => ({ userId: id }),
		},
	);

export const usersDeactivate: LoomioEndpoints['serverUsersDeactivate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'server.users.deactivate',
			input: Inputs.serverUsersDeactivate,
			output: Outputs.serverUsersDeactivate,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'POST',
			path: `/users/${segment(parsed.id)}/deactivate`,
			resourceScoped: true,
		}),
		{
			log: ({ id }) => ({ userId: id }),
		},
	);

export const usersReactivate: LoomioEndpoints['serverUsersReactivate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'server.users.reactivate',
			input: Inputs.serverUsersReactivate,
			output: Outputs.serverUsersReactivate,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'POST',
			path: `/users/${segment(parsed.id)}/reactivate`,
			resourceScoped: true,
		}),
		{
			log: ({ id }) => ({ userId: id }),
		},
	);

export const usersRedact: LoomioEndpoints['serverUsersRedact'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'server.users.redact',
			input: Inputs.serverUsersRedact,
			output: Outputs.serverUsersRedact,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'POST',
			path: `/users/${segment(parsed.id)}/redact`,
			resourceScoped: true,
		}),
		{
			log: ({ id }) => ({ userId: id }),
		},
	);

export const usersGetByIdentity: LoomioEndpoints['serverUsersGetByIdentity'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'server.users.getByIdentity',
			input: Inputs.serverUsersGetByIdentity,
			output: Outputs.serverUsersGetByIdentity,
		},
		input,
		(parsed) => ({
			api: 'server',
			method: 'GET',
			path: identityPath(parsed),
			resourceScoped: true,
		}),
		{
			log: (_, result) => ({ userId: result.user.id }),
		},
	);

export const usersUpdateByIdentity: LoomioEndpoints['serverUsersUpdateByIdentity'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'server.users.updateByIdentity',
				input: Inputs.serverUsersUpdateByIdentity,
				output: Outputs.serverUsersUpdateByIdentity,
			},
			input,
			(parsed) => ({
				api: 'server',
				method: 'PATCH',
				path: identityPath(parsed),
				body: {
					user: {
						name: parsed.name,
						username: parsed.username,
						email: parsed.email,
						is_admin: parsed.is_admin,
					},
				},
				resourceScoped: true,
			}),
			{
				log: (_, result) => ({ userId: result.user.id }),
			},
		);

export const usersDeleteByIdentity: LoomioEndpoints['serverUsersDeleteByIdentity'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'server.users.deleteByIdentity',
				input: Inputs.serverUsersDeleteByIdentity,
				output: Outputs.serverUsersDeleteByIdentity,
			},
			input,
			(parsed) => ({
				api: 'server',
				method: 'DELETE',
				path: identityPath(parsed),
				resourceScoped: true,
			}),
			{
				log: () => ({}),
			},
		);

export const usersDeactivateByIdentity: LoomioEndpoints['serverUsersDeactivateByIdentity'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'server.users.deactivateByIdentity',
				input: Inputs.serverUsersDeactivateByIdentity,
				output: Outputs.serverUsersDeactivateByIdentity,
			},
			input,
			(parsed) => ({
				api: 'server',
				method: 'POST',
				path: `${identityPath(parsed)}/deactivate`,
				resourceScoped: true,
			}),
			{
				log: (_, result) => ({ userId: result.user.id }),
			},
		);

export const usersReactivateByIdentity: LoomioEndpoints['serverUsersReactivateByIdentity'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'server.users.reactivateByIdentity',
				input: Inputs.serverUsersReactivateByIdentity,
				output: Outputs.serverUsersReactivateByIdentity,
			},
			input,
			(parsed) => ({
				api: 'server',
				method: 'POST',
				path: `${identityPath(parsed)}/reactivate`,
				resourceScoped: true,
			}),
			{
				log: (_, result) => ({ userId: result.user.id }),
			},
		);

export const usersRedactByIdentity: LoomioEndpoints['serverUsersRedactByIdentity'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'server.users.redactByIdentity',
				input: Inputs.serverUsersRedactByIdentity,
				output: Outputs.serverUsersRedactByIdentity,
			},
			input,
			(parsed) => ({
				api: 'server',
				method: 'POST',
				path: `${identityPath(parsed)}/redact`,
				resourceScoped: true,
			}),
			{
				log: () => ({}),
			},
		);
