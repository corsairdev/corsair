import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['labelsList'] = async (ctx, input) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['labelsList']
	>(`/projects/${enc(project_id)}/labels`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.labels.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GitlabEndpoints['labelsCreate'] = async (ctx, input) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['labelsCreate']
	>(`/projects/${enc(project_id)}/labels`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.labels.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GitlabEndpoints['labelsUpdate'] = async (ctx, input) => {
	const { project_id, label_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['labelsUpdate']
	>(`/projects/${enc(project_id)}/labels/${label_id}`, ctx, {
		method: 'PUT',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.labels.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteLabel: GitlabEndpoints['labelsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['labelsDelete']
	>(`/projects/${enc(input.project_id)}/labels/${input.label_id}`, ctx, {
		method: 'DELETE',
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.labels.delete',
		{ ...input },
		'completed',
	);
	return result;
};
