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
	AccessEndpoints,
	AssetsEndpoints,
	DomainsEndpoints,
	ProjectsEndpoints,
	SearchEndpoints,
	StudentsEndpoints,
	VideosEndpoints,
} from './endpoints';
import type {
	SpotlightrEndpointInputs,
	SpotlightrEndpointOutputs,
} from './endpoints/types';
import {
	SpotlightrEndpointInputSchemas,
	SpotlightrEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SpotlightrSchema } from './schema';

export type SpotlightrPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSpotlightrPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof spotlightrEndpointsNested>;
};

export type SpotlightrContext = CorsairPluginContext<
	typeof SpotlightrSchema,
	SpotlightrPluginOptions
>;

export type SpotlightrKeyBuilderContext =
	KeyBuilderContext<SpotlightrPluginOptions>;

export type SpotlightrBoundEndpoints = BindEndpoints<
	typeof spotlightrEndpointsNested
>;

type SpotlightrEndpoint<K extends keyof SpotlightrEndpointOutputs> =
	CorsairEndpoint<
		SpotlightrContext,
		SpotlightrEndpointInputs[K],
		SpotlightrEndpointOutputs[K]
	>;

export type SpotlightrEndpoints = {
	videosList: SpotlightrEndpoint<'listVideos'>;
	videosCreate: SpotlightrEndpoint<'createVideo'>;
	videosUpdateSource: SpotlightrEndpoint<'updateVideoSource'>;
	videosDelete: SpotlightrEndpoint<'deleteVideos'>;
	videosListTop: SpotlightrEndpoint<'listTopVideos'>;
	videosMetrics: SpotlightrEndpoint<'getVideoMetrics'>;
	videosViews: SpotlightrEndpoint<'listViews'>;
	videosUpdateSettings: SpotlightrEndpoint<'updatePlayerSettings'>;
	projectsList: SpotlightrEndpoint<'listGroups'>;
	projectsCreate: SpotlightrEndpoint<'createGroup'>;
	domainsList: SpotlightrEndpoint<'listDomains'>;
	domainsAdd: SpotlightrEndpoint<'addDomain'>;
	studentsCreate: SpotlightrEndpoint<'createStudent'>;
	accessGet: SpotlightrEndpoint<'getAccess'>;
	accessUpdate: SpotlightrEndpoint<'updateAccess'>;
	accessUpdateCode: SpotlightrEndpoint<'updateAccessCode'>;
	search: SpotlightrEndpoint<'search'>;
	assetsUpload: SpotlightrEndpoint<'uploadAsset'>;
};

const spotlightrEndpointsNested = {
	videos: {
		list: VideosEndpoints.list,
		create: VideosEndpoints.create,
		updateSource: VideosEndpoints.updateSource,
		delete: VideosEndpoints.delete,
		listTop: VideosEndpoints.listTop,
		metrics: VideosEndpoints.metrics,
		views: VideosEndpoints.views,
		updateSettings: VideosEndpoints.updateSettings,
	},
	projects: {
		list: ProjectsEndpoints.list,
		create: ProjectsEndpoints.create,
	},
	domains: {
		list: DomainsEndpoints.list,
		add: DomainsEndpoints.add,
	},
	students: {
		create: StudentsEndpoints.create,
	},
	access: {
		get: AccessEndpoints.get,
		update: AccessEndpoints.update,
		updateCode: AccessEndpoints.updateCode,
	},
	search: {
		search: SearchEndpoints.search,
	},
	assets: {
		upload: AssetsEndpoints.upload,
	},
} as const;

export const spotlightrEndpointSchemas = {
	'videos.list': {
		input: SpotlightrEndpointInputSchemas.listVideos,
		output: SpotlightrEndpointOutputSchemas.listVideos,
	},
	'videos.create': {
		input: SpotlightrEndpointInputSchemas.createVideo,
		output: SpotlightrEndpointOutputSchemas.createVideo,
	},
	'videos.updateSource': {
		input: SpotlightrEndpointInputSchemas.updateVideoSource,
		output: SpotlightrEndpointOutputSchemas.updateVideoSource,
	},
	'videos.delete': {
		input: SpotlightrEndpointInputSchemas.deleteVideos,
		output: SpotlightrEndpointOutputSchemas.deleteVideos,
	},
	'videos.listTop': {
		input: SpotlightrEndpointInputSchemas.listTopVideos,
		output: SpotlightrEndpointOutputSchemas.listTopVideos,
	},
	'videos.metrics': {
		input: SpotlightrEndpointInputSchemas.getVideoMetrics,
		output: SpotlightrEndpointOutputSchemas.getVideoMetrics,
	},
	'videos.views': {
		input: SpotlightrEndpointInputSchemas.listViews,
		output: SpotlightrEndpointOutputSchemas.listViews,
	},
	'videos.updateSettings': {
		input: SpotlightrEndpointInputSchemas.updatePlayerSettings,
		output: SpotlightrEndpointOutputSchemas.updatePlayerSettings,
	},
	'projects.list': {
		input: SpotlightrEndpointInputSchemas.listGroups,
		output: SpotlightrEndpointOutputSchemas.listGroups,
	},
	'projects.create': {
		input: SpotlightrEndpointInputSchemas.createGroup,
		output: SpotlightrEndpointOutputSchemas.createGroup,
	},
	'domains.list': {
		input: SpotlightrEndpointInputSchemas.listDomains,
		output: SpotlightrEndpointOutputSchemas.listDomains,
	},
	'domains.add': {
		input: SpotlightrEndpointInputSchemas.addDomain,
		output: SpotlightrEndpointOutputSchemas.addDomain,
	},
	'students.create': {
		input: SpotlightrEndpointInputSchemas.createStudent,
		output: SpotlightrEndpointOutputSchemas.createStudent,
	},
	'access.get': {
		input: SpotlightrEndpointInputSchemas.getAccess,
		output: SpotlightrEndpointOutputSchemas.getAccess,
	},
	'access.update': {
		input: SpotlightrEndpointInputSchemas.updateAccess,
		output: SpotlightrEndpointOutputSchemas.updateAccess,
	},
	'access.updateCode': {
		input: SpotlightrEndpointInputSchemas.updateAccessCode,
		output: SpotlightrEndpointOutputSchemas.updateAccessCode,
	},
	'search.search': {
		input: SpotlightrEndpointInputSchemas.search,
		output: SpotlightrEndpointOutputSchemas.search,
	},
	'assets.upload': {
		input: SpotlightrEndpointInputSchemas.uploadAsset,
		output: SpotlightrEndpointOutputSchemas.uploadAsset,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof spotlightrEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const spotlightrEndpointMeta = {
	'videos.list': {
		riskLevel: 'read',
		description:
			'List videos (1000 a page), or one video by numeric ID, optionally narrowed to a project',
	},
	'videos.create': {
		riskLevel: 'write',
		description:
			'Create a video from a hosted link or an uploaded file, optionally copying player settings from another video. Takes the file as a public link, base64 or a Blob; on Corsair, pass a Files id.',
	},
	'videos.updateSource': {
		// Overwrites the video's source; the old URL is not kept anywhere.
		riskLevel: 'destructive',
		description:
			'Point an existing video at a new source URL, replacing the old source',
	},
	'videos.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one or more videos; there is no restore route',
	},
	'videos.listTop': {
		riskLevel: 'read',
		description: 'List the most-watched videos over a window of days',
	},
	'videos.metrics': {
		riskLevel: 'read',
		description: 'Read a video load, play, watch and share counts',
	},
	'videos.views': {
		riskLevel: 'read',
		description:
			'List a video views (30 a page), optionally for one known viewer or only those past one percent watched',
	},
	'videos.updateSettings': {
		riskLevel: 'write',
		description: 'Change individual player settings on a video',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects (video groups) on the account',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project to file videos under',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'List the domains a video may be embedded on',
	},
	'domains.add': {
		riskLevel: 'write',
		description: 'Allow one more domain to embed your videos',
	},
	'students.create': {
		riskLevel: 'write',
		description: 'Create a course or gallery student with an access record',
	},
	'access.get': {
		riskLevel: 'read',
		description: 'Read a student access record for one course',
	},
	'access.update': {
		riskLevel: 'write',
		description: 'Expire a student access record',
	},
	'access.updateCode': {
		riskLevel: 'write',
		description: 'Expire a gallery access code',
	},
	'search.search': {
		riskLevel: 'read',
		description: 'Search videos, projects and other objects on the account',
	},
	'assets.upload': {
		riskLevel: 'write',
		description:
			'Upload an asset file to the account library. Takes the file as a public link, base64 or a Blob; on Corsair, pass a Files id.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof spotlightrEndpointsNested
>;

export type BaseSpotlightrPlugin<T extends SpotlightrPluginOptions> =
	CorsairPlugin<
		'spotlightr',
		typeof SpotlightrSchema,
		typeof spotlightrEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalSpotlightrPlugin =
	BaseSpotlightrPlugin<SpotlightrPluginOptions>;

export type ExternalSpotlightrPlugin<T extends SpotlightrPluginOptions> =
	BaseSpotlightrPlugin<T>;

export function spotlightr<const T extends SpotlightrPluginOptions>(
	incomingOptions: SpotlightrPluginOptions & T = {} as SpotlightrPluginOptions &
		T,
): ExternalSpotlightrPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'spotlightr',
		schema: SpotlightrSchema,
		options: options,
		hooks: options.hooks,
		endpoints: spotlightrEndpointsNested,
		webhooks: {},
		endpointMeta: spotlightrEndpointMeta,
		endpointSchemas: spotlightrEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SpotlightrKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('spotlightr', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSpotlightrPlugin;
}

export { SpotlightrAPIError } from './client';

export type {
	CreateGroupInput,
	CreateStudentInput,
	CreateVideoInput,
	GroupOutput,
	SpotlightrEndpointInputs,
	SpotlightrEndpointOutputs,
	VideoMetricsOutput,
	VideoOutput,
	VideosOutput,
	ViewOutput,
	WriteResultOutput,
} from './endpoints/types';
