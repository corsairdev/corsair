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
import { Gammas, Generations, Workspace } from './endpoints';
import type {
	GammaEndpointInputs,
	GammaEndpointOutputs,
} from './endpoints/types';
import {
	GammaEndpointInputSchemas,
	GammaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GammaSchema } from './schema';

export type GammaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGammaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gammaEndpointsNested>;
};

export type GammaContext = CorsairPluginContext<
	typeof GammaSchema,
	GammaPluginOptions
>;

export type GammaKeyBuilderContext = KeyBuilderContext<GammaPluginOptions>;

export type GammaBoundEndpoints = BindEndpoints<typeof gammaEndpointsNested>;

type GammaEndpoint<K extends keyof GammaEndpointOutputs> = CorsairEndpoint<
	GammaContext,
	GammaEndpointInputs[K],
	GammaEndpointOutputs[K]
>;

export type GammaEndpoints = {
	generationsCreate: GammaEndpoint<'generationsCreate'>;
	generationsGet: GammaEndpoint<'generationsGet'>;
	agentGenerate: GammaEndpoint<'agentGenerate'>;
	agentGet: GammaEndpoint<'agentGet'>;
	gammasGet: GammaEndpoint<'gammasGet'>;
	gammasSearch: GammaEndpoint<'gammasSearch'>;
	gammasArchive: GammaEndpoint<'gammasArchive'>;
	gammasRemove: GammaEndpoint<'gammasRemove'>;
	exportsStart: GammaEndpoint<'exportsStart'>;
	exportsGet: GammaEndpoint<'exportsGet'>;
	themesList: GammaEndpoint<'themesList'>;
	foldersList: GammaEndpoint<'foldersList'>;
};

const gammaEndpointsNested = {
	generations: {
		create: Generations.create,
		get: Generations.get,
	},
	agent: {
		generate: Generations.agentCreate,
		get: Generations.agentGet,
	},
	gammas: {
		get: Gammas.get,
		search: Gammas.search,
		archive: Gammas.archive,
		delete: Gammas.remove,
	},
	exports: {
		start: Gammas.exportGamma,
		get: Gammas.exportStatus,
	},
	themes: {
		list: Workspace.themes,
	},
	folders: {
		list: Workspace.folders,
	},
} as const;

export const gammaEndpointSchemas = {
	'generations.create': {
		input: GammaEndpointInputSchemas.generationsCreate,
		output: GammaEndpointOutputSchemas.generationsCreate,
	},
	'generations.get': {
		input: GammaEndpointInputSchemas.generationsGet,
		output: GammaEndpointOutputSchemas.generationsGet,
	},
	'agent.generate': {
		input: GammaEndpointInputSchemas.agentGenerate,
		output: GammaEndpointOutputSchemas.agentGenerate,
	},
	'agent.get': {
		input: GammaEndpointInputSchemas.agentGet,
		output: GammaEndpointOutputSchemas.agentGet,
	},
	'gammas.get': {
		input: GammaEndpointInputSchemas.gammasGet,
		output: GammaEndpointOutputSchemas.gammasGet,
	},
	'gammas.search': {
		input: GammaEndpointInputSchemas.gammasSearch,
		output: GammaEndpointOutputSchemas.gammasSearch,
	},
	'gammas.archive': {
		input: GammaEndpointInputSchemas.gammasArchive,
		output: GammaEndpointOutputSchemas.gammasArchive,
	},
	'gammas.delete': {
		input: GammaEndpointInputSchemas.gammasRemove,
		output: GammaEndpointOutputSchemas.gammasRemove,
	},
	'exports.start': {
		input: GammaEndpointInputSchemas.exportsStart,
		output: GammaEndpointOutputSchemas.exportsStart,
	},
	'exports.get': {
		input: GammaEndpointInputSchemas.exportsGet,
		output: GammaEndpointOutputSchemas.exportsGet,
	},
	'themes.list': {
		input: GammaEndpointInputSchemas.themesList,
		output: GammaEndpointOutputSchemas.themesList,
	},
	'folders.list': {
		input: GammaEndpointInputSchemas.foldersList,
		output: GammaEndpointOutputSchemas.foldersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof gammaEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const gammaEndpointMeta = {
	'generations.create': {
		riskLevel: 'destructive',
		description:
			'Start a Classic generation from text or a `pages` array, at once returning a `generationId` to poll. Spends credits. Use it for webpages and multi-page gammas; the agent route covers a single new presentation',
	},
	'generations.get': {
		riskLevel: 'read',
		description:
			'Where a Classic generation stands: `pending` is not final, `completed` carries the gamma ID, URL and any export URL, `failed` carries the error',
	},
	'agent.generate': {
		riskLevel: 'destructive',
		description:
			'Start a Gamma 5 agent generation from one brief, with a theme, template, quality preset and up to 10 source URLs. Spends credits',
	},
	'agent.get': {
		riskLevel: 'read',
		description:
			'Where an agent generation stands, with the same terminal states as a Classic one',
	},
	'gammas.get': {
		riskLevel: 'read',
		description:
			'One gamma’s title, author, folder, theme, archive state and thumbnail',
	},
	'gammas.search': {
		riskLevel: 'read',
		description:
			'Full-text search over the gammas the caller can read. Needs `q` or a filter (`createdBy`, `updatedAfter`, `updatedBefore`)',
	},
	'gammas.archive': {
		riskLevel: 'write',
		description:
			'Archive a gamma. Idempotent, and reversible from the Gamma app, so it is not destructive',
	},
	'gammas.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a gamma permanently. Needs a workspace admin role',
	},
	'exports.start': {
		riskLevel: 'write',
		description:
			'Start an export of an existing gamma to PDF, PPTX or PNG, returning an `exportId`. A PNG export is a zip of one image per card',
	},
	'exports.get': {
		riskLevel: 'read',
		description:
			'Where an export stands. `completed` carries a download URL that works for anyone holding it, for about a week',
	},
	'themes.list': {
		riskLevel: 'read',
		description:
			'Workspace and official themes, with the ID a generation takes',
	},
	'folders.list': {
		riskLevel: 'read',
		description:
			'The folders the caller can see. Some are view-only, and placing a gamma with `folderId` needs edit access',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gammaEndpointsNested>;

export type BaseGammaPlugin<T extends GammaPluginOptions> = CorsairPlugin<
	'gamma',
	typeof GammaSchema,
	typeof gammaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalGammaPlugin = BaseGammaPlugin<GammaPluginOptions>;

export type ExternalGammaPlugin<T extends GammaPluginOptions> =
	BaseGammaPlugin<T>;

export function gamma<const T extends GammaPluginOptions>(
	incomingOptions: GammaPluginOptions & T = {} as GammaPluginOptions & T,
): ExternalGammaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gamma',
		schema: GammaSchema,
		options,
		hooks: options.hooks,
		endpoints: gammaEndpointsNested,
		webhooks: {},
		endpointMeta: gammaEndpointMeta,
		endpointSchemas: gammaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: GammaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('gamma', ctx.authType ?? 'api_key');
		},
	} satisfies InternalGammaPlugin;
}

export type { GammaErrorInfo } from './client';
export { GammaAPIError, gammaErrorInfo } from './client';

export type {
	AgentGenerateInput,
	AgentGenerationResponse,
	AgentGetInput,
	AgentStatusResponse,
	ArchivedResponse,
	CreateGenerationResponse,
	ExportGetInput,
	ExportStartResponse,
	ExportStatusResponse,
	FoldersListInput,
	FoldersListResponse,
	Gamma,
	GammaArchiveInput,
	GammaEndpointInputs,
	GammaEndpointOutputs,
	GammaExportInput,
	GammaFolder,
	GammaGetInput,
	GammaGetResponse,
	GammaRemoveInput,
	GammaRemoveResponse,
	GammaSearchHit,
	GammasSearchInput,
	GammasSearchResponse,
	GammaTheme,
	GenerationGetInput,
	GenerationStatusResponse,
	GenerationsCreateInput,
	ThemesListInput,
	ThemesListResponse,
} from './endpoints/types';
