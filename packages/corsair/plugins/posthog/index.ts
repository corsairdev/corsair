import type { AuthTypes } from '../../constants';
import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
} from '../../core';
import type { PickAuth } from '../../core/constants';
import { Events } from './endpoints';
import type { PostHogEndpointOutputs } from './endpoints/types';
import { PostHogSchema } from './schema';
import type { EventCapturedEvent, PostHogWebhookOutputs } from './webhooks';
import { EventWebhooks } from './webhooks';

export type PostHogPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPostHogPlugin['hooks'];
	webhookHooks?: InternalPostHogPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type PostHogContext = CorsairPluginContext<
	typeof PostHogSchema,
	PostHogPluginOptions
>;
export type PostHogKeyBuilderContext = KeyBuilderContext<PostHogPluginOptions>;

export type PostHogBoundEndpoints = BindEndpoints<PostHogEndpoints>;

type PostHogEndpoint<
	K extends keyof PostHogEndpointOutputs,
	Input,
> = CorsairEndpoint<PostHogContext, Input, PostHogEndpointOutputs[K]>;

export type PostHogEndpoints = {
	aliasCreate: PostHogEndpoint<
		'aliasCreate',
		{ distinct_id: string; alias: string }
	>;
	eventCreate: PostHogEndpoint<
		'eventCreate',
		{
			distinct_id: string;
			event: string;
			properties?: Record<string, unknown>;
			timestamp?: string;
			uuid?: string;
		}
	>;
	identityCreate: PostHogEndpoint<
		'identityCreate',
		{ distinct_id: string; properties?: Record<string, unknown> }
	>;
	trackPage: PostHogEndpoint<
		'trackPage',
		{
			distinct_id: string;
			url: string;
			properties?: Record<string, unknown>;
			timestamp?: string;
			uuid?: string;
		}
	>;
	trackScreen: PostHogEndpoint<
		'trackScreen',
		{
			distinct_id: string;
			screen_name: string;
			properties?: Record<string, unknown>;
			timestamp?: string;
			uuid?: string;
		}
	>;
};

type PostHogWebhook<
	K extends keyof PostHogWebhookOutputs,
	TEvent,
> = CorsairWebhook<PostHogContext, TEvent, PostHogWebhookOutputs[K]>;

export type PostHogWebhooks = {
	eventCaptured: PostHogWebhook<'eventCaptured', EventCapturedEvent>;
};

export type PostHogBoundWebhooks = BindWebhooks<PostHogWebhooks>;

const posthogEndpointsNested = {
	events: {
		aliasCreate: Events.aliasCreate,
		eventCreate: Events.eventCreate,
		identityCreate: Events.identityCreate,
		trackPage: Events.trackPage,
		trackScreen: Events.trackScreen,
	},
} as const;

const posthogWebhooksNested = {
	events: {
		captured: EventWebhooks.captured,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key';

export type BasePostHogPlugin<T extends PostHogPluginOptions> = CorsairPlugin<
	'posthog',
	typeof PostHogSchema,
	typeof posthogEndpointsNested,
	typeof posthogWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalPostHogPlugin = BasePostHogPlugin<PostHogPluginOptions>;

export type ExternalPostHogPlugin<T extends PostHogPluginOptions> =
	BasePostHogPlugin<T>;

export function posthog<const T extends PostHogPluginOptions>(
	incomingOptions: PostHogPluginOptions & T = {} as PostHogPluginOptions & T,
): ExternalPostHogPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'posthog',
		schema: PostHogSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: posthogEndpointsNested,
		webhooks: posthogWebhooksNested,
		pluginWebhookMatcher: (request) => {
			return false;
		},
		errorHandlers: options.errorHandlers,
		keyBuilder: async (ctx: PostHogKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.getApiKey();

				if (!res) {
					// prob need to throw an error here
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalPostHogPlugin;
}
