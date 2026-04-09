import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { Bookings } from './endpoints';
import type { CalEndpointInputs, CalEndpointOutputs } from './endpoints/types';
import {
	CalEndpointInputSchemas,
	CalEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CalSchema } from './schema';
import { BookingWebhooks, PingWebhooks } from './webhooks';
import type {
	BookingCancelledEvent,
	BookingCreatedEvent,
	BookingRescheduledEvent,
	CalWebhookOutputs,
	MeetingEndedEvent,
	PingEvent,
} from './webhooks/types';
import {
	BookingCancelledEventSchema,
	BookingCreatedEventSchema,
	BookingRescheduledEventSchema,
	MeetingEndedEventSchema,
	PingEventSchema,
} from './webhooks/types';

export type CalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCalPlugin['hooks'];
	webhookHooks?: InternalCalPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof calEndpointsNested>;
};

export type CalContext = CorsairPluginContext<
	typeof CalSchema,
	CalPluginOptions
>;

export type CalKeyBuilderContext = KeyBuilderContext<CalPluginOptions>;

export type CalBoundEndpoints = BindEndpoints<typeof calEndpointsNested>;

type CalEndpoint<K extends keyof CalEndpointOutputs, Input> = CorsairEndpoint<
	CalContext,
	Input,
	CalEndpointOutputs[K]
>;

export type CalEndpoints = {
	bookingsList: CalEndpoint<'bookingsList', CalEndpointInputs['bookingsList']>;
	bookingsGet: CalEndpoint<'bookingsGet', CalEndpointInputs['bookingsGet']>;
	bookingsCreate: CalEndpoint<
		'bookingsCreate',
		CalEndpointInputs['bookingsCreate']
	>;
	bookingsCancel: CalEndpoint<
		'bookingsCancel',
		CalEndpointInputs['bookingsCancel']
	>;
	bookingsReschedule: CalEndpoint<
		'bookingsReschedule',
		CalEndpointInputs['bookingsReschedule']
	>;
	bookingsConfirm: CalEndpoint<
		'bookingsConfirm',
		CalEndpointInputs['bookingsConfirm']
	>;
	bookingsDecline: CalEndpoint<
		'bookingsDecline',
		CalEndpointInputs['bookingsDecline']
	>;
};

type CalWebhook<K extends keyof CalWebhookOutputs, TEvent> = CorsairWebhook<
	CalContext,
	TEvent,
	CalWebhookOutputs[K]
>;

export type CalWebhooks = {
	bookingCreated: CalWebhook<'bookingCreated', BookingCreatedEvent>;
	bookingCancelled: CalWebhook<'bookingCancelled', BookingCancelledEvent>;
	bookingRescheduled: CalWebhook<'bookingRescheduled', BookingRescheduledEvent>;
	meetingEnded: CalWebhook<'meetingEnded', MeetingEndedEvent>;
	ping: CalWebhook<'ping', PingEvent>;
};

export type CalBoundWebhooks = BindWebhooks<CalWebhooks>;

const calEndpointsNested = {
	bookings: {
		list: Bookings.list,
		get: Bookings.get,
		create: Bookings.create,
		cancel: Bookings.cancel,
		reschedule: Bookings.reschedule,
		confirm: Bookings.confirm,
		decline: Bookings.decline,
	},
} as const;

const calWebhooksNested = {
	bookings: {
		bookingCreated: BookingWebhooks.bookingCreated,
		bookingCancelled: BookingWebhooks.bookingCancelled,
		bookingRescheduled: BookingWebhooks.bookingRescheduled,
		meetingEnded: BookingWebhooks.meetingEnded,
	},
	system: {
		ping: PingWebhooks.ping,
	},
} as const;

export const calEndpointSchemas = {
	'bookings.list': {
		input: CalEndpointInputSchemas.bookingsList,
		output: CalEndpointOutputSchemas.bookingsList,
	},
	'bookings.get': {
		input: CalEndpointInputSchemas.bookingsGet,
		output: CalEndpointOutputSchemas.bookingsGet,
	},
	'bookings.create': {
		input: CalEndpointInputSchemas.bookingsCreate,
		output: CalEndpointOutputSchemas.bookingsCreate,
	},
	'bookings.cancel': {
		input: CalEndpointInputSchemas.bookingsCancel,
		output: CalEndpointOutputSchemas.bookingsCancel,
	},
	'bookings.reschedule': {
		input: CalEndpointInputSchemas.bookingsReschedule,
		output: CalEndpointOutputSchemas.bookingsReschedule,
	},
	'bookings.confirm': {
		input: CalEndpointInputSchemas.bookingsConfirm,
		output: CalEndpointOutputSchemas.bookingsConfirm,
	},
	'bookings.decline': {
		input: CalEndpointInputSchemas.bookingsDecline,
		output: CalEndpointOutputSchemas.bookingsDecline,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const calEndpointMeta = {
	'bookings.list': {
		riskLevel: 'read',
		description: 'List all bookings',
	},
	'bookings.get': {
		riskLevel: 'read',
		description: 'Get a booking by UID',
	},
	'bookings.create': {
		riskLevel: 'write',
		description: 'Create a new booking',
	},
	'bookings.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a booking [DESTRUCTIVE]',
	},
	'bookings.reschedule': {
		riskLevel: 'write',
		description: 'Reschedule a booking to a new time',
	},
	'bookings.confirm': {
		riskLevel: 'write',
		description: 'Confirm a pending booking',
	},
	'bookings.decline': {
		riskLevel: 'write',
		description: 'Decline a pending booking',
	},
} satisfies RequiredPluginEndpointMeta<typeof calEndpointsNested>;

const calWebhookSchemas = {
	'bookings.bookingCreated': {
		description: 'A new booking was created',
		payload: BookingCreatedEventSchema,
		response: BookingCreatedEventSchema,
	},
	'bookings.bookingCancelled': {
		description: 'A booking was cancelled',
		payload: BookingCancelledEventSchema,
		response: BookingCancelledEventSchema,
	},
	'bookings.bookingRescheduled': {
		description: 'A booking was rescheduled',
		payload: BookingRescheduledEventSchema,
		response: BookingRescheduledEventSchema,
	},
	'bookings.meetingEnded': {
		description: 'A meeting ended',
		payload: MeetingEndedEventSchema,
		response: MeetingEndedEventSchema,
	},
	'system.ping': {
		description: 'Ping test to verify webhook endpoint',
		payload: PingEventSchema,
		response: PingEventSchema,
	},
} as const;

export const calAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCalPlugin<T extends CalPluginOptions> = CorsairPlugin<
	'cal',
	typeof CalSchema,
	typeof calEndpointsNested,
	typeof calWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCalPlugin = BaseCalPlugin<CalPluginOptions>;

export type ExternalCalPlugin<T extends CalPluginOptions> = BaseCalPlugin<T>;

export function cal<const T extends CalPluginOptions>(
	incomingOptions: CalPluginOptions & T = {} as CalPluginOptions & T,
): ExternalCalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cal',
		schema: CalSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: calEndpointsNested,
		webhooks: calWebhooksNested,
		endpointMeta: calEndpointMeta,
		endpointSchemas: calEndpointSchemas,
		webhookSchemas: calWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasSignature = 'x-cal-signature-256' in headers;
			return hasSignature;
			return hasSignature;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CalKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalCalPlugin;
}

export type {
	BookingsCancelInput,
	BookingsCancelResponse,
	BookingsConfirmInput,
	BookingsConfirmResponse,
	BookingsCreateInput,
	BookingsCreateResponse,
	BookingsDeclineInput,
	BookingsDeclineResponse,
	BookingsGetInput,
	BookingsGetResponse,
	BookingsListInput,
	BookingsListResponse,
	BookingsRescheduleInput,
	BookingsRescheduleResponse,
	CalEndpointInputs,
	CalEndpointOutputs,
} from './endpoints/types';
export type {
	BookingCancelledEvent,
	BookingCreatedEvent,
	BookingRescheduledEvent,
	CalWebhookOutputs,
	CalWebhookPayload,
	MeetingEndedEvent,
	PingEvent,
} from './webhooks/types';
export { createCalMatch } from './webhooks/types';
