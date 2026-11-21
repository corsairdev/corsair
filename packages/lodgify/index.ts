import type {
	AuthTypes,
	BindEndpoints,
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Availability,
	Messages,
	Properties,
	Quotes,
	Rates,
	Reservations,
} from './endpoints';
import type {
	LodgifyEndpointInputs,
	LodgifyEndpointOutputs,
} from './endpoints/types';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LodgifySchema } from './schema';

export type LodgifyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLodgifyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lodgifyEndpointsNested>;
};

export type LodgifyContext = CorsairPluginContext<
	typeof LodgifySchema,
	LodgifyPluginOptions
>;

export type LodgifyKeyBuilderContext = KeyBuilderContext<LodgifyPluginOptions>;

export type LodgifyBoundEndpoints = BindEndpoints<
	typeof lodgifyEndpointsNested
>;

type LodgifyEndpoint<K extends keyof LodgifyEndpointOutputs> = CorsairEndpoint<
	LodgifyContext,
	LodgifyEndpointInputs[K],
	LodgifyEndpointOutputs[K]
>;

export type LodgifyEndpoints = {
	'properties.list': LodgifyEndpoint<'properties.list'>;
	'properties.get': LodgifyEndpoint<'properties.get'>;
	'properties.getRooms': LodgifyEndpoint<'properties.getRooms'>;
	'properties.getDeleted': LodgifyEndpoint<'properties.getDeleted'>;
	'properties.getAddons': LodgifyEndpoint<'properties.getAddons'>;
	'properties.getPayments': LodgifyEndpoint<'properties.getPayments'>;
	'reservations.list': LodgifyEndpoint<'reservations.list'>;
	'reservations.listInbox': LodgifyEndpoint<'reservations.listInbox'>;
	'reservations.get': LodgifyEndpoint<'reservations.get'>;
	'reservations.getEnquiry': LodgifyEndpoint<'reservations.getEnquiry'>;
	'reservations.create': LodgifyEndpoint<'reservations.create'>;
	'reservations.createEnquiry': LodgifyEndpoint<'reservations.createEnquiry'>;
	'reservations.unreadCount': LodgifyEndpoint<'reservations.unreadCount'>;
	'availability.get': LodgifyEndpoint<'availability.get'>;
	'availability.getAll': LodgifyEndpoint<'availability.getAll'>;
	'availability.getRoomType': LodgifyEndpoint<'availability.getRoomType'>;
	'availability.set': LodgifyEndpoint<'availability.set'>;
	'rates.calendar': LodgifyEndpoint<'rates.calendar'>;
	'rates.calendarSimple': LodgifyEndpoint<'rates.calendarSimple'>;
	'rates.settings': LodgifyEndpoint<'rates.settings'>;
	'rates.update': LodgifyEndpoint<'rates.update'>;
	'quotes.calculate': LodgifyEndpoint<'quotes.calculate'>;
	'messages.list': LodgifyEndpoint<'messages.list'>;
	'messages.send': LodgifyEndpoint<'messages.send'>;
};

export const lodgifyEndpointsNested = {
	properties: {
		list: Properties.list,
		get: Properties.get,
		getRooms: Properties.getRooms,
		getDeleted: Properties.getDeleted,
		getAddons: Properties.getAddons,
		getPayments: Properties.getPayments,
	},
	reservations: {
		list: Reservations.list,
		listInbox: Reservations.listInbox,
		get: Reservations.get,
		getEnquiry: Reservations.getEnquiry,
		create: Reservations.create,
		createEnquiry: Reservations.createEnquiry,
		unreadCount: Reservations.unreadCount,
	},
	availability: {
		get: Availability.get,
		getAll: Availability.getAll,
		getRoomType: Availability.getRoomType,
		set: Availability.set,
	},
	rates: {
		calendar: Rates.calendar,
		calendarSimple: Rates.calendarSimple,
		settings: Rates.settings,
		update: Rates.update,
	},
	quotes: {
		calculate: Quotes.calculate,
	},
	messages: {
		list: Messages.list,
		send: Messages.send,
	},
} as const;

export const lodgifyEndpointSchemas = {
	'properties.list': {
		input: LodgifyEndpointInputSchemas['properties.list'],
		output: LodgifyEndpointOutputSchemas['properties.list'],
	},
	'properties.get': {
		input: LodgifyEndpointInputSchemas['properties.get'],
		output: LodgifyEndpointOutputSchemas['properties.get'],
	},
	'properties.getRooms': {
		input: LodgifyEndpointInputSchemas['properties.getRooms'],
		output: LodgifyEndpointOutputSchemas['properties.getRooms'],
	},
	'properties.getDeleted': {
		input: LodgifyEndpointInputSchemas['properties.getDeleted'],
		output: LodgifyEndpointOutputSchemas['properties.getDeleted'],
	},
	'properties.getAddons': {
		input: LodgifyEndpointInputSchemas['properties.getAddons'],
		output: LodgifyEndpointOutputSchemas['properties.getAddons'],
	},
	'properties.getPayments': {
		input: LodgifyEndpointInputSchemas['properties.getPayments'],
		output: LodgifyEndpointOutputSchemas['properties.getPayments'],
	},
	'reservations.list': {
		input: LodgifyEndpointInputSchemas['reservations.list'],
		output: LodgifyEndpointOutputSchemas['reservations.list'],
	},
	'reservations.listInbox': {
		input: LodgifyEndpointInputSchemas['reservations.listInbox'],
		output: LodgifyEndpointOutputSchemas['reservations.listInbox'],
	},
	'reservations.get': {
		input: LodgifyEndpointInputSchemas['reservations.get'],
		output: LodgifyEndpointOutputSchemas['reservations.get'],
	},
	'reservations.getEnquiry': {
		input: LodgifyEndpointInputSchemas['reservations.getEnquiry'],
		output: LodgifyEndpointOutputSchemas['reservations.getEnquiry'],
	},
	'reservations.create': {
		input: LodgifyEndpointInputSchemas['reservations.create'],
		output: LodgifyEndpointOutputSchemas['reservations.create'],
	},
	'reservations.createEnquiry': {
		input: LodgifyEndpointInputSchemas['reservations.createEnquiry'],
		output: LodgifyEndpointOutputSchemas['reservations.createEnquiry'],
	},
	'reservations.unreadCount': {
		input: LodgifyEndpointInputSchemas['reservations.unreadCount'],
		output: LodgifyEndpointOutputSchemas['reservations.unreadCount'],
	},
	'availability.get': {
		input: LodgifyEndpointInputSchemas['availability.get'],
		output: LodgifyEndpointOutputSchemas['availability.get'],
	},
	'availability.getAll': {
		input: LodgifyEndpointInputSchemas['availability.getAll'],
		output: LodgifyEndpointOutputSchemas['availability.getAll'],
	},
	'availability.getRoomType': {
		input: LodgifyEndpointInputSchemas['availability.getRoomType'],
		output: LodgifyEndpointOutputSchemas['availability.getRoomType'],
	},
	'availability.set': {
		input: LodgifyEndpointInputSchemas['availability.set'],
		output: LodgifyEndpointOutputSchemas['availability.set'],
	},
	'rates.calendar': {
		input: LodgifyEndpointInputSchemas['rates.calendar'],
		output: LodgifyEndpointOutputSchemas['rates.calendar'],
	},
	'rates.calendarSimple': {
		input: LodgifyEndpointInputSchemas['rates.calendarSimple'],
		output: LodgifyEndpointOutputSchemas['rates.calendarSimple'],
	},
	'rates.settings': {
		input: LodgifyEndpointInputSchemas['rates.settings'],
		output: LodgifyEndpointOutputSchemas['rates.settings'],
	},
	'rates.update': {
		input: LodgifyEndpointInputSchemas['rates.update'],
		output: LodgifyEndpointOutputSchemas['rates.update'],
	},
	'quotes.calculate': {
		input: LodgifyEndpointInputSchemas['quotes.calculate'],
		output: LodgifyEndpointOutputSchemas['quotes.calculate'],
	},
	'messages.list': {
		input: LodgifyEndpointInputSchemas['messages.list'],
		output: LodgifyEndpointOutputSchemas['messages.list'],
	},
	'messages.send': {
		input: LodgifyEndpointInputSchemas['messages.send'],
		output: LodgifyEndpointOutputSchemas['messages.send'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof lodgifyEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const lodgifyEndpointMeta = {
	'properties.list': {
		riskLevel: 'read',
		description: 'List vacation rental properties',
	},
	'properties.get': {
		riskLevel: 'read',
		description: 'Get property details by ID',
	},
	'properties.getRooms': {
		riskLevel: 'read',
		description: 'Get room types for a property',
	},
	'properties.getDeleted': {
		riskLevel: 'read',
		description: 'List IDs of properties deleted since a given date',
	},
	'properties.getAddons': {
		riskLevel: 'read',
		description: 'Get available add-ons for a property and date range',
	},
	'properties.getPayments': {
		riskLevel: 'read',
		description: 'Get payment methods available for a property',
	},
	'reservations.list': {
		riskLevel: 'read',
		description: 'List reservations and bookings',
	},
	'reservations.listInbox': {
		riskLevel: 'read',
		description: 'List bookings and enquiries in the Lodgify inbox',
	},
	'reservations.get': {
		riskLevel: 'read',
		description: 'Get reservation or booking details by ID',
	},
	'reservations.getEnquiry': {
		riskLevel: 'read',
		description: 'Get guest enquiry details by ID',
	},
	'reservations.create': {
		riskLevel: 'destructive',
		description: 'Create a new reservation or booking',
	},
	'reservations.createEnquiry': {
		riskLevel: 'destructive',
		description: 'Create a guest enquiry with guest and stay details',
	},
	'reservations.unreadCount': {
		riskLevel: 'read',
		description: 'Get the count of unread booking and enquiry messages',
	},
	'availability.get': {
		riskLevel: 'read',
		description: 'Get availability calendar periods for a property',
	},
	'availability.getAll': {
		riskLevel: 'read',
		description: 'Get availability calendars for all Lodgify properties',
	},
	'availability.getRoomType': {
		riskLevel: 'read',
		description: 'Get availability calendar periods for a property room type',
	},
	'availability.set': {
		riskLevel: 'destructive',
		description: 'Set the number of available units for a room type and period',
	},
	'rates.calendar': {
		riskLevel: 'read',
		description: 'Get nightly rates for a property room type and date range',
	},
	'rates.calendarSimple': {
		riskLevel: 'read',
		description:
			'Get the simplified nightly rates calendar for a property room type',
	},
	'rates.settings': {
		riskLevel: 'read',
		description: 'Get rate settings for a Lodgify property',
	},
	'rates.update': {
		riskLevel: 'destructive',
		description: 'Update nightly rates for a property room type',
	},
	'quotes.calculate': {
		riskLevel: 'read',
		description: 'Calculate quote and pricing for a stay',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List guest messaging threads or messages',
	},
	'messages.send': {
		riskLevel: 'destructive',
		description: 'Send a message to a guest or thread',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lodgifyEndpointsNested>;

export const lodgifyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLodgifyPlugin<T extends LodgifyPluginOptions> = CorsairPlugin<
	'lodgify',
	typeof LodgifySchema,
	typeof lodgifyEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalLodgifyPlugin = BaseLodgifyPlugin<LodgifyPluginOptions>;

export type ExternalLodgifyPlugin<T extends LodgifyPluginOptions> =
	BaseLodgifyPlugin<T>;

const PUBLIC_ENDPOINTS = new Set<string>();

export function lodgify<const T extends LodgifyPluginOptions>(
	incomingOptions: LodgifyPluginOptions & T = {} as LodgifyPluginOptions & T,
): ExternalLodgifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const combinedErrorHandlers: CorsairErrorHandler = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'lodgify',
		authConfig: lodgifyAuthConfig,
		schema: LodgifySchema,
		options,
		hooks: options.hooks,
		endpoints: lodgifyEndpointsNested,
		webhooks: {},
		endpointMeta: lodgifyEndpointMeta,
		endpointSchemas: lodgifyEndpointSchemas,
		errorHandlers: combinedErrorHandlers,
		keyBuilder: async (ctx: LodgifyKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) throw new AuthMissingError('lodgify', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('lodgify', 'api_key');
			return apiKey;
		},
	} satisfies InternalLodgifyPlugin;
}

export type {
	LodgifyAvailabilityCalendarSchema,
	LodgifyAvailabilityGetAllInputSchema,
	LodgifyAvailabilityGetAllOutputSchema,
	LodgifyAvailabilityGetInputSchema,
	LodgifyAvailabilityGetOutputSchema,
	LodgifyAvailabilityGetRoomTypeInputSchema,
	LodgifyAvailabilityGetRoomTypeOutputSchema,
	LodgifyAvailabilityPeriodSchema,
	LodgifyAvailabilitySetInputSchema,
	LodgifyAvailabilitySetOutputSchema,
	LodgifyCreateGuestSchema,
	LodgifyEndpointInputs,
	LodgifyEndpointOutputs,
	LodgifyGuestNameSchema,
	LodgifyGuestSchema,
	LodgifyGuestViewSchema,
	LodgifyInboxItemSchema,
	LodgifyMessageSchema,
	LodgifyMessagesListInputSchema,
	LodgifyMessagesListOutputSchema,
	LodgifyMessagesSendInputSchema,
	LodgifyMessagesSendOutputSchema,
	LodgifyPropertiesGetAddonsInputSchema,
	LodgifyPropertiesGetAddonsOutputSchema,
	LodgifyPropertiesGetDeletedInputSchema,
	LodgifyPropertiesGetDeletedOutputSchema,
	LodgifyPropertiesGetInputSchema,
	LodgifyPropertiesGetOutputSchema,
	LodgifyPropertiesGetPaymentsInputSchema,
	LodgifyPropertiesGetPaymentsOutputSchema,
	LodgifyPropertiesGetRoomsInputSchema,
	LodgifyPropertiesGetRoomsOutputSchema,
	LodgifyPropertiesListInputSchema,
	LodgifyPropertiesListOutputSchema,
	LodgifyPropertyAddonSchema,
	LodgifyPropertyRoomSchema,
	LodgifyPropertySchema,
	LodgifyQuoteSchema,
	LodgifyQuotesCalculateInputSchema,
	LodgifyQuotesCalculateOutputSchema,
	LodgifyRateCalendarItemSchema,
	LodgifyRateSettingsSchema,
	LodgifyRateSimpleCalendarItemSchema,
	LodgifyRatesCalendarInputSchema,
	LodgifyRatesCalendarOutputSchema,
	LodgifyRatesCalendarSimpleOutputSchema,
	LodgifyRatesSettingsInputSchema,
	LodgifyRatesSettingsOutputSchema,
	LodgifyRateUpdateInputSchema,
	LodgifyRateUpdateOutputSchema,
	LodgifyReservationSchema,
	LodgifyReservationsCreateEnquiryInputSchema,
	LodgifyReservationsCreateEnquiryOutputSchema,
	LodgifyReservationsCreateInputSchema,
	LodgifyReservationsCreateOutputSchema,
	LodgifyReservationsGetEnquiryInputSchema,
	LodgifyReservationsGetEnquiryOutputSchema,
	LodgifyReservationsGetInputSchema,
	LodgifyReservationsGetOutputSchema,
	LodgifyReservationsInboxListInputSchema,
	LodgifyReservationsInboxListOutputSchema,
	LodgifyReservationsListInputSchema,
	LodgifyReservationsListOutputSchema,
	LodgifyReservationsUnreadCountInputSchema,
	LodgifyReservationsUnreadCountOutputSchema,
} from './endpoints/types';
