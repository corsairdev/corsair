import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import { makeAuthenticatedGitlabRequest } from '../client';
import { enc, findLocalProject, persistProject } from '../utils';
import type { GitlabEndpointOutputs } from './types';

export const list: GitlabEndpoints['projectsList'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['projectsList']
	>('/projects', ctx, {
		method: 'GET',
		query: input,
		baseUrl: ctx.options.baseUrl,
	});

	await logEventFromContext(
		ctx,
		'gitlab.projects.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GitlabEndpoints['projectsGet'] = async (ctx, input) => {
	const { project_id, ...query } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['projectsGet']
	>(`/projects/${enc(project_id)}`, ctx, {
		method: 'GET',
		query,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistProject(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.projects.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: GitlabEndpoints['projectsCreate'] = async (ctx, input) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['projectsCreate']
	>('/projects', ctx, {
		method: 'POST',
		body: input,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistProject(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.projects.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GitlabEndpoints['projectsUpdate'] = async (ctx, input) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['projectsUpdate']
	>(`/projects/${enc(project_id)}`, ctx, {
		method: 'PUT',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistProject(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.projects.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteProject: GitlabEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['projectsDelete']
	>(`/projects/${enc(input.project_id)}`, ctx, {
		method: 'DELETE',
		baseUrl: ctx.options.baseUrl,
	});

	if (ctx.db.projects) {
		try {
			const project = await findLocalProject(input.project_id, ctx.db);
			if (project.status === 'found') {
				await ctx.db.projects.deleteByEntityId(project.entityId);
			} else if (project.status === 'ambiguous') {
				console.warn(
					`gitlab.projects.delete: ${project.count} local projects match "${input.project_id}"; skipping local DB cleanup to avoid deleting the wrong record`,
				);
			} else if (project.status === 'invalid') {
				console.warn(
					`gitlab.projects.delete: invalid project identifier "${input.project_id}"; skipping local DB cleanup`,
				);
			} else {
				console.warn(
					`gitlab.projects.delete: no local project found for "${input.project_id}"; skipping local DB cleanup`,
				);
			}
		} catch (error) {
			console.warn('Failed to delete project from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.projects.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const fork: GitlabEndpoints['projectsFork'] = async (ctx, input) => {
	const { project_id, ...body } = input;

	const result = await makeAuthenticatedGitlabRequest<
		GitlabEndpointOutputs['projectsFork']
	>(`/projects/${enc(project_id)}/fork`, ctx, {
		method: 'POST',
		body,
		baseUrl: ctx.options.baseUrl,
	});

	if (result) {
		try {
			await persistProject(result, ctx.db);
		} catch (error) {
			console.warn('Failed to save project to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gitlab.projects.fork',
		{ ...input },
		'completed',
	);
	return result;
};
