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
} from 'corsair/core';
import {
	Forms,
	Images,
	Me,
	Responses,
	Themes,
	Videos,
	WebhooksConfig,
	Workspaces,
} from './endpoints';
import type {
	TypeformEndpointInputs,
	TypeformEndpointOutputs,
} from './endpoints/types';
import {
	TypeformEndpointInputSchemas,
	TypeformEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TypeformSchema } from './schema';
import { FormWebhooks } from './webhooks';
import type {
	TypeformFormResponseEvent,
	TypeformWebhookOutputs,
} from './webhooks/types';
import {
	TypeformFormResponseEventSchema,
	TypeformFormResponsePayloadSchema,
} from './webhooks/types';

// ── Context & Key Builder ─────────────────────────────────────────────────────

export type TypeformContext = CorsairPluginContext<
	typeof TypeformSchema,
	TypeformPluginOptions
>;

export type TypeformKeyBuilderContext =
	KeyBuilderContext<TypeformPluginOptions>;

// ── Endpoint Types ────────────────────────────────────────────────────────────

type TypeformEndpoint<K extends keyof TypeformEndpointOutputs> =
	CorsairEndpoint<
		TypeformContext,
		TypeformEndpointInputs[K],
		TypeformEndpointOutputs[K]
	>;

export type TypeformEndpoints = {
	meGet: TypeformEndpoint<'meGet'>;
	formsList: TypeformEndpoint<'formsList'>;
	formsGet: TypeformEndpoint<'formsGet'>;
	formsCreate: TypeformEndpoint<'formsCreate'>;
	formsUpdate: TypeformEndpoint<'formsUpdate'>;
	formsPatch: TypeformEndpoint<'formsPatch'>;
	formsDelete: TypeformEndpoint<'formsDelete'>;
	formsGetMessages: TypeformEndpoint<'formsGetMessages'>;
	formsUpdateMessages: TypeformEndpoint<'formsUpdateMessages'>;
	responsesList: TypeformEndpoint<'responsesList'>;
	responsesDelete: TypeformEndpoint<'responsesDelete'>;
	responsesGetAllFiles: TypeformEndpoint<'responsesGetAllFiles'>;
	workspacesList: TypeformEndpoint<'workspacesList'>;
	workspacesGet: TypeformEndpoint<'workspacesGet'>;
	workspacesCreate: TypeformEndpoint<'workspacesCreate'>;
	workspacesCreateForAccount: TypeformEndpoint<'workspacesCreateForAccount'>;
	workspacesUpdate: TypeformEndpoint<'workspacesUpdate'>;
	workspacesDelete: TypeformEndpoint<'workspacesDelete'>;
	imagesList: TypeformEndpoint<'imagesList'>;
	imagesCreate: TypeformEndpoint<'imagesCreate'>;
	imagesDelete: TypeformEndpoint<'imagesDelete'>;
	imagesGetBySize: TypeformEndpoint<'imagesGetBySize'>;
	imagesGetBackgroundBySize: TypeformEndpoint<'imagesGetBackgroundBySize'>;
	imagesGetChoiceImageBySize: TypeformEndpoint<'imagesGetChoiceImageBySize'>;
	themesList: TypeformEndpoint<'themesList'>;
	themesGet: TypeformEndpoint<'themesGet'>;
	themesCreate: TypeformEndpoint<'themesCreate'>;
	themesUpdate: TypeformEndpoint<'themesUpdate'>;
	themesPatch: TypeformEndpoint<'themesPatch'>;
	themesDelete: TypeformEndpoint<'themesDelete'>;
	webhooksConfigList: TypeformEndpoint<'webhooksConfigList'>;
	webhooksConfigGet: TypeformEndpoint<'webhooksConfigGet'>;
	webhooksConfigCreateOrUpdate: TypeformEndpoint<'webhooksConfigCreateOrUpdate'>;
	webhooksConfigDelete: TypeformEndpoint<'webhooksConfigDelete'>;
	videosUpload: TypeformEndpoint<'videosUpload'>;
};

export type TypeformBoundEndpoints = BindEndpoints<
	typeof typeformEndpointsNested
>;

// ── Webhook Types ─────────────────────────────────────────────────────────────

type TypeformWebhook<
	K extends keyof TypeformWebhookOutputs,
	TEvent,
> = CorsairWebhook<TypeformContext, TEvent, TypeformWebhookOutputs[K]>;

export type TypeformWebhooks = {
	formResponse: TypeformWebhook<'formResponse', TypeformFormResponseEvent>;
};

export type TypeformBoundWebhooks = BindWebhooks<TypeformWebhooks>;

// ── Plugin Options ────────────────────────────────────────────────────────────

export type TypeformPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Optional access token (overrides key manager) */
	key?: string;
	/** Optional webhook secret for signature verification */
	webhookSecret?: string;
	hooks?: InternalTypeformPlugin['hooks'];
	webhookHooks?: InternalTypeformPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Typeform plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Typeform endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof typeformEndpointsNested>;
};

// ── Nested Structures ─────────────────────────────────────────────────────────

const typeformEndpointsNested = {
	me: {
		get: Me.get,
	},
	forms: {
		list: Forms.list,
		get: Forms.get,
		create: Forms.create,
		update: Forms.update,
		patch: Forms.patch,
		delete: Forms.delete,
		getMessages: Forms.getMessages,
		updateMessages: Forms.updateMessages,
	},
	responses: {
		list: Responses.list,
		delete: Responses.delete,
		getAllFiles: Responses.getAllFiles,
	},
	workspaces: {
		list: Workspaces.list,
		get: Workspaces.get,
		create: Workspaces.create,
		createForAccount: Workspaces.createForAccount,
		update: Workspaces.update,
		delete: Workspaces.delete,
	},
	images: {
		list: Images.list,
		create: Images.create,
		delete: Images.delete,
		getBySize: Images.getBySize,
		getBackgroundBySize: Images.getBackgroundBySize,
		getChoiceImageBySize: Images.getChoiceImageBySize,
	},
	themes: {
		list: Themes.list,
		get: Themes.get,
		create: Themes.create,
		update: Themes.update,
		patch: Themes.patch,
		delete: Themes.delete,
	},
	webhooksConfig: {
		list: WebhooksConfig.list,
		get: WebhooksConfig.get,
		createOrUpdate: WebhooksConfig.createOrUpdate,
		delete: WebhooksConfig.delete,
	},
	videos: {
		upload: Videos.upload,
	},
} as const;

const typeformWebhooksNested = {
	forms: {
		formResponse: FormWebhooks.formResponse,
	},
} as const;

// ── Endpoint Schemas ──────────────────────────────────────────────────────────

export const typeformEndpointSchemas = {
	'me.get': {
		input: TypeformEndpointInputSchemas.meGet,
		output: TypeformEndpointOutputSchemas.meGet,
	},
	'forms.list': {
		input: TypeformEndpointInputSchemas.formsList,
		output: TypeformEndpointOutputSchemas.formsList,
	},
	'forms.get': {
		input: TypeformEndpointInputSchemas.formsGet,
		output: TypeformEndpointOutputSchemas.formsGet,
	},
	'forms.create': {
		input: TypeformEndpointInputSchemas.formsCreate,
		output: TypeformEndpointOutputSchemas.formsCreate,
	},
	'forms.update': {
		input: TypeformEndpointInputSchemas.formsUpdate,
		output: TypeformEndpointOutputSchemas.formsUpdate,
	},
	'forms.patch': {
		input: TypeformEndpointInputSchemas.formsPatch,
		output: TypeformEndpointOutputSchemas.formsPatch,
	},
	'forms.delete': {
		input: TypeformEndpointInputSchemas.formsDelete,
		output: TypeformEndpointOutputSchemas.formsDelete,
	},
	'forms.getMessages': {
		input: TypeformEndpointInputSchemas.formsGetMessages,
		output: TypeformEndpointOutputSchemas.formsGetMessages,
	},
	'forms.updateMessages': {
		input: TypeformEndpointInputSchemas.formsUpdateMessages,
		output: TypeformEndpointOutputSchemas.formsUpdateMessages,
	},
	'responses.list': {
		input: TypeformEndpointInputSchemas.responsesList,
		output: TypeformEndpointOutputSchemas.responsesList,
	},
	'responses.delete': {
		input: TypeformEndpointInputSchemas.responsesDelete,
		output: TypeformEndpointOutputSchemas.responsesDelete,
	},
	'responses.getAllFiles': {
		input: TypeformEndpointInputSchemas.responsesGetAllFiles,
		output: TypeformEndpointOutputSchemas.responsesGetAllFiles,
	},
	'workspaces.list': {
		input: TypeformEndpointInputSchemas.workspacesList,
		output: TypeformEndpointOutputSchemas.workspacesList,
	},
	'workspaces.get': {
		input: TypeformEndpointInputSchemas.workspacesGet,
		output: TypeformEndpointOutputSchemas.workspacesGet,
	},
	'workspaces.create': {
		input: TypeformEndpointInputSchemas.workspacesCreate,
		output: TypeformEndpointOutputSchemas.workspacesCreate,
	},
	'workspaces.createForAccount': {
		input: TypeformEndpointInputSchemas.workspacesCreateForAccount,
		output: TypeformEndpointOutputSchemas.workspacesCreateForAccount,
	},
	'workspaces.update': {
		input: TypeformEndpointInputSchemas.workspacesUpdate,
		output: TypeformEndpointOutputSchemas.workspacesUpdate,
	},
	'workspaces.delete': {
		input: TypeformEndpointInputSchemas.workspacesDelete,
		output: TypeformEndpointOutputSchemas.workspacesDelete,
	},
	'images.list': {
		input: TypeformEndpointInputSchemas.imagesList,
		output: TypeformEndpointOutputSchemas.imagesList,
	},
	'images.create': {
		input: TypeformEndpointInputSchemas.imagesCreate,
		output: TypeformEndpointOutputSchemas.imagesCreate,
	},
	'images.delete': {
		input: TypeformEndpointInputSchemas.imagesDelete,
		output: TypeformEndpointOutputSchemas.imagesDelete,
	},
	'images.getBySize': {
		input: TypeformEndpointInputSchemas.imagesGetBySize,
		output: TypeformEndpointOutputSchemas.imagesGetBySize,
	},
	'images.getBackgroundBySize': {
		input: TypeformEndpointInputSchemas.imagesGetBackgroundBySize,
		output: TypeformEndpointOutputSchemas.imagesGetBackgroundBySize,
	},
	'images.getChoiceImageBySize': {
		input: TypeformEndpointInputSchemas.imagesGetChoiceImageBySize,
		output: TypeformEndpointOutputSchemas.imagesGetChoiceImageBySize,
	},
	'themes.list': {
		input: TypeformEndpointInputSchemas.themesList,
		output: TypeformEndpointOutputSchemas.themesList,
	},
	'themes.get': {
		input: TypeformEndpointInputSchemas.themesGet,
		output: TypeformEndpointOutputSchemas.themesGet,
	},
	'themes.create': {
		input: TypeformEndpointInputSchemas.themesCreate,
		output: TypeformEndpointOutputSchemas.themesCreate,
	},
	'themes.update': {
		input: TypeformEndpointInputSchemas.themesUpdate,
		output: TypeformEndpointOutputSchemas.themesUpdate,
	},
	'themes.patch': {
		input: TypeformEndpointInputSchemas.themesPatch,
		output: TypeformEndpointOutputSchemas.themesPatch,
	},
	'themes.delete': {
		input: TypeformEndpointInputSchemas.themesDelete,
		output: TypeformEndpointOutputSchemas.themesDelete,
	},
	'webhooksConfig.list': {
		input: TypeformEndpointInputSchemas.webhooksConfigList,
		output: TypeformEndpointOutputSchemas.webhooksConfigList,
	},
	'webhooksConfig.get': {
		input: TypeformEndpointInputSchemas.webhooksConfigGet,
		output: TypeformEndpointOutputSchemas.webhooksConfigGet,
	},
	'webhooksConfig.createOrUpdate': {
		input: TypeformEndpointInputSchemas.webhooksConfigCreateOrUpdate,
		output: TypeformEndpointOutputSchemas.webhooksConfigCreateOrUpdate,
	},
	'webhooksConfig.delete': {
		input: TypeformEndpointInputSchemas.webhooksConfigDelete,
		output: TypeformEndpointOutputSchemas.webhooksConfigDelete,
	},
	'videos.upload': {
		input: TypeformEndpointInputSchemas.videosUpload,
		output: TypeformEndpointOutputSchemas.videosUpload,
	},
} as const;

// ── Endpoint Meta ─────────────────────────────────────────────────────────────

const typeformEndpointMeta = {
	'me.get': {
		riskLevel: 'read',
		description: 'Get information about the authenticated Typeform account',
	},
	'forms.list': {
		riskLevel: 'read',
		description: 'List all forms in the account',
	},
	'forms.get': { riskLevel: 'read', description: 'Get a form by ID' },
	'forms.create': { riskLevel: 'write', description: 'Create a new form' },
	'forms.update': {
		riskLevel: 'write',
		description: 'Replace a form with a new version (PUT)',
	},
	'forms.patch': {
		riskLevel: 'write',
		description: 'Partially update a form using JSON Patch operations',
	},
	'forms.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a form [DESTRUCTIVE]',
	},
	'forms.getMessages': {
		riskLevel: 'read',
		description: 'Get custom messages for a form',
	},
	'forms.updateMessages': {
		riskLevel: 'write',
		description: 'Update custom messages for a form',
	},
	'responses.list': {
		riskLevel: 'read',
		description: 'List responses submitted to a form',
	},
	'responses.delete': {
		riskLevel: 'destructive',
		description: 'Delete specific responses from a form [DESTRUCTIVE]',
	},
	'responses.getAllFiles': {
		riskLevel: 'read',
		description: 'Get a ZIP archive of all files uploaded in responses',
	},
	'workspaces.list': { riskLevel: 'read', description: 'List all workspaces' },
	'workspaces.get': { riskLevel: 'read', description: 'Get a workspace by ID' },
	'workspaces.create': {
		riskLevel: 'write',
		description: 'Create a new workspace',
	},
	'workspaces.createForAccount': {
		riskLevel: 'write',
		description: 'Create a new workspace within a specific account',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Update a workspace using JSON Patch operations',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a workspace [DESTRUCTIVE]',
	},
	'images.list': {
		riskLevel: 'read',
		description: 'List all images in the account',
	},
	'images.create': { riskLevel: 'write', description: 'Upload a new image' },
	'images.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an image [DESTRUCTIVE]',
	},
	'images.getBySize': {
		riskLevel: 'read',
		description: 'Get an image at a specific size',
	},
	'images.getBackgroundBySize': {
		riskLevel: 'read',
		description: 'Get a background image at a specific size',
	},
	'images.getChoiceImageBySize': {
		riskLevel: 'read',
		description: 'Get a choice image at a specific size',
	},
	'themes.list': { riskLevel: 'read', description: 'List all themes' },
	'themes.get': { riskLevel: 'read', description: 'Get a theme by ID' },
	'themes.create': { riskLevel: 'write', description: 'Create a new theme' },
	'themes.update': {
		riskLevel: 'write',
		description: 'Replace a theme with a new version (PUT)',
	},
	'themes.patch': {
		riskLevel: 'write',
		description: 'Partially update a theme',
	},
	'themes.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a theme [DESTRUCTIVE]',
	},
	'webhooksConfig.list': {
		riskLevel: 'read',
		description: 'List all webhook configurations for a form',
	},
	'webhooksConfig.get': {
		riskLevel: 'read',
		description: 'Get a webhook configuration by tag',
	},
	'webhooksConfig.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create or update a webhook configuration',
	},
	'webhooksConfig.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook configuration [DESTRUCTIVE]',
	},
	'videos.upload': {
		riskLevel: 'write',
		description: 'Get a signed URL to upload a video for a form field',
	},
} satisfies RequiredPluginEndpointMeta<typeof typeformEndpointsNested>;

// ── Webhook Schemas ───────────────────────────────────────────────────────────

const typeformWebhookSchemas = {
	'forms.formResponse': {
		description:
			'A form was submitted — Typeform delivers the full response payload',
		payload: TypeformFormResponsePayloadSchema,
		response: TypeformFormResponseEventSchema,
	},
} as const;

// ── Auth Config ───────────────────────────────────────────────────────────────

export const typeformAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

// ── Plugin Factory ────────────────────────────────────────────────────────────

export type BaseTypeformPlugin<T extends TypeformPluginOptions> = CorsairPlugin<
	'typeform',
	typeof TypeformSchema,
	typeof typeformEndpointsNested,
	typeof typeformWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTypeformPlugin = BaseTypeformPlugin<TypeformPluginOptions>;

export type ExternalTypeformPlugin<T extends TypeformPluginOptions> =
	BaseTypeformPlugin<T>;

export function typeform<const T extends TypeformPluginOptions>(
	incomingOptions: TypeformPluginOptions & T = {} as TypeformPluginOptions & T,
): ExternalTypeformPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'typeform',
		schema: TypeformSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: typeformEndpointsNested,
		webhooks: typeformWebhooksNested,
		endpointMeta: typeformEndpointMeta,
		endpointSchemas: typeformEndpointSchemas,
		webhookSchemas: typeformWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'typeform-signature' in headers || 'Typeform-Signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TypeformKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) return '';
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) return '';
				return res;
			}

			return '';
		},
	} satisfies InternalTypeformPlugin;
}

// ── Webhook Type Exports ──────────────────────────────────────────────────────

export type {
	TypeformFormResponseData,
	TypeformFormResponseEvent,
	TypeformWebhookOutputs,
	TypeformWebhookPayload,
} from './webhooks/types';

// ── Endpoint Type Exports ─────────────────────────────────────────────────────

export type {
	FormsCreateInput,
	FormsCreateResponse,
	FormsDeleteInput,
	FormsDeleteResponse,
	FormsGetInput,
	FormsGetMessagesInput,
	FormsGetMessagesResponse,
	FormsGetResponse,
	FormsListInput,
	FormsListResponse,
	FormsPatchInput,
	FormsPatchResponse,
	FormsUpdateInput,
	FormsUpdateMessagesInput,
	FormsUpdateMessagesResponse,
	FormsUpdateResponse,
	ImagesCreateInput,
	ImagesCreateResponse,
	ImagesDeleteInput,
	ImagesDeleteResponse,
	ImagesGetBackgroundBySizeInput,
	ImagesGetBackgroundBySizeResponse,
	ImagesGetBySizeInput,
	ImagesGetBySizeResponse,
	ImagesGetChoiceImageBySizeInput,
	ImagesGetChoiceImageBySizeResponse,
	ImagesListInput,
	ImagesListResponse,
	MeGetInput,
	MeGetResponse,
	ResponsesDeleteInput,
	ResponsesDeleteResponse,
	ResponsesGetAllFilesInput,
	ResponsesGetAllFilesResponse,
	ResponsesListInput,
	ResponsesListResponse,
	ThemesCreateInput,
	ThemesCreateResponse,
	ThemesDeleteInput,
	ThemesDeleteResponse,
	ThemesGetInput,
	ThemesGetResponse,
	ThemesListInput,
	ThemesListResponse,
	ThemesPatchInput,
	ThemesPatchResponse,
	ThemesUpdateInput,
	ThemesUpdateResponse,
	TypeformEndpointInputs,
	TypeformEndpointOutputs,
	VideosUploadInput,
	VideosUploadResponse,
	WebhooksConfigCreateOrUpdateInput,
	WebhooksConfigCreateOrUpdateResponse,
	WebhooksConfigDeleteInput,
	WebhooksConfigDeleteResponse,
	WebhooksConfigGetInput,
	WebhooksConfigGetResponse,
	WebhooksConfigListInput,
	WebhooksConfigListResponse,
	WorkspacesCreateForAccountInput,
	WorkspacesCreateForAccountResponse,
	WorkspacesCreateInput,
	WorkspacesCreateResponse,
	WorkspacesDeleteInput,
	WorkspacesDeleteResponse,
	WorkspacesGetInput,
	WorkspacesGetResponse,
	WorkspacesListInput,
	WorkspacesListResponse,
	WorkspacesUpdateInput,
	WorkspacesUpdateResponse,
} from './endpoints/types';
