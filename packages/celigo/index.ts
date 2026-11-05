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
import type { CeligoRegion } from './client';
import {
	Account,
	Audit,
	Connections,
	EdiProfiles,
	Errors,
	Exports,
	FileDefinitions,
	Flows,
	IClients,
	Imports,
	Integrations,
	Jobs,
	Processors,
	Scripts,
	State,
	Tags,
	Users,
} from './endpoints';
import type {
	CeligoEndpointInputs,
	CeligoEndpointOutputs,
} from './endpoints/types';
import {
	CeligoEndpointInputSchemas,
	CeligoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CeligoSchema } from './schema';

export type CeligoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * integrator.io data center. Defaults to `us` (api.integrator.io).
	 * Tokens only work in the region where they were created.
	 */
	region?: CeligoRegion;
	hooks?: InternalCeligoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof celigoEndpointsNested>;
};

export type CeligoContext = CorsairPluginContext<
	typeof CeligoSchema,
	CeligoPluginOptions
>;

export type CeligoKeyBuilderContext = KeyBuilderContext<CeligoPluginOptions>;

export type CeligoBoundEndpoints = BindEndpoints<typeof celigoEndpointsNested>;

type CeligoEndpoint<K extends keyof CeligoEndpointOutputs> = CorsairEndpoint<
	CeligoContext,
	CeligoEndpointInputs[K],
	CeligoEndpointOutputs[K]
>;

export type CeligoEndpoints = {
	accountGetTokenInfo: CeligoEndpoint<'accountGetTokenInfo'>;
	accountListLicenses: CeligoEndpoint<'accountListLicenses'>;
	auditList: CeligoEndpoint<'auditList'>;
	connectionsList: CeligoEndpoint<'connectionsList'>;
	connectionsGet: CeligoEndpoint<'connectionsGet'>;
	connectionsCreate: CeligoEndpoint<'connectionsCreate'>;
	connectionsUpdate: CeligoEndpoint<'connectionsUpdate'>;
	connectionsPatch: CeligoEndpoint<'connectionsPatch'>;
	connectionsDelete: CeligoEndpoint<'connectionsDelete'>;
	connectionsPing: CeligoEndpoint<'connectionsPing'>;
	connectionsTestVirtual: CeligoEndpoint<'connectionsTestVirtual'>;
	connectionsGetDebugLogs: CeligoEndpoint<'connectionsGetDebugLogs'>;
	connectionsGetDependencies: CeligoEndpoint<'connectionsGetDependencies'>;
	connectionsGetAudit: CeligoEndpoint<'connectionsGetAudit'>;
	connectionsExecuteVirtualExport: CeligoEndpoint<'connectionsExecuteVirtualExport'>;
	connectionsExecuteVirtualExportPaged: CeligoEndpoint<'connectionsExecuteVirtualExportPaged'>;
	connectionsExecuteVirtualImport: CeligoEndpoint<'connectionsExecuteVirtualImport'>;
	connectionsEvaluateVirtualImportMap: CeligoEndpoint<'connectionsEvaluateVirtualImportMap'>;
	ediProfilesList: CeligoEndpoint<'ediProfilesList'>;
	errorsList: CeligoEndpoint<'errorsList'>;
	errorsListResolved: CeligoEndpoint<'errorsListResolved'>;
	errorsResolve: CeligoEndpoint<'errorsResolve'>;
	errorsDeleteResolved: CeligoEndpoint<'errorsDeleteResolved'>;
	errorsRetry: CeligoEndpoint<'errorsRetry'>;
	errorsAssign: CeligoEndpoint<'errorsAssign'>;
	errorsUpdateTags: CeligoEndpoint<'errorsUpdateTags'>;
	exportsList: CeligoEndpoint<'exportsList'>;
	exportsGet: CeligoEndpoint<'exportsGet'>;
	exportsCreate: CeligoEndpoint<'exportsCreate'>;
	exportsUpdate: CeligoEndpoint<'exportsUpdate'>;
	exportsPatch: CeligoEndpoint<'exportsPatch'>;
	exportsDelete: CeligoEndpoint<'exportsDelete'>;
	exportsClone: CeligoEndpoint<'exportsClone'>;
	exportsGetAudit: CeligoEndpoint<'exportsGetAudit'>;
	importsList: CeligoEndpoint<'importsList'>;
	importsGet: CeligoEndpoint<'importsGet'>;
	importsCreate: CeligoEndpoint<'importsCreate'>;
	importsUpdate: CeligoEndpoint<'importsUpdate'>;
	importsPatch: CeligoEndpoint<'importsPatch'>;
	importsDelete: CeligoEndpoint<'importsDelete'>;
	importsClone: CeligoEndpoint<'importsClone'>;
	importsGetAudit: CeligoEndpoint<'importsGetAudit'>;
	importsGetDependencies: CeligoEndpoint<'importsGetDependencies'>;
	importsInvoke: CeligoEndpoint<'importsInvoke'>;
	flowsList: CeligoEndpoint<'flowsList'>;
	flowsGet: CeligoEndpoint<'flowsGet'>;
	flowsCreate: CeligoEndpoint<'flowsCreate'>;
	flowsUpdate: CeligoEndpoint<'flowsUpdate'>;
	flowsPatch: CeligoEndpoint<'flowsPatch'>;
	flowsDelete: CeligoEndpoint<'flowsDelete'>;
	flowsClone: CeligoEndpoint<'flowsClone'>;
	flowsGetAudit: CeligoEndpoint<'flowsGetAudit'>;
	flowsGetDependencies: CeligoEndpoint<'flowsGetDependencies'>;
	flowsGetDescendants: CeligoEndpoint<'flowsGetDescendants'>;
	flowsGetLastExportDateTime: CeligoEndpoint<'flowsGetLastExportDateTime'>;
	flowsGetLatestJobs: CeligoEndpoint<'flowsGetLatestJobs'>;
	flowsGetTemplate: CeligoEndpoint<'flowsGetTemplate'>;
	integrationsList: CeligoEndpoint<'integrationsList'>;
	integrationsGet: CeligoEndpoint<'integrationsGet'>;
	integrationsCreate: CeligoEndpoint<'integrationsCreate'>;
	integrationsUpdate: CeligoEndpoint<'integrationsUpdate'>;
	integrationsPatch: CeligoEndpoint<'integrationsPatch'>;
	integrationsDelete: CeligoEndpoint<'integrationsDelete'>;
	integrationsClone: CeligoEndpoint<'integrationsClone'>;
	integrationsGetAudit: CeligoEndpoint<'integrationsGetAudit'>;
	integrationsGetDependencies: CeligoEndpoint<'integrationsGetDependencies'>;
	integrationsListFlows: CeligoEndpoint<'integrationsListFlows'>;
	integrationsListExports: CeligoEndpoint<'integrationsListExports'>;
	integrationsListImports: CeligoEndpoint<'integrationsListImports'>;
	integrationsListConnections: CeligoEndpoint<'integrationsListConnections'>;
	integrationsListUsers: CeligoEndpoint<'integrationsListUsers'>;
	integrationsListErrors: CeligoEndpoint<'integrationsListErrors'>;
	integrationsGetTemplate: CeligoEndpoint<'integrationsGetTemplate'>;
	integrationsCreateRevision: CeligoEndpoint<'integrationsCreateRevision'>;
	integrationsRegisterConnection: CeligoEndpoint<'integrationsRegisterConnection'>;
	integrationsRegisterConnections: CeligoEndpoint<'integrationsRegisterConnections'>;
	integrationsUnregisterConnection: CeligoEndpoint<'integrationsUnregisterConnection'>;
	fileDefinitionsList: CeligoEndpoint<'fileDefinitionsList'>;
	fileDefinitionsGet: CeligoEndpoint<'fileDefinitionsGet'>;
	fileDefinitionsCreate: CeligoEndpoint<'fileDefinitionsCreate'>;
	iClientsList: CeligoEndpoint<'iClientsList'>;
	iClientsGet: CeligoEndpoint<'iClientsGet'>;
	iClientsCreate: CeligoEndpoint<'iClientsCreate'>;
	iClientsUpdate: CeligoEndpoint<'iClientsUpdate'>;
	iClientsPatch: CeligoEndpoint<'iClientsPatch'>;
	iClientsDelete: CeligoEndpoint<'iClientsDelete'>;
	jobsList: CeligoEndpoint<'jobsList'>;
	jobsGetErrors: CeligoEndpoint<'jobsGetErrors'>;
	processorsParseCsv: CeligoEndpoint<'processorsParseCsv'>;
	processorsParseXml: CeligoEndpoint<'processorsParseXml'>;
	processorsParseStructuredFile: CeligoEndpoint<'processorsParseStructuredFile'>;
	processorsGenerateStructuredFile: CeligoEndpoint<'processorsGenerateStructuredFile'>;
	scriptsGet: CeligoEndpoint<'scriptsGet'>;
	scriptsCreate: CeligoEndpoint<'scriptsCreate'>;
	scriptsUpdate: CeligoEndpoint<'scriptsUpdate'>;
	scriptsDelete: CeligoEndpoint<'scriptsDelete'>;
	scriptsGetLogs: CeligoEndpoint<'scriptsGetLogs'>;
	stateList: CeligoEndpoint<'stateList'>;
	stateGet: CeligoEndpoint<'stateGet'>;
	stateSet: CeligoEndpoint<'stateSet'>;
	stateDelete: CeligoEndpoint<'stateDelete'>;
	stateDeleteAll: CeligoEndpoint<'stateDeleteAll'>;
	stateListForResource: CeligoEndpoint<'stateListForResource'>;
	stateGetForResource: CeligoEndpoint<'stateGetForResource'>;
	stateSetForResource: CeligoEndpoint<'stateSetForResource'>;
	stateDeleteForResource: CeligoEndpoint<'stateDeleteForResource'>;
	stateDeleteAllForResource: CeligoEndpoint<'stateDeleteAllForResource'>;
	tagsList: CeligoEndpoint<'tagsList'>;
	tagsGet: CeligoEndpoint<'tagsGet'>;
	tagsCreate: CeligoEndpoint<'tagsCreate'>;
	tagsUpdate: CeligoEndpoint<'tagsUpdate'>;
	tagsDelete: CeligoEndpoint<'tagsDelete'>;
	usersList: CeligoEndpoint<'usersList'>;
	usersGet: CeligoEndpoint<'usersGet'>;
	usersInvite: CeligoEndpoint<'usersInvite'>;
	usersInviteMultiple: CeligoEndpoint<'usersInviteMultiple'>;
	usersUpdate: CeligoEndpoint<'usersUpdate'>;
	usersDelete: CeligoEndpoint<'usersDelete'>;
};

const celigoEndpointsNested = {
	account: {
		getTokenInfo: Account.getTokenInfo,
		listLicenses: Account.listLicenses,
	},
	audit: {
		list: Audit.list,
	},
	connections: {
		list: Connections.list,
		get: Connections.get,
		create: Connections.create,
		update: Connections.update,
		patch: Connections.patch,
		delete: Connections.remove,
		ping: Connections.ping,
		testVirtual: Connections.testVirtual,
		getDebugLogs: Connections.getDebugLogs,
		getDependencies: Connections.getDependencies,
		getAudit: Connections.getAudit,
		executeVirtualExport: Connections.executeVirtualExport,
		executeVirtualExportPaged: Connections.executeVirtualExportPaged,
		executeVirtualImport: Connections.executeVirtualImport,
		evaluateVirtualImportMap: Connections.evaluateVirtualImportMap,
	},
	ediProfiles: {
		list: EdiProfiles.list,
	},
	errors: {
		list: Errors.list,
		listResolved: Errors.listResolved,
		resolve: Errors.resolve,
		deleteResolved: Errors.deleteResolved,
		retry: Errors.retry,
		assign: Errors.assign,
		updateTags: Errors.updateTags,
	},
	exports: {
		list: Exports.list,
		get: Exports.get,
		create: Exports.create,
		update: Exports.update,
		patch: Exports.patch,
		delete: Exports.remove,
		clone: Exports.clone,
		getAudit: Exports.getAudit,
	},
	imports: {
		list: Imports.list,
		get: Imports.get,
		create: Imports.create,
		update: Imports.update,
		patch: Imports.patch,
		delete: Imports.remove,
		clone: Imports.clone,
		getAudit: Imports.getAudit,
		getDependencies: Imports.getDependencies,
		invoke: Imports.invoke,
	},
	flows: {
		list: Flows.list,
		get: Flows.get,
		create: Flows.create,
		update: Flows.update,
		patch: Flows.patch,
		delete: Flows.remove,
		clone: Flows.clone,
		getAudit: Flows.getAudit,
		getDependencies: Flows.getDependencies,
		getDescendants: Flows.getDescendants,
		getLastExportDateTime: Flows.getLastExportDateTime,
		getLatestJobs: Flows.getLatestJobs,
		getTemplate: Flows.getTemplate,
	},
	integrations: {
		list: Integrations.list,
		get: Integrations.get,
		create: Integrations.create,
		update: Integrations.update,
		patch: Integrations.patch,
		delete: Integrations.remove,
		clone: Integrations.clone,
		getAudit: Integrations.getAudit,
		getDependencies: Integrations.getDependencies,
		listFlows: Integrations.listFlows,
		listExports: Integrations.listExports,
		listImports: Integrations.listImports,
		listConnections: Integrations.listConnections,
		listUsers: Integrations.listUsers,
		listErrors: Integrations.listErrors,
		getTemplate: Integrations.getTemplate,
		createRevision: Integrations.createRevision,
		registerConnection: Integrations.registerConnection,
		registerConnections: Integrations.registerConnections,
		unregisterConnection: Integrations.unregisterConnection,
	},
	fileDefinitions: {
		list: FileDefinitions.list,
		get: FileDefinitions.get,
		create: FileDefinitions.create,
	},
	iClients: {
		list: IClients.list,
		get: IClients.get,
		create: IClients.create,
		update: IClients.update,
		patch: IClients.patch,
		delete: IClients.remove,
	},
	jobs: {
		list: Jobs.list,
		getErrors: Jobs.getErrors,
	},
	processors: {
		parseCsv: Processors.parseCsv,
		parseXml: Processors.parseXml,
		parseStructuredFile: Processors.parseStructuredFile,
		generateStructuredFile: Processors.generateStructuredFile,
	},
	scripts: {
		get: Scripts.get,
		create: Scripts.create,
		update: Scripts.update,
		delete: Scripts.remove,
		getLogs: Scripts.getLogs,
	},
	state: {
		list: State.list,
		get: State.get,
		set: State.set,
		delete: State.remove,
		deleteAll: State.deleteAll,
		listForResource: State.listForResource,
		getForResource: State.getForResource,
		setForResource: State.setForResource,
		deleteForResource: State.deleteForResource,
		deleteAllForResource: State.deleteAllForResource,
	},
	tags: {
		list: Tags.list,
		get: Tags.get,
		create: Tags.create,
		update: Tags.update,
		delete: Tags.remove,
	},
	users: {
		list: Users.list,
		get: Users.get,
		invite: Users.invite,
		inviteMultiple: Users.inviteMultiple,
		update: Users.update,
		delete: Users.remove,
	},
} as const;

const celigoWebhooksNested = {} as const;

export const celigoEndpointSchemas = {
	'account.getTokenInfo': {
		input: CeligoEndpointInputSchemas.accountGetTokenInfo,
		output: CeligoEndpointOutputSchemas.accountGetTokenInfo,
	},
	'account.listLicenses': {
		input: CeligoEndpointInputSchemas.accountListLicenses,
		output: CeligoEndpointOutputSchemas.accountListLicenses,
	},
	'audit.list': {
		input: CeligoEndpointInputSchemas.auditList,
		output: CeligoEndpointOutputSchemas.auditList,
	},
	'connections.list': {
		input: CeligoEndpointInputSchemas.connectionsList,
		output: CeligoEndpointOutputSchemas.connectionsList,
	},
	'connections.get': {
		input: CeligoEndpointInputSchemas.connectionsGet,
		output: CeligoEndpointOutputSchemas.connectionsGet,
	},
	'connections.create': {
		input: CeligoEndpointInputSchemas.connectionsCreate,
		output: CeligoEndpointOutputSchemas.connectionsCreate,
	},
	'connections.update': {
		input: CeligoEndpointInputSchemas.connectionsUpdate,
		output: CeligoEndpointOutputSchemas.connectionsUpdate,
	},
	'connections.patch': {
		input: CeligoEndpointInputSchemas.connectionsPatch,
		output: CeligoEndpointOutputSchemas.connectionsPatch,
	},
	'connections.delete': {
		input: CeligoEndpointInputSchemas.connectionsDelete,
		output: CeligoEndpointOutputSchemas.connectionsDelete,
	},
	'connections.ping': {
		input: CeligoEndpointInputSchemas.connectionsPing,
		output: CeligoEndpointOutputSchemas.connectionsPing,
	},
	'connections.testVirtual': {
		input: CeligoEndpointInputSchemas.connectionsTestVirtual,
		output: CeligoEndpointOutputSchemas.connectionsTestVirtual,
	},
	'connections.getDebugLogs': {
		input: CeligoEndpointInputSchemas.connectionsGetDebugLogs,
		output: CeligoEndpointOutputSchemas.connectionsGetDebugLogs,
	},
	'connections.getDependencies': {
		input: CeligoEndpointInputSchemas.connectionsGetDependencies,
		output: CeligoEndpointOutputSchemas.connectionsGetDependencies,
	},
	'connections.getAudit': {
		input: CeligoEndpointInputSchemas.connectionsGetAudit,
		output: CeligoEndpointOutputSchemas.connectionsGetAudit,
	},
	'connections.executeVirtualExport': {
		input: CeligoEndpointInputSchemas.connectionsExecuteVirtualExport,
		output: CeligoEndpointOutputSchemas.connectionsExecuteVirtualExport,
	},
	'connections.executeVirtualExportPaged': {
		input: CeligoEndpointInputSchemas.connectionsExecuteVirtualExportPaged,
		output: CeligoEndpointOutputSchemas.connectionsExecuteVirtualExportPaged,
	},
	'connections.executeVirtualImport': {
		input: CeligoEndpointInputSchemas.connectionsExecuteVirtualImport,
		output: CeligoEndpointOutputSchemas.connectionsExecuteVirtualImport,
	},
	'connections.evaluateVirtualImportMap': {
		input: CeligoEndpointInputSchemas.connectionsEvaluateVirtualImportMap,
		output: CeligoEndpointOutputSchemas.connectionsEvaluateVirtualImportMap,
	},
	'ediProfiles.list': {
		input: CeligoEndpointInputSchemas.ediProfilesList,
		output: CeligoEndpointOutputSchemas.ediProfilesList,
	},
	'errors.list': {
		input: CeligoEndpointInputSchemas.errorsList,
		output: CeligoEndpointOutputSchemas.errorsList,
	},
	'errors.listResolved': {
		input: CeligoEndpointInputSchemas.errorsListResolved,
		output: CeligoEndpointOutputSchemas.errorsListResolved,
	},
	'errors.resolve': {
		input: CeligoEndpointInputSchemas.errorsResolve,
		output: CeligoEndpointOutputSchemas.errorsResolve,
	},
	'errors.deleteResolved': {
		input: CeligoEndpointInputSchemas.errorsDeleteResolved,
		output: CeligoEndpointOutputSchemas.errorsDeleteResolved,
	},
	'errors.retry': {
		input: CeligoEndpointInputSchemas.errorsRetry,
		output: CeligoEndpointOutputSchemas.errorsRetry,
	},
	'errors.assign': {
		input: CeligoEndpointInputSchemas.errorsAssign,
		output: CeligoEndpointOutputSchemas.errorsAssign,
	},
	'errors.updateTags': {
		input: CeligoEndpointInputSchemas.errorsUpdateTags,
		output: CeligoEndpointOutputSchemas.errorsUpdateTags,
	},
	'exports.list': {
		input: CeligoEndpointInputSchemas.exportsList,
		output: CeligoEndpointOutputSchemas.exportsList,
	},
	'exports.get': {
		input: CeligoEndpointInputSchemas.exportsGet,
		output: CeligoEndpointOutputSchemas.exportsGet,
	},
	'exports.create': {
		input: CeligoEndpointInputSchemas.exportsCreate,
		output: CeligoEndpointOutputSchemas.exportsCreate,
	},
	'exports.update': {
		input: CeligoEndpointInputSchemas.exportsUpdate,
		output: CeligoEndpointOutputSchemas.exportsUpdate,
	},
	'exports.patch': {
		input: CeligoEndpointInputSchemas.exportsPatch,
		output: CeligoEndpointOutputSchemas.exportsPatch,
	},
	'exports.delete': {
		input: CeligoEndpointInputSchemas.exportsDelete,
		output: CeligoEndpointOutputSchemas.exportsDelete,
	},
	'exports.clone': {
		input: CeligoEndpointInputSchemas.exportsClone,
		output: CeligoEndpointOutputSchemas.exportsClone,
	},
	'exports.getAudit': {
		input: CeligoEndpointInputSchemas.exportsGetAudit,
		output: CeligoEndpointOutputSchemas.exportsGetAudit,
	},
	'imports.list': {
		input: CeligoEndpointInputSchemas.importsList,
		output: CeligoEndpointOutputSchemas.importsList,
	},
	'imports.get': {
		input: CeligoEndpointInputSchemas.importsGet,
		output: CeligoEndpointOutputSchemas.importsGet,
	},
	'imports.create': {
		input: CeligoEndpointInputSchemas.importsCreate,
		output: CeligoEndpointOutputSchemas.importsCreate,
	},
	'imports.update': {
		input: CeligoEndpointInputSchemas.importsUpdate,
		output: CeligoEndpointOutputSchemas.importsUpdate,
	},
	'imports.patch': {
		input: CeligoEndpointInputSchemas.importsPatch,
		output: CeligoEndpointOutputSchemas.importsPatch,
	},
	'imports.delete': {
		input: CeligoEndpointInputSchemas.importsDelete,
		output: CeligoEndpointOutputSchemas.importsDelete,
	},
	'imports.clone': {
		input: CeligoEndpointInputSchemas.importsClone,
		output: CeligoEndpointOutputSchemas.importsClone,
	},
	'imports.getAudit': {
		input: CeligoEndpointInputSchemas.importsGetAudit,
		output: CeligoEndpointOutputSchemas.importsGetAudit,
	},
	'imports.getDependencies': {
		input: CeligoEndpointInputSchemas.importsGetDependencies,
		output: CeligoEndpointOutputSchemas.importsGetDependencies,
	},
	'imports.invoke': {
		input: CeligoEndpointInputSchemas.importsInvoke,
		output: CeligoEndpointOutputSchemas.importsInvoke,
	},
	'flows.list': {
		input: CeligoEndpointInputSchemas.flowsList,
		output: CeligoEndpointOutputSchemas.flowsList,
	},
	'flows.get': {
		input: CeligoEndpointInputSchemas.flowsGet,
		output: CeligoEndpointOutputSchemas.flowsGet,
	},
	'flows.create': {
		input: CeligoEndpointInputSchemas.flowsCreate,
		output: CeligoEndpointOutputSchemas.flowsCreate,
	},
	'flows.update': {
		input: CeligoEndpointInputSchemas.flowsUpdate,
		output: CeligoEndpointOutputSchemas.flowsUpdate,
	},
	'flows.patch': {
		input: CeligoEndpointInputSchemas.flowsPatch,
		output: CeligoEndpointOutputSchemas.flowsPatch,
	},
	'flows.delete': {
		input: CeligoEndpointInputSchemas.flowsDelete,
		output: CeligoEndpointOutputSchemas.flowsDelete,
	},
	'flows.clone': {
		input: CeligoEndpointInputSchemas.flowsClone,
		output: CeligoEndpointOutputSchemas.flowsClone,
	},
	'flows.getAudit': {
		input: CeligoEndpointInputSchemas.flowsGetAudit,
		output: CeligoEndpointOutputSchemas.flowsGetAudit,
	},
	'flows.getDependencies': {
		input: CeligoEndpointInputSchemas.flowsGetDependencies,
		output: CeligoEndpointOutputSchemas.flowsGetDependencies,
	},
	'flows.getDescendants': {
		input: CeligoEndpointInputSchemas.flowsGetDescendants,
		output: CeligoEndpointOutputSchemas.flowsGetDescendants,
	},
	'flows.getLastExportDateTime': {
		input: CeligoEndpointInputSchemas.flowsGetLastExportDateTime,
		output: CeligoEndpointOutputSchemas.flowsGetLastExportDateTime,
	},
	'flows.getLatestJobs': {
		input: CeligoEndpointInputSchemas.flowsGetLatestJobs,
		output: CeligoEndpointOutputSchemas.flowsGetLatestJobs,
	},
	'flows.getTemplate': {
		input: CeligoEndpointInputSchemas.flowsGetTemplate,
		output: CeligoEndpointOutputSchemas.flowsGetTemplate,
	},
	'integrations.list': {
		input: CeligoEndpointInputSchemas.integrationsList,
		output: CeligoEndpointOutputSchemas.integrationsList,
	},
	'integrations.get': {
		input: CeligoEndpointInputSchemas.integrationsGet,
		output: CeligoEndpointOutputSchemas.integrationsGet,
	},
	'integrations.create': {
		input: CeligoEndpointInputSchemas.integrationsCreate,
		output: CeligoEndpointOutputSchemas.integrationsCreate,
	},
	'integrations.update': {
		input: CeligoEndpointInputSchemas.integrationsUpdate,
		output: CeligoEndpointOutputSchemas.integrationsUpdate,
	},
	'integrations.patch': {
		input: CeligoEndpointInputSchemas.integrationsPatch,
		output: CeligoEndpointOutputSchemas.integrationsPatch,
	},
	'integrations.delete': {
		input: CeligoEndpointInputSchemas.integrationsDelete,
		output: CeligoEndpointOutputSchemas.integrationsDelete,
	},
	'integrations.clone': {
		input: CeligoEndpointInputSchemas.integrationsClone,
		output: CeligoEndpointOutputSchemas.integrationsClone,
	},
	'integrations.getAudit': {
		input: CeligoEndpointInputSchemas.integrationsGetAudit,
		output: CeligoEndpointOutputSchemas.integrationsGetAudit,
	},
	'integrations.getDependencies': {
		input: CeligoEndpointInputSchemas.integrationsGetDependencies,
		output: CeligoEndpointOutputSchemas.integrationsGetDependencies,
	},
	'integrations.listFlows': {
		input: CeligoEndpointInputSchemas.integrationsListFlows,
		output: CeligoEndpointOutputSchemas.integrationsListFlows,
	},
	'integrations.listExports': {
		input: CeligoEndpointInputSchemas.integrationsListExports,
		output: CeligoEndpointOutputSchemas.integrationsListExports,
	},
	'integrations.listImports': {
		input: CeligoEndpointInputSchemas.integrationsListImports,
		output: CeligoEndpointOutputSchemas.integrationsListImports,
	},
	'integrations.listConnections': {
		input: CeligoEndpointInputSchemas.integrationsListConnections,
		output: CeligoEndpointOutputSchemas.integrationsListConnections,
	},
	'integrations.listUsers': {
		input: CeligoEndpointInputSchemas.integrationsListUsers,
		output: CeligoEndpointOutputSchemas.integrationsListUsers,
	},
	'integrations.listErrors': {
		input: CeligoEndpointInputSchemas.integrationsListErrors,
		output: CeligoEndpointOutputSchemas.integrationsListErrors,
	},
	'integrations.getTemplate': {
		input: CeligoEndpointInputSchemas.integrationsGetTemplate,
		output: CeligoEndpointOutputSchemas.integrationsGetTemplate,
	},
	'integrations.createRevision': {
		input: CeligoEndpointInputSchemas.integrationsCreateRevision,
		output: CeligoEndpointOutputSchemas.integrationsCreateRevision,
	},
	'integrations.registerConnection': {
		input: CeligoEndpointInputSchemas.integrationsRegisterConnection,
		output: CeligoEndpointOutputSchemas.integrationsRegisterConnection,
	},
	'integrations.registerConnections': {
		input: CeligoEndpointInputSchemas.integrationsRegisterConnections,
		output: CeligoEndpointOutputSchemas.integrationsRegisterConnections,
	},
	'integrations.unregisterConnection': {
		input: CeligoEndpointInputSchemas.integrationsUnregisterConnection,
		output: CeligoEndpointOutputSchemas.integrationsUnregisterConnection,
	},
	'fileDefinitions.list': {
		input: CeligoEndpointInputSchemas.fileDefinitionsList,
		output: CeligoEndpointOutputSchemas.fileDefinitionsList,
	},
	'fileDefinitions.get': {
		input: CeligoEndpointInputSchemas.fileDefinitionsGet,
		output: CeligoEndpointOutputSchemas.fileDefinitionsGet,
	},
	'fileDefinitions.create': {
		input: CeligoEndpointInputSchemas.fileDefinitionsCreate,
		output: CeligoEndpointOutputSchemas.fileDefinitionsCreate,
	},
	'iClients.list': {
		input: CeligoEndpointInputSchemas.iClientsList,
		output: CeligoEndpointOutputSchemas.iClientsList,
	},
	'iClients.get': {
		input: CeligoEndpointInputSchemas.iClientsGet,
		output: CeligoEndpointOutputSchemas.iClientsGet,
	},
	'iClients.create': {
		input: CeligoEndpointInputSchemas.iClientsCreate,
		output: CeligoEndpointOutputSchemas.iClientsCreate,
	},
	'iClients.update': {
		input: CeligoEndpointInputSchemas.iClientsUpdate,
		output: CeligoEndpointOutputSchemas.iClientsUpdate,
	},
	'iClients.patch': {
		input: CeligoEndpointInputSchemas.iClientsPatch,
		output: CeligoEndpointOutputSchemas.iClientsPatch,
	},
	'iClients.delete': {
		input: CeligoEndpointInputSchemas.iClientsDelete,
		output: CeligoEndpointOutputSchemas.iClientsDelete,
	},
	'jobs.list': {
		input: CeligoEndpointInputSchemas.jobsList,
		output: CeligoEndpointOutputSchemas.jobsList,
	},
	'jobs.getErrors': {
		input: CeligoEndpointInputSchemas.jobsGetErrors,
		output: CeligoEndpointOutputSchemas.jobsGetErrors,
	},
	'processors.parseCsv': {
		input: CeligoEndpointInputSchemas.processorsParseCsv,
		output: CeligoEndpointOutputSchemas.processorsParseCsv,
	},
	'processors.parseXml': {
		input: CeligoEndpointInputSchemas.processorsParseXml,
		output: CeligoEndpointOutputSchemas.processorsParseXml,
	},
	'processors.parseStructuredFile': {
		input: CeligoEndpointInputSchemas.processorsParseStructuredFile,
		output: CeligoEndpointOutputSchemas.processorsParseStructuredFile,
	},
	'processors.generateStructuredFile': {
		input: CeligoEndpointInputSchemas.processorsGenerateStructuredFile,
		output: CeligoEndpointOutputSchemas.processorsGenerateStructuredFile,
	},
	'scripts.get': {
		input: CeligoEndpointInputSchemas.scriptsGet,
		output: CeligoEndpointOutputSchemas.scriptsGet,
	},
	'scripts.create': {
		input: CeligoEndpointInputSchemas.scriptsCreate,
		output: CeligoEndpointOutputSchemas.scriptsCreate,
	},
	'scripts.update': {
		input: CeligoEndpointInputSchemas.scriptsUpdate,
		output: CeligoEndpointOutputSchemas.scriptsUpdate,
	},
	'scripts.delete': {
		input: CeligoEndpointInputSchemas.scriptsDelete,
		output: CeligoEndpointOutputSchemas.scriptsDelete,
	},
	'scripts.getLogs': {
		input: CeligoEndpointInputSchemas.scriptsGetLogs,
		output: CeligoEndpointOutputSchemas.scriptsGetLogs,
	},
	'state.list': {
		input: CeligoEndpointInputSchemas.stateList,
		output: CeligoEndpointOutputSchemas.stateList,
	},
	'state.get': {
		input: CeligoEndpointInputSchemas.stateGet,
		output: CeligoEndpointOutputSchemas.stateGet,
	},
	'state.set': {
		input: CeligoEndpointInputSchemas.stateSet,
		output: CeligoEndpointOutputSchemas.stateSet,
	},
	'state.delete': {
		input: CeligoEndpointInputSchemas.stateDelete,
		output: CeligoEndpointOutputSchemas.stateDelete,
	},
	'state.deleteAll': {
		input: CeligoEndpointInputSchemas.stateDeleteAll,
		output: CeligoEndpointOutputSchemas.stateDeleteAll,
	},
	'state.listForResource': {
		input: CeligoEndpointInputSchemas.stateListForResource,
		output: CeligoEndpointOutputSchemas.stateListForResource,
	},
	'state.getForResource': {
		input: CeligoEndpointInputSchemas.stateGetForResource,
		output: CeligoEndpointOutputSchemas.stateGetForResource,
	},
	'state.setForResource': {
		input: CeligoEndpointInputSchemas.stateSetForResource,
		output: CeligoEndpointOutputSchemas.stateSetForResource,
	},
	'state.deleteForResource': {
		input: CeligoEndpointInputSchemas.stateDeleteForResource,
		output: CeligoEndpointOutputSchemas.stateDeleteForResource,
	},
	'state.deleteAllForResource': {
		input: CeligoEndpointInputSchemas.stateDeleteAllForResource,
		output: CeligoEndpointOutputSchemas.stateDeleteAllForResource,
	},
	'tags.list': {
		input: CeligoEndpointInputSchemas.tagsList,
		output: CeligoEndpointOutputSchemas.tagsList,
	},
	'tags.get': {
		input: CeligoEndpointInputSchemas.tagsGet,
		output: CeligoEndpointOutputSchemas.tagsGet,
	},
	'tags.create': {
		input: CeligoEndpointInputSchemas.tagsCreate,
		output: CeligoEndpointOutputSchemas.tagsCreate,
	},
	'tags.update': {
		input: CeligoEndpointInputSchemas.tagsUpdate,
		output: CeligoEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: CeligoEndpointInputSchemas.tagsDelete,
		output: CeligoEndpointOutputSchemas.tagsDelete,
	},
	'users.list': {
		input: CeligoEndpointInputSchemas.usersList,
		output: CeligoEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: CeligoEndpointInputSchemas.usersGet,
		output: CeligoEndpointOutputSchemas.usersGet,
	},
	'users.invite': {
		input: CeligoEndpointInputSchemas.usersInvite,
		output: CeligoEndpointOutputSchemas.usersInvite,
	},
	'users.inviteMultiple': {
		input: CeligoEndpointInputSchemas.usersInviteMultiple,
		output: CeligoEndpointOutputSchemas.usersInviteMultiple,
	},
	'users.update': {
		input: CeligoEndpointInputSchemas.usersUpdate,
		output: CeligoEndpointOutputSchemas.usersUpdate,
	},
	'users.delete': {
		input: CeligoEndpointInputSchemas.usersDelete,
		output: CeligoEndpointOutputSchemas.usersDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof celigoEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const celigoEndpointMeta = {
	'account.getTokenInfo': {
		riskLevel: 'read',
		description: 'Get the user id behind the current API token',
	},
	'account.listLicenses': {
		riskLevel: 'read',
		description: 'List the account licenses and subscriptions',
	},
	'audit.list': {
		riskLevel: 'read',
		description: 'List account audit log entries, newest first',
	},
	'connections.list': {
		riskLevel: 'read',
		description: 'List connections in the account',
	},
	'connections.get': {
		riskLevel: 'read',
		description: 'Get a connection by id',
	},
	'connections.create': {
		riskLevel: 'write',
		description: 'Create a connection',
	},
	'connections.update': {
		riskLevel: 'write',
		description: 'Replace a connection document',
	},
	'connections.patch': {
		riskLevel: 'write',
		description: 'Apply JSON Patch operations to a connection',
	},
	'connections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a connection',
	},
	'connections.ping': {
		riskLevel: 'read',
		description: 'Test that a saved connection can reach its application',
	},
	'connections.testVirtual': {
		riskLevel: 'read',
		description: 'Test an unsaved connection document without storing it',
	},
	'connections.getDebugLogs': {
		riskLevel: 'read',
		description: 'Get the debug log text recorded for a connection',
	},
	'connections.getDependencies': {
		riskLevel: 'read',
		description: 'List resources that depend on a connection',
	},
	'connections.getAudit': {
		riskLevel: 'read',
		description: 'List audit log entries for a connection',
	},
	'connections.executeVirtualExport': {
		riskLevel: 'write',
		description: 'Run an unsaved export definition through a connection',
	},
	'connections.executeVirtualExportPaged': {
		riskLevel: 'write',
		description:
			'Run an unsaved export one page at a time. Pass back pagedExportState for the next page',
	},
	'connections.executeVirtualImport': {
		riskLevel: 'write',
		description: 'Send records through an unsaved import definition',
	},
	'connections.evaluateVirtualImportMap': {
		riskLevel: 'read',
		description:
			'Run only the mapping step of an unsaved import and return the mapped records',
	},
	'ediProfiles.list': {
		riskLevel: 'read',
		description: 'List EDI trading partner profiles',
	},
	'errors.list': {
		riskLevel: 'read',
		description: 'List open errors for one export or import step of a flow',
	},
	'errors.listResolved': {
		riskLevel: 'read',
		description: 'List resolved errors for one step of a flow',
	},
	'errors.resolve': {
		riskLevel: 'write',
		description: 'Mark errors on a flow step as resolved',
	},
	'errors.deleteResolved': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Purge resolved errors from a flow step',
	},
	'errors.retry': {
		riskLevel: 'write',
		description: 'Retry failed records on a flow step',
	},
	'errors.assign': {
		riskLevel: 'write',
		description: 'Assign flow step errors to a user by email',
	},
	'errors.updateTags': {
		riskLevel: 'write',
		description: 'Set tags on flow step errors',
	},
	'exports.list': {
		riskLevel: 'read',
		description: 'List exports in the account',
	},
	'exports.get': {
		riskLevel: 'read',
		description: 'Get a export by id',
	},
	'exports.create': {
		riskLevel: 'write',
		description: 'Create a export',
	},
	'exports.update': {
		riskLevel: 'write',
		description:
			'Replace a export document. Send the full document; omitted fields are cleared',
	},
	'exports.patch': {
		riskLevel: 'write',
		description: 'Apply JSON Patch operations to a export',
	},
	'exports.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a export',
	},
	'exports.clone': {
		riskLevel: 'write',
		description: 'Clone a export, optionally remapping connections',
	},
	'exports.getAudit': {
		riskLevel: 'read',
		description: 'List audit log entries for a export',
	},
	'imports.list': {
		riskLevel: 'read',
		description: 'List imports in the account',
	},
	'imports.get': {
		riskLevel: 'read',
		description: 'Get a import by id',
	},
	'imports.create': {
		riskLevel: 'write',
		description: 'Create a import',
	},
	'imports.update': {
		riskLevel: 'write',
		description:
			'Replace a import document. Send the full document; omitted fields are cleared',
	},
	'imports.patch': {
		riskLevel: 'write',
		description: 'Apply JSON Patch operations to a import',
	},
	'imports.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a import',
	},
	'imports.clone': {
		riskLevel: 'write',
		description: 'Clone a import, optionally remapping connections',
	},
	'imports.getAudit': {
		riskLevel: 'read',
		description: 'List audit log entries for a import',
	},
	'imports.getDependencies': {
		riskLevel: 'read',
		description: 'List resources that depend on a import',
	},
	'imports.invoke': {
		riskLevel: 'write',
		description: 'Run a saved import against the given records',
	},
	'flows.list': {
		riskLevel: 'read',
		description: 'List flows in the account',
	},
	'flows.get': {
		riskLevel: 'read',
		description: 'Get a flow by id',
	},
	'flows.create': {
		riskLevel: 'write',
		description: 'Create a flow',
	},
	'flows.update': {
		riskLevel: 'write',
		description:
			'Replace a flow document. Send the full document; omitted fields are cleared',
	},
	'flows.patch': {
		riskLevel: 'write',
		description: 'Apply JSON Patch operations to a flow',
	},
	'flows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a flow',
	},
	'flows.clone': {
		riskLevel: 'write',
		description: 'Clone a flow, optionally remapping connections',
	},
	'flows.getAudit': {
		riskLevel: 'read',
		description: 'List audit log entries for a flow',
	},
	'flows.getDependencies': {
		riskLevel: 'read',
		description: 'List resources that depend on a flow',
	},
	'flows.getDescendants': {
		riskLevel: 'read',
		description: 'List the exports, imports and tools a flow uses',
	},
	'flows.getLastExportDateTime': {
		riskLevel: 'read',
		description: 'Get when a flow last exported data',
	},
	'flows.getLatestJobs': {
		riskLevel: 'read',
		description: 'Get the most recent jobs for a flow',
	},
	'flows.getTemplate': {
		riskLevel: 'read',
		description: 'Get a signed URL to download a flow as a template zip',
	},
	'integrations.list': {
		riskLevel: 'read',
		description: 'List integrations in the account',
	},
	'integrations.get': {
		riskLevel: 'read',
		description: 'Get a integration by id',
	},
	'integrations.create': {
		riskLevel: 'write',
		description: 'Create a integration',
	},
	'integrations.update': {
		riskLevel: 'write',
		description:
			'Replace a integration document. Send the full document; omitted fields are cleared',
	},
	'integrations.patch': {
		riskLevel: 'write',
		description: 'Apply JSON Patch operations to a integration',
	},
	'integrations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a integration',
	},
	'integrations.clone': {
		riskLevel: 'write',
		description: 'Clone a integration, optionally remapping connections',
	},
	'integrations.getAudit': {
		riskLevel: 'read',
		description: 'List audit log entries for a integration',
	},
	'integrations.getDependencies': {
		riskLevel: 'read',
		description: 'List resources that depend on a integration',
	},
	'integrations.listFlows': {
		riskLevel: 'read',
		description: 'List the flows in an integration',
	},
	'integrations.listExports': {
		riskLevel: 'read',
		description: 'List the exports in an integration',
	},
	'integrations.listImports': {
		riskLevel: 'read',
		description: 'List the imports in an integration',
	},
	'integrations.listConnections': {
		riskLevel: 'read',
		description: 'List the connections registered to an integration',
	},
	'integrations.listUsers': {
		riskLevel: 'read',
		description: 'List the users shared on an integration',
	},
	'integrations.listErrors': {
		riskLevel: 'read',
		description: 'Get open error counts per flow in an integration',
	},
	'integrations.getTemplate': {
		riskLevel: 'read',
		description:
			'Get a signed URL to download an integration as a template zip',
	},
	'integrations.createRevision': {
		riskLevel: 'write',
		description: 'Snapshot an integration as a new revision',
	},
	'integrations.registerConnection': {
		riskLevel: 'write',
		description: 'Register a connection to an integration',
	},
	'integrations.registerConnections': {
		riskLevel: 'write',
		description:
			'Register connections to an integration, one per request body (_connectionId)',
	},
	'integrations.unregisterConnection': {
		riskLevel: 'destructive',
		description: 'Unregister a connection from an integration',
	},
	'fileDefinitions.list': {
		riskLevel: 'read',
		description: 'List EDI and fixed-width file definitions',
	},
	'fileDefinitions.get': {
		riskLevel: 'read',
		description: 'Get a file definition by id',
	},
	'fileDefinitions.create': {
		riskLevel: 'write',
		description: 'Create a file definition',
	},
	'iClients.list': {
		riskLevel: 'read',
		description: 'List iClients (stored OAuth app credentials)',
	},
	'iClients.get': {
		riskLevel: 'read',
		description: 'Get an iClient by id',
	},
	'iClients.create': {
		riskLevel: 'write',
		description: 'Create an iClient',
	},
	'iClients.update': {
		riskLevel: 'write',
		description: 'Replace an iClient document',
	},
	'iClients.patch': {
		riskLevel: 'write',
		description:
			'Patch an iClient. Celigo only allows replacing /oauth2/failPath',
	},
	'iClients.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an iClient',
	},
	'jobs.list': {
		riskLevel: 'read',
		description:
			'List jobs filtered by flow, integration, status, type or date',
	},
	'jobs.getErrors': {
		riskLevel: 'read',
		description: 'Get the errors of a job (up to 1000)',
	},
	'processors.parseCsv': {
		riskLevel: 'read',
		description: 'Parse CSV text into JSON records',
	},
	'processors.parseXml': {
		riskLevel: 'read',
		description: 'Parse XML text into JSON records',
	},
	'processors.parseStructuredFile': {
		riskLevel: 'read',
		description:
			'Parse EDI or fixed-width text into JSON using a file definition',
	},
	'processors.generateStructuredFile': {
		riskLevel: 'read',
		description: 'Render JSON records as delimited or fixed-width text',
	},
	'scripts.get': {
		riskLevel: 'read',
		description: 'Get a script by id',
	},
	'scripts.create': {
		riskLevel: 'write',
		description: 'Create a JavaScript hook script',
	},
	'scripts.update': {
		riskLevel: 'write',
		description: 'Replace a script',
	},
	'scripts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a script',
	},
	'scripts.getLogs': {
		riskLevel: 'read',
		description: 'Get execution logs written by a script',
	},
	'state.list': {
		riskLevel: 'read',
		description: 'List global state keys',
	},
	'state.get': {
		riskLevel: 'read',
		description: 'Get the value stored under a global state key',
	},
	'state.set': {
		riskLevel: 'write',
		description: 'Create or replace the value under a global state key',
	},
	'state.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a global state key',
	},
	'state.deleteAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete every global state key',
	},
	'state.listForResource': {
		riskLevel: 'read',
		description: 'List state keys stored on an export, import or integration',
	},
	'state.getForResource': {
		riskLevel: 'read',
		description: 'Get a state value stored on an export, import or integration',
	},
	'state.setForResource': {
		riskLevel: 'write',
		description:
			'Create or replace a state value on an export, import or integration',
	},
	'state.deleteForResource': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a state key on an export, import or integration',
	},
	'state.deleteAllForResource': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete every state key on an export, import or integration',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List error tags',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get an error tag by id',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create an error tag',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Rename an error tag',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an error tag',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users the account is shared with',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a user share by id',
	},
	'users.invite': {
		riskLevel: 'write',
		description: 'Invite one user by email with account or integration access',
	},
	'users.inviteMultiple': {
		riskLevel: 'write',
		description: 'Invite several users by email with the same access',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Change a user share access level',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a user from the account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof celigoEndpointsNested>;

export const celigoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCeligoPlugin<T extends CeligoPluginOptions> = CorsairPlugin<
	'celigo',
	typeof CeligoSchema,
	typeof celigoEndpointsNested,
	typeof celigoWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalCeligoPlugin = BaseCeligoPlugin<CeligoPluginOptions>;

export type ExternalCeligoPlugin<T extends CeligoPluginOptions> =
	BaseCeligoPlugin<T>;

export function celigo<const T extends CeligoPluginOptions>(
	// Safe: every CeligoPluginOptions field is optional, so {} satisfies it.
	// A narrower type is not practical because T is the caller's literal options type.
	incomingOptions: CeligoPluginOptions & T = {} as CeligoPluginOptions & T,
): ExternalCeligoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'celigo',
		authConfig: celigoAuthConfig,
		schema: CeligoSchema,
		options: options,
		hooks: options.hooks,
		endpoints: celigoEndpointsNested,
		webhooks: celigoWebhooksNested,
		endpointMeta: celigoEndpointMeta,
		endpointSchemas: celigoEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CeligoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('celigo', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('celigo', 'api_key');
		},
	} satisfies InternalCeligoPlugin;
}

export type { CeligoRegion } from './client';
export { CeligoAPIError } from './client';
export type {
	CeligoAuditLog,
	CeligoEndpointInputs,
	CeligoEndpointOutputs,
	CeligoJob,
	CeligoResource,
	CeligoUser,
} from './endpoints/types';
