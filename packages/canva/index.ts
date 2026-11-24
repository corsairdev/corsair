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
	Apps,
	Assets,
	AssetUploads,
	Autofills,
	BrandTemplates,
	Comments,
	DesignAnalytics,
	Designs,
	Exports,
	Folders,
	Generations,
	ImageGenerations,
	ImageTransformations,
	Imports,
	Keys,
	Merges,
	PrintPartner,
	Resizes,
	Users,
} from './endpoints';
import { validated } from './endpoints/shared';
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
	designsGetDataset: CanvaEndpoint<'designsGetDataset'>;
	analyticsGet: CanvaEndpoint<'analyticsGet'>;
	analyticsListViewers: CanvaEndpoint<'analyticsListViewers'>;
	analyticsListViewsOverTime: CanvaEndpoint<'analyticsListViewsOverTime'>;
	analyticsListPageViews: CanvaEndpoint<'analyticsListPageViews'>;
	analyticsListLinks: CanvaEndpoint<'analyticsListLinks'>;
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
	exportsDownload: CanvaEndpoint<'exportsDownload'>;
	brandTemplatesList: CanvaEndpoint<'brandTemplatesList'>;
	brandTemplatesGet: CanvaEndpoint<'brandTemplatesGet'>;
	brandTemplatesGetDataset: CanvaEndpoint<'brandTemplatesGetDataset'>;
	brandTemplatesPublish: CanvaEndpoint<'brandTemplatesPublish'>;
	assetUploadsCreate: CanvaEndpoint<'assetUploadsCreate'>;
	assetUploadsGet: CanvaEndpoint<'assetUploadsGet'>;
	assetUploadsCreateFromUrl: CanvaEndpoint<'assetUploadsCreateFromUrl'>;
	assetUploadsGetFromUrl: CanvaEndpoint<'assetUploadsGetFromUrl'>;
	importsCreate: CanvaEndpoint<'importsCreate'>;
	importsGet: CanvaEndpoint<'importsGet'>;
	importsCreateFromUrl: CanvaEndpoint<'importsCreateFromUrl'>;
	importsGetFromUrl: CanvaEndpoint<'importsGetFromUrl'>;
	importsCreateFromImage: CanvaEndpoint<'importsCreateFromImage'>;
	importsGetFromImage: CanvaEndpoint<'importsGetFromImage'>;
	resizesCreate: CanvaEndpoint<'resizesCreate'>;
	resizesGet: CanvaEndpoint<'resizesGet'>;
	autofillsCreate: CanvaEndpoint<'autofillsCreate'>;
	autofillsGet: CanvaEndpoint<'autofillsGet'>;
	generationsCreate: CanvaEndpoint<'generationsCreate'>;
	generationsGet: CanvaEndpoint<'generationsGet'>;
	imageGenerationsCreate: CanvaEndpoint<'imageGenerationsCreate'>;
	imageGenerationsGet: CanvaEndpoint<'imageGenerationsGet'>;
	imageTransformationsCreate: CanvaEndpoint<'imageTransformationsCreate'>;
	imageTransformationsGet: CanvaEndpoint<'imageTransformationsGet'>;
	mergesCreate: CanvaEndpoint<'mergesCreate'>;
	mergesGet: CanvaEndpoint<'mergesGet'>;
	printPartnerCreateDesign: CanvaEndpoint<'printPartnerCreateDesign'>;
	printPartnerGetDesign: CanvaEndpoint<'printPartnerGetDesign'>;
	printPartnerCreateExport: CanvaEndpoint<'printPartnerCreateExport'>;
	commentsCreateThread: CanvaEndpoint<'commentsCreateThread'>;
	commentsGetThread: CanvaEndpoint<'commentsGetThread'>;
	commentsCreateReply: CanvaEndpoint<'commentsCreateReply'>;
	commentsListReplies: CanvaEndpoint<'commentsListReplies'>;
	commentsGetReply: CanvaEndpoint<'commentsGetReply'>;
	keysList: CanvaEndpoint<'keysList'>;
	appsGetJwks: CanvaEndpoint<'appsGetJwks'>;
};

export type CanvaWebhooks = Record<string, never>;

export type CanvaBoundWebhooks = Record<string, never>;

const canvaEndpointsNested = {
	users: {
		getMe: validated('usersGetMe', Users.getMe),
		getProfile: validated('usersGetProfile', Users.getProfile),
		getCapabilities: validated('usersGetCapabilities', Users.getCapabilities),
	},
	designs: {
		list: validated('designsList', Designs.list),
		get: validated('designsGet', Designs.get),
		create: validated('designsCreate', Designs.create),
		getPages: validated('designsGetPages', Designs.getPages),
		getExportFormats: validated(
			'designsGetExportFormats',
			Designs.getExportFormats,
		),
		getDataset: validated('designsGetDataset', Designs.getDataset),
	},
	analytics: {
		get: validated('analyticsGet', DesignAnalytics.get),
		listViewers: validated('analyticsListViewers', DesignAnalytics.listViewers),
		listViewsOverTime: validated(
			'analyticsListViewsOverTime',
			DesignAnalytics.listViewsOverTime,
		),
		listPageViews: validated(
			'analyticsListPageViews',
			DesignAnalytics.listPageViews,
		),
		listLinks: validated('analyticsListLinks', DesignAnalytics.listLinks),
	},
	assets: {
		get: validated('assetsGet', Assets.get),
		update: validated('assetsUpdate', Assets.update),
		delete: validated('assetsDelete', Assets.delete),
	},
	folders: {
		create: validated('foldersCreate', Folders.create),
		get: validated('foldersGet', Folders.get),
		update: validated('foldersUpdate', Folders.update),
		delete: validated('foldersDelete', Folders.delete),
		listItems: validated('foldersListItems', Folders.listItems),
		moveItem: validated('foldersMoveItem', Folders.moveItem),
	},
	exports: {
		create: validated('exportsCreate', Exports.create),
		get: validated('exportsGet', Exports.get),
		download: validated('exportsDownload', Exports.download),
	},
	brandTemplates: {
		list: validated('brandTemplatesList', BrandTemplates.list),
		get: validated('brandTemplatesGet', BrandTemplates.get),
		getDataset: validated(
			'brandTemplatesGetDataset',
			BrandTemplates.getDataset,
		),
		publish: validated('brandTemplatesPublish', BrandTemplates.publish),
	},
	assetUploads: {
		create: validated('assetUploadsCreate', AssetUploads.create),
		get: validated('assetUploadsGet', AssetUploads.get),
		createFromUrl: validated(
			'assetUploadsCreateFromUrl',
			AssetUploads.createFromUrl,
		),
		getFromUrl: validated('assetUploadsGetFromUrl', AssetUploads.getFromUrl),
	},
	imports: {
		create: validated('importsCreate', Imports.create),
		get: validated('importsGet', Imports.get),
		createFromUrl: validated('importsCreateFromUrl', Imports.createFromUrl),
		getFromUrl: validated('importsGetFromUrl', Imports.getFromUrl),
		createFromImage: validated(
			'importsCreateFromImage',
			Imports.createFromImage,
		),
		getFromImage: validated('importsGetFromImage', Imports.getFromImage),
	},
	resizes: {
		create: validated('resizesCreate', Resizes.create),
		get: validated('resizesGet', Resizes.get),
	},
	autofills: {
		create: validated('autofillsCreate', Autofills.create),
		get: validated('autofillsGet', Autofills.get),
	},
	generations: {
		create: validated('generationsCreate', Generations.create),
		get: validated('generationsGet', Generations.get),
	},
	imageGenerations: {
		create: validated('imageGenerationsCreate', ImageGenerations.create),
		get: validated('imageGenerationsGet', ImageGenerations.get),
	},
	imageTransformations: {
		create: validated(
			'imageTransformationsCreate',
			ImageTransformations.create,
		),
		get: validated('imageTransformationsGet', ImageTransformations.get),
	},
	merges: {
		create: validated('mergesCreate', Merges.create),
		get: validated('mergesGet', Merges.get),
	},
	printPartner: {
		createDesign: validated(
			'printPartnerCreateDesign',
			PrintPartner.createDesign,
		),
		getDesign: validated('printPartnerGetDesign', PrintPartner.getDesign),
		createExport: validated(
			'printPartnerCreateExport',
			PrintPartner.createExport,
		),
	},
	comments: {
		createThread: validated('commentsCreateThread', Comments.createThread),
		getThread: validated('commentsGetThread', Comments.getThread),
		createReply: validated('commentsCreateReply', Comments.createReply),
		listReplies: validated('commentsListReplies', Comments.listReplies),
		getReply: validated('commentsGetReply', Comments.getReply),
	},
	keys: {
		list: validated('keysList', Keys.list),
	},
	apps: {
		getJwks: validated('appsGetJwks', Apps.getJwks),
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
	'designs.getDataset': {
		input: CanvaEndpointInputSchemas.designsGetDataset,
		output: CanvaEndpointOutputSchemas.designsGetDataset,
	},
	'analytics.get': {
		input: CanvaEndpointInputSchemas.analyticsGet,
		output: CanvaEndpointOutputSchemas.analyticsGet,
	},
	'analytics.listViewers': {
		input: CanvaEndpointInputSchemas.analyticsListViewers,
		output: CanvaEndpointOutputSchemas.analyticsListViewers,
	},
	'analytics.listViewsOverTime': {
		input: CanvaEndpointInputSchemas.analyticsListViewsOverTime,
		output: CanvaEndpointOutputSchemas.analyticsListViewsOverTime,
	},
	'analytics.listPageViews': {
		input: CanvaEndpointInputSchemas.analyticsListPageViews,
		output: CanvaEndpointOutputSchemas.analyticsListPageViews,
	},
	'analytics.listLinks': {
		input: CanvaEndpointInputSchemas.analyticsListLinks,
		output: CanvaEndpointOutputSchemas.analyticsListLinks,
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
	'exports.download': {
		input: CanvaEndpointInputSchemas.exportsDownload,
		output: CanvaEndpointOutputSchemas.exportsDownload,
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
	'brandTemplates.publish': {
		input: CanvaEndpointInputSchemas.brandTemplatesPublish,
		output: CanvaEndpointOutputSchemas.brandTemplatesPublish,
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
	'imports.createFromImage': {
		input: CanvaEndpointInputSchemas.importsCreateFromImage,
		output: CanvaEndpointOutputSchemas.importsCreateFromImage,
	},
	'imports.getFromImage': {
		input: CanvaEndpointInputSchemas.importsGetFromImage,
		output: CanvaEndpointOutputSchemas.importsGetFromImage,
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
	'generations.create': {
		input: CanvaEndpointInputSchemas.generationsCreate,
		output: CanvaEndpointOutputSchemas.generationsCreate,
	},
	'generations.get': {
		input: CanvaEndpointInputSchemas.generationsGet,
		output: CanvaEndpointOutputSchemas.generationsGet,
	},
	'imageGenerations.create': {
		input: CanvaEndpointInputSchemas.imageGenerationsCreate,
		output: CanvaEndpointOutputSchemas.imageGenerationsCreate,
	},
	'imageGenerations.get': {
		input: CanvaEndpointInputSchemas.imageGenerationsGet,
		output: CanvaEndpointOutputSchemas.imageGenerationsGet,
	},
	'imageTransformations.create': {
		input: CanvaEndpointInputSchemas.imageTransformationsCreate,
		output: CanvaEndpointOutputSchemas.imageTransformationsCreate,
	},
	'imageTransformations.get': {
		input: CanvaEndpointInputSchemas.imageTransformationsGet,
		output: CanvaEndpointOutputSchemas.imageTransformationsGet,
	},
	'merges.create': {
		input: CanvaEndpointInputSchemas.mergesCreate,
		output: CanvaEndpointOutputSchemas.mergesCreate,
	},
	'merges.get': {
		input: CanvaEndpointInputSchemas.mergesGet,
		output: CanvaEndpointOutputSchemas.mergesGet,
	},
	'printPartner.createDesign': {
		input: CanvaEndpointInputSchemas.printPartnerCreateDesign,
		output: CanvaEndpointOutputSchemas.printPartnerCreateDesign,
	},
	'printPartner.getDesign': {
		input: CanvaEndpointInputSchemas.printPartnerGetDesign,
		output: CanvaEndpointOutputSchemas.printPartnerGetDesign,
	},
	'printPartner.createExport': {
		input: CanvaEndpointInputSchemas.printPartnerCreateExport,
		output: CanvaEndpointOutputSchemas.printPartnerCreateExport,
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
	'keys.list': {
		input: CanvaEndpointInputSchemas.keysList,
		output: CanvaEndpointOutputSchemas.keysList,
	},
	'apps.getJwks': {
		input: CanvaEndpointInputSchemas.appsGetJwks,
		output: CanvaEndpointOutputSchemas.appsGetJwks,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof canvaEndpointsNested>;

const canvaWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof canvaWebhooksNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const canvaEndpointMeta = {
	'users.getMe': {
		riskLevel: 'read',
		description: 'Get the user ID and team ID of the connected Canva account',
	},
	'users.getProfile': {
		riskLevel: 'read',
		description: "Get the connected user's display name",
	},
	'users.getCapabilities': {
		riskLevel: 'read',
		description:
			"List what the user's Canva plan allows through the API (autofill, brand templates, resize, design and image generation, background removal, analytics)",
	},
	'designs.list': {
		riskLevel: 'read',
		description: "List or search designs in the user's projects",
	},
	'designs.get': {
		riskLevel: 'read',
		description:
			'Get a design: title, owner, page count, thumbnail, edit and view links',
	},
	'designs.create': {
		riskLevel: 'write',
		description:
			'Create a design: a preset or custom size (optionally with an image asset), a copy of a design, or a design from a brand template',
	},
	'designs.getPages': {
		riskLevel: 'read',
		description:
			'List the pages of a design with their thumbnails and sizes (Canva preview)',
	},
	'designs.getExportFormats': {
		riskLevel: 'read',
		description: 'List the file formats a design can be exported to',
	},
	'designs.getDataset': {
		riskLevel: 'read',
		description:
			"Get a design's autofill fields and the kind of data each takes",
	},
	'analytics.get': {
		riskLevel: 'read',
		description:
			"Get a design's total views, unique viewers and view time (Canva Enterprise, preview)",
	},
	'analytics.listViewers': {
		riskLevel: 'read',
		description:
			'List who viewed a design, most recent first (Canva Enterprise, preview)',
	},
	'analytics.listViewsOverTime': {
		riskLevel: 'read',
		description:
			"List a design's view counts per time bucket (Canva Enterprise, preview)",
	},
	'analytics.listPageViews': {
		riskLevel: 'read',
		description:
			'List view time per page of a design (Canva Enterprise, preview)',
	},
	'analytics.listLinks': {
		riskLevel: 'read',
		description:
			"List a design's trackable links and their views (Canva Enterprise, preview)",
	},
	'assets.get': {
		riskLevel: 'read',
		description: 'Get an image or video asset in the content library',
	},
	'assets.update': {
		riskLevel: 'write',
		description: 'Rename an asset or replace its tags',
	},
	'assets.delete': {
		riskLevel: 'destructive',
		description: 'Move an asset to the trash (designs that use it keep it)',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a folder in projects, Uploads or another folder',
	},
	'folders.get': {
		riskLevel: 'read',
		description: 'Get a folder',
	},
	'folders.update': {
		riskLevel: 'write',
		description: 'Rename a folder',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		description: "Delete a folder; the user's content in it moves to the trash",
	},
	'folders.listItems': {
		riskLevel: 'read',
		description:
			'List the designs, folders, images and brand templates in a folder',
	},
	'folders.moveItem': {
		riskLevel: 'write',
		description: 'Move a design, folder or image to another folder',
	},
	'exports.create': {
		riskLevel: 'read',
		description:
			'Start exporting a design to PDF, PNG, JPG, GIF, PPTX, MP4, HTML or CSV; a multi-page PNG or JPG export gives one file per page. Download links last 24 hours',
		job: {
			idPath: 'job.id',
			status: {
				op: 'exports.get',
				idArg: 'exportId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'exports.get': {
		riskLevel: 'read',
		description: "Get an export job's status and its download URLs",
	},
	'exports.download': {
		riskLevel: 'read',
		description:
			'Download one file of a finished export (one page of a PNG or JPG export) and return it as a file; index picks which',
	},
	'brandTemplates.list': {
		riskLevel: 'read',
		description:
			"List the user's brand templates (Canva Pro, Teams or Enterprise)",
	},
	'brandTemplates.get': {
		riskLevel: 'read',
		description: 'Get a brand template',
	},
	'brandTemplates.getDataset': {
		riskLevel: 'read',
		description:
			"Get a brand template's autofill fields and the kind of data each takes",
	},
	'brandTemplates.publish': {
		riskLevel: 'write',
		description:
			'Publish a design as a brand template (Canva preview; needs a brand designer or admin role)',
	},
	'assetUploads.create': {
		riskLevel: 'write',
		description: "Start uploading a file to the user's content library",
		job: {
			idPath: 'job.id',
			status: {
				op: 'assetUploads.get',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'assetUploads.get': {
		riskLevel: 'read',
		description: 'Get an asset upload job',
	},
	'assetUploads.createFromUrl': {
		riskLevel: 'write',
		description:
			"Start uploading a file from a public URL to the user's content library",
		job: {
			idPath: 'job.id',
			status: {
				op: 'assetUploads.getFromUrl',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'assetUploads.getFromUrl': {
		riskLevel: 'read',
		description: 'Get a URL asset upload job',
	},
	'imports.create': {
		riskLevel: 'write',
		description:
			'Start importing a file (PDF, PowerPoint, Keynote, Word and more) as a new Canva design',
		job: {
			idPath: 'job.id',
			status: {
				op: 'imports.get',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'imports.get': {
		riskLevel: 'read',
		description: 'Get a design import job',
	},
	'imports.createFromUrl': {
		riskLevel: 'write',
		description:
			'Start importing a file from a public URL as a new Canva design',
		job: {
			idPath: 'job.id',
			status: {
				op: 'imports.getFromUrl',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'imports.getFromUrl': {
		riskLevel: 'read',
		description: 'Get a URL design import job',
	},
	'imports.createFromImage': {
		riskLevel: 'write',
		description:
			'Start turning an image asset into an editable design with Magic Layers (Canva preview)',
		job: {
			idPath: 'job.id',
			status: {
				op: 'imports.getFromImage',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'imports.getFromImage': {
		riskLevel: 'read',
		description: 'Get an image-to-design import job',
	},
	'resizes.create': {
		riskLevel: 'write',
		description:
			'Start making a resized copy of a design (Canva Pro; a few free trial uses)',
		job: {
			idPath: 'job.id',
			status: {
				op: 'resizes.get',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'resizes.get': {
		riskLevel: 'read',
		description: 'Get a design resize job',
	},
	'autofills.create': {
		riskLevel: 'write',
		description:
			'Start filling a brand template or design with text, images and chart data, as a new design or in place (Canva Pro, Teams or Enterprise)',
		job: {
			idPath: 'job.id',
			status: {
				op: 'autofills.get',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'autofills.get': {
		riskLevel: 'read',
		description: 'Get a design autofill job',
	},
	'generations.create': {
		riskLevel: 'write',
		description:
			'Start generating a presentation or doc from a text brief and optional outline (Canva preview)',
		job: {
			idPath: 'job.id',
			status: {
				op: 'generations.get',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'generations.get': {
		riskLevel: 'read',
		description: 'Get a design generation job',
	},
	'imageGenerations.create': {
		riskLevel: 'write',
		description:
			'Start generating an image from a prompt, optionally saved to uploads (Canva preview; uses Canva AI quota)',
		job: {
			idPath: 'job.id',
			status: {
				op: 'imageGenerations.get',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'imageGenerations.get': {
		riskLevel: 'read',
		description: 'Get an image generation job and its download URL',
	},
	'imageTransformations.create': {
		riskLevel: 'write',
		description:
			'Start removing the background of an image asset, saved as a new asset (Canva preview)',
		job: {
			idPath: 'job.id',
			status: {
				op: 'imageTransformations.get',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'imageTransformations.get': {
		riskLevel: 'read',
		description: 'Get an image transformation job',
	},
	'merges.create': {
		riskLevel: 'write',
		description:
			'Start inserting, moving or deleting pages: build a new design from other designs or change one in place (Canva preview)',
		job: {
			idPath: 'job.id',
			status: {
				op: 'merges.get',
				idArg: 'jobId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'merges.get': {
		riskLevel: 'read',
		description: 'Get a design merge job',
	},
	'printPartner.createDesign': {
		riskLevel: 'write',
		description:
			'Create a design for a print product (Canva Print Partner apps only, preview)',
	},
	'printPartner.getDesign': {
		riskLevel: 'read',
		description:
			'Get a design with print proofing settings (Canva Print Partner apps only, preview)',
	},
	'printPartner.createExport': {
		riskLevel: 'read',
		description:
			'Start a print-ready export (Canva Print Partner apps only, preview)',
		job: {
			idPath: 'job.id',
			status: {
				op: 'exports.get',
				idArg: 'exportId',
				statusPath: 'job.status',
				done: ['success'],
				failed: ['failed'],
			},
		},
	},
	'comments.createThread': {
		riskLevel: 'write',
		description: 'Start a comment thread on a design (Canva preview)',
	},
	'comments.getThread': {
		riskLevel: 'read',
		description:
			'Get a comment or suggestion thread on a design (Canva preview)',
	},
	'comments.createReply': {
		riskLevel: 'write',
		description: 'Reply to a comment thread (Canva preview)',
	},
	'comments.listReplies': {
		riskLevel: 'read',
		description: 'List the replies in a comment thread (Canva preview)',
	},
	'comments.getReply': {
		riskLevel: 'read',
		description: 'Get a reply in a comment thread (Canva preview)',
	},
	'keys.list': {
		riskLevel: 'read',
		description:
			'Get the public keys that verify Canva webhook signatures (preview)',
	},
	'apps.getJwks': {
		riskLevel: 'read',
		description:
			"Get a Canva app's public keys for verifying the JWTs it sends to its backend",
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
			// Canva refuses a sign-in without PKCE, spells the method `s256`, and
			// recommends Basic client auth on the token endpoint.
			pkce: true,
			tokenAuthMethod: 'basic',
			authParams: { code_challenge_method: 's256' },
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
	AnalyticsGetResponse,
	AnalyticsListLinksResponse,
	AnalyticsListPageViewsResponse,
	AnalyticsListViewersResponse,
	AnalyticsListViewsOverTimeResponse,
	AppsGetJwksResponse,
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
	BrandTemplatesPublishResponse,
	CanvaEndpointInputs,
	CanvaEndpointOutputs,
	CommentsCreateReplyResponse,
	CommentsCreateThreadResponse,
	CommentsGetReplyResponse,
	CommentsGetThreadResponse,
	CommentsListRepliesResponse,
	DesignsCreateResponse,
	DesignsGetDatasetResponse,
	DesignsGetExportFormatsResponse,
	DesignsGetPagesResponse,
	DesignsGetResponse,
	DesignsListResponse,
	ExportsCreateResponse,
	ExportsDownloadResponse,
	ExportsGetResponse,
	FoldersCreateResponse,
	FoldersDeleteResponse,
	FoldersGetResponse,
	FoldersListItemsResponse,
	FoldersMoveItemResponse,
	FoldersUpdateResponse,
	GenerationsCreateResponse,
	GenerationsGetResponse,
	ImageGenerationsCreateResponse,
	ImageGenerationsGetResponse,
	ImageTransformationsCreateResponse,
	ImageTransformationsGetResponse,
	ImportsCreateFromImageResponse,
	ImportsCreateFromUrlResponse,
	ImportsCreateResponse,
	ImportsGetFromImageResponse,
	ImportsGetFromUrlResponse,
	ImportsGetResponse,
	KeysListResponse,
	MergesCreateResponse,
	MergesGetResponse,
	PrintPartnerCreateDesignResponse,
	PrintPartnerCreateExportResponse,
	PrintPartnerGetDesignResponse,
	ResizesCreateResponse,
	ResizesGetResponse,
	UsersGetCapabilitiesResponse,
	UsersGetMeResponse,
	UsersGetProfileResponse,
} from './endpoints/types';

export type { CanvaWebhookOutputs } from './webhooks/types';
