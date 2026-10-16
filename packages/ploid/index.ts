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
import { Account, Contacts, Person, Search } from './endpoints';
import type {
	PloidEndpointInputs,
	PloidEndpointOutputs,
} from './endpoints/types';
import {
	PloidEndpointInputSchemas,
	PloidEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PloidSchema } from './schema';

export type PloidPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * API origin. Defaults to `https://api.ploid.com`. Ploid documents no
	 * sandbox; override only for a proxy that speaks the same contract.
	 */
	baseUrl?: string;
	hooks?: InternalPloidPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ploidEndpointsNested>;
};

export type PloidContext = CorsairPluginContext<
	typeof PloidSchema,
	PloidPluginOptions
>;

export type PloidKeyBuilderContext = KeyBuilderContext<PloidPluginOptions>;

export type PloidBoundEndpoints = BindEndpoints<typeof ploidEndpointsNested>;

type PloidEndpoint<K extends keyof PloidEndpointOutputs> = CorsairEndpoint<
	PloidContext,
	PloidEndpointInputs[K],
	PloidEndpointOutputs[K]
>;

export type PloidEndpoints = {
	search: PloidEndpoint<'search'>;
	searchCandidates: PloidEndpoint<'searchCandidates'>;
	resolve: PloidEndpoint<'resolve'>;
	person: PloidEndpoint<'person'>;
	personRun: PloidEndpoint<'personRun'>;
	cancelPersonRun: PloidEndpoint<'cancelPersonRun'>;
	enrich: PloidEndpoint<'enrich'>;
	accountCredits: PloidEndpoint<'accountCredits'>;
	accountUsage: PloidEndpoint<'accountUsage'>;
};

const ploidEndpointsNested = {
	search: {
		search: Search.search,
		candidates: Search.candidates,
	},
	person: {
		resolve: Person.resolve,
		get: Person.get,
		getRun: Person.getRun,
		cancelRun: Person.cancelRun,
	},
	contacts: {
		enrich: Contacts.enrich,
	},
	account: {
		credits: Account.credits,
		usage: Account.usage,
	},
} as const;

export const ploidEndpointSchemas = {
	'search.search': {
		input: PloidEndpointInputSchemas.search,
		output: PloidEndpointOutputSchemas.search,
	},
	'search.candidates': {
		input: PloidEndpointInputSchemas.searchCandidates,
		output: PloidEndpointOutputSchemas.searchCandidates,
	},
	'person.resolve': {
		input: PloidEndpointInputSchemas.resolve,
		output: PloidEndpointOutputSchemas.resolve,
	},
	'person.get': {
		input: PloidEndpointInputSchemas.person,
		output: PloidEndpointOutputSchemas.person,
	},
	'person.getRun': {
		input: PloidEndpointInputSchemas.personRun,
		output: PloidEndpointOutputSchemas.personRun,
	},
	'person.cancelRun': {
		input: PloidEndpointInputSchemas.cancelPersonRun,
		output: PloidEndpointOutputSchemas.cancelPersonRun,
	},
	'contacts.enrich': {
		input: PloidEndpointInputSchemas.enrich,
		output: PloidEndpointOutputSchemas.enrich,
	},
	'account.credits': {
		input: PloidEndpointInputSchemas.accountCredits,
		output: PloidEndpointOutputSchemas.accountCredits,
	},
	'account.usage': {
		input: PloidEndpointInputSchemas.accountUsage,
		output: PloidEndpointOutputSchemas.accountUsage,
	},
} satisfies RequiredPluginEndpointSchemas<typeof ploidEndpointsNested>;

const ploidEndpointMeta = {
	'search.search': {
		riskLevel: 'write',
		description:
			'Search people by semantic query and hard filters; up to 150 results inline, larger or async searches hand off to a People Set (202)',
	},
	'search.candidates': {
		riskLevel: 'write',
		description:
			'Find candidate identities in the people index for 1 ACU, including zero matches',
	},
	'person.resolve': {
		riskLevel: 'write',
		description:
			'Identify one person from a name plus a clue and return the permanent person_id; 2 ACU when found, free when not',
	},
	'person.get': {
		riskLevel: 'write',
		description:
			'Fetch a reviewed deep person profile (25 ACU first profile) or start a durable research run (202)',
	},
	'person.getRun': {
		riskLevel: 'read',
		description: 'Poll a person research run by id; 404 unknown, 410 expired',
	},
	'person.cancelRun': {
		riskLevel: 'destructive',
		description: 'Cancel a queued or running person research run',
	},
	'contacts.enrich': {
		riskLevel: 'write',
		description:
			'Resolve contact fields (work_email 1, personal_email 3, phone 10 ACU per hit) from a person_id, LinkedIn URL, email, or name plus company domain',
	},
	'account.credits': {
		riskLevel: 'read',
		description: 'Read the workspace ACU balance and API key budget state',
	},
	'account.usage': {
		riskLevel: 'read',
		description:
			'Read workspace ACU usage plus the calling key id and active key count',
	},
} satisfies RequiredPluginEndpointMeta<typeof ploidEndpointsNested>;

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

const defaultAuthType: AuthTypes = 'api_key' as const;

export const ploidAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePloidPlugin<T extends PloidPluginOptions> = CorsairPlugin<
	'ploid',
	typeof PloidSchema,
	typeof ploidEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof ploidAuthConfig
>;

export type InternalPloidPlugin = BasePloidPlugin<PloidPluginOptions>;

export type ExternalPloidPlugin<T extends PloidPluginOptions> =
	BasePloidPlugin<T>;

export function ploid<const T extends PloidPluginOptions>(
	// Empty options still have to satisfy the caller's T. There is no value
	// that is both `{}` and an arbitrary T, so the default is asserted.
	incomingOptions: PloidPluginOptions & T = {} as PloidPluginOptions & T,
): ExternalPloidPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'ploid',
		schema: PloidSchema,
		options,
		hooks: options.hooks,
		endpoints: ploidEndpointsNested,
		webhooks: {},
		endpointMeta: ploidEndpointMeta,
		endpointSchemas: ploidEndpointSchemas,
		authConfig: ploidAuthConfig,
		// Ploid has no inbound webhook system: async People Sets accept a
		// webhook_url passthrough with no documented signature scheme, and
		// person runs are polled. Routing is left to the app.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PloidKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('ploid', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('ploid', 'api_key');
		},
	} satisfies InternalPloidPlugin;
}

export { PloidAPIError } from './client';
export type {
	AccountCreditsResponse,
	AccountUsageResponse,
	EnrichInput,
	EnrichResponse,
	PersonInput,
	PersonOrRunResponse,
	PersonResponse,
	PersonRunInput,
	PersonRunResponse,
	PloidEndpointInputs,
	PloidEndpointOutputs,
	ResolveInput,
	ResolveResponse,
	SearchCandidatesInput,
	SearchCandidatesResponse,
	SearchInput,
	SearchResponse,
} from './endpoints/types';
export {
	PloidEndpointInputSchemas,
	PloidEndpointOutputSchemas,
} from './endpoints/types';
export type { ContactField, Person } from './schema/database';
