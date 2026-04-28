import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['milestonesList'] = async (ctx, input) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['milestonesList']
	>(`/projects/${enc(project_id)}/milestones`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.milestones.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GitlabEndpoints['milestonesGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['milestonesGet']
	>(
		`/projects/${enc(input.project_id)}/milestones/${input.milestone_id}`,
		ctx,
		{ method: 'GET', baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.milestones.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GitlabEndpoints['milestonesCreate'] = async (
	ctx,
	input,
) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['milestonesCreate']
	>(`/projects/${enc(project_id)}/milestones`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.milestones.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GitlabEndpoints['milestonesUpdate'] = async (
	ctx,
	input,
) => {
	const { project_id, milestone_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['milestonesUpdate']
	>(`/projects/${enc(project_id)}/milestones/${milestone_id}`, ctx, {
		method: 'PUT',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.milestones.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteMilestone: GitlabEndpoints['milestonesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['milestonesDelete']
	>(
		`/projects/${enc(input.project_id)}/milestones/${input.milestone_id}`,
		ctx,
		{ method: 'DELETE', baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.milestones.delete',
		{ ...input },
		'completed',
	);
	return result;
};
