import { makeEverhourRequest } from '../client';
import type { EverhourProject } from '../schema/database';

export const listProjects = async (
	ctx: any,
	options: { query?: Record<string, any> } = {},
) => {
	return makeEverhourRequest<EverhourProject[]>('/projects', ctx.key, {
		method: 'GET',
		query: options.query,
	});
};

export const getProject = async (ctx: any, options: { projectId: string }) => {
	return makeEverhourRequest<EverhourProject>(
		`/projects/${options.projectId}`,
		ctx.key,
	);
};
