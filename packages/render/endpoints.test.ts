import { makeRenderRequest } from './client';
import {
	cancelCronJobRun,
	cancelDeploy,
	cancelServiceJob,
	cancelTaskRun,
	createBuildSource,
	createDedicatedIp,
	createDisk,
	createKeyValue,
	createPostgresExport,
	createPostgresUser,
	createService,
	createServiceJob,
	createServicePreview,
	createTaskRun,
	createWebhook,
	createWorkflow,
	createWorkflowVersion,
	deleteAutoscaling,
	deleteBuildSource,
	deleteBuildSourceEnvVar,
	deleteBuildSourceSecretFile,
	deleteDedicatedIp,
	deleteDisk,
	deletePostgres,
	deletePostgresUser,
	deleteProject,
	deleteResourceLogStream,
	deleteService,
	deleteServiceCustomDomain,
	deleteServiceEnvVar,
	deleteServiceHeader,
	deleteServiceRoute,
	deleteWebhook,
	deleteWorkflow,
	failoverPostgres,
	getBandwidth,
	getCpuTarget,
	getHttpLatency,
	getHttpRequests,
	getReplicationLag,
	getTaskRunsCompleted,
	getTaskRunsQueued,
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
	listHttpFilterValues,
	listOrganizationAuditLogs,
	listOwnerAuditLogs,
	listOwners,
	listPathFilterValues,
	listPostgresProcesses,
	listPostgresSizes,
	listPostgresTableScans,
	listPostgresTopQueries,
	listProjects,
	listRoutes,
	listServiceCustomDomains,
	listServiceEnvVars,
	listServiceHeaders,
	listServices,
	listWebhookEvents,
	patchServiceRoute,
	purgeServiceCache,
	recoverPostgres,
	removeResourcesFromEnvironment,
	removeWorkspaceMember,
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
	retrieveEvent,
	retrieveKeyValue,
	retrieveKeyValueConnectionInfo,
	retrieveMaintenance,
	retrieveOwner,
	retrieveOwnerLogStream,
	retrieveOwnerMetricsStream,
	retrievePostgresConnectionInfo,
	retrievePostgresRecoveryInfo,
	retrieveProject,
	retrieveResourceLogStream,
	retrieveService,
	retrieveServiceNotificationOverrides,
	retrieveTask,
	retrieveTaskRun,
	retrieveWebhook,
	retrieveWorkflow,
	retrieveWorkflowVersion,
	rollbackDeploy,
	scaleService,
	suspendKeyValue,
	suspendPostgres,
	triggerBuildSourceBuild,
	triggerCronJobRun,
	triggerDeploy,
	triggerMaintenance,
	unlinkEnvGroupFromBuildSource,
	unlinkServiceFromEnvGroup,
	updateAutoscaling,
	updateBlueprint,
	updateBuildSource,
	updateBuildSourceEnvVar,
	updateBuildSourceEnvVars,
	updateBuildSourceSecretFile,
	updateBuildSourceSecretFiles,
	updateDedicatedIp,
	updateDisk,
	updateKeyValue,
	updateMaintenance,
	updateOwnerLogStream,
	updateRoutes,
	updateServiceNotificationOverrides,
	updateWebhook,
	updateWorkflow,
	updateWorkspaceMember,
	upsertOwnerMetricsStream,
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

	it('creates a Render service with the exact body', async () => {
		const input = { type: 'web_service', name: 'api', ownerId: 'own-1' };
		await createService({ key: 'secret' } as never, input);
		expect(request).toHaveBeenCalledWith('/v1/services', 'secret', {
			method: 'POST',
			body: input,
		});
	});

	it('uses exact service subresource routes and guards every path identifier', async () => {
		const ctx = { key: 'secret' } as never;
		await listServiceEnvVars(ctx, {
			serviceId: 'srv-1',
			cursor: 'next',
			limit: 20,
		});
		await deleteServiceEnvVar(ctx, {
			serviceId: 'srv-1',
			envVarKey: 'API_KEY',
		});
		await listServiceHeaders(ctx, {
			serviceId: 'srv-1',
			name: ['Cache-Control'],
		});
		await listServiceCustomDomains(ctx, {
			serviceId: 'srv-1',
			domainType: 'apex',
		});
		await deleteServiceCustomDomain(ctx, {
			serviceId: 'srv-1',
			customDomainNameOrID: 'www.example.com',
		});

		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/env-vars',
			'secret',
			{
				method: 'GET',
				query: { cursor: 'next', limit: 20 },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/env-vars/API_KEY',
			'secret',
			{
				method: 'DELETE',
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/headers',
			'secret',
			{
				method: 'GET',
				query: { name: ['Cache-Control'] },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/custom-domains',
			'secret',
			{
				method: 'GET',
				query: { domainType: 'apex' },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/custom-domains/www.example.com',
			'secret',
			{ method: 'DELETE' },
		);
		expect(() =>
			deleteServiceEnvVar(ctx, { serviceId: 'srv-1', envVarKey: '../key' }),
		).toThrow('Invalid Render service ID');
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

	it('covers the remaining Render metric routes', async () => {
		const ctx = { key: 'secret' } as never;
		const input = { ownerId: 'own-1', startTime: '2026-01-01T00:00:00Z' };

		await getCpuTarget(ctx, input);
		await getHttpRequests(ctx, input);
		await getHttpLatency(ctx, input);
		await getBandwidth(ctx, input);
		await getReplicationLag(ctx, input);
		await listHttpFilterValues(ctx, input);
		await listPathFilterValues(ctx, input);
		await getTaskRunsQueued(ctx, input);
		await getTaskRunsCompleted(ctx, input);

		for (const path of [
			'/v1/metrics/cpu-target',
			'/v1/metrics/http-requests',
			'/v1/metrics/http-latency',
			'/v1/metrics/bandwidth',
			'/v1/metrics/replication-lag',
			'/v1/metrics/filters/http',
			'/v1/metrics/filters/path',
			'/v1/metrics/task-runs-queued',
			'/v1/metrics/task-runs-completed',
		]) {
			expect(request).toHaveBeenCalledWith(path, 'secret', {
				method: 'GET',
				query: input,
			});
		}
	});

	it('updates and removes workspace members on the documented routes', async () => {
		const ctx = { key: 'secret' } as never;
		const input = { ownerId: 'own-1', userId: 'usr-1' };

		await updateWorkspaceMember(ctx, { ...input, role: 'ADMIN' });
		await removeWorkspaceMember(ctx, input);

		expect(request).toHaveBeenCalledWith(
			'/v1/owners/own-1/members/usr-1',
			'secret',
			{
				method: 'PATCH',
				body: { role: 'ADMIN' },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/owners/own-1/members/usr-1',
			'secret',
			{
				method: 'DELETE',
			},
		);
		expect(() =>
			updateWorkspaceMember(ctx, {
				...input,
				ownerId: '../own',
				role: 'ADMIN',
			}),
		).toThrow('Invalid Render ownerId');
		expect(() =>
			removeWorkspaceMember(ctx, { ...input, userId: 'usr/1' }),
		).toThrow('Invalid Render userId');
	});

	it('retrieves and updates service notification overrides', async () => {
		const ctx = { key: 'secret' } as never;
		const input = { serviceId: 'srv-1' };

		await retrieveServiceNotificationOverrides(ctx, input);
		await updateServiceNotificationOverrides(ctx, {
			...input,
			previewNotificationsEnabled: 'true',
			notificationsToSend: 'failure',
		});

		expect(request).toHaveBeenCalledWith(
			'/v1/notification-settings/overrides/services/srv-1',
			'secret',
			{ method: 'GET', query: {} },
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/notification-settings/overrides/services/srv-1',
			'secret',
			{
				method: 'PATCH',
				body: {
					previewNotificationsEnabled: 'true',
					notificationsToSend: 'failure',
				},
			},
		);
		expect(() =>
			retrieveServiceNotificationOverrides(ctx, { serviceId: '../srv' }),
		).toThrow('Invalid Render serviceId');
	});

	it('scales and manages Render service autoscaling', async () => {
		const ctx = { key: 'secret' } as never;
		const serviceId = 'srv-1';
		const criteria = {
			cpu: { enabled: true, percentage: 70 },
			memory: { enabled: false, percentage: 80 },
		};

		await scaleService(ctx, { serviceId, numInstances: 3 });
		await updateAutoscaling(ctx, {
			serviceId,
			enabled: true,
			min: 1,
			max: 5,
			criteria,
		});
		await deleteAutoscaling(ctx, { serviceId });

		expect(request).toHaveBeenCalledWith('/v1/services/srv-1/scale', 'secret', {
			method: 'POST',
			body: { numInstances: 3 },
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/autoscaling',
			'secret',
			{
				method: 'PUT',
				body: { enabled: true, min: 1, max: 5, criteria },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/autoscaling',
			'secret',
			{
				method: 'DELETE',
				body: undefined,
			},
		);
		await expect(
			scaleService(ctx, { serviceId: '../srv', numInstances: 3 }),
		).rejects.toThrow('Invalid Render service ID');
	});

	it('creates an image-backed Render service preview', async () => {
		await createServicePreview({ key: 'secret' } as never, {
			serviceId: 'srv-1',
			imagePath: 'docker.io/library/nginx:latest',
			name: 'preview',
			plan: 'starter',
		});

		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/preview',
			'secret',
			{
				method: 'POST',
				body: {
					imagePath: 'docker.io/library/nginx:latest',
					name: 'preview',
					plan: 'starter',
				},
			},
		);
	});

	it('updates and deletes Render service routes and headers', async () => {
		const ctx = { key: 'secret' } as never;
		await deleteServiceHeader(ctx, { serviceId: 'srv-1', headerId: 'hdr-1' });
		await patchServiceRoute(ctx, {
			serviceId: 'srv-1',
			routeId: 'rte-1',
			body: { type: 'redirect' },
		});
		await deleteServiceRoute(ctx, { serviceId: 'srv-1', routeId: 'rte-1' });

		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/headers/hdr-1',
			'secret',
			{
				method: 'DELETE',
				body: undefined,
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/routes/rte-1',
			'secret',
			{
				method: 'PATCH',
				body: { type: 'redirect' },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/services/srv-1/routes/rte-1',
			'secret',
			{
				method: 'DELETE',
				body: undefined,
			},
		);
	});

	it('retrieves Render events and lists webhook delivery events', async () => {
		const ctx = { key: 'secret' } as never;
		await retrieveEvent(ctx, { eventId: 'evt-1' });
		await listWebhookEvents(ctx, {
			webhookId: 'whk-1',
			sentAfter: '2026-01-01T00:00:00Z',
			limit: 20,
			cursor: 'next',
		});

		expect(request).toHaveBeenCalledWith('/v1/events/evt-1', 'secret', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/webhooks/whk-1/events',
			'secret',
			{
				method: 'GET',
				query: {
					sentAfter: '2026-01-01T00:00:00Z',
					limit: 20,
					cursor: 'next',
				},
			},
		);
		expect(() => retrieveEvent(ctx, { eventId: '../event' })).toThrow(
			'Invalid Render eventId',
		);
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

	it('uses exact routes for remaining audited normal HTTP operations', async () => {
		const ctx = { key: 'secret' } as never;
		await cancelCronJobRun(ctx, { cronJobId: 'cron-1' });
		await retrieveOwnerLogStream(ctx, { ownerId: 'own-1' });
		await retrieveResourceLogStream(ctx, { resourceId: 'srv-1' });
		await deleteResourceLogStream(ctx, { resourceId: 'srv-1' });
		await retrieveOwnerMetricsStream(ctx, { ownerId: 'own-1' });
		await upsertOwnerMetricsStream(ctx, {
			ownerId: 'own-1',
			provider: 'CUSTOM',
			url: 'https://metrics.example.com',
			token: 'token',
		});
		await createKeyValue(ctx, {
			name: 'cache',
			ownerId: 'own-1',
			plan: 'starter',
		});
		await retrieveKeyValue(ctx, { redisId: 'red-1' });
		await updateKeyValue(ctx, { redisId: 'red-1', name: 'cache-next' });
		await deleteProject(ctx, { id: 'prj-1' });
		await removeResourcesFromEnvironment(ctx, {
			environmentId: 'env-1',
			resourceIds: ['srv-1', 'red-1'],
		});
		await unlinkServiceFromEnvGroup(ctx, {
			envGroupId: 'eg-1',
			serviceId: 'srv-1',
		});

		expect(request).toHaveBeenCalledWith(
			'/v1/cron-jobs/cron-1/runs',
			'secret',
			{
				method: 'DELETE',
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/logs/streams/owner/own-1',
			'secret',
			{
				method: 'GET',
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/logs/streams/resource/srv-1',
			'secret',
			{
				method: 'GET',
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/logs/streams/resource/srv-1',
			'secret',
			{
				method: 'DELETE',
			},
		);
		expect(request).toHaveBeenCalledWith('/v1/metrics-stream/own-1', 'secret', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith('/v1/metrics-stream/own-1', 'secret', {
			method: 'PUT',
			body: {
				provider: 'CUSTOM',
				url: 'https://metrics.example.com',
				token: 'token',
			},
		});
		expect(request).toHaveBeenCalledWith('/v1/key-value', 'secret', {
			method: 'POST',
			body: { name: 'cache', ownerId: 'own-1', plan: 'starter' },
		});
		expect(request).toHaveBeenCalledWith('/v1/key-value/red-1', 'secret', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith('/v1/key-value/red-1', 'secret', {
			method: 'PATCH',
			body: { name: 'cache-next' },
		});
		expect(request).toHaveBeenCalledWith('/v1/projects/prj-1', 'secret', {
			method: 'DELETE',
			body: undefined,
			query: undefined,
		});
		expect(request).toHaveBeenCalledWith(
			'/v1/environments/env-1/resources',
			'secret',
			{
				method: 'DELETE',
				query: { resourceIds: ['srv-1', 'red-1'] },
			},
		);
		expect(request).toHaveBeenCalledWith(
			'/v1/env-groups/eg-1/services/srv-1',
			'secret',
			{
				method: 'DELETE',
			},
		);
		expect(() => retrieveKeyValue(ctx, { redisId: '../red' })).toThrow(
			'Invalid Render redisId',
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
