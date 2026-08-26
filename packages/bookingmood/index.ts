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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Bookings,
	Contacts,
	Members,
	Organizations,
	Products,
} from './endpoints';
import type {
	BookingmoodEndpointInputs,
	BookingmoodEndpointOutputs,
} from './endpoints/types';
import {
	BookingmoodEndpointInputSchemas,
	BookingmoodEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BookingmoodSchema } from './schema';
import { BookingmoodWebhooks } from './webhooks';
import { resolveBookingmoodOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBookingmoodTenantWebhook } from './webhooks/tenant-matcher';
import type {
	BookingCreatedEvent,
	BookingDeletedEvent,
	BookingmoodWebhookOutputs,
	BookingUpdatedEvent,
	ProductCreatedEvent,
	ProductUpdatedEvent,
} from './webhooks/types';
import {
	BookingCreatedEventSchema,
	BookingDeletedEventSchema,
	BookingUpdatedEventSchema,
	ProductCreatedEventSchema,
	ProductUpdatedEventSchema,
} from './webhooks/types';

export type BookingmoodPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBookingmoodPlugin['hooks'];
	webhookHooks?: InternalBookingmoodPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bookingmoodEndpointsNested>;
};

export type BookingmoodContext = CorsairPluginContext<
	typeof BookingmoodSchema,
	BookingmoodPluginOptions
>;

export type BookingmoodKeyBuilderContext =
	KeyBuilderContext<BookingmoodPluginOptions>;

export type BookingmoodBoundEndpoints = BindEndpoints<
	typeof bookingmoodEndpointsNested
>;

type BookingmoodEndpoint<K extends keyof BookingmoodEndpointOutputs> =
	CorsairEndpoint<
		BookingmoodContext,
		BookingmoodEndpointInputs[K],
		BookingmoodEndpointOutputs[K]
	>;

export type BookingmoodEndpoints = {
	organizationsGet: BookingmoodEndpoint<'organizationsGet'>;
	organizationsList: BookingmoodEndpoint<'organizationsList'>;
	bookingsGet: BookingmoodEndpoint<'bookingsGet'>;
	bookingsList: BookingmoodEndpoint<'bookingsList'>;
	bookingsCreate: BookingmoodEndpoint<'bookingsCreate'>;
	bookingsUpdate: BookingmoodEndpoint<'bookingsUpdate'>;
	bookingsDelete: BookingmoodEndpoint<'bookingsDelete'>;
	productsGet: BookingmoodEndpoint<'productsGet'>;
	productsList: BookingmoodEndpoint<'productsList'>;
	productsCreate: BookingmoodEndpoint<'productsCreate'>;
	productsUpdate: BookingmoodEndpoint<'productsUpdate'>;
	productsDelete: BookingmoodEndpoint<'productsDelete'>;
	membersGet: BookingmoodEndpoint<'membersGet'>;
	membersList: BookingmoodEndpoint<'membersList'>;
	contactsGet: BookingmoodEndpoint<'contactsGet'>;
	contactsList: BookingmoodEndpoint<'contactsList'>;
	contactsCreate: BookingmoodEndpoint<'contactsCreate'>;
	contactsUpdate: BookingmoodEndpoint<'contactsUpdate'>;
	contactsDelete: BookingmoodEndpoint<'contactsDelete'>;
};

type BookingmoodWebhook<
	K extends keyof BookingmoodWebhookOutputs,
	TEvent,
> = CorsairWebhook<BookingmoodContext, TEvent, BookingmoodWebhookOutputs[K]>;

export type BookingmoodWebhooksType = {
	bookingCreated: BookingmoodWebhook<'bookingCreated', BookingCreatedEvent>;
	bookingUpdated: BookingmoodWebhook<'bookingUpdated', BookingUpdatedEvent>;
	bookingDeleted: BookingmoodWebhook<'bookingDeleted', BookingDeletedEvent>;
	productCreated: BookingmoodWebhook<'productCreated', ProductCreatedEvent>;
	productUpdated: BookingmoodWebhook<'productUpdated', ProductUpdatedEvent>;
};

export type BookingmoodBoundWebhooks = BindWebhooks<BookingmoodWebhooksType>;

const bookingmoodEndpointsNested = {
	organizations: {
		get: Organizations.get,
		list: Organizations.list,
	},
	bookings: {
		get: Bookings.get,
		list: Bookings.list,
		create: Bookings.create,
		update: Bookings.update,
		delete: Bookings.deleteBooking,
	},
	products: {
		get: Products.get,
		list: Products.list,
		create: Products.create,
		update: Products.update,
		delete: Products.deleteProduct,
	},
	members: {
		get: Members.get,
		list: Members.list,
	},
	contacts: {
		get: Contacts.get,
		list: Contacts.list,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.deleteContact,
	},
} as const;

const bookingmoodWebhooksNested = {
	events: {
		bookingCreated: BookingmoodWebhooks.bookingCreated,
		bookingUpdated: BookingmoodWebhooks.bookingUpdated,
		bookingDeleted: BookingmoodWebhooks.bookingDeleted,
		productCreated: BookingmoodWebhooks.productCreated,
		productUpdated: BookingmoodWebhooks.productUpdated,
	},
} as const;

export const bookingmoodEndpointSchemas = {
	'organizations.get': {
		input: BookingmoodEndpointInputSchemas.organizationsGet,
		output: BookingmoodEndpointOutputSchemas.organizationsGet,
	},
	'organizations.list': {
		input: BookingmoodEndpointInputSchemas.organizationsList,
		output: BookingmoodEndpointOutputSchemas.organizationsList,
	},
	'bookings.get': {
		input: BookingmoodEndpointInputSchemas.bookingsGet,
		output: BookingmoodEndpointOutputSchemas.bookingsGet,
	},
	'bookings.list': {
		input: BookingmoodEndpointInputSchemas.bookingsList,
		output: BookingmoodEndpointOutputSchemas.bookingsList,
	},
	'bookings.create': {
		input: BookingmoodEndpointInputSchemas.bookingsCreate,
		output: BookingmoodEndpointOutputSchemas.bookingsCreate,
	},
	'bookings.update': {
		input: BookingmoodEndpointInputSchemas.bookingsUpdate,
		output: BookingmoodEndpointOutputSchemas.bookingsUpdate,
	},
	'bookings.delete': {
		input: BookingmoodEndpointInputSchemas.bookingsDelete,
		output: BookingmoodEndpointOutputSchemas.bookingsDelete,
	},
	'products.get': {
		input: BookingmoodEndpointInputSchemas.productsGet,
		output: BookingmoodEndpointOutputSchemas.productsGet,
	},
	'products.list': {
		input: BookingmoodEndpointInputSchemas.productsList,
		output: BookingmoodEndpointOutputSchemas.productsList,
	},
	'products.create': {
		input: BookingmoodEndpointInputSchemas.productsCreate,
		output: BookingmoodEndpointOutputSchemas.productsCreate,
	},
	'products.update': {
		input: BookingmoodEndpointInputSchemas.productsUpdate,
		output: BookingmoodEndpointOutputSchemas.productsUpdate,
	},
	'products.delete': {
		input: BookingmoodEndpointInputSchemas.productsDelete,
		output: BookingmoodEndpointOutputSchemas.productsDelete,
	},
	'members.get': {
		input: BookingmoodEndpointInputSchemas.membersGet,
		output: BookingmoodEndpointOutputSchemas.membersGet,
	},
	'members.list': {
		input: BookingmoodEndpointInputSchemas.membersList,
		output: BookingmoodEndpointOutputSchemas.membersList,
	},
	'contacts.get': {
		input: BookingmoodEndpointInputSchemas.contactsGet,
		output: BookingmoodEndpointOutputSchemas.contactsGet,
	},
	'contacts.list': {
		input: BookingmoodEndpointInputSchemas.contactsList,
		output: BookingmoodEndpointOutputSchemas.contactsList,
	},
	'contacts.create': {
		input: BookingmoodEndpointInputSchemas.contactsCreate,
		output: BookingmoodEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: BookingmoodEndpointInputSchemas.contactsUpdate,
		output: BookingmoodEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: BookingmoodEndpointInputSchemas.contactsDelete,
		output: BookingmoodEndpointOutputSchemas.contactsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bookingmoodEndpointsNested
>;

const bookingmoodWebhookSchemas = {
	'events.bookingCreated': {
		description: 'Triggered when a booking is created',
		payload: BookingCreatedEventSchema,
		response: BookingCreatedEventSchema,
	},
	'events.bookingUpdated': {
		description: 'Triggered when a booking is updated',
		payload: BookingUpdatedEventSchema,
		response: BookingUpdatedEventSchema,
	},
	'events.bookingDeleted': {
		description: 'Triggered when a booking is deleted',
		payload: BookingDeletedEventSchema,
		response: BookingDeletedEventSchema,
	},
	'events.productCreated': {
		description: 'Triggered when a product is created',
		payload: ProductCreatedEventSchema,
		response: ProductCreatedEventSchema,
	},
	'events.productUpdated': {
		description: 'Triggered when a product is updated',
		payload: ProductUpdatedEventSchema,
		response: ProductUpdatedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof bookingmoodWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bookingmoodEndpointMeta = {
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization by ID',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations',
	},
	'bookings.get': {
		riskLevel: 'read',
		description: 'Get a booking by ID',
	},
	'bookings.list': {
		riskLevel: 'read',
		description: 'List bookings',
	},
	'bookings.create': {
		riskLevel: 'write',
		description: 'Create a new booking',
	},
	'bookings.update': {
		riskLevel: 'write',
		description: 'Update a booking',
	},
	'bookings.delete': {
		riskLevel: 'write',
		description: 'Delete a booking',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Get a rental product by ID',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'List rental products',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create a new rental product',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update a rental product',
	},
	'products.delete': {
		riskLevel: 'write',
		description: 'Delete a rental product',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Get an organization member by ID',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List organization members',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a contact by ID',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact',
	},
	'contacts.delete': {
		riskLevel: 'write',
		description: 'Delete a contact',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof bookingmoodEndpointsNested
>;

export const bookingmoodAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBookingmoodPlugin<T extends BookingmoodPluginOptions> =
	CorsairPlugin<
		'bookingmood',
		typeof BookingmoodSchema,
		typeof bookingmoodEndpointsNested,
		typeof bookingmoodWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalBookingmoodPlugin =
	BaseBookingmoodPlugin<BookingmoodPluginOptions>;

export type ExternalBookingmoodPlugin<T extends BookingmoodPluginOptions> =
	BaseBookingmoodPlugin<T>;

export function bookingmood<const T extends BookingmoodPluginOptions>(
	incomingOptions: BookingmoodPluginOptions &
		T = {} as BookingmoodPluginOptions & T,
): ExternalBookingmoodPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bookingmood',
		authConfig: bookingmoodAuthConfig,
		schema: BookingmoodSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bookingmoodEndpointsNested,
		webhooks: bookingmoodWebhooksNested,
		endpointMeta: bookingmoodEndpointMeta,
		endpointSchemas: bookingmoodEndpointSchemas,
		webhookSchemas: bookingmoodWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-bookingmood-signature' in headers || 'x-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBookingmoodTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBookingmoodOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BookingmoodKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBookingmoodPlugin;
}

export type {
	BookingmoodEndpointInputs,
	BookingmoodEndpointOutputs,
	BookingsCreateInput,
	BookingsCreateResponse,
	BookingsDeleteInput,
	BookingsDeleteResponse,
	BookingsGetInput,
	BookingsGetResponse,
	BookingsListInput,
	BookingsListResponse,
	BookingsUpdateInput,
	BookingsUpdateResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	MembersGetInput,
	MembersGetResponse,
	MembersListInput,
	MembersListResponse,
	OrganizationsGetInput,
	OrganizationsGetResponse,
	OrganizationsListInput,
	OrganizationsListResponse,
	ProductsCreateInput,
	ProductsCreateResponse,
	ProductsDeleteInput,
	ProductsDeleteResponse,
	ProductsGetInput,
	ProductsGetResponse,
	ProductsListInput,
	ProductsListResponse,
	ProductsUpdateInput,
	ProductsUpdateResponse,
} from './endpoints/types';
export type {
	BookingCreatedEvent,
	BookingDeletedEvent,
	BookingmoodWebhookOutputs,
	BookingUpdatedEvent,
	ProductCreatedEvent,
	ProductUpdatedEvent,
} from './webhooks/types';
