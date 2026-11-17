import { define } from './define';

export const Workspaces = {
	list: define('listWorkspaces', {
		method: 'GET',
		path: () => '/v1/workspaces',
		// Motion renders array query values as repeated keys; the shared transport
		// already serializes arrays that way.
		query: ({ cursor, ids }) => ({ cursor, ids }),
	}),
} as const;

export const Users = {
	list: define('listUsers', {
		method: 'GET',
		path: () => '/v1/users',
		query: ({ cursor, teamId, workspaceId }) => ({
			cursor,
			teamId,
			workspaceId,
		}),
	}),
	me: define('getCurrentUser', {
		method: 'GET',
		path: () => '/v1/users/me',
	}),
} as const;

export const Schedules = {
	list: define('listSchedules', {
		method: 'GET',
		path: () => '/v1/schedules',
	}),
} as const;

export const Statuses = {
	list: define('listStatuses', {
		method: 'GET',
		path: () => '/v1/statuses',
		query: ({ workspaceId }) => ({ workspaceId }),
	}),
} as const;
