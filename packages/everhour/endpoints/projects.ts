import { makeEverhourRequest } from '../client';
import type { EverhourProject } from '../schema/database';

export const listProjects = async (
	ctx: any,
	options: {
		query?: Record<string, string | number | boolean>;
		page?: number;
		limit?: number;
		platform?: string;
	} = {},
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

export const getProject = async (ctx: any, options: { projectId: string }) => {
	return makeEverhourRequest<EverhourProject>(
		`/projects/${options.projectId}`,
		ctx.key,
	);
};

export const createProject = async (
	ctx: any,
	options: {
		name: string;
		type: 'board' | 'list';
		users?: number[];
		client?: number | null;
		privacy?: boolean;
	},
) => {
	const { name, type, users, client, privacy } = options;
	return makeEverhourRequest<EverhourProject>('/projects', ctx.key, {
		method: 'POST',
		body: { name, type, users, client, privacy },
	});
};

export const updateProject = async (
	ctx: any,
	options: {
		projectId: string;
		name?: string;
		type?: 'board' | 'list';
		users?: number[];
		client?: number | null;
		privacy?: boolean;
		color?: string;
	},
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

export const deleteProject = async (
	ctx: any,
	options: { projectId: string },
) => {
	return makeEverhourRequest<void>(`/projects/${options.projectId}`, ctx.key, {
		method: 'DELETE',
	});
};
