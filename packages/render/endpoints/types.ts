import { z } from 'zod';

const RenderServiceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string(),
		ownerId: z.string(),
		environmentId: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();

const ListServicesInputSchema = z.object({
	name: z.array(z.string()).optional(),
	type: z.array(z.string()).optional(),
	environmentId: z.array(z.string()).optional(),
	env: z.array(z.string()).optional(),
	region: z.array(z.string()).optional(),
	suspended: z.array(z.enum(['suspended', 'not_suspended'])).optional(),
	ownerId: z.array(z.string()).optional(),
	includePreviews: z.boolean().optional(),
	createdBefore: z.string().datetime().optional(),
	createdAfter: z.string().datetime().optional(),
	updatedBefore: z.string().datetime().optional(),
	updatedAfter: z.string().datetime().optional(),
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

const ListServicesOutputSchema = z.array(
	z.object({
		service: RenderServiceSchema,
		cursor: z.string().optional(),
	}),
);

const ServiceIdInputSchema = z.object({ serviceId: z.string().min(1) });
const CreateServiceInputSchema = z
	.object({
		type: z.string().min(1),
		name: z.string().min(1),
		ownerId: z.string().min(1),
	})
	.passthrough();
const ServiceQueryInputSchema = ServiceIdInputSchema.extend({
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});
const ServiceEnvVarInputSchema = ServiceIdInputSchema.extend({
	envVarKey: z.string().min(1),
});
const ServiceHeadersInputSchema = ServiceQueryInputSchema.extend({
	path: z.array(z.string()).optional(),
	name: z.array(z.string()).optional(),
	value: z.array(z.string()).optional(),
});
const ServiceCustomDomainsInputSchema = ServiceQueryInputSchema.extend({
	name: z.array(z.string()).optional(),
	domainType: z.enum(['apex', 'subdomain']).optional(),
	verificationStatus: z.enum(['verified', 'unverified']).optional(),
	createdBefore: z.string().datetime().optional(),
	createdAfter: z.string().datetime().optional(),
});
const ServiceCustomDomainInputSchema = ServiceIdInputSchema.extend({
	customDomainNameOrID: z.string().min(1),
});
const ListDeploysInputSchema = ServiceIdInputSchema.extend({
	status: z.array(z.string()).optional(),
	createdBefore: z.string().datetime().optional(),
	createdAfter: z.string().datetime().optional(),
	updatedBefore: z.string().datetime().optional(),
	updatedAfter: z.string().datetime().optional(),
	finishedBefore: z.string().datetime().optional(),
	finishedAfter: z.string().datetime().optional(),
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
const CancelDeployInputSchema = ServiceIdInputSchema.extend({
	deployId: z.string().min(1),
});
const RollbackDeployInputSchema = ServiceIdInputSchema.extend({
	deployId: z.string().min(1),
});
const ServiceJobInputSchema = ServiceIdInputSchema.extend({
	jobId: z.string().min(1),
});
const TriggerDeployInputSchema = ServiceIdInputSchema.extend({
	commitId: z.string().min(1).optional(),
	buildId: z.string().min(1).optional(),
	clearCache: z.enum(['clear', 'do_not_clear']).optional(),
	imageUrl: z.string().url().optional(),
	deployMode: z.enum(['deploy_only', 'build_and_deploy']).optional(),
});
const ServiceOutputSchema = RenderServiceSchema;
const EmptyOutputSchema = z.union([z.object({}), z.undefined()]);
const ResourceInputSchema = z
	.object({
		id: z.string().min(1).optional(),
		name: z.string().min(1).optional(),
		ownerId: z.string().optional(),
		projectId: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		cursor: z.string().optional(),
	})
	.passthrough();
const ResourceIdInputSchema = ResourceInputSchema.extend({
	id: z.string().min(1),
});
const ResourceIdKeyInputSchema = ResourceIdInputSchema.extend({
	key: z.string().min(1),
});
const ResourceIdServiceIdInputSchema = ResourceIdInputSchema.extend({
	serviceId: z.string().min(1),
});
const ServiceNotificationOverrideInputSchema = z.object({
	serviceId: z.string().min(1),
});
const UpdateServiceNotificationOverrideInputSchema =
	ServiceNotificationOverrideInputSchema.extend({
		previewNotificationsEnabled: z
			.enum(['default', 'false', 'true'])
			.optional(),
		notificationsToSend: z
			.enum(['default', 'none', 'failure', 'all'])
			.optional(),
	});
// Stricter typing is not feasible because Render resource payloads are
// provider-defined and may gain fields independently. Some Render responses
// also return a resource collection from an operation whose endpoint metadata
// is shared with a singular resource operation, so both shapes are accepted
// at the generic resource boundary. The operation-specific list schemas below
// still document and enforce collection responses where the API guarantees one.
// unknown: Render resource records are provider-defined and can add fields
// without changing the stable Corsair operation contract.
const ResourceRecordSchema = z.object({}).passthrough();
const ResourceOutputSchema = z.union([
	ResourceRecordSchema,
	z.array(ResourceRecordSchema),
]);
const ResourceListOutputSchema = z.array(ResourceRecordSchema);
const ServiceJobStartInputSchema = ServiceIdInputSchema.extend({
	startCommand: z.string().min(1),
	planId: z.string().min(1).optional(),
});
const ScaleServiceInputSchema = ServiceIdInputSchema.extend({
	numInstances: z.number().int().min(1),
});
const AutoscalingCriterionSchema = z.object({
	enabled: z.boolean(),
	percentage: z.number().int(),
});
const UpdateAutoscalingInputSchema = ServiceIdInputSchema.extend({
	enabled: z.boolean(),
	min: z.number().int().min(0),
	max: z.number().int().min(0),
	criteria: z.object({
		cpu: AutoscalingCriterionSchema,
		memory: AutoscalingCriterionSchema,
	}),
});
const PreviewServiceInputSchema = ServiceIdInputSchema.extend({
	imagePath: z.string().min(1),
	name: z.string().min(1).optional(),
	plan: z.string().min(1).optional(),
});
const ServiceHeaderInputSchema = ServiceIdInputSchema.extend({
	headerId: z.string().min(1),
});
const ServiceRouteInputSchema = ServiceIdInputSchema.extend({
	routeId: z.string().min(1),
});
const PatchServiceRouteInputSchema = ServiceRouteInputSchema.extend({
	body: z.record(z.string(), z.unknown()),
});
const CreateDiskInputSchema = z.object({
	name: z.string().min(1),
	sizeGB: z.number().int(),
	mountPath: z.string().min(1),
	serviceId: z.string().min(1),
});
const UpdateDiskInputSchema = ResourceIdInputSchema.extend({
	name: z.string().min(1).optional(),
	sizeGB: z.number().int().optional(),
	mountPath: z.string().min(1).optional(),
});
const RestoreDiskSnapshotInputSchema = ResourceIdInputSchema.extend({
	snapshotKey: z.string().min(1),
	instanceId: z.string().min(1).optional(),
});
const UpdateMaintenanceInputSchema = ResourceIdInputSchema.extend({
	scheduledAt: z.string().datetime().optional(),
});
const CreateWebhookInputSchema = z.object({
	ownerId: z.string().min(1),
	name: z.string().min(1),
	url: z.string().min(1),
	enabled: z.boolean(),
	eventFilter: z.array(z.string()),
});
const UpdateWebhookInputSchema = ResourceIdInputSchema.extend({
	name: z.string().min(1).optional(),
	url: z.string().min(1).optional(),
	enabled: z.boolean().optional(),
	eventFilter: z.array(z.string()).optional(),
});
const RecoverPostgresInputSchema = ResourceIdInputSchema.extend({
	restoreName: z.string().min(1).optional(),
	restoreTime: z.string().datetime().optional(),
});
const PostgresUsernameInputSchema = ResourceIdInputSchema.extend({
	username: z.string().min(1),
});
const BlueprintSyncsInputSchema = ResourceIdInputSchema.extend({
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});
const AuditLogsInputSchema = ResourceIdInputSchema.extend({
	startTime: z.string().datetime().optional(),
	endTime: z.string().datetime().optional(),
});
const WorkspaceMemberInputSchema = z.object({
	ownerId: z.string().min(1),
	userId: z.string().min(1),
});
const UpdateWorkspaceMemberInputSchema = WorkspaceMemberInputSchema.extend({
	role: z.enum([
		'ADMIN',
		'DEVELOPER',
		'WORKSPACE_CONTRIBUTOR',
		'WORKSPACE_BILLING',
		'WORKSPACE_VIEWER',
	]),
});
const EventIdInputSchema = z.object({ eventId: z.string().min(1) });
const CronJobIdInputSchema = z.object({ cronJobId: z.string().min(1) });
const OwnerIdInputSchema = z.object({ ownerId: z.string().min(1) });
const ResourceIdPathInputSchema = z.object({ resourceId: z.string().min(1) });
const OwnerMetricsStreamInputSchema = OwnerIdInputSchema.extend({
	provider: z
		.enum([
			'BETTER_STACK',
			'GRAFANA',
			'DATADOG',
			'NEW_RELIC',
			'HONEYCOMB',
			'SIGNOZ',
			'GROUNDCOVER',
			'LOGFIRE',
			'CUSTOM',
		])
		.optional(),
	url: z.string().optional(),
	token: z.string().optional(),
});
const CreateKeyValueInputSchema = z
	.object({
		name: z.string().min(1),
		ownerId: z.string().min(1),
		plan: z.string().min(1),
	})
	.passthrough();
const KeyValueIdInputSchema = z.object({ redisId: z.string().min(1) });
const UpdateKeyValueInputSchema = KeyValueIdInputSchema.extend({
	name: z.string().min(1).optional(),
	plan: z.string().min(1).optional(),
	maxmemoryPolicy: z.string().min(1).optional(),
	persistenceMode: z.string().min(1).optional(),
	ipAllowList: z.array(z.record(z.string(), z.unknown())).optional(),
});
const EnvironmentResourcesInputSchema = z.object({
	environmentId: z.string().min(1),
	resourceIds: z.array(z.string().min(1)).min(1),
});
const EnvGroupServiceInputSchema = z.object({
	envGroupId: z.string().min(1),
	serviceId: z.string().min(1),
});
const WebhookEventsInputSchema = z.object({
	webhookId: z.string().min(1),
	sentBefore: z.string().datetime().optional(),
	sentAfter: z.string().datetime().optional(),
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
});
const BuildSourceIdInputSchema = z.object({ buildSourceId: z.string().min(1) });
const BuildSourceEnvVarInputSchema = BuildSourceIdInputSchema.extend({
	envVarKey: z.string().min(1),
});
const BuildSourceBuildInputSchema = BuildSourceIdInputSchema.extend({
	buildId: z.string().min(1),
});
const BuildSourceEnvGroupInputSchema = BuildSourceIdInputSchema.extend({
	envGroupId: z.string().min(1),
});
const CreateBuildSourceInputSchema = z
	.object({
		ownerId: z.string().min(1),
		name: z.string().min(1),
		projectId: z.string().min(1).optional(),
		git: z.record(z.string(), z.unknown()).optional(),
		image: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
const BuildSourceBodyInputSchema = BuildSourceIdInputSchema.extend({
	body: z.union([z.record(z.string(), z.unknown()), z.array(z.unknown())]),
});
const BuildSourceEnvVarBodyInputSchema = BuildSourceEnvVarInputSchema.extend({
	body: z.record(z.string(), z.unknown()),
});
const ResourceBodyInputSchema = ResourceIdInputSchema.extend({
	body: z.record(z.string(), z.unknown()),
});
const CreateResourceInputSchema = z
	.record(z.string(), z.unknown())
	.refine((value) => Object.keys(value).length > 0);

export type ListServicesInput = z.infer<typeof ListServicesInputSchema>;
export type ListServicesOutput = z.infer<typeof ListServicesOutputSchema>;
export type ServiceIdInput = z.infer<typeof ServiceIdInputSchema>;
export type ServiceOutput = z.infer<typeof ServiceOutputSchema>;
type ResourceInput = z.infer<typeof ResourceInputSchema>;
type ResourceIdInput = z.infer<typeof ResourceIdInputSchema>;
type ResourceIdKeyInput = z.infer<typeof ResourceIdKeyInputSchema>;

export type RenderEndpointInputs = {
	listServices: ListServicesInput;
	createService: z.infer<typeof CreateServiceInputSchema>;
	retrieveService: ServiceIdInput;
	deleteService: ServiceIdInput;
	updateService: ServiceIdInput & { name?: string; autoDeployTrigger?: string };
	triggerDeploy: ServiceIdInput & {
		commitId?: string;
		buildId?: string;
		clearCache?: 'clear' | 'do_not_clear';
		imageUrl?: string;
		deployMode?: 'deploy_only' | 'build_and_deploy';
	};
	listDeploys: z.infer<typeof ListDeploysInputSchema>;
	purgeServiceCache: ServiceIdInput;
	cancelDeploy: z.infer<typeof CancelDeployInputSchema>;
	rollbackDeploy: z.infer<typeof RollbackDeployInputSchema>;
	listServiceEvents: ServiceIdInput;
	listOutboundIps: ServiceIdInput;
	listServiceJobs: ServiceIdInput;
	retrieveServiceJob: z.infer<typeof ServiceJobInputSchema>;
	createServiceJob: z.infer<typeof ServiceJobStartInputSchema>;
	cancelServiceJob: z.infer<typeof ServiceJobInputSchema>;
	restartService: ServiceIdInput;
	suspendService: ServiceIdInput;
	resumeService: ServiceIdInput;
	scaleService: z.infer<typeof ScaleServiceInputSchema>;
	updateAutoscaling: z.infer<typeof UpdateAutoscalingInputSchema>;
	deleteAutoscaling: ServiceIdInput;
	createServicePreview: z.infer<typeof PreviewServiceInputSchema>;
	deleteServiceHeader: z.infer<typeof ServiceHeaderInputSchema>;
	patchServiceRoute: z.infer<typeof PatchServiceRouteInputSchema>;
	deleteServiceRoute: z.infer<typeof ServiceRouteInputSchema>;
	listServiceEnvVars: z.infer<typeof ServiceQueryInputSchema>;
	deleteServiceEnvVar: z.infer<typeof ServiceEnvVarInputSchema>;
	listServiceHeaders: z.infer<typeof ServiceHeadersInputSchema>;
	listServiceCustomDomains: z.infer<typeof ServiceCustomDomainsInputSchema>;
	deleteServiceCustomDomain: z.infer<typeof ServiceCustomDomainInputSchema>;
	listEnvironments: z.infer<typeof ResourceInputSchema>;
	createEnvironment: z.infer<typeof ResourceInputSchema>;
	retrieveEnvironment: ResourceIdInput;
	updateEnvironment: ResourceIdInput;
	deleteEnvironment: ResourceIdInput;
	removeResourcesFromEnvironment: z.infer<
		typeof EnvironmentResourcesInputSchema
	>;
	listEnvGroups: z.infer<typeof ResourceInputSchema>;
	createEnvGroup: z.infer<typeof ResourceInputSchema>;
	retrieveEnvGroup: ResourceIdInput;
	updateEnvGroup: ResourceIdInput;
	deleteEnvGroup: ResourceIdInput;
	unlinkServiceFromEnvGroup: z.infer<typeof EnvGroupServiceInputSchema>;
	listProjects: z.infer<typeof ResourceInputSchema>;
	createProject: z.infer<typeof ResourceInputSchema>;
	retrieveProject: ResourceIdInput;
	updateProject: ResourceIdInput;
	deleteProject: ResourceIdInput;
	listPostgres: z.infer<typeof ResourceInputSchema>;
	createPostgres: z.infer<typeof ResourceInputSchema>;
	retrievePostgres: ResourceIdInput;
	updatePostgres: ResourceIdInput;
	restartPostgres: ResourceIdInput;
	suspendPostgres: ResourceIdInput;
	resumePostgres: ResourceIdInput;
	failoverPostgres: ResourceIdInput;
	retrievePostgresConnectionInfo: ResourceIdInput;
	retrievePostgresRecoveryInfo: ResourceIdInput;
	recoverPostgres: z.infer<typeof RecoverPostgresInputSchema>;
	deletePostgresUser: z.infer<typeof PostgresUsernameInputSchema>;
	listRegistryCredentials: z.infer<typeof ResourceInputSchema>;
	createRegistryCredential: z.infer<typeof ResourceInputSchema>;
	retrieveRegistryCredential: ResourceIdInput;
	updateRegistryCredential: ResourceIdInput;
	deleteRegistryCredential: ResourceIdInput;
	listOwners: z.infer<typeof ResourceInputSchema>;
	retrieveOwner: ResourceIdInput;
	listOwnerMembers: ResourceIdInput;
	updateWorkspaceMember: z.infer<typeof UpdateWorkspaceMemberInputSchema>;
	removeWorkspaceMember: z.infer<typeof WorkspaceMemberInputSchema>;
	listOwnerAuditLogs: z.infer<typeof AuditLogsInputSchema>;
	listOrganizationAuditLogs: z.infer<typeof AuditLogsInputSchema>;
	getUser: z.infer<typeof ResourceInputSchema>;
	listLogs: z.infer<typeof ResourceInputSchema>;
	listLogsValues: z.infer<typeof ResourceInputSchema>;
	listResourceLogStreams: z.infer<typeof ResourceInputSchema>;
	deleteOwnerLogStream: ResourceIdInput;
	updateOwnerLogStream: ResourceIdInput;
	retrieveOwnerLogStream: z.infer<typeof OwnerIdInputSchema>;
	retrieveResourceLogStream: z.infer<typeof ResourceIdPathInputSchema>;
	deleteResourceLogStream: z.infer<typeof ResourceIdPathInputSchema>;
	getActiveConnections: z.infer<typeof ResourceInputSchema>;
	getBandwidthSources: z.infer<typeof ResourceInputSchema>;
	getCpu: z.infer<typeof ResourceInputSchema>;
	getCpuLimit: z.infer<typeof ResourceInputSchema>;
	getCpuTarget: z.infer<typeof ResourceInputSchema>;
	getHttpRequests: z.infer<typeof ResourceInputSchema>;
	getHttpLatency: z.infer<typeof ResourceInputSchema>;
	getBandwidth: z.infer<typeof ResourceInputSchema>;
	getReplicationLag: z.infer<typeof ResourceInputSchema>;
	getDiskCapacity: z.infer<typeof ResourceInputSchema>;
	getDiskUsage: z.infer<typeof ResourceInputSchema>;
	getInstanceCount: z.infer<typeof ResourceInputSchema>;
	getMemory: z.infer<typeof ResourceInputSchema>;
	getMemoryLimit: z.infer<typeof ResourceInputSchema>;
	getMemoryTarget: z.infer<typeof ResourceInputSchema>;
	listApplicationFilterValues: z.infer<typeof ResourceInputSchema>;
	listHttpFilterValues: z.infer<typeof ResourceInputSchema>;
	listPathFilterValues: z.infer<typeof ResourceInputSchema>;
	getTaskRunsQueued: z.infer<typeof ResourceInputSchema>;
	getTaskRunsCompleted: z.infer<typeof ResourceInputSchema>;
	listDisks: z.infer<typeof ResourceInputSchema>;
	listMaintenance: z.infer<typeof ResourceInputSchema>;
	listTaskRuns: z.infer<typeof ResourceInputSchema>;
	listTasks: z.infer<typeof ResourceInputSchema>;
	listWorkflows: z.infer<typeof ResourceInputSchema>;
	listWorkflowVersions: z.infer<typeof ResourceInputSchema>;
	listWebhooks: z.infer<typeof ResourceInputSchema>;
	retrieveEvent: z.infer<typeof EventIdInputSchema>;
	listWebhookEvents: z.infer<typeof WebhookEventsInputSchema>;
	createDisk: z.infer<typeof CreateDiskInputSchema>;
	retrieveDisk: ResourceIdInput;
	updateDisk: z.infer<typeof UpdateDiskInputSchema>;
	deleteDisk: ResourceIdInput;
	listDiskSnapshots: ResourceIdInput;
	restoreDiskSnapshot: z.infer<typeof RestoreDiskSnapshotInputSchema>;
	retrieveMaintenance: ResourceIdInput;
	updateMaintenance: z.infer<typeof UpdateMaintenanceInputSchema>;
	triggerMaintenance: ResourceIdInput;
	triggerCronJobRun: ResourceIdInput;
	cancelCronJobRun: z.infer<typeof CronJobIdInputSchema>;
	createWebhook: z.infer<typeof CreateWebhookInputSchema>;
	retrieveWebhook: ResourceIdInput;
	updateWebhook: z.infer<typeof UpdateWebhookInputSchema>;
	deleteWebhook: ResourceIdInput;
	addHeaders: ResourceIdInput;
	addOrUpdateSecretFile: ResourceIdKeyInput;
	addResourcesToEnvironment: ResourceIdInput;
	addRoute: ResourceIdInput;
	createCustomDomain: ResourceIdInput;
	deleteEnvGroupEnvVar: ResourceIdKeyInput;
	deleteEnvGroupSecretFile: ResourceIdKeyInput;
	deleteKeyValue: ResourceIdInput;
	deleteSecretFile: ResourceIdKeyInput;
	disconnectBlueprint: ResourceIdInput;
	linkServiceToEnvGroup: z.infer<typeof ResourceIdServiceIdInputSchema>;
	listBlueprints: z.infer<typeof ResourceInputSchema>;
	listBlueprintSyncs: z.infer<typeof BlueprintSyncsInputSchema>;
	suspendKeyValue: ResourceIdInput;
	resumeKeyValue: ResourceIdInput;
	retrieveKeyValueConnectionInfo: ResourceIdInput;
	listInstances: ResourceIdInput;
	listKeyValue: z.infer<typeof ResourceInputSchema>;
	createKeyValue: z.infer<typeof CreateKeyValueInputSchema>;
	retrieveKeyValue: z.infer<typeof KeyValueIdInputSchema>;
	updateKeyValue: z.infer<typeof UpdateKeyValueInputSchema>;
	listNotificationOverrides: z.infer<typeof ResourceInputSchema>;
	retrieveServiceNotificationOverrides: z.infer<
		typeof ServiceNotificationOverrideInputSchema
	>;
	updateServiceNotificationOverrides: z.infer<
		typeof UpdateServiceNotificationOverrideInputSchema
	>;
	listPostgresExport: ResourceIdInput;
	listPostgresUsers: ResourceIdInput;
	listRoutes: ResourceIdInput;
	listSecretFiles: ResourceIdInput;
	retrieveCustomDomain: ResourceIdKeyInput;
	retrieveDeploy: ResourceIdKeyInput;
	retrieveEnvGroupEnvVar: ResourceIdKeyInput;
	retrieveEnvGroupSecretFile: ResourceIdKeyInput;
	retrieveEnvVar: ResourceIdKeyInput;
	retrieveOwnerNotificationSettings: ResourceIdInput;
	retrieveSecretFile: ResourceIdKeyInput;
	updateEnvGroupEnvVar: ResourceIdKeyInput;
	updateEnvGroupSecretFile: ResourceIdKeyInput;
	updateEnvVar: ResourceIdKeyInput;
	updateEnvVarsForService: ResourceIdInput;
	updateHeaders: ResourceIdInput;
	updateResourceLogStream: ResourceIdInput;
	updateSecretFilesForService: ResourceIdInput;
	verifyCustomDomain: ResourceIdKeyInput;
	deleteOwnerMetricsStream: ResourceIdInput;
	retrieveOwnerMetricsStream: z.infer<typeof OwnerIdInputSchema>;
	upsertOwnerMetricsStream: z.infer<typeof OwnerMetricsStreamInputSchema>;
	updateOwnerNotificationSettings: ResourceIdInput;
	updateRoutes: ResourceIdInput;
	createBuildSource: z.infer<typeof CreateBuildSourceInputSchema>;
	listBuildSources: z.infer<typeof ResourceInputSchema>;
	retrieveBuildSource: z.infer<typeof BuildSourceIdInputSchema>;
	updateBuildSource: z.infer<typeof BuildSourceBodyInputSchema>;
	deleteBuildSource: z.infer<typeof BuildSourceIdInputSchema>;
	listBuildSourceBuilds: z.infer<typeof BuildSourceIdInputSchema>;
	triggerBuildSourceBuild: z.infer<typeof BuildSourceIdInputSchema>;
	retrieveBuildSourceBuild: z.infer<typeof BuildSourceBuildInputSchema>;
	listBuildSourceEnvVars: z.infer<typeof BuildSourceIdInputSchema>;
	updateBuildSourceEnvVars: z.infer<typeof BuildSourceBodyInputSchema>;
	retrieveBuildSourceEnvVar: z.infer<typeof BuildSourceEnvVarInputSchema>;
	updateBuildSourceEnvVar: z.infer<typeof BuildSourceEnvVarBodyInputSchema>;
	deleteBuildSourceEnvVar: z.infer<typeof BuildSourceEnvVarInputSchema>;
	listBuildSourceSecretFiles: z.infer<typeof BuildSourceIdInputSchema>;
	updateBuildSourceSecretFiles: z.infer<typeof BuildSourceBodyInputSchema>;
	retrieveBuildSourceSecretFile: z.infer<typeof BuildSourceEnvVarInputSchema>;
	updateBuildSourceSecretFile: z.infer<typeof BuildSourceEnvVarBodyInputSchema>;
	deleteBuildSourceSecretFile: z.infer<typeof BuildSourceEnvVarInputSchema>;
	linkEnvGroupToBuildSource: z.infer<typeof BuildSourceEnvGroupInputSchema>;
	unlinkEnvGroupFromBuildSource: z.infer<typeof BuildSourceEnvGroupInputSchema>;
	validateBlueprint: z.infer<typeof CreateResourceInputSchema>;
	retrieveBlueprint: ResourceIdInput;
	updateBlueprint: z.infer<typeof ResourceBodyInputSchema>;
	listDedicatedIps: z.infer<typeof ResourceInputSchema>;
	createDedicatedIp: z.infer<typeof CreateResourceInputSchema>;
	retrieveDedicatedIp: ResourceIdInput;
	updateDedicatedIp: z.infer<typeof ResourceBodyInputSchema>;
	deleteDedicatedIp: ResourceIdInput;
	deletePostgres: ResourceIdInput;
	createPostgresExport: ResourceIdInput;
	createPostgresUser: z.infer<typeof ResourceBodyInputSchema>;
	listPostgresProcesses: ResourceIdInput;
	listPostgresTopQueries: ResourceIdInput;
	listPostgresSizes: ResourceIdInput;
	listPostgresTableScans: ResourceIdInput;
	createWorkflow: z.infer<typeof CreateResourceInputSchema>;
	retrieveWorkflow: ResourceIdInput;
	updateWorkflow: z.infer<typeof ResourceBodyInputSchema>;
	deleteWorkflow: ResourceIdInput;
	createWorkflowVersion: z.infer<typeof CreateResourceInputSchema>;
	retrieveWorkflowVersion: ResourceIdInput;
	retrieveTask: ResourceIdInput;
	createTaskRun: z.infer<typeof CreateResourceInputSchema>;
	retrieveTaskRun: ResourceIdInput;
	cancelTaskRun: ResourceIdInput;
};

export type RenderEndpointOutputs = {
	listServices: ListServicesOutput;
	createService: z.infer<typeof ResourceOutputSchema>;
	retrieveService: ServiceOutput;
	deleteService: z.infer<typeof EmptyOutputSchema>;
	updateService: ServiceOutput;
	// Stricter typing is not feasible because these commands return
	// provider-specific deployment acknowledgements.
	triggerDeploy: /* unknown: provider-specific deployment acknowledgement */ unknown;
	listDeploys: z.infer<typeof ResourceListOutputSchema>;
	purgeServiceCache: unknown;
	cancelDeploy: unknown;
	rollbackDeploy: unknown;
	listServiceEvents: z.infer<typeof ResourceListOutputSchema>;
	listOutboundIps: z.infer<typeof ResourceListOutputSchema>;
	listServiceJobs: z.infer<typeof ResourceListOutputSchema>;
	retrieveServiceJob: z.infer<typeof ResourceOutputSchema>;
	createServiceJob: z.infer<typeof ResourceOutputSchema>;
	cancelServiceJob: z.infer<typeof ResourceOutputSchema>;
	restartService: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	suspendService: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	resumeService: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	scaleService: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	updateAutoscaling: z.infer<typeof ResourceOutputSchema>;
	deleteAutoscaling: z.infer<typeof EmptyOutputSchema>;
	createServicePreview: z.infer<typeof ResourceOutputSchema>;
	deleteServiceHeader: z.infer<typeof EmptyOutputSchema>;
	patchServiceRoute: z.infer<typeof ResourceOutputSchema>;
	deleteServiceRoute: z.infer<typeof EmptyOutputSchema>;
	listServiceEnvVars: z.infer<typeof ResourceListOutputSchema>;
	deleteServiceEnvVar: z.infer<typeof EmptyOutputSchema>;
	listServiceHeaders: z.infer<typeof ResourceListOutputSchema>;
	listServiceCustomDomains: z.infer<typeof ResourceListOutputSchema>;
	deleteServiceCustomDomain: z.infer<typeof EmptyOutputSchema>;
	listEnvironments: z.infer<typeof ResourceListOutputSchema>;
	createEnvironment: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvironment: z.infer<typeof ResourceOutputSchema>;
	updateEnvironment: z.infer<typeof ResourceOutputSchema>;
	deleteEnvironment: z.infer<typeof EmptyOutputSchema>;
	removeResourcesFromEnvironment: z.infer<typeof EmptyOutputSchema>;
	listEnvGroups: z.infer<typeof ResourceListOutputSchema>;
	createEnvGroup: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvGroup: z.infer<typeof ResourceOutputSchema>;
	updateEnvGroup: z.infer<typeof ResourceOutputSchema>;
	deleteEnvGroup: z.infer<typeof EmptyOutputSchema>;
	unlinkServiceFromEnvGroup: z.infer<typeof EmptyOutputSchema>;
	listProjects: z.infer<typeof ResourceListOutputSchema>;
	createProject: z.infer<typeof ResourceOutputSchema>;
	retrieveProject: z.infer<typeof ResourceOutputSchema>;
	updateProject: z.infer<typeof ResourceOutputSchema>;
	deleteProject: z.infer<typeof EmptyOutputSchema>;
	listPostgres: z.infer<typeof ResourceListOutputSchema>;
	createPostgres: z.infer<typeof ResourceOutputSchema>;
	retrievePostgres: z.infer<typeof ResourceOutputSchema>;
	updatePostgres: z.infer<typeof ResourceOutputSchema>;
	restartPostgres: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	suspendPostgres: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	resumePostgres: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	failoverPostgres: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	retrievePostgresConnectionInfo: z.infer<typeof ResourceOutputSchema>;
	retrievePostgresRecoveryInfo: z.infer<typeof ResourceOutputSchema>;
	recoverPostgres: z.infer<typeof ResourceOutputSchema>;
	deletePostgresUser: z.infer<typeof EmptyOutputSchema>;
	listRegistryCredentials: z.infer<typeof ResourceListOutputSchema>;
	createRegistryCredential: z.infer<typeof ResourceOutputSchema>;
	retrieveRegistryCredential: z.infer<typeof ResourceOutputSchema>;
	updateRegistryCredential: z.infer<typeof ResourceOutputSchema>;
	deleteRegistryCredential: z.infer<typeof EmptyOutputSchema>;
	listOwners: z.infer<typeof ResourceListOutputSchema>;
	retrieveOwner: z.infer<typeof ResourceOutputSchema>;
	listOwnerMembers: z.infer<typeof ResourceListOutputSchema>;
	updateWorkspaceMember: z.infer<typeof ResourceOutputSchema>;
	removeWorkspaceMember: z.infer<typeof EmptyOutputSchema>;
	listOwnerAuditLogs: z.infer<typeof ResourceListOutputSchema>;
	listOrganizationAuditLogs: z.infer<typeof ResourceListOutputSchema>;
	getUser: z.infer<typeof ResourceOutputSchema>;
	listLogs: z.infer<typeof ResourceOutputSchema>;
	listLogsValues: z.infer<typeof ResourceOutputSchema>;
	listResourceLogStreams: z.infer<typeof ResourceListOutputSchema>;
	deleteOwnerLogStream: z.infer<typeof EmptyOutputSchema>;
	updateOwnerLogStream: z.infer<typeof ResourceOutputSchema>;
	retrieveOwnerLogStream: z.infer<typeof ResourceOutputSchema>;
	retrieveResourceLogStream: z.infer<typeof ResourceOutputSchema>;
	deleteResourceLogStream: z.infer<typeof EmptyOutputSchema>;
	getActiveConnections: z.infer<typeof ResourceOutputSchema>;
	getBandwidthSources: z.infer<typeof ResourceOutputSchema>;
	getCpu: z.infer<typeof ResourceOutputSchema>;
	getCpuLimit: z.infer<typeof ResourceOutputSchema>;
	getCpuTarget: z.infer<typeof ResourceOutputSchema>;
	getHttpRequests: z.infer<typeof ResourceOutputSchema>;
	getHttpLatency: z.infer<typeof ResourceOutputSchema>;
	getBandwidth: z.infer<typeof ResourceOutputSchema>;
	getReplicationLag: z.infer<typeof ResourceOutputSchema>;
	getDiskCapacity: z.infer<typeof ResourceOutputSchema>;
	getDiskUsage: z.infer<typeof ResourceOutputSchema>;
	getInstanceCount: z.infer<typeof ResourceOutputSchema>;
	getMemory: z.infer<typeof ResourceOutputSchema>;
	getMemoryLimit: z.infer<typeof ResourceOutputSchema>;
	getMemoryTarget: z.infer<typeof ResourceOutputSchema>;
	listApplicationFilterValues: z.infer<typeof ResourceListOutputSchema>;
	listHttpFilterValues: z.infer<typeof ResourceListOutputSchema>;
	listPathFilterValues: z.infer<typeof ResourceListOutputSchema>;
	getTaskRunsQueued: z.infer<typeof ResourceOutputSchema>;
	getTaskRunsCompleted: z.infer<typeof ResourceOutputSchema>;
	listDisks: z.infer<typeof ResourceListOutputSchema>;
	listMaintenance: z.infer<typeof ResourceListOutputSchema>;
	listTaskRuns: z.infer<typeof ResourceListOutputSchema>;
	listTasks: z.infer<typeof ResourceListOutputSchema>;
	listWorkflows: z.infer<typeof ResourceListOutputSchema>;
	listWorkflowVersions: z.infer<typeof ResourceListOutputSchema>;
	listWebhooks: z.infer<typeof ResourceListOutputSchema>;
	retrieveEvent: z.infer<typeof ResourceOutputSchema>;
	listWebhookEvents: z.infer<typeof ResourceListOutputSchema>;
	createDisk: z.infer<typeof ResourceOutputSchema>;
	retrieveDisk: z.infer<typeof ResourceOutputSchema>;
	updateDisk: z.infer<typeof ResourceOutputSchema>;
	deleteDisk: z.infer<typeof EmptyOutputSchema>;
	listDiskSnapshots: z.infer<typeof ResourceListOutputSchema>;
	restoreDiskSnapshot: z.infer<typeof ResourceOutputSchema>;
	retrieveMaintenance: z.infer<typeof ResourceOutputSchema>;
	updateMaintenance: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	triggerMaintenance: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	triggerCronJobRun: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	cancelCronJobRun: z.infer<typeof EmptyOutputSchema>;
	createWebhook: z.infer<typeof ResourceOutputSchema>;
	retrieveWebhook: z.infer<typeof ResourceOutputSchema>;
	updateWebhook: z.infer<typeof ResourceOutputSchema>;
	deleteWebhook: z.infer<typeof EmptyOutputSchema>;
	addHeaders: z.infer<typeof ResourceOutputSchema>;
	addOrUpdateSecretFile: z.infer<typeof ResourceOutputSchema>;
	addResourcesToEnvironment: z.infer<typeof ResourceOutputSchema>;
	addRoute: z.infer<typeof ResourceOutputSchema>;
	createCustomDomain: z.infer<typeof ResourceOutputSchema>;
	deleteEnvGroupEnvVar: z.infer<typeof EmptyOutputSchema>;
	deleteEnvGroupSecretFile: z.infer<typeof EmptyOutputSchema>;
	deleteKeyValue: z.infer<typeof EmptyOutputSchema>;
	deleteSecretFile: z.infer<typeof EmptyOutputSchema>;
	disconnectBlueprint: z.infer<typeof EmptyOutputSchema>;
	linkServiceToEnvGroup: z.infer<typeof ResourceOutputSchema>;
	listBlueprints: z.infer<typeof ResourceListOutputSchema>;
	listBlueprintSyncs: z.infer<typeof ResourceListOutputSchema>;
	suspendKeyValue: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	resumeKeyValue: /* unknown: provider-specific lifecycle acknowledgement */ unknown;
	retrieveKeyValueConnectionInfo: z.infer<typeof ResourceOutputSchema>;
	listInstances: z.infer<typeof ResourceListOutputSchema>;
	listKeyValue: z.infer<typeof ResourceListOutputSchema>;
	createKeyValue: z.infer<typeof ResourceOutputSchema>;
	retrieveKeyValue: z.infer<typeof ResourceOutputSchema>;
	updateKeyValue: z.infer<typeof ResourceOutputSchema>;
	listNotificationOverrides: z.infer<typeof ResourceListOutputSchema>;
	retrieveServiceNotificationOverrides: z.infer<typeof ResourceOutputSchema>;
	updateServiceNotificationOverrides: z.infer<typeof ResourceOutputSchema>;
	listPostgresExport: z.infer<typeof ResourceListOutputSchema>;
	listPostgresUsers: z.infer<typeof ResourceListOutputSchema>;
	listRoutes: z.infer<typeof ResourceListOutputSchema>;
	listSecretFiles: z.infer<typeof ResourceListOutputSchema>;
	retrieveCustomDomain: z.infer<typeof ResourceOutputSchema>;
	retrieveDeploy: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvGroupEnvVar: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvGroupSecretFile: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvVar: z.infer<typeof ResourceOutputSchema>;
	retrieveOwnerNotificationSettings: z.infer<typeof ResourceOutputSchema>;
	retrieveSecretFile: z.infer<typeof ResourceOutputSchema>;
	updateEnvGroupEnvVar: z.infer<typeof ResourceOutputSchema>;
	updateEnvGroupSecretFile: z.infer<typeof ResourceOutputSchema>;
	updateEnvVar: z.infer<typeof ResourceOutputSchema>;
	updateEnvVarsForService: z.infer<typeof ResourceOutputSchema>;
	updateHeaders: z.infer<typeof ResourceOutputSchema>;
	updateResourceLogStream: z.infer<typeof ResourceOutputSchema>;
	updateSecretFilesForService: z.infer<typeof ResourceOutputSchema>;
	verifyCustomDomain: z.infer<typeof ResourceOutputSchema>;
	deleteOwnerMetricsStream: z.infer<typeof EmptyOutputSchema>;
	retrieveOwnerMetricsStream: z.infer<typeof ResourceOutputSchema>;
	upsertOwnerMetricsStream: z.infer<typeof ResourceOutputSchema>;
	updateOwnerNotificationSettings: z.infer<typeof ResourceOutputSchema>;
	updateRoutes: z.infer<typeof ResourceOutputSchema>;
	createBuildSource: z.infer<typeof ResourceOutputSchema>;
	listBuildSources: z.infer<typeof ResourceListOutputSchema>;
	retrieveBuildSource: z.infer<typeof ResourceOutputSchema>;
	updateBuildSource: z.infer<typeof ResourceOutputSchema>;
	deleteBuildSource: z.infer<typeof EmptyOutputSchema>;
	listBuildSourceBuilds: z.infer<typeof ResourceListOutputSchema>;
	triggerBuildSourceBuild: z.infer<typeof ResourceOutputSchema>;
	retrieveBuildSourceBuild: z.infer<typeof ResourceOutputSchema>;
	listBuildSourceEnvVars: z.infer<typeof ResourceListOutputSchema>;
	updateBuildSourceEnvVars: z.infer<typeof ResourceListOutputSchema>;
	retrieveBuildSourceEnvVar: z.infer<typeof ResourceOutputSchema>;
	updateBuildSourceEnvVar: z.infer<typeof ResourceOutputSchema>;
	deleteBuildSourceEnvVar: z.infer<typeof EmptyOutputSchema>;
	listBuildSourceSecretFiles: z.infer<typeof ResourceListOutputSchema>;
	updateBuildSourceSecretFiles: z.infer<typeof ResourceListOutputSchema>;
	retrieveBuildSourceSecretFile: z.infer<typeof ResourceOutputSchema>;
	updateBuildSourceSecretFile: z.infer<typeof ResourceOutputSchema>;
	deleteBuildSourceSecretFile: z.infer<typeof EmptyOutputSchema>;
	linkEnvGroupToBuildSource: z.infer<typeof ResourceOutputSchema>;
	unlinkEnvGroupFromBuildSource: z.infer<typeof EmptyOutputSchema>;
	validateBlueprint: z.infer<typeof ResourceOutputSchema>;
	retrieveBlueprint: z.infer<typeof ResourceOutputSchema>;
	updateBlueprint: z.infer<typeof ResourceOutputSchema>;
	listDedicatedIps: z.infer<typeof ResourceListOutputSchema>;
	createDedicatedIp: z.infer<typeof ResourceOutputSchema>;
	retrieveDedicatedIp: z.infer<typeof ResourceOutputSchema>;
	updateDedicatedIp: z.infer<typeof ResourceOutputSchema>;
	deleteDedicatedIp: z.infer<typeof EmptyOutputSchema>;
	deletePostgres: z.infer<typeof EmptyOutputSchema>;
	createPostgresExport: z.infer<typeof ResourceOutputSchema>;
	createPostgresUser: z.infer<typeof ResourceOutputSchema>;
	listPostgresProcesses: z.infer<typeof ResourceListOutputSchema>;
	listPostgresTopQueries: z.infer<typeof ResourceListOutputSchema>;
	listPostgresSizes: z.infer<typeof ResourceListOutputSchema>;
	listPostgresTableScans: z.infer<typeof ResourceListOutputSchema>;
	createWorkflow: z.infer<typeof ResourceOutputSchema>;
	retrieveWorkflow: z.infer<typeof ResourceOutputSchema>;
	updateWorkflow: z.infer<typeof ResourceOutputSchema>;
	deleteWorkflow: z.infer<typeof EmptyOutputSchema>;
	createWorkflowVersion: z.infer<typeof ResourceOutputSchema>;
	retrieveWorkflowVersion: z.infer<typeof ResourceOutputSchema>;
	retrieveTask: z.infer<typeof ResourceOutputSchema>;
	createTaskRun: z.infer<typeof ResourceOutputSchema>;
	retrieveTaskRun: z.infer<typeof ResourceOutputSchema>;
	cancelTaskRun: z.infer<typeof EmptyOutputSchema>;
};

export const RenderEndpointInputSchemas = {
	listServices: ListServicesInputSchema,
	createService: CreateServiceInputSchema,
	retrieveService: ServiceIdInputSchema,
	deleteService: ServiceIdInputSchema,
	updateService: ServiceIdInputSchema.extend({
		name: z.string().min(1).optional(),
		autoDeployTrigger: z.string().optional(),
	}),
	triggerDeploy: TriggerDeployInputSchema,
	listDeploys: ListDeploysInputSchema,
	purgeServiceCache: ServiceIdInputSchema,
	cancelDeploy: CancelDeployInputSchema,
	rollbackDeploy: RollbackDeployInputSchema,
	listServiceEvents: ServiceIdInputSchema,
	listOutboundIps: ServiceIdInputSchema,
	listServiceJobs: ServiceIdInputSchema,
	retrieveServiceJob: ServiceJobInputSchema,
	createServiceJob: ServiceJobStartInputSchema,
	cancelServiceJob: ServiceJobInputSchema,
	restartService: ServiceIdInputSchema,
	suspendService: ServiceIdInputSchema,
	resumeService: ServiceIdInputSchema,
	scaleService: ScaleServiceInputSchema,
	updateAutoscaling: UpdateAutoscalingInputSchema,
	deleteAutoscaling: ServiceIdInputSchema,
	createServicePreview: PreviewServiceInputSchema,
	deleteServiceHeader: ServiceHeaderInputSchema,
	patchServiceRoute: PatchServiceRouteInputSchema,
	deleteServiceRoute: ServiceRouteInputSchema,
	listServiceEnvVars: ServiceQueryInputSchema,
	deleteServiceEnvVar: ServiceEnvVarInputSchema,
	listServiceHeaders: ServiceHeadersInputSchema,
	listServiceCustomDomains: ServiceCustomDomainsInputSchema,
	deleteServiceCustomDomain: ServiceCustomDomainInputSchema,
	listEnvironments: ResourceInputSchema,
	createEnvironment: ResourceInputSchema,
	retrieveEnvironment: ResourceIdInputSchema,
	updateEnvironment: ResourceIdInputSchema,
	deleteEnvironment: ResourceIdInputSchema,
	removeResourcesFromEnvironment: EnvironmentResourcesInputSchema,
	listEnvGroups: ResourceInputSchema,
	createEnvGroup: ResourceInputSchema,
	retrieveEnvGroup: ResourceIdInputSchema,
	updateEnvGroup: ResourceIdInputSchema,
	deleteEnvGroup: ResourceIdInputSchema,
	unlinkServiceFromEnvGroup: EnvGroupServiceInputSchema,
	listProjects: ResourceInputSchema,
	createProject: ResourceInputSchema,
	retrieveProject: ResourceIdInputSchema,
	updateProject: ResourceIdInputSchema,
	deleteProject: ResourceIdInputSchema,
	listPostgres: ResourceInputSchema,
	createPostgres: ResourceInputSchema,
	retrievePostgres: ResourceIdInputSchema,
	updatePostgres: ResourceIdInputSchema,
	restartPostgres: ResourceIdInputSchema,
	suspendPostgres: ResourceIdInputSchema,
	resumePostgres: ResourceIdInputSchema,
	failoverPostgres: ResourceIdInputSchema,
	retrievePostgresConnectionInfo: ResourceIdInputSchema,
	retrievePostgresRecoveryInfo: ResourceIdInputSchema,
	recoverPostgres: RecoverPostgresInputSchema,
	deletePostgresUser: PostgresUsernameInputSchema,
	listRegistryCredentials: ResourceInputSchema,
	createRegistryCredential: ResourceInputSchema,
	retrieveRegistryCredential: ResourceIdInputSchema,
	updateRegistryCredential: ResourceIdInputSchema,
	deleteRegistryCredential: ResourceIdInputSchema,
	listOwners: ResourceInputSchema,
	retrieveOwner: ResourceIdInputSchema,
	listOwnerMembers: ResourceIdInputSchema,
	updateWorkspaceMember: UpdateWorkspaceMemberInputSchema,
	removeWorkspaceMember: WorkspaceMemberInputSchema,
	listOwnerAuditLogs: AuditLogsInputSchema,
	listOrganizationAuditLogs: AuditLogsInputSchema,
	getUser: ResourceInputSchema,
	listLogs: ResourceInputSchema,
	listLogsValues: ResourceInputSchema,
	listResourceLogStreams: ResourceInputSchema,
	deleteOwnerLogStream: ResourceIdInputSchema,
	updateOwnerLogStream: ResourceIdInputSchema,
	retrieveOwnerLogStream: OwnerIdInputSchema,
	retrieveResourceLogStream: ResourceIdPathInputSchema,
	deleteResourceLogStream: ResourceIdPathInputSchema,
	getActiveConnections: ResourceInputSchema,
	getBandwidthSources: ResourceInputSchema,
	getCpu: ResourceInputSchema,
	getCpuLimit: ResourceInputSchema,
	getCpuTarget: ResourceInputSchema,
	getHttpRequests: ResourceInputSchema,
	getHttpLatency: ResourceInputSchema,
	getBandwidth: ResourceInputSchema,
	getReplicationLag: ResourceInputSchema,
	getDiskCapacity: ResourceInputSchema,
	getDiskUsage: ResourceInputSchema,
	getInstanceCount: ResourceInputSchema,
	getMemory: ResourceInputSchema,
	getMemoryLimit: ResourceInputSchema,
	getMemoryTarget: ResourceInputSchema,
	listApplicationFilterValues: ResourceInputSchema,
	listHttpFilterValues: ResourceInputSchema,
	listPathFilterValues: ResourceInputSchema,
	getTaskRunsQueued: ResourceInputSchema,
	getTaskRunsCompleted: ResourceInputSchema,
	listDisks: ResourceInputSchema,
	listMaintenance: ResourceInputSchema,
	listTaskRuns: ResourceInputSchema,
	listTasks: ResourceInputSchema,
	listWorkflows: ResourceInputSchema,
	listWorkflowVersions: ResourceInputSchema,
	listWebhooks: ResourceInputSchema,
	retrieveEvent: EventIdInputSchema,
	listWebhookEvents: WebhookEventsInputSchema,
	createDisk: CreateDiskInputSchema,
	retrieveDisk: ResourceIdInputSchema,
	updateDisk: UpdateDiskInputSchema,
	deleteDisk: ResourceIdInputSchema,
	listDiskSnapshots: ResourceIdInputSchema,
	restoreDiskSnapshot: RestoreDiskSnapshotInputSchema,
	retrieveMaintenance: ResourceIdInputSchema,
	updateMaintenance: UpdateMaintenanceInputSchema,
	triggerMaintenance: ResourceIdInputSchema,
	triggerCronJobRun: ResourceIdInputSchema,
	cancelCronJobRun: CronJobIdInputSchema,
	createWebhook: CreateWebhookInputSchema,
	retrieveWebhook: ResourceIdInputSchema,
	updateWebhook: UpdateWebhookInputSchema,
	deleteWebhook: ResourceIdInputSchema,
	addHeaders: ResourceIdInputSchema,
	addOrUpdateSecretFile: ResourceIdKeyInputSchema,
	addResourcesToEnvironment: ResourceIdInputSchema,
	addRoute: ResourceIdInputSchema,
	createCustomDomain: ResourceIdInputSchema,
	deleteEnvGroupEnvVar: ResourceIdKeyInputSchema,
	deleteEnvGroupSecretFile: ResourceIdKeyInputSchema,
	deleteKeyValue: ResourceIdInputSchema,
	deleteSecretFile: ResourceIdKeyInputSchema,
	disconnectBlueprint: ResourceIdInputSchema,
	linkServiceToEnvGroup: ResourceIdServiceIdInputSchema,
	listBlueprints: ResourceInputSchema,
	listBlueprintSyncs: BlueprintSyncsInputSchema,
	suspendKeyValue: ResourceIdInputSchema,
	resumeKeyValue: ResourceIdInputSchema,
	retrieveKeyValueConnectionInfo: ResourceIdInputSchema,
	listInstances: ResourceIdInputSchema,
	listKeyValue: ResourceInputSchema,
	createKeyValue: CreateKeyValueInputSchema,
	retrieveKeyValue: KeyValueIdInputSchema,
	updateKeyValue: UpdateKeyValueInputSchema,
	listNotificationOverrides: ResourceInputSchema,
	retrieveServiceNotificationOverrides: ServiceNotificationOverrideInputSchema,
	updateServiceNotificationOverrides:
		UpdateServiceNotificationOverrideInputSchema,
	listPostgresExport: ResourceIdInputSchema,
	listPostgresUsers: ResourceIdInputSchema,
	listRoutes: ResourceIdInputSchema,
	listSecretFiles: ResourceIdInputSchema,
	retrieveCustomDomain: ResourceIdKeyInputSchema,
	retrieveDeploy: ResourceIdKeyInputSchema,
	retrieveEnvGroupEnvVar: ResourceIdKeyInputSchema,
	retrieveEnvGroupSecretFile: ResourceIdKeyInputSchema,
	retrieveEnvVar: ResourceIdKeyInputSchema,
	retrieveOwnerNotificationSettings: ResourceIdInputSchema,
	retrieveSecretFile: ResourceIdKeyInputSchema,
	updateEnvGroupEnvVar: ResourceIdKeyInputSchema,
	updateEnvGroupSecretFile: ResourceIdKeyInputSchema,
	updateEnvVar: ResourceIdKeyInputSchema,
	updateEnvVarsForService: ResourceIdInputSchema,
	updateHeaders: ResourceIdInputSchema,
	updateResourceLogStream: ResourceIdInputSchema,
	updateSecretFilesForService: ResourceIdInputSchema,
	verifyCustomDomain: ResourceIdKeyInputSchema,
	deleteOwnerMetricsStream: ResourceIdInputSchema,
	retrieveOwnerMetricsStream: OwnerIdInputSchema,
	upsertOwnerMetricsStream: OwnerMetricsStreamInputSchema,
	updateOwnerNotificationSettings: ResourceIdInputSchema,
	updateRoutes: ResourceIdInputSchema,
	createBuildSource: CreateBuildSourceInputSchema,
	listBuildSources: ResourceInputSchema,
	retrieveBuildSource: BuildSourceIdInputSchema,
	updateBuildSource: BuildSourceBodyInputSchema,
	deleteBuildSource: BuildSourceIdInputSchema,
	listBuildSourceBuilds: BuildSourceIdInputSchema,
	triggerBuildSourceBuild: BuildSourceIdInputSchema,
	retrieveBuildSourceBuild: BuildSourceBuildInputSchema,
	listBuildSourceEnvVars: BuildSourceIdInputSchema,
	updateBuildSourceEnvVars: BuildSourceBodyInputSchema,
	retrieveBuildSourceEnvVar: BuildSourceEnvVarInputSchema,
	updateBuildSourceEnvVar: BuildSourceEnvVarBodyInputSchema,
	deleteBuildSourceEnvVar: BuildSourceEnvVarInputSchema,
	listBuildSourceSecretFiles: BuildSourceIdInputSchema,
	updateBuildSourceSecretFiles: BuildSourceBodyInputSchema,
	retrieveBuildSourceSecretFile: BuildSourceEnvVarInputSchema,
	updateBuildSourceSecretFile: BuildSourceEnvVarBodyInputSchema,
	deleteBuildSourceSecretFile: BuildSourceEnvVarInputSchema,
	linkEnvGroupToBuildSource: BuildSourceEnvGroupInputSchema,
	unlinkEnvGroupFromBuildSource: BuildSourceEnvGroupInputSchema,
	validateBlueprint: CreateResourceInputSchema,
	retrieveBlueprint: ResourceIdInputSchema,
	updateBlueprint: ResourceBodyInputSchema,
	listDedicatedIps: ResourceInputSchema,
	createDedicatedIp: CreateResourceInputSchema,
	retrieveDedicatedIp: ResourceIdInputSchema,
	updateDedicatedIp: ResourceBodyInputSchema,
	deleteDedicatedIp: ResourceIdInputSchema,
	deletePostgres: ResourceIdInputSchema,
	createPostgresExport: ResourceIdInputSchema,
	createPostgresUser: ResourceBodyInputSchema,
	listPostgresProcesses: ResourceIdInputSchema,
	listPostgresTopQueries: ResourceIdInputSchema,
	listPostgresSizes: ResourceIdInputSchema,
	listPostgresTableScans: ResourceIdInputSchema,
	createWorkflow: CreateResourceInputSchema,
	retrieveWorkflow: ResourceIdInputSchema,
	updateWorkflow: ResourceBodyInputSchema,
	deleteWorkflow: ResourceIdInputSchema,
	createWorkflowVersion: CreateResourceInputSchema,
	retrieveWorkflowVersion: ResourceIdInputSchema,
	retrieveTask: ResourceIdInputSchema,
	createTaskRun: CreateResourceInputSchema,
	retrieveTaskRun: ResourceIdInputSchema,
	cancelTaskRun: ResourceIdInputSchema,
} as const;

export const RenderEndpointOutputSchemas = {
	listServices: ListServicesOutputSchema,
	createService: ResourceOutputSchema,
	retrieveService: ServiceOutputSchema,
	deleteService: EmptyOutputSchema,
	updateService: ServiceOutputSchema,
	// unknown: lifecycle acknowledgements differ by Render service type.
	triggerDeploy:
		/* unknown: provider-specific deployment acknowledgement */ z.unknown(),
	listDeploys: ResourceListOutputSchema,
	purgeServiceCache: z.unknown(),
	cancelDeploy: z.unknown(),
	rollbackDeploy: z.unknown(),
	listServiceEvents: ResourceListOutputSchema,
	listOutboundIps: ResourceListOutputSchema,
	listServiceJobs: ResourceListOutputSchema,
	retrieveServiceJob: ResourceOutputSchema,
	createServiceJob: ResourceOutputSchema,
	cancelServiceJob: ResourceOutputSchema,
	restartService:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	suspendService:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	resumeService:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	scaleService:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	updateAutoscaling: ResourceOutputSchema,
	deleteAutoscaling: EmptyOutputSchema,
	createServicePreview: ResourceOutputSchema,
	deleteServiceHeader: EmptyOutputSchema,
	patchServiceRoute: ResourceOutputSchema,
	deleteServiceRoute: EmptyOutputSchema,
	listServiceEnvVars: ResourceListOutputSchema,
	deleteServiceEnvVar: EmptyOutputSchema,
	listServiceHeaders: ResourceListOutputSchema,
	listServiceCustomDomains: ResourceListOutputSchema,
	deleteServiceCustomDomain: EmptyOutputSchema,
	listEnvironments: ResourceListOutputSchema,
	createEnvironment: ResourceOutputSchema,
	retrieveEnvironment: ResourceOutputSchema,
	updateEnvironment: ResourceOutputSchema,
	deleteEnvironment: EmptyOutputSchema,
	removeResourcesFromEnvironment: EmptyOutputSchema,
	listEnvGroups: ResourceListOutputSchema,
	createEnvGroup: ResourceOutputSchema,
	retrieveEnvGroup: ResourceOutputSchema,
	updateEnvGroup: ResourceOutputSchema,
	deleteEnvGroup: EmptyOutputSchema,
	unlinkServiceFromEnvGroup: EmptyOutputSchema,
	listProjects: ResourceListOutputSchema,
	createProject: ResourceOutputSchema,
	retrieveProject: ResourceOutputSchema,
	updateProject: ResourceOutputSchema,
	deleteProject: EmptyOutputSchema,
	listPostgres: ResourceListOutputSchema,
	createPostgres: ResourceOutputSchema,
	retrievePostgres: ResourceOutputSchema,
	updatePostgres: ResourceOutputSchema,
	restartPostgres:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	suspendPostgres:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	resumePostgres:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	failoverPostgres:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	retrievePostgresConnectionInfo: ResourceOutputSchema,
	retrievePostgresRecoveryInfo: ResourceOutputSchema,
	recoverPostgres: ResourceOutputSchema,
	deletePostgresUser: EmptyOutputSchema,
	listRegistryCredentials: ResourceListOutputSchema,
	createRegistryCredential: ResourceOutputSchema,
	retrieveRegistryCredential: ResourceOutputSchema,
	updateRegistryCredential: ResourceOutputSchema,
	deleteRegistryCredential: EmptyOutputSchema,
	listOwners: ResourceListOutputSchema,
	retrieveOwner: ResourceOutputSchema,
	listOwnerMembers: ResourceListOutputSchema,
	updateWorkspaceMember: ResourceOutputSchema,
	removeWorkspaceMember: EmptyOutputSchema,
	listOwnerAuditLogs: ResourceListOutputSchema,
	listOrganizationAuditLogs: ResourceListOutputSchema,
	getUser: ResourceOutputSchema,
	listLogs: ResourceOutputSchema,
	listLogsValues: ResourceOutputSchema,
	listResourceLogStreams: ResourceListOutputSchema,
	deleteOwnerLogStream: EmptyOutputSchema,
	updateOwnerLogStream: ResourceOutputSchema,
	retrieveOwnerLogStream: ResourceOutputSchema,
	retrieveResourceLogStream: ResourceOutputSchema,
	deleteResourceLogStream: EmptyOutputSchema,
	getActiveConnections: ResourceOutputSchema,
	getBandwidthSources: ResourceOutputSchema,
	getCpu: ResourceOutputSchema,
	getCpuLimit: ResourceOutputSchema,
	getCpuTarget: ResourceOutputSchema,
	getHttpRequests: ResourceOutputSchema,
	getHttpLatency: ResourceOutputSchema,
	getBandwidth: ResourceOutputSchema,
	getReplicationLag: ResourceOutputSchema,
	getDiskCapacity: ResourceOutputSchema,
	getDiskUsage: ResourceOutputSchema,
	getInstanceCount: ResourceOutputSchema,
	getMemory: ResourceOutputSchema,
	getMemoryLimit: ResourceOutputSchema,
	getMemoryTarget: ResourceOutputSchema,
	listApplicationFilterValues: ResourceListOutputSchema,
	listHttpFilterValues: ResourceListOutputSchema,
	listPathFilterValues: ResourceListOutputSchema,
	getTaskRunsQueued: ResourceOutputSchema,
	getTaskRunsCompleted: ResourceOutputSchema,
	listDisks: ResourceListOutputSchema,
	listMaintenance: ResourceListOutputSchema,
	listTaskRuns: ResourceListOutputSchema,
	listTasks: ResourceListOutputSchema,
	listWorkflows: ResourceListOutputSchema,
	listWorkflowVersions: ResourceListOutputSchema,
	listWebhooks: ResourceListOutputSchema,
	retrieveEvent: ResourceOutputSchema,
	listWebhookEvents: ResourceListOutputSchema,
	createDisk: ResourceOutputSchema,
	retrieveDisk: ResourceOutputSchema,
	updateDisk: ResourceOutputSchema,
	deleteDisk: EmptyOutputSchema,
	listDiskSnapshots: ResourceListOutputSchema,
	restoreDiskSnapshot: ResourceOutputSchema,
	retrieveMaintenance: ResourceOutputSchema,
	updateMaintenance:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	triggerMaintenance:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	triggerCronJobRun:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	cancelCronJobRun: EmptyOutputSchema,
	createWebhook: ResourceOutputSchema,
	retrieveWebhook: ResourceOutputSchema,
	updateWebhook: ResourceOutputSchema,
	deleteWebhook: EmptyOutputSchema,
	addHeaders: ResourceOutputSchema,
	addOrUpdateSecretFile: ResourceOutputSchema,
	addResourcesToEnvironment: ResourceOutputSchema,
	addRoute: ResourceOutputSchema,
	createCustomDomain: ResourceOutputSchema,
	deleteEnvGroupEnvVar: EmptyOutputSchema,
	deleteEnvGroupSecretFile: EmptyOutputSchema,
	deleteKeyValue: EmptyOutputSchema,
	deleteSecretFile: EmptyOutputSchema,
	disconnectBlueprint: EmptyOutputSchema,
	linkServiceToEnvGroup: ResourceOutputSchema,
	listBlueprints: ResourceListOutputSchema,
	listBlueprintSyncs: ResourceListOutputSchema,
	suspendKeyValue:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	resumeKeyValue:
		/* unknown: provider-specific lifecycle acknowledgement */ z.unknown(),
	retrieveKeyValueConnectionInfo: ResourceOutputSchema,
	listInstances: ResourceListOutputSchema,
	listKeyValue: ResourceListOutputSchema,
	createKeyValue: ResourceOutputSchema,
	retrieveKeyValue: ResourceOutputSchema,
	updateKeyValue: ResourceOutputSchema,
	listNotificationOverrides: ResourceListOutputSchema,
	retrieveServiceNotificationOverrides: ResourceOutputSchema,
	updateServiceNotificationOverrides: ResourceOutputSchema,
	listPostgresExport: ResourceListOutputSchema,
	listPostgresUsers: ResourceListOutputSchema,
	listRoutes: ResourceListOutputSchema,
	listSecretFiles: ResourceListOutputSchema,
	retrieveCustomDomain: ResourceOutputSchema,
	retrieveDeploy: ResourceOutputSchema,
	retrieveEnvGroupEnvVar: ResourceOutputSchema,
	retrieveEnvGroupSecretFile: ResourceOutputSchema,
	retrieveEnvVar: ResourceOutputSchema,
	retrieveOwnerNotificationSettings: ResourceOutputSchema,
	retrieveSecretFile: ResourceOutputSchema,
	updateEnvGroupEnvVar: ResourceOutputSchema,
	updateEnvGroupSecretFile: ResourceOutputSchema,
	updateEnvVar: ResourceOutputSchema,
	updateEnvVarsForService: ResourceOutputSchema,
	updateHeaders: ResourceOutputSchema,
	updateResourceLogStream: ResourceOutputSchema,
	updateSecretFilesForService: ResourceOutputSchema,
	verifyCustomDomain: ResourceOutputSchema,
	deleteOwnerMetricsStream: EmptyOutputSchema,
	retrieveOwnerMetricsStream: ResourceOutputSchema,
	upsertOwnerMetricsStream: ResourceOutputSchema,
	updateOwnerNotificationSettings: ResourceOutputSchema,
	updateRoutes: ResourceOutputSchema,
	createBuildSource: ResourceOutputSchema,
	listBuildSources: ResourceListOutputSchema,
	retrieveBuildSource: ResourceOutputSchema,
	updateBuildSource: ResourceOutputSchema,
	deleteBuildSource: EmptyOutputSchema,
	listBuildSourceBuilds: ResourceListOutputSchema,
	triggerBuildSourceBuild: ResourceOutputSchema,
	retrieveBuildSourceBuild: ResourceOutputSchema,
	listBuildSourceEnvVars: ResourceListOutputSchema,
	updateBuildSourceEnvVars: ResourceListOutputSchema,
	retrieveBuildSourceEnvVar: ResourceOutputSchema,
	updateBuildSourceEnvVar: ResourceOutputSchema,
	deleteBuildSourceEnvVar: EmptyOutputSchema,
	listBuildSourceSecretFiles: ResourceListOutputSchema,
	updateBuildSourceSecretFiles: ResourceListOutputSchema,
	retrieveBuildSourceSecretFile: ResourceOutputSchema,
	updateBuildSourceSecretFile: ResourceOutputSchema,
	deleteBuildSourceSecretFile: EmptyOutputSchema,
	linkEnvGroupToBuildSource: ResourceOutputSchema,
	unlinkEnvGroupFromBuildSource: EmptyOutputSchema,
	validateBlueprint: ResourceOutputSchema,
	retrieveBlueprint: ResourceOutputSchema,
	updateBlueprint: ResourceOutputSchema,
	listDedicatedIps: ResourceListOutputSchema,
	createDedicatedIp: ResourceOutputSchema,
	retrieveDedicatedIp: ResourceOutputSchema,
	updateDedicatedIp: ResourceOutputSchema,
	deleteDedicatedIp: EmptyOutputSchema,
	deletePostgres: EmptyOutputSchema,
	createPostgresExport: ResourceOutputSchema,
	createPostgresUser: ResourceOutputSchema,
	listPostgresProcesses: ResourceListOutputSchema,
	listPostgresTopQueries: ResourceListOutputSchema,
	listPostgresSizes: ResourceListOutputSchema,
	listPostgresTableScans: ResourceListOutputSchema,
	createWorkflow: ResourceOutputSchema,
	retrieveWorkflow: ResourceOutputSchema,
	updateWorkflow: ResourceOutputSchema,
	deleteWorkflow: EmptyOutputSchema,
	createWorkflowVersion: ResourceOutputSchema,
	retrieveWorkflowVersion: ResourceOutputSchema,
	retrieveTask: ResourceOutputSchema,
	createTaskRun: ResourceOutputSchema,
	retrieveTaskRun: ResourceOutputSchema,
	cancelTaskRun: EmptyOutputSchema,
} as const;
