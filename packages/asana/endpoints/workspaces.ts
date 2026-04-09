import { logEventFromContext } from 'corsair/core';
import type { AsanaEndpoints } from '..';
import { makeAsanaRequest } from '../client';
import type { AsanaEndpointOutputs } from './types';

export const get: AsanaEndpoints['workspacesGet'] = async (ctx, input) => {
	const { workspace_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['workspacesGet']>(
		`workspaces/${workspace_gid}`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'asana.workspaces.get',
		{ workspace_gid },
		'completed',
	);
	return result;
};

export const list: AsanaEndpoints['workspacesList'] = async (ctx, input) => {
	const { limit, offset, opt_fields, opt_pretty } = input;
	const query: Record<string, string | number | boolean | undefined> = {
		limit,
		offset,
		opt_pretty,
	};
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<AsanaEndpointOutputs['workspacesList']>(
		'workspaces',
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(ctx, 'asana.workspaces.list', {}, 'completed');
	return result;
};

export const membershipsGet: AsanaEndpoints['workspaceMembershipsGet'] = async (
	ctx,
	input,
) => {
	const { workspace_membership_gid, opt_fields, opt_pretty } = input;
	const query: Record<string, string | boolean | undefined> = { opt_pretty };
	if (opt_fields?.length) {
		query.opt_fields = opt_fields.join(',');
	}
	const result = await makeAsanaRequest<
		AsanaEndpointOutputs['workspaceMembershipsGet']
	>(`workspace_memberships/${workspace_membership_gid}`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'asana.workspaces.membershipsGet',
		{ workspace_membership_gid },
		'completed',
	);
	return result;
};

export const membershipsList: AsanaEndpoints['workspaceMembershipsList'] =
	async (ctx, input) => {
		const { workspace_gid, user, limit, offset, opt_fields, opt_pretty } =
			input;
		const query: Record<string, string | number | boolean | undefined> = {
			user,
			limit,
			offset,
			opt_pretty,
		};
		if (opt_fields?.length) {
			query.opt_fields = opt_fields.join(',');
		}
		const result = await makeAsanaRequest<
			AsanaEndpointOutputs['workspaceMembershipsList']
		>(`workspaces/${workspace_gid}/workspace_memberships`, ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'asana.workspaces.membershipsList',
			{ workspace_gid },
			'completed',
		);
		return result;
	};

export const membershipsListForUser: AsanaEndpoints['workspaceMembershipsListForUser'] =
	async (ctx, input) => {
		const { user_gid, limit, offset, opt_fields, opt_pretty } = input;
		const query: Record<string, string | number | boolean | undefined> = {
			limit,
			offset,
			opt_pretty,
		};
		if (opt_fields?.length) {
			query.opt_fields = opt_fields.join(',');
		}
		const result = await makeAsanaRequest<
			AsanaEndpointOutputs['workspaceMembershipsListForUser']
		>(`users/${user_gid}/workspace_memberships`, ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'asana.workspaces.membershipsListForUser',
			{ user_gid },
			'completed',
		);
		return result;
	};
