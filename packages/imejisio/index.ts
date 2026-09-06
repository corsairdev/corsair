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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Designs } from './endpoints';
import type {
	ImejisioEndpointInputs,
	ImejisioEndpointOutputs,
} from './endpoints/types';
import {
	ImejisioEndpointInputSchemas,
	ImejisioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ImejisioSchema } from './schema';

/**
 * Options accepted by the Imejis.io Corsair plugin.
 */
export type ImejisioPluginOptions = {
	/** Authentication type, defaults to 'api_key'. */
	authType?: PickAuth<'api_key'>;
	/** Primary API key for the Imejis.io management API (/designs/v2). */
	key?: string;
	/** Render API key (DMA key) for the Imejis.io render service (/v1/{design_id}). */
	renderKey?: string;
	/** Lifecycle hooks for plugin execution. */
	hooks?: InternalImejisioPlugin['hooks'];
	/** Optional custom error handlers. */
	errorHandlers?: CorsairErrorHandler;
	/** Permissions configuration for plugin endpoints. */
	permissions?: PluginPermissionsConfig<typeof imejisioEndpointsNested>;
};

/**
 * Multi-credential auth configuration declaring the secondary render_key account credential.
 */
export const imejisioAuthConfig = {
	api_key: {
		account: ['render_key'] as const,
	},
} as const satisfies PluginAuthConfig;

/**
 * Context type available to Imejis.io endpoint functions.
 */
export type ImejisioContext = CorsairPluginContext<
	typeof ImejisioSchema,
	ImejisioPluginOptions,
	undefined,
	typeof imejisioAuthConfig
>;

/**
 * Key builder context type for Imejis.io credential resolution.
 */
export type ImejisioKeyBuilderContext = KeyBuilderContext<
	ImejisioPluginOptions,
	typeof imejisioAuthConfig
>;

/**
 * Bound endpoints type for Imejis.io.
 */
export type ImejisioBoundEndpoints = BindEndpoints<
	typeof imejisioEndpointsNested
>;

type ImejisioEndpoint<K extends keyof ImejisioEndpointOutputs> =
	CorsairEndpoint<
		ImejisioContext,
		ImejisioEndpointInputs[K],
		ImejisioEndpointOutputs[K]
	>;

/**
 * Map of Imejis.io endpoint operations.
 */
export type ImejisioEndpoints = {
	listDesigns: ImejisioEndpoint<'listDesigns'>;
	renderDesign: ImejisioEndpoint<'renderDesign'>;
};

/**
 * Webhooks type for Imejis.io (no webhook surface).
 */
export type ImejisioWebhooks = {};

const imejisioEndpointsNested = {
	designs: {
		list: Designs.list,
		render: Designs.render,
	},
} as const;

const imejisioWebhooksNested = {} as const;

/**
 * Zod input and output schemas for all Imejis.io endpoints.
 */
export const imejisioEndpointSchemas = {
	'designs.list': {
		input: ImejisioEndpointInputSchemas.listDesigns,
		output: ImejisioEndpointOutputSchemas.listDesigns,
	},
	'designs.render': {
		input: ImejisioEndpointInputSchemas.renderDesign,
		output: ImejisioEndpointOutputSchemas.renderDesign,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof imejisioEndpointsNested
>;

const imejisioWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof imejisioWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Endpoint metadata including risk levels and descriptions for permission evaluation.
 */
const imejisioEndpointMeta = {
	'designs.list': {
		riskLevel: 'read',
		description: "List the authenticated user's designs",
	},
	'designs.render': {
		riskLevel: 'write',
		description:
			'Render an Imejis template design into image/PDF bytes or a hosted URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof imejisioEndpointsNested>;

/**
 * Base plugin type for Imejis.io.
 */
export type BaseImejisioPlugin<T extends ImejisioPluginOptions> = CorsairPlugin<
	'imejisio',
	typeof ImejisioSchema,
	typeof imejisioEndpointsNested,
	typeof imejisioWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof imejisioAuthConfig
>;

/**
 * Internal plugin representation.
 */
export type InternalImejisioPlugin = BaseImejisioPlugin<ImejisioPluginOptions>;

/**
 * External plugin representation returned by the factory function.
 */
export type ExternalImejisioPlugin<T extends ImejisioPluginOptions> =
	BaseImejisioPlugin<T>;

/**
 * Creates an instance of the Imejis.io Corsair integration plugin.
 *
 * @param incomingOptions - Configuration options including API key and render key.
 * @returns The configured Imejis.io plugin instance.
 */
export function imejisio<const T extends ImejisioPluginOptions>(
	incomingOptions: ImejisioPluginOptions & T = {} as ImejisioPluginOptions & T,
): ExternalImejisioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'imejisio',
		authConfig: imejisioAuthConfig,
		schema: ImejisioSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: imejisioEndpointsNested,
		webhooks: imejisioWebhooksNested,
		endpointMeta: imejisioEndpointMeta,
		endpointSchemas: imejisioEndpointSchemas,
		webhookSchemas: imejisioWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ImejisioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('imejisio', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('imejisio', 'api_key');
		},
	} satisfies InternalImejisioPlugin;
}

export type { ImejisioRenderOptions } from './client';
export {
	IMEJISIO_API_BASE,
	IMEJISIO_RENDER_BASE,
	ImejisioAPIError,
	makeImejisioRenderRequest,
	makeImejisioRequest,
	tryGetStoredKey,
} from './client';
export type {
	DesignSummary,
	ImejisioEndpointInputs,
	ImejisioEndpointOutputs,
	ListDesignsInput,
	PaginatedDesigns,
	RenderDesignInput,
	RenderDesignResponse,
	RenderHostedResponse,
	RenderSignedResponse,
	RenderStreamResponse,
} from './endpoints/types';
export {
	DesignSummarySchema,
	ImejisioEndpointInputSchemas,
	ImejisioEndpointOutputSchemas,
	ListDesignsInputSchema,
	PaginatedDesignsSchema,
	RenderDesignInputSchema,
	RenderDesignResponseSchema,
	RenderHostedResponseSchema,
	RenderSignedResponseSchema,
	RenderStreamResponseSchema,
} from './endpoints/types';
