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
import { Account, Routines, Search } from './endpoints';
import type {
	ClayEndpointInputs,
	ClayEndpointOutputs,
} from './endpoints/types';
import {
	ClayEndpointInputSchemas,
	ClayEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClaySchema } from './schema';

export type ClayPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalClayPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof clayEndpointsNested>;
};

export type ClayContext = CorsairPluginContext<
	typeof ClaySchema,
	ClayPluginOptions
>;

export type ClayKeyBuilderContext = KeyBuilderContext<ClayPluginOptions>;

export type ClayBoundEndpoints = BindEndpoints<typeof clayEndpointsNested>;

type ClayEndpoint<K extends keyof ClayEndpointOutputs> = CorsairEndpoint<
	ClayContext,
	ClayEndpointInputs[K],
	ClayEndpointOutputs[K]
>;

export type ClayEndpoints = {
	accountMe: ClayEndpoint<'accountMe'>;
	accountCredits: ClayEndpoint<'accountCredits'>;
	routinesRun: ClayEndpoint<'routinesRun'>;
	routinesGetResults: ClayEndpoint<'routinesGetResults'>;
	searchReference: ClayEndpoint<'searchReference'>;
	searchCreate: ClayEndpoint<'searchCreate'>;
	searchRun: ClayEndpoint<'searchRun'>;
};

const clayEndpointsNested = {
	account: {
		me: Account.me,
		credits: Account.credits,
	},
	routines: {
		run: Routines.run,
		getResults: Routines.getResults,
	},
	search: {
		reference: Search.reference,
		create: Search.create,
		run: Search.run,
	},
} as const;

export const clayEndpointSchemas = {
	'account.me': {
		input: ClayEndpointInputSchemas.accountMe,
		output: ClayEndpointOutputSchemas.accountMe,
	},
	'account.credits': {
		input: ClayEndpointInputSchemas.accountCredits,
		output: ClayEndpointOutputSchemas.accountCredits,
	},
	'routines.run': {
		input: ClayEndpointInputSchemas.routinesRun,
		output: ClayEndpointOutputSchemas.routinesRun,
	},
	'routines.getResults': {
		input: ClayEndpointInputSchemas.routinesGetResults,
		output: ClayEndpointOutputSchemas.routinesGetResults,
	},
	'search.reference': {
		input: ClayEndpointInputSchemas.searchReference,
		output: ClayEndpointOutputSchemas.searchReference,
	},
	'search.create': {
		input: ClayEndpointInputSchemas.searchCreate,
		output: ClayEndpointOutputSchemas.searchCreate,
	},
	'search.run': {
		input: ClayEndpointInputSchemas.searchRun,
		output: ClayEndpointOutputSchemas.searchRun,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof clayEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const clayEndpointMeta = {
	'account.me': {
		riskLevel: 'read',
		description: 'Get the Clay user and workspace for the API key',
	},
	'account.credits': {
		riskLevel: 'read',
		description: 'Get the workspace data credit and action balances',
	},
	'routines.run': {
		riskLevel: 'write',
		description:
			'Run a Clay-managed or custom function routine on 1-100 items; spends credits and returns a routine_run_id',
	},
	'routines.getResults': {
		riskLevel: 'read',
		description:
			'Get progress, or the paginated per-item results, of a routine run',
	},
	'search.reference': {
		riskLevel: 'read',
		description:
			'Get the Clay search query language reference used by search.create',
	},
	'search.create': {
		riskLevel: 'write',
		description:
			"Create a people or company search over Clay's GTM database from a Clay search query",
	},
	'search.run': {
		riskLevel: 'write',
		description:
			"Get the next page of a search's results; each row draws from the workspace search quota",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof clayEndpointsNested>;

export type BaseClayPlugin<T extends ClayPluginOptions> = CorsairPlugin<
	'clay',
	typeof ClaySchema,
	typeof clayEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalClayPlugin = BaseClayPlugin<ClayPluginOptions>;

export type ExternalClayPlugin<T extends ClayPluginOptions> = BaseClayPlugin<T>;

export function clay<const T extends ClayPluginOptions>(
	incomingOptions: ClayPluginOptions & T = {} as ClayPluginOptions & T,
): ExternalClayPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'clay',
		schema: ClaySchema,
		options: options,
		hooks: options.hooks,
		endpoints: clayEndpointsNested,
		webhooks: {},
		endpointMeta: clayEndpointMeta,
		endpointSchemas: clayEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClayKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('clay', 'api_key');
		},
	} satisfies InternalClayPlugin;
}

export type {
	ClayEndpointInputs,
	ClayEndpointOutputs,
	CompanySearchResult,
	CreateSearchInput,
	CreateSearchResponse,
	CreditsInput,
	CreditsResponse,
	GetRunResultsInput,
	GetRunResultsResponse,
	MeInput,
	MeResponse,
	PersonSearchResult,
	RunRoutineInput,
	RunRoutineResponse,
	RunSearchInput,
	RunSearchResponse,
	SearchReferenceInput,
	SearchReferenceResponse,
} from './endpoints/types';
