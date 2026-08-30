import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	EndpointTree,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { resourceEndpoints } from './endpoints';
import {
	AvailabilityQueryInputSchema,
	AvailabilityQueryResponseSchema,
	BookingmoodEndpointInputSchemas,
	BookingmoodEndpointOutputSchemas,
	ListInputSchema,
	ListResponseSchema,
	MembersInviteInputSchema,
	ProductsCreateInputSchema,
	RowSchema,
	SearchAvailabilityInputSchema,
	SearchAvailabilityResponseSchema,
	WriteInputSchema,
	WriteResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BookingmoodSchema } from './schema';

export type BookingmoodPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBookingmoodPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bookingmoodEndpointsNested>;
};

export type BookingmoodContext = CorsairPluginContext<
	typeof BookingmoodSchema,
	BookingmoodPluginOptions
>;

const bookingmoodEndpointsNested = resourceEndpoints as unknown as EndpointTree;

function inputSchemaFor(group: string, op: string) {
	if (group === 'products' && op === 'create') return ProductsCreateInputSchema;
	if (group === 'members' && op === 'invite') return MembersInviteInputSchema;
	if (group === 'availability' && op === 'query')
		return AvailabilityQueryInputSchema;
	if (group === 'search' && op === 'availability')
		return SearchAvailabilityInputSchema;
	if (op === 'list' || op === 'query') return ListInputSchema;
	return WriteInputSchema;
}

function outputSchemaFor(group: string, op: string) {
	if (group === 'availability' && op === 'query')
		return AvailabilityQueryResponseSchema;
	if (group === 'search' && op === 'availability')
		return SearchAvailabilityResponseSchema;
	if (group === 'members' && op === 'invite') return RowSchema;
	if (op === 'list') return ListResponseSchema;
	return WriteResponseSchema;
}

function riskFor(op: string): 'read' | 'write' | 'destructive' {
	if (op === 'list' || op === 'query' || op === 'availability') return 'read';
	if (op === 'delete') return 'destructive';
	return 'write';
}

const bookingmoodEndpointSchemas = Object.fromEntries(
	Object.entries(bookingmoodEndpointsNested).flatMap(([group, ops]) =>
		Object.keys(ops as object).map((op) => [
			`${group}.${op}`,
			{
				input: inputSchemaFor(group, op),
				output: outputSchemaFor(group, op),
			},
		]),
	),
) as RequiredPluginEndpointSchemas<typeof bookingmoodEndpointsNested>;

const bookingmoodEndpointMeta = Object.fromEntries(
	Object.entries(bookingmoodEndpointsNested).flatMap(([group, ops]) =>
		Object.keys(ops as object).map((op) => [
			`${group}.${op}`,
			{
				riskLevel: riskFor(op),
				description: `Bookingmood ${group} ${op}`,
			},
		]),
	),
) as RequiredPluginEndpointMeta<
	typeof bookingmoodEndpointsNested
> satisfies RequiredPluginEndpointMeta<typeof bookingmoodEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const bookingmoodAuthConfig = {
	api_key: {
		account: ['organization_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBookingmoodPlugin<T extends BookingmoodPluginOptions> =
	CorsairPlugin<
		'bookingmood',
		typeof BookingmoodSchema,
		typeof bookingmoodEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalBookingmoodPlugin =
	BaseBookingmoodPlugin<BookingmoodPluginOptions>;

export type ExternalBookingmoodPlugin<T extends BookingmoodPluginOptions> =
	BaseBookingmoodPlugin<T>;

export type BookingmoodBoundEndpoints = BindEndpoints<
	typeof bookingmoodEndpointsNested
>;

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
		options,
		hooks: options.hooks,
		endpoints: bookingmoodEndpointsNested,
		webhooks: {},
		endpointMeta: bookingmoodEndpointMeta,
		endpointSchemas: bookingmoodEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint') {
				return (await ctx.keys.get_api_key()) ?? '';
			}
			return '';
		},
	} satisfies InternalBookingmoodPlugin;
}

export { bookingmoodEndpointSchemas, bookingmoodEndpointMeta };
export { BookingmoodEndpointInputSchemas, BookingmoodEndpointOutputSchemas };

export type {
	AvailabilityQueryInput,
	ListInput,
	MembersInviteInput,
	ProductsCreateInput,
	SearchAvailabilityInput,
	WriteInput,
} from './endpoints/types';
