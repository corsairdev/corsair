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
import { packDemioCredentials } from './client';
import { demioEndpoints } from './endpoints';
import type {
	DemioEndpointInputs,
	DemioEndpointOutputs,
} from './endpoints/types';
import {
	DemioEndpointInputSchemas,
	DemioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { DemioSchema } from './schema';

export type DemioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The packed credential pair, mainly for tests. */
	key?: string;
	hooks?: InternalDemioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof demioEndpoints>;
};

export type DemioContext = CorsairPluginContext<
	typeof DemioSchema,
	DemioPluginOptions,
	undefined,
	typeof demioAuthConfig
>;

export type DemioKeyBuilderContext = KeyBuilderContext<
	DemioPluginOptions,
	typeof demioAuthConfig
>;

export type DemioBoundEndpoints = BindEndpoints<typeof demioEndpoints>;

type DemioEndpoint<K extends keyof DemioEndpointOutputs> = CorsairEndpoint<
	DemioContext,
	DemioEndpointInputs[K],
	DemioEndpointOutputs[K]
>;

export type DemioEndpoints = {
	[K in keyof DemioEndpointOutputs]: DemioEndpoint<K>;
};

const demioWebhooksNested = {} as const;

export const demioEndpointSchemas = {
	'events.list': {
		input: DemioEndpointInputSchemas.eventsList,
		output: DemioEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: DemioEndpointInputSchemas.eventsGet,
		output: DemioEndpointOutputSchemas.eventsGet,
	},
	'events.getDate': {
		input: DemioEndpointInputSchemas.eventsGetDate,
		output: DemioEndpointOutputSchemas.eventsGetDate,
	},
	'registrations.create': {
		input: DemioEndpointInputSchemas.registrationsCreate,
		output: DemioEndpointOutputSchemas.registrationsCreate,
	},
	'reports.participants': {
		input: DemioEndpointInputSchemas.reportsParticipants,
		output: DemioEndpointOutputSchemas.reportsParticipants,
	},
	'ping.check': {
		input: DemioEndpointInputSchemas.pingCheck,
		output: DemioEndpointOutputSchemas.pingCheck,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof demioEndpoints>;

const demioEndpointMeta = {
	'events.list': {
		riskLevel: 'read',
		description: 'List events, each collapsed to one representative date',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Read one event with every date the filter allowed',
	},
	'events.getDate': {
		riskLevel: 'read',
		description: 'Read one date of an event',
	},
	// Registering a person adds them to an event and sends them a join link, so
	// it changes state at Demio even though the plugin only reads the answer.
	'registrations.create': {
		riskLevel: 'write',
		description:
			'Register a person for an event date and return their join link',
	},
	'reports.participants': {
		riskLevel: 'read',
		description:
			'List who registered for a date, whether they attended, and their custom fields',
	},
	'ping.check': {
		riskLevel: 'read',
		description: 'Check that the API key and secret are accepted',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof demioEndpoints>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const demioAuthConfig = {
	api_key: {
		// Demio issues a key and a secret from Account Settings > API and every
		// request carries both. The key manager only builds accessors for fields
		// declared here, so the secret has to sit beside the key or it cannot be
		// read at all.
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDemioPlugin<T extends DemioPluginOptions> = CorsairPlugin<
	'demio',
	typeof DemioSchema,
	typeof demioEndpoints,
	typeof demioWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof demioAuthConfig
>;

export type InternalDemioPlugin = BaseDemioPlugin<DemioPluginOptions>;

export type ExternalDemioPlugin<T extends DemioPluginOptions> =
	BaseDemioPlugin<T>;

export function demio<const T extends DemioPluginOptions>(
	incomingOptions: DemioPluginOptions & T = {} as DemioPluginOptions & T,
): ExternalDemioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'demio',
		authConfig: demioAuthConfig,
		schema: DemioSchema,
		options,
		hooks: options.hooks,
		endpoints: demioEndpoints,
		// Demio sends no inbound webhooks: its API is pull-only and offers no
		// registration call, so there is nothing to match or verify.
		webhooks: demioWebhooksNested,
		endpointMeta: demioEndpointMeta,
		endpointSchemas: demioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DemioKeyBuilderContext) => {
			if (options.key) return options.key;

			if (ctx.authType !== 'api_key') {
				throw new AuthMissingError('demio', 'api_key');
			}

			const [apiKey, apiSecret] = await Promise.all([
				ctx.keys.get_api_key(),
				ctx.keys.get_api_secret(),
			]);

			// Demio rejects a request that carries one without the other, so a
			// half-configured account is treated as no account at all.
			if (!apiKey || !apiSecret) {
				throw new AuthMissingError('demio', 'api_key');
			}

			return packDemioCredentials({ apiKey, apiSecret });
		},
	} satisfies InternalDemioPlugin;
}

export type { DemioCredentials } from './client';
export { packDemioCredentials, parseDemioCredentials } from './client';
export type {
	DemioEndpointInputs,
	DemioEndpointOutputs,
	DemioEventsGetDateInput,
	DemioEventsGetDateResponse,
	DemioEventsGetInput,
	DemioEventsGetResponse,
	DemioEventsListInput,
	DemioEventsListResponse,
	DemioRegistrationsCreateInput,
	DemioRegistrationsCreateResponse,
	DemioReportsParticipantsInput,
	DemioReportsParticipantsResponse,
} from './endpoints/types';
export { mergeErrorHandlers } from './error-handlers';
