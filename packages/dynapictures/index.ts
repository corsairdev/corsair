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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Media, Templates, Webhooks, Workspaces } from './endpoints';
import type {
	DynapicturesEndpointInputs,
	DynapicturesEndpointOutputs,
} from './endpoints/types';
import {
	DynapicturesEndpointInputSchemas,
	DynapicturesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DynapicturesSchema } from './schema';

export type DynapicturesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDynapicturesPlugin['hooks'];
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
	listWorkspaces: DynapicturesEndpoint<'listWorkspaces'>;
	createWorkspace: DynapicturesEndpoint<'createWorkspace'>;
	updateWorkspace: DynapicturesEndpoint<'updateWorkspace'>;
	deleteWorkspace: DynapicturesEndpoint<'deleteWorkspace'>;
	listTemplates: DynapicturesEndpoint<'listTemplates'>;
	unsubscribeWebhook: DynapicturesEndpoint<'unsubscribeWebhook'>;
	uploadMediaAsset: DynapicturesEndpoint<'uploadMediaAsset'>;
};

export type DynapicturesWebhooks = {};

const dynapicturesEndpointsNested = {
	workspaces: {
		list: Workspaces.list,
		create: Workspaces.create,
		update: Workspaces.update,
		delete: Workspaces.delete,
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
	'workspaces.list': {
		input: DynapicturesEndpointInputSchemas.listWorkspaces,
		output: DynapicturesEndpointOutputSchemas.listWorkspaces,
	},
	'workspaces.create': {
		input: DynapicturesEndpointInputSchemas.createWorkspace,
		output: DynapicturesEndpointOutputSchemas.createWorkspace,
	},
	'workspaces.update': {
		input: DynapicturesEndpointInputSchemas.updateWorkspace,
		output: DynapicturesEndpointOutputSchemas.updateWorkspace,
	},
	'workspaces.delete': {
		input: DynapicturesEndpointInputSchemas.deleteWorkspace,
		output: DynapicturesEndpointOutputSchemas.deleteWorkspace,
	},
	'templates.list': {
		input: DynapicturesEndpointInputSchemas.listTemplates,
		output: DynapicturesEndpointOutputSchemas.listTemplates,
	},
	'webhooks.unsubscribe': {
		input: DynapicturesEndpointInputSchemas.unsubscribeWebhook,
		output: DynapicturesEndpointOutputSchemas.unsubscribeWebhook,
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
	'workspaces.list': {
		riskLevel: 'read',
		description: 'Get all workspaces the authenticated user is a member of',
	},
	'workspaces.create': {
		riskLevel: 'write',
		description: 'Create a new workspace for templates, images, and media',
	},
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Update an existing workspace name by workspace ID',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a workspace and all associated templates, media, and images',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'Get image templates that are ready and have Sync to Zapier enabled',
	},
	'webhooks.unsubscribe': {
		riskLevel: 'write',
		description:
			'Unsubscribe from webhook notifications using the original subscribe fields',
	},
	'media.upload': {
		riskLevel: 'write',
		description: 'Upload an image and create a media asset in a workspace',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dynapicturesEndpointsNested
>;

export const dynapicturesAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	CorsairPlugin<
		'dynapictures',
		typeof DynapicturesSchema,
		typeof dynapicturesEndpointsNested,
		typeof dynapicturesWebhooksNested,
		T,
		typeof defaultAuthType
	>;

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
		authConfig: dynapicturesAuthConfig,
		schema: DynapicturesSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: dynapicturesEndpointsNested,
		webhooks: dynapicturesWebhooksNested,
		endpointMeta: dynapicturesEndpointMeta,
		endpointSchemas: dynapicturesEndpointSchemas,
		webhookSchemas: dynapicturesWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DynapicturesKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
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
