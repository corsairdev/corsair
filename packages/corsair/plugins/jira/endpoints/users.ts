import { logEventFromContext } from '../../utils/events';
import type { JiraEndpoints } from '..';
import { makeJiraRequest } from '../client';
import type { JiraEndpointOutputs } from './types';

export const getCurrent: JiraEndpoints['usersGetCurrent'] = async (ctx, _input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['usersGetCurrent']>(
		'myself',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'jira.users.getCurrent', {}, 'completed');
	return result;
};

export const find: JiraEndpoints['usersFind'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['usersFind']>(
		'users/search',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'GET',
			query: {
				query: input.query,
				accountId: input.account_id,
				startAt: input.start_at,
				maxResults: input.max_results,
			},
		},
	);

	await logEventFromContext(ctx, 'jira.users.find', { ...input }, 'completed');
	return result;
};

export const getAll: JiraEndpoints['usersGetAll'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['usersGetAll']>(
		'users',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'GET',
			query: {
				startAt: input.start_at,
				maxResults: input.max_results,
			},
		},
	);

	await logEventFromContext(ctx, 'jira.users.getAll', { ...input }, 'completed');
	return result;
};

export const groupsGetAll: JiraEndpoints['groupsGetAll'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['groupsGetAll']>(
		'groups/picker',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'GET',
			query: {
				startAt: input.start_at,
				maxResults: input.max_results,
			},
		},
	);

	await logEventFromContext(ctx, 'jira.groups.getAll', { ...input }, 'completed');
	return result;
};

export const groupsCreate: JiraEndpoints['groupsCreate'] = async (ctx, input) => {
	const result = await makeJiraRequest<JiraEndpointOutputs['groupsCreate']>(
		'group',
		ctx.key,
		ctx.options.cloudUrl ?? '',
		{
			method: 'POST',
			body: { name: input.name },
		},
	);

	await logEventFromContext(ctx, 'jira.groups.create', { ...input }, 'completed');
	return result;
};
