import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
} from '../../core';
import type { AuthTypes } from '../../core/constants';
import type { PostHogEndpointOutputs } from './endpoints/types';
import { Events } from './endpoints';
import type { PostHogCredentials } from './schema';
import { PostHogSchema } from './schema';
import type {
	EventCapturedEvent,
	PostHogWebhookOutputs,
} from './webhooks';
import { EventWebhooks } from './webhooks';

export type PostHogPluginOptions = {
	authType: AuthTypes;
	credentials: PostHogCredentials;
	hooks?: PostHogPlugin['hooks'] | undefined;
	webhookHooks?: PostHogPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type PostHogContext = CorsairPluginContext<
	typeof PostHogSchema,
	PostHogPluginOptions
>;

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

export type PostHogPlugin = CorsairPlugin<
	'posthog',
	typeof PostHogSchema,
	typeof posthogEndpointsNested,
	typeof posthogWebhooksNested,
	PostHogPluginOptions
>;

export function posthog(options: PostHogPluginOptions) {
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
	} satisfies PostHogPlugin;
}
