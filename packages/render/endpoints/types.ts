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
	runtime: z.array(z.string()).optional(),
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

export type ListServicesInput = z.infer<typeof ListServicesInputSchema>;
export type ListServicesOutput = z.infer<typeof ListServicesOutputSchema>;
export type ServiceIdInput = z.infer<typeof ServiceIdInputSchema>;
export type ServiceOutput = z.infer<typeof ServiceOutputSchema>;
type ResourceInput = z.infer<typeof ResourceInputSchema>;
type ResourceIdInput = z.infer<typeof ResourceIdInputSchema>;
type ResourceIdKeyInput = z.infer<typeof ResourceIdKeyInputSchema>;

export type RenderEndpointInputs = {
	listServices: ListServicesInput;
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
	listEnvironments: z.infer<typeof ResourceInputSchema>;
	createEnvironment: z.infer<typeof ResourceInputSchema>;
	retrieveEnvironment: ResourceIdInput;
	updateEnvironment: ResourceIdInput;
	deleteEnvironment: ResourceIdInput;
	listEnvGroups: z.infer<typeof ResourceInputSchema>;
	createEnvGroup: z.infer<typeof ResourceInputSchema>;
	retrieveEnvGroup: ResourceIdInput;
	updateEnvGroup: ResourceIdInput;
	deleteEnvGroup: ResourceIdInput;
	listProjects: z.infer<typeof ResourceInputSchema>;
	createProject: z.infer<typeof ResourceInputSchema>;
	retrieveProject: ResourceIdInput;
	updateProject: ResourceIdInput;
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
	listOwnerAuditLogs: z.infer<typeof AuditLogsInputSchema>;
	listOrganizationAuditLogs: z.infer<typeof AuditLogsInputSchema>;
	getUser: z.infer<typeof ResourceInputSchema>;
	listLogs: z.infer<typeof ResourceInputSchema>;
	listLogsValues: z.infer<typeof ResourceInputSchema>;
	subscribeLogs: z.infer<typeof ResourceInputSchema>;
	listResourceLogStreams: z.infer<typeof ResourceInputSchema>;
	deleteOwnerLogStream: ResourceIdInput;
	updateOwnerLogStream: ResourceIdInput;
	getActiveConnections: z.infer<typeof ResourceInputSchema>;
	getBandwidthSources: z.infer<typeof ResourceInputSchema>;
	getCpu: z.infer<typeof ResourceInputSchema>;
	getCpuLimit: z.infer<typeof ResourceInputSchema>;
	getDiskCapacity: z.infer<typeof ResourceInputSchema>;
	getDiskUsage: z.infer<typeof ResourceInputSchema>;
	getInstanceCount: z.infer<typeof ResourceInputSchema>;
	getMemory: z.infer<typeof ResourceInputSchema>;
	getMemoryLimit: z.infer<typeof ResourceInputSchema>;
	getMemoryTarget: z.infer<typeof ResourceInputSchema>;
	listApplicationFilterValues: z.infer<typeof ResourceInputSchema>;
	listDisks: z.infer<typeof ResourceInputSchema>;
	listMaintenance: z.infer<typeof ResourceInputSchema>;
	listTaskRuns: z.infer<typeof ResourceInputSchema>;
	listTasks: z.infer<typeof ResourceInputSchema>;
	streamTaskRunsEvents: z.infer<typeof ResourceInputSchema>;
	listWorkflows: z.infer<typeof ResourceInputSchema>;
	listWorkflowVersions: z.infer<typeof ResourceInputSchema>;
	listWebhooks: z.infer<typeof ResourceInputSchema>;
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
	listNotificationOverrides: z.infer<typeof ResourceInputSchema>;
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
	updateOwnerNotificationSettings: ResourceIdInput;
	updateRoutes: ResourceIdInput;
};

export type RenderEndpointOutputs = {
	listServices: ListServicesOutput;
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
	listEnvironments: z.infer<typeof ResourceListOutputSchema>;
	createEnvironment: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvironment: z.infer<typeof ResourceOutputSchema>;
	updateEnvironment: z.infer<typeof ResourceOutputSchema>;
	deleteEnvironment: z.infer<typeof EmptyOutputSchema>;
	listEnvGroups: z.infer<typeof ResourceListOutputSchema>;
	createEnvGroup: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvGroup: z.infer<typeof ResourceOutputSchema>;
	updateEnvGroup: z.infer<typeof ResourceOutputSchema>;
	deleteEnvGroup: z.infer<typeof EmptyOutputSchema>;
	listProjects: z.infer<typeof ResourceListOutputSchema>;
	createProject: z.infer<typeof ResourceOutputSchema>;
	retrieveProject: z.infer<typeof ResourceOutputSchema>;
	updateProject: z.infer<typeof ResourceOutputSchema>;
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
	listOwnerAuditLogs: z.infer<typeof ResourceListOutputSchema>;
	listOrganizationAuditLogs: z.infer<typeof ResourceListOutputSchema>;
	getUser: z.infer<typeof ResourceOutputSchema>;
	listLogs: z.infer<typeof ResourceOutputSchema>;
	listLogsValues: z.infer<typeof ResourceOutputSchema>;
	subscribeLogs: z.infer<typeof ResourceOutputSchema>;
	listResourceLogStreams: z.infer<typeof ResourceListOutputSchema>;
	deleteOwnerLogStream: z.infer<typeof EmptyOutputSchema>;
	updateOwnerLogStream: z.infer<typeof ResourceOutputSchema>;
	getActiveConnections: z.infer<typeof ResourceOutputSchema>;
	getBandwidthSources: z.infer<typeof ResourceOutputSchema>;
	getCpu: z.infer<typeof ResourceOutputSchema>;
	getCpuLimit: z.infer<typeof ResourceOutputSchema>;
	getDiskCapacity: z.infer<typeof ResourceOutputSchema>;
	getDiskUsage: z.infer<typeof ResourceOutputSchema>;
	getInstanceCount: z.infer<typeof ResourceOutputSchema>;
	getMemory: z.infer<typeof ResourceOutputSchema>;
	getMemoryLimit: z.infer<typeof ResourceOutputSchema>;
	getMemoryTarget: z.infer<typeof ResourceOutputSchema>;
	listApplicationFilterValues: z.infer<typeof ResourceListOutputSchema>;
	listDisks: z.infer<typeof ResourceListOutputSchema>;
	listMaintenance: z.infer<typeof ResourceListOutputSchema>;
	listTaskRuns: z.infer<typeof ResourceListOutputSchema>;
	listTasks: z.infer<typeof ResourceListOutputSchema>;
	streamTaskRunsEvents: { data: string };
	listWorkflows: z.infer<typeof ResourceListOutputSchema>;
	listWorkflowVersions: z.infer<typeof ResourceListOutputSchema>;
	listWebhooks: z.infer<typeof ResourceListOutputSchema>;
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
	listNotificationOverrides: z.infer<typeof ResourceListOutputSchema>;
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
	updateOwnerNotificationSettings: z.infer<typeof ResourceOutputSchema>;
	updateRoutes: z.infer<typeof ResourceOutputSchema>;
};

export const RenderEndpointInputSchemas = {
	listServices: ListServicesInputSchema,
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
	listEnvironments: ResourceInputSchema,
	createEnvironment: ResourceInputSchema,
	retrieveEnvironment: ResourceIdInputSchema,
	updateEnvironment: ResourceIdInputSchema,
	deleteEnvironment: ResourceIdInputSchema,
	listEnvGroups: ResourceInputSchema,
	createEnvGroup: ResourceInputSchema,
	retrieveEnvGroup: ResourceIdInputSchema,
	updateEnvGroup: ResourceIdInputSchema,
	deleteEnvGroup: ResourceIdInputSchema,
	listProjects: ResourceInputSchema,
	createProject: ResourceInputSchema,
	retrieveProject: ResourceIdInputSchema,
	updateProject: ResourceIdInputSchema,
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
	listOwnerAuditLogs: AuditLogsInputSchema,
	listOrganizationAuditLogs: AuditLogsInputSchema,
	getUser: ResourceInputSchema,
	listLogs: ResourceInputSchema,
	listLogsValues: ResourceInputSchema,
	subscribeLogs: ResourceInputSchema,
	listResourceLogStreams: ResourceInputSchema,
	deleteOwnerLogStream: ResourceIdInputSchema,
	updateOwnerLogStream: ResourceIdInputSchema,
	getActiveConnections: ResourceInputSchema,
	getBandwidthSources: ResourceInputSchema,
	getCpu: ResourceInputSchema,
	getCpuLimit: ResourceInputSchema,
	getDiskCapacity: ResourceInputSchema,
	getDiskUsage: ResourceInputSchema,
	getInstanceCount: ResourceInputSchema,
	getMemory: ResourceInputSchema,
	getMemoryLimit: ResourceInputSchema,
	getMemoryTarget: ResourceInputSchema,
	listApplicationFilterValues: ResourceInputSchema,
	listDisks: ResourceInputSchema,
	listMaintenance: ResourceInputSchema,
	listTaskRuns: ResourceInputSchema,
	listTasks: ResourceInputSchema,
	streamTaskRunsEvents: ResourceInputSchema,
	listWorkflows: ResourceInputSchema,
	listWorkflowVersions: ResourceInputSchema,
	listWebhooks: ResourceInputSchema,
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
	listNotificationOverrides: ResourceInputSchema,
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
	updateOwnerNotificationSettings: ResourceIdInputSchema,
	updateRoutes: ResourceIdInputSchema,
} as const;

export const RenderEndpointOutputSchemas = {
	listServices: ListServicesOutputSchema,
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
	listEnvironments: ResourceListOutputSchema,
	createEnvironment: ResourceOutputSchema,
	retrieveEnvironment: ResourceOutputSchema,
	updateEnvironment: ResourceOutputSchema,
	deleteEnvironment: EmptyOutputSchema,
	listEnvGroups: ResourceListOutputSchema,
	createEnvGroup: ResourceOutputSchema,
	retrieveEnvGroup: ResourceOutputSchema,
	updateEnvGroup: ResourceOutputSchema,
	deleteEnvGroup: EmptyOutputSchema,
	listProjects: ResourceListOutputSchema,
	createProject: ResourceOutputSchema,
	retrieveProject: ResourceOutputSchema,
	updateProject: ResourceOutputSchema,
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
	listOwnerAuditLogs: ResourceListOutputSchema,
	listOrganizationAuditLogs: ResourceListOutputSchema,
	getUser: ResourceOutputSchema,
	listLogs: ResourceOutputSchema,
	listLogsValues: ResourceOutputSchema,
	subscribeLogs: ResourceOutputSchema,
	listResourceLogStreams: ResourceListOutputSchema,
	deleteOwnerLogStream: EmptyOutputSchema,
	updateOwnerLogStream: ResourceOutputSchema,
	getActiveConnections: ResourceOutputSchema,
	getBandwidthSources: ResourceOutputSchema,
	getCpu: ResourceOutputSchema,
	getCpuLimit: ResourceOutputSchema,
	getDiskCapacity: ResourceOutputSchema,
	getDiskUsage: ResourceOutputSchema,
	getInstanceCount: ResourceOutputSchema,
	getMemory: ResourceOutputSchema,
	getMemoryLimit: ResourceOutputSchema,
	getMemoryTarget: ResourceOutputSchema,
	listApplicationFilterValues: ResourceListOutputSchema,
	listDisks: ResourceListOutputSchema,
	listMaintenance: ResourceListOutputSchema,
	listTaskRuns: ResourceListOutputSchema,
	listTasks: ResourceListOutputSchema,
	streamTaskRunsEvents: z.object({ data: z.string() }),
	listWorkflows: ResourceListOutputSchema,
	listWorkflowVersions: ResourceListOutputSchema,
	listWebhooks: ResourceListOutputSchema,
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
	listNotificationOverrides: ResourceListOutputSchema,
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
	updateOwnerNotificationSettings: ResourceOutputSchema,
	updateRoutes: ResourceOutputSchema,
} as const;
