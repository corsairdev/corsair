import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Health, Locations, Records } from './endpoints';
import type {
	HotspotSystemEndpointInputs,
	HotspotSystemEndpointOutputs,
} from './endpoints/types';
import {
	HotspotSystemEndpointInputSchemas,
	HotspotSystemEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { HotspotSystemSchema } from './schema';

export type HotspotSystemPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHotspotSystemPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hotspotsystemEndpointsNested>;
};

export type HotspotSystemContext = CorsairPluginContext<
	typeof HotspotSystemSchema,
	HotspotSystemPluginOptions
>;

export type HotspotSystemKeyBuilderContext =
	KeyBuilderContext<HotspotSystemPluginOptions>;

export type HotspotSystemBoundEndpoints = BindEndpoints<
	typeof hotspotsystemEndpointsNested
>;

type HotspotSystemEndpoint<K extends keyof HotspotSystemEndpointOutputs> =
	CorsairEndpoint<
		HotspotSystemContext,
		HotspotSystemEndpointInputs[K],
		HotspotSystemEndpointOutputs[K]
	>;

export type HotspotSystemEndpoints = {
	pingCheck: HotspotSystemEndpoint<'ping.check'>;
	meGet: HotspotSystemEndpoint<'me.get'>;
	locationsList: HotspotSystemEndpoint<'locations.list'>;
	locationsOptions: HotspotSystemEndpoint<'locations.options'>;
	locationsCustomers: HotspotSystemEndpoint<'locations.customers'>;
	locationsSubscribers: HotspotSystemEndpoint<'locations.subscribers'>;
	locationsVouchers: HotspotSystemEndpoint<'locations.vouchers'>;
	locationsPaidTransactions: HotspotSystemEndpoint<'locations.paidTransactions'>;
	locationsVoucherTransactions: HotspotSystemEndpoint<'locations.voucherTransactions'>;
	locationsSocialTransactions: HotspotSystemEndpoint<'locations.socialTransactions'>;
	locationsMacTransactions: HotspotSystemEndpoint<'locations.macTransactions'>;
	customersList: HotspotSystemEndpoint<'customers.list'>;
	subscribersList: HotspotSystemEndpoint<'subscribers.list'>;
	vouchersList: HotspotSystemEndpoint<'vouchers.list'>;
	transactionsPaid: HotspotSystemEndpoint<'transactions.paid'>;
	transactionsVoucher: HotspotSystemEndpoint<'transactions.voucher'>;
	transactionsSocial: HotspotSystemEndpoint<'transactions.social'>;
	transactionsMac: HotspotSystemEndpoint<'transactions.mac'>;
};

const hotspotsystemEndpointsNested = {
	ping: {
		check: Health.pingCheck,
	},
	me: {
		get: Health.meGet,
	},
	locations: {
		list: Locations.locationsList,
		options: Locations.locationsOptions,
		customers: Locations.locationsCustomers,
		subscribers: Locations.locationsSubscribers,
		vouchers: Locations.locationsVouchers,
		paidTransactions: Locations.locationsPaidTransactions,
		voucherTransactions: Locations.locationsVoucherTransactions,
		socialTransactions: Locations.locationsSocialTransactions,
		macTransactions: Locations.locationsMacTransactions,
	},
	customers: {
		list: Records.customersList,
	},
	subscribers: {
		list: Records.subscribersList,
	},
	vouchers: {
		list: Records.vouchersList,
	},
	transactions: {
		paid: Records.transactionsPaid,
		voucher: Records.transactionsVoucher,
		social: Records.transactionsSocial,
		mac: Records.transactionsMac,
	},
} as const;

export const hotspotsystemEndpointSchemas = {
	'ping.check': {
		input: HotspotSystemEndpointInputSchemas['ping.check'],
		output: HotspotSystemEndpointOutputSchemas['ping.check'],
	},
	'me.get': {
		input: HotspotSystemEndpointInputSchemas['me.get'],
		output: HotspotSystemEndpointOutputSchemas['me.get'],
	},
	'locations.list': {
		input: HotspotSystemEndpointInputSchemas['locations.list'],
		output: HotspotSystemEndpointOutputSchemas['locations.list'],
	},
	'locations.options': {
		input: HotspotSystemEndpointInputSchemas['locations.options'],
		output: HotspotSystemEndpointOutputSchemas['locations.options'],
	},
	'locations.customers': {
		input: HotspotSystemEndpointInputSchemas['locations.customers'],
		output: HotspotSystemEndpointOutputSchemas['locations.customers'],
	},
	'locations.subscribers': {
		input: HotspotSystemEndpointInputSchemas['locations.subscribers'],
		output: HotspotSystemEndpointOutputSchemas['locations.subscribers'],
	},
	'locations.vouchers': {
		input: HotspotSystemEndpointInputSchemas['locations.vouchers'],
		output: HotspotSystemEndpointOutputSchemas['locations.vouchers'],
	},
	'locations.paidTransactions': {
		input: HotspotSystemEndpointInputSchemas['locations.paidTransactions'],
		output: HotspotSystemEndpointOutputSchemas['locations.paidTransactions'],
	},
	'locations.voucherTransactions': {
		input: HotspotSystemEndpointInputSchemas['locations.voucherTransactions'],
		output: HotspotSystemEndpointOutputSchemas['locations.voucherTransactions'],
	},
	'locations.socialTransactions': {
		input: HotspotSystemEndpointInputSchemas['locations.socialTransactions'],
		output: HotspotSystemEndpointOutputSchemas['locations.socialTransactions'],
	},
	'locations.macTransactions': {
		input: HotspotSystemEndpointInputSchemas['locations.macTransactions'],
		output: HotspotSystemEndpointOutputSchemas['locations.macTransactions'],
	},
	'customers.list': {
		input: HotspotSystemEndpointInputSchemas['customers.list'],
		output: HotspotSystemEndpointOutputSchemas['customers.list'],
	},
	'subscribers.list': {
		input: HotspotSystemEndpointInputSchemas['subscribers.list'],
		output: HotspotSystemEndpointOutputSchemas['subscribers.list'],
	},
	'vouchers.list': {
		input: HotspotSystemEndpointInputSchemas['vouchers.list'],
		output: HotspotSystemEndpointOutputSchemas['vouchers.list'],
	},
	'transactions.paid': {
		input: HotspotSystemEndpointInputSchemas['transactions.paid'],
		output: HotspotSystemEndpointOutputSchemas['transactions.paid'],
	},
	'transactions.voucher': {
		input: HotspotSystemEndpointInputSchemas['transactions.voucher'],
		output: HotspotSystemEndpointOutputSchemas['transactions.voucher'],
	},
	'transactions.social': {
		input: HotspotSystemEndpointInputSchemas['transactions.social'],
		output: HotspotSystemEndpointOutputSchemas['transactions.social'],
	},
	'transactions.mac': {
		input: HotspotSystemEndpointInputSchemas['transactions.mac'],
		output: HotspotSystemEndpointOutputSchemas['transactions.mac'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof hotspotsystemEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * Every operation is a read: the documented API has no write, so no operation
 * here can change state on the provider's side.
 */
export const hotspotsystemEndpointMeta = {
	'ping.check': {
		riskLevel: 'read',
		description:
			'Confirm the API answers: returns `pong`. Needs a key, because Corsair resolves one before every call',
	},
	'me.get': {
		riskLevel: 'read',
		description:
			'Read the resource owner behind the key: a user ID and an operator name',
	},
	'locations.list': {
		riskLevel: 'read',
		description:
			'List the account locations, with field selection, sorting and paging',
	},
	'locations.options': {
		riskLevel: 'read',
		description:
			'List the account locations as `id` and `name` pairs for a picker; no paging',
	},
	'locations.customers': {
		riskLevel: 'read',
		description:
			'List the customers seen at one location, with their contact details and social profiles',
	},
	'locations.subscribers': {
		riskLevel: 'read',
		description:
			'List the subscribers seen at one location, with their contact details and social profiles',
	},
	'locations.vouchers': {
		riskLevel: 'read',
		description:
			'List the vouchers issued at one location, with their validity and traffic limits',
	},
	'locations.paidTransactions': {
		riskLevel: 'read',
		description:
			'List the paid transactions at one location, with amounts and currencies',
	},
	'locations.voucherTransactions': {
		riskLevel: 'read',
		description:
			'List the voucher transactions at one location, with the voucher used and the amount',
	},
	'locations.socialTransactions': {
		riskLevel: 'read',
		description: 'List social-login transactions at one location',
	},
	'locations.macTransactions': {
		riskLevel: 'read',
		description:
			'List the device MAC transactions at one location, with the device answers collected',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'List the account customers, with field selection, sorting and paging',
	},
	'subscribers.list': {
		riskLevel: 'read',
		description:
			'List the account subscribers, with field selection, sorting and paging',
	},
	'vouchers.list': {
		riskLevel: 'read',
		description:
			'List the account vouchers with their traffic limits, validity and price',
	},
	'transactions.paid': {
		riskLevel: 'read',
		description:
			'List paid transactions across the account, with amounts and currencies',
	},
	'transactions.voucher': {
		riskLevel: 'read',
		description:
			'List voucher transactions across the account, with the voucher used and the amount',
	},
	'transactions.social': {
		riskLevel: 'read',
		description:
			'List social-login transactions across the account, with the network used',
	},
	'transactions.mac': {
		riskLevel: 'read',
		description:
			'List device MAC transactions across the account, with the device answers collected',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof hotspotsystemEndpointsNested
>;

export type BaseHotspotSystemPlugin<T extends HotspotSystemPluginOptions> =
	CorsairPlugin<
		'hotspotsystem',
		typeof HotspotSystemSchema,
		typeof hotspotsystemEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalHotspotSystemPlugin =
	BaseHotspotSystemPlugin<HotspotSystemPluginOptions>;

export type ExternalHotspotSystemPlugin<T extends HotspotSystemPluginOptions> =
	BaseHotspotSystemPlugin<T>;

export function hotspotsystem<const T extends HotspotSystemPluginOptions>(
	incomingOptions: HotspotSystemPluginOptions &
		T = {} as HotspotSystemPluginOptions & T,
): ExternalHotspotSystemPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hotspotsystem',
		schema: HotspotSystemSchema,
		options,
		hooks: options.hooks,
		endpoints: hotspotsystemEndpointsNested,
		webhooks: {},
		endpointMeta: hotspotsystemEndpointMeta,
		endpointSchemas: hotspotsystemEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: HotspotSystemKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('hotspotsystem', ctx.authType ?? 'api_key');
		},
	} satisfies InternalHotspotSystemPlugin;
}

export {
	HOTSPOTSYSTEM_API_BASE,
	HOTSPOTSYSTEM_API_KEY_HEADER,
	hotspotSystemApiError,
	nextOffsetFromLinkHeader,
} from './client';

export type {
	CustomersListInput,
	HotspotSystemEndpointInputs,
	HotspotSystemEndpointOutputs,
	HotspotSystemLocation,
	HotspotSystemMacTransaction,
	HotspotSystemMeInput,
	HotspotSystemMeResponse,
	HotspotSystemPaidTransaction,
	HotspotSystemPerson,
	HotspotSystemPingInput,
	HotspotSystemPingResponse,
	HotspotSystemSocialTransaction,
	HotspotSystemVoucher,
	HotspotSystemVoucherTransaction,
	LocationCustomersListInput,
	LocationSubscribersListInput,
	LocationsListInput,
	LocationsListResponse,
	LocationsOptionsInput,
	LocationsOptionsResponse,
	LocationTransactionsListInput,
	LocationVouchersListInput,
	MacTransactionsListResponse,
	PaidTransactionsListResponse,
	PeopleListResponse,
	SocialTransactionsListResponse,
	SubscribersListInput,
	TransactionsListInput,
	VouchersListInput,
	VouchersListResponse,
	VoucherTransactionsListResponse,
} from './endpoints/types';
