import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Attendees, Checkout, Events, Orders, Tickets } from './endpoints';
import type {
	EventzillaEndpointInputs,
	EventzillaEndpointOutputs,
} from './endpoints/types';
import {
	EventzillaEndpointInputSchemas,
	EventzillaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { EventzillaSchema } from './schema';

export type EventzillaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** An Eventzilla API key. Overrides the stored key. */
	key?: string;
	hooks?: InternalEventzillaPlugin['hooks'];
	webhookHooks?: InternalEventzillaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof eventzillaEndpointsNested>;
};

export type EventzillaContext = CorsairPluginContext<
	typeof EventzillaSchema,
	EventzillaPluginOptions
>;

export type EventzillaKeyBuilderContext =
	KeyBuilderContext<EventzillaPluginOptions>;

export type EventzillaBoundEndpoints = BindEndpoints<
	typeof eventzillaEndpointsNested
>;

type EventzillaEndpoint<K extends keyof EventzillaEndpointOutputs> =
	CorsairEndpoint<
		EventzillaContext,
		EventzillaEndpointInputs[K],
		EventzillaEndpointOutputs[K]
	>;

export type EventzillaEndpoints = {
	eventsList: EventzillaEndpoint<'eventsList'>;
	eventsGet: EventzillaEndpoint<'eventsGet'>;
	eventsTransactions: EventzillaEndpoint<'eventsTransactions'>;
	eventsAttendees: EventzillaEndpoint<'eventsAttendees'>;
	ticketsList: EventzillaEndpoint<'ticketsList'>;
	ticketsCreate: EventzillaEndpoint<'ticketsCreate'>;
	ticketsUpdate: EventzillaEndpoint<'ticketsUpdate'>;
	categoriesList: EventzillaEndpoint<'categoriesList'>;
	usersList: EventzillaEndpoint<'usersList'>;
	usersGet: EventzillaEndpoint<'usersGet'>;
	transactionsGet: EventzillaEndpoint<'transactionsGet'>;
	checkoutPrepare: EventzillaEndpoint<'checkoutPrepare'>;
	checkoutCreate: EventzillaEndpoint<'checkoutCreate'>;
	checkoutFillOrder: EventzillaEndpoint<'checkoutFillOrder'>;
	checkoutConfirm: EventzillaEndpoint<'checkoutConfirm'>;
	attendeesGet: EventzillaEndpoint<'attendeesGet'>;
	attendeesCheckin: EventzillaEndpoint<'attendeesCheckin'>;
	ordersCancel: EventzillaEndpoint<'ordersCancel'>;
	ordersConfirm: EventzillaEndpoint<'ordersConfirm'>;
	salesToggle: EventzillaEndpoint<'salesToggle'>;
};

// Eventzilla posts webhooks, but documents no signature, no signing secret and
// no verification step: https://developer.eventzilla.net/webhooks.html. Nothing
// in a delivery can be authenticated, so no inbound webhook is registered and
// no secret is stored. `pluginWebhookMatcher` refuses everything.
export type EventzillaWebhooks = Record<never, never>;

export type EventzillaBoundWebhooks = BindWebhooks<
	typeof eventzillaWebhooksNested
>;

const eventzillaEndpointsNested = {
	events: {
		list: Events.list,
		get: Events.get,
		transactions: Events.transactions,
		attendees: Events.attendees,
	},
	tickets: {
		list: Tickets.list,
		create: Tickets.create,
		update: Tickets.update,
	},
	attendees: {
		get: Attendees.get,
		checkin: Attendees.checkin,
	},
	orders: {
		cancel: Orders.cancel,
		confirm: Orders.confirm,
	},
	sales: {
		toggle: Orders.toggle,
	},
	checkout: {
		prepare: Checkout.prepare,
		create: Checkout.create,
		fillOrder: Checkout.fillOrder,
		confirm: Checkout.confirm,
	},
	categories: {
		list: Tickets.categories,
	},
	users: {
		list: Tickets.users,
		get: Tickets.user,
	},
	transactions: {
		get: Tickets.transaction,
	},
} as const;

const eventzillaWebhooksNested = {} as const;

export const eventzillaEndpointSchemas = {
	'events.list': {
		input: EventzillaEndpointInputSchemas.eventsList,
		output: EventzillaEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: EventzillaEndpointInputSchemas.eventsGet,
		output: EventzillaEndpointOutputSchemas.eventsGet,
	},
	'events.transactions': {
		input: EventzillaEndpointInputSchemas.eventsTransactions,
		output: EventzillaEndpointOutputSchemas.eventsTransactions,
	},
	'events.attendees': {
		input: EventzillaEndpointInputSchemas.eventsAttendees,
		output: EventzillaEndpointOutputSchemas.eventsAttendees,
	},
	'tickets.list': {
		input: EventzillaEndpointInputSchemas.ticketsList,
		output: EventzillaEndpointOutputSchemas.ticketsList,
	},
	'tickets.create': {
		input: EventzillaEndpointInputSchemas.ticketsCreate,
		output: EventzillaEndpointOutputSchemas.ticketsCreate,
	},
	'tickets.update': {
		input: EventzillaEndpointInputSchemas.ticketsUpdate,
		output: EventzillaEndpointOutputSchemas.ticketsUpdate,
	},
	'attendees.get': {
		input: EventzillaEndpointInputSchemas.attendeesGet,
		output: EventzillaEndpointOutputSchemas.attendeesGet,
	},
	'attendees.checkin': {
		input: EventzillaEndpointInputSchemas.attendeesCheckin,
		output: EventzillaEndpointOutputSchemas.attendeesCheckin,
	},
	'orders.cancel': {
		input: EventzillaEndpointInputSchemas.ordersCancel,
		output: EventzillaEndpointOutputSchemas.ordersCancel,
	},
	'orders.confirm': {
		input: EventzillaEndpointInputSchemas.ordersConfirm,
		output: EventzillaEndpointOutputSchemas.ordersConfirm,
	},
	'sales.toggle': {
		input: EventzillaEndpointInputSchemas.salesToggle,
		output: EventzillaEndpointOutputSchemas.salesToggle,
	},
	'checkout.prepare': {
		input: EventzillaEndpointInputSchemas.checkoutPrepare,
		output: EventzillaEndpointOutputSchemas.checkoutPrepare,
	},
	'checkout.create': {
		input: EventzillaEndpointInputSchemas.checkoutCreate,
		output: EventzillaEndpointOutputSchemas.checkoutCreate,
	},
	'checkout.fillOrder': {
		input: EventzillaEndpointInputSchemas.checkoutFillOrder,
		output: EventzillaEndpointOutputSchemas.checkoutFillOrder,
	},
	'checkout.confirm': {
		input: EventzillaEndpointInputSchemas.checkoutConfirm,
		output: EventzillaEndpointOutputSchemas.checkoutConfirm,
	},
	'categories.list': {
		input: EventzillaEndpointInputSchemas.categoriesList,
		output: EventzillaEndpointOutputSchemas.categoriesList,
	},
	'users.list': {
		input: EventzillaEndpointInputSchemas.usersList,
		output: EventzillaEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: EventzillaEndpointInputSchemas.usersGet,
		output: EventzillaEndpointOutputSchemas.usersGet,
	},
	'transactions.get': {
		input: EventzillaEndpointInputSchemas.transactionsGet,
		output: EventzillaEndpointOutputSchemas.transactionsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof eventzillaEndpointsNested
>;

const eventzillaWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof eventzillaWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const eventzillaEndpointMeta = {
	'events.list': {
		riskLevel: 'read',
		description: `The account's events, paged with offset. Filter by status (only "live" is accepted) or category, and page with the returned next_offset. An empty account answers HTTP 200 with {"message":"No events found"} rather than an array, which is read here as an empty page.`,
	},
	'events.get': {
		riskLevel: 'read',
		description:
			'One event by its `id`. Answers an array even for a single id; an unknown id gives an empty array, not an error.',
	},
	'events.transactions': {
		riskLevel: 'read',
		description:
			'Paid and pending orders for one event, with buyer, amount and reference. Paged by offset; next_offset comes back on the result.',
	},
	'events.attendees': {
		riskLevel: 'read',
		description:
			'Every attendee for one event with their barcode, ticket type, answers and check-in state. The route takes no paging parameters, so the whole list arrives at once.',
	},
	'tickets.list': {
		riskLevel: 'read',
		description:
			'The ticket types on sale for one event, with price, quantity and sales window, plus any donation options.',
	},
	'tickets.create': {
		riskLevel: 'write',
		description:
			'Add a free ticket type to an event. Paid pricing is not part of this route: the reference documents it as free ticket types only.',
	},
	'tickets.update': {
		riskLevel: 'write',
		description:
			'Change an existing free ticket type. Every field is required, because the API treats this as a full replace rather than a patch.',
	},
	'attendees.get': {
		riskLevel: 'read',
		description:
			'One attendee by id, with their event, order reference and check-in state.',
	},
	'attendees.checkin': {
		riskLevel: 'write',
		description:
			'Check an attendee in, or revert their check-in, by ticket barcode. Passing `eventcheckin: true` twice is harmless.',
	},
	'orders.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel an order. The order and its tickets stop standing and the buyer is not restored by any other call; issuing a replacement means a new checkout.',
	},
	'orders.confirm': {
		riskLevel: 'write',
		description:
			'Confirm an order after checkout. Emails the buyer unless `sendemail` is false. Confirming an already-confirmed order is the API’s own decision to make.',
	},
	'sales.toggle': {
		riskLevel: 'write',
		description:
			'Open or close ticket sales for an event. Closing a sold-out event this way is reversible by toggling back.',
	},
	'checkout.prepare': {
		riskLevel: 'read',
		description:
			'What is on sale for one event date — ticket types, availability, payment options and registration questions — and the `payment_id` the later steps need. Needs the event’s `dateid`, not its `id`.',
	},
	'checkout.create': {
		riskLevel: 'write',
		description:
			'Reserve tickets and get one `ticket_price_id` per ticket plus a checkout id. The order stays incomplete until checkout.confirm, so an abandoned reservation holds inventory without charging anyone.',
	},
	'checkout.fillOrder': {
		riskLevel: 'write',
		description:
			'Attach buyer and attendee details to a reserved checkout. Nothing is charged and no email is sent until checkout.confirm.',
	},
	'checkout.confirm': {
		riskLevel: 'write',
		description:
			'Record the payment result and turn a filled checkout into a confirmed order. Emails the buyer unless `sendemail` is false. This is the step that completes a registration.',
	},
	'categories.list': {
		riskLevel: 'read',
		description:
			'Event category names, for the `category` filter on events.list. Answers HTTP 200 with an error body rather than a 401 when the key is refused, which this plugin turns into an auth error.',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'The organizer account and its sub-organizers, paged by offset.',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'One organizer by id, in the same array envelope as the list.',
	},
	'transactions.get': {
		riskLevel: 'read',
		description: `One order by checkout id or reference number. Verified live, this route does not filter: a small integer answers the account's most recent transaction, a real checkout id answers "Unauthorized access", and an unknown reference answers "Invalid reference number" (404). Check the returned refno before trusting it.`,
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof eventzillaEndpointsNested
>;

export const eventzillaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseEventzillaPlugin<T extends EventzillaPluginOptions> =
	CorsairPlugin<
		'eventzilla',
		typeof EventzillaSchema,
		typeof eventzillaEndpointsNested,
		typeof eventzillaWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalEventzillaPlugin =
	BaseEventzillaPlugin<EventzillaPluginOptions>;

export type ExternalEventzillaPlugin<T extends EventzillaPluginOptions> =
	BaseEventzillaPlugin<T>;

export function eventzilla<const T extends EventzillaPluginOptions>(
	incomingOptions: EventzillaPluginOptions & T = {} as EventzillaPluginOptions &
		T,
): ExternalEventzillaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'eventzilla',
		authConfig: eventzillaAuthConfig,
		schema: EventzillaSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: eventzillaEndpointsNested,
		webhooks: eventzillaWebhooksNested,
		endpointMeta: eventzillaEndpointMeta,
		endpointSchemas: eventzillaEndpointSchemas,
		webhookSchemas: eventzillaWebhookSchemas,
		// Eventzilla signs nothing, so there is no way to tell a real delivery
		// from a forged one and none is accepted.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: EventzillaKeyBuilderContext, source) => {
			// A webhook source is unreachable: no webhooks are registered. It is
			// still refused explicitly rather than returning a key for it.
			if (source === 'webhook') {
				throw new AuthMissingError('eventzilla', 'webhook');
			}

			if (options.key) return options.key;

			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('eventzilla', 'api_key');
			return key;
		},
	} satisfies InternalEventzillaPlugin;
}

export {
	EVENTZILLA_API_BASE,
	EventzillaAPIError,
	EventzillaTransportError,
} from './client';
export type {
	EventzillaEndpointInputs,
	EventzillaEndpointOutputs,
} from './endpoints/types';
