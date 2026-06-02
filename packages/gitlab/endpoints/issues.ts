import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc, persistIssue } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['issuesList'] = async (ctx, input) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['issuesList']
	>(`/projects/${enc(project_id)}/issues`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.issues.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GitlabEndpoints['issuesGet'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['issuesGet']
	>(`/projects/${enc(input.project_id)}/issues/${input.issue_iid}`, ctx, {
		method: 'GET',
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistIssue(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.issues.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GitlabEndpoints['issuesCreate'] = async (ctx, input) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['issuesCreate']
	>(`/projects/${enc(project_id)}/issues`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistIssue(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.issues.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GitlabEndpoints['issuesUpdate'] = async (ctx, input) => {
	const { project_id, issue_iid, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['issuesUpdate']
	>(`/projects/${enc(project_id)}/issues/${issue_iid}`, ctx, {
		method: 'PUT',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistIssue(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save issue to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.issues.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteIssue: GitlabEndpoints['issuesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['issuesDelete']
	>(`/projects/${enc(input.project_id)}/issues/${input.issue_iid}`, ctx, {
		method: 'DELETE',
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.issues.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const listNotes: GitlabEndpoints['issuesListNotes'] = async (
	ctx,
	input,
) => {
	const { project_id, issue_iid, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['issuesListNotes']
	>(`/projects/${enc(project_id)}/issues/${issue_iid}/notes`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.issues.listNotes',
		{ ...input },
		'completed',
	);
	return result;
};

export const createNote: GitlabEndpoints['issuesCreateNote'] = async (
	ctx,
	input,
) => {
	const { project_id, issue_iid, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['issuesCreateNote']
	>(`/projects/${enc(project_id)}/issues/${issue_iid}/notes`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.issues.createNote',
		{ ...input },
		'completed',
	);
	return result;
};
