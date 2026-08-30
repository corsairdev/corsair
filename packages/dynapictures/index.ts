import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import { Designs, Templates } from './endpoints';
import type {
	DynapicturesEndpointInputs,
	DynapicturesEndpointOutputs,
} from './endpoints/types';
import {
	DynapicturesEndpointInputSchemas,
	DynapicturesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DynapicturesSchema } from './schema';

/** Configuration options for initializing the Dynapictures Corsair plugin */
export type DynapicturesPluginOptions = {
	/** Picked authentication mechanism (defaults to 'api_key') */
	authType?: PickAuth<'api_key'>;
	/** Direct API key fallback for authentication */
	key?: string;
	/** Optional execution hooks for bound endpoints */
	hooks?: Record<string, unknown>;
	/** Custom error handlers for mapping or overriding API error behavior */
	errorHandlers?: CorsairErrorHandler;
	/** Permission rules configuration for endpoint access control */
	permissions?: PluginPermissionsConfig;
};

/** Corsair context object supplied to Dynapictures endpoints */
export type DynapicturesContext = CorsairPluginContext<
	typeof DynapicturesSchema,
	DynapicturesPluginOptions
>;

/** Key builder context for Dynapictures authentication token retrieval */
export type DynapicturesKeyBuilderContext =
	KeyBuilderContext<DynapicturesPluginOptions>;

/** Map of bound endpoint functions for Dynapictures operations */
export type DynapicturesBoundEndpoints = BindEndpoints<
	typeof dynapicturesEndpointsNested
>;

/** Utility type for individual Dynapictures endpoint function definitions */
type DynapicturesEndpoint<K extends keyof DynapicturesEndpointOutputs> =
	CorsairEndpoint<
		DynapicturesContext,
		DynapicturesEndpointInputs[K],
		DynapicturesEndpointOutputs[K]
	>;

/** Collection of typed Dynapictures API endpoint definitions */
export type DynapicturesEndpoints = {
	generateDesign: DynapicturesEndpoint<'generateDesign'>;
	getDesign: DynapicturesEndpoint<'getDesign'>;
	listDesigns: DynapicturesEndpoint<'listDesigns'>;
	listTemplates: DynapicturesEndpoint<'listTemplates'>;
};

/** Webhooks definition map for Dynapictures (empty) */
export type DynapicturesWebhooks = {};

/** Bound webhooks map for Dynapictures */
export type DynapicturesBoundWebhooks = BindWebhooks<DynapicturesWebhooks>;

/** Nested endpoint tree hierarchy for internal router binding */
const dynapicturesEndpointsNested = {
	designs: {
		generate: Designs.generate,
		get: Designs.get,
		list: Designs.list,
	},
	templates: {
		list: Templates.list,
	},
} as const;

/** Nested webhooks map */
const dynapicturesWebhooksNested = {} as const;

/** Exported endpoint validation schemas mapping input/output Zod schemas */
export const dynapicturesEndpointSchemas = {
	'designs.generate': {
		input: DynapicturesEndpointInputSchemas.generateDesign,
		output: DynapicturesEndpointOutputSchemas.generateDesign,
	},
	'designs.get': {
		input: DynapicturesEndpointInputSchemas.getDesign,
		output: DynapicturesEndpointOutputSchemas.getDesign,
	},
	'designs.list': {
		input: DynapicturesEndpointInputSchemas.listDesigns,
		output: DynapicturesEndpointOutputSchemas.listDesigns,
	},
	'templates.list': {
		input: DynapicturesEndpointInputSchemas.listTemplates,
		output: DynapicturesEndpointOutputSchemas.listTemplates,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dynapicturesEndpointsNested
>;

/** Exported webhook schemas mapping */
const dynapicturesWebhookSchemas = {} as const;

/** Default authentication mechanism for Dynapictures API */
const defaultAuthType: AuthTypes = 'api_key' as const;

/** Metadata definitions specifying description and risk levels for all Dynapictures endpoints */
const dynapicturesEndpointMeta = {
	'designs.generate': {
		riskLevel: 'write',
		description: 'Generate an image or document from a template design',
	},
	'designs.get': {
		riskLevel: 'read',
		description: 'Retrieve details for a generated image or design',
	},
	'designs.list': {
		riskLevel: 'read',
		description: 'List generated images or designs',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List available design templates',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dynapicturesEndpointsNested
>;

/** Authentication configuration specification for Dynapictures plugin */
export const dynapicturesAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

/** Base plugin type definition for Dynapictures */
export type BaseDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	CorsairPlugin<
		'dynapictures',
		typeof DynapicturesSchema,
		typeof dynapicturesEndpointsNested,
		typeof dynapicturesWebhooksNested,
		T,
		typeof defaultAuthType
	>;

/** Internal plugin instance type */
export type InternalDynapicturesPlugin =
	BaseDynapicturesPlugin<DynapicturesPluginOptions>;

/** External user-facing plugin instance type */
export type ExternalDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	BaseDynapicturesPlugin<T>;

/**
 * Initializes and constructs the Dynapictures Corsair plugin instance.
 *
 * Configures authentication (`api_key`), database schemas, endpoint routes,
 * error handlers, and metadata for dynamic image generation using Dynapictures templates.
 *
 * @template T - Specific options passed by user
 * @param incomingOptions - Plugin configuration options
 * @returns Configured Dynapictures Corsair plugin instance
 */
export function dynapictures<const T extends DynapicturesPluginOptions>(
	incomingOptions: DynapicturesPluginOptions &
		T = {} as DynapicturesPluginOptions & T,
): ExternalDynapicturesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dynapictures',
		authConfig: dynapicturesAuthConfig,
		schema: DynapicturesSchema,
		options: options,
		hooks: options.hooks,
		endpoints: dynapicturesEndpointsNested,
		webhooks: dynapicturesWebhooksNested,
		endpointMeta: dynapicturesEndpointMeta,
		endpointSchemas: dynapicturesEndpointSchemas,
		webhookSchemas: dynapicturesWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: DynapicturesKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('dynapictures', 'api_key');
			}

			if (options.key) return options.key;

			const res = await ctx.keys?.get_api_key();
			if (!res) {
				throw new AuthMissingError('dynapictures', 'api_key');
			}

			return res;
		},
	} as unknown as ExternalDynapicturesPlugin<T>;
}

export type {
	DynapicturesEndpointInputs,
	DynapicturesEndpointOutputs,
	DynapicturesParam,
	GenerateDesignInput,
	GenerateDesignResponse,
	GetDesignInput,
	GetDesignResponse,
	ListDesignsInput,
	ListDesignsResponse,
	ListTemplatesInput,
	ListTemplatesResponse,
} from './endpoints/types';
