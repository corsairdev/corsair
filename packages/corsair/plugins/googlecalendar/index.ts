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
import type { GoogleCalendarEndpointOutputs } from './endpoints';
import { CalendarEndpoints, EventsEndpoints } from './endpoints';
import { GoogleCalendarSchema } from './schema';
import type { Event } from './types';
import type {
	GoogleCalendarWebhookOutputs,
	GoogleCalendarWebhookPayload,
} from './webhooks';
import { EventWebhooks } from './webhooks';

export type GoogleCalendarContext = CorsairPluginContext<
	typeof GoogleCalendarSchema,
	GoogleCalendarPluginOptions
>;

type GoogleCalendarEndpoint<
	K extends keyof GoogleCalendarEndpointOutputs,
	Input,
> = CorsairEndpoint<
	GoogleCalendarContext,
	Input,
	GoogleCalendarEndpointOutputs[K]
>;

export type GoogleCalendarEndpoints = {
	eventsCreate: GoogleCalendarEndpoint<
		'eventsCreate',
		{
			calendarId?: string;
			event: Partial<Event>;
			sendUpdates?: 'all' | 'externalOnly' | 'none';
			sendNotifications?: boolean;
			conferenceDataVersion?: number;
			maxAttendees?: number;
			supportsAttachments?: boolean;
		}
	>;
	eventsGet: GoogleCalendarEndpoint<
		'eventsGet',
		{
			calendarId?: string;
			id: string;
			timeZone?: string;
			maxAttendees?: number;
		}
	>;
	eventsGetMany: GoogleCalendarEndpoint<
		'eventsGetMany',
		{
			calendarId?: string;
			timeMin?: string;
			timeMax?: string;
			timeZone?: string;
			updatedMin?: string;
			singleEvents?: boolean;
			maxResults?: number;
			pageToken?: string;
			q?: string;
			orderBy?: 'startTime' | 'updated';
			iCalUID?: string;
			showDeleted?: boolean;
			showHiddenInvitations?: boolean;
		}
	>;
	eventsUpdate: GoogleCalendarEndpoint<
		'eventsUpdate',
		{
			calendarId?: string;
			id: string;
			event: Partial<Event>;
			sendUpdates?: 'all' | 'externalOnly' | 'none';
			sendNotifications?: boolean;
			conferenceDataVersion?: number;
			maxAttendees?: number;
			supportsAttachments?: boolean;
		}
	>;
	eventsDelete: GoogleCalendarEndpoint<
		'eventsDelete',
		{
			calendarId?: string;
			id: string;
			sendUpdates?: 'all' | 'externalOnly' | 'none';
			sendNotifications?: boolean;
		}
	>;
	calendarGetAvailability: GoogleCalendarEndpoint<
		'calendarGetAvailability',
		{
			timeMin: string;
			timeMax: string;
			timeZone?: string;
			groupExpansionMax?: number;
			calendarExpansionMax?: number;
			items?: Array<{
				id: string;
			}>;
		}
	>;
};

export type GoogleCalendarBoundEndpoints = BindEndpoints<
	typeof googleCalendarEndpointsNested
>;

type GoogleCalendarWebhook<K extends keyof GoogleCalendarWebhookOutputs> =
	CorsairWebhook<
		GoogleCalendarContext,
		GoogleCalendarWebhookPayload,
		GoogleCalendarWebhookOutputs[K]
	>;

export type GoogleCalendarWebhooks = {
	onEventCreated: GoogleCalendarWebhook<'eventCreated'>;
	onEventUpdated: GoogleCalendarWebhook<'eventUpdated'>;
	onEventDeleted: GoogleCalendarWebhook<'eventDeleted'>;
	onEventStarted: GoogleCalendarWebhook<'eventStarted'>;
	onEventEnded: GoogleCalendarWebhook<'eventEnded'>;
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
				const accessToken = await ctx.keys.get_access_token();
				const refreshToken = await ctx.keys.get_refresh_token();

				if (!accessToken || !refreshToken) {
					return '';
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					return '';
				}

				const key = await getValidAccessToken({
					accessToken,
					refreshToken,
					clientId: res.client_id,
					clientSecret: res.client_secret,
				});

				return key;
			}

			return '';
		},
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const body = request.body as Record<string, unknown>;
			return (body?.message as Record<string, unknown>)?.data !== undefined;
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
	GoogleCalendarEndpointOutputSchemas,
	GoogleCalendarEndpointOutputs,
} from './endpoints/types';
