import { define, pathValue } from './define';

export const RecurringTasks = {
	list: define('listRecurringTasks', {
		method: 'GET',
		path: () => '/v1/recurring-tasks',
		query: ({ workspaceId, cursor }) => ({ workspaceId, cursor }),
	}),
	create: define('createRecurringTask', {
		method: 'POST',
		path: () => '/v1/recurring-tasks',
		body: (input) => input,
	}),
	delete: define('deleteRecurringTask', {
		method: 'DELETE',
		path: ({ id }) => `/v1/recurring-tasks/${pathValue(id)}`,
		void: true,
	}),
} as const;
