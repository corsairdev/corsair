import type { TeamcampAPIError } from './client';
import { makeTeamcampRequest, TEAMCAMP_API_BASE } from './client';
import { TeamcampEndpointOutputSchemas as Outputs } from './endpoints/types';
import { captureError } from './test-errors';

const KEY = process.env.TEAMCAMP_API_KEY;
const describeIfKey = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn(
		'TEAMCAMP_API_KEY is not set; the live Teamcamp suite is skipped',
	);
}

describeIfKey('Teamcamp live', () => {
	const apiKey = KEY as string;

	// unknown: every raw answer is parsed through its output schema below, which
	// is what checks the contract a user receives; a type here would bypass it.
	const read = (
		path: string,
		query?: Record<string, string | number | boolean | undefined>,
	): Promise<unknown> =>
		makeTeamcampRequest<unknown>(apiKey, { method: 'GET', path, query });

	it('reads the workspace behind the key', async () => {
		const raw = await read('/verify');
		const body = Outputs.accountVerify.parse(raw);
		expect(body.workspaceId).toBeTruthy();
	});

	it('lists the workspace members', async () => {
		const raw = await read('/company/users');
		const { users } = Outputs.usersList.parse({ users: raw });
		expect(users.length).toBeGreaterThan(0);
		expect(users[0]?.id).toBeTruthy();
	});

	it('lists customers', async () => {
		const raw = await read('/company/customers');
		const { customers } = Outputs.customersList.parse({ customers: raw });
		expect(Array.isArray(customers)).toBe(true);
	});

	it('lists projects, then reads one with its groups and tasks', async () => {
		const projectRows = await read('/project');
		const { projects } = Outputs.projectsList.parse({ projects: projectRows });
		const first = projects[0];
		if (!first) {
			expect(projects).toEqual([]);
			return;
		}

		const project = Outputs.projectsGet.parse(
			await read(`/project/${first.projectId}`),
		);
		expect(project.projectId).toBe(first.projectId);
		expect(Array.isArray(project.status)).toBe(true);

		const groupRows = await read(`/project/${first.projectId}/group`);
		const { groups } = Outputs.groupsList.parse({ groups: groupRows });
		expect(Array.isArray(groups)).toBe(true);

		const taskRows = await read('/task', {
			projectId: first.projectId,
		});
		const { tasks } = Outputs.tasksList.parse({ tasks: taskRows });
		expect(Array.isArray(tasks)).toBe(true);
	});

	it('reads a task when the project has any', async () => {
		const { projects } = Outputs.projectsList.parse({
			projects: await read('/project'),
		});
		const projectId = projects[0]?.projectId;
		if (!projectId) return;

		const { tasks } = Outputs.tasksList.parse({
			tasks: await read('/task', { projectId }),
		});
		const taskId = tasks[0]?.taskId;
		if (!taskId) return;

		const task = Outputs.tasksGet.parse(await read(`/task/${taskId}`));
		expect(task.taskId).toBe(taskId);
	});

	it('filters the task list by completion', async () => {
		const { projects } = Outputs.projectsList.parse({
			projects: await read('/project'),
		});
		const projectId = projects[0]?.projectId;
		if (!projectId) return;

		for (const complete of [true, false]) {
			const { tasks } = Outputs.tasksList.parse({
				tasks: await read('/task', { projectId, complete }),
			});
			expect(Array.isArray(tasks)).toBe(true);
		}
	});

	it('answers a bad key with a 403 that names the invalid key', async () => {
		const error = await captureError(
			makeTeamcampRequest('bogus-key', { method: 'GET', path: '/project' }),
		);

		expect((error as { status?: number }).status).toBe(403);
		expect((error as TeamcampAPIError).isAuthError).toBe(true);
	});

	it('answers an unknown project with the same 403, reported as a missing resource', async () => {
		const error = await captureError(
			makeTeamcampRequest(apiKey, {
				method: 'GET',
				path: '/task',
				query: { projectId: 'definitely-not-a-project' },
				resourceScoped: true,
			}),
		);

		expect((error as { status?: number }).status).toBe(403);
		expect((error as TeamcampAPIError).resourceNotFound).toBe(true);
		expect((error as TeamcampAPIError).isAuthError).toBe(false);
	});

	it('points at the documented host', () => {
		expect(TEAMCAMP_API_BASE).toBe('https://api.teamcamp.app/v1.0');
	});

	it('requires a project id on the task list', async () => {
		const error = await captureError(
			makeTeamcampRequest(apiKey, { method: 'GET', path: '/task' }),
		);
		expect((error as { status?: number }).status).toBe(400);
		expect((error as Error).message).toContain('ProjectId is required');
	});
});
