import { define, omit, pathValue } from './define';

export const Tasks = {
	list: define('listTasks', {
		method: 'GET',
		path: () => '/v1/tasks',
		// Motion renders array query values as repeated keys; the shared transport
		// already serializes arrays that way.
		query: ({
			assigneeId,
			cursor,
			includeAllStatuses,
			label,
			name,
			projectId,
			status,
			workspaceId,
		}) => ({
			assigneeId,
			cursor,
			includeAllStatuses,
			label,
			name,
			projectId,
			status,
			workspaceId,
		}),
	}),
	create: define('createTask', {
		method: 'POST',
		path: () => '/v1/tasks',
		body: (input) => input,
	}),
	get: define('getTask', {
		method: 'GET',
		path: ({ id }) => `/v1/tasks/${pathValue(id)}`,
	}),
	update: define('updateTask', {
		method: 'PATCH',
		path: ({ id }) => `/v1/tasks/${pathValue(id)}`,
		body: (input) => omit(input, ['id']),
	}),
	delete: define('deleteTask', {
		method: 'DELETE',
		path: ({ id }) => `/v1/tasks/${pathValue(id)}`,
		void: true,
	}),
	move: define('moveTask', {
		method: 'PATCH',
		path: ({ id }) => `/v1/tasks/${pathValue(id)}/move`,
		body: (input) => omit(input, ['id']),
	}),
	unassign: define('unassignTask', {
		method: 'DELETE',
		path: ({ id }) => `/v1/tasks/${pathValue(id)}/assignee`,
		void: true,
	}),
} as const;
