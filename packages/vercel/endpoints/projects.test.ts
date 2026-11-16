import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import {
	createProject,
	deleteProject,
	getProject,
	getProjectMembers,
	getProjects,
	pauseProject,
	promoteDeployment,
	rollbackDeployment,
	unpauseProject,
	updateProject,
} from './projects';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedVercelRequest: jest.fn(),
}));

const request = makeAuthenticatedVercelRequest as jest.MockedFunction<
	typeof makeAuthenticatedVercelRequest
>;
const logEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const upsert = jest.fn();
const remove = jest.fn();
const ctx = {
	key: 'test-token',
	options: {},
	db: { projects: { upsertByEntityId: upsert, deleteByEntityId: remove } },
} as unknown as VercelContext;

const project = {
	id: 'prj_1',
	name: 'site',
	accountId: 'team_1',
	createdAt: 1,
	updatedAt: 2,
	framework: null,
	env: [{ key: 'SECRET', value: 'shh' }],
	somethingNew: { added: 'by vercel' },
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('projects', () => {
	it('getProjects sends filters as query, keeps new fields, stores projects without env', async () => {
		request.mockResolvedValueOnce({
			projects: [project],
			pagination: { count: 1, next: 99, prev: null },
		});

		const result = await getProjects(ctx, {
			limit: 2,
			search: 'site',
			teamId: 'team_1',
		});

		expect(request).toHaveBeenCalledWith('/v10/projects', ctx, {
			teamId: 'team_1',
			query: { limit: 2, search: 'site' },
		});
		expect(result.projects[0]?.somethingNew).toEqual({ added: 'by vercel' });
		expect(result.pagination?.next).toBe(99);
		expect(upsert).toHaveBeenCalledWith(
			'prj_1',
			expect.not.objectContaining({ env: expect.anything() }),
		);
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.projects.getProjects',
			expect.objectContaining({ search: 'site' }),
			'completed',
		);
	});

	it('getProject encodes the name and tolerates null fields', async () => {
		request.mockResolvedValueOnce({
			...project,
			nodeVersion: null,
			link: null,
		});
		const result = await getProject(ctx, { idOrName: 'my site' });
		expect(request).toHaveBeenCalledWith('/v9/projects/my%20site', ctx, {
			teamId: undefined,
			query: {},
		});
		expect(result.id).toBe('prj_1');
	});

	it('getProject rejects a response without an id', async () => {
		request.mockResolvedValueOnce({ name: 'no id' });
		await expect(getProject(ctx, { idOrName: 'x' })).rejects.toThrow();
	});

	it('createProject posts the settings and keeps env values out of the event', async () => {
		request.mockResolvedValueOnce(project);
		await createProject(ctx, {
			name: 'site',
			framework: 'nextjs',
			environmentVariables: [
				{ key: 'API_KEY', value: 'secret-value', target: ['production'] },
			],
		});
		expect(request).toHaveBeenCalledWith('/v11/projects', ctx, {
			method: 'POST',
			teamId: undefined,
			body: {
				name: 'site',
				framework: 'nextjs',
				environmentVariables: [
					{ key: 'API_KEY', value: 'secret-value', target: ['production'] },
				],
			},
		});
		const logged = JSON.stringify(logEvent.mock.calls[0]?.[2]);
		expect(logged).toContain('API_KEY');
		expect(logged).not.toContain('secret-value');
	});

	it('createProject validates input before calling Vercel', async () => {
		await expect(
			createProject(ctx, { name: '' } as Parameters<typeof createProject>[1]),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('updateProject patches only the given fields', async () => {
		request.mockResolvedValueOnce(project);
		await updateProject(ctx, {
			idOrName: 'prj_1',
			buildCommand: 'pnpm build',
			nodeVersion: '22.x',
		});
		expect(request).toHaveBeenCalledWith('/v9/projects/prj_1', ctx, {
			method: 'PATCH',
			teamId: undefined,
			body: { buildCommand: 'pnpm build', nodeVersion: '22.x' },
		});
	});

	it('deleteProject reports the deletion after a 204', async () => {
		request.mockResolvedValueOnce(undefined);
		await expect(deleteProject(ctx, { idOrName: 'prj_1' })).resolves.toEqual({
			deleted: true,
			idOrName: 'prj_1',
		});
		expect(request).toHaveBeenCalledWith('/v9/projects/prj_1', ctx, {
			method: 'DELETE',
			teamId: undefined,
		});
		expect(remove).toHaveBeenCalledWith('prj_1');
	});

	it('deleteProject by name looks up the id so the local record is cleared too', async () => {
		request
			.mockResolvedValueOnce({ id: 'prj_9', name: 'site' })
			.mockResolvedValueOnce(undefined);
		await deleteProject(ctx, { idOrName: 'site' });
		expect(request).toHaveBeenNthCalledWith(1, '/v9/projects/site', ctx, {
			teamId: undefined,
		});
		expect(request).toHaveBeenNthCalledWith(2, '/v9/projects/prj_9', ctx, {
			method: 'DELETE',
			teamId: undefined,
		});
		expect(remove).toHaveBeenCalledWith('prj_9');
	});

	it('deleteProject leaves the local record alone when Vercel refuses', async () => {
		request.mockRejectedValueOnce(new Error('Forbidden'));
		await expect(deleteProject(ctx, { idOrName: 'prj_1' })).rejects.toThrow();
		expect(remove).not.toHaveBeenCalled();
	});

	it('pause and unpause post to their routes', async () => {
		request.mockResolvedValue(undefined);
		await expect(pauseProject(ctx, { projectId: 'prj_1' })).resolves.toEqual({
			projectId: 'prj_1',
			paused: true,
		});
		await expect(unpauseProject(ctx, { projectId: 'prj_1' })).resolves.toEqual({
			projectId: 'prj_1',
			paused: false,
		});
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/v1/projects/prj_1/pause',
			ctx,
			{
				method: 'POST',
				teamId: undefined,
			},
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			'/v1/projects/prj_1/unpause',
			ctx,
			{ method: 'POST', teamId: undefined },
		);
	});

	it('promote and rollback target the deployment', async () => {
		request.mockResolvedValue(undefined);
		await promoteDeployment(ctx, { projectId: 'prj_1', deploymentId: 'dpl_2' });
		await rollbackDeployment(ctx, {
			projectId: 'prj_1',
			deploymentId: 'dpl_1',
			description: 'bad deploy',
		});
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/v10/projects/prj_1/promote/dpl_2',
			ctx,
			{ method: 'POST', teamId: undefined },
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			'/v1/projects/prj_1/rollback/dpl_1',
			ctx,
			{
				method: 'POST',
				teamId: undefined,
				query: { description: 'bad deploy' },
			},
		);
	});

	it('getProjectMembers lists members with pagination', async () => {
		request.mockResolvedValueOnce({
			members: [{ uid: 'u1', email: null, role: 'MEMBER' }],
			pagination: { count: 1, next: null, prev: null },
		});
		const result = await getProjectMembers(ctx, {
			idOrName: 'prj_1',
			limit: 10,
		});
		expect(request).toHaveBeenCalledWith('/v1/projects/prj_1/members', ctx, {
			teamId: undefined,
			query: { limit: 10 },
		});
		expect(result.members?.[0]?.uid).toBe('u1');
	});
});

describe('projects event payloads', () => {
	beforeEach(() => jest.clearAllMocks());

	it('masks command strings, which can carry registry tokens', async () => {
		request.mockResolvedValue(project);
		await updateProject(ctx, {
			idOrName: 'prj_1',
			installCommand:
				'npm config set //registry.example.com/:_authToken=npm_SECRET && npm i',
			outputDirectory: 'dist',
		});
		await createProject(ctx, {
			name: 'site',
			buildCommand: 'TOKEN=build_SECRET pnpm build',
			commandForIgnoringBuildStep:
				'curl -H "Authorization: Bearer ignore_SECRET" x',
		});
		const logged = JSON.stringify(logEvent.mock.calls.map((call) => call[2]));
		expect(logged).not.toContain('SECRET');
		expect(logged).toContain('[redacted]');
		expect(logged).toContain('dist');
	});

	it('getProjectMembers keeps the search term out of the event but sends it to Vercel', async () => {
		request.mockResolvedValueOnce({ members: [] });
		await getProjectMembers(ctx, {
			idOrName: 'prj_1',
			search: 'person@example.com',
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/projects/prj_1/members',
			ctx,
			expect.objectContaining({ query: { search: 'person@example.com' } }),
		);
		expect(JSON.stringify(logEvent.mock.calls[0]?.[2])).not.toContain(
			'person@example.com',
		);
	});
});
