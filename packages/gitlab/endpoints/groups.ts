import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import type { GitlabEndpointOutputs } from './types';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc, persistGroup } from '../utils';

export const list: GitlabEndpoints['groupsList'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['groupsList']
	>('/groups', ctx, { method: 'GET', query: input, baseUrl: ctx.options.baseUrl });

	await logEventFromContext(ctx, 'gitlab.groups.list', { ...input }, 'completed');
	return result;
};

export const get: GitlabEndpoints['groupsGet'] = async (ctx, input) => {
	const { group_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['groupsGet']
	>(`/groups/${enc(group_id)}`, ctx, { method: 'GET', query, baseUrl: ctx.options.baseUrl });

	if (result) {
		try {
			await persistGroup(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save group to database:', error);
		}
	}

	await logEventFromContext(ctx, 'gitlab.groups.get', { ...input }, 'completed');
	return result;
};

export const create: GitlabEndpoints['groupsCreate'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['groupsCreate']
	>('/groups', ctx, { method: 'POST', body: input, baseUrl: ctx.options.baseUrl });

	if (result) {
		try {
			await persistGroup(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save group to database:', error);
		}
	}

	await logEventFromContext(ctx, 'gitlab.groups.create', { ...input }, 'completed');
	return result;
};

export const update: GitlabEndpoints['groupsUpdate'] = async (ctx, input) => {
	const { group_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['groupsUpdate']
	>(`/groups/${enc(group_id)}`, ctx, { method: 'PUT', body, baseUrl: ctx.options.baseUrl });

	if (result) {
		try {
			await persistGroup(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save group to database:', error);
		}
	}

	await logEventFromContext(ctx, 'gitlab.groups.update', { ...input }, 'completed');
	return result;
};

export const deleteGroup: GitlabEndpoints['groupsDelete'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['groupsDelete']
	>(`/groups/${enc(input.group_id)}`, ctx, { method: 'DELETE', baseUrl: ctx.options.baseUrl });

	await logEventFromContext(ctx, 'gitlab.groups.delete', { ...input }, 'completed');
	return result;
};

export const listProjects: GitlabEndpoints['groupsListProjects'] = async (ctx, input) => {
	const { group_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['groupsListProjects']
	>(`/groups/${enc(group_id)}/projects`, ctx, { method: 'GET', query, baseUrl: ctx.options.baseUrl });

	await logEventFromContext(ctx, 'gitlab.groups.listProjects', { ...input }, 'completed');
	return result;
};
