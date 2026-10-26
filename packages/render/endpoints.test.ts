import { makeRenderRequest } from './client';
import {
	cancelDeploy,
	cancelServiceJob,
	createDisk,
	createServiceJob,
	createWebhook,
	deleteDisk,
	deletePostgresUser,
	deleteService,
	deleteWebhook,
	failoverPostgres,
	getUser,
	listBlueprints,
	listDeploys,
	listDiskSnapshots,
	listDisks,
	listEnvironments,
	listOwners,
	listProjects,
	listRoutes,
	listServices,
	purgeServiceCache,
	recoverPostgres,
	restartPostgres,
	restoreDiskSnapshot,
	resumeKeyValue,
	resumePostgres,
	retrieveDisk,
	retrieveEnvironment,
	retrieveKeyValueConnectionInfo,
	retrieveMaintenance,
	retrieveOwner,
	retrievePostgresConnectionInfo,
	retrievePostgresRecoveryInfo,
	retrieveProject,
	retrieveService,
	retrieveWebhook,
	rollbackDeploy,
	streamTaskRunsEvents,
	suspendKeyValue,
	suspendPostgres,
	triggerCronJobRun,
	triggerDeploy,
	triggerMaintenance,
	updateDisk,
	updateMaintenance,
	updateOwnerLogStream,
	updateRoutes,
	updateWebhook,
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

	it('routes service lifecycle operations to the current Render paths', async () => {
		request.mockResolvedValue({});
		await purgeServiceCache({ key: 'secret' } as never, {
			serviceId: 'srv-1',
		});
		await cancelDeploy({ key: 'secret' } as never, {
			serviceId: 'srv-1',
			deployId: 'dep-1',
		});
		await rollbackDeploy({ key: 'secret' } as never, {
			serviceId: 'srv-1',
			deployId: 'dep-1',
		});

		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/cache/purge',
			'secret',
			{
				method: 'POST',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/deploys/dep-1/cancel',
			'secret',
			{ method: 'POST', body: undefined },
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/rollback',
			'secret',
			{
				method: 'POST',
				body: { deployId: 'dep-1' },
			},
		);
	});

	it('creates and cancels service jobs on the documented routes', async () => {
		request.mockResolvedValue({});
		await createServiceJob({ key: 'secret' } as never, {
			serviceId: 'srv-1',
			startCommand: 'npm test',
			planId: 'plan-1',
		});
		await cancelServiceJob({ key: 'secret' } as never, {
			serviceId: 'srv-1',
			jobId: 'job-1',
		});

		expect(request).toHaveBeenCalledWith('/v1/services/srv-1/jobs', 'secret', {
			method: 'POST',
			body: { startCommand: 'npm test', planId: 'plan-1' },
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/jobs/job-1/cancel',
			'secret',
			{ method: 'POST', body: undefined },
		);
	});

	it('covers the disk lifecycle on the current Render disk routes', async () => {
		request.mockResolvedValue({});
		const ctx = { key: 'secret' } as never;
		await createDisk(ctx, {
			name: 'data',
			sizeGB: 5,
			mountPath: '/data',
			serviceId: 'srv-1',
		});
		await retrieveDisk(ctx, { id: 'disk-1' });
		await updateDisk(ctx, { id: 'disk-1', sizeGB: 10 });
		await deleteDisk(ctx, { id: 'disk-1' });
		await listDiskSnapshots(ctx, { id: 'disk-1' });
		await restoreDiskSnapshot(ctx, { id: 'disk-1', snapshotKey: 'snap-1' });

		expect(request).toHaveBeenCalledWith('/v1/disks', 'secret', {
			method: 'POST',
			body: { name: 'data', sizeGB: 5, mountPath: '/data', serviceId: 'srv-1' },
		});
		expect(request).toHaveBeenCalledWith('/v1/disks/disk-1', 'secret', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith('/v1/disks/disk-1', 'secret', {
			method: 'PATCH',
			body: { sizeGB: 10 },
		});
		expect(request).toHaveBeenCalledWith('/v1/disks/disk-1', 'secret', {
			method: 'DELETE',
			body: undefined,
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/disks/disk-1/snapshots',
			'secret',
			{
				method: 'GET',
				query: {},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/disks/disk-1/snapshots/restore',
			'secret',
			{ method: 'POST', body: { snapshotKey: 'snap-1' } },
		);
	});

	it('manages maintenance runs on the documented routes', async () => {
		request.mockResolvedValue({});
		const ctx = { key: 'secret' } as never;
		await retrieveMaintenance(ctx, { id: 'mnt-1' });
		await updateMaintenance(ctx, {
			id: 'mnt-1',
			scheduledAt: '2026-11-01T00:00:00.000Z',
		});
		await triggerMaintenance(ctx, { id: 'mnt-1' });

		expect(request).toHaveBeenCalledWith('/v1/maintenance/mnt-1', 'secret', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith('/v1/maintenance/mnt-1', 'secret', {
			method: 'PATCH',
			body: { scheduledAt: '2026-11-01T00:00:00.000Z' },
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/maintenance/mnt-1/trigger',
			'secret',
			{ method: 'POST', body: undefined },
		);
	});

	it('covers webhook management on the current webhook routes', async () => {
		request.mockResolvedValue({});
		const ctx = { key: 'secret' } as never;
		await createWebhook(ctx, {
			ownerId: 'usr-1',
			name: 'deploys',
			url: 'https://example.test/hook',
			enabled: true,
			eventFilter: ['deploy.created'],
		});
		await retrieveWebhook(ctx, { id: 'wh-1' });
		await updateWebhook(ctx, { id: 'wh-1', enabled: false });
		await deleteWebhook(ctx, { id: 'wh-1' });

		expect(request).toHaveBeenCalledWith('/v1/webhooks', 'secret', {
			method: 'POST',
			body: {
				ownerId: 'usr-1',
				name: 'deploys',
				url: 'https://example.test/hook',
				enabled: true,
				eventFilter: ['deploy.created'],
			},
		});
		expect(request).toHaveBeenCalledWith('/v1/webhooks/wh-1', 'secret', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith('/v1/webhooks/wh-1', 'secret', {
			method: 'PATCH',
			body: { enabled: false },
		});
		expect(request).toHaveBeenCalledWith('/v1/webhooks/wh-1', 'secret', {
			method: 'DELETE',
			body: undefined,
		});
	});

	it('routes Postgres lifecycle operations to the documented instance routes', async () => {
		request.mockResolvedValue({});
		const ctx = { key: 'secret' } as never;
		await restartPostgres(ctx, { id: 'pg-1' });
		await suspendPostgres(ctx, { id: 'pg-1' });
		await resumePostgres(ctx, { id: 'pg-1' });
		await failoverPostgres(ctx, { id: 'pg-1' });
		await retrievePostgresConnectionInfo(ctx, { id: 'pg-1' });
		await retrievePostgresRecoveryInfo(ctx, { id: 'pg-1' });
		await recoverPostgres(ctx, {
			id: 'pg-1',
			restoreTime: '2026-10-01T00:00:00.000Z',
		});
		await deletePostgresUser(ctx, { id: 'pg-1', username: 'app_user' });

		expect(request).toHaveBeenCalledWith(
			'/v1/postgres/pg-1/restart',
			'secret',
			{
				method: 'POST',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/postgres/pg-1/suspend',
			'secret',
			{
				method: 'POST',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith('/v1/postgres/pg-1/resume', 'secret', {
			method: 'POST',
			body: undefined,
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/postgres/pg-1/failover',
			'secret',
			{
				method: 'POST',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/postgres/pg-1/connection-info',
			'secret',
			{ method: 'GET', query: {} },
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/postgres/pg-1/recovery',
			'secret',
			{
				method: 'GET',
				query: {},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/postgres/pg-1/recovery',
			'secret',
			{
				method: 'POST',
				body: { restoreTime: '2026-10-01T00:00:00.000Z' },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/postgres/pg-1/credentials/app_user',
			'secret',
			{ method: 'DELETE', body: undefined },
		);
	});

	it('covers Key Value lifecycle and blueprint sync routes', async () => {
		request.mockResolvedValue({});
		const ctx = { key: 'secret' } as never;
		await suspendKeyValue(ctx, { id: 'kv-1' });
		await resumeKeyValue(ctx, { id: 'kv-1' });
		await retrieveKeyValueConnectionInfo(ctx, { id: 'kv-1' });

		expect(request).toHaveBeenCalledWith(
			'/v1/key-value/kv-1/suspend',
			'secret',
			{
				method: 'POST',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/key-value/kv-1/resume',
			'secret',
			{
				method: 'POST',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/key-value/kv-1/connection-info',
			'secret',
			{ method: 'GET', query: {} },
		);
	});

	it('triggers a cron job run on the documented route', async () => {
		request.mockResolvedValue({});
		await triggerCronJobRun({ key: 'secret' } as never, { id: 'cron-1' });

		expect(request).toHaveBeenCalledWith(
			'/v1/cron-jobs/cron-1/runs',
			'secret',
			{
				method: 'POST',
				body: undefined,
			},
		);
	});

	it('rejects missing identifiers on the new path-based operations', async () => {
		expect(() => retrieveDisk({ key: 'secret' } as never, {} as never)).toThrow(
			'Invalid Render id',
		);
		expect(() =>
			deletePostgresUser({ key: 'secret' } as never, { id: 'pg-1' } as never),
		).toThrow('Invalid Render username');
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects missing and unsafe final-route identifiers', async () => {
		expect(() => listRoutes({ key: 'secret' } as never, {} as never)).toThrow(
			'Invalid Render id',
		);
		expect(() =>
			listRoutes({ key: 'secret' } as never, { id: '../services' }),
		).toThrow('Invalid Render id');
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects missing identifiers in every path-based adapter family', async () => {
		expect(() =>
			retrieveEnvironment({ key: 'secret' } as never, {} as never),
		).toThrow('Invalid Render id');
		expect(() =>
			retrieveProject({ key: 'secret' } as never, {} as never),
		).toThrow('Invalid Render id');
		expect(() =>
			retrieveOwner({ key: 'secret' } as never, {} as never),
		).toThrow('Invalid Render id');
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
