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
import { Entries } from './endpoints';
import type {
	DictionaryApiEndpointInputs,
	DictionaryApiEndpointOutputs,
} from './endpoints/types';
import {
	DictionaryApiEndpointInputSchemas,
	DictionaryApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DictionaryApiSchema } from './schema';
import { matchDictionaryApiTenantWebhook } from './webhooks/tenant-matcher';

export type DictionaryApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDictionaryApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dictionaryApiEndpointsNested>;
};

export type DictionaryApiContext = CorsairPluginContext<
	typeof DictionaryApiSchema,
	DictionaryApiPluginOptions
>;

export type DictionaryApiKeyBuilderContext =
	KeyBuilderContext<DictionaryApiPluginOptions>;

export type DictionaryApiBoundEndpoints = BindEndpoints<
	typeof dictionaryApiEndpointsNested
>;

type DictionaryApiEndpoint<K extends keyof DictionaryApiEndpointOutputs> =
	CorsairEndpoint<
		DictionaryApiContext,
		DictionaryApiEndpointInputs[K],
		DictionaryApiEndpointOutputs[K]
	>;

export type DictionaryApiEndpoints = {
	entriesGet: DictionaryApiEndpoint<'entriesGet'>;
};

const dictionaryApiEndpointsNested = {
	entries: {
		get: Entries.get,
	},
} as const;

// Merriam-Webster has no webhooks — it is a public read-only API.
const dictionaryApiWebhooksNested = {} as const;

export const dictionaryApiEndpointSchemas = {
	'entries.get': {
		input: DictionaryApiEndpointInputSchemas.entriesGet,
		output: DictionaryApiEndpointOutputSchemas.entriesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dictionaryApiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dictionaryApiEndpointMeta = {
	'entries.get': {
		riskLevel: 'read',
		description:
			'Look up a word in Merriam-Webster Collegiate Dictionary, returning definitions, headword, part of speech, and pronunciations — or spelling suggestions if not found',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dictionaryApiEndpointsNested
>;

export const dictionaryApiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseDictionaryApiPlugin<T extends DictionaryApiPluginOptions> =
	CorsairPlugin<
		'dictionaryapi',
		typeof DictionaryApiSchema,
		typeof dictionaryApiEndpointsNested,
		typeof dictionaryApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDictionaryApiPlugin =
	BaseDictionaryApiPlugin<DictionaryApiPluginOptions>;

export type ExternalDictionaryApiPlugin<T extends DictionaryApiPluginOptions> =
	BaseDictionaryApiPlugin<T>;

export function dictionaryapi<const T extends DictionaryApiPluginOptions>(
	incomingOptions: DictionaryApiPluginOptions &
		T = {} as DictionaryApiPluginOptions & T,
): ExternalDictionaryApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dictionaryapi',
		authConfig: dictionaryApiAuthConfig,
		schema: DictionaryApiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: dictionaryApiEndpointsNested,
		webhooks: dictionaryApiWebhooksNested,
		endpointMeta: dictionaryApiEndpointMeta,
		endpointSchemas: dictionaryApiEndpointSchemas,
		pluginWebhookMatcher: (_request) => false,
		pluginTenantWebhookMatcher: matchDictionaryApiTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DictionaryApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('dictionaryapi', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('dictionaryapi', 'api_key');
		},
	} satisfies InternalDictionaryApiPlugin;
}

export type {
	DictionaryApiEndpointInputs,
	DictionaryApiEndpointOutputs,
	DictionaryEntry,
	DictionaryEntryHeadword,
	DictionaryEntryMeta,
	DictionaryEntryPronunciation,
	GetEntryInput,
	GetEntryOutput,
} from './endpoints/types';
export {
	DictionaryApiEndpointInputSchemas,
	DictionaryApiEndpointOutputSchemas,
	DictionaryEntryHeadwordSchema,
	DictionaryEntryMetaSchema,
	DictionaryEntryPronunciationSchema,
	DictionaryEntrySchema,
	GetEntryInputSchema,
	GetEntryOutputSchema,
} from './endpoints/types';
export { DictionaryApiSchema } from './schema';
export type { DictionaryApiWebhookOutputs } from './webhooks/types';
