import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheWorkspace } from './persist';
import type { TogglEndpointOutputs } from './types';

/** Reads an organization, including its pricing plan and trial state. */
export const get: TogglEndpoints['organizationsGet'] = async (ctx, input) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsGet']
	>(`organizations/${input.organization_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.organizations.get',
		auditPayload(input, ['organization_id']),
		'completed',
	);
	return result;
};

/** Renames an organization. */
export const update: TogglEndpoints['organizationsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsUpdate']
	>(`organizations/${input.organization_id}`, ctx.key, {
		method: 'PUT',
		body: { name: input.name },
	});

	await logEventFromContext(
		ctx,
		'toggl.organizations.update',
		auditPayload(input, ['organization_id']),
		'completed',
	);
	return result;
};

export const getWorkspaces: TogglEndpoints['organizationsGetWorkspaces'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['organizationsGetWorkspaces']
		>(`organizations/${input.organization_id}/workspaces`, ctx.key, {
			method: 'GET',
		});

		const workspaces = result ?? [];

		// Same records as workspaces.list, so they populate the cache identically.
		for (const workspace of workspaces) {
			await cacheWorkspace(ctx.db.workspaces, workspace);
		}

		await logEventFromContext(
			ctx,
			'toggl.organizations.getWorkspaces',
			auditPayload(input, ['organization_id']),
			'completed',
		);
		return workspaces;
	};

/**
 * Creates an organization and its default workspace in one call. The
 * authenticated user becomes the owner.
 */
export const create: TogglEndpoints['organizationsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsCreate']
	>('organizations', ctx.key, {
		method: 'POST',
		body: { name: input.name, workspace_name: input.workspace_name },
	});

	await logEventFromContext(
		ctx,
		'toggl.organizations.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Lists an organization's groups with their members and workspace assignments. */
export const getGroups: TogglEndpoints['organizationsGetGroups'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsGetGroups']
	>(`organizations/${input.organization_id}/groups`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'toggl.organizations.getGroups',
		auditPayload(input, ['organization_id']),
		'completed',
	);
	return result ?? [];
};

/** Creates a group in an organization. */
export const createGroup: TogglEndpoints['organizationsCreateGroup'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsCreateGroup']
	>(`organizations/${input.organization_id}/groups`, ctx.key, {
		method: 'POST',
		body: { name: input.name },
	});

	await logEventFromContext(
		ctx,
		'toggl.organizations.createGroup',
		auditPayload(input, ['organization_id']),
		'completed',
	);
	return result;
};

/** Deletes a group along with the permissions attached to it. */
export const deleteGroup: TogglEndpoints['organizationsDeleteGroup'] = async (
	ctx,
	input,
) => {
	await makeTogglRequest<unknown>(
		`organizations/${input.organization_id}/groups/${input.group_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'toggl.organizations.deleteGroup',
		auditPayload(input, ['organization_id', 'group_id']),
		'completed',
	);
	return { deleted: true, id: input.group_id };
};

/** Lists an organization's users, with filtering by name, status and role. */
export const getUsers: TogglEndpoints['organizationsGetUsers'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsGetUsers']
	>(`organizations/${input.organization_id}/users`, ctx.key, {
		method: 'GET',
		query: {
			filter: input.filter,
			active: input.active,
			only_admins: input.only_admins,
			groups: input.groups,
			page: input.page,
			per_page: input.per_page,
		},
	});

	// The filter can carry a name or email; it is not recorded.
	await logEventFromContext(
		ctx,
		'toggl.organizations.getUsers',
		auditPayload(input, ['organization_id', 'active', 'only_admins', 'page']),
		'completed',
	);
	return result ?? [];
};

/**
 * Invites people to an organization. Toggl sends the invitation email unless
 * `prevent_email_notification` is set, so this is never live-tested.
 */
export const createInvitation: TogglEndpoints['organizationsCreateInvitation'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['organizationsCreateInvitation']
		>(`organizations/${input.organization_id}/invitations`, ctx.key, {
			method: 'POST',
			body: {
				emails: input.emails,
				workspaces: input.workspaces,
				prevent_email_notification: input.prevent_email_notification,
			},
		});

		// Invitee email addresses are personal data and stay out of the log.
		await logEventFromContext(
			ctx,
			'toggl.organizations.createInvitation',
			auditPayload(input, ['organization_id']),
			'completed',
		);
		return result ?? {};
	};

/** Lists the plans available to a specific organization. */
export const getPlans: TogglEndpoints['organizationsGetPlans'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['organizationsGetPlans']
	>(`organizations/${input.organization_id}/plans`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.organizations.getPlans',
		auditPayload(input, ['organization_id']),
		'completed',
	);
	return result ?? {};
};

export const getSubscriptionPlans: TogglEndpoints['organizationsGetSubscriptionPlans'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['organizationsGetSubscriptionPlans']
		>(`organizations/${input.organization_id}/subscription_plans`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'toggl.organizations.getSubscriptionPlans',
			auditPayload(input, ['organization_id']),
			'completed',
		);
		return result ?? {};
	};
