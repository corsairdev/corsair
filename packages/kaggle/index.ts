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
import { Competitions, Datasets, Kernels, Models } from './endpoints';
import type {
	KaggleEndpointInputs,
	KaggleEndpointOutputs,
} from './endpoints/types';
import {
	KaggleEndpointInputSchemas,
	KaggleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KaggleSchema } from './schema';

export type KagglePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Credential secret: `username:key` (legacy) or bare API token (Bearer). */
	key?: string;
	/** Optional username when `key` is only the API key (not `username:key`). */
	username?: string;
	hooks?: InternalKagglePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kaggleEndpointsNested>;
};

export type KaggleContext = CorsairPluginContext<
	typeof KaggleSchema,
	KagglePluginOptions
>;

export type KaggleKeyBuilderContext = KeyBuilderContext<KagglePluginOptions>;

export type KaggleBoundEndpoints = BindEndpoints<typeof kaggleEndpointsNested>;

type KaggleEndpoint<K extends keyof KaggleEndpointOutputs> = CorsairEndpoint<
	KaggleContext,
	KaggleEndpointInputs[K],
	KaggleEndpointOutputs[K]
>;

export type KaggleEndpoints = {
	datasetsList: KaggleEndpoint<'datasetsList'>;
	datasetsCreate: KaggleEndpoint<'datasetsCreate'>;
	datasetsCreateVersion: KaggleEndpoint<'datasetsCreateVersion'>;
	datasetsGetMetadata: KaggleEndpoint<'datasetsGetMetadata'>;
	datasetsGetStatus: KaggleEndpoint<'datasetsGetStatus'>;
	datasetsListFiles: KaggleEndpoint<'datasetsListFiles'>;
	datasetsDownload: KaggleEndpoint<'datasetsDownload'>;
	datasetsDownloadFile: KaggleEndpoint<'datasetsDownloadFile'>;

	competitionsList: KaggleEndpoint<'competitionsList'>;
	competitionsListFiles: KaggleEndpoint<'competitionsListFiles'>;
	competitionsDownloadFiles: KaggleEndpoint<'competitionsDownloadFiles'>;
	competitionsDownloadFile: KaggleEndpoint<'competitionsDownloadFile'>;
	competitionsViewLeaderboard: KaggleEndpoint<'competitionsViewLeaderboard'>;
	competitionsDownloadLeaderboard: KaggleEndpoint<'competitionsDownloadLeaderboard'>;
	competitionsGenerateSubmissionUrl: KaggleEndpoint<'competitionsGenerateSubmissionUrl'>;
	competitionsSubmit: KaggleEndpoint<'competitionsSubmit'>;

	kernelsList: KaggleEndpoint<'kernelsList'>;
	kernelsPull: KaggleEndpoint<'kernelsPull'>;
	kernelsGetStatus: KaggleEndpoint<'kernelsGetStatus'>;
	kernelsDownloadOutput: KaggleEndpoint<'kernelsDownloadOutput'>;
	kernelsListOutputFiles: KaggleEndpoint<'kernelsListOutputFiles'>;

	modelsList: KaggleEndpoint<'modelsList'>;
	modelsGet: KaggleEndpoint<'modelsGet'>;
	modelsGetInstance: KaggleEndpoint<'modelsGetInstance'>;
	modelsListInstanceVersionFiles: KaggleEndpoint<'modelsListInstanceVersionFiles'>;
};

const kaggleEndpointsNested = {
	datasets: {
		list: Datasets.list,
		create: Datasets.create,
		createVersion: Datasets.createVersion,
		getMetadata: Datasets.getMetadata,
		getStatus: Datasets.getStatus,
		listFiles: Datasets.listFiles,
		download: Datasets.download,
		downloadFile: Datasets.downloadFile,
	},
	competitions: {
		list: Competitions.list,
		listFiles: Competitions.listFiles,
		downloadFiles: Competitions.downloadFiles,
		downloadFile: Competitions.downloadFile,
		viewLeaderboard: Competitions.viewLeaderboard,
		downloadLeaderboard: Competitions.downloadLeaderboard,
		generateSubmissionUrl: Competitions.generateSubmissionUrl,
		submit: Competitions.submit,
	},
	kernels: {
		list: Kernels.list,
		pull: Kernels.pull,
		getStatus: Kernels.getStatus,
		downloadOutput: Kernels.downloadOutput,
		listOutputFiles: Kernels.listOutputFiles,
	},
	models: {
		list: Models.list,
		get: Models.get,
		getInstance: Models.getInstance,
		listInstanceVersionFiles: Models.listInstanceVersionFiles,
	},
} as const;

export const kaggleEndpointSchemas = {
	'datasets.list': {
		input: KaggleEndpointInputSchemas.datasetsList,
		output: KaggleEndpointOutputSchemas.datasetsList,
	},
	'datasets.create': {
		input: KaggleEndpointInputSchemas.datasetsCreate,
		output: KaggleEndpointOutputSchemas.datasetsCreate,
	},
	'datasets.createVersion': {
		input: KaggleEndpointInputSchemas.datasetsCreateVersion,
		output: KaggleEndpointOutputSchemas.datasetsCreateVersion,
	},
	'datasets.getMetadata': {
		input: KaggleEndpointInputSchemas.datasetsGetMetadata,
		output: KaggleEndpointOutputSchemas.datasetsGetMetadata,
	},
	'datasets.getStatus': {
		input: KaggleEndpointInputSchemas.datasetsGetStatus,
		output: KaggleEndpointOutputSchemas.datasetsGetStatus,
	},
	'datasets.listFiles': {
		input: KaggleEndpointInputSchemas.datasetsListFiles,
		output: KaggleEndpointOutputSchemas.datasetsListFiles,
	},
	'datasets.download': {
		input: KaggleEndpointInputSchemas.datasetsDownload,
		output: KaggleEndpointOutputSchemas.datasetsDownload,
	},
	'datasets.downloadFile': {
		input: KaggleEndpointInputSchemas.datasetsDownloadFile,
		output: KaggleEndpointOutputSchemas.datasetsDownloadFile,
	},

	'competitions.list': {
		input: KaggleEndpointInputSchemas.competitionsList,
		output: KaggleEndpointOutputSchemas.competitionsList,
	},
	'competitions.listFiles': {
		input: KaggleEndpointInputSchemas.competitionsListFiles,
		output: KaggleEndpointOutputSchemas.competitionsListFiles,
	},
	'competitions.downloadFiles': {
		input: KaggleEndpointInputSchemas.competitionsDownloadFiles,
		output: KaggleEndpointOutputSchemas.competitionsDownloadFiles,
	},
	'competitions.downloadFile': {
		input: KaggleEndpointInputSchemas.competitionsDownloadFile,
		output: KaggleEndpointOutputSchemas.competitionsDownloadFile,
	},
	'competitions.viewLeaderboard': {
		input: KaggleEndpointInputSchemas.competitionsViewLeaderboard,
		output: KaggleEndpointOutputSchemas.competitionsViewLeaderboard,
	},
	'competitions.downloadLeaderboard': {
		input: KaggleEndpointInputSchemas.competitionsDownloadLeaderboard,
		output: KaggleEndpointOutputSchemas.competitionsDownloadLeaderboard,
	},
	'competitions.generateSubmissionUrl': {
		input: KaggleEndpointInputSchemas.competitionsGenerateSubmissionUrl,
		output: KaggleEndpointOutputSchemas.competitionsGenerateSubmissionUrl,
	},
	'competitions.submit': {
		input: KaggleEndpointInputSchemas.competitionsSubmit,
		output: KaggleEndpointOutputSchemas.competitionsSubmit,
	},

	'kernels.list': {
		input: KaggleEndpointInputSchemas.kernelsList,
		output: KaggleEndpointOutputSchemas.kernelsList,
	},
	'kernels.pull': {
		input: KaggleEndpointInputSchemas.kernelsPull,
		output: KaggleEndpointOutputSchemas.kernelsPull,
	},
	'kernels.getStatus': {
		input: KaggleEndpointInputSchemas.kernelsGetStatus,
		output: KaggleEndpointOutputSchemas.kernelsGetStatus,
	},
	'kernels.downloadOutput': {
		input: KaggleEndpointInputSchemas.kernelsDownloadOutput,
		output: KaggleEndpointOutputSchemas.kernelsDownloadOutput,
	},
	'kernels.listOutputFiles': {
		input: KaggleEndpointInputSchemas.kernelsListOutputFiles,
		output: KaggleEndpointOutputSchemas.kernelsListOutputFiles,
	},

	'models.list': {
		input: KaggleEndpointInputSchemas.modelsList,
		output: KaggleEndpointOutputSchemas.modelsList,
	},
	'models.get': {
		input: KaggleEndpointInputSchemas.modelsGet,
		output: KaggleEndpointOutputSchemas.modelsGet,
	},
	'models.getInstance': {
		input: KaggleEndpointInputSchemas.modelsGetInstance,
		output: KaggleEndpointOutputSchemas.modelsGetInstance,
	},
	'models.listInstanceVersionFiles': {
		input: KaggleEndpointInputSchemas.modelsListInstanceVersionFiles,
		output: KaggleEndpointOutputSchemas.modelsListInstanceVersionFiles,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof kaggleEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const kaggleEndpointMeta = {
	'datasets.list': {
		riskLevel: 'read',
		description:
			'List Kaggle datasets with optional search, owner, size, and pagination filters',
	},
	'datasets.create': {
		riskLevel: 'write',
		description:
			'Create a new Kaggle dataset (requires prior file upload tokens and owner username in id)',
	},
	'datasets.createVersion': {
		riskLevel: 'write',
		description:
			'Create a new version of an existing Kaggle dataset after uploading updated files',
	},
	'datasets.getMetadata': {
		riskLevel: 'read',
		description:
			'Get metadata for a Kaggle dataset including title, licenses, and tags',
	},
	'datasets.getStatus': {
		riskLevel: 'read',
		description:
			'Check processing status after dataset create/version (404 expected when already published)',
	},
	'datasets.listFiles': {
		riskLevel: 'read',
		description:
			'List files in a Kaggle dataset with optional version and pagination',
	},
	'datasets.download': {
		riskLevel: 'read',
		description:
			'Download all files from a Kaggle dataset as a zip (returned as base64)',
	},
	'datasets.downloadFile': {
		riskLevel: 'read',
		description:
			'Download a single file from a Kaggle dataset (returned as base64)',
	},

	'competitions.list': {
		riskLevel: 'read',
		description:
			'List Kaggle competitions with category, group, sort, and search filters',
	},
	'competitions.listFiles': {
		riskLevel: 'read',
		description: 'List data files available for a Kaggle competition',
	},
	'competitions.downloadFiles': {
		riskLevel: 'read',
		description:
			'Download all competition data files as a zip (rules acceptance required)',
	},
	'competitions.downloadFile': {
		riskLevel: 'read',
		description:
			'Download a single competition data file (rules acceptance required)',
	},
	'competitions.viewLeaderboard': {
		riskLevel: 'read',
		description: 'View competition leaderboard rankings and scores',
	},
	'competitions.downloadLeaderboard': {
		riskLevel: 'read',
		description: 'Download the competition leaderboard as a zip/CSV (base64)',
	},
	'competitions.generateSubmissionUrl': {
		riskLevel: 'write',
		description:
			'Generate a pre-signed URL and token for uploading a competition submission file',
	},
	'competitions.submit': {
		riskLevel: 'write',
		description:
			'Finalize a competition submission using a previously uploaded blob file token',
	},

	'kernels.list': {
		riskLevel: 'read',
		description:
			'List Kaggle kernels (notebooks/scripts) with filters and pagination',
	},
	'kernels.pull': {
		riskLevel: 'read',
		description: 'Pull kernel source code and optional metadata from Kaggle',
	},
	'kernels.getStatus': {
		riskLevel: 'read',
		description: 'Get execution status of a Kaggle kernel',
	},
	'kernels.downloadOutput': {
		riskLevel: 'read',
		description:
			'Download kernel session output files as base64 (fetches signed GCS URLs from GET /kernels/output)',
	},
	'kernels.listOutputFiles': {
		riskLevel: 'read',
		description: 'List output files produced by a kernel run',
	},

	'models.list': {
		riskLevel: 'read',
		description:
			'List Kaggle models with optional owner, search, and pagination',
	},
	'models.get': {
		riskLevel: 'read',
		description: 'Get details for a Kaggle model',
	},
	'models.getInstance': {
		riskLevel: 'read',
		description:
			'Get details for a Kaggle model instance (framework variation)',
	},
	'models.listInstanceVersionFiles': {
		riskLevel: 'read',
		description:
			'List files for a specific version of a model instance/variation',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kaggleEndpointsNested>;

export const kaggleAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseKagglePlugin<T extends KagglePluginOptions> = CorsairPlugin<
	'kaggle',
	typeof KaggleSchema,
	typeof kaggleEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof kaggleAuthConfig
>;

export type InternalKagglePlugin = BaseKagglePlugin<KagglePluginOptions>;

export type ExternalKagglePlugin<T extends KagglePluginOptions> =
	BaseKagglePlugin<T>;

// Type assertion required: all KagglePluginOptions fields are optional, so `{}`
// is a valid runtime default, but TypeScript cannot prove `{}` satisfies an
// arbitrary caller-supplied `T extends KagglePluginOptions` without the cast.
export function kaggle<const T extends KagglePluginOptions>(
	incomingOptions: KagglePluginOptions & T = {} as KagglePluginOptions & T,
): ExternalKagglePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'kaggle',
		schema: KaggleSchema,
		options,
		hooks: options.hooks,
		endpoints: kaggleEndpointsNested,
		webhooks: {},
		endpointMeta: kaggleEndpointMeta,
		endpointSchemas: kaggleEndpointSchemas,
		authConfig: kaggleAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// DEFAULT matches everything (`() => true`), so it must always be last.
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: KaggleKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('kaggle', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('kaggle', 'api_key');
		},
	} satisfies InternalKagglePlugin;
}

export type {
	KaggleEndpointInputs,
	KaggleEndpointOutputs,
} from './endpoints/types';

export {
	KaggleEndpointInputSchemas,
	KaggleEndpointOutputSchemas,
} from './endpoints/types';
