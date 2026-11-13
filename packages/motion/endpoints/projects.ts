import { define, pathValue } from './define';

export const Projects = {
	list: define('listProjects', {
		method: 'GET',
		path: () => '/v1/projects',
		query: ({ cursor, workspaceId }) => ({ cursor, workspaceId }),
	}),
	create: define('createProject', {
		method: 'POST',
		path: () => '/v1/projects',
		body: (input) => input,
	}),
	get: define('getProject', {
		method: 'GET',
		path: ({ id }) => `/v1/projects/${pathValue(id)}`,
	}),
} as const;
