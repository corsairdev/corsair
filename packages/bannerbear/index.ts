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
import {
	Account,
	Animations,
	Collections,
	Images,
	Misc,
	Projects,
	Screenshots,
	SignedUrls,
	TemplateSets,
	Templates,
	Videos,
	WebhooksApi,
	Workflows,
} from './endpoints';
import type {
	BannerbearEndpointInputs,
	BannerbearEndpointOutputs,
} from './endpoints/types';
import {
	BannerbearEndpointInputSchemas,
	BannerbearEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BannerbearSchema } from './schema';
import { ImageWebhooks, VideoWebhooks } from './webhooks';
import { matchBannerbearTenantWebhook } from './webhooks/tenant-matcher';
import type {
	BannerbearWebhookOutputs,
	ImageCompletedEvent,
	VideoCompletedEvent,
} from './webhooks/types';
import {
	ImageCompletedEventSchema,
	VideoCompletedEventSchema,
} from './webhooks/types';

export type BannerbearPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBannerbearPlugin['hooks'];
	webhookHooks?: InternalBannerbearPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bannerbearEndpointsNested>;
};

export type BannerbearContext = CorsairPluginContext<
	typeof BannerbearSchema,
	BannerbearPluginOptions
>;

export type BannerbearKeyBuilderContext =
	KeyBuilderContext<BannerbearPluginOptions>;

export type BannerbearBoundEndpoints = BindEndpoints<
	typeof bannerbearEndpointsNested
>;

type BannerbearEndpoint<K extends keyof BannerbearEndpointOutputs> =
	CorsairEndpoint<
		BannerbearContext,
		BannerbearEndpointInputs[K],
		BannerbearEndpointOutputs[K]
	>;

export type BannerbearEndpoints = {
	// Account
	getAccountInfo: BannerbearEndpoint<'getAccountInfo'>;
	getAuth: BannerbearEndpoint<'getAuth'>;
	// Projects
	listProjects: BannerbearEndpoint<'listProjects'>;
	getProject: BannerbearEndpoint<'getProject'>;
	createProject: BannerbearEndpoint<'createProject'>;
	hydrateProject: BannerbearEndpoint<'hydrateProject'>;
	// Templates
	listTemplates: BannerbearEndpoint<'listTemplates'>;
	getTemplate: BannerbearEndpoint<'getTemplate'>;
	createTemplate: BannerbearEndpoint<'createTemplate'>;
	deleteTemplate: BannerbearEndpoint<'deleteTemplate'>;
	importTemplate: BannerbearEndpoint<'importTemplate'>;
	// Template Sets
	listTemplateSets: BannerbearEndpoint<'listTemplateSets'>;
	getTemplateSet: BannerbearEndpoint<'getTemplateSet'>;
	createTemplateSet: BannerbearEndpoint<'createTemplateSet'>;
	updateTemplateSet: BannerbearEndpoint<'updateTemplateSet'>;
	// Images
	listImages: BannerbearEndpoint<'listImages'>;
	getImage: BannerbearEndpoint<'getImage'>;
	// Videos
	listVideos: BannerbearEndpoint<'listVideos'>;
	listVideoTemplates: BannerbearEndpoint<'listVideoTemplates'>;
	createVideoTemplate: BannerbearEndpoint<'createVideoTemplate'>;
	// Animated GIFs
	listAnimatedGifs: BannerbearEndpoint<'listAnimatedGifs'>;
	getAnimatedGif: BannerbearEndpoint<'getAnimatedGif'>;
	// Collections
	listCollections: BannerbearEndpoint<'listCollections'>;
	// Screenshots
	listScreenshots: BannerbearEndpoint<'listScreenshots'>;
	getScreenshot: BannerbearEndpoint<'getScreenshot'>;
	// Signed URLs
	getSignedBases: BannerbearEndpoint<'getSignedBases'>;
	createSignedBase: BannerbearEndpoint<'createSignedBase'>;
	// Webhooks API
	getWebhook: BannerbearEndpoint<'getWebhook'>;
	createWebhook: BannerbearEndpoint<'createWebhook'>;
	deleteWebhook: BannerbearEndpoint<'deleteWebhook'>;
	// Misc
	getFonts: BannerbearEndpoint<'getFonts'>;
	listEffects: BannerbearEndpoint<'listEffects'>;
	joinPdfs: BannerbearEndpoint<'joinPdfs'>;
	// Workflows
	listWorkflows: BannerbearEndpoint<'listWorkflows'>;
	getWorkflow: BannerbearEndpoint<'getWorkflow'>;
	createWorkflowRun: BannerbearEndpoint<'createWorkflowRun'>;
	getWorkflowRun: BannerbearEndpoint<'getWorkflowRun'>;
	listWorkflowRuns: BannerbearEndpoint<'listWorkflowRuns'>;
};

type BannerbearWebhook<
	K extends keyof BannerbearWebhookOutputs,
	TEvent,
> = CorsairWebhook<BannerbearContext, TEvent, BannerbearWebhookOutputs[K]>;

export type BannerbearWebhooks = {
	imageCompleted: BannerbearWebhook<'imageCompleted', ImageCompletedEvent>;
	videoCompleted: BannerbearWebhook<'videoCompleted', VideoCompletedEvent>;
};

export type BannerbearBoundWebhooks = BindWebhooks<BannerbearWebhooks>;

const bannerbearEndpointsNested = {
	account: {
		getAccountInfo: Account.getAccountInfo,
		getAuth: Account.getAuth,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		hydrate: Projects.hydrate,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		delete: Templates.deleteTemplate,
		import: Templates.importTemplate,
	},
	templateSets: {
		list: TemplateSets.list,
		get: TemplateSets.get,
		create: TemplateSets.create,
		update: TemplateSets.update,
	},
	images: {
		list: Images.list,
		get: Images.get,
	},
	videos: {
		listVideos: Videos.listVideos,
		listVideoTemplates: Videos.listVideoTemplates,
		createVideoTemplate: Videos.createVideoTemplate,
	},
	animations: {
		list: Animations.list,
		get: Animations.get,
	},
	collections: {
		list: Collections.list,
	},
	screenshots: {
		list: Screenshots.list,
		get: Screenshots.get,
	},
	signedUrls: {
		getSignedBases: SignedUrls.getSignedBases,
		createSignedBase: SignedUrls.createSignedBase,
	},
	webhooksApi: {
		get: WebhooksApi.get,
		create: WebhooksApi.create,
		delete: WebhooksApi.deleteWebhook,
	},
	misc: {
		getFonts: Misc.getFonts,
		listEffects: Misc.listEffects,
		joinPdfs: Misc.joinPdfs,
	},
	workflows: {
		listWorkflows: Workflows.listWorkflows,
		getWorkflow: Workflows.getWorkflow,
		createWorkflowRun: Workflows.createWorkflowRun,
		getWorkflowRun: Workflows.getWorkflowRun,
		listWorkflowRuns: Workflows.listWorkflowRuns,
	},
} as const;

const bannerbearWebhooksNested = {
	image: {
		imageCompleted: ImageWebhooks.imageCompleted,
	},
	video: {
		videoCompleted: VideoWebhooks.videoCompleted,
	},
} as const;

export const bannerbearEndpointSchemas = {
	'account.getAccountInfo': {
		input: BannerbearEndpointInputSchemas.getAccountInfo,
		output: BannerbearEndpointOutputSchemas.getAccountInfo,
	},
	'account.getAuth': {
		input: BannerbearEndpointInputSchemas.getAuth,
		output: BannerbearEndpointOutputSchemas.getAuth,
	},
	'projects.list': {
		input: BannerbearEndpointInputSchemas.listProjects,
		output: BannerbearEndpointOutputSchemas.listProjects,
	},
	'projects.get': {
		input: BannerbearEndpointInputSchemas.getProject,
		output: BannerbearEndpointOutputSchemas.getProject,
	},
	'projects.create': {
		input: BannerbearEndpointInputSchemas.createProject,
		output: BannerbearEndpointOutputSchemas.createProject,
	},
	'projects.hydrate': {
		input: BannerbearEndpointInputSchemas.hydrateProject,
		output: BannerbearEndpointOutputSchemas.hydrateProject,
	},
	'templates.list': {
		input: BannerbearEndpointInputSchemas.listTemplates,
		output: BannerbearEndpointOutputSchemas.listTemplates,
	},
	'templates.get': {
		input: BannerbearEndpointInputSchemas.getTemplate,
		output: BannerbearEndpointOutputSchemas.getTemplate,
	},
	'templates.create': {
		input: BannerbearEndpointInputSchemas.createTemplate,
		output: BannerbearEndpointOutputSchemas.createTemplate,
	},
	'templates.delete': {
		input: BannerbearEndpointInputSchemas.deleteTemplate,
		output: BannerbearEndpointOutputSchemas.deleteTemplate,
	},
	'templates.import': {
		input: BannerbearEndpointInputSchemas.importTemplate,
		output: BannerbearEndpointOutputSchemas.importTemplate,
	},
	'templateSets.list': {
		input: BannerbearEndpointInputSchemas.listTemplateSets,
		output: BannerbearEndpointOutputSchemas.listTemplateSets,
	},
	'templateSets.get': {
		input: BannerbearEndpointInputSchemas.getTemplateSet,
		output: BannerbearEndpointOutputSchemas.getTemplateSet,
	},
	'templateSets.create': {
		input: BannerbearEndpointInputSchemas.createTemplateSet,
		output: BannerbearEndpointOutputSchemas.createTemplateSet,
	},
	'templateSets.update': {
		input: BannerbearEndpointInputSchemas.updateTemplateSet,
		output: BannerbearEndpointOutputSchemas.updateTemplateSet,
	},
	'images.list': {
		input: BannerbearEndpointInputSchemas.listImages,
		output: BannerbearEndpointOutputSchemas.listImages,
	},
	'images.get': {
		input: BannerbearEndpointInputSchemas.getImage,
		output: BannerbearEndpointOutputSchemas.getImage,
	},
	'videos.listVideos': {
		input: BannerbearEndpointInputSchemas.listVideos,
		output: BannerbearEndpointOutputSchemas.listVideos,
	},
	'videos.listVideoTemplates': {
		input: BannerbearEndpointInputSchemas.listVideoTemplates,
		output: BannerbearEndpointOutputSchemas.listVideoTemplates,
	},
	'videos.createVideoTemplate': {
		input: BannerbearEndpointInputSchemas.createVideoTemplate,
		output: BannerbearEndpointOutputSchemas.createVideoTemplate,
	},
	'animations.list': {
		input: BannerbearEndpointInputSchemas.listAnimatedGifs,
		output: BannerbearEndpointOutputSchemas.listAnimatedGifs,
	},
	'animations.get': {
		input: BannerbearEndpointInputSchemas.getAnimatedGif,
		output: BannerbearEndpointOutputSchemas.getAnimatedGif,
	},
	'collections.list': {
		input: BannerbearEndpointInputSchemas.listCollections,
		output: BannerbearEndpointOutputSchemas.listCollections,
	},
	'screenshots.list': {
		input: BannerbearEndpointInputSchemas.listScreenshots,
		output: BannerbearEndpointOutputSchemas.listScreenshots,
	},
	'screenshots.get': {
		input: BannerbearEndpointInputSchemas.getScreenshot,
		output: BannerbearEndpointOutputSchemas.getScreenshot,
	},
	'signedUrls.getSignedBases': {
		input: BannerbearEndpointInputSchemas.getSignedBases,
		output: BannerbearEndpointOutputSchemas.getSignedBases,
	},
	'signedUrls.createSignedBase': {
		input: BannerbearEndpointInputSchemas.createSignedBase,
		output: BannerbearEndpointOutputSchemas.createSignedBase,
	},
	'webhooksApi.get': {
		input: BannerbearEndpointInputSchemas.getWebhook,
		output: BannerbearEndpointOutputSchemas.getWebhook,
	},
	'webhooksApi.create': {
		input: BannerbearEndpointInputSchemas.createWebhook,
		output: BannerbearEndpointOutputSchemas.createWebhook,
	},
	'webhooksApi.delete': {
		input: BannerbearEndpointInputSchemas.deleteWebhook,
		output: BannerbearEndpointOutputSchemas.deleteWebhook,
	},
	'misc.getFonts': {
		input: BannerbearEndpointInputSchemas.getFonts,
		output: BannerbearEndpointOutputSchemas.getFonts,
	},
	'misc.listEffects': {
		input: BannerbearEndpointInputSchemas.listEffects,
		output: BannerbearEndpointOutputSchemas.listEffects,
	},
	'misc.joinPdfs': {
		input: BannerbearEndpointInputSchemas.joinPdfs,
		output: BannerbearEndpointOutputSchemas.joinPdfs,
	},
	'workflows.listWorkflows': {
		input: BannerbearEndpointInputSchemas.listWorkflows,
		output: BannerbearEndpointOutputSchemas.listWorkflows,
	},
	'workflows.getWorkflow': {
		input: BannerbearEndpointInputSchemas.getWorkflow,
		output: BannerbearEndpointOutputSchemas.getWorkflow,
	},
	'workflows.createWorkflowRun': {
		input: BannerbearEndpointInputSchemas.createWorkflowRun,
		output: BannerbearEndpointOutputSchemas.createWorkflowRun,
	},
	'workflows.getWorkflowRun': {
		input: BannerbearEndpointInputSchemas.getWorkflowRun,
		output: BannerbearEndpointOutputSchemas.getWorkflowRun,
	},
	'workflows.listWorkflowRuns': {
		input: BannerbearEndpointInputSchemas.listWorkflowRuns,
		output: BannerbearEndpointOutputSchemas.listWorkflowRuns,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bannerbearEndpointsNested
>;

const bannerbearWebhookSchemas = {
	'image.imageCompleted': {
		description: 'Fires when a Bannerbear image finishes rendering',
		payload: ImageCompletedEventSchema,
		response: ImageCompletedEventSchema,
	},
	'video.videoCompleted': {
		description: 'Fires when a Bannerbear video finishes rendering',
		payload: VideoCompletedEventSchema,
		response: VideoCompletedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof bannerbearWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bannerbearEndpointMeta = {
	'account.getAccountInfo': {
		riskLevel: 'read',
		description: 'Get account info including plan and quota',
	},
	'account.getAuth': {
		riskLevel: 'read',
		description: 'Verify API authentication and check project context',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List all projects in the account',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project by UID',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.hydrate': {
		riskLevel: 'write',
		description: 'Hydrate a project by copying templates from another project',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List all templates in a project',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get a template by UID with layer defaults',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a new blank template',
	},
	'templates.delete': {
		riskLevel: 'write',
		description: 'Delete a template by UID',
	},
	'templates.import': {
		riskLevel: 'write',
		description: 'Import a template from the Bannerbear template library',
	},
	'templateSets.list': {
		riskLevel: 'read',
		description: 'List all template sets in a project',
	},
	'templateSets.get': {
		riskLevel: 'read',
		description: 'Get a template set by UID',
	},
	'templateSets.create': {
		riskLevel: 'write',
		description: 'Create a new template set',
	},
	'templateSets.update': {
		riskLevel: 'write',
		description: 'Update a template set',
	},
	'images.list': {
		riskLevel: 'read',
		description: 'List all images in a project',
	},
	'images.get': {
		riskLevel: 'read',
		description: 'Get an image by UID',
	},
	'videos.listVideos': {
		riskLevel: 'read',
		description: 'List all videos in a project',
	},
	'videos.listVideoTemplates': {
		riskLevel: 'read',
		description: 'List all video templates in a project',
	},
	'videos.createVideoTemplate': {
		riskLevel: 'write',
		description: 'Create a new video template',
	},
	'animations.list': {
		riskLevel: 'read',
		description: 'List all animated GIFs in a project',
	},
	'animations.get': {
		riskLevel: 'read',
		description: 'Get an animated GIF by UID',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List all collections in a project',
	},
	'screenshots.list': {
		riskLevel: 'read',
		description: 'List all screenshots in a project',
	},
	'screenshots.get': {
		riskLevel: 'read',
		description: 'Get a screenshot by UID',
	},
	'signedUrls.getSignedBases': {
		riskLevel: 'read',
		description: 'Get signed URL bases for a template',
	},
	'signedUrls.createSignedBase': {
		riskLevel: 'write',
		description: 'Create a signed URL base for a template',
	},
	'webhooksApi.get': {
		riskLevel: 'read',
		description: 'Get a webhook by UID',
	},
	'webhooksApi.create': {
		riskLevel: 'write',
		description: 'Create a project-level webhook',
	},
	'webhooksApi.delete': {
		riskLevel: 'write',
		description: 'Delete a webhook by UID',
	},
	'misc.getFonts': {
		riskLevel: 'read',
		description: 'Get all available fonts',
	},
	'misc.listEffects': {
		riskLevel: 'read',
		description: 'List all available image effects',
	},
	'misc.joinPdfs': {
		riskLevel: 'write',
		description: 'Merge multiple PDF files into one',
	},
	'workflows.listWorkflows': {
		riskLevel: 'read',
		description: 'List all workflows in the workspace',
	},
	'workflows.getWorkflow': {
		riskLevel: 'read',
		description: 'Get a workflow by UID',
	},
	'workflows.createWorkflowRun': {
		riskLevel: 'write',
		description: 'Run a workflow with inputs',
	},
	'workflows.getWorkflowRun': {
		riskLevel: 'read',
		description: 'Get a workflow run by UID',
	},
	'workflows.listWorkflowRuns': {
		riskLevel: 'read',
		description: 'List all workflow runs',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof bannerbearEndpointsNested
>;

export const bannerbearAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBannerbearPlugin<T extends BannerbearPluginOptions> =
	CorsairPlugin<
		'bannerbear',
		typeof BannerbearSchema,
		typeof bannerbearEndpointsNested,
		typeof bannerbearWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBannerbearPlugin =
	BaseBannerbearPlugin<BannerbearPluginOptions>;

export type ExternalBannerbearPlugin<T extends BannerbearPluginOptions> =
	BaseBannerbearPlugin<T>;

export function bannerbear<const T extends BannerbearPluginOptions>(
	incomingOptions: BannerbearPluginOptions & T = {} as BannerbearPluginOptions &
		T,
): ExternalBannerbearPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bannerbear',
		authConfig: bannerbearAuthConfig,
		schema: BannerbearSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bannerbearEndpointsNested,
		webhooks: bannerbearWebhooksNested,
		endpointMeta: bannerbearEndpointMeta,
		endpointSchemas: bannerbearEndpointSchemas,
		webhookSchemas: bannerbearWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// Bannerbear webhooks are identified by having a uid field in the body
			// and coming from Bannerbear's servers. There's no signature header.
			// We check for the presence of the body having uid + status fields.
			if ('x-bannerbear-signature' in headers) return true;
			// Fallback: check body structure for Bannerbear-like payloads
			const body =
				typeof request.body === 'string'
					? (() => {
							try {
								return JSON.parse(request.body);
							} catch {
								return null;
							}
						})()
					: request.body;
			return (
				body !== null &&
				typeof body === 'object' &&
				'uid' in body &&
				'status' in body
			);
		},
		pluginTenantWebhookMatcher: matchBannerbearTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BannerbearKeyBuilderContext, source) => {
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

			return '';
		},
	} satisfies InternalBannerbearPlugin;
}

export type {
	BannerbearEndpointInputs,
	BannerbearEndpointOutputs,
	CreateProjectInput,
	CreateProjectResponse,
	CreateSignedBaseInput,
	CreateSignedBaseResponse,
	CreateTemplateInput,
	CreateTemplateResponse,
	CreateTemplateSetInput,
	CreateTemplateSetResponse,
	CreateVideoTemplateInput,
	CreateVideoTemplateResponse,
	CreateWebhookInput,
	CreateWebhookResponse,
	CreateWorkflowRunInput,
	CreateWorkflowRunResponse,
	DeleteTemplateInput,
	DeleteTemplateResponse,
	DeleteWebhookInput,
	DeleteWebhookResponse,
	GetAccountInfoInput,
	GetAccountInfoResponse,
	GetAnimatedGifInput,
	GetAnimatedGifResponse,
	GetAuthInput,
	GetAuthResponse,
	GetFontsInput,
	GetFontsResponse,
	GetImageInput,
	GetImageResponse,
	GetProjectInput,
	GetProjectResponse,
	GetScreenshotInput,
	GetScreenshotResponse,
	GetSignedBasesInput,
	GetSignedBasesResponse,
	GetTemplateInput,
	GetTemplateResponse,
	GetTemplateSetInput,
	GetTemplateSetResponse,
	GetWebhookInput,
	GetWebhookResponse,
	GetWorkflowInput,
	GetWorkflowResponse,
	GetWorkflowRunInput,
	GetWorkflowRunResponse,
	HydrateProjectInput,
	HydrateProjectResponse,
	ImportTemplateInput,
	ImportTemplateResponse,
	JoinPdfsInput,
	JoinPdfsResponse,
	ListAnimatedGifsInput,
	ListAnimatedGifsResponse,
	ListCollectionsInput,
	ListCollectionsResponse,
	ListEffectsInput,
	ListEffectsResponse,
	ListImagesInput,
	ListImagesResponse,
	ListProjectsInput,
	ListProjectsResponse,
	ListScreenshotsInput,
	ListScreenshotsResponse,
	ListTemplateSetsInput,
	ListTemplateSetsResponse,
	ListTemplatesInput,
	ListTemplatesResponse,
	ListVideosInput,
	ListVideosResponse,
	ListVideoTemplatesInput,
	ListVideoTemplatesResponse,
	ListWorkflowRunsInput,
	ListWorkflowRunsResponse,
	ListWorkflowsInput,
	ListWorkflowsResponse,
	UpdateTemplateSetInput,
	UpdateTemplateSetResponse,
} from './endpoints/types';
export type {
	BannerbearWebhookOutputs,
	ImageCompletedEvent,
	VideoCompletedEvent,
} from './webhooks/types';
