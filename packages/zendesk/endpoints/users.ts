import { logEventFromContext } from 'corsair/core';
import { makeZendeskRequest } from '../client';
import type { ZendeskEndpoints } from '../index';
import type { ZendeskEndpointOutputs } from './types';

export const create: ZendeskEndpoints['usersCreate'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<
		ZendeskEndpointOutputs['usersCreate']
	>('users.json', ctx.key, subdomain, {
		method: 'POST',
		body: {
			user: {
				name: input.name,
				email: input.email,
				...(input.role && { role: input.role }),
				...(input.external_id && { external_id: input.external_id }),
				...(input.active !== undefined && { active: input.active }),
			},
		},
	});

	const user = response.user;
	if (user && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(String(user.id), {
				id: user.id,
				name: user.name ?? null,
				email: user.email ?? null,
				role: user.role ?? null,
				active: user.active ?? null,
				timeZone: user.time_zone ?? null,
				locale: user.locale ?? null,
				createdAt: user.created_at ? new Date(user.created_at) : null,
				updatedAt: user.updated_at ? new Date(user.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.users.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: ZendeskEndpoints['usersGet'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<ZendeskEndpointOutputs['usersGet']>(
		`users/${input.id}.json`,
		ctx.key,
		subdomain,
		{ method: 'GET' },
	);

	const user = response.user;
	if (user && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(String(user.id), {
				id: user.id,
				name: user.name ?? null,
				email: user.email ?? null,
				role: user.role ?? null,
				active: user.active ?? null,
				timeZone: user.time_zone ?? null,
				locale: user.locale ?? null,
				createdAt: user.created_at ? new Date(user.created_at) : null,
				updatedAt: user.updated_at ? new Date(user.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.users.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: ZendeskEndpoints['usersUpdate'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<
		ZendeskEndpointOutputs['usersUpdate']
	>(`users/${input.id}.json`, ctx.key, subdomain, {
		method: 'PUT',
		body: {
			user: {
				...(input.name && { name: input.name }),
				...(input.email && { email: input.email }),
				...(input.role && { role: input.role }),
				...(input.external_id && { external_id: input.external_id }),
				...(input.active !== undefined && { active: input.active }),
			},
		},
	});

	const user = response.user;
	if (user && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(String(user.id), {
				id: user.id,
				name: user.name ?? null,
				email: user.email ?? null,
				role: user.role ?? null,
				active: user.active ?? null,
				timeZone: user.time_zone ?? null,
				locale: user.locale ?? null,
				createdAt: user.created_at ? new Date(user.created_at) : null,
				updatedAt: user.updated_at ? new Date(user.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.users.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteUser: ZendeskEndpoints['usersDelete'] = async (
	ctx,
	input,
) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	// makeZendeskRequest<unknown> is used because Zendesk delete APIs return 204 No Content and we do not expect a structured response body.
	await makeZendeskRequest<unknown>(
		`users/${input.id}.json`,
		ctx.key,
		subdomain,
		{ method: 'DELETE' },
	);

	if (ctx.db.users) {
		try {
			await ctx.db.users.deleteByEntityId(String(input.id));
		} catch (error) {
			console.warn('Failed to delete user from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.users.delete',
		{ ...input },
		'completed',
	);
	return { id: input.id };
};

export const list: ZendeskEndpoints['usersList'] = async (ctx, input) => {
	const subdomain =
		ctx.options.subdomain ?? (await ctx.keys.get_subdomain()) ?? '';
	const response = await makeZendeskRequest<
		ZendeskEndpointOutputs['usersList']
	>('users.json', ctx.key, subdomain, {
		method: 'GET',
		query: {
			...(input.page !== undefined && { page: input.page }),
			...(input.per_page !== undefined && { per_page: input.per_page }),
			...(input.role && { role: input.role }),
		},
	});

	const users = response.users || [];
	if (ctx.db.users) {
		for (const user of users) {
			try {
				await ctx.db.users.upsertByEntityId(String(user.id), {
					id: user.id,
					name: user.name ?? null,
					email: user.email ?? null,
					role: user.role ?? null,
					active: user.active ?? null,
					timeZone: user.time_zone ?? null,
					locale: user.locale ?? null,
					createdAt: user.created_at ? new Date(user.created_at) : null,
					updatedAt: user.updated_at ? new Date(user.updated_at) : null,
				});
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'zendesk.users.list',
		{ ...input },
		'completed',
	);
	return response;
};
