import type {
	AuthTypes,
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
import { News, Organizations, People } from './endpoints';
import type {
	ApolloEndpointInputs,
	ApolloEndpointOutputs,
} from './endpoints/types';
import {
	ApolloEndpointInputSchemas,
	ApolloEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApolloSchema } from './schema';

export type ApolloPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalApolloPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apolloEndpointsNested>;
};

export type ApolloContext = CorsairPluginContext<
	typeof ApolloSchema,
	ApolloPluginOptions
>;

export type ApolloKeyBuilderContext = KeyBuilderContext<ApolloPluginOptions>;

export type ApolloBoundEndpoints = BindEndpoints<typeof apolloEndpointsNested>;

type ApolloEndpoint<K extends keyof ApolloEndpointOutputs> = CorsairEndpoint<
	ApolloContext,
	ApolloEndpointInputs[K],
	ApolloEndpointOutputs[K]
>;

export type ApolloEndpoints = {
	peopleSearch: ApolloEndpoint<'peopleSearch'>;
	peopleEnrich: ApolloEndpoint<'peopleEnrich'>;
	peopleGet: ApolloEndpoint<'peopleGet'>;
	organizationsSearch: ApolloEndpoint<'organizationsSearch'>;
	organizationsEnrich: ApolloEndpoint<'organizationsEnrich'>;
	organizationsGet: ApolloEndpoint<'organizationsGet'>;
	organizationsJobPostings: ApolloEndpoint<'organizationsJobPostings'>;
	newsSearch: ApolloEndpoint<'newsSearch'>;
};

const apolloEndpointsNested = {
	people: {
		search: People.search,
		enrich: People.enrich,
		get: People.get,
	},
	organizations: {
		search: Organizations.search,
		enrich: Organizations.enrich,
		get: Organizations.get,
		jobPostings: Organizations.jobPostings,
	},
	news: {
		search: News.search,
	},
} as const;

export const apolloEndpointSchemas = {
	'people.search': {
		input: ApolloEndpointInputSchemas.peopleSearch,
		output: ApolloEndpointOutputSchemas.peopleSearch,
	},
	'people.enrich': {
		input: ApolloEndpointInputSchemas.peopleEnrich,
		output: ApolloEndpointOutputSchemas.peopleEnrich,
	},
	'people.get': {
		input: ApolloEndpointInputSchemas.peopleGet,
		output: ApolloEndpointOutputSchemas.peopleGet,
	},
	'organizations.search': {
		input: ApolloEndpointInputSchemas.organizationsSearch,
		output: ApolloEndpointOutputSchemas.organizationsSearch,
	},
	'organizations.enrich': {
		input: ApolloEndpointInputSchemas.organizationsEnrich,
		output: ApolloEndpointOutputSchemas.organizationsEnrich,
	},
	'organizations.get': {
		input: ApolloEndpointInputSchemas.organizationsGet,
		output: ApolloEndpointOutputSchemas.organizationsGet,
	},
	'organizations.jobPostings': {
		input: ApolloEndpointInputSchemas.organizationsJobPostings,
		output: ApolloEndpointOutputSchemas.organizationsJobPostings,
	},
	'news.search': {
		input: ApolloEndpointInputSchemas.newsSearch,
		output: ApolloEndpointOutputSchemas.newsSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof apolloEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const apolloEndpointMeta = {
	'people.search': {
		riskLevel: 'read',
		description:
			'Search net-new people by title, seniority, location, and employer filters (redacted profiles, no credits)',
	},
	'people.enrich': {
		riskLevel: 'read',
		description:
			'Enrich a person by name, email, LinkedIn URL, or Apollo id; optionally reveal personal emails and phones',
	},
	'people.get': {
		riskLevel: 'read',
		description: 'Get complete person info by Apollo id',
	},
	'organizations.search': {
		riskLevel: 'read',
		description:
			'Search companies by name, location, size, industry, funding, technology, and hiring filters',
	},
	'organizations.enrich': {
		riskLevel: 'read',
		description: 'Enrich a company by domain, LinkedIn URL, or website',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get complete organization info by Apollo id',
	},
	'organizations.jobPostings': {
		riskLevel: 'read',
		description: "List a company's current job postings",
	},
	'news.search': {
		riskLevel: 'read',
		description:
			'Search news articles about companies by Apollo organization id',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof apolloEndpointsNested>;

export type BaseApolloPlugin<T extends ApolloPluginOptions> = CorsairPlugin<
	'apollo',
	typeof ApolloSchema,
	typeof apolloEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalApolloPlugin = BaseApolloPlugin<ApolloPluginOptions>;

export type ExternalApolloPlugin<T extends ApolloPluginOptions> =
	BaseApolloPlugin<T>;

export function apollo<const T extends ApolloPluginOptions>(
	incomingOptions: ApolloPluginOptions & T = {} as ApolloPluginOptions & T,
): ExternalApolloPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'apollo',
		schema: ApolloSchema,
		options: options,
		hooks: options.hooks,
		endpoints: apolloEndpointsNested,
		webhooks: {},
		endpointMeta: apolloEndpointMeta,
		endpointSchemas: apolloEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ApolloKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('apollo', 'api_key');
		},
	} satisfies InternalApolloPlugin;
}

export type {
	ApolloEndpointInputs,
	ApolloEndpointOutputs,
	IdInput,
	JobPostingsInput,
	JobPostingsResponse,
	NewsArticle,
	NewsSearchInput,
	NewsSearchResponse,
	Organization,
	OrganizationEnrichInput,
	OrganizationResponse,
	OrganizationSearchInput,
	OrganizationSearchResponse,
	PeopleEnrichInput,
	PeopleEnrichResponse,
	PeopleGetResponse,
	PeopleSearchInput,
	PeopleSearchResponse,
	Person,
	SearchPerson,
} from './endpoints/types';
