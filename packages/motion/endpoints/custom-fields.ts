import { define, omit, pathValue } from './define';

export const CustomFields = {
	list: define('listCustomFields', {
		method: 'GET',
		path: ({ workspaceId }) =>
			`/beta/workspaces/${pathValue(workspaceId)}/custom-fields`,
	}),
	create: define('createCustomField', {
		method: 'POST',
		path: ({ workspaceId }) =>
			`/beta/workspaces/${pathValue(workspaceId)}/custom-fields`,
		body: (input) => omit(input, ['workspaceId']),
	}),
	delete: define('deleteCustomField', {
		method: 'DELETE',
		path: ({ workspaceId, id }) =>
			`/beta/workspaces/${pathValue(workspaceId)}/custom-fields/${pathValue(id)}`,
		void: true,
	}),
} as const;

export const CustomFieldValues = {
	addToProject: define('addProjectCustomFieldValue', {
		method: 'POST',
		path: ({ projectId }) =>
			`/beta/custom-field-values/project/${pathValue(projectId)}`,
		body: (input) => omit(input, ['projectId']),
	}),
	addToTask: define('addTaskCustomFieldValue', {
		method: 'POST',
		path: ({ taskId }) => `/beta/custom-field-values/task/${pathValue(taskId)}`,
		body: (input) => omit(input, ['taskId']),
	}),
	deleteFromProject: define('deleteProjectCustomFieldValue', {
		method: 'DELETE',
		path: ({ projectId, valueId }) =>
			`/beta/custom-field-values/project/${pathValue(projectId)}/custom-fields/${pathValue(valueId)}`,
		void: true,
	}),
	deleteFromTask: define('deleteTaskCustomFieldValue', {
		method: 'DELETE',
		path: ({ taskId, valueId }) =>
			`/beta/custom-field-values/task/${pathValue(taskId)}/custom-fields/${pathValue(valueId)}`,
		void: true,
	}),
} as const;
