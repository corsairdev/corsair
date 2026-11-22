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
	Articles,
	Companies,
	Journalists,
	Limits,
	People,
	Stories,
} from './endpoints';
import type {
	PerigonEndpointInputs,
	PerigonEndpointOutputs,
} from './endpoints/types';
import {
	PerigonEndpointInputSchemas,
	PerigonEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PerigonSchema } from './schema';

export type PerigonPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPerigonPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof perigonEndpointsNested>;
};

export type PerigonContext = CorsairPluginContext<
	typeof PerigonSchema,
	PerigonPluginOptions,
	undefined,
	typeof perigonAuthConfig
>;

export type PerigonKeyBuilderContext = KeyBuilderContext<
	PerigonPluginOptions,
	typeof perigonAuthConfig
>;

export type PerigonBoundEndpoints = BindEndpoints<
	typeof perigonEndpointsNested
>;

type PerigonEndpoint<K extends keyof PerigonEndpointOutputs> = CorsairEndpoint<
	PerigonContext,
	PerigonEndpointInputs[K],
	PerigonEndpointOutputs[K]
>;

export type PerigonEndpoints = {
	[K in keyof PerigonEndpointOutputs]: PerigonEndpoint<K>;
};

const perigonEndpointsNested = {
	articles: {
		list: Articles.list,
	},
	stories: {
		list: Stories.list,
	},
	journalists: {
		list: Journalists.list,
	},
	people: {
		list: People.list,
	},
	companies: {
		list: Companies.list,
	},
	limits: {
		get: Limits.get,
	},
} as const;

export const perigonEndpointSchemas = {
	'articles.list': {
		input: PerigonEndpointInputSchemas.articlesList,
		output: PerigonEndpointOutputSchemas.articlesList,
	},
	'stories.list': {
		input: PerigonEndpointInputSchemas.storiesList,
		output: PerigonEndpointOutputSchemas.storiesList,
	},
	'journalists.list': {
		input: PerigonEndpointInputSchemas.journalistsList,
		output: PerigonEndpointOutputSchemas.journalistsList,
	},
	'people.list': {
		input: PerigonEndpointInputSchemas.peopleList,
		output: PerigonEndpointOutputSchemas.peopleList,
	},
	'companies.list': {
		input: PerigonEndpointInputSchemas.companiesList,
		output: PerigonEndpointOutputSchemas.companiesList,
	},
	'limits.get': {
		input: PerigonEndpointInputSchemas.limitsGet,
		output: PerigonEndpointOutputSchemas.limitsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof perigonEndpointsNested
>;

const perigonEndpointMeta = {
	'articles.list': {
		riskLevel: 'read',
		description:
			'Search news articles: one result per published URL, filterable by query, topic, category, source, country, language and dates',
	},
	'stories.list': {
		riskLevel: 'read',
		description: 'List story clusters: one narrative across many articles',
	},
	'journalists.list': {
		riskLevel: 'read',
		description: 'Search the journalist directory by name or publisher',
	},
	'people.list': {
		riskLevel: 'read',
		description: 'Search resolved person entities',
	},
	'companies.list': {
		riskLevel: 'read',
		description: 'Search resolved company entities',
	},
	'limits.get': {
		riskLevel: 'read',
		description:
			'Read account usage and limits; free to poll and not rate-limited',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof perigonEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const perigonAuthConfig = {
	api_key: {
		// Perigon issues one API key per account; no account-level field is
		// needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePerigonPlugin<T extends PerigonPluginOptions> = CorsairPlugin<
	'perigon',
	typeof PerigonSchema,
	typeof perigonEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof perigonAuthConfig
>;

export type InternalPerigonPlugin = BasePerigonPlugin<PerigonPluginOptions>;

export type ExternalPerigonPlugin<T extends PerigonPluginOptions> =
	BasePerigonPlugin<T>;

export function perigon<const T extends PerigonPluginOptions>(
	incomingOptions: PerigonPluginOptions & T = {} as PerigonPluginOptions & T,
): ExternalPerigonPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'perigon',
		authConfig: perigonAuthConfig,
		schema: PerigonSchema,
		options: options,
		hooks: options.hooks,
		endpoints: perigonEndpointsNested,
		webhooks: {},
		endpointMeta: perigonEndpointMeta,
		endpointSchemas: perigonEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PerigonKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('perigon', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPerigonPlugin;
}

export type {
	Article,
	Company,
	Journalist,
	PerigonEndpointInputs,
	PerigonEndpointOutputs,
	Person,
	Story,
} from './endpoints/types';
