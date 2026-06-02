import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['releasesList'] = async (ctx, input) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['releasesList']
	>(`/projects/${enc(project_id)}/releases`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.releases.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GitlabEndpoints['releasesGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['releasesGet']
	>(`/projects/${enc(input.project_id)}/releases/${enc(input.tag_name)}`, ctx, {
		method: 'GET',
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.releases.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GitlabEndpoints['releasesCreate'] = async (ctx, input) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['releasesCreate']
	>(`/projects/${enc(project_id)}/releases`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.releases.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GitlabEndpoints['releasesUpdate'] = async (ctx, input) => {
	const { project_id, tag_name, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['releasesUpdate']
	>(`/projects/${enc(project_id)}/releases/${enc(tag_name)}`, ctx, {
		method: 'PUT',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.releases.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteRelease: GitlabEndpoints['releasesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['releasesDelete']
	>(`/projects/${enc(input.project_id)}/releases/${enc(input.tag_name)}`, ctx, {
		method: 'DELETE',
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.releases.delete',
		{ ...input },
		'completed',
	);
	return result;
};
