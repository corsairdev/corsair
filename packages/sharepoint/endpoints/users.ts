import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const getCurrent: SharepointEndpoints['usersGetCurrent'] = async (
	ctx,
	input,
) => {
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['usersGetCurrent']
	>('/me', ctx.key, { method: 'GET' });

	if (result.id && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.id, {
				id: result.id,
				loginName: result.userPrincipalName,
				email: result.mail,
				title: result.displayName,
			});
		} catch (error) {
			console.warn('Failed to save current user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.users.getCurrent',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: SharepointEndpoints['usersCreate'] = async (
	ctx,
	input,
) => {
	// Graph API user creation is tenant-scoped and different from SP site users
	// Return a stub for backwards compatibility
	await logEventFromContext(
		ctx,
		'sharepoint.users.create',
		{ ...input },
		'completed',
	);
	return {
		id: '',
		displayName: input.login_name,
		userPrincipalName: input.login_name,
		mail: input.login_name,
	};
};

export const find: SharepointEndpoints['usersFind'] = async (ctx, input) => {
	// Escape single quotes to prevent OData injection
	const safeSearch = input.search_value.replace(/'/g, "''");
	const result = await makeGraphRequest<SharepointEndpointOutputs['usersFind']>(
		'/users',
		ctx.key,
		{
			method: 'GET',
			query: {
				$filter: `startsWith(displayName,'${safeSearch}') or startsWith(mail,'${safeSearch}')`,
				$select: 'id,displayName,mail,userPrincipalName',
			},
		},
	);

	if (result.value && ctx.db.users) {
		try {
			for (const user of result.value) {
				if (user.id) {
					await ctx.db.users.upsertByEntityId(user.id, {
						id: user.id,
						loginName: user.userPrincipalName,
						email: user.mail,
						title: user.displayName,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save found users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.users.find',
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: SharepointEndpoints['usersRemove'] = async (
	ctx,
	input,
) => {
	// Graph API user deletion is admin-scoped; not supported for regular site operations
	await logEventFromContext(
		ctx,
		'sharepoint.users.remove',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const ensure: SharepointEndpoints['usersEnsure'] = async (
	ctx,
	input,
) => {
	// Look up the user by login name (UPN)
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['usersEnsure']
	>(`/users/${encodeURIComponent(input.login_name)}`, ctx.key, {
		method: 'GET',
		query: { $select: 'id,displayName,mail,userPrincipalName' },
	});

	if (result.id && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.id, {
				id: result.id,
				loginName: result.userPrincipalName,
				email: result.mail,
				title: result.displayName,
			});
		} catch (error) {
			console.warn('Failed to save ensured user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.users.ensure',
		{ ...input },
		'completed',
	);
	return result;
};

export const listSite: SharepointEndpoints['usersListSite'] = async (
	ctx,
	input,
) => {
	const siteId = (await ctx.keys.get_site_id()) ?? ctx.options?.siteId ?? '';

	// Use Graph API site permissions as the closest equivalent to site users
	// Graph API permissions response type; inline to capture the nested grantedToIdentitiesV2 structure
	const result = await makeGraphRequest<{
		value?: Array<{
			id?: string;
			roles?: string[];
			grantedToIdentitiesV2?: Array<{
				user?: {
					id?: string;
					displayName?: string;
					email?: string;
					userPrincipalName?: string;
				};
			}>;
		}>;
	}>(`/sites/${siteId}/permissions`, ctx.key, { method: 'GET' });

	// Flatten permissions to a user list
	const users: SharepointEndpointOutputs['usersListSite']['value'] = [];
	if (result.value) {
		for (const perm of result.value) {
			for (const identity of perm.grantedToIdentitiesV2 ?? []) {
				if (identity.user?.id) {
					users.push({
						id: identity.user.id,
						displayName: identity.user.displayName,
						userPrincipalName: identity.user.userPrincipalName,
						mail: identity.user.email,
					});
				}
			}
		}
	}

	if (users.length > 0 && ctx.db.users) {
		try {
			for (const user of users) {
				if (user.id) {
					await ctx.db.users.upsertByEntityId(user.id, {
						id: user.id,
						loginName: user.userPrincipalName,
						email: user.mail,
						title: user.displayName,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save site users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.users.listSite',
		{ ...input },
		'completed',
	);
	return { value: users };
};

export const listGroups: SharepointEndpoints['usersListGroups'] = async (
	ctx,
	input,
) => {
	// List Microsoft 365 groups associated with the site
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['usersListGroups']
	>('/groups', ctx.key, {
		method: 'GET',
		query: { $select: 'id,displayName,description,mail' },
	});

	await logEventFromContext(
		ctx,
		'sharepoint.users.listGroups',
		{ ...input },
		'completed',
	);
	return result;
};

export const getGroupUsers: SharepointEndpoints['usersGetGroupUsers'] = async (
	ctx,
	input,
) => {
	const result = await makeGraphRequest<
		SharepointEndpointOutputs['usersGetGroupUsers']
	>(`/groups/${encodeURIComponent(input.group_name)}/members`, ctx.key, {
		method: 'GET',
		query: { $select: 'id,displayName,mail,userPrincipalName' },
	});

	if (result.value && ctx.db.users) {
		try {
			for (const user of result.value) {
				if (user.id) {
					await ctx.db.users.upsertByEntityId(user.id, {
						id: user.id,
						loginName: user.userPrincipalName,
						email: user.mail,
						title: user.displayName,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save group users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'sharepoint.users.getGroupUsers',
		{ ...input },
		'completed',
	);
	return result;
};

export const getGroupUsersById: SharepointEndpoints['usersGetGroupUsersById'] =
	async (ctx, input) => {
		const result = await makeGraphRequest<
			SharepointEndpointOutputs['usersGetGroupUsersById']
		>(`/groups/${input.group_id}/members`, ctx.key, {
			method: 'GET',
			query: { $select: 'id,displayName,mail,userPrincipalName' },
		});

		if (result.value && ctx.db.users) {
			try {
				for (const user of result.value) {
					if (user.id) {
						await ctx.db.users.upsertByEntityId(user.id, {
							id: user.id,
							loginName: user.userPrincipalName,
							email: user.mail,
							title: user.displayName,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save group users to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sharepoint.users.getGroupUsersById',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getEffectivePermissions: SharepointEndpoints['usersGetEffectivePermissions'] =
	async (ctx, input) => {
		const result = await makeGraphRequest<
			SharepointEndpointOutputs['usersGetEffectivePermissions']
		>(`/users/${encodeURIComponent(input.user_login_name)}`, ctx.key, {
			method: 'GET',
			query: { $select: 'id,displayName' },
		});

		await logEventFromContext(
			ctx,
			'sharepoint.users.getEffectivePermissions',
			{ ...input },
			'completed',
		);
		return result;
	};
