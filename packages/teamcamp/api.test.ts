import type { TeamcampAPIError } from './client';
import { makeTeamcampRequest, TEAMCAMP_API_BASE } from './client';
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

	it('reads the workspace behind the key', async () => {
		const body = await makeTeamcampRequest<{
			workspaceId: string;
			workspaceName?: string | null;
		}>(apiKey, { method: 'GET', path: '/verify' });

		expect(body.workspaceId).toBeTruthy();
	});

	it('lists the workspace members', async () => {
		const users = await makeTeamcampRequest<{ id: string; email?: string }[]>(
			apiKey,
			{ method: 'GET', path: '/company/users' },
		);

		expect(Array.isArray(users)).toBe(true);
		if (users[0]) expect(users[0].id).toBeTruthy();
	});

	it('lists customers', async () => {
		const customers = await makeTeamcampRequest<
			{ id?: string; taskId?: string }[]
		>(apiKey, {
			method: 'GET',
			path: '/company/customers',
		});
		expect(Array.isArray(customers)).toBe(true);
	});

	it('lists projects, then reads one with its groups and tasks', async () => {
		const projects = await makeTeamcampRequest<{ projectId: string }[]>(
			apiKey,
			{
				method: 'GET',
				path: '/project',
			},
		);
		expect(Array.isArray(projects)).toBe(true);

		const first = projects[0];
		if (!first) {
			expect(projects).toEqual([]);
			return;
		}

		const project = await makeTeamcampRequest<{
			projectId: string;
			status?: { _id?: string | null; Name?: string | null }[];
		}>(apiKey, { method: 'GET', path: `/project/${first.projectId}` });
		expect(project.projectId).toBe(first.projectId);
		expect(Array.isArray(project.status)).toBe(true);

		const groups = await makeTeamcampRequest<
			{ id?: string; taskId?: string }[]
		>(apiKey, {
			method: 'GET',
			path: `/project/${first.projectId}/group`,
		});
		expect(Array.isArray(groups)).toBe(true);

		const tasks = await makeTeamcampRequest<{ taskId: string }[]>(apiKey, {
			method: 'GET',
			path: '/task',
			query: { projectId: first.projectId },
		});
		expect(Array.isArray(tasks)).toBe(true);
	});

	it('reads a task when the project has any', async () => {
		const projects = await makeTeamcampRequest<{ projectId: string }[]>(
			apiKey,
			{
				method: 'GET',
				path: '/project',
			},
		);
		const projectId = projects[0]?.projectId;
		if (!projectId) return;

		const tasks = await makeTeamcampRequest<{ taskId: string }[]>(apiKey, {
			method: 'GET',
			path: '/task',
			query: { projectId },
		});
		const taskId = tasks[0]?.taskId;
		if (!taskId) return;

		const task = await makeTeamcampRequest<{ taskId: string }>(apiKey, {
			method: 'GET',
			path: `/task/${taskId}`,
		});
		expect(task.taskId).toBe(taskId);
	});

	it('filters the task list by completion', async () => {
		const projects = await makeTeamcampRequest<{ projectId: string }[]>(
			apiKey,
			{
				method: 'GET',
				path: '/project',
			},
		);
		const projectId = projects[0]?.projectId;
		if (!projectId) return;

		for (const complete of [true, false]) {
			const tasks = await makeTeamcampRequest<
				{ id?: string; taskId?: string }[]
			>(apiKey, {
				method: 'GET',
				path: '/task',
				query: { projectId, complete },
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

	it('requires a project id on the task list', async () => {
		const error = await captureError(
			makeTeamcampRequest(apiKey, { method: 'GET', path: '/task' }),
		);
		expect((error as { status?: number }).status).toBe(400);
		expect((error as Error).message).toContain('ProjectId is required');
	});

	it('points at the documented host', () => {
		expect(TEAMCAMP_API_BASE).toBe('https://api.teamcamp.app/v1.0');
	});
});
