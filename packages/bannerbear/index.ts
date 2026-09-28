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
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	Animations,
	AnimationTemplates,
	Images,
	InstantUrls,
	Misc,
	Templates,
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
import { AnimationWebhooks, ImageWebhooks } from './webhooks';
import { matchBannerbearTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AnimationCompletedEvent,
	BannerbearWebhookOutputs,
	ImageCompletedEvent,
} from './webhooks/types';
import {
	AnimationCompletedEventSchema,
	ImageCompletedEventSchema,
	isBannerbearCompletionPayload,
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
	getAccountInfo: BannerbearEndpoint<'getAccountInfo'>;
	getAuth: BannerbearEndpoint<'getAuth'>;
	listTemplates: BannerbearEndpoint<'listTemplates'>;
	getTemplate: BannerbearEndpoint<'getTemplate'>;
	createTemplate: BannerbearEndpoint<'createTemplate'>;
	deleteTemplate: BannerbearEndpoint<'deleteTemplate'>;
	importTemplate: BannerbearEndpoint<'importTemplate'>;
	listImages: BannerbearEndpoint<'listImages'>;
	getImage: BannerbearEndpoint<'getImage'>;
	createImage: BannerbearEndpoint<'createImage'>;
	listAnimations: BannerbearEndpoint<'listAnimations'>;
	getAnimation: BannerbearEndpoint<'getAnimation'>;
	createAnimation: BannerbearEndpoint<'createAnimation'>;
	listAnimationTemplates: BannerbearEndpoint<'listAnimationTemplates'>;
	getAnimationTemplate: BannerbearEndpoint<'getAnimationTemplate'>;
	createAnimationTemplate: BannerbearEndpoint<'createAnimationTemplate'>;
	listInstantUrls: BannerbearEndpoint<'listInstantUrls'>;
	createInstantUrl: BannerbearEndpoint<'createInstantUrl'>;
	getWebhook: BannerbearEndpoint<'getWebhook'>;
	createWebhook: BannerbearEndpoint<'createWebhook'>;
	deleteWebhook: BannerbearEndpoint<'deleteWebhook'>;
	joinPdfs: BannerbearEndpoint<'joinPdfs'>;
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
	animationCompleted: BannerbearWebhook<
		'animationCompleted',
		AnimationCompletedEvent
	>;
};

export type BannerbearBoundWebhooks = BindWebhooks<BannerbearWebhooks>;

const bannerbearEndpointsNested = {
	account: {
		getAccountInfo: Account.getAccountInfo,
		getAuth: Account.getAuth,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		delete: Templates.deleteTemplate,
		import: Templates.importTemplate,
	},
	images: {
		list: Images.list,
		get: Images.get,
		create: Images.create,
	},
	animations: {
		list: Animations.list,
		get: Animations.get,
		create: Animations.create,
	},
	animationTemplates: {
		list: AnimationTemplates.list,
		get: AnimationTemplates.get,
		create: AnimationTemplates.create,
	},
	instantUrls: {
		list: InstantUrls.list,
		create: InstantUrls.create,
	},
	webhooksApi: {
		get: WebhooksApi.get,
		create: WebhooksApi.create,
		delete: WebhooksApi.deleteWebhook,
	},
	misc: {
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
	animation: {
		animationCompleted: AnimationWebhooks.animationCompleted,
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
	'images.list': {
		input: BannerbearEndpointInputSchemas.listImages,
		output: BannerbearEndpointOutputSchemas.listImages,
	},
	'images.get': {
		input: BannerbearEndpointInputSchemas.getImage,
		output: BannerbearEndpointOutputSchemas.getImage,
	},
	'images.create': {
		input: BannerbearEndpointInputSchemas.createImage,
		output: BannerbearEndpointOutputSchemas.createImage,
	},
	'animations.list': {
		input: BannerbearEndpointInputSchemas.listAnimations,
		output: BannerbearEndpointOutputSchemas.listAnimations,
	},
	'animations.get': {
		input: BannerbearEndpointInputSchemas.getAnimation,
		output: BannerbearEndpointOutputSchemas.getAnimation,
	},
	'animations.create': {
		input: BannerbearEndpointInputSchemas.createAnimation,
		output: BannerbearEndpointOutputSchemas.createAnimation,
	},
	'animationTemplates.list': {
		input: BannerbearEndpointInputSchemas.listAnimationTemplates,
		output: BannerbearEndpointOutputSchemas.listAnimationTemplates,
	},
	'animationTemplates.get': {
		input: BannerbearEndpointInputSchemas.getAnimationTemplate,
		output: BannerbearEndpointOutputSchemas.getAnimationTemplate,
	},
	'animationTemplates.create': {
		input: BannerbearEndpointInputSchemas.createAnimationTemplate,
		output: BannerbearEndpointOutputSchemas.createAnimationTemplate,
	},
	'instantUrls.list': {
		input: BannerbearEndpointInputSchemas.listInstantUrls,
		output: BannerbearEndpointOutputSchemas.listInstantUrls,
	},
	'instantUrls.create': {
		input: BannerbearEndpointInputSchemas.createInstantUrl,
		output: BannerbearEndpointOutputSchemas.createInstantUrl,
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
	'animation.animationCompleted': {
		description: 'Fires when a Bannerbear animation finishes rendering',
		payload: AnimationCompletedEventSchema,
		response: AnimationCompletedEventSchema,
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
		description: 'Verify API authentication against the current account',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List image templates',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get an image template by UID',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create an image template',
	},
	'templates.delete': {
		riskLevel: 'write',
		description: 'Delete an image template by UID',
	},
	'templates.import': {
		riskLevel: 'write',
		description: 'Install a publication as an image template',
	},
	'images.list': {
		riskLevel: 'read',
		description: 'List generated images',
	},
	'images.get': {
		riskLevel: 'read',
		description: 'Get an image by UID',
	},
	'images.create': {
		riskLevel: 'write',
		description: 'Generate an image from a template',
	},
	'animations.list': {
		riskLevel: 'read',
		description: 'List generated animations',
	},
	'animations.get': {
		riskLevel: 'read',
		description: 'Get an animation by UID',
	},
	'animations.create': {
		riskLevel: 'write',
		description: 'Generate an animation from a template',
	},
	'animationTemplates.list': {
		riskLevel: 'read',
		description: 'List animation templates',
	},
	'animationTemplates.get': {
		riskLevel: 'read',
		description: 'Get an animation template by UID',
	},
	'animationTemplates.create': {
		riskLevel: 'write',
		description: 'Create an animation template',
	},
	'instantUrls.list': {
		riskLevel: 'read',
		description: 'List Instant URLs',
	},
	'instantUrls.create': {
		riskLevel: 'write',
		description: 'Create an Instant URL for an image template',
	},
	'webhooksApi.get': {
		riskLevel: 'read',
		description: 'Get a webhook by UID',
	},
	'webhooksApi.create': {
		riskLevel: 'write',
		description: 'Create a webhook',
	},
	'webhooksApi.delete': {
		riskLevel: 'write',
		description: 'Delete a webhook by UID',
	},
	'misc.joinPdfs': {
		riskLevel: 'write',
		description: 'Merge image or PDF URLs into one PDF',
	},
	'workflows.listWorkflows': {
		riskLevel: 'read',
		description: 'List workflows in the workspace',
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
		description: 'List workflow runs',
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
			if ('x-bannerbear-signature' in request.headers) return true;
			if ('x-webhook-signature' in request.headers) return true;
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
			return isBannerbearCompletionPayload(body);
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
				if (!res) {
					throw new AuthMissingError('bannerbear', 'webhook_signature');
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('bannerbear', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('bannerbear', 'api_key');
		},
	} satisfies InternalBannerbearPlugin;
}

export type {
	BannerbearEndpointInputs,
	BannerbearEndpointOutputs,
	CreateAnimationInput,
	CreateAnimationResponse,
	CreateAnimationTemplateInput,
	CreateAnimationTemplateResponse,
	CreateImageInput,
	CreateImageResponse,
	CreateInstantUrlInput,
	CreateInstantUrlResponse,
	CreateTemplateInput,
	CreateTemplateResponse,
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
	GetAnimationInput,
	GetAnimationResponse,
	GetAnimationTemplateInput,
	GetAnimationTemplateResponse,
	GetAuthInput,
	GetAuthResponse,
	GetImageInput,
	GetImageResponse,
	GetTemplateInput,
	GetTemplateResponse,
	GetWebhookInput,
	GetWebhookResponse,
	GetWorkflowInput,
	GetWorkflowResponse,
	GetWorkflowRunInput,
	GetWorkflowRunResponse,
	ImportTemplateInput,
	ImportTemplateResponse,
	JoinPdfsInput,
	JoinPdfsResponse,
	ListAnimationsInput,
	ListAnimationsResponse,
	ListAnimationTemplatesInput,
	ListAnimationTemplatesResponse,
	ListImagesInput,
	ListImagesResponse,
	ListInstantUrlsInput,
	ListInstantUrlsResponse,
	ListTemplatesInput,
	ListTemplatesResponse,
	ListWorkflowRunsInput,
	ListWorkflowRunsResponse,
	ListWorkflowsInput,
	ListWorkflowsResponse,
} from './endpoints/types';
export type {
	AnimationCompletedEvent,
	BannerbearWebhookOutputs,
	ImageCompletedEvent,
} from './webhooks/types';
