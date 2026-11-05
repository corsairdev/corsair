import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	ApiKeys,
	Baremetals,
	Chat,
	Containers,
	ElasticIps,
	Firewalls,
	Idcs,
	Images,
	MediaModels,
	MediaRequests,
	Models,
	Router,
	SandboxExec,
	Sandboxes,
	SandboxFiles,
	SandboxProducts,
	SandboxTemplates,
	Templates,
	Uploads,
	Vpcs,
} from './endpoints';
import type {
	GmicloudEndpointInputs,
	GmicloudEndpointOutputs,
} from './endpoints/types';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GmicloudSchema } from './schema';

export type GmicloudPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Sent as X-Organization-ID for users who belong to several organizations.
	 * The API key's own organization is used when it is omitted.
	 */
	organizationId?: string;
	/** Defaults to https://api.gmi-serving.com (serverless LLM inference). */
	inferenceBaseUrl?: string;
	/** Defaults to https://console.gmicloud.ai/api (every other API). */
	consoleBaseUrl?: string;
	hooks?: InternalGmicloudPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gmicloudEndpointsNested>;
};

export type GmicloudContext = CorsairPluginContext<
	typeof GmicloudSchema,
	GmicloudPluginOptions
>;

export type GmicloudKeyBuilderContext =
	KeyBuilderContext<GmicloudPluginOptions>;

export type GmicloudBoundEndpoints = BindEndpoints<
	typeof gmicloudEndpointsNested
>;

type GmicloudEndpoint<K extends keyof GmicloudEndpointOutputs> =
	CorsairEndpoint<
		GmicloudContext,
		GmicloudEndpointInputs[K],
		GmicloudEndpointOutputs[K]
	>;

export type GmicloudEndpoints = {
	modelsList: GmicloudEndpoint<'modelsList'>;
	chatCreateCompletion: GmicloudEndpoint<'chatCreateCompletion'>;
	routerAutoroute: GmicloudEndpoint<'routerAutoroute'>;
	mediaModelsList: GmicloudEndpoint<'mediaModelsList'>;
	mediaModelsGet: GmicloudEndpoint<'mediaModelsGet'>;
	mediaRequestsCreate: GmicloudEndpoint<'mediaRequestsCreate'>;
	mediaRequestsGet: GmicloudEndpoint<'mediaRequestsGet'>;
	uploadsCreateUrl: GmicloudEndpoint<'uploadsCreateUrl'>;
	apiKeysGetCurrent: GmicloudEndpoint<'apiKeysGetCurrent'>;
	idcsList: GmicloudEndpoint<'idcsList'>;
	baremetalsList: GmicloudEndpoint<'baremetalsList'>;
	baremetalsCreate: GmicloudEndpoint<'baremetalsCreate'>;
	baremetalsGet: GmicloudEndpoint<'baremetalsGet'>;
	baremetalsUpdate: GmicloudEndpoint<'baremetalsUpdate'>;
	baremetalsDelete: GmicloudEndpoint<'baremetalsDelete'>;
	baremetalsAction: GmicloudEndpoint<'baremetalsAction'>;
	baremetalsListProducts: GmicloudEndpoint<'baremetalsListProducts'>;
	containersList: GmicloudEndpoint<'containersList'>;
	containersCreate: GmicloudEndpoint<'containersCreate'>;
	containersGet: GmicloudEndpoint<'containersGet'>;
	containersUpdate: GmicloudEndpoint<'containersUpdate'>;
	containersDelete: GmicloudEndpoint<'containersDelete'>;
	containersGetLogs: GmicloudEndpoint<'containersGetLogs'>;
	containersRestart: GmicloudEndpoint<'containersRestart'>;
	containersCreateShell: GmicloudEndpoint<'containersCreateShell'>;
	containersListProducts: GmicloudEndpoint<'containersListProducts'>;
	elasticIpsList: GmicloudEndpoint<'elasticIpsList'>;
	elasticIpsAllocate: GmicloudEndpoint<'elasticIpsAllocate'>;
	elasticIpsGet: GmicloudEndpoint<'elasticIpsGet'>;
	elasticIpsRelease: GmicloudEndpoint<'elasticIpsRelease'>;
	elasticIpsAssociate: GmicloudEndpoint<'elasticIpsAssociate'>;
	elasticIpsDisassociate: GmicloudEndpoint<'elasticIpsDisassociate'>;
	elasticIpsListProducts: GmicloudEndpoint<'elasticIpsListProducts'>;
	firewallsList: GmicloudEndpoint<'firewallsList'>;
	firewallsCreate: GmicloudEndpoint<'firewallsCreate'>;
	firewallsGet: GmicloudEndpoint<'firewallsGet'>;
	firewallsUpdate: GmicloudEndpoint<'firewallsUpdate'>;
	firewallsDelete: GmicloudEndpoint<'firewallsDelete'>;
	firewallsAssociate: GmicloudEndpoint<'firewallsAssociate'>;
	firewallsDisassociate: GmicloudEndpoint<'firewallsDisassociate'>;
	imagesList: GmicloudEndpoint<'imagesList'>;
	imagesGet: GmicloudEndpoint<'imagesGet'>;
	templatesList: GmicloudEndpoint<'templatesList'>;
	templatesCreate: GmicloudEndpoint<'templatesCreate'>;
	templatesGet: GmicloudEndpoint<'templatesGet'>;
	templatesUpdate: GmicloudEndpoint<'templatesUpdate'>;
	templatesDelete: GmicloudEndpoint<'templatesDelete'>;
	vpcsList: GmicloudEndpoint<'vpcsList'>;
	vpcsAllocate: GmicloudEndpoint<'vpcsAllocate'>;
	vpcsGet: GmicloudEndpoint<'vpcsGet'>;
	vpcsRelease: GmicloudEndpoint<'vpcsRelease'>;
	sandboxesList: GmicloudEndpoint<'sandboxesList'>;
	sandboxesCreate: GmicloudEndpoint<'sandboxesCreate'>;
	sandboxesGet: GmicloudEndpoint<'sandboxesGet'>;
	sandboxesUpdateMetadata: GmicloudEndpoint<'sandboxesUpdateMetadata'>;
	sandboxesDelete: GmicloudEndpoint<'sandboxesDelete'>;
	sandboxesConnect: GmicloudEndpoint<'sandboxesConnect'>;
	sandboxesSetTimeout: GmicloudEndpoint<'sandboxesSetTimeout'>;
	sandboxProductsList: GmicloudEndpoint<'sandboxProductsList'>;
	sandboxTemplatesList: GmicloudEndpoint<'sandboxTemplatesList'>;
	sandboxTemplatesCreate: GmicloudEndpoint<'sandboxTemplatesCreate'>;
	sandboxTemplatesGet: GmicloudEndpoint<'sandboxTemplatesGet'>;
	sandboxTemplatesUpdate: GmicloudEndpoint<'sandboxTemplatesUpdate'>;
	sandboxTemplatesDelete: GmicloudEndpoint<'sandboxTemplatesDelete'>;
	sandboxTemplatesListBuilds: GmicloudEndpoint<'sandboxTemplatesListBuilds'>;
	sandboxTemplatesGetBuild: GmicloudEndpoint<'sandboxTemplatesGetBuild'>;
	sandboxTemplatesGetBuildLogs: GmicloudEndpoint<'sandboxTemplatesGetBuildLogs'>;
	sandboxExecRun: GmicloudEndpoint<'sandboxExecRun'>;
	sandboxExecGet: GmicloudEndpoint<'sandboxExecGet'>;
	sandboxExecCancel: GmicloudEndpoint<'sandboxExecCancel'>;
	sandboxFilesDownload: GmicloudEndpoint<'sandboxFilesDownload'>;
	sandboxFilesUpload: GmicloudEndpoint<'sandboxFilesUpload'>;
};

const gmicloudEndpointsNested = {
	models: {
		list: Models.list,
	},
	chat: {
		createCompletion: Chat.createCompletion,
	},
	router: {
		autoroute: Router.autoroute,
	},
	mediaModels: {
		list: MediaModels.list,
		get: MediaModels.get,
	},
	mediaRequests: {
		create: MediaRequests.create,
		get: MediaRequests.get,
	},
	uploads: {
		createUrl: Uploads.createUrl,
	},
	apiKeys: {
		getCurrent: ApiKeys.getCurrent,
	},
	idcs: {
		list: Idcs.list,
	},
	baremetals: {
		list: Baremetals.list,
		create: Baremetals.create,
		get: Baremetals.get,
		update: Baremetals.update,
		delete: Baremetals.remove,
		action: Baremetals.action,
		listProducts: Baremetals.listProducts,
	},
	containers: {
		list: Containers.list,
		create: Containers.create,
		get: Containers.get,
		update: Containers.update,
		delete: Containers.remove,
		getLogs: Containers.getLogs,
		restart: Containers.restart,
		createShell: Containers.createShell,
		listProducts: Containers.listProducts,
	},
	elasticIps: {
		list: ElasticIps.list,
		allocate: ElasticIps.allocate,
		get: ElasticIps.get,
		release: ElasticIps.release,
		associate: ElasticIps.associate,
		disassociate: ElasticIps.disassociate,
		listProducts: ElasticIps.listProducts,
	},
	firewalls: {
		list: Firewalls.list,
		create: Firewalls.create,
		get: Firewalls.get,
		update: Firewalls.update,
		delete: Firewalls.remove,
		associate: Firewalls.associate,
		disassociate: Firewalls.disassociate,
	},
	images: {
		list: Images.list,
		get: Images.get,
	},
	templates: {
		list: Templates.list,
		create: Templates.create,
		get: Templates.get,
		update: Templates.update,
		delete: Templates.remove,
	},
	vpcs: {
		list: Vpcs.list,
		allocate: Vpcs.allocate,
		get: Vpcs.get,
		release: Vpcs.release,
	},
	sandboxes: {
		list: Sandboxes.list,
		create: Sandboxes.create,
		get: Sandboxes.get,
		updateMetadata: Sandboxes.updateMetadata,
		delete: Sandboxes.remove,
		connect: Sandboxes.connect,
		setTimeout: Sandboxes.setTimeout,
	},
	sandboxProducts: {
		list: SandboxProducts.list,
	},
	sandboxTemplates: {
		list: SandboxTemplates.list,
		create: SandboxTemplates.create,
		get: SandboxTemplates.get,
		update: SandboxTemplates.update,
		delete: SandboxTemplates.remove,
		listBuilds: SandboxTemplates.listBuilds,
		getBuild: SandboxTemplates.getBuild,
		getBuildLogs: SandboxTemplates.getBuildLogs,
	},
	sandboxExec: {
		run: SandboxExec.run,
		get: SandboxExec.get,
		cancel: SandboxExec.cancel,
	},
	sandboxFiles: {
		download: SandboxFiles.download,
		upload: SandboxFiles.upload,
	},
} as const;

export const gmicloudEndpointSchemas = {
	'models.list': {
		input: GmicloudEndpointInputSchemas.modelsList,
		output: GmicloudEndpointOutputSchemas.modelsList,
	},
	'chat.createCompletion': {
		input: GmicloudEndpointInputSchemas.chatCreateCompletion,
		output: GmicloudEndpointOutputSchemas.chatCreateCompletion,
	},
	'router.autoroute': {
		input: GmicloudEndpointInputSchemas.routerAutoroute,
		output: GmicloudEndpointOutputSchemas.routerAutoroute,
	},
	'mediaModels.list': {
		input: GmicloudEndpointInputSchemas.mediaModelsList,
		output: GmicloudEndpointOutputSchemas.mediaModelsList,
	},
	'mediaModels.get': {
		input: GmicloudEndpointInputSchemas.mediaModelsGet,
		output: GmicloudEndpointOutputSchemas.mediaModelsGet,
	},
	'mediaRequests.create': {
		input: GmicloudEndpointInputSchemas.mediaRequestsCreate,
		output: GmicloudEndpointOutputSchemas.mediaRequestsCreate,
	},
	'mediaRequests.get': {
		input: GmicloudEndpointInputSchemas.mediaRequestsGet,
		output: GmicloudEndpointOutputSchemas.mediaRequestsGet,
	},
	'uploads.createUrl': {
		input: GmicloudEndpointInputSchemas.uploadsCreateUrl,
		output: GmicloudEndpointOutputSchemas.uploadsCreateUrl,
	},
	'apiKeys.getCurrent': {
		input: GmicloudEndpointInputSchemas.apiKeysGetCurrent,
		output: GmicloudEndpointOutputSchemas.apiKeysGetCurrent,
	},
	'idcs.list': {
		input: GmicloudEndpointInputSchemas.idcsList,
		output: GmicloudEndpointOutputSchemas.idcsList,
	},
	'baremetals.list': {
		input: GmicloudEndpointInputSchemas.baremetalsList,
		output: GmicloudEndpointOutputSchemas.baremetalsList,
	},
	'baremetals.create': {
		input: GmicloudEndpointInputSchemas.baremetalsCreate,
		output: GmicloudEndpointOutputSchemas.baremetalsCreate,
	},
	'baremetals.get': {
		input: GmicloudEndpointInputSchemas.baremetalsGet,
		output: GmicloudEndpointOutputSchemas.baremetalsGet,
	},
	'baremetals.update': {
		input: GmicloudEndpointInputSchemas.baremetalsUpdate,
		output: GmicloudEndpointOutputSchemas.baremetalsUpdate,
	},
	'baremetals.delete': {
		input: GmicloudEndpointInputSchemas.baremetalsDelete,
		output: GmicloudEndpointOutputSchemas.baremetalsDelete,
	},
	'baremetals.action': {
		input: GmicloudEndpointInputSchemas.baremetalsAction,
		output: GmicloudEndpointOutputSchemas.baremetalsAction,
	},
	'baremetals.listProducts': {
		input: GmicloudEndpointInputSchemas.baremetalsListProducts,
		output: GmicloudEndpointOutputSchemas.baremetalsListProducts,
	},
	'containers.list': {
		input: GmicloudEndpointInputSchemas.containersList,
		output: GmicloudEndpointOutputSchemas.containersList,
	},
	'containers.create': {
		input: GmicloudEndpointInputSchemas.containersCreate,
		output: GmicloudEndpointOutputSchemas.containersCreate,
	},
	'containers.get': {
		input: GmicloudEndpointInputSchemas.containersGet,
		output: GmicloudEndpointOutputSchemas.containersGet,
	},
	'containers.update': {
		input: GmicloudEndpointInputSchemas.containersUpdate,
		output: GmicloudEndpointOutputSchemas.containersUpdate,
	},
	'containers.delete': {
		input: GmicloudEndpointInputSchemas.containersDelete,
		output: GmicloudEndpointOutputSchemas.containersDelete,
	},
	'containers.getLogs': {
		input: GmicloudEndpointInputSchemas.containersGetLogs,
		output: GmicloudEndpointOutputSchemas.containersGetLogs,
	},
	'containers.restart': {
		input: GmicloudEndpointInputSchemas.containersRestart,
		output: GmicloudEndpointOutputSchemas.containersRestart,
	},
	'containers.createShell': {
		input: GmicloudEndpointInputSchemas.containersCreateShell,
		output: GmicloudEndpointOutputSchemas.containersCreateShell,
	},
	'containers.listProducts': {
		input: GmicloudEndpointInputSchemas.containersListProducts,
		output: GmicloudEndpointOutputSchemas.containersListProducts,
	},
	'elasticIps.list': {
		input: GmicloudEndpointInputSchemas.elasticIpsList,
		output: GmicloudEndpointOutputSchemas.elasticIpsList,
	},
	'elasticIps.allocate': {
		input: GmicloudEndpointInputSchemas.elasticIpsAllocate,
		output: GmicloudEndpointOutputSchemas.elasticIpsAllocate,
	},
	'elasticIps.get': {
		input: GmicloudEndpointInputSchemas.elasticIpsGet,
		output: GmicloudEndpointOutputSchemas.elasticIpsGet,
	},
	'elasticIps.release': {
		input: GmicloudEndpointInputSchemas.elasticIpsRelease,
		output: GmicloudEndpointOutputSchemas.elasticIpsRelease,
	},
	'elasticIps.associate': {
		input: GmicloudEndpointInputSchemas.elasticIpsAssociate,
		output: GmicloudEndpointOutputSchemas.elasticIpsAssociate,
	},
	'elasticIps.disassociate': {
		input: GmicloudEndpointInputSchemas.elasticIpsDisassociate,
		output: GmicloudEndpointOutputSchemas.elasticIpsDisassociate,
	},
	'elasticIps.listProducts': {
		input: GmicloudEndpointInputSchemas.elasticIpsListProducts,
		output: GmicloudEndpointOutputSchemas.elasticIpsListProducts,
	},
	'firewalls.list': {
		input: GmicloudEndpointInputSchemas.firewallsList,
		output: GmicloudEndpointOutputSchemas.firewallsList,
	},
	'firewalls.create': {
		input: GmicloudEndpointInputSchemas.firewallsCreate,
		output: GmicloudEndpointOutputSchemas.firewallsCreate,
	},
	'firewalls.get': {
		input: GmicloudEndpointInputSchemas.firewallsGet,
		output: GmicloudEndpointOutputSchemas.firewallsGet,
	},
	'firewalls.update': {
		input: GmicloudEndpointInputSchemas.firewallsUpdate,
		output: GmicloudEndpointOutputSchemas.firewallsUpdate,
	},
	'firewalls.delete': {
		input: GmicloudEndpointInputSchemas.firewallsDelete,
		output: GmicloudEndpointOutputSchemas.firewallsDelete,
	},
	'firewalls.associate': {
		input: GmicloudEndpointInputSchemas.firewallsAssociate,
		output: GmicloudEndpointOutputSchemas.firewallsAssociate,
	},
	'firewalls.disassociate': {
		input: GmicloudEndpointInputSchemas.firewallsDisassociate,
		output: GmicloudEndpointOutputSchemas.firewallsDisassociate,
	},
	'images.list': {
		input: GmicloudEndpointInputSchemas.imagesList,
		output: GmicloudEndpointOutputSchemas.imagesList,
	},
	'images.get': {
		input: GmicloudEndpointInputSchemas.imagesGet,
		output: GmicloudEndpointOutputSchemas.imagesGet,
	},
	'templates.list': {
		input: GmicloudEndpointInputSchemas.templatesList,
		output: GmicloudEndpointOutputSchemas.templatesList,
	},
	'templates.create': {
		input: GmicloudEndpointInputSchemas.templatesCreate,
		output: GmicloudEndpointOutputSchemas.templatesCreate,
	},
	'templates.get': {
		input: GmicloudEndpointInputSchemas.templatesGet,
		output: GmicloudEndpointOutputSchemas.templatesGet,
	},
	'templates.update': {
		input: GmicloudEndpointInputSchemas.templatesUpdate,
		output: GmicloudEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: GmicloudEndpointInputSchemas.templatesDelete,
		output: GmicloudEndpointOutputSchemas.templatesDelete,
	},
	'vpcs.list': {
		input: GmicloudEndpointInputSchemas.vpcsList,
		output: GmicloudEndpointOutputSchemas.vpcsList,
	},
	'vpcs.allocate': {
		input: GmicloudEndpointInputSchemas.vpcsAllocate,
		output: GmicloudEndpointOutputSchemas.vpcsAllocate,
	},
	'vpcs.get': {
		input: GmicloudEndpointInputSchemas.vpcsGet,
		output: GmicloudEndpointOutputSchemas.vpcsGet,
	},
	'vpcs.release': {
		input: GmicloudEndpointInputSchemas.vpcsRelease,
		output: GmicloudEndpointOutputSchemas.vpcsRelease,
	},
	'sandboxes.list': {
		input: GmicloudEndpointInputSchemas.sandboxesList,
		output: GmicloudEndpointOutputSchemas.sandboxesList,
	},
	'sandboxes.create': {
		input: GmicloudEndpointInputSchemas.sandboxesCreate,
		output: GmicloudEndpointOutputSchemas.sandboxesCreate,
	},
	'sandboxes.get': {
		input: GmicloudEndpointInputSchemas.sandboxesGet,
		output: GmicloudEndpointOutputSchemas.sandboxesGet,
	},
	'sandboxes.updateMetadata': {
		input: GmicloudEndpointInputSchemas.sandboxesUpdateMetadata,
		output: GmicloudEndpointOutputSchemas.sandboxesUpdateMetadata,
	},
	'sandboxes.delete': {
		input: GmicloudEndpointInputSchemas.sandboxesDelete,
		output: GmicloudEndpointOutputSchemas.sandboxesDelete,
	},
	'sandboxes.connect': {
		input: GmicloudEndpointInputSchemas.sandboxesConnect,
		output: GmicloudEndpointOutputSchemas.sandboxesConnect,
	},
	'sandboxes.setTimeout': {
		input: GmicloudEndpointInputSchemas.sandboxesSetTimeout,
		output: GmicloudEndpointOutputSchemas.sandboxesSetTimeout,
	},
	'sandboxProducts.list': {
		input: GmicloudEndpointInputSchemas.sandboxProductsList,
		output: GmicloudEndpointOutputSchemas.sandboxProductsList,
	},
	'sandboxTemplates.list': {
		input: GmicloudEndpointInputSchemas.sandboxTemplatesList,
		output: GmicloudEndpointOutputSchemas.sandboxTemplatesList,
	},
	'sandboxTemplates.create': {
		input: GmicloudEndpointInputSchemas.sandboxTemplatesCreate,
		output: GmicloudEndpointOutputSchemas.sandboxTemplatesCreate,
	},
	'sandboxTemplates.get': {
		input: GmicloudEndpointInputSchemas.sandboxTemplatesGet,
		output: GmicloudEndpointOutputSchemas.sandboxTemplatesGet,
	},
	'sandboxTemplates.update': {
		input: GmicloudEndpointInputSchemas.sandboxTemplatesUpdate,
		output: GmicloudEndpointOutputSchemas.sandboxTemplatesUpdate,
	},
	'sandboxTemplates.delete': {
		input: GmicloudEndpointInputSchemas.sandboxTemplatesDelete,
		output: GmicloudEndpointOutputSchemas.sandboxTemplatesDelete,
	},
	'sandboxTemplates.listBuilds': {
		input: GmicloudEndpointInputSchemas.sandboxTemplatesListBuilds,
		output: GmicloudEndpointOutputSchemas.sandboxTemplatesListBuilds,
	},
	'sandboxTemplates.getBuild': {
		input: GmicloudEndpointInputSchemas.sandboxTemplatesGetBuild,
		output: GmicloudEndpointOutputSchemas.sandboxTemplatesGetBuild,
	},
	'sandboxTemplates.getBuildLogs': {
		input: GmicloudEndpointInputSchemas.sandboxTemplatesGetBuildLogs,
		output: GmicloudEndpointOutputSchemas.sandboxTemplatesGetBuildLogs,
	},
	'sandboxExec.run': {
		input: GmicloudEndpointInputSchemas.sandboxExecRun,
		output: GmicloudEndpointOutputSchemas.sandboxExecRun,
	},
	'sandboxExec.get': {
		input: GmicloudEndpointInputSchemas.sandboxExecGet,
		output: GmicloudEndpointOutputSchemas.sandboxExecGet,
	},
	'sandboxExec.cancel': {
		input: GmicloudEndpointInputSchemas.sandboxExecCancel,
		output: GmicloudEndpointOutputSchemas.sandboxExecCancel,
	},
	'sandboxFiles.download': {
		input: GmicloudEndpointInputSchemas.sandboxFilesDownload,
		output: GmicloudEndpointOutputSchemas.sandboxFilesDownload,
	},
	'sandboxFiles.upload': {
		input: GmicloudEndpointInputSchemas.sandboxFilesUpload,
		output: GmicloudEndpointOutputSchemas.sandboxFilesUpload,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gmicloudEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const gmicloudEndpointMeta = {
	'models.list': {
		riskLevel: 'read',
		description: 'List the LLMs available on GMI Cloud serverless inference',
	},
	'chat.createCompletion': {
		riskLevel: 'write',
		description:
			'Generate a chat completion with an LLM through the OpenAI-compatible API (billed per token)',
	},
	'router.autoroute': {
		riskLevel: 'write',
		description:
			'Let the GMI Router pick the best model for a conversation by cost, balance, or quality and return its completion',
	},
	'mediaModels.list': {
		riskLevel: 'read',
		description:
			'List the video, image, and audio model IDs served by the GMI request queue',
	},
	'mediaModels.get': {
		riskLevel: 'read',
		description:
			"Get a media model's description and the payload parameters its requests accept",
	},
	'mediaRequests.create': {
		riskLevel: 'write',
		description:
			'Queue a video, image, or audio generation request; poll mediaRequests.get for the outcome (billed)',
	},
	'mediaRequests.get': {
		riskLevel: 'read',
		description:
			'Get the status of a queued media request and, once it succeeds, its output file URLs',
	},
	'uploads.createUrl': {
		riskLevel: 'write',
		description:
			'Get a pre-signed upload URL and the stable public URL to reference an image, video, or audio file in media requests',
	},
	'apiKeys.getCurrent': {
		riskLevel: 'read',
		description:
			'Verify the configured API key and return its details, including the organization it belongs to',
	},
	'idcs.list': {
		riskLevel: 'read',
		description:
			'List the data centers (IDCs) available for GPU compute resources',
	},
	'baremetals.list': {
		riskLevel: 'read',
		description:
			'List bare-metal GPU servers, optionally filtered by data center',
	},
	'baremetals.create': {
		riskLevel: 'write',
		description: 'Provision bare-metal GPU servers (billed while they exist)',
	},
	'baremetals.get': {
		riskLevel: 'read',
		description: 'Get a bare-metal server by ID',
	},
	'baremetals.update': {
		riskLevel: 'write',
		description: 'Rename a bare-metal server',
	},
	'baremetals.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a bare-metal server and release its resources',
	},
	'baremetals.action': {
		riskLevel: 'write',
		description: 'Start, stop, power-cycle, or reboot a bare-metal server',
	},
	'baremetals.listProducts': {
		riskLevel: 'read',
		description:
			'List bare-metal server products (GPU types and specs) in a data center',
	},
	'containers.list': {
		riskLevel: 'read',
		description: 'List container workloads in the organization',
	},
	'containers.create': {
		riskLevel: 'write',
		description:
			'Launch GPU container workloads from a template (billed while they run)',
	},
	'containers.get': {
		riskLevel: 'read',
		description:
			'Get a container workload by ID, including status and IP addresses',
	},
	'containers.update': {
		riskLevel: 'write',
		description:
			"Update a container's name, template, command, arguments, environment, ports, or SSH keys",
	},
	'containers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a container workload; its local data is lost',
	},
	'containers.getLogs': {
		riskLevel: 'read',
		description: 'Download the logs of a container workload as text',
	},
	'containers.restart': {
		riskLevel: 'write',
		description: 'Restart a container workload',
	},
	'containers.createShell': {
		riskLevel: 'write',
		description: 'Generate a web shell URL path for a running container',
	},
	'containers.listProducts': {
		riskLevel: 'read',
		description:
			'List container products (GPU types and specs) in a data center',
	},
	'elasticIps.list': {
		riskLevel: 'read',
		description: 'List elastic IPs allocated to the organization',
	},
	'elasticIps.allocate': {
		riskLevel: 'write',
		description: 'Allocate a static public IPv4 address for the organization',
	},
	'elasticIps.get': {
		riskLevel: 'read',
		description: 'Get an elastic IP by ID',
	},
	'elasticIps.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Release an elastic IP; the address cannot be reclaimed',
	},
	'elasticIps.associate': {
		riskLevel: 'write',
		description: 'Attach an elastic IP to a bare-metal server or container',
	},
	'elasticIps.disassociate': {
		riskLevel: 'write',
		description: 'Detach an elastic IP from its instance',
	},
	'elasticIps.listProducts': {
		riskLevel: 'read',
		description: 'List elastic IP products in a data center',
	},
	'firewalls.list': {
		riskLevel: 'read',
		description: 'List firewalls, optionally filtered by data center',
	},
	'firewalls.create': {
		riskLevel: 'write',
		description: 'Create a firewall with inbound rules in a data center',
	},
	'firewalls.get': {
		riskLevel: 'read',
		description: 'Get a firewall and its rules by ID',
	},
	'firewalls.update': {
		riskLevel: 'write',
		description: "Replace a firewall's name, description, and inbound rules",
	},
	'firewalls.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a firewall',
	},
	'firewalls.associate': {
		riskLevel: 'write',
		description: 'Apply a firewall to bare-metal servers or containers',
	},
	'firewalls.disassociate': {
		riskLevel: 'write',
		description: 'Remove a firewall from bare-metal servers or containers',
	},
	'images.list': {
		riskLevel: 'read',
		description:
			'List OS images for bare-metal servers, optionally filtered by data center and product',
	},
	'images.get': {
		riskLevel: 'read',
		description: 'Get an OS image by ID',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List container templates (official and custom) used to launch containers',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a custom container template',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get a container template by ID',
	},
	'templates.update': {
		riskLevel: 'write',
		description: 'Update a custom container template',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom container template',
	},
	'vpcs.list': {
		riskLevel: 'read',
		description: 'List VPCs, optionally filtered by data center',
	},
	'vpcs.allocate': {
		riskLevel: 'write',
		description:
			'Allocate the default VPC for the organization in a data center',
	},
	'vpcs.get': {
		riskLevel: 'read',
		description: 'Get a VPC and its subnets by ID',
	},
	'vpcs.release': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Release the default VPC',
	},
	'sandboxes.list': {
		riskLevel: 'read',
		description:
			'List active sandboxes (provisioning, running, updating, checkpointing, failed) with pagination',
	},
	'sandboxes.create': {
		riskLevel: 'write',
		description:
			'Create a sandbox from a template; returns the data-plane host and access token used by sandboxExec and sandboxFiles',
	},
	'sandboxes.get': {
		riskLevel: 'read',
		description:
			'Get sandbox details, including state, resources, and failure reason',
	},
	'sandboxes.updateMetadata': {
		riskLevel: 'write',
		description:
			"Replace a sandbox's metadata as a whole (an empty object clears it)",
	},
	'sandboxes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Kill a sandbox; it moves to deleting and then deleted once resources are released',
	},
	'sandboxes.connect': {
		riskLevel: 'write',
		description:
			'Connect to a running sandbox and return its data-plane domain and access token; a timeout extends its lifetime',
	},
	'sandboxes.setTimeout': {
		riskLevel: 'write',
		description:
			"Reset a running sandbox's time-to-live relative to now (300 seconds when omitted)",
	},
	'sandboxProducts.list': {
		riskLevel: 'read',
		description:
			'List the sandbox product catalog (CPU, memory, disk) in a data center',
	},
	'sandboxTemplates.list': {
		riskLevel: 'read',
		description: 'List sandbox templates with pagination',
	},
	'sandboxTemplates.create': {
		riskLevel: 'write',
		description:
			'Create a sandbox template from an image or another template and start its first build',
	},
	'sandboxTemplates.get': {
		riskLevel: 'read',
		description: 'Get a sandbox template with its current and latest build',
	},
	'sandboxTemplates.update': {
		riskLevel: 'write',
		description: "Update a sandbox template's name, description, or labels",
	},
	'sandboxTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a sandbox template; existing sandboxes keep running',
	},
	'sandboxTemplates.listBuilds': {
		riskLevel: 'read',
		description:
			'List the builds of a sandbox template, newest first, with pagination',
	},
	'sandboxTemplates.getBuild': {
		riskLevel: 'read',
		description:
			'Get a sandbox template build status and artifact availability',
	},
	'sandboxTemplates.getBuildLogs': {
		riskLevel: 'read',
		description: 'Get build logs for a sandbox template build, paged by offset',
	},
	'sandboxExec.run': {
		riskLevel: 'write',
		description:
			'Run a shell command inside a sandbox; with wait it returns the result, otherwise poll sandboxExec.get',
	},
	'sandboxExec.get': {
		riskLevel: 'read',
		description: 'Get the status, exit code, and output of a sandbox command',
	},
	'sandboxExec.cancel': {
		riskLevel: 'write',
		description: 'Cancel a running sandbox command',
	},
	'sandboxFiles.download': {
		riskLevel: 'read',
		description:
			'Download a file from a sandbox by absolute path; returns base64 content',
	},
	'sandboxFiles.upload': {
		riskLevel: 'write',
		description:
			'Write a file to an absolute path inside a sandbox, overwriting any existing file',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gmicloudEndpointsNested>;

export type BaseGmicloudPlugin<T extends GmicloudPluginOptions> = CorsairPlugin<
	'gmicloud',
	typeof GmicloudSchema,
	typeof gmicloudEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalGmicloudPlugin = BaseGmicloudPlugin<GmicloudPluginOptions>;

export type ExternalGmicloudPlugin<T extends GmicloudPluginOptions> =
	BaseGmicloudPlugin<T>;

export function gmicloud<const T extends GmicloudPluginOptions>(
	// Every option is optional, so an empty object is a valid default for T.
	incomingOptions: GmicloudPluginOptions & T = {} as GmicloudPluginOptions & T,
): ExternalGmicloudPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gmicloud',
		schema: GmicloudSchema,
		options: options,
		hooks: options.hooks,
		endpoints: gmicloudEndpointsNested,
		webhooks: {},
		endpointMeta: gmicloudEndpointMeta,
		endpointSchemas: gmicloudEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GmicloudKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('gmicloud', 'api_key');
		},
	} satisfies InternalGmicloudPlugin;
}

export { GmicloudAPIError } from './client';
export type {
	GmicloudEndpointInputs,
	GmicloudEndpointOutputs,
} from './endpoints/types';
export type {
	GmicloudBaremetal,
	GmicloudContainer,
	GmicloudElasticIp,
	GmicloudFirewall,
	GmicloudMediaRequest,
	GmicloudModel,
	GmicloudSandbox,
	GmicloudSandboxTemplate,
} from './schema';
