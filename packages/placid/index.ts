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
import {
	Collections,
	Fonts,
	Images,
	Media,
	Pdfs,
	Templates,
	Videos,
} from './endpoints';
import type {
	PlacidEndpointInputs,
	PlacidEndpointOutputs,
} from './endpoints/types';
import {
	PlacidEndpointInputSchemas,
	PlacidEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PlacidSchema } from './schema';

export type PlacidPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPlacidPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof placidEndpointsNested>;
};

export type PlacidContext = CorsairPluginContext<
	typeof PlacidSchema,
	PlacidPluginOptions
>;

export type PlacidKeyBuilderContext = KeyBuilderContext<PlacidPluginOptions>;

export type PlacidBoundEndpoints = BindEndpoints<typeof placidEndpointsNested>;

type PlacidEndpoint<K extends keyof PlacidEndpointOutputs> = CorsairEndpoint<
	PlacidContext,
	PlacidEndpointInputs[K],
	PlacidEndpointOutputs[K]
>;

export type PlacidEndpoints = {
	imagesCreate: PlacidEndpoint<'imagesCreate'>;
	imagesGet: PlacidEndpoint<'imagesGet'>;
	imagesDelete: PlacidEndpoint<'imagesDelete'>;
	pdfsCreate: PlacidEndpoint<'pdfsCreate'>;
	pdfsMerge: PlacidEndpoint<'pdfsMerge'>;
	pdfsGet: PlacidEndpoint<'pdfsGet'>;
	pdfsDelete: PlacidEndpoint<'pdfsDelete'>;
	videosCreate: PlacidEndpoint<'videosCreate'>;
	videosGet: PlacidEndpoint<'videosGet'>;
	videosDelete: PlacidEndpoint<'videosDelete'>;
	templatesList: PlacidEndpoint<'templatesList'>;
	templatesCreate: PlacidEndpoint<'templatesCreate'>;
	templatesGet: PlacidEndpoint<'templatesGet'>;
	templatesUpdate: PlacidEndpoint<'templatesUpdate'>;
	templatesDelete: PlacidEndpoint<'templatesDelete'>;
	collectionsList: PlacidEndpoint<'collectionsList'>;
	collectionsCreate: PlacidEndpoint<'collectionsCreate'>;
	collectionsGet: PlacidEndpoint<'collectionsGet'>;
	collectionsUpdate: PlacidEndpoint<'collectionsUpdate'>;
	collectionsDelete: PlacidEndpoint<'collectionsDelete'>;
	mediaUpload: PlacidEndpoint<'mediaUpload'>;
	fontsList: PlacidEndpoint<'fontsList'>;
	fontsGet: PlacidEndpoint<'fontsGet'>;
	fontsCreate: PlacidEndpoint<'fontsCreate'>;
	fontsUpdate: PlacidEndpoint<'fontsUpdate'>;
	fontsDelete: PlacidEndpoint<'fontsDelete'>;
};

const placidEndpointsNested = {
	images: {
		create: Images.create,
		get: Images.get,
		delete: Images.remove,
	},
	pdfs: {
		create: Pdfs.create,
		merge: Pdfs.merge,
		get: Pdfs.get,
		delete: Pdfs.remove,
	},
	videos: {
		create: Videos.create,
		get: Videos.get,
		delete: Videos.remove,
	},
	templates: {
		list: Templates.list,
		create: Templates.create,
		get: Templates.get,
		update: Templates.update,
		delete: Templates.remove,
	},
	collections: {
		list: Collections.list,
		create: Collections.create,
		get: Collections.get,
		update: Collections.update,
		delete: Collections.remove,
	},
	media: {
		upload: Media.upload,
	},
	fonts: {
		list: Fonts.list,
		get: Fonts.get,
		create: Fonts.create,
		update: Fonts.update,
		delete: Fonts.remove,
	},
} as const;

export const placidEndpointSchemas = {
	'images.create': {
		input: PlacidEndpointInputSchemas.imagesCreate,
		output: PlacidEndpointOutputSchemas.imagesCreate,
	},
	'images.get': {
		input: PlacidEndpointInputSchemas.imagesGet,
		output: PlacidEndpointOutputSchemas.imagesGet,
	},
	'images.delete': {
		input: PlacidEndpointInputSchemas.imagesDelete,
		output: PlacidEndpointOutputSchemas.imagesDelete,
	},
	'pdfs.create': {
		input: PlacidEndpointInputSchemas.pdfsCreate,
		output: PlacidEndpointOutputSchemas.pdfsCreate,
	},
	'pdfs.merge': {
		input: PlacidEndpointInputSchemas.pdfsMerge,
		output: PlacidEndpointOutputSchemas.pdfsMerge,
	},
	'pdfs.get': {
		input: PlacidEndpointInputSchemas.pdfsGet,
		output: PlacidEndpointOutputSchemas.pdfsGet,
	},
	'pdfs.delete': {
		input: PlacidEndpointInputSchemas.pdfsDelete,
		output: PlacidEndpointOutputSchemas.pdfsDelete,
	},
	'videos.create': {
		input: PlacidEndpointInputSchemas.videosCreate,
		output: PlacidEndpointOutputSchemas.videosCreate,
	},
	'videos.get': {
		input: PlacidEndpointInputSchemas.videosGet,
		output: PlacidEndpointOutputSchemas.videosGet,
	},
	'videos.delete': {
		input: PlacidEndpointInputSchemas.videosDelete,
		output: PlacidEndpointOutputSchemas.videosDelete,
	},
	'templates.list': {
		input: PlacidEndpointInputSchemas.templatesList,
		output: PlacidEndpointOutputSchemas.templatesList,
	},
	'templates.create': {
		input: PlacidEndpointInputSchemas.templatesCreate,
		output: PlacidEndpointOutputSchemas.templatesCreate,
	},
	'templates.get': {
		input: PlacidEndpointInputSchemas.templatesGet,
		output: PlacidEndpointOutputSchemas.templatesGet,
	},
	'templates.update': {
		input: PlacidEndpointInputSchemas.templatesUpdate,
		output: PlacidEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: PlacidEndpointInputSchemas.templatesDelete,
		output: PlacidEndpointOutputSchemas.templatesDelete,
	},
	'collections.list': {
		input: PlacidEndpointInputSchemas.collectionsList,
		output: PlacidEndpointOutputSchemas.collectionsList,
	},
	'collections.create': {
		input: PlacidEndpointInputSchemas.collectionsCreate,
		output: PlacidEndpointOutputSchemas.collectionsCreate,
	},
	'collections.get': {
		input: PlacidEndpointInputSchemas.collectionsGet,
		output: PlacidEndpointOutputSchemas.collectionsGet,
	},
	'collections.update': {
		input: PlacidEndpointInputSchemas.collectionsUpdate,
		output: PlacidEndpointOutputSchemas.collectionsUpdate,
	},
	'collections.delete': {
		input: PlacidEndpointInputSchemas.collectionsDelete,
		output: PlacidEndpointOutputSchemas.collectionsDelete,
	},
	'media.upload': {
		input: PlacidEndpointInputSchemas.mediaUpload,
		output: PlacidEndpointOutputSchemas.mediaUpload,
	},
	'fonts.list': {
		input: PlacidEndpointInputSchemas.fontsList,
		output: PlacidEndpointOutputSchemas.fontsList,
	},
	'fonts.get': {
		input: PlacidEndpointInputSchemas.fontsGet,
		output: PlacidEndpointOutputSchemas.fontsGet,
	},
	'fonts.create': {
		input: PlacidEndpointInputSchemas.fontsCreate,
		output: PlacidEndpointOutputSchemas.fontsCreate,
	},
	'fonts.update': {
		input: PlacidEndpointInputSchemas.fontsUpdate,
		output: PlacidEndpointOutputSchemas.fontsUpdate,
	},
	'fonts.delete': {
		input: PlacidEndpointInputSchemas.fontsDelete,
		output: PlacidEndpointOutputSchemas.fontsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof placidEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const placidEndpointMeta = {
	'images.create': {
		riskLevel: 'write',
		description:
			'Render a template to an image. The reply is usually `queued`: poll `images.get` with its `id` or set `webhook_success` to get the finished URL. One image costs one credit.',
	},
	'images.get': {
		riskLevel: 'read',
		description:
			'Read an image by id, including `image_url` once `status` is `finished` and the render error fields when it is `error`',
	},
	'images.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete an image. Placid only keeps generated files for a limited time, so store them yourself if you need them',
	},
	'pdfs.create': {
		riskLevel: 'write',
		description:
			'Render one template per page into a single PDF, merged in the order given. Each page costs two credits',
	},
	'pdfs.merge': {
		riskLevel: 'write',
		description:
			'Merge 2 to 10 existing PDFs from public URLs into one file, without rendering a template',
	},
	'pdfs.get': {
		riskLevel: 'read',
		description:
			'Read a PDF by id, including `pdf_url` once `status` is `finished`',
	},
	'pdfs.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a PDF',
	},
	'videos.create': {
		riskLevel: 'write',
		description:
			'Render one template per clip into a video of up to 3 minutes, optionally with audio. Each 10 seconds of video costs 10 credits',
	},
	'videos.get': {
		riskLevel: 'read',
		description:
			'Read a video by id, including `video_url` once `status` is `finished`',
	},
	'videos.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a video',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List templates with their layer names and types, optionally filtered by collection, title or tag and sorted; paged 20 at a time',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create an empty template, or duplicate an existing one with `from_template`, optionally adding it to collections',
	},
	'templates.get': {
		riskLevel: 'read',
		description:
			'Read one template, including every dynamic layer that can be filled in',
	},
	'templates.update': {
		riskLevel: 'write',
		description: "Change a template's title, tags or custom_data",
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a template',
	},
	'collections.list': {
		riskLevel: 'read',
		description:
			'List template collections, either all at once or cursor-paged with `per_page`',
	},
	'collections.create': {
		riskLevel: 'write',
		description:
			'Create a collection, such as one per customer of your SaaS, holding up to 500 templates',
	},
	'collections.get': {
		riskLevel: 'read',
		description: 'Read one collection and the template UUIDs it holds',
	},
	'collections.update': {
		riskLevel: 'write',
		description:
			'Change a collection: replace its whole template list with `template_uuids`, or add and remove individual templates',
	},
	'collections.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a collection. The templates inside it are not deleted',
	},
	'media.upload': {
		riskLevel: 'write',
		description:
			'Upload a file from a public URL to Placid storage and get a URL back for a picture layer. Placid keeps it for a limited time',
	},
	'fonts.list': {
		riskLevel: 'read',
		description:
			'List the custom fonts in the project, optionally including legacy account-wide fonts',
	},
	'fonts.get': {
		riskLevel: 'read',
		description: 'Read one custom font by its `uuid`',
	},
	'fonts.create': {
		riskLevel: 'write',
		description:
			'Upload a ttf, otf, woff or woff2 font from a public URL. `terms_accepted` must be true. The returned `uuid` is the value to set as the `font` property on a text layer',
	},
	'fonts.update': {
		riskLevel: 'write',
		description:
			'Rename a custom font. The file itself cannot be replaced: upload a new font instead',
	},
	'fonts.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a custom font. Fails with 409 when a template still uses it unless `force` is set, which leaves those templates on the default font',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof placidEndpointsNested>;

export type BasePlacidPlugin<T extends PlacidPluginOptions> = CorsairPlugin<
	'placid',
	typeof PlacidSchema,
	typeof placidEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalPlacidPlugin = BasePlacidPlugin<PlacidPluginOptions>;

export type ExternalPlacidPlugin<T extends PlacidPluginOptions> =
	BasePlacidPlugin<T>;

export function placid<const T extends PlacidPluginOptions>(
	incomingOptions: PlacidPluginOptions & T = {} as PlacidPluginOptions & T,
): ExternalPlacidPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'placid',
		schema: PlacidSchema,
		options: options,
		hooks: options.hooks,
		endpoints: placidEndpointsNested,
		webhooks: {},
		endpointMeta: placidEndpointMeta,
		endpointSchemas: placidEndpointSchemas,
		// Placid posts finished renders to the `webhook_success` URL you give it.
		// There is no inbound endpoint, so nothing is accepted.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PlacidKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('placid', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPlacidPlugin;
}

export { PlacidAPIError } from './client';

export type {
	PlacidCollection,
	PlacidEndpointInputs,
	PlacidEndpointOutputs,
	PlacidFont,
	PlacidTemplate,
} from './endpoints/types';
