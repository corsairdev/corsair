import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const getTree: GitlabEndpoints['repositoryGetTree'] = async (
	ctx,
	input,
) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['repositoryGetTree']
	>(`/projects/${enc(project_id)}/repository/tree`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.repository.getTree',
		{ ...input },
		'completed',
	);
	return result;
};

export const getFile: GitlabEndpoints['repositoryGetFile'] = async (
	ctx,
	input,
) => {
	const { project_id, file_path, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['repositoryGetFile']
	>(`/projects/${enc(project_id)}/repository/files/${enc(file_path)}`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.repository.getFile',
		{ ...input },
		'completed',
	);
	return result;
};

export const compare: GitlabEndpoints['repositoryCompare'] = async (
	ctx,
	input,
) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['repositoryCompare']
	>(`/projects/${enc(project_id)}/repository/compare`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.repository.compare',
		{ ...input },
		'completed',
	);
	return result;
};
