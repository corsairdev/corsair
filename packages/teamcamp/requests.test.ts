import { Endpoints } from './endpoints';
import type { TeamcampEndpointOutputSchemas as Outputs } from './endpoints/types';
import { captureError } from './test-errors';
import {
	archivedProject,
	customerList,
	deleteMessage,
	groupList,
	project,
	projectDetail,
	projectList,
	task,
	taskList,
	userList,
	workspace,
} from './test-fixtures';
import {
	calls,
	expectAuthenticated,
	invoke,
	lastRequest,
	respond,
	setUp,
	tearDown,
} from './test-harness';

beforeEach(setUp);
afterEach(tearDown);

describe('account.verify', () => {
	it('GETs /verify and reads the workspace', async () => {
		respond(workspace);

		const result = (await invoke(Endpoints.accountVerify)) as typeof workspace;

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1.0/verify',
		});
		expect(result.workspaceId).toBe('5-YTy0zgMFoXJSV4joyB5');
	});
});

describe('users.list', () => {
	it('GETs /company/users and wraps the bare array', async () => {
		respond(userList);

		const result = (await invoke(Endpoints.usersList)) as ReturnType<
			typeof Outputs.usersList.parse
		>;

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1.0/company/users');
		expect(result.users).toHaveLength(1);
	});

	it('fails loudly when the answer is not an array', async () => {
		respond({ users: [] });

		const error = await captureError(invoke(Endpoints.usersList));

		expect((error as Error).message).toContain('not an array');
	});
});

describe('customers.list', () => {
	it('GETs /company/customers and keeps an empty list', async () => {
		respond(customerList);

		const result = (await invoke(Endpoints.customersList)) as ReturnType<
			typeof Outputs.customersList.parse
		>;

		expect(lastRequest().path).toBe('/v1.0/company/customers');
		expect(result.customers).toEqual([]);
	});
});

describe('projects.list', () => {
	it('GETs /project and reads the two-field rows', async () => {
		respond(projectList);

		const result = (await invoke(Endpoints.projectsList)) as {
			projects: { projectId: string }[];
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1.0/project');
		expect(result.projects[0]?.projectId).toBe('iPSOnKVs4zSOR5-vQTK_3');
	});
});

describe('projects.get', () => {
	it('GETs one project with its workflow statuses', async () => {
		respond(projectDetail);

		const result = (await invoke(Endpoints.projectsGet, {
			projectId: 'iPSOnKVs4zSOR5-vQTK_3',
		})) as typeof projectDetail;

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1.0/project/iPSOnKVs4zSOR5-vQTK_3');
		expect(result.status).toHaveLength(4);
		expect(result.status[0]?.Name).toBe('Todo');
	});

	it('rejects an empty project id', async () => {
		await expect(
			invoke(Endpoints.projectsGet, { projectId: '' }),
		).rejects.toThrow();
		expect(calls()).toBe(0);
	});
});

describe('projects.create', () => {
	it('POSTs the name and the optional fields it was given', async () => {
		respond(project);

		const result = (await invoke(Endpoints.projectsCreate, {
			projectName: 'Corsair Probe Project',
			startDate: '2026-11-30',
			dueDate: '2026-12-31',
			customerId: 'c1',
			templateId: 't1',
		})) as typeof project;

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1.0/project');
		expect(sent.body).toEqual({
			projectName: 'Corsair Probe Project',
			customerId: 'c1',
			startDate: '2026-11-30',
			dueDate: '2026-12-31',
			templateId: 't1',
		});
		expect(result.projectId).toBe('0uUAD4N11-tUA00rNE2EB');
	});

	it('rejects a date the API would not accept', async () => {
		await expect(
			invoke(Endpoints.projectsCreate, {
				projectName: 'x',
				startDate: '30/11/2026',
			}),
		).rejects.toThrow(/yyyy-MM-dd/);
	});

	it('rejects an empty name', async () => {
		await expect(
			invoke(Endpoints.projectsCreate, { projectName: '' }),
		).rejects.toThrow();
	});
});

describe('projects.update', () => {
	it('PUTs only the fields the caller named', async () => {
		respond(project);

		await invoke(Endpoints.projectsUpdate, {
			projectId: 'p1',
			projectName: 'Renamed',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PUT');
		expect(sent.path).toBe('/v1.0/project/p1');
		expect(sent.body).toEqual({ projectName: 'Renamed' });
	});

	it('sends a description on its own', async () => {
		respond(project);

		await invoke(Endpoints.projectsUpdate, {
			projectId: 'p1',
			description: 'A new description',
		});

		expect(lastRequest().body).toEqual({ description: 'A new description' });
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(Endpoints.projectsUpdate, { projectId: 'p1' }),
		).rejects.toThrow(/changes nothing/);
		expect(calls()).toBe(0);
	});
});

describe('projects.delete', () => {
	it('DELETEs and reports the archive, reading the bare-string answer', async () => {
		respond(JSON.stringify(deleteMessage));

		const result = (await invoke(Endpoints.projectsDelete, {
			projectId: 'p1',
		})) as { archived: boolean; projectId: string; message: string };

		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/v1.0/project/p1');
		expect(result).toEqual({
			archived: true,
			projectId: 'p1',
			message: deleteMessage,
		});
	});

	it('fails rather than inventing a message when the answer is not a string', async () => {
		respond({ ok: true });

		const error = await captureError(
			invoke(Endpoints.projectsDelete, { projectId: 'p1' }),
		);

		expect((error as Error).message).toContain(
			'not the expected message string',
		);
	});

	it('fails when the delete answers an empty body', async () => {
		respond('');

		const error = await captureError(
			invoke(Endpoints.projectsDelete, { projectId: 'p1' }),
		);

		expect((error as Error).message).toContain(
			'not the expected message string',
		);
	});

	it('still reads a project by id after the delete, marked archived', async () => {
		respond(archivedProject);

		const result = (await invoke(Endpoints.projectsGet, {
			projectId: 'p1',
		})) as { archived?: boolean | null };

		expect(result.archived).toBe(true);
	});
});

describe('groups.list', () => {
	it('GETs the project groups and keeps an empty list', async () => {
		respond(groupList);

		const result = (await invoke(Endpoints.groupsList, {
			projectId: 'p1',
		})) as ReturnType<typeof Outputs.groupsList.parse>;

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1.0/project/p1/group');
		expect(result.groups).toEqual([]);
	});
});

describe('tasks.list', () => {
	it('GETs /task with the project id the API requires', async () => {
		respond(taskList);

		const result = (await invoke(Endpoints.tasksList, {
			projectId: 'p1',
		})) as ReturnType<typeof Outputs.tasksList.parse>;

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.path).toBe('/v1.0/task');
		expect(sent.query).toEqual({ projectId: 'p1' });
		expect(result.tasks).toHaveLength(1);
	});

	it('sends the complete filter both ways', async () => {
		respond([]);
		await invoke(Endpoints.tasksList, { projectId: 'p1', complete: true });
		expect(lastRequest().query).toEqual({ projectId: 'p1', complete: 'true' });

		respond([]);
		await invoke(Endpoints.tasksList, { projectId: 'p1', complete: false });
		expect(lastRequest().query).toEqual({ projectId: 'p1', complete: 'false' });
	});

	it('rejects a call with no project id, which the API answers 400 for', async () => {
		await expect(invoke(Endpoints.tasksList, {})).rejects.toThrow();
		expect(calls()).toBe(0);
	});
});

describe('tasks.get', () => {
	it('GETs one task with its comments', async () => {
		respond(task);

		const result = (await invoke(Endpoints.tasksGet, {
			taskId: 'HbQJf4Lc2nJv5djKH4zCU',
		})) as typeof task;

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1.0/task/HbQJf4Lc2nJv5djKH4zCU');
		expect(result.comments).toHaveLength(1);
	});
});

describe('tasks.create', () => {
	it('POSTs taskName, not name, which is what the API accepts', async () => {
		respond(task);

		const result = (await invoke(Endpoints.tasksCreate, {
			projectId: 'p1',
			taskName: 'Corsair probe',
		})) as typeof task;

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1.0/task');
		expect(sent.body).toEqual({ projectId: 'p1', taskName: 'Corsair probe' });
		expect(sent.body).not.toHaveProperty('name');
		expect(result.taskId).toBe('HbQJf4Lc2nJv5djKH4zCU');
	});

	it('maps the priority name to the number the API takes', async () => {
		respond(task);

		await invoke(Endpoints.tasksCreate, {
			projectId: 'p1',
			taskName: 'x',
			priority: 'urgent',
		});

		expect((lastRequest().body as { priority?: number }).priority).toBe(1);
	});

	it('sends every optional field it was given', async () => {
		respond(task);

		await invoke(Endpoints.tasksCreate, {
			projectId: 'p1',
			taskName: 'x',
			description: 'details',
			priority: 'low',
			dueDate: '2026-11-30',
			groupId: 'g1',
			taskUsers: ['u1', 'u2'],
			statusId: 's1',
			milestoneId: 7,
			estimateTime: 4,
			files: [
				{
					fileType: 'image/png',
					href: 'https://x/y.png',
					name: 'y.png',
					size: '12 KB',
				},
			],
		});

		expect(lastRequest().body).toEqual({
			projectId: 'p1',
			taskName: 'x',
			description: 'details',
			priority: 4,
			dueDate: '2026-11-30',
			groupId: 'g1',
			taskUsers: ['u1', 'u2'],
			statusId: 's1',
			milestoneId: 7,
			estimateTime: 4,
			files: [
				{
					fileType: 'image/png',
					href: 'https://x/y.png',
					name: 'y.png',
					size: '12 KB',
				},
			],
		});
	});

	it('rejects an unknown priority, an empty name and a bad date', async () => {
		await expect(
			invoke(Endpoints.tasksCreate, {
				projectId: 'p1',
				taskName: 'x',
				priority: 'critical',
			}),
		).rejects.toThrow();
		await expect(
			invoke(Endpoints.tasksCreate, { projectId: 'p1', taskName: '' }),
		).rejects.toThrow();
		await expect(
			invoke(Endpoints.tasksCreate, {
				projectId: 'p1',
				taskName: 'x',
				dueDate: 'tomorrow',
			}),
		).rejects.toThrow(/yyyy-MM-dd/);
	});

	it('rejects a file with a missing field', async () => {
		await expect(
			invoke(Endpoints.tasksCreate, {
				projectId: 'p1',
				taskName: 'x',
				files: [
					{ fileType: 'image/png', href: 'https://x/y.png', name: 'y.png' },
				],
			}),
		).rejects.toThrow();
	});
});

describe('resource-scoped 403s reach the caller as missing resources', () => {
	it('reports a 403 on a task read as a missing task, not a bad key', async () => {
		respond('"Invalid API key!!!"', 403);

		const error = (await captureError(
			invoke(Endpoints.tasksGet, { taskId: 'nope' }),
		)) as Error;

		expect(error.message).toContain('does not exist');
	});
});
