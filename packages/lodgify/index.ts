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
	'reservations.list': LodgifyEndpoint<'reservations.list'>;
	'reservations.get': LodgifyEndpoint<'reservations.get'>;
	'reservations.create': LodgifyEndpoint<'reservations.create'>;
	'availability.get': LodgifyEndpoint<'availability.get'>;
	'quotes.calculate': LodgifyEndpoint<'quotes.calculate'>;
	'messages.list': LodgifyEndpoint<'messages.list'>;
	'messages.send': LodgifyEndpoint<'messages.send'>;
};

export const lodgifyEndpointsNested = {
	properties: {
		list: Properties.list,
		get: Properties.get,
		getRooms: Properties.getRooms,
	},
	reservations: {
		list: Reservations.list,
		get: Reservations.get,
		create: Reservations.create,
	},
	availability: {
		get: Availability.get,
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
	'reservations.list': {
		input: LodgifyEndpointInputSchemas['reservations.list'],
		output: LodgifyEndpointOutputSchemas['reservations.list'],
	},
	'reservations.get': {
		input: LodgifyEndpointInputSchemas['reservations.get'],
		output: LodgifyEndpointOutputSchemas['reservations.get'],
	},
	'reservations.create': {
		input: LodgifyEndpointInputSchemas['reservations.create'],
		output: LodgifyEndpointOutputSchemas['reservations.create'],
	},
	'availability.get': {
		input: LodgifyEndpointInputSchemas['availability.get'],
		output: LodgifyEndpointOutputSchemas['availability.get'],
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
	'reservations.list': {
		riskLevel: 'read',
		description: 'List reservations and bookings',
	},
	'reservations.get': {
		riskLevel: 'read',
		description: 'Get reservation or booking details by ID',
	},
	'reservations.create': {
		riskLevel: 'write',
		description: 'Create a new reservation or booking',
	},
	'availability.get': {
		riskLevel: 'read',
		description: 'Get availability calendar periods for a property',
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
		riskLevel: 'write',
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
	LodgifyAvailabilityGetInputSchema,
	LodgifyAvailabilityGetOutputSchema,
	LodgifyAvailabilityPeriodSchema,
	LodgifyEndpointInputs,
	LodgifyEndpointOutputs,
	LodgifyFeeSchema,
	LodgifyGuestSchema,
	LodgifyMessageSchema,
	LodgifyMessagesListInputSchema,
	LodgifyMessagesListOutputSchema,
	LodgifyMessagesSendInputSchema,
	LodgifyMessagesSendOutputSchema,
	LodgifyPropertiesGetInputSchema,
	LodgifyPropertiesGetOutputSchema,
	LodgifyPropertiesGetRoomsInputSchema,
	LodgifyPropertiesGetRoomsOutputSchema,
	LodgifyPropertiesListInputSchema,
	LodgifyPropertiesListOutputSchema,
	LodgifyPropertyRoomSchema,
	LodgifyPropertySchema,
	LodgifyQuotesCalculateInputSchema,
	LodgifyQuotesCalculateOutputSchema,
	LodgifyReservationSchema,
	LodgifyReservationsCreateInputSchema,
	LodgifyReservationsCreateOutputSchema,
	LodgifyReservationsGetInputSchema,
	LodgifyReservationsGetOutputSchema,
	LodgifyReservationsListInputSchema,
	LodgifyReservationsListOutputSchema,
} from './endpoints/types';
