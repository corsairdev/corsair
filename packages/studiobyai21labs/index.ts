import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import * as Assistants from './endpoints/assistants';
import * as Chat from './endpoints/chat';
import * as Example from './endpoints/example';
import * as Library from './endpoints/library';
import * as Models from './endpoints/models';
import * as Tools from './endpoints/tools';
import type {
	StudioByAI21LabsEndpointInputs,
	StudioByAI21LabsEndpointOutputs,
} from './endpoints/types';
import {
	StudioByAI21LabsEndpointInputSchemas,
	StudioByAI21LabsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StudioByAI21LabsSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveStudioByAI21LabsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchStudioByAI21LabsTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ExampleEvent,
	StudioByAI21LabsWebhookOutputs,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type StudioByAI21LabsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalStudioByAI21LabsPlugin['hooks'];
	webhookHooks?: InternalStudioByAI21LabsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof studioByAI21LabsEndpointsNested>;
};

export type StudioByAI21LabsContext = CorsairPluginContext<
	typeof StudioByAI21LabsSchema,
	StudioByAI21LabsPluginOptions
>;

export type StudioByAI21LabsKeyBuilderContext =
	KeyBuilderContext<StudioByAI21LabsPluginOptions>;

export type StudioByAI21LabsBoundEndpoints = BindEndpoints<
	typeof studioByAI21LabsEndpointsNested
>;

type StudioByAI21LabsEndpoint<K extends keyof StudioByAI21LabsEndpointOutputs> =
	CorsairEndpoint<
		StudioByAI21LabsContext,
		StudioByAI21LabsEndpointInputs[K],
		StudioByAI21LabsEndpointOutputs[K]
	>;

export type StudioByAI21LabsEndpoints = {
	exampleGet: StudioByAI21LabsEndpoint<'exampleGet'>;
	chatCompletions: StudioByAI21LabsEndpoint<'chatCompletions'>;
	listLibraryFiles: StudioByAI21LabsEndpoint<'listLibraryFiles'>;
	uploadWorkspaceFile: StudioByAI21LabsEndpoint<'uploadWorkspaceFile'>;
	getWorkspaceFile: StudioByAI21LabsEndpoint<'getWorkspaceFile'>;
	updateFile: StudioByAI21LabsEndpoint<'updateFile'>;
	deleteFile: StudioByAI21LabsEndpoint<'deleteFile'>;
	getFileDownloadLink: StudioByAI21LabsEndpoint<'getFileDownloadLink'>;
	checkCanIframe: StudioByAI21LabsEndpoint<'checkCanIframe'>;
	checkKirshGrantCompliance: StudioByAI21LabsEndpoint<'checkKirshGrantCompliance'>;
	compareText: StudioByAI21LabsEndpoint<'compareText'>;
	createAftersalesPartsBatch: StudioByAI21LabsEndpoint<'createAftersalesPartsBatch'>;
	createAssistant: StudioByAI21LabsEndpoint<'createAssistant'>;
	createAssistantPlan: StudioByAI21LabsEndpoint<'createAssistantPlan'>;
	createAssistantRoute: StudioByAI21LabsEndpoint<'createAssistantRoute'>;
	createDemo: StudioByAI21LabsEndpoint<'createDemo'>;
	createKirshGrantCompliancePreview: StudioByAI21LabsEndpoint<'createKirshGrantCompliancePreview'>;
	createMcpStorage: StudioByAI21LabsEndpoint<'createMcpStorage'>;
	deleteAssistant: StudioByAI21LabsEndpoint<'deleteAssistant'>;
	deleteAssistantRoute: StudioByAI21LabsEndpoint<'deleteAssistantRoute'>;
	deleteDemo: StudioByAI21LabsEndpoint<'deleteDemo'>;
	deleteMcpStorage: StudioByAI21LabsEndpoint<'deleteMcpStorage'>;
	deleteSecret: StudioByAI21LabsEndpoint<'deleteSecret'>;
	deleteWebsiteConnector: StudioByAI21LabsEndpoint<'deleteWebsiteConnector'>;
	downloadModifiedDocument: StudioByAI21LabsEndpoint<'downloadModifiedDocument'>;
	generateRequirements: StudioByAI21LabsEndpoint<'generateRequirements'>;
	generateThreadName: StudioByAI21LabsEndpoint<'generateThreadName'>;
	getAssistant: StudioByAI21LabsEndpoint<'getAssistant'>;
	getAssistantRoute: StudioByAI21LabsEndpoint<'getAssistantRoute'>;
	getAssistantsByMcp: StudioByAI21LabsEndpoint<'getAssistantsByMcp'>;
	getBatchPredictionStatus: StudioByAI21LabsEndpoint<'getBatchPredictionStatus'>;
	getDemo: StudioByAI21LabsEndpoint<'getDemo'>;
	getLibraryBatchStatus: StudioByAI21LabsEndpoint<'getLibraryBatchStatus'>;
	getMcpStorage: StudioByAI21LabsEndpoint<'getMcpStorage'>;
	getOutputExplanation: StudioByAI21LabsEndpoint<'getOutputExplanation'>;
	getPlan: StudioByAI21LabsEndpoint<'getPlan'>;
	getWebsiteConnectorById: StudioByAI21LabsEndpoint<'getWebsiteConnectorById'>;
	getWebsiteConnectorStatus: StudioByAI21LabsEndpoint<'getWebsiteConnectorStatus'>;
	getWebsiteConnectorUrlStatus: StudioByAI21LabsEndpoint<'getWebsiteConnectorUrlStatus'>;
	grantKirshMetadata: StudioByAI21LabsEndpoint<'grantKirshMetadata'>;
	ingestWebsiteConnector: StudioByAI21LabsEndpoint<'ingestWebsiteConnector'>;
	ingestWebsiteConnectorUrl: StudioByAI21LabsEndpoint<'ingestWebsiteConnectorUrl'>;
	kirshGrantMetadataPreview: StudioByAI21LabsEndpoint<'kirshGrantMetadataPreview'>;
	listAssistants: StudioByAI21LabsEndpoint<'listAssistants'>;
	listAvailableModels: StudioByAI21LabsEndpoint<'listAvailableModels'>;
	listDemos: StudioByAI21LabsEndpoint<'listDemos'>;
	listMcpStorage: StudioByAI21LabsEndpoint<'listMcpStorage'>;
	listModels: StudioByAI21LabsEndpoint<'listModels'>;
	listPlans: StudioByAI21LabsEndpoint<'listPlans'>;
	listSecrets: StudioByAI21LabsEndpoint<'listSecrets'>;
	listWebsiteConnectors: StudioByAI21LabsEndpoint<'listWebsiteConnectors'>;
	listWorkspaceModels: StudioByAI21LabsEndpoint<'listWorkspaceModels'>;
	modifyAssistant: StudioByAI21LabsEndpoint<'modifyAssistant'>;
	modifyAssistantPlan: StudioByAI21LabsEndpoint<'modifyAssistantPlan'>;
	modifyAssistantRoute: StudioByAI21LabsEndpoint<'modifyAssistantRoute'>;
	retryIngestWebsite: StudioByAI21LabsEndpoint<'retryIngestWebsite'>;
	runAssistant: StudioByAI21LabsEndpoint<'runAssistant'>;
	syncWebsiteConnector: StudioByAI21LabsEndpoint<'syncWebsiteConnector'>;
	updateDemo: StudioByAI21LabsEndpoint<'updateDemo'>;
	updateMcpStorage: StudioByAI21LabsEndpoint<'updateMcpStorage'>;
	updateSecret: StudioByAI21LabsEndpoint<'updateSecret'>;
	validatePlan: StudioByAI21LabsEndpoint<'validatePlan'>;
};

type StudioByAI21LabsWebhook<
	K extends keyof StudioByAI21LabsWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	StudioByAI21LabsContext,
	TEvent,
	StudioByAI21LabsWebhookOutputs[K]
>;

export type StudioByAI21LabsWebhooks = {
	example: StudioByAI21LabsWebhook<'example', ExampleEvent>;
};

export type StudioByAI21LabsBoundWebhooks =
	BindWebhooks<StudioByAI21LabsWebhooks>;

const studioByAI21LabsEndpointsNested = {
	example: {
		get: Example.get,
	},
	chat: {
		completions: Chat.completions,
	},
	library: {
		list: Library.list,
		upload: Library.upload,
		get: Library.get,
		update: Library.update,
		delete: Library.deleteFile,
		download: Library.download,
	},
	tools: {
		checkCanIframe: Tools.checkCanIframe,
		checkKirshGrantCompliance: Tools.checkKirshGrantCompliance,
		compareText: Tools.compareText,
		createAftersalesPartsBatch: Tools.createAftersalesPartsBatch,
		createDemo: Tools.createDemo,
		createKirshGrantCompliancePreview: Tools.createKirshGrantCompliancePreview,
		createMcpStorage: Tools.createMcpStorage,
		deleteDemo: Tools.deleteDemo,
		deleteMcpStorage: Tools.deleteMcpStorage,
		deleteSecret: Tools.deleteSecret,
		deleteWebsiteConnector: Tools.deleteWebsiteConnector,
		downloadModifiedDocument: Tools.downloadModifiedDocument,
		generateRequirements: Tools.generateRequirements,
		generateThreadName: Tools.generateThreadName,
		getBatchPredictionStatus: Tools.getBatchPredictionStatus,
		getDemo: Tools.getDemo,
		getLibraryBatchStatus: Tools.getLibraryBatchStatus,
		getMcpStorage: Tools.getMcpStorage,
		getOutputExplanation: Tools.getOutputExplanation,
		getWebsiteConnectorById: Tools.getWebsiteConnectorById,
		getWebsiteConnectorStatus: Tools.getWebsiteConnectorStatus,
		getWebsiteConnectorUrlStatus: Tools.getWebsiteConnectorUrlStatus,
		grantKirshMetadata: Tools.grantKirshMetadata,
		ingestWebsiteConnector: Tools.ingestWebsiteConnector,
		ingestWebsiteConnectorUrl: Tools.ingestWebsiteConnectorUrl,
		kirshGrantMetadataPreview: Tools.kirshGrantMetadataPreview,
		listDemos: Tools.listDemos,
		listMcpStorage: Tools.listMcpStorage,
		listSecrets: Tools.listSecrets,
		listWebsiteConnectors: Tools.listWebsiteConnectors,
		retryIngestWebsite: Tools.retryIngestWebsite,
		syncWebsiteConnector: Tools.syncWebsiteConnector,
		updateDemo: Tools.updateDemo,
		updateMcpStorage: Tools.updateMcpStorage,
		updateSecret: Tools.updateSecret,
	},
	assistants: {
		create: Assistants.createAssistant,
		createPlan: Assistants.createAssistantPlan,
		createRoute: Assistants.createAssistantRoute,
		delete: Assistants.deleteAssistant,
		deleteRoute: Assistants.deleteAssistantRoute,
		get: Assistants.getAssistant,
		getRoute: Assistants.getAssistantRoute,
		getByMcp: Assistants.getAssistantsByMcp,
		getPlan: Assistants.getPlan,
		list: Assistants.listAssistants,
		listPlans: Assistants.listPlans,
		modify: Assistants.modifyAssistant,
		modifyPlan: Assistants.modifyAssistantPlan,
		modifyRoute: Assistants.modifyAssistantRoute,
		run: Assistants.runAssistant,
		validatePlan: Assistants.validatePlan,
	},
	models: {
		list: Models.listModels,
		listAvailable: Models.listAvailableModels,
		listWorkspace: Models.listWorkspaceModels,
	},
} as const;

const studioByAI21LabsWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const studioByAI21LabsEndpointSchemas = {
	'example.get': {
		input: StudioByAI21LabsEndpointInputSchemas.exampleGet,
		output: StudioByAI21LabsEndpointOutputSchemas.exampleGet,
	},
	'chat.completions': {
		input: StudioByAI21LabsEndpointInputSchemas.chatCompletions,
		output: StudioByAI21LabsEndpointOutputSchemas.chatCompletions,
	},
	'library.list': {
		input: StudioByAI21LabsEndpointInputSchemas.listLibraryFiles,
		output: StudioByAI21LabsEndpointOutputSchemas.listLibraryFiles,
	},
	'library.upload': {
		input: StudioByAI21LabsEndpointInputSchemas.uploadWorkspaceFile,
		output: StudioByAI21LabsEndpointOutputSchemas.uploadWorkspaceFile,
	},
	'library.get': {
		input: StudioByAI21LabsEndpointInputSchemas.getWorkspaceFile,
		output: StudioByAI21LabsEndpointOutputSchemas.getWorkspaceFile,
	},
	'library.update': {
		input: StudioByAI21LabsEndpointInputSchemas.updateFile,
		output: StudioByAI21LabsEndpointOutputSchemas.updateFile,
	},
	'library.delete': {
		input: StudioByAI21LabsEndpointInputSchemas.deleteFile,
		output: StudioByAI21LabsEndpointOutputSchemas.deleteFile,
	},
	'library.download': {
		input: StudioByAI21LabsEndpointInputSchemas.getFileDownloadLink,
		output: StudioByAI21LabsEndpointOutputSchemas.getFileDownloadLink,
	},
	'tools.checkCanIframe': {
		input: StudioByAI21LabsEndpointInputSchemas.checkCanIframe,
		output: StudioByAI21LabsEndpointOutputSchemas.checkCanIframe,
	},
	'tools.checkKirshGrantCompliance': {
		input: StudioByAI21LabsEndpointInputSchemas.checkKirshGrantCompliance,
		output: StudioByAI21LabsEndpointOutputSchemas.checkKirshGrantCompliance,
	},
	'tools.compareText': {
		input: StudioByAI21LabsEndpointInputSchemas.compareText,
		output: StudioByAI21LabsEndpointOutputSchemas.compareText,
	},
	'tools.createAftersalesPartsBatch': {
		input: StudioByAI21LabsEndpointInputSchemas.createAftersalesPartsBatch,
		output: StudioByAI21LabsEndpointOutputSchemas.createAftersalesPartsBatch,
	},
	'assistants.create': {
		input: StudioByAI21LabsEndpointInputSchemas.createAssistant,
		output: StudioByAI21LabsEndpointOutputSchemas.createAssistant,
	},
	'assistants.createPlan': {
		input: StudioByAI21LabsEndpointInputSchemas.createAssistantPlan,
		output: StudioByAI21LabsEndpointOutputSchemas.createAssistantPlan,
	},
	'assistants.createRoute': {
		input: StudioByAI21LabsEndpointInputSchemas.createAssistantRoute,
		output: StudioByAI21LabsEndpointOutputSchemas.createAssistantRoute,
	},
	'tools.createDemo': {
		input: StudioByAI21LabsEndpointInputSchemas.createDemo,
		output: StudioByAI21LabsEndpointOutputSchemas.createDemo,
	},
	'tools.createKirshGrantCompliancePreview': {
		input:
			StudioByAI21LabsEndpointInputSchemas.createKirshGrantCompliancePreview,
		output:
			StudioByAI21LabsEndpointOutputSchemas.createKirshGrantCompliancePreview,
	},
	'tools.createMcpStorage': {
		input: StudioByAI21LabsEndpointInputSchemas.createMcpStorage,
		output: StudioByAI21LabsEndpointOutputSchemas.createMcpStorage,
	},
	'tools.deleteDemo': {
		input: StudioByAI21LabsEndpointInputSchemas.deleteDemo,
		output: StudioByAI21LabsEndpointOutputSchemas.deleteDemo,
	},
	'tools.deleteMcpStorage': {
		input: StudioByAI21LabsEndpointInputSchemas.deleteMcpStorage,
		output: StudioByAI21LabsEndpointOutputSchemas.deleteMcpStorage,
	},
	'tools.deleteSecret': {
		input: StudioByAI21LabsEndpointInputSchemas.deleteSecret,
		output: StudioByAI21LabsEndpointOutputSchemas.deleteSecret,
	},
	'tools.deleteWebsiteConnector': {
		input: StudioByAI21LabsEndpointInputSchemas.deleteWebsiteConnector,
		output: StudioByAI21LabsEndpointOutputSchemas.deleteWebsiteConnector,
	},
	'tools.downloadModifiedDocument': {
		input: StudioByAI21LabsEndpointInputSchemas.downloadModifiedDocument,
		output: StudioByAI21LabsEndpointOutputSchemas.downloadModifiedDocument,
	},
	'tools.generateRequirements': {
		input: StudioByAI21LabsEndpointInputSchemas.generateRequirements,
		output: StudioByAI21LabsEndpointOutputSchemas.generateRequirements,
	},
	'tools.generateThreadName': {
		input: StudioByAI21LabsEndpointInputSchemas.generateThreadName,
		output: StudioByAI21LabsEndpointOutputSchemas.generateThreadName,
	},
	'tools.getBatchPredictionStatus': {
		input: StudioByAI21LabsEndpointInputSchemas.getBatchPredictionStatus,
		output: StudioByAI21LabsEndpointOutputSchemas.getBatchPredictionStatus,
	},
	'tools.getDemo': {
		input: StudioByAI21LabsEndpointInputSchemas.getDemo,
		output: StudioByAI21LabsEndpointOutputSchemas.getDemo,
	},
	'tools.getLibraryBatchStatus': {
		input: StudioByAI21LabsEndpointInputSchemas.getLibraryBatchStatus,
		output: StudioByAI21LabsEndpointOutputSchemas.getLibraryBatchStatus,
	},
	'tools.getMcpStorage': {
		input: StudioByAI21LabsEndpointInputSchemas.getMcpStorage,
		output: StudioByAI21LabsEndpointOutputSchemas.getMcpStorage,
	},
	'tools.getOutputExplanation': {
		input: StudioByAI21LabsEndpointInputSchemas.getOutputExplanation,
		output: StudioByAI21LabsEndpointOutputSchemas.getOutputExplanation,
	},
	'tools.getWebsiteConnectorById': {
		input: StudioByAI21LabsEndpointInputSchemas.getWebsiteConnectorById,
		output: StudioByAI21LabsEndpointOutputSchemas.getWebsiteConnectorById,
	},
	'tools.getWebsiteConnectorStatus': {
		input: StudioByAI21LabsEndpointInputSchemas.getWebsiteConnectorStatus,
		output: StudioByAI21LabsEndpointOutputSchemas.getWebsiteConnectorStatus,
	},
	'tools.getWebsiteConnectorUrlStatus': {
		input: StudioByAI21LabsEndpointInputSchemas.getWebsiteConnectorUrlStatus,
		output: StudioByAI21LabsEndpointOutputSchemas.getWebsiteConnectorUrlStatus,
	},
	'tools.grantKirshMetadata': {
		input: StudioByAI21LabsEndpointInputSchemas.grantKirshMetadata,
		output: StudioByAI21LabsEndpointOutputSchemas.grantKirshMetadata,
	},
	'tools.ingestWebsiteConnector': {
		input: StudioByAI21LabsEndpointInputSchemas.ingestWebsiteConnector,
		output: StudioByAI21LabsEndpointOutputSchemas.ingestWebsiteConnector,
	},
	'tools.ingestWebsiteConnectorUrl': {
		input: StudioByAI21LabsEndpointInputSchemas.ingestWebsiteConnectorUrl,
		output: StudioByAI21LabsEndpointOutputSchemas.ingestWebsiteConnectorUrl,
	},
	'tools.kirshGrantMetadataPreview': {
		input: StudioByAI21LabsEndpointInputSchemas.kirshGrantMetadataPreview,
		output: StudioByAI21LabsEndpointOutputSchemas.kirshGrantMetadataPreview,
	},
	'tools.listDemos': {
		input: StudioByAI21LabsEndpointInputSchemas.listDemos,
		output: StudioByAI21LabsEndpointOutputSchemas.listDemos,
	},
	'tools.listMcpStorage': {
		input: StudioByAI21LabsEndpointInputSchemas.listMcpStorage,
		output: StudioByAI21LabsEndpointOutputSchemas.listMcpStorage,
	},
	'tools.listSecrets': {
		input: StudioByAI21LabsEndpointInputSchemas.listSecrets,
		output: StudioByAI21LabsEndpointOutputSchemas.listSecrets,
	},
	'tools.listWebsiteConnectors': {
		input: StudioByAI21LabsEndpointInputSchemas.listWebsiteConnectors,
		output: StudioByAI21LabsEndpointOutputSchemas.listWebsiteConnectors,
	},
	'tools.retryIngestWebsite': {
		input: StudioByAI21LabsEndpointInputSchemas.retryIngestWebsite,
		output: StudioByAI21LabsEndpointOutputSchemas.retryIngestWebsite,
	},
	'tools.syncWebsiteConnector': {
		input: StudioByAI21LabsEndpointInputSchemas.syncWebsiteConnector,
		output: StudioByAI21LabsEndpointOutputSchemas.syncWebsiteConnector,
	},
	'tools.updateDemo': {
		input: StudioByAI21LabsEndpointInputSchemas.updateDemo,
		output: StudioByAI21LabsEndpointOutputSchemas.updateDemo,
	},
	'tools.updateMcpStorage': {
		input: StudioByAI21LabsEndpointInputSchemas.updateMcpStorage,
		output: StudioByAI21LabsEndpointOutputSchemas.updateMcpStorage,
	},
	'tools.updateSecret': {
		input: StudioByAI21LabsEndpointInputSchemas.updateSecret,
		output: StudioByAI21LabsEndpointOutputSchemas.updateSecret,
	},
	'assistants.delete': {
		input: StudioByAI21LabsEndpointInputSchemas.deleteAssistant,
		output: StudioByAI21LabsEndpointOutputSchemas.deleteAssistant,
	},
	'assistants.deleteRoute': {
		input: StudioByAI21LabsEndpointInputSchemas.deleteAssistantRoute,
		output: StudioByAI21LabsEndpointOutputSchemas.deleteAssistantRoute,
	},
	'assistants.get': {
		input: StudioByAI21LabsEndpointInputSchemas.getAssistant,
		output: StudioByAI21LabsEndpointOutputSchemas.getAssistant,
	},
	'assistants.getRoute': {
		input: StudioByAI21LabsEndpointInputSchemas.getAssistantRoute,
		output: StudioByAI21LabsEndpointOutputSchemas.getAssistantRoute,
	},
	'assistants.getByMcp': {
		input: StudioByAI21LabsEndpointInputSchemas.getAssistantsByMcp,
		output: StudioByAI21LabsEndpointOutputSchemas.getAssistantsByMcp,
	},
	'assistants.getPlan': {
		input: StudioByAI21LabsEndpointInputSchemas.getPlan,
		output: StudioByAI21LabsEndpointOutputSchemas.getPlan,
	},
	'assistants.list': {
		input: StudioByAI21LabsEndpointInputSchemas.listAssistants,
		output: StudioByAI21LabsEndpointOutputSchemas.listAssistants,
	},
	'assistants.listPlans': {
		input: StudioByAI21LabsEndpointInputSchemas.listPlans,
		output: StudioByAI21LabsEndpointOutputSchemas.listPlans,
	},
	'assistants.modify': {
		input: StudioByAI21LabsEndpointInputSchemas.modifyAssistant,
		output: StudioByAI21LabsEndpointOutputSchemas.modifyAssistant,
	},
	'assistants.modifyPlan': {
		input: StudioByAI21LabsEndpointInputSchemas.modifyAssistantPlan,
		output: StudioByAI21LabsEndpointOutputSchemas.modifyAssistantPlan,
	},
	'assistants.modifyRoute': {
		input: StudioByAI21LabsEndpointInputSchemas.modifyAssistantRoute,
		output: StudioByAI21LabsEndpointOutputSchemas.modifyAssistantRoute,
	},
	'assistants.run': {
		input: StudioByAI21LabsEndpointInputSchemas.runAssistant,
		output: StudioByAI21LabsEndpointOutputSchemas.runAssistant,
	},
	'assistants.validatePlan': {
		input: StudioByAI21LabsEndpointInputSchemas.validatePlan,
		output: StudioByAI21LabsEndpointOutputSchemas.validatePlan,
	},
	'models.list': {
		input: StudioByAI21LabsEndpointInputSchemas.listModels,
		output: StudioByAI21LabsEndpointOutputSchemas.listModels,
	},
	'models.listAvailable': {
		input: StudioByAI21LabsEndpointInputSchemas.listAvailableModels,
		output: StudioByAI21LabsEndpointOutputSchemas.listAvailableModels,
	},
	'models.listWorkspace': {
		input: StudioByAI21LabsEndpointInputSchemas.listWorkspaceModels,
		output: StudioByAI21LabsEndpointOutputSchemas.listWorkspaceModels,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof studioByAI21LabsEndpointsNested
>;

const studioByAI21LabsWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof studioByAI21LabsWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const studioByAI21LabsEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
	'chat.completions': {
		riskLevel: 'write',
		description: 'Generate a chat completion',
	},
	'library.list': {
		riskLevel: 'read',
		description: 'List library files',
	},
	'library.upload': {
		riskLevel: 'write',
		description: 'Upload a workspace file',
	},
	'library.get': {
		riskLevel: 'read',
		description: 'Get a workspace file',
	},
	'library.update': {
		riskLevel: 'write',
		description: 'Update file metadata',
	},
	'library.delete': {
		riskLevel: 'write',
		description: 'Delete a library file',
	},
	'library.download': {
		riskLevel: 'read',
		description: 'Get a file download link',
	},
	'tools.checkCanIframe': {
		riskLevel: 'read',
		description: 'Check if a URL can be embedded in an iframe',
	},
	'tools.checkKirshGrantCompliance': {
		riskLevel: 'read',
		description: 'Check Kirsh grant compliance',
	},
	'tools.compareText': {
		riskLevel: 'read',
		description: 'Compare text and return differences',
	},
	'tools.createAftersalesPartsBatch': {
		riskLevel: 'write',
		description: 'Create an aftersales parts classification batch',
	},
	'assistants.create': {
		riskLevel: 'write',
		description: 'Create an AI assistant',
	},
	'assistants.createPlan': {
		riskLevel: 'write',
		description: 'Create an assistant plan',
	},
	'assistants.createRoute': {
		riskLevel: 'write',
		description: 'Create an assistant route',
	},
	'tools.createDemo': {
		riskLevel: 'write',
		description: 'Create a demo',
	},
	'tools.createKirshGrantCompliancePreview': {
		riskLevel: 'write',
		description: 'Create a Kirsh Grant compliance preview',
	},
	'tools.createMcpStorage': {
		riskLevel: 'write',
		description: 'Create MCP storage',
	},
	'tools.deleteDemo': {
		riskLevel: 'write',
		description: 'Delete a demo',
	},
	'tools.deleteMcpStorage': {
		riskLevel: 'write',
		description: 'Delete MCP storage',
	},
	'tools.deleteSecret': {
		riskLevel: 'write',
		description: 'Delete a secret',
	},
	'tools.deleteWebsiteConnector': {
		riskLevel: 'write',
		description: 'Delete a website connector',
	},
	'tools.downloadModifiedDocument': {
		riskLevel: 'read',
		description: 'Download a modified document',
	},
	'tools.generateRequirements': {
		riskLevel: 'write',
		description: 'Generate requirements',
	},
	'tools.generateThreadName': {
		riskLevel: 'write',
		description: 'Generate a thread name',
	},
	'tools.getBatchPredictionStatus': {
		riskLevel: 'read',
		description: 'Get batch prediction status',
	},
	'tools.getDemo': {
		riskLevel: 'read',
		description: 'Get a demo',
	},
	'tools.getLibraryBatchStatus': {
		riskLevel: 'read',
		description: 'Get library batch status',
	},
	'tools.getMcpStorage': {
		riskLevel: 'read',
		description: 'Get MCP storage',
	},
	'tools.getOutputExplanation': {
		riskLevel: 'read',
		description: 'Get output explanation',
	},
	'tools.getWebsiteConnectorById': {
		riskLevel: 'read',
		description: 'Get website connector by ID',
	},
	'tools.getWebsiteConnectorStatus': {
		riskLevel: 'read',
		description: 'Get website connector status',
	},
	'tools.getWebsiteConnectorUrlStatus': {
		riskLevel: 'read',
		description: 'Get website connector URL status',
	},
	'tools.grantKirshMetadata': {
		riskLevel: 'write',
		description: 'Grant Kirsh metadata',
	},
	'tools.ingestWebsiteConnector': {
		riskLevel: 'write',
		description: 'Ingest website connector',
	},
	'tools.ingestWebsiteConnectorUrl': {
		riskLevel: 'write',
		description: 'Ingest website connector URL',
	},
	'tools.kirshGrantMetadataPreview': {
		riskLevel: 'write',
		description: 'Preview Kirsh grant metadata',
	},
	'tools.listDemos': {
		riskLevel: 'read',
		description: 'List demos',
	},
	'tools.listMcpStorage': {
		riskLevel: 'read',
		description: 'List MCP storage',
	},
	'tools.listSecrets': {
		riskLevel: 'read',
		description: 'List secrets',
	},
	'tools.listWebsiteConnectors': {
		riskLevel: 'read',
		description: 'List website connectors',
	},
	'tools.retryIngestWebsite': {
		riskLevel: 'write',
		description: 'Retry ingest website',
	},
	'tools.syncWebsiteConnector': {
		riskLevel: 'write',
		description: 'Sync website connector',
	},
	'tools.updateDemo': {
		riskLevel: 'write',
		description: 'Update demo',
	},
	'tools.updateMcpStorage': {
		riskLevel: 'write',
		description: 'Update MCP storage',
	},
	'tools.updateSecret': {
		riskLevel: 'write',
		description: 'Update secret',
	},
	'assistants.delete': {
		riskLevel: 'write',
		description: 'Delete an assistant',
	},
	'assistants.deleteRoute': {
		riskLevel: 'write',
		description: 'Delete an assistant route',
	},
	'assistants.get': {
		riskLevel: 'read',
		description: 'Get an assistant',
	},
	'assistants.getRoute': {
		riskLevel: 'read',
		description: 'Get an assistant route',
	},
	'assistants.getByMcp': {
		riskLevel: 'read',
		description: 'Get assistants by MCP',
	},
	'assistants.getPlan': {
		riskLevel: 'read',
		description: 'Get an assistant plan',
	},
	'assistants.list': {
		riskLevel: 'read',
		description: 'List assistants',
	},
	'assistants.listPlans': {
		riskLevel: 'read',
		description: 'List assistant plans',
	},
	'assistants.modify': {
		riskLevel: 'write',
		description: 'Modify an assistant',
	},
	'assistants.modifyPlan': {
		riskLevel: 'write',
		description: 'Modify an assistant plan',
	},
	'assistants.modifyRoute': {
		riskLevel: 'write',
		description: 'Modify an assistant route',
	},
	'assistants.run': {
		riskLevel: 'write',
		description: 'Run an assistant',
	},
	'assistants.validatePlan': {
		riskLevel: 'read',
		description: 'Validate an assistant plan',
	},
	'models.list': {
		riskLevel: 'read',
		description: 'List models',
	},
	'models.listAvailable': {
		riskLevel: 'read',
		description: 'List available models',
	},
	'models.listWorkspace': {
		riskLevel: 'read',
		description: 'List workspace models',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof studioByAI21LabsEndpointsNested
>;

export const studioByAI21LabsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseStudioByAI21LabsPlugin<
	T extends StudioByAI21LabsPluginOptions,
> = CorsairPlugin<
	'studiobyai21labs',
	typeof StudioByAI21LabsSchema,
	typeof studioByAI21LabsEndpointsNested,
	typeof studioByAI21LabsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalStudioByAI21LabsPlugin =
	BaseStudioByAI21LabsPlugin<StudioByAI21LabsPluginOptions>;

export type ExternalStudioByAI21LabsPlugin<
	T extends StudioByAI21LabsPluginOptions,
> = BaseStudioByAI21LabsPlugin<T>;

export function studiobyai21labs<const T extends StudioByAI21LabsPluginOptions>(
	incomingOptions: StudioByAI21LabsPluginOptions &
		T = {} as StudioByAI21LabsPluginOptions & T,
): ExternalStudioByAI21LabsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'studiobyai21labs',
		authConfig: studioByAI21LabsAuthConfig,
		schema: StudioByAI21LabsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: studioByAI21LabsEndpointsNested,
		webhooks: studioByAI21LabsWebhooksNested,
		endpointMeta: studioByAI21LabsEndpointMeta,
		endpointSchemas: studioByAI21LabsEndpointSchemas,
		webhookSchemas: studioByAI21LabsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-studiobyai21labs-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchStudioByAI21LabsTenantWebhook,
		oauthWebhookTenantLinkResolver:
			resolveStudioByAI21LabsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: StudioByAI21LabsKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalStudioByAI21LabsPlugin;
}

export type {
	ChatCompletionsInput,
	ChatCompletionsResponse,
	CheckCanIframeInput,
	CheckCanIframeResponse,
	CheckKirshGrantComplianceInput,
	CheckKirshGrantComplianceResponse,
	CompareTextInput,
	CompareTextResponse,
	CreateAftersalesPartsBatchInput,
	CreateAftersalesPartsBatchResponse,
	CreateAssistantInput,
	CreateAssistantPlanInput,
	CreateAssistantPlanResponse,
	CreateAssistantResponse,
	CreateAssistantRouteInput,
	CreateAssistantRouteResponse,
	CreateDemoInput,
	CreateDemoResponse,
	CreateKirshGrantCompliancePreviewInput,
	CreateKirshGrantCompliancePreviewResponse,
	CreateMcpStorageInput,
	CreateMcpStorageResponse,
	DeleteAssistantInput,
	DeleteAssistantResponse,
	DeleteAssistantRouteInput,
	DeleteAssistantRouteResponse,
	DeleteDemoInput,
	DeleteDemoResponse,
	DeleteFileInput,
	DeleteFileResponse,
	DeleteMcpStorageInput,
	DeleteMcpStorageResponse,
	DeleteSecretInput,
	DeleteSecretResponse,
	DeleteWebsiteConnectorInput,
	DeleteWebsiteConnectorResponse,
	DownloadModifiedDocumentInput,
	DownloadModifiedDocumentResponse,
	ExampleGetInput,
	ExampleGetResponse,
	GenerateRequirementsInput,
	GenerateRequirementsResponse,
	GenerateThreadNameInput,
	GenerateThreadNameResponse,
	GetAssistantInput,
	GetAssistantResponse,
	GetAssistantRouteInput,
	GetAssistantRouteResponse,
	GetAssistantsByMcpInput,
	GetAssistantsByMcpResponse,
	GetBatchPredictionStatusInput,
	GetBatchPredictionStatusResponse,
	GetDemoInput,
	GetDemoResponse,
	GetFileDownloadLinkInput,
	GetFileDownloadLinkResponse,
	GetLibraryBatchStatusInput,
	GetLibraryBatchStatusResponse,
	GetMcpStorageInput,
	GetMcpStorageResponse,
	GetOutputExplanationInput,
	GetOutputExplanationResponse,
	GetPlanInput,
	GetPlanResponse,
	GetWebsiteConnectorByIdInput,
	GetWebsiteConnectorByIdResponse,
	GetWebsiteConnectorStatusInput,
	GetWebsiteConnectorStatusResponse,
	GetWebsiteConnectorUrlStatusInput,
	GetWebsiteConnectorUrlStatusResponse,
	GetWorkspaceFileInput,
	GetWorkspaceFileResponse,
	GrantKirshMetadataInput,
	GrantKirshMetadataResponse,
	IngestWebsiteConnectorInput,
	IngestWebsiteConnectorResponse,
	IngestWebsiteConnectorUrlInput,
	IngestWebsiteConnectorUrlResponse,
	KirshGrantMetadataPreviewInput,
	KirshGrantMetadataPreviewResponse,
	ListAssistantsInput,
	ListAssistantsResponse,
	ListAvailableModelsInput,
	ListAvailableModelsResponse,
	ListDemosInput,
	ListDemosResponse,
	ListLibraryFilesInput,
	ListLibraryFilesResponse,
	ListMcpStorageInput,
	ListMcpStorageResponse,
	ListModelsInput,
	ListModelsResponse,
	ListPlansInput,
	ListPlansResponse,
	ListSecretsInput,
	ListSecretsResponse,
	ListWebsiteConnectorsInput,
	ListWebsiteConnectorsResponse,
	ListWorkspaceModelsInput,
	ListWorkspaceModelsResponse,
	ModifyAssistantInput,
	ModifyAssistantPlanInput,
	ModifyAssistantPlanResponse,
	ModifyAssistantResponse,
	ModifyAssistantRouteInput,
	ModifyAssistantRouteResponse,
	RetryIngestWebsiteInput,
	RetryIngestWebsiteResponse,
	RunAssistantInput,
	RunAssistantResponse,
	StudioByAI21LabsEndpointInputs,
	StudioByAI21LabsEndpointOutputs,
	SyncWebsiteConnectorInput,
	SyncWebsiteConnectorResponse,
	UpdateDemoInput,
	UpdateDemoResponse,
	UpdateFileInput,
	UpdateFileResponse,
	UpdateMcpStorageInput,
	UpdateMcpStorageResponse,
	UpdateSecretInput,
	UpdateSecretResponse,
	UploadWorkspaceFileInput,
	UploadWorkspaceFileResponse,
	ValidatePlanInput,
	ValidatePlanResponse,
} from './endpoints/types';
export type {
	ExampleEvent,
	StudioByAI21LabsWebhookOutputs,
} from './webhooks/types';
