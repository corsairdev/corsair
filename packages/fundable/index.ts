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
import { tryGetStoredKey } from './client';
import {
	Alerts,
	Companies,
	Deals,
	Filters,
	Investors,
	People,
} from './endpoints';
import type {
	FundableEndpointInputs,
	FundableEndpointOutputs,
} from './endpoints/types';
import {
	FundableEndpointInputSchemas,
	FundableEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FundableSchema } from './schema';

export type FundablePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFundablePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fundableEndpointsNested>;
};

export type FundableContext = CorsairPluginContext<
	typeof FundableSchema,
	FundablePluginOptions
>;

export type FundableKeyBuilderContext =
	KeyBuilderContext<FundablePluginOptions>;

export type FundableBoundEndpoints = BindEndpoints<
	typeof fundableEndpointsNested
>;

type FundableEndpoint<K extends keyof FundableEndpointOutputs> =
	CorsairEndpoint<
		FundableContext,
		FundableEndpointInputs[K],
		FundableEndpointOutputs[K]
	>;

export type FundableEndpoints = {
	companies: {
		post: FundableEndpoint<'companies.post'>;
		get: FundableEndpoint<'companies.get'>;
		deals: FundableEndpoint<'companies.deals'>;
		search: FundableEndpoint<'companies.search'>;
	};
	deals: {
		post: FundableEndpoint<'deals.post'>;
		get: FundableEndpoint<'deals.get'>;
		investors: FundableEndpoint<'deals.investors'>;
	};
	investors: {
		post: FundableEndpoint<'investors.post'>;
		get: FundableEndpoint<'investors.get'>;
		deals: FundableEndpoint<'investors.deals'>;
		search: FundableEndpoint<'investors.search'>;
	};
	people: {
		post: FundableEndpoint<'people.post'>;
		get: FundableEndpoint<'people.get'>;
		email: FundableEndpoint<'people.email'>;
		phone: FundableEndpoint<'people.phone'>;
		deals: FundableEndpoint<'people.deals'>;
		search: FundableEndpoint<'people.search'>;
	};
	filters: {
		locations: FundableEndpoint<'filters.locations'>;
		industries: FundableEndpoint<'filters.industries'>;
	};
	alerts: {
		list: FundableEndpoint<'alerts.list'>;
		configurations: FundableEndpoint<'alerts.configurations'>;
	};
};

const fundableEndpointsNested = {
	companies: {
		post: Companies.post,
		get: Companies.get,
		deals: Companies.deals,
		search: Companies.search,
	},
	deals: {
		post: Deals.post,
		get: Deals.get,
		investors: Deals.investors,
	},
	investors: {
		post: Investors.post,
		get: Investors.get,
		deals: Investors.deals,
		search: Investors.search,
	},
	people: {
		post: People.post,
		get: People.get,
		email: People.email,
		phone: People.phone,
		deals: People.deals,
		search: People.search,
	},
	filters: {
		locations: Filters.locations,
		industries: Filters.industries,
	},
	alerts: {
		list: Alerts.list,
		configurations: Alerts.configurations,
	},
} as const;

export const fundableEndpointSchemas = {
	'companies.post': {
		input: FundableEndpointInputSchemas['companies.post'],
		output: FundableEndpointOutputSchemas['companies.post'],
	},
	'companies.get': {
		input: FundableEndpointInputSchemas['companies.get'],
		output: FundableEndpointOutputSchemas['companies.get'],
	},
	'companies.deals': {
		input: FundableEndpointInputSchemas['companies.deals'],
		output: FundableEndpointOutputSchemas['companies.deals'],
	},
	'companies.search': {
		input: FundableEndpointInputSchemas['companies.search'],
		output: FundableEndpointOutputSchemas['companies.search'],
	},
	'deals.post': {
		input: FundableEndpointInputSchemas['deals.post'],
		output: FundableEndpointOutputSchemas['deals.post'],
	},
	'deals.get': {
		input: FundableEndpointInputSchemas['deals.get'],
		output: FundableEndpointOutputSchemas['deals.get'],
	},
	'deals.investors': {
		input: FundableEndpointInputSchemas['deals.investors'],
		output: FundableEndpointOutputSchemas['deals.investors'],
	},
	'investors.post': {
		input: FundableEndpointInputSchemas['investors.post'],
		output: FundableEndpointOutputSchemas['investors.post'],
	},
	'investors.get': {
		input: FundableEndpointInputSchemas['investors.get'],
		output: FundableEndpointOutputSchemas['investors.get'],
	},
	'investors.deals': {
		input: FundableEndpointInputSchemas['investors.deals'],
		output: FundableEndpointOutputSchemas['investors.deals'],
	},
	'investors.search': {
		input: FundableEndpointInputSchemas['investors.search'],
		output: FundableEndpointOutputSchemas['investors.search'],
	},
	'people.post': {
		input: FundableEndpointInputSchemas['people.post'],
		output: FundableEndpointOutputSchemas['people.post'],
	},
	'people.get': {
		input: FundableEndpointInputSchemas['people.get'],
		output: FundableEndpointOutputSchemas['people.get'],
	},
	'people.email': {
		input: FundableEndpointInputSchemas['people.email'],
		output: FundableEndpointOutputSchemas['people.email'],
	},
	'people.phone': {
		input: FundableEndpointInputSchemas['people.phone'],
		output: FundableEndpointOutputSchemas['people.phone'],
	},
	'people.deals': {
		input: FundableEndpointInputSchemas['people.deals'],
		output: FundableEndpointOutputSchemas['people.deals'],
	},
	'people.search': {
		input: FundableEndpointInputSchemas['people.search'],
		output: FundableEndpointOutputSchemas['people.search'],
	},
	'filters.locations': {
		input: FundableEndpointInputSchemas['filters.locations'],
		output: FundableEndpointOutputSchemas['filters.locations'],
	},
	'filters.industries': {
		input: FundableEndpointInputSchemas['filters.industries'],
		output: FundableEndpointOutputSchemas['filters.industries'],
	},
	'alerts.list': {
		input: FundableEndpointInputSchemas['alerts.list'],
		output: FundableEndpointOutputSchemas['alerts.list'],
	},
	'alerts.configurations': {
		input: FundableEndpointInputSchemas['alerts.configurations'],
		output: FundableEndpointOutputSchemas['alerts.configurations'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof fundableEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const fundableEndpointMeta = {
	'companies.post': {
		riskLevel: 'read',
		description:
			'Discover companies with metadata and full latest-deal details',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Get company details and recent funding by identifier',
	},
	'companies.deals': {
		riskLevel: 'read',
		description: "Get a company's complete funding history by identifier",
	},
	'companies.search': {
		riskLevel: 'read',
		description:
			'Fuzzy company lookup by name, domain, LinkedIn, or Crunchbase',
	},
	'deals.post': {
		riskLevel: 'read',
		description: 'Find funding rounds across complete company histories',
	},
	'deals.get': {
		riskLevel: 'read',
		description: 'Get a specific funding round by UUID',
	},
	'deals.investors': {
		riskLevel: 'read',
		description:
			'Full investor lineup for a funding round (firms, angels, leads)',
	},
	'investors.post': {
		riskLevel: 'read',
		description: 'Discover investor firms by attributes and investments',
	},
	'investors.get': {
		riskLevel: 'read',
		description: 'Investor profile, stats, and portfolio summary by identifier',
	},
	'investors.deals': {
		riskLevel: 'read',
		description: "Investor's complete deal history by identifier",
	},
	'investors.search': {
		riskLevel: 'read',
		description:
			'Fuzzy investor lookup by name, domain, LinkedIn, or Crunchbase',
	},
	'people.post': {
		riskLevel: 'read',
		description: 'Discover founders, employees, angels, and lead investors',
	},
	'people.get': {
		riskLevel: 'read',
		description:
			'Full person detail including employment and education by identifier',
	},
	// Spending credits to unlock saved PII: despite using GET, these release
	// contact details the account has paid to reveal and consume credits
	// (`credits_used: 5`), so they are writes, not reads.
	'people.email': {
		riskLevel: 'write',
		description: "Unlock a person's verified email address",
	},
	'people.phone': {
		riskLevel: 'write',
		description: "Unlock a person's verified phone number",
	},
	'people.deals': {
		riskLevel: 'read',
		description: 'Deals a person participated in as an investor',
	},
	'people.search': {
		riskLevel: 'read',
		description: 'Fuzzy person lookup by name or identifier',
	},
	'filters.locations': {
		riskLevel: 'read',
		description: 'Resolve location labels to exact permalinks',
	},
	'filters.industries': {
		riskLevel: 'read',
		description:
			'Resolve industry and super-category labels to exact permalinks',
	},
	'alerts.list': {
		riskLevel: 'read',
		description: 'Saved alert matches with deals and reasoning in a date range',
	},
	'alerts.configurations': {
		riskLevel: 'read',
		description: "Authenticated user's alert configurations",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fundableEndpointsNested>;

export const fundableAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFundablePlugin<T extends FundablePluginOptions> = CorsairPlugin<
	'fundable',
	typeof FundableSchema,
	typeof fundableEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalFundablePlugin = BaseFundablePlugin<FundablePluginOptions>;

export type ExternalFundablePlugin<T extends FundablePluginOptions> =
	BaseFundablePlugin<T>;

function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	overrides?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInRest } = builtIn;
	const { DEFAULT: overrideDefault, ...overrideRest } = overrides ?? {};

	return {
		...builtInRest,
		...overrideRest,
		DEFAULT: overrideDefault ?? builtInDefault,
	};
}

export function fundable<const T extends FundablePluginOptions>(
	incomingOptions: FundablePluginOptions & T = {} as FundablePluginOptions & T,
): ExternalFundablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'fundable',
		authConfig: fundableAuthConfig,
		schema: FundableSchema,
		options,
		hooks: options.hooks,
		endpoints: fundableEndpointsNested,
		// Fundable exposes no inbound webhooks (docs list API-key access
		// only, no webhook verification scheme to model).
		webhooks: {},
		endpointMeta: fundableEndpointMeta,
		endpointSchemas: fundableEndpointSchemas,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		// Mirrors the tpscheck buildkite-style pattern: an explicitly passed
		// key wins, otherwise the stored api_key credential is used. A missing
		// stored key throws AuthMissingError from keyBuilder (the only throw
		// core turns into the account-connect link), so an unconnected tenant
		// gets a connection prompt instead of a bare provider 401.
		keyBuilder: async (ctx: FundableKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('fundable', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalFundablePlugin;
}

export type {
	FundableEndpointInputs,
	FundableEndpointOutputs,
} from './endpoints/types';
