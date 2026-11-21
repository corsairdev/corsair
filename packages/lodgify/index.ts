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
	Channels,
	Global,
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
	'countries.list': LodgifyEndpoint<'countries.list'>;
	'countries.get': LodgifyEndpoint<'countries.get'>;
	'currencies.list': LodgifyEndpoint<'currencies.list'>;
	'currencies.get': LodgifyEndpoint<'currencies.get'>;
	'channels.inventory': LodgifyEndpoint<'channels.inventory'>;
	'properties.list': LodgifyEndpoint<'properties.list'>;
	'properties.get': LodgifyEndpoint<'properties.get'>;
	'properties.getRooms': LodgifyEndpoint<'properties.getRooms'>;
	'properties.listV1': LodgifyEndpoint<'properties.listV1'>;
	'properties.getV1': LodgifyEndpoint<'properties.getV1'>;
	'properties.getRoomV1': LodgifyEndpoint<'properties.getRoomV1'>;
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
	'reservations.getBookingV1': LodgifyEndpoint<'reservations.getBookingV1'>;
	'reservations.updateBooking': LodgifyEndpoint<'reservations.updateBooking'>;
	'reservations.deleteBooking': LodgifyEndpoint<'reservations.deleteBooking'>;
	'reservations.deleteEnquiry': LodgifyEndpoint<'reservations.deleteEnquiry'>;
	'reservations.createCallMeBack': LodgifyEndpoint<'reservations.createCallMeBack'>;
	'reservations.createQuote': LodgifyEndpoint<'reservations.createQuote'>;
	'reservations.getQuote': LodgifyEndpoint<'reservations.getQuote'>;
	'reservations.getPaymentLinkV1': LodgifyEndpoint<'reservations.getPaymentLinkV1'>;
	'reservations.getPaymentLink': LodgifyEndpoint<'reservations.getPaymentLink'>;
	'reservations.recoverBooking': LodgifyEndpoint<'reservations.recoverBooking'>;
	'reservations.recoverEnquiry': LodgifyEndpoint<'reservations.recoverEnquiry'>;
	'reservations.reopenBooking': LodgifyEndpoint<'reservations.reopenBooking'>;
	'reservations.declineBooking': LodgifyEndpoint<'reservations.declineBooking'>;
	'reservations.tentativeBooking': LodgifyEndpoint<'reservations.tentativeBooking'>;
	'reservations.bookBooking': LodgifyEndpoint<'reservations.bookBooking'>;
	'reservations.declineEnquiry': LodgifyEndpoint<'reservations.declineEnquiry'>;
	'reservations.reopenEnquiry': LodgifyEndpoint<'reservations.reopenEnquiry'>;
	'reservations.deleteMany': LodgifyEndpoint<'reservations.deleteMany'>;
	'reservations.requestPayment': LodgifyEndpoint<'reservations.requestPayment'>;
	'reservations.checkInV1': LodgifyEndpoint<'reservations.checkInV1'>;
	'reservations.checkOutV1': LodgifyEndpoint<'reservations.checkOutV1'>;
	'reservations.markManyReplied': LodgifyEndpoint<'reservations.markManyReplied'>;
	'reservations.markManyNotReplied': LodgifyEndpoint<'reservations.markManyNotReplied'>;
	'reservations.markBookingReplied': LodgifyEndpoint<'reservations.markBookingReplied'>;
	'reservations.markEnquiryReplied': LodgifyEndpoint<'reservations.markEnquiryReplied'>;
	'reservations.markBookingNotReplied': LodgifyEndpoint<'reservations.markBookingNotReplied'>;
	'reservations.markEnquiryNotReplied': LodgifyEndpoint<'reservations.markEnquiryNotReplied'>;
	'reservations.checkIn': LodgifyEndpoint<'reservations.checkIn'>;
	'reservations.checkOut': LodgifyEndpoint<'reservations.checkOut'>;
	'reservations.getExternalBookings': LodgifyEndpoint<'reservations.getExternalBookings'>;
	'reservations.updateKeyCodes': LodgifyEndpoint<'reservations.updateKeyCodes'>;
	'availability.get': LodgifyEndpoint<'availability.get'>;
	'availability.getAll': LodgifyEndpoint<'availability.getAll'>;
	'availability.getRoomType': LodgifyEndpoint<'availability.getRoomType'>;
	'availability.set': LodgifyEndpoint<'availability.set'>;
	'availability.getLegacyAll': LodgifyEndpoint<'availability.getLegacyAll'>;
	'availability.getLegacyProperty': LodgifyEndpoint<'availability.getLegacyProperty'>;
	'availability.getLegacyRoomType': LodgifyEndpoint<'availability.getLegacyRoomType'>;
	'rates.calendar': LodgifyEndpoint<'rates.calendar'>;
	'rates.calendarSimple': LodgifyEndpoint<'rates.calendarSimple'>;
	'rates.settings': LodgifyEndpoint<'rates.settings'>;
	'rates.update': LodgifyEndpoint<'rates.update'>;
	'quotes.calculate': LodgifyEndpoint<'quotes.calculate'>;
	'quotes.calculateV1': LodgifyEndpoint<'quotes.calculateV1'>;
	'messages.list': LodgifyEndpoint<'messages.list'>;
	'messages.send': LodgifyEndpoint<'messages.send'>;
};

export const lodgifyEndpointsNested = {
	countries: {
		list: Global.countriesList,
		get: Global.countryGet,
	},
	currencies: {
		list: Global.currenciesList,
		get: Global.currencyGet,
	},
	channels: {
		inventory: Channels.inventory,
	},
	properties: {
		list: Properties.list,
		get: Properties.get,
		getRooms: Properties.getRooms,
		listV1: Properties.listV1,
		getV1: Properties.getV1,
		getRoomV1: Properties.getRoomV1,
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
		getBookingV1: Reservations.getBookingV1,
		updateBooking: Reservations.updateBooking,
		deleteBooking: Reservations.deleteBooking,
		deleteEnquiry: Reservations.deleteEnquiry,
		createCallMeBack: Reservations.createCallMeBack,
		createQuote: Reservations.createQuote,
		getQuote: Reservations.getQuote,
		getPaymentLinkV1: Reservations.getPaymentLinkV1,
		getPaymentLink: Reservations.getPaymentLink,
		recoverBooking: Reservations.recoverBooking,
		recoverEnquiry: Reservations.recoverEnquiry,
		reopenBooking: Reservations.reopenBooking,
		declineBooking: Reservations.declineBooking,
		tentativeBooking: Reservations.tentativeBooking,
		bookBooking: Reservations.bookBooking,
		declineEnquiry: Reservations.declineEnquiry,
		reopenEnquiry: Reservations.reopenEnquiry,
		deleteMany: Reservations.deleteMany,
		requestPayment: Reservations.requestPayment,
		checkInV1: Reservations.checkInV1,
		checkOutV1: Reservations.checkOutV1,
		markManyReplied: Reservations.markManyReplied,
		markManyNotReplied: Reservations.markManyNotReplied,
		markBookingReplied: Reservations.markBookingReplied,
		markEnquiryReplied: Reservations.markEnquiryReplied,
		markBookingNotReplied: Reservations.markBookingNotReplied,
		markEnquiryNotReplied: Reservations.markEnquiryNotReplied,
		checkIn: Reservations.checkIn,
		checkOut: Reservations.checkOut,
		getExternalBookings: Reservations.getExternalBookings,
		updateKeyCodes: Reservations.updateKeyCodes,
	},
	availability: {
		get: Availability.get,
		getAll: Availability.getAll,
		getRoomType: Availability.getRoomType,
		set: Availability.set,
		getLegacyAll: Availability.getLegacyAll,
		getLegacyProperty: Availability.getLegacyProperty,
		getLegacyRoomType: Availability.getLegacyRoomType,
	},
	rates: {
		calendar: Rates.calendar,
		calendarSimple: Rates.calendarSimple,
		settings: Rates.settings,
		update: Rates.update,
	},
	quotes: {
		calculate: Quotes.calculate,
		calculateV1: Quotes.calculateV1,
	},
	messages: {
		list: Messages.list,
		send: Messages.send,
	},
} as const;

export const lodgifyEndpointSchemas = {
	'countries.list': {
		input: LodgifyEndpointInputSchemas['countries.list'],
		output: LodgifyEndpointOutputSchemas['countries.list'],
	},
	'countries.get': {
		input: LodgifyEndpointInputSchemas['countries.get'],
		output: LodgifyEndpointOutputSchemas['countries.get'],
	},
	'currencies.list': {
		input: LodgifyEndpointInputSchemas['currencies.list'],
		output: LodgifyEndpointOutputSchemas['currencies.list'],
	},
	'currencies.get': {
		input: LodgifyEndpointInputSchemas['currencies.get'],
		output: LodgifyEndpointOutputSchemas['currencies.get'],
	},
	'channels.inventory': {
		input: LodgifyEndpointInputSchemas['channels.inventory'],
		output: LodgifyEndpointOutputSchemas['channels.inventory'],
	},
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
	'properties.listV1': {
		input: LodgifyEndpointInputSchemas['properties.listV1'],
		output: LodgifyEndpointOutputSchemas['properties.listV1'],
	},
	'properties.getV1': {
		input: LodgifyEndpointInputSchemas['properties.getV1'],
		output: LodgifyEndpointOutputSchemas['properties.getV1'],
	},
	'properties.getRoomV1': {
		input: LodgifyEndpointInputSchemas['properties.getRoomV1'],
		output: LodgifyEndpointOutputSchemas['properties.getRoomV1'],
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
	'reservations.getBookingV1': {
		input: LodgifyEndpointInputSchemas['reservations.getBookingV1'],
		output: LodgifyEndpointOutputSchemas['reservations.getBookingV1'],
	},
	'reservations.updateBooking': {
		input: LodgifyEndpointInputSchemas['reservations.updateBooking'],
		output: LodgifyEndpointOutputSchemas['reservations.updateBooking'],
	},
	'reservations.deleteBooking': {
		input: LodgifyEndpointInputSchemas['reservations.deleteBooking'],
		output: LodgifyEndpointOutputSchemas['reservations.deleteBooking'],
	},
	'reservations.deleteEnquiry': {
		input: LodgifyEndpointInputSchemas['reservations.deleteEnquiry'],
		output: LodgifyEndpointOutputSchemas['reservations.deleteEnquiry'],
	},
	'reservations.createCallMeBack': {
		input: LodgifyEndpointInputSchemas['reservations.createCallMeBack'],
		output: LodgifyEndpointOutputSchemas['reservations.createCallMeBack'],
	},
	'reservations.createQuote': {
		input: LodgifyEndpointInputSchemas['reservations.createQuote'],
		output: LodgifyEndpointOutputSchemas['reservations.createQuote'],
	},
	'reservations.getQuote': {
		input: LodgifyEndpointInputSchemas['reservations.getQuote'],
		output: LodgifyEndpointOutputSchemas['reservations.getQuote'],
	},
	'reservations.getPaymentLinkV1': {
		input: LodgifyEndpointInputSchemas['reservations.getPaymentLinkV1'],
		output: LodgifyEndpointOutputSchemas['reservations.getPaymentLinkV1'],
	},
	'reservations.getPaymentLink': {
		input: LodgifyEndpointInputSchemas['reservations.getPaymentLink'],
		output: LodgifyEndpointOutputSchemas['reservations.getPaymentLink'],
	},
	'reservations.recoverBooking': {
		input: LodgifyEndpointInputSchemas['reservations.recoverBooking'],
		output: LodgifyEndpointOutputSchemas['reservations.recoverBooking'],
	},
	'reservations.recoverEnquiry': {
		input: LodgifyEndpointInputSchemas['reservations.recoverEnquiry'],
		output: LodgifyEndpointOutputSchemas['reservations.recoverEnquiry'],
	},
	'reservations.reopenBooking': {
		input: LodgifyEndpointInputSchemas['reservations.reopenBooking'],
		output: LodgifyEndpointOutputSchemas['reservations.reopenBooking'],
	},
	'reservations.declineBooking': {
		input: LodgifyEndpointInputSchemas['reservations.declineBooking'],
		output: LodgifyEndpointOutputSchemas['reservations.declineBooking'],
	},
	'reservations.tentativeBooking': {
		input: LodgifyEndpointInputSchemas['reservations.tentativeBooking'],
		output: LodgifyEndpointOutputSchemas['reservations.tentativeBooking'],
	},
	'reservations.bookBooking': {
		input: LodgifyEndpointInputSchemas['reservations.bookBooking'],
		output: LodgifyEndpointOutputSchemas['reservations.bookBooking'],
	},
	'reservations.declineEnquiry': {
		input: LodgifyEndpointInputSchemas['reservations.declineEnquiry'],
		output: LodgifyEndpointOutputSchemas['reservations.declineEnquiry'],
	},
	'reservations.reopenEnquiry': {
		input: LodgifyEndpointInputSchemas['reservations.reopenEnquiry'],
		output: LodgifyEndpointOutputSchemas['reservations.reopenEnquiry'],
	},
	'reservations.deleteMany': {
		input: LodgifyEndpointInputSchemas['reservations.deleteMany'],
		output: LodgifyEndpointOutputSchemas['reservations.deleteMany'],
	},
	'reservations.requestPayment': {
		input: LodgifyEndpointInputSchemas['reservations.requestPayment'],
		output: LodgifyEndpointOutputSchemas['reservations.requestPayment'],
	},
	'reservations.checkInV1': {
		input: LodgifyEndpointInputSchemas['reservations.checkInV1'],
		output: LodgifyEndpointOutputSchemas['reservations.checkInV1'],
	},
	'reservations.checkOutV1': {
		input: LodgifyEndpointInputSchemas['reservations.checkOutV1'],
		output: LodgifyEndpointOutputSchemas['reservations.checkOutV1'],
	},
	'reservations.markManyReplied': {
		input: LodgifyEndpointInputSchemas['reservations.markManyReplied'],
		output: LodgifyEndpointOutputSchemas['reservations.markManyReplied'],
	},
	'reservations.markManyNotReplied': {
		input: LodgifyEndpointInputSchemas['reservations.markManyNotReplied'],
		output: LodgifyEndpointOutputSchemas['reservations.markManyNotReplied'],
	},
	'reservations.markBookingReplied': {
		input: LodgifyEndpointInputSchemas['reservations.markBookingReplied'],
		output: LodgifyEndpointOutputSchemas['reservations.markBookingReplied'],
	},
	'reservations.markEnquiryReplied': {
		input: LodgifyEndpointInputSchemas['reservations.markEnquiryReplied'],
		output: LodgifyEndpointOutputSchemas['reservations.markEnquiryReplied'],
	},
	'reservations.markBookingNotReplied': {
		input: LodgifyEndpointInputSchemas['reservations.markBookingNotReplied'],
		output: LodgifyEndpointOutputSchemas['reservations.markBookingNotReplied'],
	},
	'reservations.markEnquiryNotReplied': {
		input: LodgifyEndpointInputSchemas['reservations.markEnquiryNotReplied'],
		output: LodgifyEndpointOutputSchemas['reservations.markEnquiryNotReplied'],
	},
	'reservations.checkIn': {
		input: LodgifyEndpointInputSchemas['reservations.checkIn'],
		output: LodgifyEndpointOutputSchemas['reservations.checkIn'],
	},
	'reservations.checkOut': {
		input: LodgifyEndpointInputSchemas['reservations.checkOut'],
		output: LodgifyEndpointOutputSchemas['reservations.checkOut'],
	},
	'reservations.getExternalBookings': {
		input: LodgifyEndpointInputSchemas['reservations.getExternalBookings'],
		output: LodgifyEndpointOutputSchemas['reservations.getExternalBookings'],
	},
	'reservations.updateKeyCodes': {
		input: LodgifyEndpointInputSchemas['reservations.updateKeyCodes'],
		output: LodgifyEndpointOutputSchemas['reservations.updateKeyCodes'],
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
	'availability.getLegacyAll': {
		input: LodgifyEndpointInputSchemas['availability.getLegacyAll'],
		output: LodgifyEndpointOutputSchemas['availability.getLegacyAll'],
	},
	'availability.getLegacyProperty': {
		input: LodgifyEndpointInputSchemas['availability.getLegacyProperty'],
		output: LodgifyEndpointOutputSchemas['availability.getLegacyProperty'],
	},
	'availability.getLegacyRoomType': {
		input: LodgifyEndpointInputSchemas['availability.getLegacyRoomType'],
		output: LodgifyEndpointOutputSchemas['availability.getLegacyRoomType'],
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
	'quotes.calculateV1': {
		input: LodgifyEndpointInputSchemas['quotes.calculateV1'],
		output: LodgifyEndpointOutputSchemas['quotes.calculateV1'],
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
	'countries.list': {
		riskLevel: 'read',
		description: 'List ISO country codes supported by Lodgify',
	},
	'countries.get': {
		riskLevel: 'read',
		description: 'Get a country by its country code',
	},
	'currencies.list': {
		riskLevel: 'read',
		description: 'List currencies supported by Lodgify',
	},
	'currencies.get': {
		riskLevel: 'read',
		description: 'Get a currency by its currency code',
	},
	'channels.inventory': {
		riskLevel: 'read',
		description: 'Get property and room IDs mapped to the configured channel',
	},
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
	'properties.listV1': {
		riskLevel: 'read',
		description: 'List completed properties using the v1 API',
	},
	'properties.getV1': {
		riskLevel: 'read',
		description: 'Get legacy v1 property details by ID',
	},
	'properties.getRoomV1': {
		riskLevel: 'read',
		description: 'Get legacy v1 room details within a property',
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
	'reservations.getBookingV1': {
		riskLevel: 'read',
		description: 'Get full legacy v1 booking details by ID',
	},
	'reservations.updateBooking': {
		riskLevel: 'destructive',
		description: 'Update documented details for a booking',
	},
	'reservations.deleteBooking': {
		riskLevel: 'destructive',
		description: 'Move a booking to the trash',
	},
	'reservations.deleteEnquiry': {
		riskLevel: 'destructive',
		description: 'Move an enquiry to the trash',
	},
	'reservations.createCallMeBack': {
		riskLevel: 'destructive',
		description: 'Create a call-back enquiry and notify the property owner',
	},
	'reservations.createQuote': {
		riskLevel: 'destructive',
		description: 'Create a quote for a booking',
	},
	'reservations.getQuote': {
		riskLevel: 'read',
		description: 'Get the current quote associated with a booking',
	},
	'reservations.getPaymentLinkV1': {
		riskLevel: 'read',
		description: 'Get the current quote payment link using the v1 API',
	},
	'reservations.getPaymentLink': {
		riskLevel: 'read',
		description: 'Get the next booking payment link using the v2 API',
	},
	'reservations.recoverBooking': {
		riskLevel: 'write',
		description: 'Restore a booking from the trash',
	},
	'reservations.recoverEnquiry': {
		riskLevel: 'write',
		description: 'Restore an enquiry from the trash',
	},
	'reservations.reopenBooking': {
		riskLevel: 'destructive',
		description: 'Reopen a booking and release its booked availability',
	},
	'reservations.declineBooking': {
		riskLevel: 'destructive',
		description: 'Decline a booking',
	},
	'reservations.tentativeBooking': {
		riskLevel: 'destructive',
		description: 'Set a booking to tentative and optionally request payment',
	},
	'reservations.bookBooking': {
		riskLevel: 'destructive',
		description: 'Confirm a booking and update its availability',
	},
	'reservations.declineEnquiry': {
		riskLevel: 'destructive',
		description: 'Decline an enquiry',
	},
	'reservations.reopenEnquiry': {
		riskLevel: 'write',
		description: 'Reopen an enquiry',
	},
	'reservations.deleteMany': {
		riskLevel: 'destructive',
		description: 'Move a batch of bookings and enquiries to the trash',
	},
	'reservations.requestPayment': {
		riskLevel: 'destructive',
		description: 'Send a guest a payment request for a booking',
	},
	'reservations.checkInV1': {
		riskLevel: 'write',
		description: 'Set the check-in time using the legacy v1 API',
	},
	'reservations.checkOutV1': {
		riskLevel: 'write',
		description: 'Set the check-out time using the legacy v1 API',
	},
	'reservations.markManyReplied': {
		riskLevel: 'write',
		description: 'Mark a batch of bookings and enquiries as replied',
	},
	'reservations.markManyNotReplied': {
		riskLevel: 'write',
		description: 'Mark a batch of bookings and enquiries as not replied',
	},
	'reservations.markBookingReplied': {
		riskLevel: 'write',
		description: 'Mark a booking as replied',
	},
	'reservations.markEnquiryReplied': {
		riskLevel: 'write',
		description: 'Mark an enquiry as replied',
	},
	'reservations.markBookingNotReplied': {
		riskLevel: 'write',
		description: 'Mark a booking as not replied',
	},
	'reservations.markEnquiryNotReplied': {
		riskLevel: 'write',
		description: 'Mark an enquiry as not replied',
	},
	'reservations.checkIn': {
		riskLevel: 'write',
		description: 'Set the check-in time using the v2 API',
	},
	'reservations.checkOut': {
		riskLevel: 'write',
		description: 'Set the check-out time using the v2 API',
	},
	'reservations.getExternalBookings': {
		riskLevel: 'read',
		description: 'List external bookings associated with a booking',
	},
	'reservations.updateKeyCodes': {
		riskLevel: 'destructive',
		description: 'Change the access codes for rooms in a booking',
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
	'availability.getLegacyAll': {
		riskLevel: 'read',
		description:
			'Read legacy v1 availability for all properties and room types',
	},
	'availability.getLegacyProperty': {
		riskLevel: 'read',
		description:
			'Read legacy v1 availability for every room type in a property',
	},
	'availability.getLegacyRoomType': {
		riskLevel: 'read',
		description: 'Read legacy v1 availability for one property room type',
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
	'quotes.calculateV1': {
		riskLevel: 'read',
		description: 'Calculate stay quotes using the legacy v1 API',
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
	LodgifyAvailabilityGetLegacyAllInputSchema,
	LodgifyAvailabilityGetLegacyPropertyInputSchema,
	LodgifyAvailabilityGetLegacyRoomTypeInputSchema,
	LodgifyAvailabilityGetOutputSchema,
	LodgifyAvailabilityGetRoomTypeInputSchema,
	LodgifyAvailabilityGetRoomTypeOutputSchema,
	LodgifyAvailabilityLegacyOutputSchema,
	LodgifyAvailabilityPeriodSchema,
	LodgifyAvailabilitySetInputSchema,
	LodgifyAvailabilitySetOutputSchema,
	LodgifyChannelInventoryInputSchema,
	LodgifyChannelInventoryOutputSchema,
	LodgifyCountriesListInputSchema,
	LodgifyCountriesListOutputSchema,
	LodgifyCountryGetInputSchema,
	LodgifyCountryGetOutputSchema,
	LodgifyCountrySchema,
	LodgifyCreateGuestSchema,
	LodgifyCurrenciesListInputSchema,
	LodgifyCurrenciesListOutputSchema,
	LodgifyCurrencyGetInputSchema,
	LodgifyCurrencyGetOutputSchema,
	LodgifyCurrencySchema,
	LodgifyEndpointInputs,
	LodgifyEndpointOutputs,
	LodgifyGuestNameSchema,
	LodgifyGuestSchema,
	LodgifyGuestViewSchema,
	LodgifyInboxItemSchema,
	LodgifyLegacyBookingQuoteSchema,
	LodgifyLegacyQuoteInputSchema,
	LodgifyLegacyQuoteOutputSchema,
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
	LodgifyPropertiesGetRoomV1InputSchema,
	LodgifyPropertiesGetRoomV1OutputSchema,
	LodgifyPropertiesGetV1InputSchema,
	LodgifyPropertiesGetV1OutputSchema,
	LodgifyPropertiesListInputSchema,
	LodgifyPropertiesListOutputSchema,
	LodgifyPropertiesListV1InputSchema,
	LodgifyPropertiesListV1OutputSchema,
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
	LodgifyReservationBookingV1Schema,
	LodgifyReservationEnquiryV1Schema,
	LodgifyReservationSchema,
	LodgifyReservationsBatchInputSchema,
	LodgifyReservationsBatchOutputSchema,
	LodgifyReservationsCheckInOutInputSchema,
	LodgifyReservationsCheckInOutOutputSchema,
	LodgifyReservationsCreateCallMeBackInputSchema,
	LodgifyReservationsCreateCallMeBackOutputSchema,
	LodgifyReservationsCreateEnquiryInputSchema,
	LodgifyReservationsCreateEnquiryOutputSchema,
	LodgifyReservationsCreateInputSchema,
	LodgifyReservationsCreateOutputSchema,
	LodgifyReservationsCreateQuoteInputSchema,
	LodgifyReservationsCreateQuoteOutputSchema,
	LodgifyReservationsGetBookingV1InputSchema,
	LodgifyReservationsGetBookingV1OutputSchema,
	LodgifyReservationsGetEnquiryInputSchema,
	LodgifyReservationsGetEnquiryOutputSchema,
	LodgifyReservationsGetExternalBookingsInputSchema,
	LodgifyReservationsGetExternalBookingsOutputSchema,
	LodgifyReservationsGetInputSchema,
	LodgifyReservationsGetOutputSchema,
	LodgifyReservationsGetPaymentLinkInputSchema,
	LodgifyReservationsGetPaymentLinkOutputSchema,
	LodgifyReservationsGetQuoteInputSchema,
	LodgifyReservationsGetQuoteOutputSchema,
	LodgifyReservationsInboxListInputSchema,
	LodgifyReservationsInboxListOutputSchema,
	LodgifyReservationsListInputSchema,
	LodgifyReservationsListOutputSchema,
	LodgifyReservationsSetBookingStatusInputSchema,
	LodgifyReservationsSetBookingStatusOutputSchema,
	LodgifyReservationsUnreadCountInputSchema,
	LodgifyReservationsUnreadCountOutputSchema,
	LodgifyReservationsUpdateBookingInputSchema,
	LodgifyReservationsUpdateBookingOutputSchema,
	LodgifyReservationsUpdateKeyCodesInputSchema,
	LodgifyReservationsUpdateKeyCodesOutputSchema,
} from './endpoints/types';
