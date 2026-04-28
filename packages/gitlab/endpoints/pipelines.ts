import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc, persistPipeline } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['pipelinesList'] = async (ctx, input) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['pipelinesList']
	>(`/projects/${enc(project_id)}/pipelines`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.pipelines.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GitlabEndpoints['pipelinesGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['pipelinesGet']
	>(`/projects/${enc(input.project_id)}/pipelines/${input.pipeline_id}`, ctx, {
		method: 'GET',
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistPipeline(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save pipeline to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.pipelines.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GitlabEndpoints['pipelinesCreate'] = async (
	ctx,
	input,
) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['pipelinesCreate']
	>(`/projects/${enc(project_id)}/pipeline`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistPipeline(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save pipeline to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.pipelines.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const retry: GitlabEndpoints['pipelinesRetry'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['pipelinesRetry']
	>(
		`/projects/${enc(input.project_id)}/pipelines/${input.pipeline_id}/retry`,
		ctx,
		{ method: 'POST', baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.pipelines.retry',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancel: GitlabEndpoints['pipelinesCancel'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['pipelinesCancel']
	>(
		`/projects/${enc(input.project_id)}/pipelines/${input.pipeline_id}/cancel`,
		ctx,
		{ method: 'POST', baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.pipelines.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const deletePipeline: GitlabEndpoints['pipelinesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['pipelinesDelete']
	>(`/projects/${enc(input.project_id)}/pipelines/${input.pipeline_id}`, ctx, {
		method: 'DELETE',
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.pipelines.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const listJobs: GitlabEndpoints['pipelinesListJobs'] = async (
	ctx,
	input,
) => {
	const { project_id, pipeline_id, scope, ...rest } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['pipelinesListJobs']
	>(`/projects/${enc(project_id)}/pipelines/${pipeline_id}/jobs`, ctx, {
		method: 'GET',
		query: { ...rest, ...(scope ? { 'scope[]': scope.join(',') } : {}) },
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.pipelines.listJobs',
		{ ...input },
		'completed',
	);
	return result;
};
