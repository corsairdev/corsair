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
import { AuthMissingError } from 'corsair/core';
import { Appointments, Bookings, Products, Subscriptions } from './endpoints';
import type {
	AppointoEndpointInputs,
	AppointoEndpointOutputs,
} from './endpoints/types';
import {
	AppointoEndpointInputSchemas,
	AppointoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AppointoSchema } from './schema';
import type { AppointoWebhookOutputs } from './webhooks/types';

export type AppointoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAppointoPlugin['hooks'];
	webhookHooks?: InternalAppointoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof appointoEndpointsNested>;
};

export type AppointoContext = CorsairPluginContext<
	typeof AppointoSchema,
	AppointoPluginOptions
>;

export type AppointoKeyBuilderContext =
	KeyBuilderContext<AppointoPluginOptions>;

export type AppointoBoundEndpoints = BindEndpoints<
	typeof appointoEndpointsNested
>;

type AppointoEndpoint<K extends keyof AppointoEndpointOutputs> =
	CorsairEndpoint<
		AppointoContext,
		AppointoEndpointInputs[K],
		AppointoEndpointOutputs[K]
	>;

export type AppointoEndpoints = {
	productsList: AppointoEndpoint<'productsList'>;
	appointmentsList: AppointoEndpoint<'appointmentsList'>;
	appointmentsGetAvailability: AppointoEndpoint<'appointmentsGetAvailability'>;
	appointmentsUpsertConfig: AppointoEndpoint<'appointmentsUpsertConfig'>;
	bookingsList: AppointoEndpoint<'bookingsList'>;
	bookingsCreate: AppointoEndpoint<'bookingsCreate'>;
	bookingsReschedule: AppointoEndpoint<'bookingsReschedule'>;
	bookingsCancel: AppointoEndpoint<'bookingsCancel'>;
	bookingsUpdate: AppointoEndpoint<'bookingsUpdate'>;
	subscriptionsList: AppointoEndpoint<'subscriptionsList'>;
};

type AppointoWebhook<
	K extends keyof AppointoWebhookOutputs,
	TEvent,
> = CorsairWebhook<AppointoContext, TEvent, AppointoWebhookOutputs[K]>;

// Appointo does not expose native webhooks
export type AppointoWebhooks = Record<string, never>;

export type AppointoBoundWebhooks = BindWebhooks<AppointoWebhooks>;

const appointoEndpointsNested = {
	products: {
		list: Products.list,
	},
	appointments: {
		list: Appointments.list,
		getAvailability: Appointments.getAvailability,
		upsertConfig: Appointments.upsertConfig,
	},
	bookings: {
		list: Bookings.list,
		create: Bookings.create,
		reschedule: Bookings.reschedule,
		cancel: Bookings.cancel,
		update: Bookings.update,
	},
	subscriptions: {
		list: Subscriptions.list,
	},
} as const;

const appointoWebhooksNested = {} as const;

export const appointoEndpointSchemas = {
	'products.list': {
		input: AppointoEndpointInputSchemas.productsList,
		output: AppointoEndpointOutputSchemas.productsList,
	},
	'appointments.list': {
		input: AppointoEndpointInputSchemas.appointmentsList,
		output: AppointoEndpointOutputSchemas.appointmentsList,
	},
	'appointments.getAvailability': {
		input: AppointoEndpointInputSchemas.appointmentsGetAvailability,
		output: AppointoEndpointOutputSchemas.appointmentsGetAvailability,
	},
	'appointments.upsertConfig': {
		input: AppointoEndpointInputSchemas.appointmentsUpsertConfig,
		output: AppointoEndpointOutputSchemas.appointmentsUpsertConfig,
	},
	'bookings.list': {
		input: AppointoEndpointInputSchemas.bookingsList,
		output: AppointoEndpointOutputSchemas.bookingsList,
	},
	'bookings.create': {
		input: AppointoEndpointInputSchemas.bookingsCreate,
		output: AppointoEndpointOutputSchemas.bookingsCreate,
	},
	'bookings.reschedule': {
		input: AppointoEndpointInputSchemas.bookingsReschedule,
		output: AppointoEndpointOutputSchemas.bookingsReschedule,
	},
	'bookings.cancel': {
		input: AppointoEndpointInputSchemas.bookingsCancel,
		output: AppointoEndpointOutputSchemas.bookingsCancel,
	},
	'bookings.update': {
		input: AppointoEndpointInputSchemas.bookingsUpdate,
		output: AppointoEndpointOutputSchemas.bookingsUpdate,
	},
	'subscriptions.list': {
		input: AppointoEndpointInputSchemas.subscriptionsList,
		output: AppointoEndpointOutputSchemas.subscriptionsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof appointoEndpointsNested
>;

const appointoWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof appointoWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const appointoEndpointMeta = {
	'products.list': {
		riskLevel: 'read',
		description: 'List all products',
	},
	'appointments.list': {
		riskLevel: 'read',
		description: 'List all appointments',
	},
	'appointments.getAvailability': {
		riskLevel: 'read',
		description: 'Get calendar availability for an appointment',
	},
	'appointments.upsertConfig': {
		riskLevel: 'write',
		description: 'Update appointment configuration',
	},
	'bookings.list': {
		riskLevel: 'read',
		description: 'List all bookings',
	},
	'bookings.create': {
		riskLevel: 'write',
		description: 'Create a new booking',
	},
	'bookings.reschedule': {
		riskLevel: 'write',
		description: 'Reschedule an existing booking',
	},
	'bookings.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a booking',
	},
	'bookings.update': {
		riskLevel: 'write',
		description: 'Update a booking (buffer updates)',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description: 'List all appointment subscriptions',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof appointoEndpointsNested>;

export const appointoAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAppointoPlugin<T extends AppointoPluginOptions> = CorsairPlugin<
	'appointo',
	typeof AppointoSchema,
	typeof appointoEndpointsNested,
	typeof appointoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAppointoPlugin = BaseAppointoPlugin<AppointoPluginOptions>;

export type ExternalAppointoPlugin<T extends AppointoPluginOptions> =
	BaseAppointoPlugin<T>;

export function appointo<const T extends AppointoPluginOptions>(
	incomingOptions: AppointoPluginOptions & T = {} as AppointoPluginOptions & T,
): ExternalAppointoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'appointo',
		authConfig: appointoAuthConfig,
		schema: AppointoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: appointoEndpointsNested,
		webhooks: appointoWebhooksNested,
		endpointMeta: appointoEndpointMeta,
		endpointSchemas: appointoEndpointSchemas,
		webhookSchemas: appointoWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: async () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AppointoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					throw new AuthMissingError('appointo', 'api_key');
				}

				return res;
			}

			throw new AuthMissingError('appointo', 'api_key');
		},
	} satisfies InternalAppointoPlugin;
}

export type {
	AppointmentsGetAvailabilityInput,
	AppointmentsGetAvailabilityResponse,
	AppointmentsListInput,
	AppointmentsListResponse,
	AppointmentsUpsertConfigInput,
	AppointmentsUpsertConfigResponse,
	AppointoEndpointInputs,
	AppointoEndpointOutputs,
	BookingsCancelInput,
	BookingsCancelResponse,
	BookingsCreateInput,
	BookingsCreateResponse,
	BookingsListInput,
	BookingsListResponse,
	BookingsRescheduleInput,
	BookingsRescheduleResponse,
	BookingsUpdateInput,
	BookingsUpdateResponse,
	ProductsListInput,
	ProductsListResponse,
	SubscriptionsListInput,
	SubscriptionsListResponse,
} from './endpoints/types';

export type { AppointoWebhookOutputs } from './webhooks/types';
