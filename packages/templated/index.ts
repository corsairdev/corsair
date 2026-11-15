import type {
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
import { Assets, Renders, Templates } from './endpoints';
import type {
	TemplatedEndpointInputs,
	TemplatedEndpointOutputs,
} from './endpoints/types';
import {
	TemplatedEndpointInputSchemas,
	TemplatedEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TemplatedSchema } from './schema';

export type TemplatedPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTemplatedPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof templatedEndpointsNested>;
};

export type TemplatedContext = CorsairPluginContext<
	typeof TemplatedSchema,
	TemplatedPluginOptions
>;

export type TemplatedKeyBuilderContext =
	KeyBuilderContext<TemplatedPluginOptions>;

export type TemplatedBoundEndpoints = BindEndpoints<
	typeof templatedEndpointsNested
>;

type TemplatedEndpoint<K extends keyof TemplatedEndpointOutputs> =
	CorsairEndpoint<
		TemplatedContext,
		TemplatedEndpointInputs[K],
		TemplatedEndpointOutputs[K]
	>;

export type TemplatedEndpoints = {
	rendersList: TemplatedEndpoint<'rendersList'>;
	rendersGet: TemplatedEndpoint<'rendersGet'>;
	rendersCreate: TemplatedEndpoint<'rendersCreate'>;
	rendersDuplicate: TemplatedEndpoint<'rendersDuplicate'>;
	rendersRemove: TemplatedEndpoint<'rendersRemove'>;
	rendersMerge: TemplatedEndpoint<'rendersMerge'>;
	templatesList: TemplatedEndpoint<'templatesList'>;
	templatesGet: TemplatedEndpoint<'templatesGet'>;
	templatesLayers: TemplatedEndpoint<'templatesLayers'>;
	templatesCreate: TemplatedEndpoint<'templatesCreate'>;
	templatesRemove: TemplatedEndpoint<'templatesRemove'>;
	templatesAddTags: TemplatedEndpoint<'templatesAddTags'>;
	templatesRemoveTags: TemplatedEndpoint<'templatesRemoveTags'>;
	uploadsList: TemplatedEndpoint<'uploadsList'>;
	uploadsCreate: TemplatedEndpoint<'uploadsCreate'>;
	uploadsRemove: TemplatedEndpoint<'uploadsRemove'>;
	foldersList: TemplatedEndpoint<'foldersList'>;
	foldersCreate: TemplatedEndpoint<'foldersCreate'>;
	foldersUpdate: TemplatedEndpoint<'foldersUpdate'>;
	foldersRemove: TemplatedEndpoint<'foldersRemove'>;
	fontsList: TemplatedEndpoint<'fontsList'>;
	galleryFontsList: TemplatedEndpoint<'galleryFontsList'>;
	accountGet: TemplatedEndpoint<'accountGet'>;
};

const templatedEndpointsNested = {
	renders: {
		list: Renders.rendersList,
		get: Renders.rendersGet,
		create: Renders.rendersCreate,
		duplicate: Renders.rendersDuplicate,
		delete: Renders.rendersRemove,
		merge: Renders.rendersMerge,
	},
	templates: {
		list: Templates.templatesList,
		get: Templates.templatesGet,
		layers: Templates.templatesLayers,
		create: Templates.templatesCreate,
		delete: Templates.templatesRemove,
		addTags: Templates.templatesAddTags,
		removeTags: Templates.templatesRemoveTags,
	},
	uploads: {
		list: Assets.uploadsList,
		create: Assets.uploadsCreate,
		delete: Assets.uploadsRemove,
	},
	folders: {
		list: Assets.foldersList,
		create: Assets.foldersCreate,
		update: Assets.foldersUpdate,
		delete: Assets.foldersRemove,
	},
	fonts: {
		list: Assets.fontsList,
	},
	galleryFonts: {
		list: Assets.galleryFontsList,
	},
	account: {
		get: Assets.accountGet,
	},
} as const;

export const templatedEndpointSchemas = {
	'renders.list': {
		input: TemplatedEndpointInputSchemas.rendersList,
		output: TemplatedEndpointOutputSchemas.rendersList,
	},
	'renders.get': {
		input: TemplatedEndpointInputSchemas.rendersGet,
		output: TemplatedEndpointOutputSchemas.rendersGet,
	},
	'renders.create': {
		input: TemplatedEndpointInputSchemas.rendersCreate,
		output: TemplatedEndpointOutputSchemas.rendersCreate,
	},
	'renders.duplicate': {
		input: TemplatedEndpointInputSchemas.rendersDuplicate,
		output: TemplatedEndpointOutputSchemas.rendersDuplicate,
	},
	'renders.delete': {
		input: TemplatedEndpointInputSchemas.rendersRemove,
		output: TemplatedEndpointOutputSchemas.rendersRemove,
	},
	'renders.merge': {
		input: TemplatedEndpointInputSchemas.rendersMerge,
		output: TemplatedEndpointOutputSchemas.rendersMerge,
	},
	'templates.list': {
		input: TemplatedEndpointInputSchemas.templatesList,
		output: TemplatedEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: TemplatedEndpointInputSchemas.templatesGet,
		output: TemplatedEndpointOutputSchemas.templatesGet,
	},
	'templates.layers': {
		input: TemplatedEndpointInputSchemas.templatesLayers,
		output: TemplatedEndpointOutputSchemas.templatesLayers,
	},
	'templates.create': {
		input: TemplatedEndpointInputSchemas.templatesCreate,
		output: TemplatedEndpointOutputSchemas.templatesCreate,
	},
	'templates.delete': {
		input: TemplatedEndpointInputSchemas.templatesRemove,
		output: TemplatedEndpointOutputSchemas.templatesRemove,
	},
	'templates.addTags': {
		input: TemplatedEndpointInputSchemas.templatesAddTags,
		output: TemplatedEndpointOutputSchemas.templatesAddTags,
	},
	'templates.removeTags': {
		input: TemplatedEndpointInputSchemas.templatesRemoveTags,
		output: TemplatedEndpointOutputSchemas.templatesRemoveTags,
	},
	'uploads.list': {
		input: TemplatedEndpointInputSchemas.uploadsList,
		output: TemplatedEndpointOutputSchemas.uploadsList,
	},
	'uploads.create': {
		input: TemplatedEndpointInputSchemas.uploadsCreate,
		output: TemplatedEndpointOutputSchemas.uploadsCreate,
	},
	'uploads.delete': {
		input: TemplatedEndpointInputSchemas.uploadsRemove,
		output: TemplatedEndpointOutputSchemas.uploadsRemove,
	},
	'folders.list': {
		input: TemplatedEndpointInputSchemas.foldersList,
		output: TemplatedEndpointOutputSchemas.foldersList,
	},
	'folders.create': {
		input: TemplatedEndpointInputSchemas.foldersCreate,
		output: TemplatedEndpointOutputSchemas.foldersCreate,
	},
	'folders.update': {
		input: TemplatedEndpointInputSchemas.foldersUpdate,
		output: TemplatedEndpointOutputSchemas.foldersUpdate,
	},
	'folders.delete': {
		input: TemplatedEndpointInputSchemas.foldersRemove,
		output: TemplatedEndpointOutputSchemas.foldersRemove,
	},
	'fonts.list': {
		input: TemplatedEndpointInputSchemas.fontsList,
		output: TemplatedEndpointOutputSchemas.fontsList,
	},
	'galleryFonts.list': {
		input: TemplatedEndpointInputSchemas.galleryFontsList,
		output: TemplatedEndpointOutputSchemas.galleryFontsList,
	},
	'account.get': {
		input: TemplatedEndpointInputSchemas.accountGet,
		output: TemplatedEndpointOutputSchemas.accountGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof templatedEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const templatedEndpointMeta = {
	'renders.list': {
		riskLevel: 'read',
		description: 'List every render on the account',
	},
	'renders.get': {
		riskLevel: 'read',
		description: 'Read one render with its URL, dimensions, format and status',
	},
	'renders.create': {
		riskLevel: 'write',
		description:
			'Render a template to an image, PDF or video, spending an API credit; layer overrides fill the template',
	},
	'renders.duplicate': {
		riskLevel: 'write',
		description:
			'Duplicate an existing render with the same template and payload, spending an API credit',
	},
	'renders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a render and its file; the URL stops working and the credit is not refunded',
	},
	'renders.merge': {
		riskLevel: 'write',
		description:
			'Merge several renders, plus external PDFs when given, into one PDF and return its hosted URL',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List templates, filtered by name or tag, 15 per page',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one template, optionally with its layers or its pages',
	},
	'templates.layers': {
		riskLevel: 'read',
		description: 'List a template layers, including locked ones when asked',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create a template from a list of layers, which renders can then use',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a template',
	},
	'templates.addTags': {
		riskLevel: 'write',
		description: 'Append tags to a template, keeping the ones it already has',
	},
	'templates.removeTags': {
		riskLevel: 'write',
		description: 'Remove specific tags from a template',
	},
	'uploads.list': {
		riskLevel: 'read',
		description: 'List uploads, filtered by name or tag, 15 per page',
	},
	'uploads.create': {
		riskLevel: 'write',
		description: 'Upload an image, up to 2 MB, for use as a template layer',
	},
	'uploads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one or more uploads',
	},
	'folders.list': {
		riskLevel: 'read',
		description: 'List folders with their template counts',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a folder to group templates and renders',
	},
	'folders.update': {
		riskLevel: 'write',
		description: 'Rename a folder',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a folder',
	},
	'fonts.list': {
		riskLevel: 'read',
		description: 'List the fonts on the account, including uploaded ones',
	},
	'galleryFonts.list': {
		riskLevel: 'read',
		description: 'List the base fonts available in the editor',
	},
	'account.get': {
		riskLevel: 'read',
		description: 'Read the account email, plan, API usage and quota',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof templatedEndpointsNested
>;

export type BaseTemplatedPlugin<T extends TemplatedPluginOptions> =
	CorsairPlugin<
		'templated',
		typeof TemplatedSchema,
		typeof templatedEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalTemplatedPlugin =
	BaseTemplatedPlugin<TemplatedPluginOptions>;

export type ExternalTemplatedPlugin<T extends TemplatedPluginOptions> =
	BaseTemplatedPlugin<T>;

export function templated<const T extends TemplatedPluginOptions>(
	incomingOptions: TemplatedPluginOptions & T = {} as TemplatedPluginOptions &
		T,
): ExternalTemplatedPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'templated',
		schema: TemplatedSchema,
		options: options,
		hooks: options.hooks,
		endpoints: templatedEndpointsNested,
		webhooks: {},
		endpointMeta: templatedEndpointMeta,
		endpointSchemas: templatedEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TemplatedKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('templated', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTemplatedPlugin;
}

export { TemplatedAPIError } from './client';

export type {
	AccountResponse,
	FolderResponse,
	FoldersListInput,
	FoldersListResponse,
	RendersCreateInput,
	RendersCreateResponse,
	RendersGetInput,
	RendersMergeInput,
	RendersMergeResponse,
	TemplatedAccount,
	TemplatedEndpointInputs,
	TemplatedEndpointOutputs,
	TemplatedFolder,
	TemplatedFont,
	TemplatedRender,
	TemplatedTemplate,
	TemplatedTemplateLayer,
	TemplatedUpload,
	TemplatesCreateInput,
	TemplatesGetInput,
	TemplatesLayersInput,
	TemplatesLayersResponse,
	TemplatesListInput,
	TemplatesListResponse,
	UploadsCreateInput,
	UploadsListInput,
	UploadsListResponse,
} from './endpoints/types';
