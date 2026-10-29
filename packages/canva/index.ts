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
import {
	Assets,
	AssetUploads,
	Autofills,
	BrandTemplates,
	Comments,
	Designs,
	Exports,
	Folders,
	Imports,
	Resizes,
	Users,
} from './endpoints';
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
	usersGetCapabilities: CanvaEndpoint<'usersGetCapabilities'>;
	designsList: CanvaEndpoint<'designsList'>;
	designsGet: CanvaEndpoint<'designsGet'>;
	designsCreate: CanvaEndpoint<'designsCreate'>;
	designsGetPages: CanvaEndpoint<'designsGetPages'>;
	designsGetExportFormats: CanvaEndpoint<'designsGetExportFormats'>;
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
	brandTemplatesList: CanvaEndpoint<'brandTemplatesList'>;
	brandTemplatesGet: CanvaEndpoint<'brandTemplatesGet'>;
	brandTemplatesGetDataset: CanvaEndpoint<'brandTemplatesGetDataset'>;
	assetUploadsCreate: CanvaEndpoint<'assetUploadsCreate'>;
	assetUploadsGet: CanvaEndpoint<'assetUploadsGet'>;
	assetUploadsCreateFromUrl: CanvaEndpoint<'assetUploadsCreateFromUrl'>;
	assetUploadsGetFromUrl: CanvaEndpoint<'assetUploadsGetFromUrl'>;
	importsCreate: CanvaEndpoint<'importsCreate'>;
	importsGet: CanvaEndpoint<'importsGet'>;
	importsCreateFromUrl: CanvaEndpoint<'importsCreateFromUrl'>;
	importsGetFromUrl: CanvaEndpoint<'importsGetFromUrl'>;
	resizesCreate: CanvaEndpoint<'resizesCreate'>;
	resizesGet: CanvaEndpoint<'resizesGet'>;
	autofillsCreate: CanvaEndpoint<'autofillsCreate'>;
	autofillsGet: CanvaEndpoint<'autofillsGet'>;
	commentsCreateThread: CanvaEndpoint<'commentsCreateThread'>;
	commentsGetThread: CanvaEndpoint<'commentsGetThread'>;
	commentsCreateReply: CanvaEndpoint<'commentsCreateReply'>;
	commentsListReplies: CanvaEndpoint<'commentsListReplies'>;
	commentsGetReply: CanvaEndpoint<'commentsGetReply'>;
};

export type CanvaWebhooks = Record<string, never>;

export type CanvaBoundWebhooks = Record<string, never>;

const canvaEndpointsNested = {
	users: {
		getMe: Users.getMe,
		getProfile: Users.getProfile,
		getCapabilities: Users.getCapabilities,
	},
	designs: {
		list: Designs.list,
		get: Designs.get,
		create: Designs.create,
		getPages: Designs.getPages,
		getExportFormats: Designs.getExportFormats,
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
	brandTemplates: {
		list: BrandTemplates.list,
		get: BrandTemplates.get,
		getDataset: BrandTemplates.getDataset,
	},
	assetUploads: {
		create: AssetUploads.create,
		get: AssetUploads.get,
		createFromUrl: AssetUploads.createFromUrl,
		getFromUrl: AssetUploads.getFromUrl,
	},
	imports: {
		create: Imports.create,
		get: Imports.get,
		createFromUrl: Imports.createFromUrl,
		getFromUrl: Imports.getFromUrl,
	},
	resizes: {
		create: Resizes.create,
		get: Resizes.get,
	},
	autofills: {
		create: Autofills.create,
		get: Autofills.get,
	},
	comments: {
		createThread: Comments.createThread,
		getThread: Comments.getThread,
		createReply: Comments.createReply,
		listReplies: Comments.listReplies,
		getReply: Comments.getReply,
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
	'users.getCapabilities': {
		input: CanvaEndpointInputSchemas.usersGetCapabilities,
		output: CanvaEndpointOutputSchemas.usersGetCapabilities,
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
	'designs.getExportFormats': {
		input: CanvaEndpointInputSchemas.designsGetExportFormats,
		output: CanvaEndpointOutputSchemas.designsGetExportFormats,
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
	'brandTemplates.list': {
		input: CanvaEndpointInputSchemas.brandTemplatesList,
		output: CanvaEndpointOutputSchemas.brandTemplatesList,
	},
	'brandTemplates.get': {
		input: CanvaEndpointInputSchemas.brandTemplatesGet,
		output: CanvaEndpointOutputSchemas.brandTemplatesGet,
	},
	'brandTemplates.getDataset': {
		input: CanvaEndpointInputSchemas.brandTemplatesGetDataset,
		output: CanvaEndpointOutputSchemas.brandTemplatesGetDataset,
	},
	'assetUploads.create': {
		input: CanvaEndpointInputSchemas.assetUploadsCreate,
		output: CanvaEndpointOutputSchemas.assetUploadsCreate,
	},
	'assetUploads.get': {
		input: CanvaEndpointInputSchemas.assetUploadsGet,
		output: CanvaEndpointOutputSchemas.assetUploadsGet,
	},
	'assetUploads.createFromUrl': {
		input: CanvaEndpointInputSchemas.assetUploadsCreateFromUrl,
		output: CanvaEndpointOutputSchemas.assetUploadsCreateFromUrl,
	},
	'assetUploads.getFromUrl': {
		input: CanvaEndpointInputSchemas.assetUploadsGetFromUrl,
		output: CanvaEndpointOutputSchemas.assetUploadsGetFromUrl,
	},
	'imports.create': {
		input: CanvaEndpointInputSchemas.importsCreate,
		output: CanvaEndpointOutputSchemas.importsCreate,
	},
	'imports.get': {
		input: CanvaEndpointInputSchemas.importsGet,
		output: CanvaEndpointOutputSchemas.importsGet,
	},
	'imports.createFromUrl': {
		input: CanvaEndpointInputSchemas.importsCreateFromUrl,
		output: CanvaEndpointOutputSchemas.importsCreateFromUrl,
	},
	'imports.getFromUrl': {
		input: CanvaEndpointInputSchemas.importsGetFromUrl,
		output: CanvaEndpointOutputSchemas.importsGetFromUrl,
	},
	'resizes.create': {
		input: CanvaEndpointInputSchemas.resizesCreate,
		output: CanvaEndpointOutputSchemas.resizesCreate,
	},
	'resizes.get': {
		input: CanvaEndpointInputSchemas.resizesGet,
		output: CanvaEndpointOutputSchemas.resizesGet,
	},
	'autofills.create': {
		input: CanvaEndpointInputSchemas.autofillsCreate,
		output: CanvaEndpointOutputSchemas.autofillsCreate,
	},
	'autofills.get': {
		input: CanvaEndpointInputSchemas.autofillsGet,
		output: CanvaEndpointOutputSchemas.autofillsGet,
	},
	'comments.createThread': {
		input: CanvaEndpointInputSchemas.commentsCreateThread,
		output: CanvaEndpointOutputSchemas.commentsCreateThread,
	},
	'comments.getThread': {
		input: CanvaEndpointInputSchemas.commentsGetThread,
		output: CanvaEndpointOutputSchemas.commentsGetThread,
	},
	'comments.createReply': {
		input: CanvaEndpointInputSchemas.commentsCreateReply,
		output: CanvaEndpointOutputSchemas.commentsCreateReply,
	},
	'comments.listReplies': {
		input: CanvaEndpointInputSchemas.commentsListReplies,
		output: CanvaEndpointOutputSchemas.commentsListReplies,
	},
	'comments.getReply': {
		input: CanvaEndpointInputSchemas.commentsGetReply,
		output: CanvaEndpointOutputSchemas.commentsGetReply,
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
	'users.getCapabilities': {
		riskLevel: 'read',
		description: "Get the authenticated user's capabilities",
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
	'designs.getExportFormats': {
		riskLevel: 'read',
		description: 'Get the export formats available for a design',
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
		description: 'Delete an asset',
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
		description: 'Delete a folder',
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
	'brandTemplates.list': {
		riskLevel: 'read',
		description: "List the user's brand templates",
	},
	'brandTemplates.get': {
		riskLevel: 'read',
		description: 'Get metadata for a brand template',
	},
	'brandTemplates.getDataset': {
		riskLevel: 'read',
		description: 'Get the autofill dataset definition for a brand template',
	},
	'assetUploads.create': {
		riskLevel: 'write',
		description: 'Start a job to upload an asset from binary content',
	},
	'assetUploads.get': {
		riskLevel: 'read',
		description: 'Get the status of an asset upload job',
	},
	'assetUploads.createFromUrl': {
		riskLevel: 'write',
		description: 'Start a job to upload an asset from a URL',
	},
	'assetUploads.getFromUrl': {
		riskLevel: 'read',
		description: 'Get the status of a URL asset upload job',
	},
	'imports.create': {
		riskLevel: 'write',
		description: 'Start a job to import a design from binary content',
	},
	'imports.get': {
		riskLevel: 'read',
		description: 'Get the status of a design import job',
	},
	'imports.createFromUrl': {
		riskLevel: 'write',
		description: 'Start a job to import a design from a URL',
	},
	'imports.getFromUrl': {
		riskLevel: 'read',
		description: 'Get the status of a URL design import job',
	},
	'resizes.create': {
		riskLevel: 'write',
		description: 'Start a job to resize a design',
	},
	'resizes.get': {
		riskLevel: 'read',
		description: 'Get the status of a design resize job',
	},
	'autofills.create': {
		riskLevel: 'write',
		description: 'Start a job to autofill a brand template with data',
	},
	'autofills.get': {
		riskLevel: 'read',
		description: 'Get the status of a design autofill job',
	},
	'comments.createThread': {
		riskLevel: 'write',
		description: 'Create a new comment thread on a design',
	},
	'comments.getThread': {
		riskLevel: 'read',
		description: 'Get a comment thread on a design',
	},
	'comments.createReply': {
		riskLevel: 'write',
		description: 'Reply to a comment thread on a design',
	},
	'comments.listReplies': {
		riskLevel: 'read',
		description: 'List replies to a comment thread on a design',
	},
	'comments.getReply': {
		riskLevel: 'read',
		description: 'Get a reply to a comment thread on a design',
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
				'brandtemplate:meta:read',
				'brandtemplate:content:read',
				'comment:read',
				'comment:write',
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
	AssetUploadsCreateFromUrlResponse,
	AssetUploadsCreateResponse,
	AssetUploadsGetFromUrlResponse,
	AssetUploadsGetResponse,
	AutofillsCreateResponse,
	AutofillsGetResponse,
	BrandTemplatesGetDatasetResponse,
	BrandTemplatesGetResponse,
	BrandTemplatesListResponse,
	CanvaEndpointInputs,
	CanvaEndpointOutputs,
	CommentsCreateReplyResponse,
	CommentsCreateThreadResponse,
	CommentsGetReplyResponse,
	CommentsGetThreadResponse,
	CommentsListRepliesResponse,
	DesignsCreateResponse,
	DesignsGetExportFormatsResponse,
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
	ImportsCreateFromUrlResponse,
	ImportsCreateResponse,
	ImportsGetFromUrlResponse,
	ImportsGetResponse,
	ResizesCreateResponse,
	ResizesGetResponse,
	UsersGetCapabilitiesResponse,
	UsersGetMeResponse,
	UsersGetProfileResponse,
} from './endpoints/types';

export type { CanvaWebhookOutputs } from './webhooks/types';
