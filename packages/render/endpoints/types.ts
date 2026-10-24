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
const ServiceOutputSchema = RenderServiceSchema;
const EmptyOutputSchema = z.object({});
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
const ResourceOutputSchema = z.record(z.string(), z.unknown());

export type ListServicesInput = z.infer<typeof ListServicesInputSchema>;
export type ListServicesOutput = z.infer<typeof ListServicesOutputSchema>;
export type ServiceIdInput = z.infer<typeof ServiceIdInputSchema>;
export type ServiceOutput = z.infer<typeof ServiceOutputSchema>;

export type RenderEndpointInputs = {
	listServices: ListServicesInput;
	retrieveService: ServiceIdInput;
	deleteService: ServiceIdInput;
	updateService: ServiceIdInput & { name?: string; autoDeployTrigger?: string };
	triggerDeploy: ServiceIdInput;
	restartService: ServiceIdInput;
	suspendService: ServiceIdInput;
	resumeService: ServiceIdInput;
	listEnvironments: z.infer<typeof ResourceInputSchema>;
	createEnvironment: z.infer<typeof ResourceInputSchema>;
	retrieveEnvironment: z.infer<typeof ResourceInputSchema>;
	updateEnvironment: z.infer<typeof ResourceInputSchema>;
	deleteEnvironment: z.infer<typeof ResourceInputSchema>;
	listEnvGroups: z.infer<typeof ResourceInputSchema>;
	createEnvGroup: z.infer<typeof ResourceInputSchema>;
	retrieveEnvGroup: z.infer<typeof ResourceInputSchema>;
	updateEnvGroup: z.infer<typeof ResourceInputSchema>;
	deleteEnvGroup: z.infer<typeof ResourceInputSchema>;
	listProjects: z.infer<typeof ResourceInputSchema>;
	createProject: z.infer<typeof ResourceInputSchema>;
	retrieveProject: z.infer<typeof ResourceInputSchema>;
	updateProject: z.infer<typeof ResourceInputSchema>;
	listPostgres: z.infer<typeof ResourceInputSchema>;
	createPostgres: z.infer<typeof ResourceInputSchema>;
	retrievePostgres: z.infer<typeof ResourceInputSchema>;
	updatePostgres: z.infer<typeof ResourceInputSchema>;
	listRegistryCredentials: z.infer<typeof ResourceInputSchema>;
	createRegistryCredential: z.infer<typeof ResourceInputSchema>;
	retrieveRegistryCredential: z.infer<typeof ResourceInputSchema>;
	updateRegistryCredential: z.infer<typeof ResourceInputSchema>;
	deleteRegistryCredential: z.infer<typeof ResourceInputSchema>;
	listOwners: z.infer<typeof ResourceInputSchema>;
	retrieveOwner: z.infer<typeof ResourceInputSchema>;
	listOwnerMembers: z.infer<typeof ResourceInputSchema>;
	getUser: z.infer<typeof ResourceInputSchema>;
	listLogs: z.infer<typeof ResourceInputSchema>;
	listLogsValues: z.infer<typeof ResourceInputSchema>;
	subscribeLogs: z.infer<typeof ResourceInputSchema>;
	listResourceLogStreams: z.infer<typeof ResourceInputSchema>;
	deleteOwnerLogStream: z.infer<typeof ResourceInputSchema>;
	updateOwnerLogStream: z.infer<typeof ResourceInputSchema>;
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
	addHeaders: z.infer<typeof ResourceInputSchema>;
	addOrUpdateSecretFile: z.infer<typeof ResourceInputSchema>;
	addResourcesToEnvironment: z.infer<typeof ResourceInputSchema>;
	addRoute: z.infer<typeof ResourceInputSchema>;
	createCustomDomain: z.infer<typeof ResourceInputSchema>;
	deleteEnvGroupEnvVar: z.infer<typeof ResourceInputSchema>;
	deleteEnvGroupSecretFile: z.infer<typeof ResourceInputSchema>;
	deleteKeyValue: z.infer<typeof ResourceInputSchema>;
	deleteSecretFile: z.infer<typeof ResourceInputSchema>;
	disconnectBlueprint: z.infer<typeof ResourceInputSchema>;
	linkServiceToEnvGroup: z.infer<typeof ResourceInputSchema>;
	listBlueprints: z.infer<typeof ResourceInputSchema>;
	listInstances: z.infer<typeof ResourceInputSchema>;
	listKeyValue: z.infer<typeof ResourceInputSchema>;
	listNotificationOverrides: z.infer<typeof ResourceInputSchema>;
	listPostgresExport: z.infer<typeof ResourceInputSchema>;
	listPostgresUsers: z.infer<typeof ResourceInputSchema>;
	listRoutes: z.infer<typeof ResourceInputSchema>;
	listSecretFiles: z.infer<typeof ResourceInputSchema>;
	retrieveCustomDomain: z.infer<typeof ResourceInputSchema>;
	retrieveDeploy: z.infer<typeof ResourceInputSchema>;
	retrieveEnvGroupEnvVar: z.infer<typeof ResourceInputSchema>;
	retrieveEnvGroupSecretFile: z.infer<typeof ResourceInputSchema>;
	retrieveEnvVar: z.infer<typeof ResourceInputSchema>;
	retrieveOwnerNotificationSettings: z.infer<typeof ResourceInputSchema>;
	retrieveSecretFile: z.infer<typeof ResourceInputSchema>;
	updateEnvGroupEnvVar: z.infer<typeof ResourceInputSchema>;
	updateEnvGroupSecretFile: z.infer<typeof ResourceInputSchema>;
	updateEnvVar: z.infer<typeof ResourceInputSchema>;
	updateEnvVarsForService: z.infer<typeof ResourceInputSchema>;
	updateHeaders: z.infer<typeof ResourceInputSchema>;
	updateResourceLogStream: z.infer<typeof ResourceInputSchema>;
	updateSecretFilesForService: z.infer<typeof ResourceInputSchema>;
	verifyCustomDomain: z.infer<typeof ResourceInputSchema>;
	deleteOwnerMetricsStream: z.infer<typeof ResourceInputSchema>;
	updateOwnerNotificationSettings: z.infer<typeof ResourceInputSchema>;
	updateRoutes: z.infer<typeof ResourceInputSchema>;
};

export type RenderEndpointOutputs = {
	listServices: ListServicesOutput;
	retrieveService: ServiceOutput;
	deleteService: Record<string, never>;
	updateService: ServiceOutput;
	triggerDeploy: unknown;
	restartService: unknown;
	suspendService: unknown;
	resumeService: unknown;
	listEnvironments: z.infer<typeof ResourceOutputSchema>;
	createEnvironment: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvironment: z.infer<typeof ResourceOutputSchema>;
	updateEnvironment: z.infer<typeof ResourceOutputSchema>;
	deleteEnvironment: Record<string, never>;
	listEnvGroups: z.infer<typeof ResourceOutputSchema>;
	createEnvGroup: z.infer<typeof ResourceOutputSchema>;
	retrieveEnvGroup: z.infer<typeof ResourceOutputSchema>;
	updateEnvGroup: z.infer<typeof ResourceOutputSchema>;
	deleteEnvGroup: Record<string, never>;
	listProjects: z.infer<typeof ResourceOutputSchema>;
	createProject: z.infer<typeof ResourceOutputSchema>;
	retrieveProject: z.infer<typeof ResourceOutputSchema>;
	updateProject: z.infer<typeof ResourceOutputSchema>;
	listPostgres: z.infer<typeof ResourceOutputSchema>;
	createPostgres: z.infer<typeof ResourceOutputSchema>;
	retrievePostgres: z.infer<typeof ResourceOutputSchema>;
	updatePostgres: z.infer<typeof ResourceOutputSchema>;
	listRegistryCredentials: z.infer<typeof ResourceOutputSchema>;
	createRegistryCredential: z.infer<typeof ResourceOutputSchema>;
	retrieveRegistryCredential: z.infer<typeof ResourceOutputSchema>;
	updateRegistryCredential: z.infer<typeof ResourceOutputSchema>;
	deleteRegistryCredential: Record<string, never>;
	listOwners: z.infer<typeof ResourceOutputSchema>;
	retrieveOwner: z.infer<typeof ResourceOutputSchema>;
	listOwnerMembers: z.infer<typeof ResourceOutputSchema>;
	getUser: z.infer<typeof ResourceOutputSchema>;
	listLogs: z.infer<typeof ResourceOutputSchema>;
	listLogsValues: z.infer<typeof ResourceOutputSchema>;
	subscribeLogs: z.infer<typeof ResourceOutputSchema>;
	listResourceLogStreams: z.infer<typeof ResourceOutputSchema>;
	deleteOwnerLogStream: Record<string, never>;
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
	listApplicationFilterValues: z.infer<typeof ResourceOutputSchema>;
	listDisks: z.infer<typeof ResourceOutputSchema>;
	listMaintenance: z.infer<typeof ResourceOutputSchema>;
	listTaskRuns: z.infer<typeof ResourceOutputSchema>;
	listTasks: z.infer<typeof ResourceOutputSchema>;
	streamTaskRunsEvents: z.infer<typeof ResourceOutputSchema>;
	listWorkflows: z.infer<typeof ResourceOutputSchema>;
	listWorkflowVersions: z.infer<typeof ResourceOutputSchema>;
	listWebhooks: z.infer<typeof ResourceOutputSchema>;
	addHeaders: z.infer<typeof ResourceOutputSchema>;
	addOrUpdateSecretFile: z.infer<typeof ResourceOutputSchema>;
	addResourcesToEnvironment: z.infer<typeof ResourceOutputSchema>;
	addRoute: z.infer<typeof ResourceOutputSchema>;
	createCustomDomain: z.infer<typeof ResourceOutputSchema>;
	deleteEnvGroupEnvVar: z.infer<typeof ResourceOutputSchema>;
	deleteEnvGroupSecretFile: z.infer<typeof ResourceOutputSchema>;
	deleteKeyValue: z.infer<typeof ResourceOutputSchema>;
	deleteSecretFile: z.infer<typeof ResourceOutputSchema>;
	disconnectBlueprint: z.infer<typeof ResourceOutputSchema>;
	linkServiceToEnvGroup: z.infer<typeof ResourceOutputSchema>;
	listBlueprints: z.infer<typeof ResourceOutputSchema>;
	listInstances: z.infer<typeof ResourceOutputSchema>;
	listKeyValue: z.infer<typeof ResourceOutputSchema>;
	listNotificationOverrides: z.infer<typeof ResourceOutputSchema>;
	listPostgresExport: z.infer<typeof ResourceOutputSchema>;
	listPostgresUsers: z.infer<typeof ResourceOutputSchema>;
	listRoutes: z.infer<typeof ResourceOutputSchema>;
	listSecretFiles: z.infer<typeof ResourceOutputSchema>;
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
	deleteOwnerMetricsStream: Record<string, never>;
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
	triggerDeploy: ServiceIdInputSchema,
	restartService: ServiceIdInputSchema,
	suspendService: ServiceIdInputSchema,
	resumeService: ServiceIdInputSchema,
	listEnvironments: ResourceInputSchema,
	createEnvironment: ResourceInputSchema,
	retrieveEnvironment: ResourceInputSchema,
	updateEnvironment: ResourceInputSchema,
	deleteEnvironment: ResourceInputSchema,
	listEnvGroups: ResourceInputSchema,
	createEnvGroup: ResourceInputSchema,
	retrieveEnvGroup: ResourceInputSchema,
	updateEnvGroup: ResourceInputSchema,
	deleteEnvGroup: ResourceInputSchema,
	listProjects: ResourceInputSchema,
	createProject: ResourceInputSchema,
	retrieveProject: ResourceInputSchema,
	updateProject: ResourceInputSchema,
	listPostgres: ResourceInputSchema,
	createPostgres: ResourceInputSchema,
	retrievePostgres: ResourceInputSchema,
	updatePostgres: ResourceInputSchema,
	listRegistryCredentials: ResourceInputSchema,
	createRegistryCredential: ResourceInputSchema,
	retrieveRegistryCredential: ResourceInputSchema,
	updateRegistryCredential: ResourceInputSchema,
	deleteRegistryCredential: ResourceInputSchema,
	listOwners: ResourceInputSchema,
	retrieveOwner: ResourceInputSchema,
	listOwnerMembers: ResourceInputSchema,
	getUser: ResourceInputSchema,
	listLogs: ResourceInputSchema,
	listLogsValues: ResourceInputSchema,
	subscribeLogs: ResourceInputSchema,
	listResourceLogStreams: ResourceInputSchema,
	deleteOwnerLogStream: ResourceInputSchema,
	updateOwnerLogStream: ResourceInputSchema,
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
	addHeaders: ResourceInputSchema,
	addOrUpdateSecretFile: ResourceInputSchema,
	addResourcesToEnvironment: ResourceInputSchema,
	addRoute: ResourceInputSchema,
	createCustomDomain: ResourceInputSchema,
	deleteEnvGroupEnvVar: ResourceInputSchema,
	deleteEnvGroupSecretFile: ResourceInputSchema,
	deleteKeyValue: ResourceInputSchema,
	deleteSecretFile: ResourceInputSchema,
	disconnectBlueprint: ResourceInputSchema,
	linkServiceToEnvGroup: ResourceInputSchema,
	listBlueprints: ResourceInputSchema,
	listInstances: ResourceInputSchema,
	listKeyValue: ResourceInputSchema,
	listNotificationOverrides: ResourceInputSchema,
	listPostgresExport: ResourceInputSchema,
	listPostgresUsers: ResourceInputSchema,
	listRoutes: ResourceInputSchema,
	listSecretFiles: ResourceInputSchema,
	retrieveCustomDomain: ResourceInputSchema,
	retrieveDeploy: ResourceInputSchema,
	retrieveEnvGroupEnvVar: ResourceInputSchema,
	retrieveEnvGroupSecretFile: ResourceInputSchema,
	retrieveEnvVar: ResourceInputSchema,
	retrieveOwnerNotificationSettings: ResourceInputSchema,
	retrieveSecretFile: ResourceInputSchema,
	updateEnvGroupEnvVar: ResourceInputSchema,
	updateEnvGroupSecretFile: ResourceInputSchema,
	updateEnvVar: ResourceInputSchema,
	updateEnvVarsForService: ResourceInputSchema,
	updateHeaders: ResourceInputSchema,
	updateResourceLogStream: ResourceInputSchema,
	updateSecretFilesForService: ResourceInputSchema,
	verifyCustomDomain: ResourceInputSchema,
	deleteOwnerMetricsStream: ResourceInputSchema,
	updateOwnerNotificationSettings: ResourceInputSchema,
	updateRoutes: ResourceInputSchema,
} as const;

export const RenderEndpointOutputSchemas = {
	listServices: ListServicesOutputSchema,
	retrieveService: ServiceOutputSchema,
	deleteService: EmptyOutputSchema,
	updateService: ServiceOutputSchema,
	triggerDeploy: z.unknown(),
	restartService: z.unknown(),
	suspendService: z.unknown(),
	resumeService: z.unknown(),
	listEnvironments: ResourceOutputSchema,
	createEnvironment: ResourceOutputSchema,
	retrieveEnvironment: ResourceOutputSchema,
	updateEnvironment: ResourceOutputSchema,
	deleteEnvironment: EmptyOutputSchema,
	listEnvGroups: ResourceOutputSchema,
	createEnvGroup: ResourceOutputSchema,
	retrieveEnvGroup: ResourceOutputSchema,
	updateEnvGroup: ResourceOutputSchema,
	deleteEnvGroup: EmptyOutputSchema,
	listProjects: ResourceOutputSchema,
	createProject: ResourceOutputSchema,
	retrieveProject: ResourceOutputSchema,
	updateProject: ResourceOutputSchema,
	listPostgres: ResourceOutputSchema,
	createPostgres: ResourceOutputSchema,
	retrievePostgres: ResourceOutputSchema,
	updatePostgres: ResourceOutputSchema,
	listRegistryCredentials: ResourceOutputSchema,
	createRegistryCredential: ResourceOutputSchema,
	retrieveRegistryCredential: ResourceOutputSchema,
	updateRegistryCredential: ResourceOutputSchema,
	deleteRegistryCredential: EmptyOutputSchema,
	listOwners: ResourceOutputSchema,
	retrieveOwner: ResourceOutputSchema,
	listOwnerMembers: ResourceOutputSchema,
	getUser: ResourceOutputSchema,
	listLogs: ResourceOutputSchema,
	listLogsValues: ResourceOutputSchema,
	subscribeLogs: ResourceOutputSchema,
	listResourceLogStreams: ResourceOutputSchema,
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
	listApplicationFilterValues: ResourceOutputSchema,
	listDisks: ResourceOutputSchema,
	listMaintenance: ResourceOutputSchema,
	listTaskRuns: ResourceOutputSchema,
	listTasks: ResourceOutputSchema,
	streamTaskRunsEvents: ResourceOutputSchema,
	listWorkflows: ResourceOutputSchema,
	listWorkflowVersions: ResourceOutputSchema,
	listWebhooks: ResourceOutputSchema,
	addHeaders: ResourceOutputSchema,
	addOrUpdateSecretFile: ResourceOutputSchema,
	addResourcesToEnvironment: ResourceOutputSchema,
	addRoute: ResourceOutputSchema,
	createCustomDomain: ResourceOutputSchema,
	deleteEnvGroupEnvVar: ResourceOutputSchema,
	deleteEnvGroupSecretFile: ResourceOutputSchema,
	deleteKeyValue: ResourceOutputSchema,
	deleteSecretFile: ResourceOutputSchema,
	disconnectBlueprint: ResourceOutputSchema,
	linkServiceToEnvGroup: ResourceOutputSchema,
	listBlueprints: ResourceOutputSchema,
	listInstances: ResourceOutputSchema,
	listKeyValue: ResourceOutputSchema,
	listNotificationOverrides: ResourceOutputSchema,
	listPostgresExport: ResourceOutputSchema,
	listPostgresUsers: ResourceOutputSchema,
	listRoutes: ResourceOutputSchema,
	listSecretFiles: ResourceOutputSchema,
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
