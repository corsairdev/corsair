import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { persistUser } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const getCurrentUser: GitlabEndpoints['usersGetCurrentUser'] = async (
	ctx,
	_input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['usersGetCurrentUser']
	>('/user', ctx, { method: 'GET', baseUrl: ctx.options.baseUrl });

	if (result) {
		try {
			await persistUser(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.users.getCurrentUser',
		{},
		'completed',
	);
	return result;
};

export const getUser: GitlabEndpoints['usersGetUser'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['usersGetUser']
	>(`/users/${input.user_id}`, ctx, {
		method: 'GET',
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistUser(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.users.getUser',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GitlabEndpoints['usersList'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['usersList']
	>('/users', ctx, {
		method: 'GET',
		query: input,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.users.list',
		{ ...input },
		'completed',
	);
	return result;
};
