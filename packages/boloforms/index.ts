import type {
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
import { Documents } from './endpoints';
import type {
	BoloformsEndpointInputs,
	BoloformsEndpointOutputs,
} from './endpoints/types';
import {
	BoloformsEndpointInputSchemas,
	BoloformsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BoloformsSchema } from './schema';

export type BoloformsPluginOptions = {
	/** Authentication method. BoloForms Signature only supports API keys. */
	authType?: PickAuth<'api_key'>;
	/**
	 * BoloForms API key, sent as the `x-api-key` header. When omitted the key
	 * is resolved from the account key manager instead.
	 */
	key?: string;
	hooks?: InternalBoloformsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boloformsEndpointsNested>;
};

export type BoloformsContext = CorsairPluginContext<
	typeof BoloformsSchema,
	BoloformsPluginOptions
>;

export type BoloformsKeyBuilderContext =
	KeyBuilderContext<BoloformsPluginOptions>;

export type BoloformsBoundEndpoints = BindEndpoints<
	typeof boloformsEndpointsNested
>;

type BoloformsEndpoint<K extends keyof BoloformsEndpointOutputs> =
	CorsairEndpoint<
		BoloformsContext,
		BoloformsEndpointInputs[K],
		BoloformsEndpointOutputs[K]
	>;

export type BoloformsEndpoints = {
	getDocumentsList: BoloformsEndpoint<'getDocumentsList'>;
};

const boloformsEndpointsNested = {
	documents: {
		list: Documents.list,
	},
} as const;

export const boloformsEndpointSchemas = {
	'documents.list': {
		input: BoloformsEndpointInputSchemas.getDocumentsList,
		output: BoloformsEndpointOutputSchemas.getDocumentsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof boloformsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const boloformsEndpointMeta = {
	'documents.list': {
		riskLevel: 'read',
		description:
			'Retrieve a list of documents from a Boloforms workspace, with optional filtering and pagination',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof boloformsEndpointsNested
>;

export const boloformsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBoloformsPlugin<T extends BoloformsPluginOptions> =
	CorsairPlugin<
		'boloforms',
		typeof BoloformsSchema,
		typeof boloformsEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalBoloformsPlugin =
	BaseBoloformsPlugin<BoloformsPluginOptions>;

export type ExternalBoloformsPlugin<T extends BoloformsPluginOptions> =
	BaseBoloformsPlugin<T>;

export function boloforms(
	incomingOptions: BoloformsPluginOptions = {},
): InternalBoloformsPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'boloforms',
		authConfig: boloformsAuthConfig,
		schema: BoloformsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: boloformsEndpointsNested,
		webhooks: {},
		endpointMeta: boloformsEndpointMeta,
		endpointSchemas: boloformsEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoloformsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				if (!res) {
					throw new AuthMissingError('boloforms', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('boloforms', 'api_key');
		},
	} satisfies InternalBoloformsPlugin;
}

export type {
	BoloformsEndpointInputs,
	BoloformsEndpointOutputs,
	GetDocumentsListInput,
	GetDocumentsListResponse,
} from './endpoints/types';
