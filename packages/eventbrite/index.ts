import type {
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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Attendees,
	Discounts,
	Events,
	Orders,
	Questions,
	TicketClasses,
	Users,
	Venues,
	Webhooks,
} from './endpoints';
import type {
	EventbriteEndpointInputs,
	EventbriteEndpointOutputs,
} from './endpoints/types';
import {
	EventbriteEndpointInputSchemas,
	EventbriteEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { EventbriteSchema } from './schema';
import type {
	EventbriteWebhookOutputs,
	EventbriteWebhookPayload,
} from './webhooks';
import {
	EventbriteWebhookPayloadSchema,
	isEventbriteNotification,
	matchEventbriteTenantWebhook,
	Notifications,
	resolveEventbriteOAuthWebhookTenantLink,
} from './webhooks';

export type EventbritePluginOptions = {
	/**
	 * Eventbrite authenticates with a private token (also called a personal
	 * OAuth token) in an `Authorization: Bearer …` header. The plugin treats it
	 * as an API key: one credential per account, no refresh.
	 */
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEventbritePlugin['hooks'];
	webhookHooks?: InternalEventbritePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof eventbriteEndpointsNested>;
};

export type EventbriteContext = CorsairPluginContext<
	typeof EventbriteSchema,
	EventbritePluginOptions
>;

export type EventbriteKeyBuilderContext =
	KeyBuilderContext<EventbritePluginOptions>;

export type EventbriteBoundEndpoints = BindEndpoints<
	typeof eventbriteEndpointsNested
>;

type EventbriteEndpoint<K extends keyof EventbriteEndpointOutputs> =
	CorsairEndpoint<
		EventbriteContext,
		EventbriteEndpointInputs[K],
		EventbriteEndpointOutputs[K]
	>;

export type EventbriteEndpoints = {
	eventsGet: EventbriteEndpoint<'eventsGet'>;
	eventsListByOrganization: EventbriteEndpoint<'eventsListByOrganization'>;
	eventsListByVenue: EventbriteEndpoint<'eventsListByVenue'>;
	eventsListBySeries: EventbriteEndpoint<'eventsListBySeries'>;
	eventsCreate: EventbriteEndpoint<'eventsCreate'>;
	eventsUpdate: EventbriteEndpoint<'eventsUpdate'>;
	eventsPublish: EventbriteEndpoint<'eventsPublish'>;
	eventsUnpublish: EventbriteEndpoint<'eventsUnpublish'>;
	eventsCancel: EventbriteEndpoint<'eventsCancel'>;
	eventsDelete: EventbriteEndpoint<'eventsDelete'>;
	eventsCopy: EventbriteEndpoint<'eventsCopy'>;
	eventsDescription: EventbriteEndpoint<'eventsDescription'>;
	eventsDisplaySettings: EventbriteEndpoint<'eventsDisplaySettings'>;
	eventsUpdateDisplaySettings: EventbriteEndpoint<'eventsUpdateDisplaySettings'>;
	ticketClassesList: EventbriteEndpoint<'ticketClassesList'>;
	ticketClassesListForSale: EventbriteEndpoint<'ticketClassesListForSale'>;
	ticketClassGet: EventbriteEndpoint<'ticketClassGet'>;
	ticketClassCreate: EventbriteEndpoint<'ticketClassCreate'>;
	ticketClassUpdate: EventbriteEndpoint<'ticketClassUpdate'>;
	ticketClassDelete: EventbriteEndpoint<'ticketClassDelete'>;
	questionsList: EventbriteEndpoint<'questionsList'>;
	questionGet: EventbriteEndpoint<'questionGet'>;
	questionCreate: EventbriteEndpoint<'questionCreate'>;
	questionDelete: EventbriteEndpoint<'questionDelete'>;
	cannedQuestionsList: EventbriteEndpoint<'cannedQuestionsList'>;
	attendeesList: EventbriteEndpoint<'attendeesList'>;
	attendeeGet: EventbriteEndpoint<'attendeeGet'>;
	ordersGet: EventbriteEndpoint<'ordersGet'>;
	ordersListByOrganization: EventbriteEndpoint<'ordersListByOrganization'>;
	ordersListByEvent: EventbriteEndpoint<'ordersListByEvent'>;
	ordersListByUser: EventbriteEndpoint<'ordersListByUser'>;
	usersMe: EventbriteEndpoint<'usersMe'>;
	userGet: EventbriteEndpoint<'userGet'>;
	organizationsList: EventbriteEndpoint<'organizationsList'>;
	venueGet: EventbriteEndpoint<'venueGet'>;
	venuesList: EventbriteEndpoint<'venuesList'>;
	venueCreate: EventbriteEndpoint<'venueCreate'>;
	venueUpdate: EventbriteEndpoint<'venueUpdate'>;
	discountGet: EventbriteEndpoint<'discountGet'>;
	discountCreate: EventbriteEndpoint<'discountCreate'>;
	discountUpdate: EventbriteEndpoint<'discountUpdate'>;
	discountsList: EventbriteEndpoint<'discountsList'>;
	discountDelete: EventbriteEndpoint<'discountDelete'>;
	webhooksList: EventbriteEndpoint<'webhooksList'>;
	webhookCreate: EventbriteEndpoint<'webhookCreate'>;
	webhookDelete: EventbriteEndpoint<'webhookDelete'>;
};

type EventbriteWebhook<
	K extends keyof EventbriteWebhookOutputs,
	TEvent,
> = CorsairWebhook<EventbriteContext, TEvent, EventbriteWebhookOutputs[K]>;

export type EventbriteWebhooks = {
	notifications: {
		delivery: EventbriteWebhook<'notification', EventbriteWebhookPayload>;
	};
};

export type EventbriteBoundWebhooks = BindWebhooks<EventbriteWebhooks>;

/**
 * One nested key per resource, matching the API reference's groups, plus the
 * three `delete` actions registered under their reserved key.
 */
const eventbriteEndpointsNested = {
	events: {
		get: Events.get,
		listByOrganization: Events.listByOrganization,
		listByVenue: Events.listByVenue,
		listBySeries: Events.listBySeries,
		create: Events.create,
		update: Events.update,
		publish: Events.publish,
		unpublish: Events.unpublish,
		cancel: Events.cancel,
		delete: Events.remove,
		copy: Events.copy,
		description: Events.description,
		displaySettings: Events.displaySettings,
		updateDisplaySettings: Events.updateDisplaySettings,
	},
	ticketClasses: {
		list: TicketClasses.list,
		listForSale: TicketClasses.listForSale,
		get: TicketClasses.get,
		create: TicketClasses.create,
		update: TicketClasses.update,
		delete: TicketClasses.remove,
	},
	questions: {
		list: Questions.list,
		get: Questions.get,
		create: Questions.create,
		delete: Questions.remove,
		listCanned: Questions.listCanned,
	},
	attendees: {
		list: Attendees.list,
		get: Attendees.get,
	},
	orders: {
		get: Orders.get,
		listByOrganization: Orders.listByOrganization,
		listByEvent: Orders.listByEvent,
		listByUser: Orders.listByUser,
	},
	users: {
		me: Users.me,
		get: Users.get,
	},
	organizations: {
		list: Users.list,
	},
	venues: {
		get: Venues.get,
		list: Venues.list,
		create: Venues.create,
		update: Venues.update,
	},
	discounts: {
		get: Discounts.get,
		create: Discounts.create,
		update: Discounts.update,
		list: Discounts.list,
		delete: Discounts.remove,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		delete: Webhooks.remove,
	},
} as const;

const eventbriteWebhooksNested = {
	notifications: {
		delivery: Notifications.delivery,
	},
} as const;

export const eventbriteEndpointSchemas = {
	'events.get': {
		input: EventbriteEndpointInputSchemas.eventsGet,
		output: EventbriteEndpointOutputSchemas.eventsGet,
	},
	'events.listByOrganization': {
		input: EventbriteEndpointInputSchemas.eventsListByOrganization,
		output: EventbriteEndpointOutputSchemas.eventsListByOrganization,
	},
	'events.listByVenue': {
		input: EventbriteEndpointInputSchemas.eventsListByVenue,
		output: EventbriteEndpointOutputSchemas.eventsListByVenue,
	},
	'events.listBySeries': {
		input: EventbriteEndpointInputSchemas.eventsListBySeries,
		output: EventbriteEndpointOutputSchemas.eventsListBySeries,
	},
	'events.create': {
		input: EventbriteEndpointInputSchemas.eventsCreate,
		output: EventbriteEndpointOutputSchemas.eventsCreate,
	},
	'events.update': {
		input: EventbriteEndpointInputSchemas.eventsUpdate,
		output: EventbriteEndpointOutputSchemas.eventsUpdate,
	},
	'events.publish': {
		input: EventbriteEndpointInputSchemas.eventsPublish,
		output: EventbriteEndpointOutputSchemas.eventsPublish,
	},
	'events.unpublish': {
		input: EventbriteEndpointInputSchemas.eventsUnpublish,
		output: EventbriteEndpointOutputSchemas.eventsUnpublish,
	},
	'events.cancel': {
		input: EventbriteEndpointInputSchemas.eventsCancel,
		output: EventbriteEndpointOutputSchemas.eventsCancel,
	},
	'events.delete': {
		input: EventbriteEndpointInputSchemas.eventsDelete,
		output: EventbriteEndpointOutputSchemas.eventsDelete,
	},
	'events.copy': {
		input: EventbriteEndpointInputSchemas.eventsCopy,
		output: EventbriteEndpointOutputSchemas.eventsCopy,
	},
	'events.description': {
		input: EventbriteEndpointInputSchemas.eventsDescription,
		output: EventbriteEndpointOutputSchemas.eventsDescription,
	},
	'events.displaySettings': {
		input: EventbriteEndpointInputSchemas.eventsDisplaySettings,
		output: EventbriteEndpointOutputSchemas.eventsDisplaySettings,
	},
	'events.updateDisplaySettings': {
		input: EventbriteEndpointInputSchemas.eventsUpdateDisplaySettings,
		output: EventbriteEndpointOutputSchemas.eventsUpdateDisplaySettings,
	},
	'ticketClasses.list': {
		input: EventbriteEndpointInputSchemas.ticketClassesList,
		output: EventbriteEndpointOutputSchemas.ticketClassesList,
	},
	'ticketClasses.listForSale': {
		input: EventbriteEndpointInputSchemas.ticketClassesListForSale,
		output: EventbriteEndpointOutputSchemas.ticketClassesListForSale,
	},
	'ticketClasses.get': {
		input: EventbriteEndpointInputSchemas.ticketClassGet,
		output: EventbriteEndpointOutputSchemas.ticketClassGet,
	},
	'ticketClasses.create': {
		input: EventbriteEndpointInputSchemas.ticketClassCreate,
		output: EventbriteEndpointOutputSchemas.ticketClassCreate,
	},
	'ticketClasses.update': {
		input: EventbriteEndpointInputSchemas.ticketClassUpdate,
		output: EventbriteEndpointOutputSchemas.ticketClassUpdate,
	},
	'ticketClasses.delete': {
		input: EventbriteEndpointInputSchemas.ticketClassDelete,
		output: EventbriteEndpointOutputSchemas.ticketClassDelete,
	},
	'questions.list': {
		input: EventbriteEndpointInputSchemas.questionsList,
		output: EventbriteEndpointOutputSchemas.questionsList,
	},
	'questions.get': {
		input: EventbriteEndpointInputSchemas.questionGet,
		output: EventbriteEndpointOutputSchemas.questionGet,
	},
	'questions.create': {
		input: EventbriteEndpointInputSchemas.questionCreate,
		output: EventbriteEndpointOutputSchemas.questionCreate,
	},
	'questions.delete': {
		input: EventbriteEndpointInputSchemas.questionDelete,
		output: EventbriteEndpointOutputSchemas.questionDelete,
	},
	'questions.listCanned': {
		input: EventbriteEndpointInputSchemas.cannedQuestionsList,
		output: EventbriteEndpointOutputSchemas.cannedQuestionsList,
	},
	'attendees.list': {
		input: EventbriteEndpointInputSchemas.attendeesList,
		output: EventbriteEndpointOutputSchemas.attendeesList,
	},
	'attendees.get': {
		input: EventbriteEndpointInputSchemas.attendeeGet,
		output: EventbriteEndpointOutputSchemas.attendeeGet,
	},
	'orders.get': {
		input: EventbriteEndpointInputSchemas.ordersGet,
		output: EventbriteEndpointOutputSchemas.ordersGet,
	},
	'orders.listByOrganization': {
		input: EventbriteEndpointInputSchemas.ordersListByOrganization,
		output: EventbriteEndpointOutputSchemas.ordersListByOrganization,
	},
	'orders.listByEvent': {
		input: EventbriteEndpointInputSchemas.ordersListByEvent,
		output: EventbriteEndpointOutputSchemas.ordersListByEvent,
	},
	'orders.listByUser': {
		input: EventbriteEndpointInputSchemas.ordersListByUser,
		output: EventbriteEndpointOutputSchemas.ordersListByUser,
	},
	'users.me': {
		input: EventbriteEndpointInputSchemas.usersMe,
		output: EventbriteEndpointOutputSchemas.usersMe,
	},
	'users.get': {
		input: EventbriteEndpointInputSchemas.userGet,
		output: EventbriteEndpointOutputSchemas.userGet,
	},
	'organizations.list': {
		input: EventbriteEndpointInputSchemas.organizationsList,
		output: EventbriteEndpointOutputSchemas.organizationsList,
	},
	'venues.get': {
		input: EventbriteEndpointInputSchemas.venueGet,
		output: EventbriteEndpointOutputSchemas.venueGet,
	},
	'venues.list': {
		input: EventbriteEndpointInputSchemas.venuesList,
		output: EventbriteEndpointOutputSchemas.venuesList,
	},
	'venues.create': {
		input: EventbriteEndpointInputSchemas.venueCreate,
		output: EventbriteEndpointOutputSchemas.venueCreate,
	},
	'venues.update': {
		input: EventbriteEndpointInputSchemas.venueUpdate,
		output: EventbriteEndpointOutputSchemas.venueUpdate,
	},
	'discounts.get': {
		input: EventbriteEndpointInputSchemas.discountGet,
		output: EventbriteEndpointOutputSchemas.discountGet,
	},
	'discounts.create': {
		input: EventbriteEndpointInputSchemas.discountCreate,
		output: EventbriteEndpointOutputSchemas.discountCreate,
	},
	'discounts.update': {
		input: EventbriteEndpointInputSchemas.discountUpdate,
		output: EventbriteEndpointOutputSchemas.discountUpdate,
	},
	'discounts.list': {
		input: EventbriteEndpointInputSchemas.discountsList,
		output: EventbriteEndpointOutputSchemas.discountsList,
	},
	'discounts.delete': {
		input: EventbriteEndpointInputSchemas.discountDelete,
		output: EventbriteEndpointOutputSchemas.discountDelete,
	},
	'webhooks.list': {
		input: EventbriteEndpointInputSchemas.webhooksList,
		output: EventbriteEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: EventbriteEndpointInputSchemas.webhookCreate,
		output: EventbriteEndpointOutputSchemas.webhookCreate,
	},
	'webhooks.delete': {
		input: EventbriteEndpointInputSchemas.webhookDelete,
		output: EventbriteEndpointOutputSchemas.webhookDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof eventbriteEndpointsNested
>;

const eventbriteWebhookSchemas = {
	'notifications.delivery': {
		description:
			'An Eventbrite webhook delivery: the notification naming the changed object’s `api_url` and the `config.action` that fired, not the object itself',
		payload: EventbriteWebhookPayloadSchema,
		response: EventbriteWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof eventbriteWebhooksNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * Exported so a test can check that every operation is classified, not only
 * that each one exists in the endpoint tree.
 */
export const eventbriteEndpointMeta = {
	'events.get': {
		riskLevel: 'read',
		description:
			'Read one event by ID, optionally inlining its venue, organizer, category, format, logo and ticket availability',
	},
	'events.listByOrganization': {
		riskLevel: 'read',
		description:
			"List an organization's events, filtered by status, name, currency, time window, series membership, venue, organizer or explicit IDs",
	},
	'events.listByVenue': {
		riskLevel: 'read',
		description:
			'List the events held at a venue, optionally in a start-date window',
	},
	'events.listBySeries': {
		riskLevel: 'read',
		description: 'List the occurrences of a recurring event series',
	},
	'events.create': {
		riskLevel: 'write',
		description:
			'Create an event under an organization: name, start and end, currency, and optionally a venue or online-only, category, format and listing options',
	},
	'events.update': {
		riskLevel: 'write',
		description:
			'Change an event; on a series parent, name, dates, currency, capacity, password and show_remaining also apply to every occurrence',
	},
	'events.publish': {
		riskLevel: 'write',
		description:
			'Publish an event so it can take registrations and purchases. It needs a name, an organizer, at least one ticket and valid payment options',
	},
	'events.unpublish': {
		riskLevel: 'write',
		description:
			'Take a published event back to draft. Refused while the event has any pending or completed orders, unless it is completed and paid out',
	},
	'events.cancel': {
		riskLevel: 'write',
		irreversible: true,
		description:
			'Cancel an event. Refused while it has any pending or completed orders; a canceled event cannot be reopened, only copied',
	},
	'events.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete an event and, for a series parent, every occurrence. Refused while any of them has orders',
	},
	'events.copy': {
		riskLevel: 'write',
		description:
			'Duplicate an event into a new draft with a new ID, copying its payment options, payout method, refund policy and tax settings',
	},
	'events.description': {
		riskLevel: 'read',
		description:
			'Read the event’s fully rendered HTML description, which the event object itself no longer returns',
	},
	'events.displaySettings': {
		riskLevel: 'read',
		description:
			'Read what the listing page shows: dates, times, timezone, map and the Facebook options',
	},
	'events.updateDisplaySettings': {
		riskLevel: 'write',
		description: 'Change what the event listing page shows',
	},
	'ticketClasses.list': {
		riskLevel: 'read',
		description:
			'List an event’s ticket classes with their capacity, sold count and on-sale status',
	},
	'ticketClasses.listForSale': {
		riskLevel: 'read',
		description:
			'List the ticket classes currently purchasable at a point of sale, optionally for one promo code',
	},
	'ticketClasses.get': {
		riskLevel: 'read',
		description: 'Read one ticket class of an event',
	},
	'ticketClasses.create': {
		riskLevel: 'write',
		description:
			'Add a ticket class to an event: free, donation or priced, with capacity, sale window and sales channels',
	},
	'ticketClasses.update': {
		riskLevel: 'write',
		description:
			'Change a ticket class. The price cannot change once any ticket has sold',
	},
	'ticketClasses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a ticket class. Refused once tickets have been sold from it, and not allowed for the last ticket while the event is live',
	},
	'questions.list': {
		riskLevel: 'read',
		description: 'List the custom registration questions of an event',
	},
	'questions.get': {
		riskLevel: 'read',
		description: 'Read one custom registration question',
	},
	'questions.create': {
		riskLevel: 'write',
		description:
			'Add a custom registration question: text, paragraph, checkbox, dropdown, radio or waiver, asked of the buyer or each attendee',
	},
	'questions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a custom registration question and the answers already collected with it',
	},
	'questions.listCanned': {
		riskLevel: 'read',
		description:
			'List the default questions Eventbrite adds to every event, with whether each is currently included',
	},
	'attendees.list': {
		riskLevel: 'read',
		description:
			"List an event's attendees with their ticket class, order, check-in state and barcodes. Private: requires access to the event",
	},
	'attendees.get': {
		riskLevel: 'read',
		description: 'Read one attendee of an event',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Read one order with its buyer details and cost breakdown',
	},
	'orders.listByOrganization': {
		riskLevel: 'read',
		description: "List the orders placed against an organization's events",
	},
	'orders.listByEvent': {
		riskLevel: 'read',
		description:
			'List the orders of one event, filtered by status, change time, buyer email or refund request status',
	},
	'orders.listByUser': {
		riskLevel: 'read',
		description:
			'List the orders one user placed. `me` reads the authenticated user’s',
	},
	'users.me': {
		riskLevel: 'read',
		description: 'Read the authenticated user: id, name and verified emails',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read a user by ID',
	},
	'organizations.list': {
		riskLevel: 'read',
		description:
			'List the organizations a user belongs to, which is how you find the organization_id every other call needs',
	},
	'venues.get': {
		riskLevel: 'read',
		description: 'Read one venue with its address and coordinates',
	},
	'venues.list': {
		riskLevel: 'read',
		description: "List an organization's venues",
	},
	'venues.create': {
		riskLevel: 'write',
		description: 'Create a venue under an organization, with its address',
	},
	'venues.update': {
		riskLevel: 'write',
		description: 'Change a venue’s name, address or capacity',
	},
	'discounts.get': {
		riskLevel: 'read',
		description: 'Read one discount code with its amount and usage',
	},
	'discounts.create': {
		riskLevel: 'write',
		description:
			'Create a discount code: a fixed amount or a percentage off, optionally limited by quantity, dates or ticket classes',
	},
	'discounts.update': {
		riskLevel: 'write',
		description: 'Change a discount code',
	},
	'discounts.list': {
		riskLevel: 'read',
		description:
			'List an organization’s discounts for one scope (`event`, `multi_events` or `user`), optionally by code',
	},
	'discounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a discount code. Only an unused code can be deleted, and a deleted code cannot be restored',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: "List an organization's webhook subscriptions",
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Subscribe an HTTPS endpoint to event, order, attendee, organizer, ticket class or venue actions',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook subscription together with its delivery history',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof eventbriteEndpointsNested
>;

export const eventbriteAuthConfig = {
	api_key: {
		account: ['organization_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEventbritePlugin<T extends EventbritePluginOptions> =
	CorsairPlugin<
		'eventbrite',
		typeof EventbriteSchema,
		typeof eventbriteEndpointsNested,
		typeof eventbriteWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalEventbritePlugin =
	BaseEventbritePlugin<EventbritePluginOptions>;

export type ExternalEventbritePlugin<T extends EventbritePluginOptions> =
	BaseEventbritePlugin<T>;

export function eventbrite<const T extends EventbritePluginOptions>(
	incomingOptions: EventbritePluginOptions & T = {} as EventbritePluginOptions &
		T,
): ExternalEventbritePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'eventbrite',
		authConfig: eventbriteAuthConfig,
		schema: EventbriteSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: eventbriteEndpointsNested,
		webhooks: eventbriteWebhooksNested,
		endpointMeta: eventbriteEndpointMeta,
		endpointSchemas: eventbriteEndpointSchemas,
		webhookSchemas: eventbriteWebhookSchemas,
		pluginWebhookMatcher: (request) => isEventbriteNotification(request),
		pluginTenantWebhookMatcher: matchEventbriteTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveEventbriteOAuthWebhookTenantLink,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: EventbriteKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Eventbrite signs nothing and allows no header on the
				// subscription, so there is no secret to resolve. Returning an
				// empty string keeps the signed-webhook path working; throwing
				// here would fail every delivery before the handler ran.
				return '';
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('eventbrite', ctx.authType ?? 'api_key');
		},
	} satisfies InternalEventbritePlugin;
}

export { EventbriteAPIError } from './client';

export type {
	CannedQuestionsListInput,
	CannedQuestionsListResponse,
	DiscountCreateInput,
	DiscountDeleteInput,
	DiscountDeleteResponse,
	DiscountGetInput,
	DiscountsListInput,
	DiscountsListResponse,
	DiscountUpdateInput,
	EmptyInput,
	EventbriteAttendee,
	EventbriteDiscount,
	EventbriteDisplaySettings,
	EventbriteEndpointInputs,
	EventbriteEndpointOutputs,
	EventbriteEvent,
	EventbriteOperation,
	EventbriteOrder,
	EventbriteOrganization,
	EventbriteQuestion,
	EventbriteTicketClass,
	EventbriteUser,
	EventbriteWebhook,
	EventIdInput,
	EventsCopyInput,
	EventsCreateInput,
	EventsDeleteResponse,
	EventsDescriptionInput,
	EventsDescriptionResponse,
	EventsGetInput,
	EventsGetResponse,
	EventsListByOrganizationInput,
	EventsListBySeriesInput,
	EventsListByVenueInput,
	EventsListResponse,
	EventsPublishResponse,
	EventsUnpublishResponse,
	EventsUpdateDisplaySettingsInput,
	EventsUpdateInput,
	OrderGetInput,
	OrdersListByEventInput,
	OrdersListByOrganizationInput,
	OrdersListByUserInput,
	OrdersListResponse,
	QuestionCreateInput,
	QuestionDeleteInput,
	QuestionGetInput,
	QuestionsListInput,
	QuestionsListResponse,
	TicketClassCreateInput,
	TicketClassDeleteInput,
	TicketClassesListForSaleInput,
	TicketClassesListInput,
	TicketClassesListResponse,
	TicketClassGetInput,
	TicketClassUpdateInput,
	UserGetInput,
	VenueCreateInput,
	VenueGetInput,
	VenuesListInput,
	VenuesListResponse,
	VenueUpdateInput,
	WebhookCreateInput,
	WebhookDeleteInput,
	WebhooksListInput,
	WebhooksListResponse,
} from './endpoints/types';

export type {
	EventbriteWebhookOutputs,
	EventbriteWebhookPayload,
} from './webhooks';
