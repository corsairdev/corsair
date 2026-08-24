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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Auth, Designs, Fonts, Projects } from './endpoints';
import type {
	AbyssaleEndpointInputs,
	AbyssaleEndpointOutputs,
} from './endpoints/types';
import {
	AbyssaleEndpointInputSchemas,
	AbyssaleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AbyssaleSchema } from './schema';

export type AbyssalePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAbyssalePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof abyssaleEndpointsNested>;
};

export type AbyssaleContext = CorsairPluginContext<
	typeof AbyssaleSchema,
	AbyssalePluginOptions
>;

export type AbyssaleKeyBuilderContext =
	KeyBuilderContext<AbyssalePluginOptions>;

export type AbyssaleBoundEndpoints = BindEndpoints<
	typeof abyssaleEndpointsNested
>;

type AbyssaleEndpoint<K extends keyof AbyssaleEndpointOutputs> =
	CorsairEndpoint<
		AbyssaleContext,
		AbyssaleEndpointInputs[K],
		AbyssaleEndpointOutputs[K]
	>;

export type AbyssaleEndpoints = {
	createProject: AbyssaleEndpoint<'createProject'>;
	getDesigns: AbyssaleEndpoint<'getDesigns'>;
	getFonts: AbyssaleEndpoint<'getFonts'>;
	testAuth: AbyssaleEndpoint<'testAuth'>;
};

export type AbyssaleWebhooks = Record<string, never>;

export type AbyssaleBoundWebhooks = BindWebhooks<AbyssaleWebhooks>;

const abyssaleEndpointsNested = {
	projects: {
		create: Projects.createProject,
	},
	designs: {
		list: Designs.getDesigns,
	},
	fonts: {
		list: Fonts.getFonts,
	},
	auth: {
		test: Auth.testAuth,
	},
} as const;

const abyssaleWebhooksNested = {} as const;

export const abyssaleEndpointSchemas = {
	'projects.create': {
		input: AbyssaleEndpointInputSchemas.createProject,
		output: AbyssaleEndpointOutputSchemas.createProject,
	},
	'designs.list': {
		input: AbyssaleEndpointInputSchemas.getDesigns,
		output: AbyssaleEndpointOutputSchemas.getDesigns,
	},
	'fonts.list': {
		input: AbyssaleEndpointInputSchemas.getFonts,
		output: AbyssaleEndpointOutputSchemas.getFonts,
	},
	'auth.test': {
		input: AbyssaleEndpointInputSchemas.testAuth,
		output: AbyssaleEndpointOutputSchemas.testAuth,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof abyssaleEndpointsNested
>;

const abyssaleWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof abyssaleWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const abyssaleEndpointMeta = {
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project in Abyssale',
	},
	'designs.list': {
		riskLevel: 'read',
		description: 'Get a list of designs in Abyssale',
	},
	'fonts.list': {
		riskLevel: 'read',
		description: 'Get a list of available fonts in Abyssale',
	},
	'auth.test': {
		riskLevel: 'read',
		description: 'Test Abyssale API key authentication validity',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof abyssaleEndpointsNested>;

export const abyssaleAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAbyssalePlugin<T extends AbyssalePluginOptions> = CorsairPlugin<
	'abyssale',
	typeof AbyssaleSchema,
	typeof abyssaleEndpointsNested,
	typeof abyssaleWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAbyssalePlugin = BaseAbyssalePlugin<AbyssalePluginOptions>;

export type ExternalAbyssalePlugin<T extends AbyssalePluginOptions> =
	BaseAbyssalePlugin<T>;

export function abyssale<const T extends AbyssalePluginOptions>(
	incomingOptions: AbyssalePluginOptions & T = {} as AbyssalePluginOptions & T,
): ExternalAbyssalePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'abyssale',
		authConfig: abyssaleAuthConfig,
		schema: AbyssaleSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: abyssaleEndpointsNested,
		webhooks: abyssaleWebhooksNested,
		endpointMeta: abyssaleEndpointMeta,
		endpointSchemas: abyssaleEndpointSchemas,
		webhookSchemas: abyssaleWebhookSchemas,
		pluginWebhookMatcher: undefined,
		pluginTenantWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AbyssaleKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('abyssale', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('abyssale', 'api_key');
		},
	} satisfies InternalAbyssalePlugin;
}

export type {
	AbyssaleEndpointInputs,
	AbyssaleEndpointOutputs,
	CreateProjectInput,
	CreateProjectResponse,
	GetDesignsInput,
	GetDesignsResponse,
	GetFontsInput,
	GetFontsResponse,
	TestAuthInput,
	TestAuthResponse,
} from './endpoints/types';
