import { logEventFromContext } from 'corsair/core';
import type { JiraEndpoints } from '..';
import { makeJiraRequest } from '../client';
import type { JiraEndpointOutputs } from './types';

export const getCurrent: JiraEndpoints['usersGetCurrent'] = async (
	ctx,
	_input,
) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['usersGetCurrent']>(
		'myself',
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{ method: 'GET' },
	);

	if (result.accountId && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.accountId, {
				accountId: result.accountId,
				...(result.displayName && { displayName: result.displayName }),
				...(result.emailAddress && { emailAddress: result.emailAddress }),
				...(result.active !== undefined && { active: result.active }),
				...(result.timeZone && { timeZone: result.timeZone }),
				...(result.locale && { locale: result.locale }),
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save current user to database:', error);
		}
	}

	await logEventFromContext(ctx, 'jira.users.getCurrent', {}, 'completed');
	return result;
};

export const find: JiraEndpoints['usersFind'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['usersFind']>(
		'users/search',
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'GET',
			query: {
				...(input.query && { query: input.query }),
				...(input.account_id && { accountId: input.account_id }),
				...(input.start_at !== undefined && { startAt: input.start_at }),
				...(input.max_results !== undefined && {
					maxResults: input.max_results,
				}),
			},
		},
	);

	if (ctx.db.users) {
		for (const user of result) {
			if (!user.accountId) continue;
			try {
				await ctx.db.users.upsertByEntityId(user.accountId, {
					accountId: user.accountId,
					...(user.displayName && { displayName: user.displayName }),
					...(user.emailAddress && { emailAddress: user.emailAddress }),
					...(user.active !== undefined && { active: user.active }),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'jira.users.find', { ...input }, 'completed');
	return result;
};

export const getAll: JiraEndpoints['usersGetAll'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['usersGetAll']>(
		'users',
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'GET',
			query: {
				...(input.start_at !== undefined && { startAt: input.start_at }),
				...(input.max_results !== undefined && {
					maxResults: input.max_results,
				}),
			},
		},
	);

	if (ctx.db.users) {
		for (const user of result) {
			if (!user.accountId) continue;
			try {
				await ctx.db.users.upsertByEntityId(user.accountId, {
					accountId: user.accountId,
					...(user.displayName && { displayName: user.displayName }),
					...(user.emailAddress && { emailAddress: user.emailAddress }),
					...(user.active !== undefined && { active: user.active }),
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'jira.users.getAll',
		{ ...input },
		'completed',
	);
	return result;
};

export const groupsGetAll: JiraEndpoints['groupsGetAll'] = async (
	ctx,
	input,
) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['groupsGetAll']>(
		'groups/picker',
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'GET',
			query: {
				...(input.start_at !== undefined && { startAt: input.start_at }),
				...(input.max_results !== undefined && {
					maxResults: input.max_results,
				}),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'jira.groups.getAll',
		{ ...input },
		'completed',
	);
	return result;
};

export const groupsCreate: JiraEndpoints['groupsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['groupsCreate']>(
		'group',
		ctx.key,
		(await ctx.keys.get_cloud_url()) ?? '',
		{
			method: 'POST',
			body: { name: input.name },
		},
	);

	await logEventFromContext(
		ctx,
		'jira.groups.create',
		{ ...input },
		'completed',
	);
	return result;
};
