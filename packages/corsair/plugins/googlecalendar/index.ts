import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from '../../core';
import type { PickAuth } from '../../core/constants';
import { getValidAccessToken } from './client';
import type {
	GoogleCalendarEndpointInputs,
	GoogleCalendarEndpointOutputs,
} from './endpoints';
import { CalendarEndpoints, EventsEndpoints } from './endpoints';
import {
	GoogleCalendarEndpointInputSchemas,
	GoogleCalendarEndpointOutputSchemas,
} from './endpoints/types';
import { GoogleCalendarSchema } from './schema';
import type {
	EventCreatedEvent,
	EventDeletedEvent,
	EventUpdatedEvent,
	GoogleCalendarWebhookOutputs,
	GoogleCalendarWebhookPayload,
} from './webhooks';
import { EventWebhooks } from './webhooks';
import type { PubSubNotification } from './webhooks/types';
import {
	decodePubSubMessage,
	GoogleCalendarWebhookEventSchema,
	PubSubNotificationSchema,
} from './webhooks/types';

export type GoogleCalendarContext = CorsairPluginContext<
	typeof GoogleCalendarSchema,
	GoogleCalendarPluginOptions
>;

type GoogleCalendarEndpoint<K extends keyof GoogleCalendarEndpointOutputs> =
	CorsairEndpoint<
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

type GoogleCalendarWebhook<
	K extends keyof GoogleCalendarWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	GoogleCalendarContext,
	GoogleCalendarWebhookPayload<TEvent>,
	GoogleCalendarWebhookOutputs[K]
>;

export type GoogleCalendarWebhooks = {
	onEventChanged: GoogleCalendarWebhook<
		'eventChanged',
		EventCreatedEvent | EventUpdatedEvent | EventDeletedEvent
	>;
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

export const googlecalendarEndpointSchemas = {
	'events.create': {
		input: GoogleCalendarEndpointInputSchemas.eventsCreate,
		output: GoogleCalendarEndpointOutputSchemas.eventsCreate,
	},
	'events.get': {
		input: GoogleCalendarEndpointInputSchemas.eventsGet,
		output: GoogleCalendarEndpointOutputSchemas.eventsGet,
	},
	'events.getMany': {
		input: GoogleCalendarEndpointInputSchemas.eventsGetMany,
		output: GoogleCalendarEndpointOutputSchemas.eventsGetMany,
	},
	'events.update': {
		input: GoogleCalendarEndpointInputSchemas.eventsUpdate,
		output: GoogleCalendarEndpointOutputSchemas.eventsUpdate,
	},
	'events.delete': {
		input: GoogleCalendarEndpointInputSchemas.eventsDelete,
		output: GoogleCalendarEndpointOutputSchemas.eventsDelete,
	},
	'calendar.getAvailability': {
		input: GoogleCalendarEndpointInputSchemas.calendarGetAvailability,
		output: GoogleCalendarEndpointOutputSchemas.calendarGetAvailability,
	},
} satisfies RequiredPluginEndpointSchemas<typeof googleCalendarEndpointsNested>;

const googleCalendarWebhooksNested = {
	onEventChanged: EventWebhooks.onEventChanged,
} as const;

export type GoogleCalendarPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleCalendarPlugin['hooks'];
	webhookHooks?: InternalGoogleCalendarPlugin['webhookHooks'];
	/**
	 * Permission configuration for the Google Calendar plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Google Calendar endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof googleCalendarEndpointsNested>;
};

export type GoogleCalendarKeyBuilderContext =
	KeyBuilderContext<GoogleCalendarPluginOptions>;

const googlecalendarWebhookSchemas = {
	onEventChanged: {
		description: 'A Google Calendar event was created, updated, or deleted',
		payload: PubSubNotificationSchema,
		response: GoogleCalendarWebhookEventSchema,
	},
} satisfies RequiredPluginWebhookSchemas<typeof googleCalendarWebhooksNested>;

const defaultAuthType = 'oauth_2' as const;

/**
 * Risk-level metadata for each Google Calendar endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const googleCalendarEndpointMeta = {
	'events.create': {
		riskLevel: 'write',
		description: 'Create a new calendar event',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get a specific calendar event',
	},
	'events.getMany': { riskLevel: 'read', description: 'List calendar events' },
	'events.update': {
		riskLevel: 'write',
		description: 'Update an existing calendar event',
	},
	'events.delete': {
		riskLevel: 'destructive',
		description: 'Delete a calendar event [DESTRUCTIVE]',
	},
	'calendar.getAvailability': {
		riskLevel: 'read',
		description: 'Get free/busy availability for a calendar',
	},
} satisfies RequiredPluginEndpointMeta<typeof googleCalendarEndpointsNested>;

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
		endpointMeta: googleCalendarEndpointMeta,
		endpointSchemas: googlecalendarEndpointSchemas,
		webhookSchemas: googlecalendarWebhookSchemas,
		keyBuilder: async (ctx: GoogleCalendarKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new Error('No refresh token. Cannot get access token.');
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error('No client id or client secret');
				}

				const result = await getValidAccessToken({
					accessToken,
					expiresAt,
					refreshToken,
					clientId: res.client_id,
					clientSecret: res.client_secret,
				});

				if (result.refreshed) {
					await Promise.all([
						ctx.keys.set_access_token(result.accessToken),
						ctx.keys.set_expires_at(String(result.expiresAt)),
					]);
				}

				return result.accessToken;
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

				return (
					!!decoded.resourceUri && decoded.resourceUri.includes('calendar')
				);
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

export type * from './types';
