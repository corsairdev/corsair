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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Assets,
	Generations,
	Purges,
	Reports,
	Sources,
	UploadSessions,
} from './endpoints';
import type {
	ImgixEndpointInputs,
	ImgixEndpointOutputs,
} from './endpoints/types';
import {
	ImgixEndpointInputSchemas,
	ImgixEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ImgixSchema } from './schema';

export type ImgixPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalImgixPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof imgixEndpointsNested>;
};

export type ImgixContext = CorsairPluginContext<
	typeof ImgixSchema,
	ImgixPluginOptions
>;

export type ImgixKeyBuilderContext = KeyBuilderContext<ImgixPluginOptions>;

export type ImgixBoundEndpoints = BindEndpoints<typeof imgixEndpointsNested>;

type ImgixEndpoint<K extends keyof ImgixEndpointOutputs> = CorsairEndpoint<
	ImgixContext,
	ImgixEndpointInputs[K],
	ImgixEndpointOutputs[K]
>;

export type ImgixEndpoints = {
	'sources.list': ImgixEndpoint<'sources.list'>;
	'sources.create': ImgixEndpoint<'sources.create'>;
	'sources.get': ImgixEndpoint<'sources.get'>;
	'sources.update': ImgixEndpoint<'sources.update'>;
	'assets.list': ImgixEndpoint<'assets.list'>;
	'assets.get': ImgixEndpoint<'assets.get'>;
	'assets.update': ImgixEndpoint<'assets.update'>;
	'assets.addFromOrigin': ImgixEndpoint<'assets.addFromOrigin'>;
	'assets.upload': ImgixEndpoint<'assets.upload'>;
	'uploadSessions.create': ImgixEndpoint<'uploadSessions.create'>;
	'uploadSessions.getStatus': ImgixEndpoint<'uploadSessions.getStatus'>;
	'uploadSessions.close': ImgixEndpoint<'uploadSessions.close'>;
	'uploadSessions.cancel': ImgixEndpoint<'uploadSessions.cancel'>;
	'purges.create': ImgixEndpoint<'purges.create'>;
	'reports.list': ImgixEndpoint<'reports.list'>;
	'reports.get': ImgixEndpoint<'reports.get'>;
	'generations.createVideo': ImgixEndpoint<'generations.createVideo'>;
	'generations.getVideoJob': ImgixEndpoint<'generations.getVideoJob'>;
	'generations.getAltText': ImgixEndpoint<'generations.getAltText'>;
	'generations.overrideAltText': ImgixEndpoint<'generations.overrideAltText'>;
};

const imgixEndpointsNested = {
	sources: {
		list: Sources.list,
		create: Sources.create,
		get: Sources.get,
		update: Sources.update,
	},
	assets: {
		list: Assets.list,
		get: Assets.get,
		update: Assets.update,
		addFromOrigin: Assets.addFromOrigin,
		upload: Assets.upload,
	},
	uploadSessions: {
		create: UploadSessions.create,
		getStatus: UploadSessions.getStatus,
		close: UploadSessions.close,
		cancel: UploadSessions.cancel,
	},
	purges: {
		create: Purges.create,
	},
	reports: {
		list: Reports.list,
		get: Reports.get,
	},
	generations: {
		createVideo: Generations.createVideo,
		getVideoJob: Generations.getVideoJob,
		getAltText: Generations.getAltText,
		overrideAltText: Generations.overrideAltText,
	},
} as const;

export const imgixEndpointSchemas = {
	'sources.list': {
		input: ImgixEndpointInputSchemas['sources.list'],
		output: ImgixEndpointOutputSchemas['sources.list'],
	},
	'sources.create': {
		input: ImgixEndpointInputSchemas['sources.create'],
		output: ImgixEndpointOutputSchemas['sources.create'],
	},
	'sources.get': {
		input: ImgixEndpointInputSchemas['sources.get'],
		output: ImgixEndpointOutputSchemas['sources.get'],
	},
	'sources.update': {
		input: ImgixEndpointInputSchemas['sources.update'],
		output: ImgixEndpointOutputSchemas['sources.update'],
	},
	'assets.list': {
		input: ImgixEndpointInputSchemas['assets.list'],
		output: ImgixEndpointOutputSchemas['assets.list'],
	},
	'assets.get': {
		input: ImgixEndpointInputSchemas['assets.get'],
		output: ImgixEndpointOutputSchemas['assets.get'],
	},
	'assets.update': {
		input: ImgixEndpointInputSchemas['assets.update'],
		output: ImgixEndpointOutputSchemas['assets.update'],
	},
	'assets.addFromOrigin': {
		input: ImgixEndpointInputSchemas['assets.addFromOrigin'],
		output: ImgixEndpointOutputSchemas['assets.addFromOrigin'],
	},
	'assets.upload': {
		input: ImgixEndpointInputSchemas['assets.upload'],
		output: ImgixEndpointOutputSchemas['assets.upload'],
	},
	'uploadSessions.create': {
		input: ImgixEndpointInputSchemas['uploadSessions.create'],
		output: ImgixEndpointOutputSchemas['uploadSessions.create'],
	},
	'uploadSessions.getStatus': {
		input: ImgixEndpointInputSchemas['uploadSessions.getStatus'],
		output: ImgixEndpointOutputSchemas['uploadSessions.getStatus'],
	},
	'uploadSessions.close': {
		input: ImgixEndpointInputSchemas['uploadSessions.close'],
		output: ImgixEndpointOutputSchemas['uploadSessions.close'],
	},
	'uploadSessions.cancel': {
		input: ImgixEndpointInputSchemas['uploadSessions.cancel'],
		output: ImgixEndpointOutputSchemas['uploadSessions.cancel'],
	},
	'purges.create': {
		input: ImgixEndpointInputSchemas['purges.create'],
		output: ImgixEndpointOutputSchemas['purges.create'],
	},
	'reports.list': {
		input: ImgixEndpointInputSchemas['reports.list'],
		output: ImgixEndpointOutputSchemas['reports.list'],
	},
	'reports.get': {
		input: ImgixEndpointInputSchemas['reports.get'],
		output: ImgixEndpointOutputSchemas['reports.get'],
	},
	'generations.createVideo': {
		input: ImgixEndpointInputSchemas['generations.createVideo'],
		output: ImgixEndpointOutputSchemas['generations.createVideo'],
	},
	'generations.getVideoJob': {
		input: ImgixEndpointInputSchemas['generations.getVideoJob'],
		output: ImgixEndpointOutputSchemas['generations.getVideoJob'],
	},
	'generations.getAltText': {
		input: ImgixEndpointInputSchemas['generations.getAltText'],
		output: ImgixEndpointOutputSchemas['generations.getAltText'],
	},
	'generations.overrideAltText': {
		input: ImgixEndpointInputSchemas['generations.overrideAltText'],
		output: ImgixEndpointOutputSchemas['generations.overrideAltText'],
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof imgixEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const imgixEndpointMeta = {
	'sources.list': {
		riskLevel: 'read',
		description: 'List all Imgix sources configured for the account',
	},
	'sources.create': {
		riskLevel: 'destructive',
		description: 'Create and deploy a new Imgix storage or web folder source',
	},
	'sources.get': {
		riskLevel: 'read',
		description:
			'Retrieve configuration details and deployment status for a source',
	},
	'sources.update': {
		riskLevel: 'write',
		description:
			'Update an existing Imgix source configuration or deployment settings',
	},
	'assets.list': {
		riskLevel: 'read',
		description: 'List indexed assets for a specific Imgix source',
	},
	'assets.get': {
		riskLevel: 'read',
		description:
			'Retrieve details, technical metadata, and custom fields for an asset',
	},
	'assets.update': {
		riskLevel: 'write',
		description:
			'Update custom fields or metadata for an asset in the Asset Manager',
	},
	'assets.addFromOrigin': {
		riskLevel: 'write',
		description:
			'Queue an existing origin asset to be indexed into the Imgix Asset Manager (imgix answers 202 with no body, returned as {})',
	},
	'assets.upload': {
		riskLevel: 'destructive',
		description:
			'Upload a file directly to the origin via Imgix Asset Manager; with overwrite: true it replaces the existing file at that path',
	},
	'uploadSessions.create': {
		riskLevel: 'write',
		description:
			'Initialize an upload session and receive a presigned URL for large asset upload',
	},
	'uploadSessions.getStatus': {
		riskLevel: 'read',
		description:
			'Retrieve the status of an ongoing or finalized asset upload session',
	},
	'uploadSessions.close': {
		riskLevel: 'write',
		description:
			'Close an upload session to trigger immediate asset processing',
	},
	'uploadSessions.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel an active upload session',
	},
	'purges.create': {
		riskLevel: 'destructive',
		description:
			'Purge an asset and its derived variants from the Imgix CDN edge cache',
	},
	'reports.list': {
		riskLevel: 'read',
		description: 'List available daily CDN logs and credit analytics reports',
	},
	'reports.get': {
		riskLevel: 'read',
		description:
			'Retrieve details, metadata, and downloadable segment URLs for a report',
	},
	'generations.createVideo': {
		riskLevel: 'destructive',
		description:
			'Transform a static image into a video using AI motion generation (consumes AI credits)',
	},
	'generations.getVideoJob': {
		riskLevel: 'read',
		description:
			'Poll the status and retrieve result URL of an asynchronous video generation job',
	},
	'generations.getAltText': {
		// AI generation billed per request (cached languages are free); regenerate also drops manual overrides
		riskLevel: 'destructive',
		description:
			'Generate or retrieve AI alt text for an image (new languages consume AI credits; regenerate replaces stored text and overrides)',
	},
	'generations.overrideAltText': {
		riskLevel: 'write',
		description:
			'Set or remove manual alt-text overrides per language for an image',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof imgixEndpointsNested>;

export const imgixAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseImgixPlugin<T extends ImgixPluginOptions> = CorsairPlugin<
	'imgix',
	typeof ImgixSchema,
	typeof imgixEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalImgixPlugin = BaseImgixPlugin<ImgixPluginOptions>;

export type ExternalImgixPlugin<T extends ImgixPluginOptions> =
	BaseImgixPlugin<T>;

export function imgix<const T extends ImgixPluginOptions>(
	incomingOptions: ImgixPluginOptions & T = {} as ImgixPluginOptions & T,
): ExternalImgixPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'imgix',
		authConfig: imgixAuthConfig,
		schema: ImgixSchema,
		options,
		hooks: options.hooks,
		endpoints: imgixEndpointsNested,
		webhooks: {},
		endpointMeta: imgixEndpointMeta,
		endpointSchemas: imgixEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: ImgixKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('imgix', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('imgix', 'api_key');
			return apiKey;
		},
	} satisfies InternalImgixPlugin;
}

export type {
	AssetsAddFromOriginInput,
	AssetsAddFromOriginOutput,
	AssetsGetInput,
	AssetsGetOutput,
	AssetsListInput,
	AssetsListOutput,
	AssetsUpdateInput,
	AssetsUpdateOutput,
	AssetsUploadInput,
	AssetsUploadOutput,
	GenerationsCreateVideoInput,
	GenerationsCreateVideoOutput,
	GenerationsGetAltTextInput,
	GenerationsGetAltTextOutput,
	GenerationsGetVideoJobInput,
	GenerationsGetVideoJobOutput,
	GenerationsOverrideAltTextInput,
	GenerationsOverrideAltTextOutput,
	ImgixEndpointInputs,
	ImgixEndpointOutputs,
	PurgesCreateInput,
	PurgesCreateOutput,
	ReportsGetInput,
	ReportsGetOutput,
	ReportsListInput,
	ReportsListOutput,
	SourcesCreateInput,
	SourcesCreateOutput,
	SourcesGetInput,
	SourcesGetOutput,
	SourcesListInput,
	SourcesListOutput,
	SourcesUpdateInput,
	SourcesUpdateOutput,
	UploadSessionsCancelInput,
	UploadSessionsCancelOutput,
	UploadSessionsCloseInput,
	UploadSessionsCloseOutput,
	UploadSessionsCreateInput,
	UploadSessionsCreateOutput,
	UploadSessionsGetStatusInput,
	UploadSessionsGetStatusOutput,
} from './endpoints/types';
