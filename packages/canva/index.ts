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
import { Assets, Designs, Exports, Folders, Users } from './endpoints';
import type {
	CanvaEndpointInputs,
	CanvaEndpointOutputs,
} from './endpoints/types';
import {
	CanvaEndpointInputSchemas,
	CanvaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CanvaSchema } from './schema';
import { resolveCanvaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCanvaTenantWebhook } from './webhooks/tenant-matcher';

export type CanvaPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalCanvaPlugin['hooks'];
	webhookHooks?: InternalCanvaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof canvaEndpointsNested>;
};

export type CanvaContext = CorsairPluginContext<
	typeof CanvaSchema,
	CanvaPluginOptions,
	undefined,
	typeof canvaAuthConfig
>;

export type CanvaKeyBuilderContext = KeyBuilderContext<
	CanvaPluginOptions,
	typeof canvaAuthConfig
>;

export type CanvaBoundEndpoints = BindEndpoints<typeof canvaEndpointsNested>;

type CanvaEndpoint<K extends keyof CanvaEndpointOutputs> = CorsairEndpoint<
	CanvaContext,
	CanvaEndpointInputs[K],
	CanvaEndpointOutputs[K]
>;

export type CanvaEndpoints = {
	usersGetMe: CanvaEndpoint<'usersGetMe'>;
	usersGetProfile: CanvaEndpoint<'usersGetProfile'>;
	designsList: CanvaEndpoint<'designsList'>;
	designsGet: CanvaEndpoint<'designsGet'>;
	designsCreate: CanvaEndpoint<'designsCreate'>;
	designsGetPages: CanvaEndpoint<'designsGetPages'>;
	assetsGet: CanvaEndpoint<'assetsGet'>;
	assetsUpdate: CanvaEndpoint<'assetsUpdate'>;
	assetsDelete: CanvaEndpoint<'assetsDelete'>;
	foldersCreate: CanvaEndpoint<'foldersCreate'>;
	foldersGet: CanvaEndpoint<'foldersGet'>;
	foldersUpdate: CanvaEndpoint<'foldersUpdate'>;
	foldersDelete: CanvaEndpoint<'foldersDelete'>;
	foldersListItems: CanvaEndpoint<'foldersListItems'>;
	foldersMoveItem: CanvaEndpoint<'foldersMoveItem'>;
	exportsCreate: CanvaEndpoint<'exportsCreate'>;
	exportsGet: CanvaEndpoint<'exportsGet'>;
};

export type CanvaWebhooks = Record<string, never>;

export type CanvaBoundWebhooks = Record<string, never>;

const canvaEndpointsNested = {
	users: {
		getMe: Users.getMe,
		getProfile: Users.getProfile,
	},
	designs: {
		list: Designs.list,
		get: Designs.get,
		create: Designs.create,
		getPages: Designs.getPages,
	},
	assets: {
		get: Assets.get,
		update: Assets.update,
		delete: Assets.delete,
	},
	folders: {
		create: Folders.create,
		get: Folders.get,
		update: Folders.update,
		delete: Folders.delete,
		listItems: Folders.listItems,
		moveItem: Folders.moveItem,
	},
	exports: {
		create: Exports.create,
		get: Exports.get,
	},
} as const;

const canvaWebhooksNested = {} as const;

export const canvaEndpointSchemas = {
	'users.getMe': {
		input: CanvaEndpointInputSchemas.usersGetMe,
		output: CanvaEndpointOutputSchemas.usersGetMe,
	},
	'users.getProfile': {
		input: CanvaEndpointInputSchemas.usersGetProfile,
		output: CanvaEndpointOutputSchemas.usersGetProfile,
	},
	'designs.list': {
		input: CanvaEndpointInputSchemas.designsList,
		output: CanvaEndpointOutputSchemas.designsList,
	},
	'designs.get': {
		input: CanvaEndpointInputSchemas.designsGet,
		output: CanvaEndpointOutputSchemas.designsGet,
	},
	'designs.create': {
		input: CanvaEndpointInputSchemas.designsCreate,
		output: CanvaEndpointOutputSchemas.designsCreate,
	},
	'designs.getPages': {
		input: CanvaEndpointInputSchemas.designsGetPages,
		output: CanvaEndpointOutputSchemas.designsGetPages,
	},
	'assets.get': {
		input: CanvaEndpointInputSchemas.assetsGet,
		output: CanvaEndpointOutputSchemas.assetsGet,
	},
	'assets.update': {
		input: CanvaEndpointInputSchemas.assetsUpdate,
		output: CanvaEndpointOutputSchemas.assetsUpdate,
	},
	'assets.delete': {
		input: CanvaEndpointInputSchemas.assetsDelete,
		output: CanvaEndpointOutputSchemas.assetsDelete,
	},
	'folders.create': {
		input: CanvaEndpointInputSchemas.foldersCreate,
		output: CanvaEndpointOutputSchemas.foldersCreate,
	},
	'folders.get': {
		input: CanvaEndpointInputSchemas.foldersGet,
		output: CanvaEndpointOutputSchemas.foldersGet,
	},
	'folders.update': {
		input: CanvaEndpointInputSchemas.foldersUpdate,
		output: CanvaEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: CanvaEndpointInputSchemas.foldersDelete,
		output: CanvaEndpointOutputSchemas.foldersDelete,
	},
	'folders.listItems': {
		input: CanvaEndpointInputSchemas.foldersListItems,
		output: CanvaEndpointOutputSchemas.foldersListItems,
	},
	'folders.moveItem': {
		input: CanvaEndpointInputSchemas.foldersMoveItem,
		output: CanvaEndpointOutputSchemas.foldersMoveItem,
	},
	'exports.create': {
		input: CanvaEndpointInputSchemas.exportsCreate,
		output: CanvaEndpointOutputSchemas.exportsCreate,
	},
	'exports.get': {
		input: CanvaEndpointInputSchemas.exportsGet,
		output: CanvaEndpointOutputSchemas.exportsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof canvaEndpointsNested>;

const canvaWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof canvaWebhooksNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const canvaEndpointMeta = {
	'users.getMe': {
		riskLevel: 'read',
		description: 'Get the authenticated user ID and team ID',
	},
	'users.getProfile': {
		riskLevel: 'read',
		description: 'Get the authenticated user profile',
	},
	'designs.list': {
		riskLevel: 'read',
		description: 'List designs in the user projects',
	},
	'designs.get': {
		riskLevel: 'read',
		description: 'Get metadata for a design',
	},
	'designs.create': {
		riskLevel: 'write',
		description: 'Create a new Canva design',
	},
	'designs.getPages': {
		riskLevel: 'read',
		description: 'Get pages for a design',
	},
	'assets.get': {
		riskLevel: 'read',
		description: 'Get metadata for an asset',
	},
	'assets.update': {
		riskLevel: 'write',
		description: 'Update an asset name or tags',
	},
	'assets.delete': {
		riskLevel: 'destructive',
		description: 'Delete an asset [DESTRUCTIVE]',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a folder',
	},
	'folders.get': {
		riskLevel: 'read',
		description: 'Get metadata for a folder',
	},
	'folders.update': {
		riskLevel: 'write',
		description: 'Update a folder name',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a folder [DESTRUCTIVE]',
	},
	'folders.listItems': {
		riskLevel: 'read',
		description: 'List items in a folder',
	},
	'folders.moveItem': {
		riskLevel: 'write',
		description: 'Move an item to another folder',
	},
	'exports.create': {
		riskLevel: 'write',
		description: 'Start a design export job',
	},
	'exports.get': {
		riskLevel: 'read',
		description: 'Get the status of an export job',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof canvaEndpointsNested>;

export const canvaAuthConfig = {
	oauth_2: {
		account: ['user_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCanvaPlugin<T extends CanvaPluginOptions> = CorsairPlugin<
	'canva',
	typeof CanvaSchema,
	typeof canvaEndpointsNested,
	typeof canvaWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof canvaAuthConfig
>;

export type InternalCanvaPlugin = BaseCanvaPlugin<CanvaPluginOptions>;

export type ExternalCanvaPlugin<T extends CanvaPluginOptions> =
	BaseCanvaPlugin<T>;

export function canva<const T extends CanvaPluginOptions>(
	incomingOptions: CanvaPluginOptions & T = {} as CanvaPluginOptions & T,
): ExternalCanvaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'canva',
		authConfig: canvaAuthConfig,
		schema: CanvaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: canvaEndpointsNested,
		webhooks: canvaWebhooksNested,
		endpointMeta: canvaEndpointMeta,
		endpointSchemas: canvaEndpointSchemas,
		webhookSchemas: canvaWebhookSchemas,
		oauthConfig: {
			providerName: 'Canva',
			authUrl: 'https://www.canva.com/api/oauth/authorize',
			tokenUrl: 'https://api.canva.com/rest/v1/oauth/token',
			scopes: [
				'design:meta:read',
				'design:content:read',
				'design:content:write',
				'asset:read',
				'asset:write',
				'folder:read',
				'folder:write',
				'profile:read',
			],
		},
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchCanvaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCanvaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CanvaKeyBuilderContext, source) => {
			if (source === 'webhook') {
				throw new AuthMissingError('canva', 'webhook_signature');
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.get_access_token();

				if (!accessToken) {
					throw new AuthMissingError('canva', 'oauth_2');
				}

				return accessToken;
			}

			throw new AuthMissingError('canva', 'oauth_2');
		},
	} satisfies InternalCanvaPlugin;
}

export type {
	AssetsDeleteResponse,
	AssetsGetResponse,
	AssetsUpdateResponse,
	CanvaEndpointInputs,
	CanvaEndpointOutputs,
	DesignsCreateResponse,
	DesignsGetPagesResponse,
	DesignsGetResponse,
	DesignsListResponse,
	ExportsCreateResponse,
	ExportsGetResponse,
	FoldersCreateResponse,
	FoldersDeleteResponse,
	FoldersGetResponse,
	FoldersListItemsResponse,
	FoldersMoveItemResponse,
	FoldersUpdateResponse,
	UsersGetMeResponse,
	UsersGetProfileResponse,
} from './endpoints/types';

export type { CanvaWebhookOutputs } from './webhooks/types';
