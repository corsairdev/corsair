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
	WebhookTree,
} from 'corsair/core';
import { Person } from './endpoints';
import type {
	ChMeetingsEndpointInputs,
	ChMeetingsEndpointOutputs,
} from './endpoints/types';
import {
	ChMeetingsEndpointInputSchemas,
	ChMeetingsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChMeetingsSchema } from './schema';

export type ChMeetingsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalChMeetingsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chMeetingsEndpointsNested>;
};

export type ChMeetingsContext = CorsairPluginContext<
	typeof ChMeetingsSchema,
	ChMeetingsPluginOptions
>;

export type ChMeetingsKeyBuilderContext =
	KeyBuilderContext<ChMeetingsPluginOptions>;

export type ChMeetingsBoundEndpoints = BindEndpoints<
	typeof chMeetingsEndpointsNested
>;

type ChMeetingsEndpoint<K extends keyof ChMeetingsEndpointOutputs> =
	CorsairEndpoint<
		ChMeetingsContext,
		ChMeetingsEndpointInputs[K],
		ChMeetingsEndpointOutputs[K]
	>;

export type ChMeetingsEndpoints = {
	personGet: ChMeetingsEndpoint<'personGet'>;
};

const chMeetingsEndpointsNested = {
	person: {
		get: Person.get,
	},
} as const;

export const chMeetingsEndpointSchemas = {
	'person.get': {
		input: ChMeetingsEndpointInputSchemas.personGet,
		output: ChMeetingsEndpointOutputSchemas.personGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chMeetingsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const chMeetingsEndpointMeta = {
	'person.get': {
		riskLevel: 'read',
		description: 'Get a ChMeetings person by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof chMeetingsEndpointsNested
>;

export const chMeetingsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChMeetingsPlugin<T extends ChMeetingsPluginOptions> =
	CorsairPlugin<
		'chmeetings',
		typeof ChMeetingsSchema,
		typeof chMeetingsEndpointsNested,
		WebhookTree,
		T,
		typeof defaultAuthType
	>;

export type InternalChMeetingsPlugin =
	BaseChMeetingsPlugin<ChMeetingsPluginOptions>;

export type ExternalChMeetingsPlugin<T extends ChMeetingsPluginOptions> =
	BaseChMeetingsPlugin<T>;

export function chmeetings<const T extends ChMeetingsPluginOptions>(
	incomingOptions: ChMeetingsPluginOptions & T = {} as ChMeetingsPluginOptions &
		T,
): ExternalChMeetingsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chmeetings',
		authConfig: chMeetingsAuthConfig,
		schema: ChMeetingsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: chMeetingsEndpointsNested,
		webhooks: {},
		endpointMeta: chMeetingsEndpointMeta,
		endpointSchemas: chMeetingsEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChMeetingsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalChMeetingsPlugin;
}

export type {
	ChMeetingsEndpointInputs,
	ChMeetingsEndpointOutputs,
	Person,
	PersonGetInput,
	PersonGetResponse,
} from './endpoints/types';
