import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { RenderEndpointInputs, RenderEndpointOutputs } from './endpoints';
import {
	addHeaders,
	addOrUpdateSecretFile,
	addResourcesToEnvironment,
	addRoute,
	cancelDeploy,
	cancelServiceJob,
	createCustomDomain,
	createDisk,
	createEnvGroup,
	createEnvironment,
	createPostgres,
	createProject,
	createRegistryCredential,
	createServiceJob,
	deleteDisk,
	deleteEnvGroup,
	deleteEnvGroupEnvVar,
	deleteEnvGroupSecretFile,
	deleteEnvironment,
	deleteKeyValue,
	deleteOwnerLogStream,
	deleteOwnerMetricsStream,
	deleteRegistryCredential,
	deleteSecretFile,
	deleteService,
	disconnectBlueprint,
	getActiveConnections,
	getBandwidthSources,
	getCpu,
	getCpuLimit,
	getDiskCapacity,
	getDiskUsage,
	getInstanceCount,
	getMemory,
	getMemoryLimit,
	getMemoryTarget,
	getUser,
	linkServiceToEnvGroup,
	listApplicationFilterValues,
	listBlueprints,
	listDeploys,
	listDiskSnapshots,
	listDisks,
	listEnvGroups,
	listEnvironments,
	listInstances,
	listKeyValue,
	listLogs,
	listLogsValues,
	listMaintenance,
	listNotificationOverrides,
	listOutboundIps,
	listOwnerMembers,
	listOwners,
	listPostgres,
	listPostgresExport,
	listPostgresUsers,
	listProjects,
	listRegistryCredentials,
	listResourceLogStreams,
	listRoutes,
	listSecretFiles,
	listServiceEvents,
	listServiceJobs,
	listServices,
	listTaskRuns,
	listTasks,
	listWebhooks,
	listWorkflows,
	listWorkflowVersions,
	purgeServiceCache,
	RenderEndpointInputSchemas,
	RenderEndpointOutputSchemas,
	restartService,
	restoreDiskSnapshot,
	resumeService,
	retrieveCustomDomain,
	retrieveDeploy,
	retrieveDisk,
	retrieveEnvGroup,
	retrieveEnvGroupEnvVar,
	retrieveEnvGroupSecretFile,
	retrieveEnvironment,
	retrieveEnvVar,
	retrieveOwner,
	retrieveOwnerNotificationSettings,
	retrievePostgres,
	retrieveProject,
	retrieveRegistryCredential,
	retrieveSecretFile,
	retrieveService,
	retrieveServiceJob,
	rollbackDeploy,
	streamTaskRunsEvents,
	subscribeLogs,
	suspendService,
	triggerDeploy,
	updateDisk,
	updateEnvGroup,
	updateEnvGroupEnvVar,
	updateEnvGroupSecretFile,
	updateEnvironment,
	updateEnvVar,
	updateEnvVarsForService,
	updateHeaders,
	updateOwnerLogStream,
	updateOwnerNotificationSettings,
	updatePostgres,
	updateProject,
	updateRegistryCredential,
	updateResourceLogStream,
	updateRoutes,
	updateSecretFilesForService,
	updateService,
	verifyCustomDomain,
} from './endpoints';

import { errorHandlers } from './error-handlers';
import { RenderSchema } from './schema';

export type RenderPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRenderPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof renderEndpointsNested>;
};

export type RenderContext = CorsairPluginContext<
	typeof RenderSchema,
	RenderPluginOptions
>;
export type RenderKeyBuilderContext = KeyBuilderContext<RenderPluginOptions>;
export type RenderBoundEndpoints = BindEndpoints<typeof renderEndpointsNested>;

type RenderEndpoint<K extends keyof RenderEndpointOutputs> = CorsairEndpoint<
	RenderContext,
	RenderEndpointInputs[K],
	RenderEndpointOutputs[K]
>;

export type RenderEndpoints = {
	listServices: RenderEndpoint<'listServices'>;
	retrieveService: RenderEndpoint<'retrieveService'>;
	deleteService: RenderEndpoint<'deleteService'>;
	updateService: RenderEndpoint<'updateService'>;
	triggerDeploy: RenderEndpoint<'triggerDeploy'>;
	listDeploys: RenderEndpoint<'listDeploys'>;
	purgeServiceCache: RenderEndpoint<'purgeServiceCache'>;
	cancelDeploy: RenderEndpoint<'cancelDeploy'>;
	rollbackDeploy: RenderEndpoint<'rollbackDeploy'>;
	listServiceEvents: RenderEndpoint<'listServiceEvents'>;
	listOutboundIps: RenderEndpoint<'listOutboundIps'>;
	listServiceJobs: RenderEndpoint<'listServiceJobs'>;
	retrieveServiceJob: RenderEndpoint<'retrieveServiceJob'>;
	createServiceJob: RenderEndpoint<'createServiceJob'>;
	cancelServiceJob: RenderEndpoint<'cancelServiceJob'>;
	restartService: RenderEndpoint<'restartService'>;
	suspendService: RenderEndpoint<'suspendService'>;
	resumeService: RenderEndpoint<'resumeService'>;
	listEnvironments: RenderEndpoint<'listEnvironments'>;
	createEnvironment: RenderEndpoint<'createEnvironment'>;
	retrieveEnvironment: RenderEndpoint<'retrieveEnvironment'>;
	updateEnvironment: RenderEndpoint<'updateEnvironment'>;
	deleteEnvironment: RenderEndpoint<'deleteEnvironment'>;
	listEnvGroups: RenderEndpoint<'listEnvGroups'>;
	createEnvGroup: RenderEndpoint<'createEnvGroup'>;
	retrieveEnvGroup: RenderEndpoint<'retrieveEnvGroup'>;
	updateEnvGroup: RenderEndpoint<'updateEnvGroup'>;
	deleteEnvGroup: RenderEndpoint<'deleteEnvGroup'>;
	listProjects: RenderEndpoint<'listProjects'>;
	createProject: RenderEndpoint<'createProject'>;
	retrieveProject: RenderEndpoint<'retrieveProject'>;
	updateProject: RenderEndpoint<'updateProject'>;
	listPostgres: RenderEndpoint<'listPostgres'>;
	createPostgres: RenderEndpoint<'createPostgres'>;
	retrievePostgres: RenderEndpoint<'retrievePostgres'>;
	updatePostgres: RenderEndpoint<'updatePostgres'>;
	listRegistryCredentials: RenderEndpoint<'listRegistryCredentials'>;
	createRegistryCredential: RenderEndpoint<'createRegistryCredential'>;
	retrieveRegistryCredential: RenderEndpoint<'retrieveRegistryCredential'>;
	updateRegistryCredential: RenderEndpoint<'updateRegistryCredential'>;
	deleteRegistryCredential: RenderEndpoint<'deleteRegistryCredential'>;
	listOwners: RenderEndpoint<'listOwners'>;
	retrieveOwner: RenderEndpoint<'retrieveOwner'>;
	listOwnerMembers: RenderEndpoint<'listOwnerMembers'>;
	getUser: RenderEndpoint<'getUser'>;
	listLogs: RenderEndpoint<'listLogs'>;
	listLogsValues: RenderEndpoint<'listLogsValues'>;
	subscribeLogs: RenderEndpoint<'subscribeLogs'>;
	listResourceLogStreams: RenderEndpoint<'listResourceLogStreams'>;
	deleteOwnerLogStream: RenderEndpoint<'deleteOwnerLogStream'>;
	updateOwnerLogStream: RenderEndpoint<'updateOwnerLogStream'>;
	getActiveConnections: RenderEndpoint<'getActiveConnections'>;
	getBandwidthSources: RenderEndpoint<'getBandwidthSources'>;
	getCpu: RenderEndpoint<'getCpu'>;
	getCpuLimit: RenderEndpoint<'getCpuLimit'>;
	getDiskCapacity: RenderEndpoint<'getDiskCapacity'>;
	getDiskUsage: RenderEndpoint<'getDiskUsage'>;
	getInstanceCount: RenderEndpoint<'getInstanceCount'>;
	getMemory: RenderEndpoint<'getMemory'>;
	getMemoryLimit: RenderEndpoint<'getMemoryLimit'>;
	getMemoryTarget: RenderEndpoint<'getMemoryTarget'>;
	listApplicationFilterValues: RenderEndpoint<'listApplicationFilterValues'>;
	listDisks: RenderEndpoint<'listDisks'>;
	listMaintenance: RenderEndpoint<'listMaintenance'>;
	listTaskRuns: RenderEndpoint<'listTaskRuns'>;
	listTasks: RenderEndpoint<'listTasks'>;
	streamTaskRunsEvents: RenderEndpoint<'streamTaskRunsEvents'>;
	listWorkflows: RenderEndpoint<'listWorkflows'>;
	listWorkflowVersions: RenderEndpoint<'listWorkflowVersions'>;
	listWebhooks: RenderEndpoint<'listWebhooks'>;
	createDisk: RenderEndpoint<'createDisk'>;
	retrieveDisk: RenderEndpoint<'retrieveDisk'>;
	updateDisk: RenderEndpoint<'updateDisk'>;
	deleteDisk: RenderEndpoint<'deleteDisk'>;
	listDiskSnapshots: RenderEndpoint<'listDiskSnapshots'>;
	restoreDiskSnapshot: RenderEndpoint<'restoreDiskSnapshot'>;
	addHeaders: RenderEndpoint<'addHeaders'>;
	addOrUpdateSecretFile: RenderEndpoint<'addOrUpdateSecretFile'>;
	addResourcesToEnvironment: RenderEndpoint<'addResourcesToEnvironment'>;
	addRoute: RenderEndpoint<'addRoute'>;
	createCustomDomain: RenderEndpoint<'createCustomDomain'>;
	deleteEnvGroupEnvVar: RenderEndpoint<'deleteEnvGroupEnvVar'>;
	deleteEnvGroupSecretFile: RenderEndpoint<'deleteEnvGroupSecretFile'>;
	deleteKeyValue: RenderEndpoint<'deleteKeyValue'>;
	deleteSecretFile: RenderEndpoint<'deleteSecretFile'>;
	disconnectBlueprint: RenderEndpoint<'disconnectBlueprint'>;
	linkServiceToEnvGroup: RenderEndpoint<'linkServiceToEnvGroup'>;
	listBlueprints: RenderEndpoint<'listBlueprints'>;
	listInstances: RenderEndpoint<'listInstances'>;
	listKeyValue: RenderEndpoint<'listKeyValue'>;
	listNotificationOverrides: RenderEndpoint<'listNotificationOverrides'>;
	listPostgresExport: RenderEndpoint<'listPostgresExport'>;
	listPostgresUsers: RenderEndpoint<'listPostgresUsers'>;
	listRoutes: RenderEndpoint<'listRoutes'>;
	listSecretFiles: RenderEndpoint<'listSecretFiles'>;
	retrieveCustomDomain: RenderEndpoint<'retrieveCustomDomain'>;
	retrieveDeploy: RenderEndpoint<'retrieveDeploy'>;
	retrieveEnvGroupEnvVar: RenderEndpoint<'retrieveEnvGroupEnvVar'>;
	retrieveEnvGroupSecretFile: RenderEndpoint<'retrieveEnvGroupSecretFile'>;
	retrieveEnvVar: RenderEndpoint<'retrieveEnvVar'>;
	retrieveOwnerNotificationSettings: RenderEndpoint<'retrieveOwnerNotificationSettings'>;
	retrieveSecretFile: RenderEndpoint<'retrieveSecretFile'>;
	updateEnvGroupEnvVar: RenderEndpoint<'updateEnvGroupEnvVar'>;
	updateEnvGroupSecretFile: RenderEndpoint<'updateEnvGroupSecretFile'>;
	updateEnvVar: RenderEndpoint<'updateEnvVar'>;
	updateEnvVarsForService: RenderEndpoint<'updateEnvVarsForService'>;
	updateHeaders: RenderEndpoint<'updateHeaders'>;
	updateResourceLogStream: RenderEndpoint<'updateResourceLogStream'>;
	updateSecretFilesForService: RenderEndpoint<'updateSecretFilesForService'>;
	verifyCustomDomain: RenderEndpoint<'verifyCustomDomain'>;
	deleteOwnerMetricsStream: RenderEndpoint<'deleteOwnerMetricsStream'>;
	updateOwnerNotificationSettings: RenderEndpoint<'updateOwnerNotificationSettings'>;
	updateRoutes: RenderEndpoint<'updateRoutes'>;
};

const renderEndpointsNested = {
	services: {
		list: listServices,
		retrieve: retrieveService,
		delete: deleteService,
		update: updateService,
		triggerDeploy,
		listDeploys,
		purgeCache: purgeServiceCache,
		cancelDeploy,
		rollbackDeploy,
		listEvents: listServiceEvents,
		listOutboundIps,
		jobs: {
			list: listServiceJobs,
			retrieve: retrieveServiceJob,
			create: createServiceJob,
			cancel: cancelServiceJob,
		},
		restart: restartService,
		suspend: suspendService,
		resume: resumeService,
		environments: {
			list: listEnvironments,
			create: createEnvironment,
			retrieve: retrieveEnvironment,
			update: updateEnvironment,
			delete: deleteEnvironment,
		},
		envGroups: {
			list: listEnvGroups,
			create: createEnvGroup,
			retrieve: retrieveEnvGroup,
			update: updateEnvGroup,
			delete: deleteEnvGroup,
		},
	},
	projects: {
		list: listProjects,
		create: createProject,
		retrieve: retrieveProject,
		update: updateProject,
	},
	postgres: {
		list: listPostgres,
		create: createPostgres,
		retrieve: retrievePostgres,
		update: updatePostgres,
	},
	registryCredentials: {
		list: listRegistryCredentials,
		create: createRegistryCredential,
		retrieve: retrieveRegistryCredential,
		update: updateRegistryCredential,
		delete: deleteRegistryCredential,
	},
	owners: {
		list: listOwners,
		retrieve: retrieveOwner,
		members: listOwnerMembers,
	},
	user: { get: getUser },
	logs: {
		list: listLogs,
		values: listLogsValues,
		subscribe: subscribeLogs,
		resourceStreams: listResourceLogStreams,
		deleteOwnerStream: deleteOwnerLogStream,
		updateOwnerStream: updateOwnerLogStream,
	},
	metrics: {
		activeConnections: getActiveConnections,
		bandwidthSources: getBandwidthSources,
		cpu: getCpu,
		cpuLimit: getCpuLimit,
		diskCapacity: getDiskCapacity,
		diskUsage: getDiskUsage,
		instanceCount: getInstanceCount,
		memory: getMemory,
		memoryLimit: getMemoryLimit,
		memoryTarget: getMemoryTarget,
		applicationFilterValues: listApplicationFilterValues,
	},
	automation: {
		listDisks,
		listMaintenance,
		listTaskRuns,
		listTasks,
		streamTaskRunsEvents,
		listWorkflows,
		listWorkflowVersions,
		listWebhooks,
		createDisk,
		retrieveDisk,
		updateDisk,
		deleteDisk,
		listDiskSnapshots,
		restoreDiskSnapshot,
	},
	final: {
		addHeaders,
		addOrUpdateSecretFile,
		addResourcesToEnvironment,
		addRoute,
		createCustomDomain,
		deleteEnvGroupEnvVar,
		deleteEnvGroupSecretFile,
		deleteKeyValue,
		deleteSecretFile,
		disconnectBlueprint,
		linkServiceToEnvGroup,
		listBlueprints,
		listInstances,
		listKeyValue,
		listNotificationOverrides,
		listPostgresExport,
		listPostgresUsers,
		listRoutes,
		listSecretFiles,
		retrieveCustomDomain,
		retrieveDeploy,
		retrieveEnvGroupEnvVar,
		retrieveEnvGroupSecretFile,
		retrieveEnvVar,
		retrieveOwnerNotificationSettings,
		retrieveSecretFile,
		updateEnvGroupEnvVar,
		updateEnvGroupSecretFile,
		updateEnvVar,
		updateEnvVarsForService,
		updateHeaders,
		updateResourceLogStream,
		updateSecretFilesForService,
		verifyCustomDomain,
		deleteOwnerMetricsStream,
		updateOwnerNotificationSettings,
		updateRoutes,
	},
} as const;

export const renderEndpointSchemas = {
	'services.list': {
		input: RenderEndpointInputSchemas.listServices,
		output: RenderEndpointOutputSchemas.listServices,
	},
	'services.retrieve': {
		input: RenderEndpointInputSchemas.retrieveService,
		output: RenderEndpointOutputSchemas.retrieveService,
	},
	'services.delete': {
		input: RenderEndpointInputSchemas.deleteService,
		output: RenderEndpointOutputSchemas.deleteService,
	},
	'services.update': {
		input: RenderEndpointInputSchemas.updateService,
		output: RenderEndpointOutputSchemas.updateService,
	},
	'services.triggerDeploy': {
		input: RenderEndpointInputSchemas.triggerDeploy,
		output: RenderEndpointOutputSchemas.triggerDeploy,
	},
	'services.listDeploys': {
		input: RenderEndpointInputSchemas.listDeploys,
		output: RenderEndpointOutputSchemas.listDeploys,
	},
	'services.purgeCache': {
		input: RenderEndpointInputSchemas.purgeServiceCache,
		output: RenderEndpointOutputSchemas.purgeServiceCache,
	},
	'services.cancelDeploy': {
		input: RenderEndpointInputSchemas.cancelDeploy,
		output: RenderEndpointOutputSchemas.cancelDeploy,
	},
	'services.rollbackDeploy': {
		input: RenderEndpointInputSchemas.rollbackDeploy,
		output: RenderEndpointOutputSchemas.rollbackDeploy,
	},
	'services.listEvents': {
		input: RenderEndpointInputSchemas.listServiceEvents,
		output: RenderEndpointOutputSchemas.listServiceEvents,
	},
	'services.listOutboundIps': {
		input: RenderEndpointInputSchemas.listOutboundIps,
		output: RenderEndpointOutputSchemas.listOutboundIps,
	},
	'services.jobs.list': {
		input: RenderEndpointInputSchemas.listServiceJobs,
		output: RenderEndpointOutputSchemas.listServiceJobs,
	},
	'services.jobs.retrieve': {
		input: RenderEndpointInputSchemas.retrieveServiceJob,
		output: RenderEndpointOutputSchemas.retrieveServiceJob,
	},
	'services.jobs.create': {
		input: RenderEndpointInputSchemas.createServiceJob,
		output: RenderEndpointOutputSchemas.createServiceJob,
	},
	'services.jobs.cancel': {
		input: RenderEndpointInputSchemas.cancelServiceJob,
		output: RenderEndpointOutputSchemas.cancelServiceJob,
	},
	'services.restart': {
		input: RenderEndpointInputSchemas.restartService,
		output: RenderEndpointOutputSchemas.restartService,
	},
	'services.suspend': {
		input: RenderEndpointInputSchemas.suspendService,
		output: RenderEndpointOutputSchemas.suspendService,
	},
	'services.resume': {
		input: RenderEndpointInputSchemas.resumeService,
		output: RenderEndpointOutputSchemas.resumeService,
	},
	'services.environments.list': {
		input: RenderEndpointInputSchemas.listEnvironments,
		output: RenderEndpointOutputSchemas.listEnvironments,
	},
	'services.environments.create': {
		input: RenderEndpointInputSchemas.createEnvironment,
		output: RenderEndpointOutputSchemas.createEnvironment,
	},
	'services.environments.retrieve': {
		input: RenderEndpointInputSchemas.retrieveEnvironment,
		output: RenderEndpointOutputSchemas.retrieveEnvironment,
	},
	'services.environments.update': {
		input: RenderEndpointInputSchemas.updateEnvironment,
		output: RenderEndpointOutputSchemas.updateEnvironment,
	},
	'services.environments.delete': {
		input: RenderEndpointInputSchemas.deleteEnvironment,
		output: RenderEndpointOutputSchemas.deleteEnvironment,
	},
	'services.envGroups.list': {
		input: RenderEndpointInputSchemas.listEnvGroups,
		output: RenderEndpointOutputSchemas.listEnvGroups,
	},
	'services.envGroups.create': {
		input: RenderEndpointInputSchemas.createEnvGroup,
		output: RenderEndpointOutputSchemas.createEnvGroup,
	},
	'services.envGroups.retrieve': {
		input: RenderEndpointInputSchemas.retrieveEnvGroup,
		output: RenderEndpointOutputSchemas.retrieveEnvGroup,
	},
	'services.envGroups.update': {
		input: RenderEndpointInputSchemas.updateEnvGroup,
		output: RenderEndpointOutputSchemas.updateEnvGroup,
	},
	'services.envGroups.delete': {
		input: RenderEndpointInputSchemas.deleteEnvGroup,
		output: RenderEndpointOutputSchemas.deleteEnvGroup,
	},
	'projects.list': {
		input: RenderEndpointInputSchemas.listProjects,
		output: RenderEndpointOutputSchemas.listProjects,
	},
	'projects.create': {
		input: RenderEndpointInputSchemas.createProject,
		output: RenderEndpointOutputSchemas.createProject,
	},
	'projects.retrieve': {
		input: RenderEndpointInputSchemas.retrieveProject,
		output: RenderEndpointOutputSchemas.retrieveProject,
	},
	'projects.update': {
		input: RenderEndpointInputSchemas.updateProject,
		output: RenderEndpointOutputSchemas.updateProject,
	},
	'postgres.list': {
		input: RenderEndpointInputSchemas.listPostgres,
		output: RenderEndpointOutputSchemas.listPostgres,
	},
	'postgres.create': {
		input: RenderEndpointInputSchemas.createPostgres,
		output: RenderEndpointOutputSchemas.createPostgres,
	},
	'postgres.retrieve': {
		input: RenderEndpointInputSchemas.retrievePostgres,
		output: RenderEndpointOutputSchemas.retrievePostgres,
	},
	'postgres.update': {
		input: RenderEndpointInputSchemas.updatePostgres,
		output: RenderEndpointOutputSchemas.updatePostgres,
	},
	'registryCredentials.list': {
		input: RenderEndpointInputSchemas.listRegistryCredentials,
		output: RenderEndpointOutputSchemas.listRegistryCredentials,
	},
	'registryCredentials.create': {
		input: RenderEndpointInputSchemas.createRegistryCredential,
		output: RenderEndpointOutputSchemas.createRegistryCredential,
	},
	'registryCredentials.retrieve': {
		input: RenderEndpointInputSchemas.retrieveRegistryCredential,
		output: RenderEndpointOutputSchemas.retrieveRegistryCredential,
	},
	'registryCredentials.update': {
		input: RenderEndpointInputSchemas.updateRegistryCredential,
		output: RenderEndpointOutputSchemas.updateRegistryCredential,
	},
	'registryCredentials.delete': {
		input: RenderEndpointInputSchemas.deleteRegistryCredential,
		output: RenderEndpointOutputSchemas.deleteRegistryCredential,
	},
	'owners.list': {
		input: RenderEndpointInputSchemas.listOwners,
		output: RenderEndpointOutputSchemas.listOwners,
	},
	'owners.retrieve': {
		input: RenderEndpointInputSchemas.retrieveOwner,
		output: RenderEndpointOutputSchemas.retrieveOwner,
	},
	'owners.members': {
		input: RenderEndpointInputSchemas.listOwnerMembers,
		output: RenderEndpointOutputSchemas.listOwnerMembers,
	},
	'user.get': {
		input: RenderEndpointInputSchemas.getUser,
		output: RenderEndpointOutputSchemas.getUser,
	},
	'logs.list': {
		input: RenderEndpointInputSchemas.listLogs,
		output: RenderEndpointOutputSchemas.listLogs,
	},
	'logs.values': {
		input: RenderEndpointInputSchemas.listLogsValues,
		output: RenderEndpointOutputSchemas.listLogsValues,
	},
	'logs.subscribe': {
		input: RenderEndpointInputSchemas.subscribeLogs,
		output: RenderEndpointOutputSchemas.subscribeLogs,
	},
	'logs.resourceStreams': {
		input: RenderEndpointInputSchemas.listResourceLogStreams,
		output: RenderEndpointOutputSchemas.listResourceLogStreams,
	},
	'logs.deleteOwnerStream': {
		input: RenderEndpointInputSchemas.deleteOwnerLogStream,
		output: RenderEndpointOutputSchemas.deleteOwnerLogStream,
	},
	'logs.updateOwnerStream': {
		input: RenderEndpointInputSchemas.updateOwnerLogStream,
		output: RenderEndpointOutputSchemas.updateOwnerLogStream,
	},
	'metrics.activeConnections': {
		input: RenderEndpointInputSchemas.getActiveConnections,
		output: RenderEndpointOutputSchemas.getActiveConnections,
	},
	'metrics.bandwidthSources': {
		input: RenderEndpointInputSchemas.getBandwidthSources,
		output: RenderEndpointOutputSchemas.getBandwidthSources,
	},
	'metrics.cpu': {
		input: RenderEndpointInputSchemas.getCpu,
		output: RenderEndpointOutputSchemas.getCpu,
	},
	'metrics.cpuLimit': {
		input: RenderEndpointInputSchemas.getCpuLimit,
		output: RenderEndpointOutputSchemas.getCpuLimit,
	},
	'metrics.diskCapacity': {
		input: RenderEndpointInputSchemas.getDiskCapacity,
		output: RenderEndpointOutputSchemas.getDiskCapacity,
	},
	'metrics.diskUsage': {
		input: RenderEndpointInputSchemas.getDiskUsage,
		output: RenderEndpointOutputSchemas.getDiskUsage,
	},
	'metrics.instanceCount': {
		input: RenderEndpointInputSchemas.getInstanceCount,
		output: RenderEndpointOutputSchemas.getInstanceCount,
	},
	'metrics.memory': {
		input: RenderEndpointInputSchemas.getMemory,
		output: RenderEndpointOutputSchemas.getMemory,
	},
	'metrics.memoryLimit': {
		input: RenderEndpointInputSchemas.getMemoryLimit,
		output: RenderEndpointOutputSchemas.getMemoryLimit,
	},
	'metrics.memoryTarget': {
		input: RenderEndpointInputSchemas.getMemoryTarget,
		output: RenderEndpointOutputSchemas.getMemoryTarget,
	},
	'metrics.applicationFilterValues': {
		input: RenderEndpointInputSchemas.listApplicationFilterValues,
		output: RenderEndpointOutputSchemas.listApplicationFilterValues,
	},
	'automation.listDisks': {
		input: RenderEndpointInputSchemas.listDisks,
		output: RenderEndpointOutputSchemas.listDisks,
	},
	'automation.listMaintenance': {
		input: RenderEndpointInputSchemas.listMaintenance,
		output: RenderEndpointOutputSchemas.listMaintenance,
	},
	'automation.listTaskRuns': {
		input: RenderEndpointInputSchemas.listTaskRuns,
		output: RenderEndpointOutputSchemas.listTaskRuns,
	},
	'automation.listTasks': {
		input: RenderEndpointInputSchemas.listTasks,
		output: RenderEndpointOutputSchemas.listTasks,
	},
	'automation.streamTaskRunsEvents': {
		input: RenderEndpointInputSchemas.streamTaskRunsEvents,
		output: RenderEndpointOutputSchemas.streamTaskRunsEvents,
	},
	'automation.listWorkflows': {
		input: RenderEndpointInputSchemas.listWorkflows,
		output: RenderEndpointOutputSchemas.listWorkflows,
	},
	'automation.listWorkflowVersions': {
		input: RenderEndpointInputSchemas.listWorkflowVersions,
		output: RenderEndpointOutputSchemas.listWorkflowVersions,
	},
	'automation.listWebhooks': {
		input: RenderEndpointInputSchemas.listWebhooks,
		output: RenderEndpointOutputSchemas.listWebhooks,
	},
	'automation.createDisk': {
		input: RenderEndpointInputSchemas.createDisk,
		output: RenderEndpointOutputSchemas.createDisk,
	},
	'automation.retrieveDisk': {
		input: RenderEndpointInputSchemas.retrieveDisk,
		output: RenderEndpointOutputSchemas.retrieveDisk,
	},
	'automation.updateDisk': {
		input: RenderEndpointInputSchemas.updateDisk,
		output: RenderEndpointOutputSchemas.updateDisk,
	},
	'automation.deleteDisk': {
		input: RenderEndpointInputSchemas.deleteDisk,
		output: RenderEndpointOutputSchemas.deleteDisk,
	},
	'automation.listDiskSnapshots': {
		input: RenderEndpointInputSchemas.listDiskSnapshots,
		output: RenderEndpointOutputSchemas.listDiskSnapshots,
	},
	'automation.restoreDiskSnapshot': {
		input: RenderEndpointInputSchemas.restoreDiskSnapshot,
		output: RenderEndpointOutputSchemas.restoreDiskSnapshot,
	},
	'final.addHeaders': {
		input: RenderEndpointInputSchemas.addHeaders,
		output: RenderEndpointOutputSchemas.addHeaders,
	},
	'final.addOrUpdateSecretFile': {
		input: RenderEndpointInputSchemas.addOrUpdateSecretFile,
		output: RenderEndpointOutputSchemas.addOrUpdateSecretFile,
	},
	'final.addResourcesToEnvironment': {
		input: RenderEndpointInputSchemas.addResourcesToEnvironment,
		output: RenderEndpointOutputSchemas.addResourcesToEnvironment,
	},
	'final.addRoute': {
		input: RenderEndpointInputSchemas.addRoute,
		output: RenderEndpointOutputSchemas.addRoute,
	},
	'final.createCustomDomain': {
		input: RenderEndpointInputSchemas.createCustomDomain,
		output: RenderEndpointOutputSchemas.createCustomDomain,
	},
	'final.deleteEnvGroupEnvVar': {
		input: RenderEndpointInputSchemas.deleteEnvGroupEnvVar,
		output: RenderEndpointOutputSchemas.deleteEnvGroupEnvVar,
	},
	'final.deleteEnvGroupSecretFile': {
		input: RenderEndpointInputSchemas.deleteEnvGroupSecretFile,
		output: RenderEndpointOutputSchemas.deleteEnvGroupSecretFile,
	},
	'final.deleteKeyValue': {
		input: RenderEndpointInputSchemas.deleteKeyValue,
		output: RenderEndpointOutputSchemas.deleteKeyValue,
	},
	'final.deleteSecretFile': {
		input: RenderEndpointInputSchemas.deleteSecretFile,
		output: RenderEndpointOutputSchemas.deleteSecretFile,
	},
	'final.disconnectBlueprint': {
		input: RenderEndpointInputSchemas.disconnectBlueprint,
		output: RenderEndpointOutputSchemas.disconnectBlueprint,
	},
	'final.linkServiceToEnvGroup': {
		input: RenderEndpointInputSchemas.linkServiceToEnvGroup,
		output: RenderEndpointOutputSchemas.linkServiceToEnvGroup,
	},
	'final.listBlueprints': {
		input: RenderEndpointInputSchemas.listBlueprints,
		output: RenderEndpointOutputSchemas.listBlueprints,
	},
	'final.listInstances': {
		input: RenderEndpointInputSchemas.listInstances,
		output: RenderEndpointOutputSchemas.listInstances,
	},
	'final.listKeyValue': {
		input: RenderEndpointInputSchemas.listKeyValue,
		output: RenderEndpointOutputSchemas.listKeyValue,
	},
	'final.listNotificationOverrides': {
		input: RenderEndpointInputSchemas.listNotificationOverrides,
		output: RenderEndpointOutputSchemas.listNotificationOverrides,
	},
	'final.listPostgresExport': {
		input: RenderEndpointInputSchemas.listPostgresExport,
		output: RenderEndpointOutputSchemas.listPostgresExport,
	},
	'final.listPostgresUsers': {
		input: RenderEndpointInputSchemas.listPostgresUsers,
		output: RenderEndpointOutputSchemas.listPostgresUsers,
	},
	'final.listRoutes': {
		input: RenderEndpointInputSchemas.listRoutes,
		output: RenderEndpointOutputSchemas.listRoutes,
	},
	'final.listSecretFiles': {
		input: RenderEndpointInputSchemas.listSecretFiles,
		output: RenderEndpointOutputSchemas.listSecretFiles,
	},
	'final.retrieveCustomDomain': {
		input: RenderEndpointInputSchemas.retrieveCustomDomain,
		output: RenderEndpointOutputSchemas.retrieveCustomDomain,
	},
	'final.retrieveDeploy': {
		input: RenderEndpointInputSchemas.retrieveDeploy,
		output: RenderEndpointOutputSchemas.retrieveDeploy,
	},
	'final.retrieveEnvGroupEnvVar': {
		input: RenderEndpointInputSchemas.retrieveEnvGroupEnvVar,
		output: RenderEndpointOutputSchemas.retrieveEnvGroupEnvVar,
	},
	'final.retrieveEnvGroupSecretFile': {
		input: RenderEndpointInputSchemas.retrieveEnvGroupSecretFile,
		output: RenderEndpointOutputSchemas.retrieveEnvGroupSecretFile,
	},
	'final.retrieveEnvVar': {
		input: RenderEndpointInputSchemas.retrieveEnvVar,
		output: RenderEndpointOutputSchemas.retrieveEnvVar,
	},
	'final.retrieveOwnerNotificationSettings': {
		input: RenderEndpointInputSchemas.retrieveOwnerNotificationSettings,
		output: RenderEndpointOutputSchemas.retrieveOwnerNotificationSettings,
	},
	'final.retrieveSecretFile': {
		input: RenderEndpointInputSchemas.retrieveSecretFile,
		output: RenderEndpointOutputSchemas.retrieveSecretFile,
	},
	'final.updateEnvGroupEnvVar': {
		input: RenderEndpointInputSchemas.updateEnvGroupEnvVar,
		output: RenderEndpointOutputSchemas.updateEnvGroupEnvVar,
	},
	'final.updateEnvGroupSecretFile': {
		input: RenderEndpointInputSchemas.updateEnvGroupSecretFile,
		output: RenderEndpointOutputSchemas.updateEnvGroupSecretFile,
	},
	'final.updateEnvVar': {
		input: RenderEndpointInputSchemas.updateEnvVar,
		output: RenderEndpointOutputSchemas.updateEnvVar,
	},
	'final.updateEnvVarsForService': {
		input: RenderEndpointInputSchemas.updateEnvVarsForService,
		output: RenderEndpointOutputSchemas.updateEnvVarsForService,
	},
	'final.updateHeaders': {
		input: RenderEndpointInputSchemas.updateHeaders,
		output: RenderEndpointOutputSchemas.updateHeaders,
	},
	'final.updateResourceLogStream': {
		input: RenderEndpointInputSchemas.updateResourceLogStream,
		output: RenderEndpointOutputSchemas.updateResourceLogStream,
	},
	'final.updateSecretFilesForService': {
		input: RenderEndpointInputSchemas.updateSecretFilesForService,
		output: RenderEndpointOutputSchemas.updateSecretFilesForService,
	},
	'final.verifyCustomDomain': {
		input: RenderEndpointInputSchemas.verifyCustomDomain,
		output: RenderEndpointOutputSchemas.verifyCustomDomain,
	},
	'final.deleteOwnerMetricsStream': {
		input: RenderEndpointInputSchemas.deleteOwnerMetricsStream,
		output: RenderEndpointOutputSchemas.deleteOwnerMetricsStream,
	},
	'final.updateOwnerNotificationSettings': {
		input: RenderEndpointInputSchemas.updateOwnerNotificationSettings,
		output: RenderEndpointOutputSchemas.updateOwnerNotificationSettings,
	},
	'final.updateRoutes': {
		input: RenderEndpointInputSchemas.updateRoutes,
		output: RenderEndpointOutputSchemas.updateRoutes,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof renderEndpointsNested
>;

// unknown: endpoint trees mix nested groups and handlers; narrowed by typeof checks.
type RenderEndpointTree = Record<string, unknown>;
// unknown: wrappers receive core context/input before Zod parsing and re-parse output.
type RenderEndpointHandler = (ctx: unknown, input: unknown) => Promise<unknown>;

/**
 * Binds every Render endpoint to its declared input and output schemas.
 * `endpointSchemas` is also exposed for introspection, but the shared Corsair
 * binder does not execute those metadata schemas. Validation here prevents
 * malformed requests from reaching Render and rejects incompatible responses.
 */
function withRenderSchemas<T extends RenderEndpointTree>(
	tree: T,
	prefix = '',
): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				renderEndpointSchemas[operation as keyof typeof renderEndpointSchemas];
			if (!schema) {
				throw new Error(`Missing Render endpoint schema for ${operation}`);
			}
			const endpoint = value as RenderEndpointHandler;
			const validated: RenderEndpointHandler = async (ctx, input) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [key, withRenderSchemas(value as RenderEndpointTree, operation)];
		}
		return [key, value];
	});
	return Object.fromEntries(validatedEntries) as T;
}

const validatedRenderEndpointsNested = withRenderSchemas(renderEndpointsNested);

const renderEndpointMeta = {
	'services.list': {
		riskLevel: 'read',
		description: 'List Render services accessible to the authenticated owner',
	},
	'services.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Render service',
	},
	'services.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Render service',
	},
	'services.update': {
		riskLevel: 'write',
		description: 'Update a Render service',
	},
	'services.triggerDeploy': {
		riskLevel: 'write',
		description: 'Trigger a Render deployment',
	},
	'services.listDeploys': {
		riskLevel: 'read',
		description: 'List deployments for a Render service',
	},
	'services.purgeCache': {
		riskLevel: 'write',
		description: 'Purge the cache for a Render service',
	},
	'services.cancelDeploy': {
		riskLevel: 'write',
		description: 'Cancel a Render deployment',
	},
	'services.rollbackDeploy': {
		riskLevel: 'write',
		description: 'Roll back a Render service deployment',
	},
	'services.listEvents': {
		riskLevel: 'read',
		description: 'List events for a Render service',
	},
	'services.listOutboundIps': {
		riskLevel: 'read',
		description: 'List outbound IPs for a Render service',
	},
	'services.jobs.list': {
		riskLevel: 'read',
		description: 'List jobs for a Render service',
	},
	'services.jobs.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Render service job',
	},
	'services.jobs.create': {
		riskLevel: 'write',
		description: 'Create a job run for a Render service',
	},
	'services.jobs.cancel': {
		riskLevel: 'write',
		description: 'Cancel a running job on a Render service',
	},
	'services.restart': {
		riskLevel: 'write',
		description: 'Restart a Render service',
	},
	'services.suspend': {
		riskLevel: 'write',
		description: 'Suspend a Render service',
	},
	'services.resume': {
		riskLevel: 'write',
		description: 'Resume a Render service',
	},
	'services.environments.list': {
		riskLevel: 'read',
		description: 'List Render environments',
	},
	'services.environments.create': {
		riskLevel: 'write',
		description: 'Create a Render environment',
	},
	'services.environments.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Render environment',
	},
	'services.environments.update': {
		riskLevel: 'write',
		description: 'Update a Render environment',
	},
	'services.environments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Render environment',
	},
	'services.envGroups.list': {
		riskLevel: 'read',
		description: 'List Render environment groups',
	},
	'services.envGroups.create': {
		riskLevel: 'write',
		description: 'Create a Render environment group',
	},
	'services.envGroups.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Render environment group',
	},
	'services.envGroups.update': {
		riskLevel: 'write',
		description: 'Update a Render environment group',
	},
	'services.envGroups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Render environment group',
	},
	'projects.list': { riskLevel: 'read', description: 'List Render projects' },
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a Render project',
	},
	'projects.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Render project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update a Render project',
	},
	'postgres.list': {
		riskLevel: 'read',
		description: 'List Render Postgres databases',
	},
	'postgres.create': {
		riskLevel: 'write',
		description: 'Create a Render Postgres database',
	},
	'postgres.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Render Postgres database',
	},
	'postgres.update': {
		riskLevel: 'write',
		description: 'Update a Render Postgres database',
	},
	'registryCredentials.list': {
		riskLevel: 'read',
		description: 'List registry credentials',
	},
	'registryCredentials.create': {
		riskLevel: 'write',
		description: 'Create registry credentials',
	},
	'registryCredentials.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve registry credentials',
	},
	'registryCredentials.update': {
		riskLevel: 'write',
		description: 'Update registry credentials',
	},
	'registryCredentials.delete': {
		riskLevel: 'destructive',
		description: 'Delete registry credentials',
	},
	'owners.list': { riskLevel: 'read', description: 'List Render owners' },
	'owners.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Render owner',
	},
	'owners.members': {
		riskLevel: 'read',
		description: 'List Render owner members',
	},
	'user.get': {
		riskLevel: 'read',
		description: 'Retrieve the authenticated Render user',
	},
	'logs.list': { riskLevel: 'read', description: 'List Render logs' },
	'logs.values': { riskLevel: 'read', description: 'List Render log values' },
	'logs.subscribe': {
		riskLevel: 'read',
		description: 'Subscribe to Render logs',
	},
	'logs.resourceStreams': {
		riskLevel: 'read',
		description: 'List resource log streams',
	},
	'logs.deleteOwnerStream': {
		riskLevel: 'destructive',
		description: 'Delete an owner log stream',
	},
	'logs.updateOwnerStream': {
		riskLevel: 'write',
		description: 'Update an owner log stream',
	},
	'metrics.activeConnections': {
		riskLevel: 'read',
		description: 'Read active Render connections',
	},
	'metrics.bandwidthSources': {
		riskLevel: 'read',
		description: 'Read Render bandwidth sources',
	},
	'metrics.cpu': { riskLevel: 'read', description: 'Read Render CPU metrics' },
	'metrics.cpuLimit': {
		riskLevel: 'read',
		description: 'Read Render CPU limits',
	},
	'metrics.diskCapacity': {
		riskLevel: 'read',
		description: 'Read Render disk capacity',
	},
	'metrics.diskUsage': {
		riskLevel: 'read',
		description: 'Read Render disk usage',
	},
	'metrics.instanceCount': {
		riskLevel: 'read',
		description: 'Read Render instance counts',
	},
	'metrics.memory': {
		riskLevel: 'read',
		description: 'Read Render memory metrics',
	},
	'metrics.memoryLimit': {
		riskLevel: 'read',
		description: 'Read Render memory limits',
	},
	'metrics.memoryTarget': {
		riskLevel: 'read',
		description: 'Read Render memory targets',
	},
	'metrics.applicationFilterValues': {
		riskLevel: 'read',
		description: 'List Render application metric filter values',
	},
	'automation.listDisks': {
		riskLevel: 'read',
		description: 'List Render disks',
	},
	'automation.listMaintenance': {
		riskLevel: 'read',
		description: 'List Render maintenance windows',
	},
	'automation.listTaskRuns': {
		riskLevel: 'read',
		description: 'List Render task runs',
	},
	'automation.listTasks': {
		riskLevel: 'read',
		description: 'List Render tasks',
	},
	'automation.streamTaskRunsEvents': {
		riskLevel: 'read',
		description: 'Stream Render task run events',
	},
	'automation.listWorkflows': {
		riskLevel: 'read',
		description: 'List Render workflows',
	},
	'automation.listWorkflowVersions': {
		riskLevel: 'read',
		description: 'List Render workflow versions',
	},
	'automation.listWebhooks': {
		riskLevel: 'read',
		description: 'List Render webhooks',
	},
	'automation.createDisk': {
		riskLevel: 'write',
		description: 'Create a disk for a Render service',
	},
	'automation.retrieveDisk': {
		riskLevel: 'read',
		description: 'Retrieve a Render disk',
	},
	'automation.updateDisk': {
		riskLevel: 'write',
		description: 'Update a Render disk',
	},
	'automation.deleteDisk': {
		riskLevel: 'destructive',
		description: 'Delete a Render disk',
	},
	'automation.listDiskSnapshots': {
		riskLevel: 'read',
		description: 'List snapshots for a Render disk',
	},
	'automation.restoreDiskSnapshot': {
		riskLevel: 'write',
		description: 'Restore a snapshot to a Render disk',
	},
	'final.addHeaders': { riskLevel: 'write', description: 'Render addHeaders' },
	'final.addOrUpdateSecretFile': {
		riskLevel: 'write',
		description: 'Render addOrUpdateSecretFile',
	},
	'final.addResourcesToEnvironment': {
		riskLevel: 'write',
		description: 'Render addResourcesToEnvironment',
	},
	'final.addRoute': { riskLevel: 'write', description: 'Render addRoute' },
	'final.createCustomDomain': {
		riskLevel: 'write',
		description: 'Render createCustomDomain',
	},
	'final.deleteEnvGroupEnvVar': {
		riskLevel: 'destructive',
		description: 'Render deleteEnvGroupEnvVar',
	},
	'final.deleteEnvGroupSecretFile': {
		riskLevel: 'destructive',
		description: 'Render deleteEnvGroupSecretFile',
	},
	'final.deleteKeyValue': {
		riskLevel: 'destructive',
		description: 'Render deleteKeyValue',
	},
	'final.deleteSecretFile': {
		riskLevel: 'destructive',
		description: 'Render deleteSecretFile',
	},
	'final.disconnectBlueprint': {
		riskLevel: 'destructive',
		description: 'Render disconnectBlueprint',
	},
	'final.linkServiceToEnvGroup': {
		riskLevel: 'write',
		description: 'Render linkServiceToEnvGroup',
	},
	'final.listBlueprints': {
		riskLevel: 'read',
		description: 'Render listBlueprints',
	},
	'final.listInstances': {
		riskLevel: 'read',
		description: 'Render listInstances',
	},
	'final.listKeyValue': {
		riskLevel: 'read',
		description: 'Render listKeyValue',
	},
	'final.listNotificationOverrides': {
		riskLevel: 'read',
		description: 'Render listNotificationOverrides',
	},
	'final.listPostgresExport': {
		riskLevel: 'read',
		description: 'Render listPostgresExport',
	},
	'final.listPostgresUsers': {
		riskLevel: 'read',
		description: 'Render listPostgresUsers',
	},
	'final.listRoutes': { riskLevel: 'read', description: 'Render listRoutes' },
	'final.listSecretFiles': {
		riskLevel: 'read',
		description: 'Render listSecretFiles',
	},
	'final.retrieveCustomDomain': {
		riskLevel: 'read',
		description: 'Render retrieveCustomDomain',
	},
	'final.retrieveDeploy': {
		riskLevel: 'read',
		description: 'Render retrieveDeploy',
	},
	'final.retrieveEnvGroupEnvVar': {
		riskLevel: 'read',
		description: 'Render retrieveEnvGroupEnvVar',
	},
	'final.retrieveEnvGroupSecretFile': {
		riskLevel: 'read',
		description: 'Render retrieveEnvGroupSecretFile',
	},
	'final.retrieveEnvVar': {
		riskLevel: 'read',
		description: 'Render retrieveEnvVar',
	},
	'final.retrieveOwnerNotificationSettings': {
		riskLevel: 'read',
		description: 'Render retrieveOwnerNotificationSettings',
	},
	'final.retrieveSecretFile': {
		riskLevel: 'read',
		description: 'Render retrieveSecretFile',
	},
	'final.updateEnvGroupEnvVar': {
		riskLevel: 'write',
		description: 'Render updateEnvGroupEnvVar',
	},
	'final.updateEnvGroupSecretFile': {
		riskLevel: 'write',
		description: 'Render updateEnvGroupSecretFile',
	},
	'final.updateEnvVar': {
		riskLevel: 'write',
		description: 'Render updateEnvVar',
	},
	'final.updateEnvVarsForService': {
		riskLevel: 'write',
		description: 'Render updateEnvVarsForService',
	},
	'final.updateHeaders': {
		riskLevel: 'write',
		description: 'Render updateHeaders',
	},
	'final.updateResourceLogStream': {
		riskLevel: 'write',
		description: 'Render updateResourceLogStream',
	},
	'final.updateSecretFilesForService': {
		riskLevel: 'write',
		description: 'Render updateSecretFilesForService',
	},
	'final.verifyCustomDomain': {
		riskLevel: 'write',
		description: 'Render verifyCustomDomain',
	},
	'final.deleteOwnerMetricsStream': {
		riskLevel: 'destructive',
		description: 'Render deleteOwnerMetricsStream',
	},
	'final.updateOwnerNotificationSettings': {
		riskLevel: 'write',
		description: 'Render updateOwnerNotificationSettings',
	},
	'final.updateRoutes': {
		riskLevel: 'write',
		description: 'Render updateRoutes',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof renderEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';
export const renderAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseRenderPlugin<T extends RenderPluginOptions> = CorsairPlugin<
	'render',
	typeof RenderSchema,
	typeof renderEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalRenderPlugin = BaseRenderPlugin<RenderPluginOptions>;
export type ExternalRenderPlugin<T extends RenderPluginOptions> =
	BaseRenderPlugin<T>;

export function render<const T extends RenderPluginOptions>(
	incomingOptions: RenderPluginOptions & T = {} as RenderPluginOptions & T,
): ExternalRenderPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'render',
		authConfig: renderAuthConfig,
		schema: RenderSchema,
		options,
		hooks: options.hooks,
		// Every public endpoint is the schema-bound tree. endpointSchemas remains
		// introspection metadata; calls use this validated tree at runtime.
		endpoints: validatedRenderEndpointsNested,
		webhooks: {},
		endpointMeta: renderEndpointMeta,
		endpointSchemas: renderEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: RenderKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('render', 'api_key');
		},
	} satisfies InternalRenderPlugin;
}

export type {
	RenderEndpointInputs,
	RenderEndpointOutputs,
} from './endpoints/types';
