import 'dotenv/config';
import { makeTodoistRequest } from './client';
import type { TodoistEndpointOutputs } from './endpoints/types';
import { TodoistEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.TODOIST_API_KEY!;

describe('Todoist API Type Tests', () => {
	describe('tasks', () => {
		let projectId: string | undefined;
		let taskId: string | undefined;

		beforeAll(async () => {
			const projects = await makeTodoistRequest<
				TodoistEndpointOutputs['projectsGetMany']
			>('projects', TEST_TOKEN, {
				method: 'GET',
			});

			if (Array.isArray(projects) && projects.length > 0) {
				projectId = projects[0]?.id;
			} else if (
				!Array.isArray(projects) &&
				'projects' in projects &&
				Array.isArray(projects.projects) &&
				projects.projects.length > 0
			) {
				projectId = projects.projects[0]?.id;
			}
		});

		it('tasksGetMany returns correct type', async () => {
			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['tasksGetMany']
			>('tasks', TEST_TOKEN, {
				method: 'GET',
				query: {
					project_id: projectId,
				},
			});

			const result = response;

			TodoistEndpointOutputSchemas.tasksGetMany.parse(result);
		});

		it('tasksCreate returns correct type', async () => {
			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['tasksCreate']
			>('tasks', TEST_TOKEN, {
				method: 'POST',
				body: {
					content: 'Test task from API test',
					project_id: projectId,
				},
			});

			await makeTodoistRequest<TodoistEndpointOutputs['tasksCreate']>(
				'tasks',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						content: 'Test task from API test 2',
						project_id: projectId,
					},
				},
			);

			const result = response;

			taskId = result.id;

			TodoistEndpointOutputSchemas.tasksCreate.parse(result);
		});

		it('tasksGet returns correct type', async () => {
			if (!taskId) {
				const task = await makeTodoistRequest<
					TodoistEndpointOutputs['tasksCreate']
				>('tasks', TEST_TOKEN, {
					method: 'POST',
					body: {
						content: 'Task for get test',
						project_id: projectId,
					},
				});

				taskId = task.id;
			}

			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['tasksGet']
			>(`tasks/${taskId}`, TEST_TOKEN, {
				method: 'GET',
			});

			const result = response;

			TodoistEndpointOutputSchemas.tasksGet.parse(result);
		});

		it('tasksUpdate returns correct type', async () => {
			if (!taskId) {
				const task = await makeTodoistRequest<
					TodoistEndpointOutputs['tasksCreate']
				>('tasks', TEST_TOKEN, {
					method: 'POST',
					body: {
						content: 'Task for update test',
						project_id: projectId,
					},
				});

				taskId = task.id;
			}

			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['tasksUpdate']
			>(`tasks/${taskId}`, TEST_TOKEN, {
				method: 'POST',
				body: {
					content: 'Updated task from API test',
				},
			});

			const result = response;

			TodoistEndpointOutputSchemas.tasksUpdate.parse(result);
		});

		it('tasksClose returns correct type', async () => {
			if (!taskId) {
				const task = await makeTodoistRequest<
					TodoistEndpointOutputs['tasksCreate']
				>('tasks', TEST_TOKEN, {
					method: 'POST',
					body: {
						content: 'Task for close test',
						project_id: projectId,
					},
				});

				taskId = task.id;
			}

			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['tasksClose']
			>(`tasks/${taskId}/close`, TEST_TOKEN, {
				method: 'POST',
			});

			const result = response;

			TodoistEndpointOutputSchemas.tasksClose.parse(result);
		});

		it('tasksReopen returns correct type', async () => {
			if (!taskId) {
				const task = await makeTodoistRequest<
					TodoistEndpointOutputs['tasksCreate']
				>('tasks', TEST_TOKEN, {
					method: 'POST',
					body: {
						content: 'Task for reopen test',
						project_id: projectId,
					},
				});

				taskId = task.id;
			}

			await makeTodoistRequest<TodoistEndpointOutputs['tasksClose']>(
				`tasks/${taskId}/close`,
				TEST_TOKEN,
				{
					method: 'POST',
				},
			);

			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['tasksReopen']
			>(`tasks/${taskId}/reopen`, TEST_TOKEN, {
				method: 'POST',
			});

			const result = response;

			TodoistEndpointOutputSchemas.tasksReopen.parse(result);
		});

		it('tasksDelete returns correct type', async () => {
			if (!taskId) {
				const task = await makeTodoistRequest<
					TodoistEndpointOutputs['tasksCreate']
				>('tasks', TEST_TOKEN, {
					method: 'POST',
					body: {
						content: 'Task for delete test',
						project_id: projectId,
					},
				});

				taskId = task.id;
			}

			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['tasksDelete']
			>(`tasks/${taskId}`, TEST_TOKEN, {
				method: 'DELETE',
			});

			const result = response;

			TodoistEndpointOutputSchemas.tasksDelete.parse(result);
		});
	});

	describe('projects', () => {
		let projectId: string | undefined;

		it('projectsGetMany returns correct type', async () => {
			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['projectsGetMany']
			>('projects', TEST_TOKEN, {
				method: 'GET',
			});

			const result = response;

			if (Array.isArray(result) && result.length > 0) {
				projectId = result[0]?.id;
			} else if (
				!Array.isArray(result) &&
				'projects' in result &&
				Array.isArray(result.projects) &&
				result.projects.length > 0
			) {
				projectId = result.projects[0]?.id;
			}

			TodoistEndpointOutputSchemas.projectsGetMany.parse(result);
		});

		it('projectsGet returns correct type', async () => {
			if (!projectId) {
				const projects = await makeTodoistRequest<
					TodoistEndpointOutputs['projectsGetMany']
				>('projects', TEST_TOKEN, {
					method: 'GET',
				});

				if (Array.isArray(projects) && projects.length > 0) {
					projectId = projects[0]?.id;
				} else if (
					!Array.isArray(projects) &&
					'projects' in projects &&
					Array.isArray(projects.projects) &&
					projects.projects.length > 0
				) {
					projectId = projects.projects[0]?.id;
				} else {
					return;
				}
			}

			const response = await makeTodoistRequest<
				TodoistEndpointOutputs['projectsGet']
			>(`projects/${projectId}`, TEST_TOKEN, {
				method: 'GET',
			});

			const result = response;

			TodoistEndpointOutputSchemas.projectsGet.parse(result);
		});
	});
});
