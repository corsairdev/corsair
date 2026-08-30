import { logEventFromContext } from 'corsair/core';
import type { CustomGPTContext, CustomGPTEndpoints } from '..';
import { makeCustomGPTRequest } from '../client';
import { cacheEntity, fileFormFields, omit } from './shared';
import type { CustomGPTEndpointOutputs } from './types';

/** Mirrors an agent returned by the API into the `projects` entity cache. */
async function cacheProject(
	ctx: CustomGPTContext,
	project: { id?: number } & Record<string, unknown>,
): Promise<void> {
	if (project?.id === undefined || !ctx.db.projects) return;
	await cacheEntity('project', () =>
		ctx.db.projects.upsertByEntityId(String(project.id), {
			...project,
			id: project.id as number,
			syncedAt: new Date(),
		}),
	);
}

export const listProjects: CustomGPTEndpoints['listProjects'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['listProjects']
	>('projects', ctx.key, { method: 'GET', query: { ...input } });

	for (const project of response.data?.data ?? []) {
		await cacheProject(ctx, project);
	}

	await logEventFromContext(
		ctx,
		'customgpt.projects.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const createProject: CustomGPTEndpoints['createProject'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['createProject']
	>('projects', ctx.key, {
		method: 'POST',
		formData: {
			...omit(input, ['file', 'files']),
			...fileFormFields(input),
		},
	});

	await cacheProject(ctx, response.data);

	await logEventFromContext(
		ctx,
		'customgpt.projects.create',
		{ project_name: input.project_name, sitemap_path: input.sitemap_path },
		'completed',
	);
	return response;
};

export const getProject: CustomGPTEndpoints['getProject'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getProject']
	>(`projects/${input.projectId}`, ctx.key, {
		method: 'GET',
		query: { width: input.width, height: input.height },
	});

	await cacheProject(ctx, response.data);

	await logEventFromContext(
		ctx,
		'customgpt.projects.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateProject: CustomGPTEndpoints['updateProject'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['updateProject']
	>(`projects/${input.projectId}`, ctx.key, {
		method: 'POST',
		formData: {
			...omit(input, ['projectId', 'file', 'files']),
			...fileFormFields(input),
		},
	});

	await cacheProject(ctx, response.data);

	await logEventFromContext(
		ctx,
		'customgpt.projects.update',
		{ projectId: input.projectId, project_name: input.project_name },
		'completed',
	);
	return response;
};

export const deleteProject: CustomGPTEndpoints['deleteProject'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['deleteProject']
	>(`projects/${input.projectId}`, ctx.key, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'customgpt.projects.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const cloneProject: CustomGPTEndpoints['cloneProject'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['cloneProject']
	>(`projects/${input.projectId}/replicate`, ctx.key, { method: 'POST' });

	await cacheProject(ctx, response.data);

	await logEventFromContext(
		ctx,
		'customgpt.projects.clone',
		{ ...input },
		'completed',
	);
	return response;
};

export const getStats: CustomGPTEndpoints['getStats'] = async (ctx, input) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getStats']
	>(`projects/${input.projectId}/stats`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'customgpt.projects.stats',
		{ ...input },
		'completed',
	);
	return response;
};

export const getPlugins: CustomGPTEndpoints['getPlugins'] = async (
	ctx,
	input,
) => {
	const response = await makeCustomGPTRequest<
		CustomGPTEndpointOutputs['getPlugins']
	>(`projects/${input.projectId}/actions`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'customgpt.projects.plugins',
		{ ...input },
		'completed',
	);
	return response;
};
