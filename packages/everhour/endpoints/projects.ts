import { makeEverhourRequest } from '../client';
import type { EverhourProject } from '../schema/database';

export const listProjects = async (
	apiKey: string,
	options: { query?: Record<string, any> } = {},
) => {
	return makeEverhourRequest<EverhourProject[]>('/projects', apiKey, {
		method: 'GET',
		query: options.query,
	});
};

export const getProject = async (
	apiKey: string,
	options: { projectId: string },
) => {
	return makeEverhourRequest<EverhourProject>(
		`/projects/${options.projectId}`,
		apiKey,
	);
};
