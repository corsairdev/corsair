import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['commitsList'] = async (ctx, input) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['commitsList']
	>(`/projects/${enc(project_id)}/repository/commits`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.commits.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GitlabEndpoints['commitsGet'] = async (ctx, input) => {
	const { project_id, sha, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['commitsGet']
	>(`/projects/${enc(project_id)}/repository/commits/${enc(sha)}`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.commits.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getDiff: GitlabEndpoints['commitsGetDiff'] = async (
	ctx,
	input,
) => {
	const { project_id, sha, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['commitsGetDiff']
	>(`/projects/${enc(project_id)}/repository/commits/${enc(sha)}/diff`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.commits.getDiff',
		{ ...input },
		'completed',
	);
	return result;
};
