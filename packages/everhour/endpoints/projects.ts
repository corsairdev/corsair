import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourProject } from '../schema/database';

export const listProjects: EverhourEndpoints['listProjects'] = async (
	ctx,
	options = {},
) => {
	return makeEverhourRequest<EverhourProject[]>('/projects', ctx.key, {
		method: 'GET',
		query: {
			...options.query,
			...(options.page !== undefined ? { page: options.page } : {}),
			...(options.limit !== undefined ? { limit: options.limit } : {}),
			...(options.platform !== undefined ? { platform: options.platform } : {}),
		},
	});
};

export const getProject: EverhourEndpoints['getProject'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<EverhourProject>(
		`/projects/${options.projectId}`,
		ctx.key,
	);
};

export const createProject: EverhourEndpoints['createProject'] = async (
	ctx,
	options,
) => {
	const { name, type, users, client, privacy } = options;
	return makeEverhourRequest<EverhourProject>('/projects', ctx.key, {
		method: 'POST',
		body: { name, type, users, client, privacy },
	});
};

export const updateProject: EverhourEndpoints['updateProject'] = async (
	ctx,
	options,
) => {
	const { projectId, ...body } = options;
	return makeEverhourRequest<EverhourProject>(
		`/projects/${projectId}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);
};

export const deleteProject: EverhourEndpoints['deleteProject'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<void>(`/projects/${options.projectId}`, ctx.key, {
		method: 'DELETE',
	});
};
