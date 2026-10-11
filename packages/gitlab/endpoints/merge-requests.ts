import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc, persistMergeRequest, resolveNumericProjectId } from '../utils';
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

	if (ctx.db.mergeRequests) {
		try {
			const resolvedProjectId = await resolveNumericProjectId(
				input.project_id,
				ctx.db,
			);
			if (resolvedProjectId === null) {
				console.warn(
					`gitlab.mergeRequests.delete: could not resolve project_id "${input.project_id}" to a numeric ID; skipping local DB cleanup`,
				);
			} else if (
				typeof input.merge_request_iid !== 'number' ||
				!Number.isSafeInteger(input.merge_request_iid) ||
				input.merge_request_iid <= 0
			) {
				console.warn(
					`gitlab.mergeRequests.delete: invalid merge_request_iid "${input.merge_request_iid}"; skipping local DB cleanup`,
				);
			} else {
				// Note: 'as any' is required because Zod 4's .loose() index signature
				// on GitlabMergeRequest conflicts with Corsair ORM's DataSearchFilter.
				const candidates = await ctx.db.mergeRequests.search({
					data: { iid: input.merge_request_iid } as any,
				});
				const matches = candidates.filter(
					(e: { data?: { project_id?: number } }) =>
						e.data?.project_id === resolvedProjectId,
				);
				if (matches.length === 1) {
					await ctx.db.mergeRequests.deleteByEntityId(matches[0]!.entity_id);
				} else if (matches.length === 0) {
					console.warn(
						`gitlab.mergeRequests.delete: no local MR found for iid ${input.merge_request_iid} in project ${resolvedProjectId}; skipping local DB cleanup`,
					);
				} else {
					console.warn(
						`gitlab.mergeRequests.delete: ${matches.length} local MRs match iid ${input.merge_request_iid} in project ${resolvedProjectId}; skipping local DB cleanup to avoid deleting the wrong record`,
					);
				}
			}
		} catch (error) {
			console.warn('Failed to delete merge request from database:', error);
		}
	}

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
