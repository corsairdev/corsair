import type {
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
import { Account, Forest, Projects, Trees } from './endpoints';
import type {
	MoreTreesEndpointInputs,
	MoreTreesEndpointOutputs,
} from './endpoints/types';
import {
	MoreTreesEndpointInputSchemas,
	MoreTreesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MoreTreesSchema } from './schema';

export type MoreTreesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The More Trees API key, from Settings > Account Settings. */
	key?: string;
	/** The account code, from Settings > Account Settings. */
	accountCode?: string;
	hooks?: InternalMoreTreesPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof moreTreesEndpointsNested>;
};

export type MoreTreesContext = CorsairPluginContext<
	typeof MoreTreesSchema,
	MoreTreesPluginOptions,
	undefined,
	typeof moreTreesAuthConfig
>;

export type MoreTreesKeyBuilderContext = KeyBuilderContext<
	MoreTreesPluginOptions,
	typeof moreTreesAuthConfig
>;

export type MoreTreesBoundEndpoints = BindEndpoints<
	typeof moreTreesEndpointsNested
>;

type MoreTreesEndpoint<K extends keyof MoreTreesEndpointOutputs> =
	CorsairEndpoint<
		MoreTreesContext,
		MoreTreesEndpointInputs[K],
		MoreTreesEndpointOutputs[K]
	>;

export type MoreTreesEndpoints = {
	accountGet: MoreTreesEndpoint<'accountGet'>;
	forestGet: MoreTreesEndpoint<'forestGet'>;
	projectsList: MoreTreesEndpoint<'projectsList'>;
	projectsCalculateCo2: MoreTreesEndpoint<'projectsCalculateCo2'>;
	treesPlant: MoreTreesEndpoint<'treesPlant'>;
};

const moreTreesEndpointsNested = {
	account: {
		get: Account.getAccount,
	},
	forest: {
		get: Forest.get,
	},
	projects: {
		list: Projects.list,
		calculateCo2: Projects.calculateCo2,
	},
	trees: {
		plant: Trees.plant,
	},
} as const;

export const moreTreesEndpointSchemas = {
	'account.get': {
		input: MoreTreesEndpointInputSchemas.accountGet,
		output: MoreTreesEndpointOutputSchemas.accountGet,
	},
	'forest.get': {
		input: MoreTreesEndpointInputSchemas.forestGet,
		output: MoreTreesEndpointOutputSchemas.forestGet,
	},
	'projects.list': {
		input: MoreTreesEndpointInputSchemas.projectsList,
		output: MoreTreesEndpointOutputSchemas.projectsList,
	},
	'projects.calculateCo2': {
		input: MoreTreesEndpointInputSchemas.projectsCalculateCo2,
		output: MoreTreesEndpointOutputSchemas.projectsCalculateCo2,
	},
	'trees.plant': {
		input: MoreTreesEndpointInputSchemas.treesPlant,
		output: MoreTreesEndpointOutputSchemas.treesPlant,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof moreTreesEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const moreTreesEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Read one account: name, credit balance, forest name and slug',
	},
	'forest.get': {
		riskLevel: 'read',
		description:
			'Read one virtual forest: branding plus planted, gifted and received tree totals and CO2 captured',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List every active planting project with country, supplier and the trees you can plant in it',
	},
	'projects.calculateCo2': {
		riskLevel: 'read',
		description:
			'Calculate the CO2 captured and projects supported for a set of tree counts; plants nothing',
	},
	'trees.plant': {
		riskLevel: 'destructive',
		description:
			'Plant trees from the payment account for yourself or as gifts; spends credits unless test mode is on',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof moreTreesEndpointsNested
>;

/**
 * More Trees authenticates with a single X-API-KEY header. The account code
 * (not a secret) selects the payment account and is stored on the account.
 * The project routes answer without a key (probed 11-26); the plugin sends
 * the key anyway.
 */
export const moreTreesAuthConfig = {
	api_key: {
		account: ['account_code'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMoreTreesPlugin<T extends MoreTreesPluginOptions> =
	CorsairPlugin<
		'moretrees',
		typeof MoreTreesSchema,
		typeof moreTreesEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof moreTreesAuthConfig
	>;

export type InternalMoreTreesPlugin =
	BaseMoreTreesPlugin<MoreTreesPluginOptions>;

export type ExternalMoreTreesPlugin<T extends MoreTreesPluginOptions> =
	BaseMoreTreesPlugin<T>;

export function moretrees<const T extends MoreTreesPluginOptions>(
	incomingOptions: MoreTreesPluginOptions & T = {} as MoreTreesPluginOptions &
		T,
): ExternalMoreTreesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'moretrees',
		schema: MoreTreesSchema,
		options: options,
		hooks: options.hooks,
		endpoints: moreTreesEndpointsNested,
		webhooks: {},
		authConfig: moreTreesAuthConfig,
		endpointMeta: moreTreesEndpointMeta,
		endpointSchemas: moreTreesEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MoreTreesKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('moretrees', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMoreTreesPlugin;
}

export type {
	AccountGetInput,
	AccountGetResponse,
	ForestGetInput,
	ForestGetResponse,
	MoreTreesEndpointInputs,
	MoreTreesEndpointOutputs,
	ProjectsCalculateCo2Input,
	ProjectsCalculateCo2Response,
	ProjectsListInput,
	ProjectsListResponse,
	TreesPlantInput,
	TreesPlantOthersInput,
	TreesPlantResponse,
	TreesPlantSelfInput,
} from './endpoints/types';
