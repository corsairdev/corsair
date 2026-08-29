import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Media, Templates, Webhooks, Workspaces } from './endpoints';
import type {
	DynapicturesEndpointInputs,
	DynapicturesEndpointOutputs,
} from './endpoints/types';
import {
	CreateWorkspaceInputSchema,
	DeleteWorkspaceInputSchema,
	DynapicturesEndpointInputSchemas,
	DynapicturesEndpointOutputSchemas,
	ListTemplatesInputSchema,
	ListWorkspacesInputSchema,
	UnsubscribeWebhookInputSchema,
	UpdateWorkspaceInputSchema,
	UploadMediaAssetInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DynapicturesSchema } from './schema';
import { resolveDynapicturesOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDynapicturesTenantWebhook } from './webhooks/tenant-matcher';

// ── Tool Operation Definitions ───────────────────────────────────────────────

export const DYNAPICTURES_CREATE_WORKSPACE = {
	id: 'DYNAPICTURES_CREATE_WORKSPACE',
	name: 'Create Workspace',
	description: 'Create a new DynaPictures workspace',
	method: 'POST',
	path: '/workspaces',
	parameters: CreateWorkspaceInputSchema,
	schema: CreateWorkspaceInputSchema,
} as const;

export const DYNAPICTURES_DELETE_WORKSPACE = {
	id: 'DYNAPICTURES_DELETE_WORKSPACE',
	name: 'Delete Workspace',
	description: 'Delete a DynaPictures workspace by ID',
	method: 'DELETE',
	path: '/workspaces/:workspaceId',
	parameters: DeleteWorkspaceInputSchema,
	schema: DeleteWorkspaceInputSchema,
} as const;

export const DYNAPICTURES_LIST_TEMPLATES = {
	id: 'DYNAPICTURES_LIST_TEMPLATES',
	name: 'List Templates',
	description: 'List DynaPictures templates with optional workspace ID filter',
	method: 'GET',
	path: '/templates',
	parameters: ListTemplatesInputSchema,
	schema: ListTemplatesInputSchema,
} as const;

export const DYNAPICTURES_LIST_WORKSPACES = {
	id: 'DYNAPICTURES_LIST_WORKSPACES',
	name: 'List Workspaces',
	description: 'List all DynaPictures workspaces',
	method: 'GET',
	path: '/workspaces',
	parameters: ListWorkspacesInputSchema,
	schema: ListWorkspacesInputSchema,
} as const;

export const DYNAPICTURES_UNSUBSCRIBE_WEBHOOK = {
	id: 'DYNAPICTURES_UNSUBSCRIBE_WEBHOOK',
	name: 'Unsubscribe Webhook',
	description: 'Unsubscribe a webhook URL from DynaPictures events',
	method: 'DELETE',
	path: '/hooks',
	parameters: UnsubscribeWebhookInputSchema,
	schema: UnsubscribeWebhookInputSchema,
} as const;

export const DYNAPICTURES_UPDATE_WORKSPACE = {
	id: 'DYNAPICTURES_UPDATE_WORKSPACE',
	name: 'Update Workspace',
	description: 'Update a DynaPictures workspace by ID',
	method: 'PUT',
	path: '/workspaces/:workspaceId',
	parameters: UpdateWorkspaceInputSchema,
	schema: UpdateWorkspaceInputSchema,
} as const;

export const DYNAPICTURES_UPLOAD_MEDIA_ASSET = {
	id: 'DYNAPICTURES_UPLOAD_MEDIA_ASSET',
	name: 'Upload Media Asset',
	description: 'Upload a media asset via image URL to DynaPictures',
	method: 'POST',
	path: '/media',
	parameters: UploadMediaAssetInputSchema,
	schema: UploadMediaAssetInputSchema,
} as const;

export const DYNAPICTURES_TOOLS = {
	DYNAPICTURES_CREATE_WORKSPACE,
	DYNAPICTURES_DELETE_WORKSPACE,
	DYNAPICTURES_LIST_TEMPLATES,
	DYNAPICTURES_LIST_WORKSPACES,
	DYNAPICTURES_UNSUBSCRIBE_WEBHOOK,
	DYNAPICTURES_UPDATE_WORKSPACE,
	DYNAPICTURES_UPLOAD_MEDIA_ASSET,
} as const;

export const dynapicturesAuth = {
	type: 'apiKey',
	header: 'Authorization',
	prefix: 'Bearer ',
} as const;

export type DynapicturesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDynapicturesPlugin['hooks'];
	webhookHooks?: InternalDynapicturesPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dynapicturesEndpointsNested>;
};

export type DynapicturesContext = CorsairPluginContext<
	typeof DynapicturesSchema,
	DynapicturesPluginOptions
>;

export type DynapicturesKeyBuilderContext =
	KeyBuilderContext<DynapicturesPluginOptions>;

export type DynapicturesBoundEndpoints = BindEndpoints<
	typeof dynapicturesEndpointsNested
>;

type DynapicturesEndpoint<K extends keyof DynapicturesEndpointOutputs> =
	CorsairEndpoint<
		DynapicturesContext,
		DynapicturesEndpointInputs[K],
		DynapicturesEndpointOutputs[K]
	>;

export type DynapicturesEndpoints = {
	createWorkspace: DynapicturesEndpoint<'createWorkspace'>;
	deleteWorkspace: DynapicturesEndpoint<'deleteWorkspace'>;
	listTemplates: DynapicturesEndpoint<'listTemplates'>;
	listWorkspaces: DynapicturesEndpoint<'listWorkspaces'>;
	unsubscribeWebhook: DynapicturesEndpoint<'unsubscribeWebhook'>;
	updateWorkspace: DynapicturesEndpoint<'updateWorkspace'>;
	uploadMediaAsset: DynapicturesEndpoint<'uploadMediaAsset'>;
};

export type DynapicturesBoundWebhooks = BindWebhooks<Record<string, never>>;

const dynapicturesEndpointsNested = {
	workspaces: {
		create: Workspaces.create,
		delete: Workspaces.deleteWorkspace,
		list: Workspaces.list,
		update: Workspaces.update,
	},
	templates: {
		list: Templates.list,
	},
	webhooks: {
		unsubscribe: Webhooks.unsubscribe,
	},
	media: {
		upload: Media.upload,
	},
} as const;

const dynapicturesWebhooksNested = {} as const;

export const dynapicturesEndpointSchemas = {
	'workspaces.create': {
		input: DynapicturesEndpointInputSchemas.createWorkspace,
		output: DynapicturesEndpointOutputSchemas.createWorkspace,
	},
	'workspaces.delete': {
		input: DynapicturesEndpointInputSchemas.deleteWorkspace,
		output: DynapicturesEndpointOutputSchemas.deleteWorkspace,
	},
	'templates.list': {
		input: DynapicturesEndpointInputSchemas.listTemplates,
		output: DynapicturesEndpointOutputSchemas.listTemplates,
	},
	'workspaces.list': {
		input: DynapicturesEndpointInputSchemas.listWorkspaces,
		output: DynapicturesEndpointOutputSchemas.listWorkspaces,
	},
	'webhooks.unsubscribe': {
		input: DynapicturesEndpointInputSchemas.unsubscribeWebhook,
		output: DynapicturesEndpointOutputSchemas.unsubscribeWebhook,
	},
	'workspaces.update': {
		input: DynapicturesEndpointInputSchemas.updateWorkspace,
		output: DynapicturesEndpointOutputSchemas.updateWorkspace,
	},
	'media.upload': {
		input: DynapicturesEndpointInputSchemas.uploadMediaAsset,
		output: DynapicturesEndpointOutputSchemas.uploadMediaAsset,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dynapicturesEndpointsNested
>;

const dynapicturesWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof dynapicturesWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dynapicturesEndpointMeta = {
	'workspaces.create': {
		riskLevel: 'write',
		description: 'Create a new DynaPictures workspace',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a DynaPictures workspace [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List DynaPictures templates with optional workspace ID filter',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List all DynaPictures workspaces',
	},
	'webhooks.unsubscribe': {
		riskLevel: 'write',
		description: 'Unsubscribe a webhook endpoint from DynaPictures',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Update an existing DynaPictures workspace',
	},
	'media.upload': {
		riskLevel: 'write',
		description: 'Upload a media asset from a URL to DynaPictures',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dynapicturesEndpointsNested
>;

export const dynapicturesAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	CorsairPlugin<
		'dynapictures',
		typeof DynapicturesSchema,
		typeof dynapicturesEndpointsNested,
		typeof dynapicturesWebhooksNested,
		T,
		typeof defaultAuthType
	> & {
		name: 'DynaPictures';
		auth: typeof dynapicturesAuth;
		tools: typeof DYNAPICTURES_TOOLS;
	};

export type InternalDynapicturesPlugin =
	BaseDynapicturesPlugin<DynapicturesPluginOptions>;

export type ExternalDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	BaseDynapicturesPlugin<T>;

export function dynapictures<const T extends DynapicturesPluginOptions>(
	incomingOptions: DynapicturesPluginOptions &
		T = {} as DynapicturesPluginOptions & T,
): ExternalDynapicturesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dynapictures',
		name: 'DynaPictures',
		auth: dynapicturesAuth,
		tools: DYNAPICTURES_TOOLS,
		authConfig: dynapicturesAuthConfig,
		schema: DynapicturesSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dynapicturesEndpointsNested,
		webhooks: dynapicturesWebhooksNested,
		endpointMeta: dynapicturesEndpointMeta,
		endpointSchemas: dynapicturesEndpointSchemas,
		webhookSchemas: dynapicturesWebhookSchemas,
		pluginWebhookMatcher: undefined,
		pluginTenantWebhookMatcher: matchDynapicturesTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDynapicturesOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DynapicturesKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				if (!res) {
					throw new AuthMissingError('dynapictures', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('dynapictures', 'api_key');
		},
	} satisfies InternalDynapicturesPlugin;
}

export type {
	CreateWorkspaceInput,
	CreateWorkspaceResponse,
	DeleteWorkspaceInput,
	DeleteWorkspaceResponse,
	DynapicturesEndpointInputs,
	DynapicturesEndpointOutputs,
	ListTemplatesInput,
	ListTemplatesResponse,
	ListWorkspacesInput,
	ListWorkspacesResponse,
	UnsubscribeWebhookInput,
	UnsubscribeWebhookResponse,
	UpdateWorkspaceInput,
	UpdateWorkspaceResponse,
	UploadMediaAssetInput,
	UploadMediaAssetResponse,
} from './endpoints/types';
export {
	CreateWorkspaceInputSchema,
	CreateWorkspaceResponseSchema,
	DeleteWorkspaceInputSchema,
	DeleteWorkspaceResponseSchema,
	DynapicturesEndpointInputSchemas,
	DynapicturesEndpointOutputSchemas,
	ListTemplatesInputSchema,
	ListTemplatesResponseSchema,
	ListWorkspacesInputSchema,
	ListWorkspacesResponseSchema,
	UnsubscribeWebhookInputSchema,
	UnsubscribeWebhookResponseSchema,
	UpdateWorkspaceInputSchema,
	UpdateWorkspaceResponseSchema,
	UploadMediaAssetInputSchema,
	UploadMediaAssetResponseSchema,
} from './endpoints/types';
export { DynapicturesSchema } from './schema';
export type { DynapicturesWebhookOutputs } from './webhooks/types';
