import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['branchesList'] = async (ctx, input) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['branchesList']
	>(`/projects/${enc(project_id)}/repository/branches`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.branches.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GitlabEndpoints['branchesGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['branchesGet']
	>(
		`/projects/${enc(input.project_id)}/repository/branches/${enc(input.branch)}`,
		ctx,
		{ method: 'GET', baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.branches.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GitlabEndpoints['branchesCreate'] = async (ctx, input) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['branchesCreate']
	>(`/projects/${enc(project_id)}/repository/branches`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.branches.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteBranch: GitlabEndpoints['branchesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['branchesDelete']
	>(
		`/projects/${enc(input.project_id)}/repository/branches/${enc(input.branch)}`,
		ctx,
		{ method: 'DELETE', baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.branches.delete',
		{ ...input },
		'completed',
	);
	return result;
};
