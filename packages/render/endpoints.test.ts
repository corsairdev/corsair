import { makeRenderRequest } from './client';
import {
	deleteService,
	getUser,
	listBlueprints,
	listDeploys,
	listDisks,
	listEnvironments,
	listOwners,
	listProjects,
	listRoutes,
	listServices,
	retrieveEnvironment,
	retrieveOwner,
	retrieveProject,
	retrieveService,
	streamTaskRunsEvents,
	triggerDeploy,
	updateOwnerLogStream,
	updateRoutes,
} from './endpoints';

jest.mock('./client', () => ({
	makeRenderRequest: jest.fn(),
}));

const request = jest.mocked(makeRenderRequest);

describe('Render service endpoints', () => {
	beforeEach(() => {
		request.mockClear();
		request.mockResolvedValue([
			{
				service: {
					id: 'srv-1',
					name: 'demo',
					type: 'web_service',
					ownerId: 'usr-1',
				},
			},
		]);
	});

	it('lists services with the current Render pagination endpoint', async () => {
		const result = await listServices(
			{
				key: 'secret',
				options: {},
				$getAccountId: jest.fn().mockResolvedValue('account-1'),
			} as never,
			{ limit: 20, cursor: 'next' },
		);

		expect(result[0]?.service.id).toBe('srv-1');
		expect(request).toHaveBeenCalledWith('/v1/services', 'secret', {
			method: 'GET',
			query: { limit: 20, cursor: 'next' },
		});
	});

	it('covers the resource, observability, metrics, automation, and final groups', async () => {
		const ctx = { key: 'secret' } as never;
		await listEnvironments(ctx, {});
		await listProjects(ctx, {});
		await listOwners(ctx, {});
		await listDisks(ctx, {});
		await listBlueprints(ctx, {});

		expect(request).toHaveBeenCalledWith('/v1/environments', 'secret', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith('/v1/projects', 'secret', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith('/v1/owners', 'secret', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith('/v1/disks', 'secret', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith('/v1/blueprints', 'secret', {
			method: 'GET',
			query: {},
		});
	});

	it('uses the documented current-user route', async () => {
		await getUser({ key: 'secret' } as never, {});
		expect(request).toHaveBeenCalledWith('/v1/users', 'secret', {
			method: 'GET',
			query: {},
		});
	});

	it('routes route updates to the current Render endpoint', async () => {
		request.mockResolvedValue({});
		await updateRoutes(
			{
				key: 'secret',
				options: {},
				$getAccountId: jest.fn().mockResolvedValue('account-1'),
			} as never,
			{ id: 'srv-1', body: [] },
		);

		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/routes',
			'secret',
			{
				method: 'PUT',
				body: [],
			},
		);
	});

	it('asserts service retrieve, deploy, and delete requests', async () => {
		request.mockResolvedValue({});
		await retrieveService({ key: 'secret' } as never, {
			serviceId: 'srv-1',
		});
		expect(request).toHaveBeenCalledWith('/v1/services/srv-1', 'secret', {
			method: 'GET',
			body: undefined,
		});

		await triggerDeploy(
			{ key: 'secret' } as never,
			{
				serviceId: 'srv-1',
				commitId: 'commit-1',
				clearCache: 'clear',
				imageUrl: 'https://example.test/image.tar',
				deployMode: 'deploy_only',
			} as never,
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/deploys',
			'secret',
			{
				method: 'POST',
				body: {
					commitId: 'commit-1',
					clearCache: 'clear',
					imageUrl: 'https://example.test/image.tar',
					deployMode: 'deploy_only',
				},
			},
		);

		await deleteService({ key: 'secret' } as never, { serviceId: 'srv-1' });
		expect(request).toHaveBeenCalledWith('/v1/services/srv-1', 'secret', {
			method: 'DELETE',
			body: undefined,
		});
	});

	it('lists deployments using the documented service route', async () => {
		request.mockResolvedValue([]);
		await listDeploys({ key: 'secret' } as never, {
			serviceId: 'srv-1',
			status: ['live'],
			limit: 10,
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/deploys',
			'secret',
			{ method: 'GET', query: { status: ['live'], limit: 10 } },
		);
	});

	it('rejects missing and unsafe final-route identifiers', async () => {
		expect(() => listRoutes({ key: 'secret' } as never, {})).toThrow(
			'Invalid Render id',
		);
		expect(() =>
			listRoutes({ key: 'secret' } as never, { id: '../services' }),
		).toThrow('Invalid Render id');
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects missing identifiers in every path-based adapter family', async () => {
		expect(() => retrieveEnvironment({ key: 'secret' } as never, {})).toThrow(
			'Invalid Render id',
		);
		expect(() => retrieveProject({ key: 'secret' } as never, {})).toThrow(
			'Invalid Render id',
		);
		expect(() => retrieveOwner({ key: 'secret' } as never, {})).toThrow(
			'Invalid Render id',
		);
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects service IDs that can escape the service path', async () => {
		await expect(
			deleteService({ key: 'secret' } as never, {
				serviceId: '../registrycredentials/credential-id',
			}),
		).rejects.toThrow('Invalid Render service ID');
		expect(request).not.toHaveBeenCalled();
	});

	it('sends owner log stream updates as a request body', async () => {
		request.mockResolvedValue({});
		await updateOwnerLogStream({ key: 'secret' } as never, {
			id: 'stream-1',
			url: 'https://logs.example.test',
			labels: ['app'],
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/logs/streams/owner/stream-1',
			'secret',
			expect.objectContaining({
				method: 'PUT',
				body: { url: 'https://logs.example.test', labels: ['app'] },
			}),
		);
	});

	it('requests task-run events as an SSE stream', async () => {
		request.mockResolvedValue('event: task.completed\ndata: {}\n\n');
		await expect(
			streamTaskRunsEvents({ key: 'secret' } as never, {
				taskRunIds: ['trn-1'],
			}),
		).resolves.toEqual({ data: 'event: task.completed\ndata: {}\n\n' });
		expect(request).toHaveBeenCalledWith('/v1/task-runs/events', 'secret', {
			method: 'GET',
			query: { taskRunIds: ['trn-1'] },
			headers: { Accept: 'text/event-stream' },
			mediaType: 'text/event-stream',
		});
	});
});
