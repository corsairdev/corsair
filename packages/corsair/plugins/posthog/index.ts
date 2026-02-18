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
import type { AuthTypes, PickAuth } from '../../core/constants';
import { Events } from './endpoints';
import type {
	PostHogEndpointInputs,
	PostHogEndpointOutputs,
} from './endpoints/types';
import { PostHogSchema } from './schema';
import type { EventCapturedEvent, PostHogWebhookOutputs } from './webhooks';
import { EventWebhooks } from './webhooks';

export type PostHogPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPostHogPlugin['hooks'];
	webhookHooks?: InternalPostHogPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type PostHogContext = CorsairPluginContext<
	typeof PostHogSchema,
	PostHogPluginOptions
>;
export type PostHogKeyBuilderContext = KeyBuilderContext<PostHogPluginOptions>;

export type PostHogBoundEndpoints = BindEndpoints<
	typeof posthogEndpointsNested
>;

type PostHogEndpoint<K extends keyof PostHogEndpointOutputs> = CorsairEndpoint<
	PostHogContext,
	PostHogEndpointInputs[K],
	PostHogEndpointOutputs[K]
>;

export type PostHogEndpoints = {
	aliasCreate: PostHogEndpoint<'aliasCreate'>;
	eventCreate: PostHogEndpoint<'eventCreate'>;
	identityCreate: PostHogEndpoint<'identityCreate'>;
	trackPage: PostHogEndpoint<'trackPage'>;
	trackScreen: PostHogEndpoint<'trackScreen'>;
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
			const headers = request.headers;
			const hasPostHogSignature =
				'x-posthog-signature' in headers || 'x-signature' in headers;
			const parsedBody =
				typeof request.body === 'string'
					? JSON.parse(request.body)
					: request.body;
			const hasPostHogPayload =
				typeof parsedBody === 'object' &&
				parsedBody !== null &&
				'event' in parsedBody &&
				'distinct_id' in parsedBody;
			return hasPostHogSignature || hasPostHogPayload;
		},
		errorHandlers: options.errorHandlers,
		keyBuilder: async (ctx: PostHogKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.getWebhookSignature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.getApiKey();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalPostHogPlugin;
}

export {
	createPostHogEventMatch,
	verifyPostHogWebhookSignature,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	EventCapturedEvent,
	PostHogEventMap,
	PostHogEventName,
	PostHogWebhookEvent,
	PostHogWebhookOutputs,
	PostHogWebhookPayload,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CreateAliasResponse,
	CreateEventResponse,
	CreateIdentityResponse,
	PostHogEndpointOutputs,
	TrackPageResponse,
	TrackScreenResponse,
} from './endpoints/types';
