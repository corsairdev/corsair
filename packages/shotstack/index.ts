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
	Assets,
	Generations,
	Media,
	Renders,
	Sources,
	Templates,
	Uploads,
} from './endpoints';
import type {
	ShotstackEndpointInputs,
	ShotstackEndpointOutputs,
} from './endpoints/types';
import {
	ShotstackEndpointInputSchemas,
	ShotstackEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ShotstackSchema } from './schema';

export type ShotstackPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Shotstack production API key (app.shotstack.io, under API Keys). Overrides the stored key. */
	key?: string;
	hooks?: InternalShotstackPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof shotstackEndpointsNested>;
};

export type ShotstackContext = CorsairPluginContext<
	typeof ShotstackSchema,
	ShotstackPluginOptions
>;

export type ShotstackKeyBuilderContext =
	KeyBuilderContext<ShotstackPluginOptions>;

export type ShotstackBoundEndpoints = BindEndpoints<
	typeof shotstackEndpointsNested
>;

type ShotstackEndpoint<K extends keyof ShotstackEndpointOutputs> =
	CorsairEndpoint<
		ShotstackContext,
		ShotstackEndpointInputs[K],
		ShotstackEndpointOutputs[K]
	>;

export type ShotstackEndpoints = {
	rendersCreate: ShotstackEndpoint<'rendersCreate'>;
	rendersGet: ShotstackEndpoint<'rendersGet'>;
	templatesList: ShotstackEndpoint<'templatesList'>;
	templatesGet: ShotstackEndpoint<'templatesGet'>;
	templatesCreate: ShotstackEndpoint<'templatesCreate'>;
	templatesUpdate: ShotstackEndpoint<'templatesUpdate'>;
	templatesDelete: ShotstackEndpoint<'templatesDelete'>;
	templatesRender: ShotstackEndpoint<'templatesRender'>;
	generationsCreate: ShotstackEndpoint<'generationsCreate'>;
	generationsGet: ShotstackEndpoint<'generationsGet'>;
	generationsQuote: ShotstackEndpoint<'generationsQuote'>;
	generationsListModels: ShotstackEndpoint<'generationsListModels'>;
	generationsGetModel: ShotstackEndpoint<'generationsGetModel'>;
	mediaProbe: ShotstackEndpoint<'mediaProbe'>;
	sourcesFetch: ShotstackEndpoint<'sourcesFetch'>;
	sourcesList: ShotstackEndpoint<'sourcesList'>;
	sourcesGet: ShotstackEndpoint<'sourcesGet'>;
	sourcesDelete: ShotstackEndpoint<'sourcesDelete'>;
	uploadsCreate: ShotstackEndpoint<'uploadsCreate'>;
	assetsGet: ShotstackEndpoint<'assetsGet'>;
	assetsGetByRenderId: ShotstackEndpoint<'assetsGetByRenderId'>;
	assetsTransfer: ShotstackEndpoint<'assetsTransfer'>;
	assetsDelete: ShotstackEndpoint<'assetsDelete'>;
};

const shotstackEndpointsNested = {
	renders: {
		create: Renders.create,
		get: Renders.get,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		create: Templates.create,
		update: Templates.update,
		delete: Templates.remove,
		render: Templates.render,
	},
	generations: {
		create: Generations.create,
		get: Generations.get,
		quote: Generations.quote,
		listModels: Generations.listModels,
		getModel: Generations.getModel,
	},
	media: {
		probe: Media.probe,
	},
	sources: {
		fetch: Sources.fetch,
		list: Sources.list,
		get: Sources.get,
		delete: Sources.remove,
	},
	uploads: {
		create: Uploads.create,
	},
	assets: {
		get: Assets.get,
		getByRenderId: Assets.getByRenderId,
		transfer: Assets.transfer,
		delete: Assets.remove,
	},
} as const;

export const shotstackEndpointSchemas = {
	'renders.create': {
		input: ShotstackEndpointInputSchemas.rendersCreate,
		output: ShotstackEndpointOutputSchemas.rendersCreate,
	},
	'renders.get': {
		input: ShotstackEndpointInputSchemas.rendersGet,
		output: ShotstackEndpointOutputSchemas.rendersGet,
	},
	'templates.list': {
		input: ShotstackEndpointInputSchemas.templatesList,
		output: ShotstackEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: ShotstackEndpointInputSchemas.templatesGet,
		output: ShotstackEndpointOutputSchemas.templatesGet,
	},
	'templates.create': {
		input: ShotstackEndpointInputSchemas.templatesCreate,
		output: ShotstackEndpointOutputSchemas.templatesCreate,
	},
	'templates.update': {
		input: ShotstackEndpointInputSchemas.templatesUpdate,
		output: ShotstackEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: ShotstackEndpointInputSchemas.templatesDelete,
		output: ShotstackEndpointOutputSchemas.templatesDelete,
	},
	'templates.render': {
		input: ShotstackEndpointInputSchemas.templatesRender,
		output: ShotstackEndpointOutputSchemas.templatesRender,
	},
	'generations.create': {
		input: ShotstackEndpointInputSchemas.generationsCreate,
		output: ShotstackEndpointOutputSchemas.generationsCreate,
	},
	'generations.get': {
		input: ShotstackEndpointInputSchemas.generationsGet,
		output: ShotstackEndpointOutputSchemas.generationsGet,
	},
	'generations.quote': {
		input: ShotstackEndpointInputSchemas.generationsQuote,
		output: ShotstackEndpointOutputSchemas.generationsQuote,
	},
	'generations.listModels': {
		input: ShotstackEndpointInputSchemas.generationsListModels,
		output: ShotstackEndpointOutputSchemas.generationsListModels,
	},
	'generations.getModel': {
		input: ShotstackEndpointInputSchemas.generationsGetModel,
		output: ShotstackEndpointOutputSchemas.generationsGetModel,
	},
	'media.probe': {
		input: ShotstackEndpointInputSchemas.mediaProbe,
		output: ShotstackEndpointOutputSchemas.mediaProbe,
	},
	'sources.fetch': {
		input: ShotstackEndpointInputSchemas.sourcesFetch,
		output: ShotstackEndpointOutputSchemas.sourcesFetch,
	},
	'sources.list': {
		input: ShotstackEndpointInputSchemas.sourcesList,
		output: ShotstackEndpointOutputSchemas.sourcesList,
	},
	'sources.get': {
		input: ShotstackEndpointInputSchemas.sourcesGet,
		output: ShotstackEndpointOutputSchemas.sourcesGet,
	},
	'sources.delete': {
		input: ShotstackEndpointInputSchemas.sourcesDelete,
		output: ShotstackEndpointOutputSchemas.sourcesDelete,
	},
	'uploads.create': {
		input: ShotstackEndpointInputSchemas.uploadsCreate,
		output: ShotstackEndpointOutputSchemas.uploadsCreate,
	},
	'assets.get': {
		input: ShotstackEndpointInputSchemas.assetsGet,
		output: ShotstackEndpointOutputSchemas.assetsGet,
	},
	'assets.getByRenderId': {
		input: ShotstackEndpointInputSchemas.assetsGetByRenderId,
		output: ShotstackEndpointOutputSchemas.assetsGetByRenderId,
	},
	'assets.transfer': {
		input: ShotstackEndpointInputSchemas.assetsTransfer,
		output: ShotstackEndpointOutputSchemas.assetsTransfer,
	},
	'assets.delete': {
		input: ShotstackEndpointInputSchemas.assetsDelete,
		output: ShotstackEndpointOutputSchemas.assetsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof shotstackEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// A render runs on Shotstack after the create call returns. Status values are
// the spec enum (RENDER_STATUSES); jobs.test.ts keeps them in step. There is
// no cancel operation for renders, generations or ingests.
const RENDER_JOB = {
	idPath: 'response.id',
	status: {
		op: 'renders.get',
		idArg: 'id',
		statusPath: 'response.status',
		done: ['done'],
		failed: ['failed'],
	},
} as const;

const shotstackEndpointMeta = {
	'renders.create': {
		riskLevel: 'write',
		description:
			'Queue a video, image, GIF or audio render of a JSON timeline; spends credits. Follow it with renders.get until status is done or failed.',
		job: RENDER_JOB,
	},
	'renders.get': {
		riskLevel: 'read',
		description:
			'Where a render stands. Once done it returns the temporary download URL, which expires after 24 hours; serve the asset from its CDN URL via assets.getByRenderId instead.',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List the saved templates with their ids and names.',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one saved template, including its full edit.',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Save an edit (timeline and output) as a named template that can be rendered with placeholders.',
	},
	'templates.update': {
		riskLevel: 'write',
		description: 'Overwrite a saved template with a new name or edit.',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a saved template; there is no undo.',
	},
	'templates.render': {
		riskLevel: 'write',
		description:
			'Queue a render of a saved template with placeholder values merged in; spends credits. Poll renders.get for the result.',
		job: RENDER_JOB,
	},
	'generations.create': {
		riskLevel: 'write',
		description:
			'Generate an image, video or audio asset from a prompt with an AI model; spends generation credits. Follow it with generations.get until status is done or failed. Pass idempotencyKey to make retries safe.',
		job: {
			idPath: 'id',
			status: {
				op: 'generations.get',
				idArg: 'id',
				statusPath: 'status',
				done: ['done'],
				failed: ['failed'],
			},
		},
	},
	'generations.get': {
		riskLevel: 'read',
		description:
			'Where a generation job stands. Once done it returns the public URL of the generated asset.',
	},
	'generations.quote': {
		riskLevel: 'read',
		description:
			'Estimate the generation credits an asset would cost, without reserving credits or generating anything.',
	},
	'generations.listModels': {
		riskLevel: 'read',
		description:
			'List the generation models available to this account, each with the asset type it generates.',
	},
	'generations.getModel': {
		riskLevel: 'read',
		description:
			'Read one generation model, including the JSON Schema of the options it accepts.',
	},
	'media.probe': {
		riskLevel: 'read',
		description:
			'Inspect a media file at a remote URL and return its FFprobe metadata: width, height, duration, fps and type.',
	},
	'sources.fetch': {
		riskLevel: 'write',
		description:
			'Fetch a file from a URL into Shotstack storage so the Edit API can use it; follow it with sources.get until status is ready.',
		job: {
			idPath: 'id',
			status: {
				op: 'sources.get',
				idArg: 'id',
				statusPath: 'status',
				done: ['ready'],
				// deleted: the file is gone. overwritten: another fetch of the
				// same URL replaced this source, so the id will never be ready
				// with the content this job was for.
				failed: ['failed', 'deleted', 'overwritten'],
			},
		},
	},
	'sources.list': {
		riskLevel: 'read',
		description:
			'List the ingested source files with their status and metadata.',
	},
	'sources.get': {
		riskLevel: 'read',
		description:
			'Read one ingested source file: its hosted URL, status, dimensions and duration.',
	},
	'sources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete an ingested source file; there is no undo.',
	},
	'uploads.create': {
		riskLevel: 'write',
		description:
			'Get a signed S3 URL to upload a file directly, so the Edit API can use it as a source. PUT the bytes to the returned url within one hour.',
	},
	'assets.get': {
		riskLevel: 'read',
		description:
			'Read one hosted asset: its durable CDN URL, filename, size and status.',
	},
	'assets.getByRenderId': {
		riskLevel: 'read',
		description:
			'List the assets a render produced (video, poster, thumbnail), including the durable CDN URL to serve them from.',
	},
	'assets.transfer': {
		riskLevel: 'write',
		description:
			'Copy a hosted file to external destinations such as S3, Google Cloud Storage, Mux, Vimeo or Google Drive.',
	},
	'assets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a hosted asset from Shotstack storage and its CDN; there is no undo.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof shotstackEndpointsNested
>;

export type BaseShotstackPlugin<T extends ShotstackPluginOptions> =
	CorsairPlugin<
		'shotstack',
		typeof ShotstackSchema,
		typeof shotstackEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalShotstackPlugin =
	BaseShotstackPlugin<ShotstackPluginOptions>;

export type ExternalShotstackPlugin<T extends ShotstackPluginOptions> =
	BaseShotstackPlugin<T>;

export function shotstack<const T extends ShotstackPluginOptions>(
	incomingOptions: ShotstackPluginOptions & T = {} as ShotstackPluginOptions &
		T,
): ExternalShotstackPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'shotstack',
		schema: ShotstackSchema,
		options: options,
		hooks: options.hooks,
		endpoints: shotstackEndpointsNested,
		webhooks: {},
		endpointMeta: shotstackEndpointMeta,
		endpointSchemas: shotstackEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ShotstackKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('shotstack', ctx.authType ?? 'api_key');
		},
	} satisfies InternalShotstackPlugin;
}

export { ShotstackAPIError } from './client';

export type {
	AssetAttributes,
	GenerationModel,
	GenerationResponse,
	MergeFieldInput,
	OutputInput,
	ShotstackEndpointInputs,
	ShotstackEndpointOutputs,
	SourceAttributes,
	TimelineInput,
} from './endpoints/types';
