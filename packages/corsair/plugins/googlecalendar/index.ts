import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	RawWebhookRequest,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import { getValidAccessToken } from './client';
import type {
	GoogleCalendarEndpointInputs,
	GoogleCalendarEndpointOutputs,
} from './endpoints';
import { CalendarEndpoints, EventsEndpoints } from './endpoints';
import { GoogleCalendarSchema } from './schema';
import type { Event } from './types';
import type {
	GoogleCalendarWebhookOutputs,
	GoogleCalendarWebhookPayload,
	EventCreatedEvent,
	EventDeletedEvent,
	EventEndedEvent,
	EventStartedEvent,
	EventUpdatedEvent,
} from './webhooks';
import { EventWebhooks } from './webhooks';
import type { PubSubNotification } from './webhooks/types';
import { decodePubSubMessage } from './webhooks/types';

export type GoogleCalendarContext = CorsairPluginContext<
	typeof GoogleCalendarSchema,
	GoogleCalendarPluginOptions
>;

type GoogleCalendarEndpoint<
	K extends keyof GoogleCalendarEndpointOutputs,
> = CorsairEndpoint<
	GoogleCalendarContext,
	GoogleCalendarEndpointInputs[K],
	GoogleCalendarEndpointOutputs[K]
>;

export type GoogleCalendarEndpoints = {
	eventsCreate: GoogleCalendarEndpoint<'eventsCreate'>;
	eventsGet: GoogleCalendarEndpoint<'eventsGet'>;
	eventsGetMany: GoogleCalendarEndpoint<'eventsGetMany'>;
	eventsUpdate: GoogleCalendarEndpoint<'eventsUpdate'>;
	eventsDelete: GoogleCalendarEndpoint<'eventsDelete'>;
	calendarGetAvailability: GoogleCalendarEndpoint<'calendarGetAvailability'>;
};

export type GoogleCalendarBoundEndpoints = BindEndpoints<
	typeof googleCalendarEndpointsNested
>;

type GoogleCalendarWebhook<K extends keyof GoogleCalendarWebhookOutputs, TEvent> =
	CorsairWebhook<
		GoogleCalendarContext,
		GoogleCalendarWebhookPayload<TEvent>,
		GoogleCalendarWebhookOutputs[K]
	>;

export type GoogleCalendarWebhooks = {
	onEventCreated: GoogleCalendarWebhook<'eventCreated', EventCreatedEvent>;
	onEventUpdated: GoogleCalendarWebhook<'eventUpdated', EventUpdatedEvent>;
	onEventDeleted: GoogleCalendarWebhook<'eventDeleted', EventDeletedEvent>;
	onEventStarted: GoogleCalendarWebhook<'eventStarted', EventStartedEvent>;
	onEventEnded: GoogleCalendarWebhook<'eventEnded', EventEndedEvent>;
};

export type GoogleCalendarBoundWebhooks = BindWebhooks<
	typeof googleCalendarWebhooksNested
>;

const googleCalendarEndpointsNested = {
	events: {
		create: EventsEndpoints.create,
		get: EventsEndpoints.get,
		getMany: EventsEndpoints.getMany,
		update: EventsEndpoints.update,
		delete: EventsEndpoints.delete,
	},
	calendar: {
		getAvailability: CalendarEndpoints.getAvailability,
	},
} as const;

const googleCalendarWebhooksNested = {
	onEventCreated: EventWebhooks.onEventCreated,
	onEventUpdated: EventWebhooks.onEventUpdated,
	onEventDeleted: EventWebhooks.onEventDeleted,
	onEventStarted: EventWebhooks.onEventStarted,
	onEventEnded: EventWebhooks.onEventEnded,
} as const;

export type GoogleCalendarPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleCalendarPlugin['hooks'];
	webhookHooks?: InternalGoogleCalendarPlugin['webhookHooks'];
};

export type GoogleCalendarKeyBuilderContext =
	KeyBuilderContext<GoogleCalendarPluginOptions>;

const defaultAuthType: AuthTypes = 'oauth_2';

export type BaseGoogleCalendarPlugin<T extends GoogleCalendarPluginOptions> =
	CorsairPlugin<
		'googlecalendar',
		typeof GoogleCalendarSchema,
		typeof googleCalendarEndpointsNested,
		typeof googleCalendarWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleCalendarPlugin =
	BaseGoogleCalendarPlugin<GoogleCalendarPluginOptions>;

export type ExternalGoogleCalendarPlugin<
	T extends GoogleCalendarPluginOptions,
> = BaseGoogleCalendarPlugin<T>;

export function googlecalendar<const T extends GoogleCalendarPluginOptions>(
	incomingOptions: GoogleCalendarPluginOptions &
		T = {} as GoogleCalendarPluginOptions & T,
): ExternalGoogleCalendarPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlecalendar',
		schema: GoogleCalendarSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleCalendarEndpointsNested,
		webhooks: googleCalendarWebhooksNested,
		keyBuilder: async (ctx: GoogleCalendarKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.getAccessToken();
				const refreshToken = await ctx.keys.getRefreshToken();

				if (!accessToken || !refreshToken) {
					return '';
				}

				const res = await ctx.keys.getIntegrationCredentials();

				if (!res.clientId || !res.clientSecret) {
					return '';
				}

				const key = await getValidAccessToken({
					accessToken,
					refreshToken,
					clientId: res.clientId,
					clientSecret: res.clientSecret,
				});

				return key;
			}

			return '';
		},
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const isFromGoogle =
				headers.from === 'noreply@google.com' ||
				(typeof headers['user-agent'] === 'string' &&
					headers['user-agent'].includes('APIs-Google'));

			if (!isFromGoogle) return false;

			const body = request.body as PubSubNotification;
			if (!body?.message?.data) return false;

			try {
				const decoded = decodePubSubMessage(body.message.data);
				return !!decoded.channelId && !!decoded.resourceUri;
			} catch {
				return false;
			}
		},
	} satisfies InternalGoogleCalendarPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	EventCreatedEvent,
	EventDeletedEvent,
	EventEndedEvent,
	EventStartedEvent,
	EventUpdatedEvent,
	GoogleCalendarEventName,
	GoogleCalendarPushNotification,
	GoogleCalendarWebhookEvent,
	GoogleCalendarWebhookOutputs,
	GoogleCalendarWebhookPayload,
	PubSubMessage,
	PubSubNotification,
} from './webhooks/types';
export {
	createGoogleCalendarWebhookMatcher,
	decodePubSubMessage,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GoogleCalendarEndpointInputs,
	GoogleCalendarEndpointOutputSchemas,
	GoogleCalendarEndpointOutputs,
} from './endpoints/types';
