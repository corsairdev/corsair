import { makeRenderRequest } from './client';
import {
	cancelDeploy,
	cancelServiceJob,
	cancelTaskRun,
	createBuildSource,
	createDedicatedIp,
	createDisk,
	createPostgresExport,
	createPostgresUser,
	createServiceJob,
	createTaskRun,
	createWebhook,
	createWorkflow,
	createWorkflowVersion,
	deleteBuildSource,
	deleteBuildSourceEnvVar,
	deleteBuildSourceSecretFile,
	deleteDedicatedIp,
	deleteDisk,
	deletePostgres,
	deletePostgresUser,
	deleteService,
	deleteWebhook,
	deleteWorkflow,
	failoverPostgres,
	getUser,
	linkEnvGroupToBuildSource,
	listBlueprintSyncs,
	listBlueprints,
	listBuildSourceBuilds,
	listBuildSourceEnvVars,
	listBuildSourceSecretFiles,
	listBuildSources,
	listDedicatedIps,
	listDeploys,
	listDiskSnapshots,
	listDisks,
	listEnvironments,
	listOrganizationAuditLogs,
	listOwnerAuditLogs,
	listOwners,
	listPostgresProcesses,
	listPostgresSizes,
	listPostgresTableScans,
	listPostgresTopQueries,
	listProjects,
	listRoutes,
	listServices,
	purgeServiceCache,
	recoverPostgres,
	restartPostgres,
	restoreDiskSnapshot,
	resumeKeyValue,
	resumePostgres,
	retrieveBlueprint,
	retrieveBuildSource,
	retrieveBuildSourceBuild,
	retrieveBuildSourceEnvVar,
	retrieveBuildSourceSecretFile,
	retrieveDedicatedIp,
	retrieveDisk,
	retrieveEnvironment,
	retrieveKeyValueConnectionInfo,
	retrieveMaintenance,
	retrieveOwner,
	retrievePostgresConnectionInfo,
	retrievePostgresRecoveryInfo,
	retrieveProject,
	retrieveService,
	retrieveTask,
	retrieveTaskRun,
	retrieveWebhook,
	retrieveWorkflow,
	retrieveWorkflowVersion,
	rollbackDeploy,
	suspendKeyValue,
	suspendPostgres,
	triggerBuildSourceBuild,
	triggerCronJobRun,
	triggerDeploy,
	triggerMaintenance,
	unlinkEnvGroupFromBuildSource,
	updateBlueprint,
	updateBuildSource,
	updateBuildSourceEnvVar,
	updateBuildSourceEnvVars,
	updateBuildSourceSecretFile,
	updateBuildSourceSecretFiles,
	updateDedicatedIp,
	updateDisk,
	updateMaintenance,
	updateOwnerLogStream,
	updateRoutes,
	updateWebhook,
	updateWorkflow,
	validateBlueprint,
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

	it('serializes Render service filters as comma-separated query values', async () => {
		await listServices(
			{
				key: 'secret',
				$getAccountId: jest.fn().mockResolvedValue('account-1'),
			} as never,
			{
				name: ['api', 'worker'],
				env: ['node', 'python'],
				region: ['oregon', 'frankfurt'],
			},
		);

		expect(request).toHaveBeenCalledWith('/v1/services', 'secret', {
			method: 'GET',
			query: {
				name: 'api,worker',
				env: 'node,python',
				region: 'oregon,frankfurt',
			},
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

	it('covers Build Source routes with exact methods, paths, and bodies', async () => {
		request.mockResolvedValue({});
		const ctx = { key: 'secret' } as never;
		const id = { buildSourceId: 'bs-1' };
		const key = { ...id, envVarKey: 'TOKEN' };
		await createBuildSource(ctx, { ownerId: 'own-1', name: 'shared-build' });
		await listBuildSources(ctx, { ownerId: 'own-1' });
		await retrieveBuildSource(ctx, id);
		await updateBuildSource(ctx, { ...id, body: { name: 'renamed' } });
		await deleteBuildSource(ctx, id);
		await listBuildSourceBuilds(ctx, id);
		await triggerBuildSourceBuild(ctx, id);
		await retrieveBuildSourceBuild(ctx, { ...id, buildId: 'build-1' });
		await listBuildSourceEnvVars(ctx, id);
		await updateBuildSourceEnvVars(ctx, {
			...id,
			body: [{ key: 'A', value: 'B' }],
		});
		await retrieveBuildSourceEnvVar(ctx, key);
		await updateBuildSourceEnvVar(ctx, { ...key, body: { value: 'next' } });
		await deleteBuildSourceEnvVar(ctx, key);
		await listBuildSourceSecretFiles(ctx, id);
		await updateBuildSourceSecretFiles(ctx, {
			...id,
			body: [{ name: 'config', content: 'x' }],
		});
		await retrieveBuildSourceSecretFile(ctx, key);
		await updateBuildSourceSecretFile(ctx, {
			...key,
			body: { content: 'next' },
		});
		await deleteBuildSourceSecretFile(ctx, key);
		await linkEnvGroupToBuildSource(ctx, { ...id, envGroupId: 'eg-1' });
		await unlinkEnvGroupFromBuildSource(ctx, { ...id, envGroupId: 'eg-1' });

		expect(request).toHaveBeenCalledWith('/v1/build-sources', 'secret', {
			method: 'POST',
			body: { ownerId: 'own-1', name: 'shared-build' },
		});
		expect(request).toHaveBeenCalledWith('/v1/build-sources', 'secret', {
			method: 'GET',
			query: { ownerId: 'own-1' },
		});
		expect(request).toHaveBeenCalledWith('/v1/build-sources/bs-1', 'secret', {
			method: 'PATCH',
			body: { name: 'renamed' },
		});
		expect(request).toHaveBeenCalledWith('/v1/build-sources/bs-1', 'secret', {
			method: 'DELETE',
			body: undefined,
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/build-sources/bs-1/builds/build-1',
			'secret',
			{
				method: 'GET',
				query: {},
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/build-sources/bs-1/env-vars',
			'secret',
			{
				method: 'PUT',
				body: [{ key: 'A', value: 'B' }],
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/build-sources/bs-1/env-vars/TOKEN',
			'secret',
			{
				method: 'PUT',
				body: { value: 'next' },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/build-sources/bs-1/secret-files',
			'secret',
			{
				method: 'PUT',
				body: [{ name: 'config', content: 'x' }],
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/build-sources/bs-1/secret-files/TOKEN',
			'secret',
			{
				method: 'DELETE',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/build-sources/bs-1/env-groups/eg-1',
			'secret',
			{
				method: 'POST',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/build-sources/bs-1/env-groups/eg-1',
			'secret',
			{
				method: 'DELETE',
				body: undefined,
			},
		);
	});

	it('covers Blueprint, Dedicated IP, Postgres, and workflow task routes', async () => {
		request.mockResolvedValue({});
		const ctx = { key: 'secret' } as never;
		await validateBlueprint(ctx, { ownerId: 'own-1', blueprint: {} });
		await retrieveBlueprint(ctx, { id: 'bp-1' });
		await updateBlueprint(ctx, { id: 'bp-1', body: { name: 'updated' } });
		await listDedicatedIps(ctx, {});
		await createDedicatedIp(ctx, { ownerId: 'own-1', name: 'egress' });
		await retrieveDedicatedIp(ctx, { id: 'ip-1' });
		await updateDedicatedIp(ctx, { id: 'ip-1', body: { name: 'updated' } });
		await deleteDedicatedIp(ctx, { id: 'ip-1' });
		await deletePostgres(ctx, { id: 'pg-1' });
		await createPostgresExport(ctx, { id: 'pg-1' });
		await createPostgresUser(ctx, { id: 'pg-1', body: { username: 'app' } });
		await listPostgresProcesses(ctx, { id: 'pg-1' });
		await listPostgresTopQueries(ctx, { id: 'pg-1' });
		await listPostgresSizes(ctx, { id: 'pg-1' });
		await listPostgresTableScans(ctx, { id: 'pg-1' });
		await createWorkflow(ctx, { ownerId: 'own-1', name: 'flow' });
		await retrieveWorkflow(ctx, { id: 'wf-1' });
		await updateWorkflow(ctx, { id: 'wf-1', body: { name: 'updated' } });
		await deleteWorkflow(ctx, { id: 'wf-1' });
		await createWorkflowVersion(ctx, { workflowId: 'wf-1' });
		await retrieveWorkflowVersion(ctx, { id: 'wv-1' });
		await retrieveTask(ctx, { id: 'task-1' });
		await createTaskRun(ctx, { taskId: 'task-1' });
		await retrieveTaskRun(ctx, { id: 'run-1' });
		await cancelTaskRun(ctx, { id: 'run-1' });

		for (const [path, method, body] of [
			['/v1/blueprints/validate', 'POST', { ownerId: 'own-1', blueprint: {} }],
			['/v1/blueprints/bp-1', 'GET', undefined],
			['/v1/blueprints/bp-1', 'PATCH', { name: 'updated' }],
			['/v1/dedicated-ips', 'GET', undefined],
			['/v1/dedicated-ips', 'POST', { ownerId: 'own-1', name: 'egress' }],
			['/v1/dedicated-ips/ip-1', 'GET', undefined],
			['/v1/dedicated-ips/ip-1', 'PATCH', { name: 'updated' }],
			['/v1/dedicated-ips/ip-1', 'DELETE', undefined],
			['/v1/postgres/pg-1', 'DELETE', undefined],
			['/v1/postgres/pg-1/export', 'POST', undefined],
			['/v1/postgres/pg-1/credentials', 'POST', { username: 'app' }],
			['/v1/postgres/pg-1/query/processes', 'GET', undefined],
			['/v1/postgres/pg-1/query/top-queries', 'GET', undefined],
			['/v1/postgres/pg-1/query/sizes', 'GET', undefined],
			['/v1/postgres/pg-1/query/table-scans', 'GET', undefined],
			['/v1/workflows', 'POST', { ownerId: 'own-1', name: 'flow' }],
			['/v1/workflows/wf-1', 'GET', undefined],
			['/v1/workflows/wf-1', 'PATCH', { name: 'updated' }],
			['/v1/workflows/wf-1', 'DELETE', undefined],
			['/v1/workflowversions', 'POST', { workflowId: 'wf-1' }],
			['/v1/workflowversions/wv-1', 'GET', undefined],
			['/v1/tasks/task-1', 'GET', undefined],
			['/v1/task-runs', 'POST', { taskId: 'task-1' }],
			['/v1/task-runs/run-1', 'GET', undefined],
			['/v1/task-runs/run-1', 'DELETE', undefined],
		] as const) {
			expect(request).toHaveBeenCalledWith(
				path,
				'secret',
				method === 'GET' ? { method, query: {} } : { method, body },
			);
		}
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
		await listBlueprintSyncs(ctx, { id: 'bp-1', limit: 10 });

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
		expect(request).toHaveBeenCalledWith(
			'/v1/blueprints/bp-1/syncs',
			'secret',
			{
				method: 'GET',
				query: { limit: 10 },
			},
		);
	});

	it('lists owner and organization audit logs with time filters', async () => {
		request.mockResolvedValue([]);
		const ctx = { key: 'secret' } as never;
		await listOwnerAuditLogs(ctx, {
			id: 'usr-1',
			startTime: '2026-10-01T00:00:00.000Z',
		});
		await listOrganizationAuditLogs(ctx, { id: 'org-1' });

		expect(request).toHaveBeenCalledWith(
			'/v1/owners/usr-1/audit-logs',
			'secret',
			{
				method: 'GET',
				query: { startTime: '2026-10-01T00:00:00.000Z' },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/organizations/org-1/audit-logs',
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
});
