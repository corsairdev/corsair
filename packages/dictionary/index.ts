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
import { Words } from './endpoints';
import type {
	DictionaryEndpointInputs,
	DictionaryEndpointOutputs,
} from './endpoints/types';
import {
	DictionaryEndpointInputSchemas,
	DictionaryEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DictionarySchema } from './schema';
import { matchDictionaryTenantWebhook } from './webhooks/tenant-matcher';

export type DictionaryPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDictionaryPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Dictionary plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Dictionary endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof dictionaryEndpointsNested>;
};

export type DictionaryContext = CorsairPluginContext<
	typeof DictionarySchema,
	DictionaryPluginOptions
>;

export type DictionaryKeyBuilderContext =
	KeyBuilderContext<DictionaryPluginOptions>;

export type DictionaryBoundEndpoints = BindEndpoints<
	typeof dictionaryEndpointsNested
>;

type DictionaryEndpoint<K extends keyof DictionaryEndpointOutputs> =
	CorsairEndpoint<
		DictionaryContext,
		DictionaryEndpointInputs[K],
		DictionaryEndpointOutputs[K]
	>;

export type DictionaryEndpoints = {
	wordsGet: DictionaryEndpoint<'wordsGet'>;
};

const dictionaryEndpointsNested = {
	words: {
		get: Words.get,
	},
} as const;

// Dictionary has no webhooks — Merriam-Webster is a public read-only API.
const dictionaryWebhooksNested = {} as const;

export const dictionaryEndpointSchemas = {
	'words.get': {
		input: DictionaryEndpointInputSchemas.wordsGet,
		output: DictionaryEndpointOutputSchemas.wordsGet,
	},
} satisfies RequiredPluginEndpointSchemas<typeof dictionaryEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dictionaryEndpointMeta = {
	'words.get': {
		riskLevel: 'read',
		description:
			'Look up a word in the Merriam-Webster Collegiate Dictionary, returning definitions, part of speech, pronunciation, and audio — or spelling suggestions when no entry matches',
	},
} satisfies RequiredPluginEndpointMeta<typeof dictionaryEndpointsNested>;

export const dictionaryAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseDictionaryPlugin<T extends DictionaryPluginOptions> =
	CorsairPlugin<
		'dictionary',
		typeof DictionarySchema,
		typeof dictionaryEndpointsNested,
		typeof dictionaryWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDictionaryPlugin =
	BaseDictionaryPlugin<DictionaryPluginOptions>;

export type ExternalDictionaryPlugin<T extends DictionaryPluginOptions> =
	BaseDictionaryPlugin<T>;

export function dictionary<const T extends DictionaryPluginOptions>(
	incomingOptions: DictionaryPluginOptions & T = {} as DictionaryPluginOptions &
		T,
): ExternalDictionaryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dictionary',
		authConfig: dictionaryAuthConfig,
		schema: DictionarySchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: dictionaryEndpointsNested,
		webhooks: dictionaryWebhooksNested,
		endpointMeta: dictionaryEndpointMeta,
		endpointSchemas: dictionaryEndpointSchemas,
		// Dictionary has no webhooks — no incoming webhook requests to match
		pluginWebhookMatcher: (_request) => false,
		pluginTenantWebhookMatcher: matchDictionaryTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DictionaryKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('dictionary', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('dictionary', 'api_key');
		},
	} satisfies InternalDictionaryPlugin;
}

export type {
	DictionaryEndpointInputs,
	DictionaryEndpointOutputs,
	DictionaryEntry,
	GetWordInput,
	GetWordResponse,
} from './endpoints/types';

export {
	DictionaryEndpointInputSchemas,
	DictionaryEndpointOutputSchemas,
} from './endpoints/types';

export { DictionarySchema } from './schema';

export type { DictionaryWebhookOutputs } from './webhooks/types';
