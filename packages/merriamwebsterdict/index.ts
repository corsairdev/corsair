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
import type { MerriamWebsterDictReference } from './client';
import { DEFAULT_MERRIAMWEBSTERDICT_REFERENCE } from './client';
import { Words } from './endpoints';
import type {
	MerriamWebsterDictEndpointInputs,
	MerriamWebsterDictEndpointOutputs,
} from './endpoints/types';
import {
	MerriamWebsterDictEndpointInputSchemas,
	MerriamWebsterDictEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MerriamWebsterDictSchema } from './schema';
import { matchMerriamWebsterDictTenantWebhook } from './webhooks/tenant-matcher';

export type MerriamWebsterDictPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Official product path: collegiate, sd2 (elementary), sd3 (intermediate),
	 * sd4 (school). Keys are product-scoped.
	 * https://www.dictionaryapi.com/api/v3/references/{reference}/json/{word}
	 */
	reference?: MerriamWebsterDictReference;
	hooks?: InternalMerriamWebsterDictPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Merriam-Webster Dictionary plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<
		typeof merriamwebsterdictEndpointsNested
	>;
};

export type MerriamWebsterDictContext = CorsairPluginContext<
	typeof MerriamWebsterDictSchema,
	MerriamWebsterDictPluginOptions
>;

export type MerriamWebsterDictKeyBuilderContext =
	KeyBuilderContext<MerriamWebsterDictPluginOptions>;

export type MerriamWebsterDictBoundEndpoints = BindEndpoints<
	typeof merriamwebsterdictEndpointsNested
>;

type MerriamWebsterDictEndpoint<
	K extends keyof MerriamWebsterDictEndpointOutputs,
> = CorsairEndpoint<
	MerriamWebsterDictContext,
	MerriamWebsterDictEndpointInputs[K],
	MerriamWebsterDictEndpointOutputs[K]
>;

export type MerriamWebsterDictEndpoints = {
	wordsGet: MerriamWebsterDictEndpoint<'wordsGet'>;
};

const merriamwebsterdictEndpointsNested = {
	words: {
		get: Words.get,
	},
} as const;

// Merriam-Webster has no webhooks — it is a public read-only API.
const merriamwebsterdictWebhooksNested = {} as const;

export const merriamwebsterdictEndpointSchemas = {
	'words.get': {
		input: MerriamWebsterDictEndpointInputSchemas.wordsGet,
		output: MerriamWebsterDictEndpointOutputSchemas.wordsGet,
	},
} satisfies RequiredPluginEndpointSchemas<
	typeof merriamwebsterdictEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const merriamwebsterdictEndpointMeta = {
	'words.get': {
		riskLevel: 'read',
		description:
			'Look up a word in Merriam-Webster (collegiate / sd2 / sd3 / sd4), returning definitions, part of speech, pronunciation, etymology, and audio — or spelling suggestions when no entry matches',
	},
} satisfies RequiredPluginEndpointMeta<
	typeof merriamwebsterdictEndpointsNested
>;

export const merriamwebsterdictAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseMerriamWebsterDictPlugin<
	T extends MerriamWebsterDictPluginOptions,
> = CorsairPlugin<
	'merriamwebsterdict',
	typeof MerriamWebsterDictSchema,
	typeof merriamwebsterdictEndpointsNested,
	typeof merriamwebsterdictWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMerriamWebsterDictPlugin =
	BaseMerriamWebsterDictPlugin<MerriamWebsterDictPluginOptions>;

export type ExternalMerriamWebsterDictPlugin<
	T extends MerriamWebsterDictPluginOptions,
> = BaseMerriamWebsterDictPlugin<T>;

export function merriamwebsterdict<
	const T extends MerriamWebsterDictPluginOptions,
>(
	incomingOptions: MerriamWebsterDictPluginOptions &
		T = {} as MerriamWebsterDictPluginOptions & T,
): ExternalMerriamWebsterDictPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		reference:
			incomingOptions.reference ?? DEFAULT_MERRIAMWEBSTERDICT_REFERENCE,
	};
	return {
		id: 'merriamwebsterdict',
		authConfig: merriamwebsterdictAuthConfig,
		schema: MerriamWebsterDictSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: merriamwebsterdictEndpointsNested,
		webhooks: merriamwebsterdictWebhooksNested,
		endpointMeta: merriamwebsterdictEndpointMeta,
		endpointSchemas: merriamwebsterdictEndpointSchemas,
		// No incoming webhook requests to match
		pluginWebhookMatcher: (_request) => false,
		pluginTenantWebhookMatcher: matchMerriamWebsterDictTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MerriamWebsterDictKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('merriamwebsterdict', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('merriamwebsterdict', 'api_key');
		},
	} satisfies InternalMerriamWebsterDictPlugin;
}

export type { MerriamWebsterDictReference } from './client';
export {
	DEFAULT_MERRIAMWEBSTERDICT_REFERENCE,
	MERRIAMWEBSTERDICT_REFERENCES,
} from './client';
export type {
	GetWordInput,
	GetWordResponse,
	MerriamWebsterDictEndpointInputs,
	MerriamWebsterDictEndpointOutputs,
	MerriamWebsterDictEntry,
} from './endpoints/types';
export {
	MerriamWebsterDictEndpointInputSchemas,
	MerriamWebsterDictEndpointOutputSchemas,
} from './endpoints/types';
export { MerriamWebsterDictSchema } from './schema';

export type { MerriamWebsterDictWebhookOutputs } from './webhooks/types';
