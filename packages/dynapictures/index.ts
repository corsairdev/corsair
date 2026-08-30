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

export type DynapicturesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: Record<string, unknown>;
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig;
};

export type DynapicturesContext = CorsairPluginContext<
	typeof DynapicturesSchema,
	DynapicturesPluginOptions
>;

export type DynapicturesKeyBuilderContext =
	KeyBuilderContext<DynapicturesPluginOptions>;

export type DynapicturesBoundEndpoints = BindEndpoints<
	typeof dynapicturesEndpointsNested
>;

type DynapicturesEndpoint<K extends keyof DynapicturesEndpointOutputs> =
	CorsairEndpoint<
		DynapicturesContext,
		DynapicturesEndpointInputs[K],
		DynapicturesEndpointOutputs[K]
	>;

export type DynapicturesEndpoints = {
	generateDesign: DynapicturesEndpoint<'generateDesign'>;
	getDesign: DynapicturesEndpoint<'getDesign'>;
	listDesigns: DynapicturesEndpoint<'listDesigns'>;
	deleteDesign: DynapicturesEndpoint<'deleteDesign'>;
	listTemplates: DynapicturesEndpoint<'listTemplates'>;
};

export type DynapicturesWebhooks = {};

export type DynapicturesBoundWebhooks = BindWebhooks<DynapicturesWebhooks>;

const dynapicturesEndpointsNested = {
	designs: {
		generate: Designs.generate,
		get: Designs.get,
		list: Designs.list,
		delete: Designs.delete,
	},
	templates: {
		list: Templates.list,
	},
} as const;

const dynapicturesWebhooksNested = {} as const;

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
	'designs.delete': {
		input: DynapicturesEndpointInputSchemas.deleteDesign,
		output: DynapicturesEndpointOutputSchemas.deleteDesign,
	},
	'templates.list': {
		input: DynapicturesEndpointInputSchemas.listTemplates,
		output: DynapicturesEndpointOutputSchemas.listTemplates,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dynapicturesEndpointsNested
>;

const dynapicturesWebhookSchemas = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

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
	'designs.delete': {
		riskLevel: 'destructive',
		description: 'Delete a generated image or design',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List available design templates',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof dynapicturesEndpointsNested
>;

export const dynapicturesAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	CorsairPlugin<
		'dynapictures',
		typeof DynapicturesSchema,
		typeof dynapicturesEndpointsNested,
		typeof dynapicturesWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDynapicturesPlugin =
	BaseDynapicturesPlugin<DynapicturesPluginOptions>;

export type ExternalDynapicturesPlugin<T extends DynapicturesPluginOptions> =
	BaseDynapicturesPlugin<T>;

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
	DeleteDesignInput,
	DeleteDesignResponse,
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
