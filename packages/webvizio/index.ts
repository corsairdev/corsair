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
import { Projects, Webhooks } from './endpoints';
import type {
	WebvizioEndpointInputs,
	WebvizioEndpointOutputs,
} from './endpoints/types';
import {
	WebvizioEndpointInputSchemas,
	WebvizioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WebvizioSchema } from './schema';

export type WebvizioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWebvizioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof webvizioEndpointsNested>;
};

export type WebvizioContext = CorsairPluginContext<
	typeof WebvizioSchema,
	WebvizioPluginOptions
>;

export type WebvizioKeyBuilderContext =
	KeyBuilderContext<WebvizioPluginOptions>;

export type WebvizioBoundEndpoints = BindEndpoints<
	typeof webvizioEndpointsNested
>;

type WebvizioEndpoint<K extends keyof WebvizioEndpointOutputs> =
	CorsairEndpoint<
		WebvizioContext,
		WebvizioEndpointInputs[K],
		WebvizioEndpointOutputs[K]
	>;

export type WebvizioEndpoints = {
	projectsList: WebvizioEndpoint<'projectsList'>;
	webhooksList: WebvizioEndpoint<'webhooksList'>;
};

const webvizioEndpointsNested = {
	projects: {
		list: Projects.list,
	},
	webhooks: {
		list: Webhooks.list,
	},
} as const;

export const webvizioEndpointSchemas = {
	'projects.list': {
		input: WebvizioEndpointInputSchemas.projectsList,
		output: WebvizioEndpointOutputSchemas.projectsList,
	},
	'webhooks.list': {
		input: WebvizioEndpointInputSchemas.webhooksList,
		output: WebvizioEndpointOutputSchemas.webhooksList,
	},
} satisfies RequiredPluginEndpointSchemas<typeof webvizioEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const webvizioEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List all available Webvizio projects',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List Webvizio webhook subscriptions',
	},
} satisfies RequiredPluginEndpointMeta<typeof webvizioEndpointsNested>;

export const webvizioAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWebvizioPlugin<T extends WebvizioPluginOptions> = CorsairPlugin<
	'webvizio',
	typeof WebvizioSchema,
	typeof webvizioEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof webvizioAuthConfig
>;

export type InternalWebvizioPlugin = BaseWebvizioPlugin<WebvizioPluginOptions>;

export type ExternalWebvizioPlugin<T extends WebvizioPluginOptions> =
	BaseWebvizioPlugin<T>;

export function webvizio<const T extends WebvizioPluginOptions>(
	incomingOptions: WebvizioPluginOptions & T = {} as WebvizioPluginOptions & T,
): ExternalWebvizioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'webvizio',
		schema: WebvizioSchema,
		options,
		hooks: options.hooks,
		endpoints: webvizioEndpointsNested,
		webhooks: {},
		endpointMeta: webvizioEndpointMeta,
		endpointSchemas: webvizioEndpointSchemas,
		authConfig: webvizioAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WebvizioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('webvizio', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('webvizio', 'api_key');
		},
	} satisfies InternalWebvizioPlugin;
}

export { WebvizioAPIError } from './client';
export type {
	WebvizioEndpointInputs,
	WebvizioEndpointOutputs,
	WebvizioProject,
	WebvizioWebhookSubscription,
} from './endpoints/types';
export {
	WebvizioEndpointInputSchemas,
	WebvizioEndpointOutputSchemas,
	WebvizioProjectSchema,
	WebvizioWebhookSubscriptionSchema,
} from './endpoints/types';
export {
	WebvizioProject as WebvizioProjectEntity,
	WebvizioWebhook as WebvizioWebhookEntity,
} from './schema';
