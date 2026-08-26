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

type WebvizioEndpoint<
	K extends keyof WebvizioEndpointOutputs,
	Input,
> = CorsairEndpoint<WebvizioContext, Input, WebvizioEndpointOutputs[K]>;

export type WebvizioEndpoints = {
	projectsList: WebvizioEndpoint<
		'projectsList',
		WebvizioEndpointInputs['projectsList']
	>;
	webhooksList: WebvizioEndpoint<
		'webhooksList',
		WebvizioEndpointInputs['webhooksList']
	>;
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
} as const;

const webvizioEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List all available Webvizio projects',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List all configured Webvizio webhook subscriptions',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof webvizioEndpointsNested>;

export const webvizioAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type WebvizioPlugin = CorsairPlugin<
	'webvizio',
	typeof WebvizioSchema,
	typeof webvizioEndpointsNested,
	{},
	WebvizioPluginOptions
>;

export type InternalWebvizioPlugin = CorsairPlugin<
	'webvizio',
	typeof WebvizioSchema,
	typeof webvizioEndpointsNested,
	{},
	WebvizioPluginOptions
>;

export function webvizio(options: WebvizioPluginOptions = {}): WebvizioPlugin {
	const authType = options.authType || 'api_key';

	return {
		id: 'webvizio',
		authConfig: webvizioAuthConfig,
		schema: WebvizioSchema,
		options: {
			...options,
			authType,
		},
		hooks: options.hooks,
		endpoints: webvizioEndpointsNested,
		webhooks: {},
		endpointMeta: webvizioEndpointMeta,
		endpointSchemas: webvizioEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WebvizioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('webvizio', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('webvizio', 'api_key');
		},
	} satisfies InternalWebvizioPlugin;
}

export {
	makeWebvizioRequest,
	WEBVIZIO_MCP_API_BASE,
	WEBVIZIO_WEBHOOK_API_BASE,
	WebvizioAPIError,
} from './client';
export type {
	ProjectsListInput,
	ProjectsListResponse,
	WebhooksListInput,
	WebhooksListResponse,
	WebvizioEndpointInputs,
	WebvizioEndpointOutputs,
	WebvizioProjectItem,
	WebvizioWebhookSubscription,
} from './endpoints/types';
export {
	WebvizioEndpointInputSchemas,
	WebvizioEndpointOutputSchemas,
	WebvizioProjectSchema,
	WebvizioWebhookSubscriptionSchema,
} from './endpoints/types';
export { WebvizioProject, WebvizioSchema, WebvizioWebhook } from './schema';
