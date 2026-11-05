// Route table: every registered operation, called through the public
// endpoint with schema-valid sample input, must send exactly one request
// with the method and path below. Each entry was checked against Render's
// OpenAPI spec (https://api-docs.render.com/openapi/render-public-api-1.json);
// the trailing comment is Render's operationId. Path parameters are filled
// with `X<name>` on the wire, e.g. {serviceId} -> XserviceId.
import { createCorsair } from 'corsair/core';
import { z } from 'zod';
import { render, renderEndpointSchemas } from './index';

const ROUTES: Record<keyof typeof renderEndpointSchemas, string> = {
	'services.list': 'GET /v1/services', // list-services
	'services.create': 'POST /v1/services', // create-service
	'services.retrieve': 'GET /v1/services/{serviceId}', // retrieve-service
	'services.delete': 'DELETE /v1/services/{serviceId}', // delete-service
	'services.update': 'PATCH /v1/services/{serviceId}', // update-service
	'services.triggerDeploy': 'POST /v1/services/{serviceId}/deploys', // create-deploy
	'services.listDeploys': 'GET /v1/services/{serviceId}/deploys', // list-deploys
	'services.purgeCache': 'POST /v1/services/{serviceId}/cache/purge', // purge-cache
	'services.cancelDeploy':
		'POST /v1/services/{serviceId}/deploys/{deployId}/cancel', // cancel-deploy
	'services.rollbackDeploy': 'POST /v1/services/{serviceId}/rollback', // rollback-deploy
	'services.listEvents': 'GET /v1/services/{serviceId}/events', // list-events
	'services.listOutboundIps': 'GET /v1/services/{serviceId}/outbound-ips', // retrieve-service-outbound-ips
	'services.jobs.list': 'GET /v1/services/{serviceId}/jobs', // list-job
	'services.jobs.retrieve': 'GET /v1/services/{serviceId}/jobs/{jobId}', // retrieve-job
	'services.jobs.create': 'POST /v1/services/{serviceId}/jobs', // post-job
	'services.jobs.cancel': 'POST /v1/services/{serviceId}/jobs/{jobId}/cancel', // cancel-job
	'services.restart': 'POST /v1/services/{serviceId}/restart', // restart-service
	'services.suspend': 'POST /v1/services/{serviceId}/suspend', // suspend-service
	'services.resume': 'POST /v1/services/{serviceId}/resume', // resume-service
	'services.scale': 'POST /v1/services/{serviceId}/scale', // scale-service
	'services.updateAutoscaling': 'PUT /v1/services/{serviceId}/autoscaling', // autoscale-service
	'services.deleteAutoscaling': 'DELETE /v1/services/{serviceId}/autoscaling', // delete-autoscaling-config
	'services.createPreview': 'POST /v1/services/{serviceId}/preview', // preview-service
	'services.retrieveDeploy': 'GET /v1/services/{serviceId}/deploys/{deployId}', // retrieve-deploy
	'services.listInstances': 'GET /v1/services/{serviceId}/instances', // list-instances
	'services.envVars.list': 'GET /v1/services/{serviceId}/env-vars', // get-env-vars-for-service
	'services.envVars.retrieve':
		'GET /v1/services/{serviceId}/env-vars/{envVarKey}', // retrieve-env-var
	'services.envVars.upsert':
		'PUT /v1/services/{serviceId}/env-vars/{envVarKey}', // update-env-var
	'services.envVars.update': 'PUT /v1/services/{serviceId}/env-vars', // update-env-vars-for-service
	'services.envVars.delete':
		'DELETE /v1/services/{serviceId}/env-vars/{envVarKey}', // delete-env-var
	'services.secretFiles.list': 'GET /v1/services/{serviceId}/secret-files', // list-secret-files-for-service
	'services.secretFiles.retrieve':
		'GET /v1/services/{serviceId}/secret-files/{secretFileName}', // retrieve-secret-file
	'services.secretFiles.upsert':
		'PUT /v1/services/{serviceId}/secret-files/{secretFileName}', // add-or-update-secret-file
	'services.secretFiles.update': 'PUT /v1/services/{serviceId}/secret-files', // update-secret-files-for-service
	'services.secretFiles.delete':
		'DELETE /v1/services/{serviceId}/secret-files/{secretFileName}', // delete-secret-file
	'services.headers.list': 'GET /v1/services/{serviceId}/headers', // list-headers
	'services.headers.add': 'POST /v1/services/{serviceId}/headers', // add-headers
	'services.headers.update': 'PUT /v1/services/{serviceId}/headers', // update-headers
	'services.headers.delete':
		'DELETE /v1/services/{serviceId}/headers/{headerId}', // delete-header
	'services.routes.list': 'GET /v1/services/{serviceId}/routes', // list-routes
	'services.routes.add': 'POST /v1/services/{serviceId}/routes', // add-route
	'services.routes.update': 'PUT /v1/services/{serviceId}/routes', // put-routes
	'services.routes.updatePriority':
		'PATCH /v1/services/{serviceId}/routes/{routeId}', // patch-route
	'services.routes.delete': 'DELETE /v1/services/{serviceId}/routes/{routeId}', // delete-route
	'services.customDomains.list': 'GET /v1/services/{serviceId}/custom-domains', // list-custom-domains
	'services.customDomains.create':
		'POST /v1/services/{serviceId}/custom-domains', // create-custom-domain
	'services.customDomains.retrieve':
		'GET /v1/services/{serviceId}/custom-domains/{customDomainNameOrID}', // retrieve-custom-domain
	'services.customDomains.verify':
		'POST /v1/services/{serviceId}/custom-domains/{customDomainNameOrID}/verify', // refresh-custom-domain
	'services.customDomains.delete':
		'DELETE /v1/services/{serviceId}/custom-domains/{customDomainNameOrID}', // delete-custom-domain
	'services.environments.list': 'GET /v1/environments', // list-environments
	'services.environments.create': 'POST /v1/environments', // create-environment
	'services.environments.retrieve': 'GET /v1/environments/{id}', // retrieve-environment
	'services.environments.update': 'PATCH /v1/environments/{id}', // update-environment
	'services.environments.delete': 'DELETE /v1/environments/{id}', // delete-environment
	'services.environments.addResources':
		'POST /v1/environments/{environmentId}/resources', // add-resources-to-environment
	'services.environments.removeResources':
		'DELETE /v1/environments/{environmentId}/resources', // remove-resources-from-environment
	'services.envGroups.list': 'GET /v1/env-groups', // list-env-groups
	'services.envGroups.create': 'POST /v1/env-groups', // create-env-group
	'services.envGroups.retrieve': 'GET /v1/env-groups/{id}', // retrieve-env-group
	'services.envGroups.update': 'PATCH /v1/env-groups/{id}', // update-env-group
	'services.envGroups.delete': 'DELETE /v1/env-groups/{id}', // delete-env-group
	'services.envGroups.linkService':
		'POST /v1/env-groups/{envGroupId}/services/{serviceId}', // link-service-to-env-group
	'services.envGroups.unlinkService':
		'DELETE /v1/env-groups/{envGroupId}/services/{serviceId}', // unlink-service-from-env-group
	'services.envGroups.envVars.retrieve':
		'GET /v1/env-groups/{envGroupId}/env-vars/{envVarKey}', // retrieve-env-group-env-var
	'services.envGroups.envVars.upsert':
		'PUT /v1/env-groups/{envGroupId}/env-vars/{envVarKey}', // update-env-group-env-var
	'services.envGroups.envVars.delete':
		'DELETE /v1/env-groups/{envGroupId}/env-vars/{envVarKey}', // delete-env-group-env-var
	'services.envGroups.secretFiles.retrieve':
		'GET /v1/env-groups/{envGroupId}/secret-files/{secretFileName}', // retrieve-env-group-secret-file
	'services.envGroups.secretFiles.upsert':
		'PUT /v1/env-groups/{envGroupId}/secret-files/{secretFileName}', // update-env-group-secret-file
	'services.envGroups.secretFiles.delete':
		'DELETE /v1/env-groups/{envGroupId}/secret-files/{secretFileName}', // delete-env-group-secret-file
	'projects.list': 'GET /v1/projects', // list-projects
	'projects.create': 'POST /v1/projects', // create-project
	'projects.retrieve': 'GET /v1/projects/{id}', // retrieve-project
	'projects.update': 'PATCH /v1/projects/{id}', // update-project
	'projects.delete': 'DELETE /v1/projects/{id}', // delete-project
	'postgres.list': 'GET /v1/postgres', // list-postgres
	'postgres.create': 'POST /v1/postgres', // create-postgres
	'postgres.retrieve': 'GET /v1/postgres/{id}', // retrieve-postgres
	'postgres.update': 'PATCH /v1/postgres/{id}', // update-postgres
	'postgres.restart': 'POST /v1/postgres/{id}/restart', // restart-postgres
	'postgres.suspend': 'POST /v1/postgres/{id}/suspend', // suspend-postgres
	'postgres.resume': 'POST /v1/postgres/{id}/resume', // resume-postgres
	'postgres.failover': 'POST /v1/postgres/{id}/failover', // failover-postgres
	'postgres.connectionInfo': 'GET /v1/postgres/{id}/connection-info', // retrieve-postgres-connection-info
	'postgres.recoveryInfo': 'GET /v1/postgres/{id}/recovery', // retrieve-postgres-recovery-info
	'postgres.recover': 'POST /v1/postgres/{id}/recovery', // recover-postgres
	'postgres.deleteUser': 'DELETE /v1/postgres/{id}/credentials/{username}', // delete-postgres-user
	'postgres.delete': 'DELETE /v1/postgres/{id}', // delete-postgres
	'postgres.createExport': 'POST /v1/postgres/{id}/export', // create-postgres-export
	'postgres.createUser': 'POST /v1/postgres/{id}/credentials', // create-postgres-user
	'postgres.processes': 'GET /v1/postgres/{id}/query/processes', // list-postgres-processes
	'postgres.topQueries': 'GET /v1/postgres/{id}/query/top-queries', // list-postgres-top-queries
	'postgres.sizes': 'GET /v1/postgres/{id}/query/sizes', // list-postgres-sizes
	'postgres.tableScans': 'GET /v1/postgres/{id}/query/table-scans', // list-postgres-table-scans
	'postgres.listExports': 'GET /v1/postgres/{id}/export', // list-postgres-export
	'postgres.listUsers': 'GET /v1/postgres/{id}/credentials', // list-postgres-users
	'registryCredentials.list': 'GET /v1/registrycredentials', // list-registry-credentials
	'registryCredentials.create': 'POST /v1/registrycredentials', // create-registry-credential
	'registryCredentials.retrieve': 'GET /v1/registrycredentials/{id}', // retrieve-registry-credential
	'registryCredentials.update': 'PATCH /v1/registrycredentials/{id}', // update-registry-credential
	'registryCredentials.delete': 'DELETE /v1/registrycredentials/{id}', // delete-registry-credential
	'owners.list': 'GET /v1/owners', // list-owners
	'owners.retrieve': 'GET /v1/owners/{id}', // retrieve-owner
	'owners.members': 'GET /v1/owners/{id}/members', // retrieve-owner-members
	'owners.updateMember': 'PATCH /v1/owners/{ownerId}/members/{userId}', // update-workspace-member
	'owners.removeMember': 'DELETE /v1/owners/{ownerId}/members/{userId}', // remove-workspace-member
	'owners.auditLogs': 'GET /v1/owners/{id}/audit-logs', // list-owner-audit-logs
	'organizations.auditLogs': 'GET /v1/organizations/{id}/audit-logs', // list-organization-audit-logs
	'keyValue.list': 'GET /v1/key-value', // list-key-value
	'keyValue.create': 'POST /v1/key-value', // create-key-value
	'keyValue.retrieve': 'GET /v1/key-value/{redisId}', // retrieve-key-value
	'keyValue.update': 'PATCH /v1/key-value/{redisId}', // update-key-value
	'keyValue.suspend': 'POST /v1/key-value/{id}/suspend', // suspend-key-value
	'keyValue.resume': 'POST /v1/key-value/{id}/resume', // resume-key-value
	'keyValue.connectionInfo': 'GET /v1/key-value/{id}/connection-info', // retrieve-key-value-connection-info
	'keyValue.delete': 'DELETE /v1/key-value/{id}', // delete-key-value
	'blueprints.list': 'GET /v1/blueprints', // list-blueprints
	'blueprints.listSyncs': 'GET /v1/blueprints/{id}/syncs', // list-blueprint-syncs
	'blueprints.validate': 'POST /v1/blueprints/validate', // validate-blueprint
	'blueprints.retrieve': 'GET /v1/blueprints/{id}', // retrieve-blueprint
	'blueprints.update': 'PATCH /v1/blueprints/{id}', // update-blueprint
	'blueprints.disconnect': 'DELETE /v1/blueprints/{id}', // disconnect-blueprint
	'dedicatedIps.list': 'GET /v1/dedicated-ips', // list-dedicated-ips
	'dedicatedIps.create': 'POST /v1/dedicated-ips', // create-dedicated-ip
	'dedicatedIps.retrieve': 'GET /v1/dedicated-ips/{id}', // retrieve-dedicated-ip
	'dedicatedIps.update': 'PATCH /v1/dedicated-ips/{id}', // update-dedicated-ip
	'dedicatedIps.delete': 'DELETE /v1/dedicated-ips/{id}', // delete-dedicated-ip
	'buildSources.create': 'POST /v1/build-sources', // create-build-source
	'buildSources.list': 'GET /v1/build-sources', // list-build-sources
	'buildSources.retrieve': 'GET /v1/build-sources/{buildSourceId}', // get-build-source
	'buildSources.update': 'PATCH /v1/build-sources/{buildSourceId}', // update-build-source
	'buildSources.delete': 'DELETE /v1/build-sources/{buildSourceId}', // delete-build-source
	'buildSources.builds.list': 'GET /v1/build-sources/{buildSourceId}/builds', // list-builds-in-build-source
	'buildSources.builds.trigger':
		'POST /v1/build-sources/{buildSourceId}/builds', // trigger-build-source-build
	'buildSources.builds.retrieve':
		'GET /v1/build-sources/{buildSourceId}/builds/{buildId}', // retrieve-build-source-build
	'buildSources.envVars.list': 'GET /v1/build-sources/{buildSourceId}/env-vars', // get-env-vars-for-build-source
	'buildSources.envVars.update':
		'PUT /v1/build-sources/{buildSourceId}/env-vars', // update-env-vars-for-build-source
	'buildSources.envVars.retrieve':
		'GET /v1/build-sources/{buildSourceId}/env-vars/{envVarKey}', // retrieve-build-source-env-var
	'buildSources.envVars.upsert':
		'PUT /v1/build-sources/{buildSourceId}/env-vars/{envVarKey}', // update-build-source-env-var
	'buildSources.envVars.delete':
		'DELETE /v1/build-sources/{buildSourceId}/env-vars/{envVarKey}', // delete-build-source-env-var
	'buildSources.secretFiles.list':
		'GET /v1/build-sources/{buildSourceId}/secret-files', // list-secret-files-for-build-source
	'buildSources.secretFiles.update':
		'PUT /v1/build-sources/{buildSourceId}/secret-files', // update-secret-files-for-build-source
	'buildSources.secretFiles.retrieve':
		'GET /v1/build-sources/{buildSourceId}/secret-files/{envVarKey}', // retrieve-build-source-secret-file
	'buildSources.secretFiles.upsert':
		'PUT /v1/build-sources/{buildSourceId}/secret-files/{envVarKey}', // add-or-update-build-source-secret-file
	'buildSources.secretFiles.delete':
		'DELETE /v1/build-sources/{buildSourceId}/secret-files/{envVarKey}', // delete-build-source-secret-file
	'buildSources.envGroups.link':
		'POST /v1/build-sources/{buildSourceId}/env-groups/{envGroupId}', // link-env-group-to-build-source
	'buildSources.envGroups.unlink':
		'DELETE /v1/build-sources/{buildSourceId}/env-groups/{envGroupId}', // unlink-env-group-from-build-source
	'user.get': 'GET /v1/users', // get-user
	'logs.list': 'GET /v1/logs', // list-logs
	'logs.values': 'GET /v1/logs/values', // list-logs-values
	'logs.resourceStreams': 'GET /v1/logs/streams/resource', // list-resource-log-streams
	'logs.deleteOwnerStream': 'DELETE /v1/logs/streams/owner/{id}', // delete-owner-log-stream
	'logs.updateOwnerStream': 'PUT /v1/logs/streams/owner/{id}', // update-owner-log-stream
	'logs.retrieveOwnerStream': 'GET /v1/logs/streams/owner/{ownerId}', // get-owner-log-stream
	'logs.retrieveResourceStream': 'GET /v1/logs/streams/resource/{resourceId}', // get-resource-log-stream
	'logs.updateResourceStream': 'PUT /v1/logs/streams/resource/{resourceId}', // update-resource-log-stream
	'logs.deleteResourceStream': 'DELETE /v1/logs/streams/resource/{resourceId}', // delete-resource-log-stream
	'metrics.activeConnections': 'GET /v1/metrics/active-connections', // get-active-connections
	'metrics.bandwidthSources': 'GET /v1/metrics/bandwidth-sources', // get-bandwidth-sources
	'metrics.cpu': 'GET /v1/metrics/cpu', // get-cpu
	'metrics.cpuLimit': 'GET /v1/metrics/cpu-limit', // get-cpu-limit
	'metrics.cpuTarget': 'GET /v1/metrics/cpu-target', // get-cpu-target
	'metrics.httpRequests': 'GET /v1/metrics/http-requests', // get-http-requests
	'metrics.httpLatency': 'GET /v1/metrics/http-latency', // get-http-latency
	'metrics.bandwidth': 'GET /v1/metrics/bandwidth', // get-bandwidth
	'metrics.replicationLag': 'GET /v1/metrics/replication-lag', // get-replication-lag
	'metrics.diskCapacity': 'GET /v1/metrics/disk-capacity', // get-disk-capacity
	'metrics.diskUsage': 'GET /v1/metrics/disk-usage', // get-disk-usage
	'metrics.instanceCount': 'GET /v1/metrics/instance-count', // get-instance-count
	'metrics.memory': 'GET /v1/metrics/memory', // get-memory
	'metrics.memoryLimit': 'GET /v1/metrics/memory-limit', // get-memory-limit
	'metrics.memoryTarget': 'GET /v1/metrics/memory-target', // get-memory-target
	'metrics.applicationFilterValues': 'GET /v1/metrics/filters/application', // list-application-filter-values
	'metrics.httpFilterValues': 'GET /v1/metrics/filters/http', // list-http-filter-values
	'metrics.pathFilterValues': 'GET /v1/metrics/filters/path', // list-path-filter-values
	'metrics.taskRunsQueued': 'GET /v1/metrics/task-runs-queued', // get-task-runs-queued
	'metrics.taskRunsCompleted': 'GET /v1/metrics/task-runs-completed', // get-task-runs-completed
	'metrics.retrieveOwnerStream': 'GET /v1/metrics-stream/{ownerId}', // getOwnerMetricsStream
	'metrics.upsertOwnerStream': 'PUT /v1/metrics-stream/{ownerId}', // upsertOwnerMetricsStream
	'metrics.deleteOwnerStream': 'DELETE /v1/metrics-stream/{ownerId}', // deleteOwnerMetricsStream
	'notifications.retrieveOwnerSettings':
		'GET /v1/notification-settings/owners/{ownerId}', // retrieve-owner-notification-settings
	'notifications.updateOwnerSettings':
		'PATCH /v1/notification-settings/owners/{ownerId}', // patch-owner-notification-settings
	'notifications.listOverrides': 'GET /v1/notification-settings/overrides', // list-notification-overrides
	'notifications.retrieveServiceOverrides':
		'GET /v1/notification-settings/overrides/services/{serviceId}', // retrieve-service-notification-overrides
	'notifications.updateServiceOverrides':
		'PATCH /v1/notification-settings/overrides/services/{serviceId}', // patch-service-notification-overrides
	'events.retrieve': 'GET /v1/events/{eventId}', // retrieve-event
	'disks.list': 'GET /v1/disks', // list-disks
	'maintenance.list': 'GET /v1/maintenance', // list-maintenance
	'workflows.taskRuns.list': 'GET /v1/task-runs', // listTaskRuns
	'workflows.tasks.list': 'GET /v1/tasks', // listTasks
	'workflows.list': 'GET /v1/workflows', // listWorkflows
	'workflows.versions.list': 'GET /v1/workflowversions', // listWorkflowVersions
	'webhooks.list': 'GET /v1/webhooks', // list-webhooks
	'webhooks.listEvents': 'GET /v1/webhooks/{id}/events', // list-webhook-events
	'disks.create': 'POST /v1/disks', // add-disk
	'disks.retrieve': 'GET /v1/disks/{id}', // retrieve-disk
	'disks.update': 'PATCH /v1/disks/{id}', // update-disk
	'disks.delete': 'DELETE /v1/disks/{id}', // delete-disk
	'disks.listSnapshots': 'GET /v1/disks/{id}/snapshots', // list-snapshots
	'disks.restoreSnapshot': 'POST /v1/disks/{id}/snapshots/restore', // restore-snapshot
	'maintenance.retrieve': 'GET /v1/maintenance/{id}', // retrieve-maintenance
	'maintenance.update': 'PATCH /v1/maintenance/{id}', // update-maintenance
	'maintenance.trigger': 'POST /v1/maintenance/{id}/trigger', // trigger-maintenance
	'services.cronJobs.triggerRun': 'POST /v1/cron-jobs/{cronJobId}/runs', // run-cron-job
	'services.cronJobs.cancelRun': 'DELETE /v1/cron-jobs/{cronJobId}/runs', // cancel-cron-job-run
	'webhooks.create': 'POST /v1/webhooks', // create-webhook
	'webhooks.retrieve': 'GET /v1/webhooks/{id}', // retrieve-webhook
	'webhooks.update': 'PATCH /v1/webhooks/{id}', // update-webhook
	'webhooks.delete': 'DELETE /v1/webhooks/{id}', // delete-webhook
	'workflows.create': 'POST /v1/workflows', // createWorkflow
	'workflows.retrieve': 'GET /v1/workflows/{id}', // getWorkflow
	'workflows.update': 'PATCH /v1/workflows/{id}', // updateWorkflow
	'workflows.delete': 'DELETE /v1/workflows/{id}', // deleteWorkflow
	'workflows.versions.create': 'POST /v1/workflowversions', // createWorkflowVersion
	'workflows.versions.retrieve': 'GET /v1/workflowversions/{id}', // getWorkflowVersion
	'workflows.tasks.retrieve': 'GET /v1/tasks/{id}', // getTask
	'workflows.taskRuns.create': 'POST /v1/task-runs', // createTask
	'workflows.taskRuns.retrieve': 'GET /v1/task-runs/{id}', // getTaskRun
	'workflows.taskRuns.cancel': 'DELETE /v1/task-runs/{id}', // cancelTaskRun
};

type JsonSchema = z.core.JSONSchema.JSONSchema;
type Operation = keyof typeof ROUTES;

// Builds the smallest input each schema accepts from its JSON Schema:
// required fields only, the first enum value or union branch, and `X<name>`
// for strings so path parameters are easy to spot on the wire.
// unknown: samples are arbitrary JSON values that each schema then validates.
const sample = (schema: JsonSchema | boolean, key: string): unknown => {
	if (typeof schema === 'boolean') return {};
	if (schema.enum) return schema.enum[0];
	if (schema.const !== undefined) return schema.const;
	const branch = schema.anyOf?.[0] ?? schema.oneOf?.[0];
	if (branch !== undefined) return sample(branch, key);
	switch (schema.type) {
		case 'string':
			if (schema.format === 'date-time') return '2026-01-01T00:00:00Z';
			if (schema.format === 'uri') return 'https://example.com/x';
			return `X${key}`;
		case 'number':
		case 'integer':
			return 1;
		case 'boolean':
			return true;
		case 'array': {
			const items = Array.isArray(schema.items)
				? schema.items[0]
				: schema.items;
			return items === undefined ? [] : [sample(items, key)];
		}
		case 'object':
			return Object.fromEntries(
				(schema.required ?? []).map((name) => [
					name,
					sample(schema.properties?.[name] ?? {}, name),
				]),
			);
		default:
			return {};
	}
};

// Inputs the sampler cannot build (cross-field refinements).
const INPUT_OVERRIDES: Partial<Record<Operation, unknown>> = {
	'services.envVars.upsert': {
		serviceId: 'XserviceId',
		envVarKey: 'XenvVarKey',
		value: 'v',
	},
	'services.envGroups.envVars.upsert': {
		envGroupId: 'XenvGroupId',
		envVarKey: 'XenvVarKey',
		value: 'v',
	},
};

const isOperation = (path: string): path is Operation => path in ROUTES;

const flatten = (tree: object, prefix = ''): [string, Function][] =>
	Object.entries(tree).flatMap(([name, value]): [string, Function][] => {
		const path = prefix ? `${prefix}.${name}` : name;
		if (typeof value === 'function') return [[path, value]];
		if (value && typeof value === 'object') return flatten(value, path);
		return [];
	});

describe('Render route table', () => {
	const operations = flatten(
		createCorsair({ plugins: [render({ key: 'rnd_test' })] }).render.api,
	);
	const sent: { method: string; path: string }[] = [];

	beforeEach(() => {
		sent.length = 0;
		jest.spyOn(global, 'fetch').mockImplementation(async (url, init) => {
			sent.push({
				method: init?.method ?? 'GET',
				path: new URL(String(url)).pathname,
			});
			return new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('lists every registered operation exactly once', () => {
		expect(operations.map(([path]) => path).sort()).toEqual(
			Object.keys(ROUTES).sort(),
		);
	});

	it.each(Object.entries(ROUTES))('%s -> %s', async (operation, route) => {
		if (!isOperation(operation)) throw new Error(`unknown ${operation}`);
		const handler = operations.find(([path]) => path === operation)?.[1];
		if (!handler) throw new Error(`${operation} is not registered`);
		const input =
			INPUT_OVERRIDES[operation] ??
			sample(
				z.toJSONSchema(renderEndpointSchemas[operation].input, {
					io: 'input',
					unrepresentable: 'any',
				}),
				'input',
			);

		// Dynamic dispatch over all 218 operations: the sampled input is checked
		// by the operation's own schema, so the call is made through
		// Reflect.apply rather than a typed signature. The reply is a bare `{}`,
		// which some output schemas reject; only the outgoing request matters.
		await Promise.resolve(Reflect.apply(handler, undefined, [input])).catch(
			() => undefined,
		);

		const [method, template] = route.split(' ');
		const path = template?.replace(/\{(\w+)\}/g, 'X$1');
		expect(sent).toEqual([{ method, path }]);
	});
});
