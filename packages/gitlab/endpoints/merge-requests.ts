import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc, persistMergeRequest } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['mergeRequestsList'] = async (
	ctx,
	input,
) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsList']
	>(`/projects/${enc(project_id)}/merge_requests`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GitlabEndpoints['mergeRequestsGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsGet']
	>(
		`/projects/${enc(input.project_id)}/merge_requests/${input.merge_request_iid}`,
		ctx,
		{ method: 'GET', baseUrl: ctx.options.baseUrl },
	);

	if (result) {
		try {
			await persistMergeRequest(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save merge request to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GitlabEndpoints['mergeRequestsCreate'] = async (
	ctx,
	input,
) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsCreate']
	>(`/projects/${enc(project_id)}/merge_requests`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistMergeRequest(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save merge request to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GitlabEndpoints['mergeRequestsUpdate'] = async (
	ctx,
	input,
) => {
	const { project_id, merge_request_iid, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsUpdate']
	>(`/projects/${enc(project_id)}/merge_requests/${merge_request_iid}`, ctx, {
		method: 'PUT',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistMergeRequest(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save merge request to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteMr: GitlabEndpoints['mergeRequestsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsDelete']
	>(
		`/projects/${enc(input.project_id)}/merge_requests/${input.merge_request_iid}`,
		ctx,
		{ method: 'DELETE', baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const merge: GitlabEndpoints['mergeRequestsMerge'] = async (
	ctx,
	input,
) => {
	const { project_id, merge_request_iid, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsMerge']
	>(
		`/projects/${enc(project_id)}/merge_requests/${merge_request_iid}/merge`,
		ctx,
		{ method: 'PUT', body, baseUrl: ctx.options.baseUrl },
	);

	if (result) {
		try {
			await persistMergeRequest(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save merge request to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.merge',
		{ ...input },
		'completed',
	);
	return result;
};

export const approve: GitlabEndpoints['mergeRequestsApprove'] = async (
	ctx,
	input,
) => {
	const { project_id, merge_request_iid, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsApprove']
	>(
		`/projects/${enc(project_id)}/merge_requests/${merge_request_iid}/approve`,
		ctx,
		{ method: 'POST', body, baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.approve',
		{ ...input },
		'completed',
	);
	return result;
};

export const listNotes: GitlabEndpoints['mergeRequestsListNotes'] = async (
	ctx,
	input,
) => {
	const { project_id, merge_request_iid, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsListNotes']
	>(
		`/projects/${enc(project_id)}/merge_requests/${merge_request_iid}/notes`,
		ctx,
		{ method: 'GET', query, baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.listNotes',
		{ ...input },
		'completed',
	);
	return result;
};

export const createNote: GitlabEndpoints['mergeRequestsCreateNote'] = async (
	ctx,
	input,
) => {
	const { project_id, merge_request_iid, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['mergeRequestsCreateNote']
	>(
		`/projects/${enc(project_id)}/merge_requests/${merge_request_iid}/notes`,
		ctx,
		{ method: 'POST', body, baseUrl: ctx.options.baseUrl },
	);

	await logEventFromContext(
		ctx,
		'gitlab.mergeRequests.createNote',
		{ ...input },
		'completed',
	);
	return result;
};
