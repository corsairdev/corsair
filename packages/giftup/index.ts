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
	Company,
	GiftCards,
	Groups,
	Integrations,
	Items,
	Locations,
	Orders,
	Partners,
	Ping,
	Promotions,
	Reports,
	Settings,
	Users,
} from './endpoints';
import type {
	GiftUpEndpointInputs,
	GiftUpEndpointOutputs,
} from './endpoints/types';
import {
	GiftUpEndpointInputSchemas,
	GiftUpEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GiftUpSchema } from './schema';

export type GiftUpPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	testMode?: boolean;
	hooks?: InternalGiftUpPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof giftupEndpointsNested>;
};

export type GiftUpContext = CorsairPluginContext<
	typeof GiftUpSchema,
	GiftUpPluginOptions
>;

export type GiftUpKeyBuilderContext = KeyBuilderContext<GiftUpPluginOptions>;

export type GiftUpBoundEndpoints = BindEndpoints<typeof giftupEndpointsNested>;

type GiftUpEndpoint<K extends keyof GiftUpEndpointOutputs> = CorsairEndpoint<
	GiftUpContext,
	GiftUpEndpointInputs[K],
	GiftUpEndpointOutputs[K]
>;

export type GiftUpEndpoints = {
	ping: {
		get: GiftUpEndpoint<'ping.get'>;
		post: GiftUpEndpoint<'ping.post'>;
	};
	company: {
		get: GiftUpEndpoint<'company.get'>;
	};
	giftCards: {
		list: GiftUpEndpoint<'giftCards.list'>;
		get: GiftUpEndpoint<'giftCards.get'>;
		update: GiftUpEndpoint<'giftCards.update'>;
		reactivate: GiftUpEndpoint<'giftCards.reactivate'>;
		void: GiftUpEndpoint<'giftCards.void'>;
		topUp: GiftUpEndpoint<'giftCards.topUp'>;
		redeem: GiftUpEndpoint<'giftCards.redeem'>;
		redeemInFull: GiftUpEndpoint<'giftCards.redeemInFull'>;
		undoRedemption: GiftUpEndpoint<'giftCards.undoRedemption'>;
		transferBalances: GiftUpEndpoint<'giftCards.transferBalances'>;
	};
	orders: {
		list: GiftUpEndpoint<'orders.list'>;
		get: GiftUpEndpoint<'orders.get'>;
		create: GiftUpEndpoint<'orders.create'>;
		update: GiftUpEndpoint<'orders.update'>;
		addNote: GiftUpEndpoint<'orders.addNote'>;
		markAsPosted: GiftUpEndpoint<'orders.markAsPosted'>;
	};
	items: {
		list: GiftUpEndpoint<'items.list'>;
		get: GiftUpEndpoint<'items.get'>;
		create: GiftUpEndpoint<'items.create'>;
		update: GiftUpEndpoint<'items.update'>;
		delete: GiftUpEndpoint<'items.delete'>;
	};
	groups: {
		list: GiftUpEndpoint<'groups.list'>;
		get: GiftUpEndpoint<'groups.get'>;
		create: GiftUpEndpoint<'groups.create'>;
		update: GiftUpEndpoint<'groups.update'>;
		delete: GiftUpEndpoint<'groups.delete'>;
	};
	locations: {
		list: GiftUpEndpoint<'locations.list'>;
	};
	promotions: {
		list: GiftUpEndpoint<'promotions.list'>;
	};
	reports: {
		listTransactions: GiftUpEndpoint<'reports.listTransactions'>;
		getTransaction: GiftUpEndpoint<'reports.getTransaction'>;
	};
	settings: {
		getCheckout: GiftUpEndpoint<'settings.getCheckout'>;
		updateCheckout: GiftUpEndpoint<'settings.updateCheckout'>;
		getEmail: GiftUpEndpoint<'settings.getEmail'>;
		updateEmail: GiftUpEndpoint<'settings.updateEmail'>;
		getGiftCard: GiftUpEndpoint<'settings.getGiftCard'>;
		updateGiftCard: GiftUpEndpoint<'settings.updateGiftCard'>;
		listArtwork: GiftUpEndpoint<'settings.listArtwork'>;
		uploadArtwork: GiftUpEndpoint<'settings.uploadArtwork'>;
		deleteArtwork: GiftUpEndpoint<'settings.deleteArtwork'>;
		getShipping: GiftUpEndpoint<'settings.getShipping'>;
	};
	users: {
		list: GiftUpEndpoint<'users.list'>;
		get: GiftUpEndpoint<'users.get'>;
		invite: GiftUpEndpoint<'users.invite'>;
		update: GiftUpEndpoint<'users.update'>;
		delete: GiftUpEndpoint<'users.delete'>;
	};
	integrations: {
		getStripeConnection: GiftUpEndpoint<'integrations.getStripeConnection'>;
		updateStripeConnection: GiftUpEndpoint<'integrations.updateStripeConnection'>;
	};
	partners: {
		createAccount: GiftUpEndpoint<'partners.createAccount'>;
	};
};

const giftupEndpointsNested = {
	ping: {
		get: Ping.get,
		post: Ping.post,
	},
	company: {
		get: Company.get,
	},
	giftCards: {
		list: GiftCards.list,
		get: GiftCards.get,
		update: GiftCards.update,
		reactivate: GiftCards.reactivate,
		void: GiftCards.void,
		topUp: GiftCards.topUp,
		redeem: GiftCards.redeem,
		redeemInFull: GiftCards.redeemInFull,
		undoRedemption: GiftCards.undoRedemption,
		transferBalances: GiftCards.transferBalances,
	},
	orders: {
		list: Orders.list,
		get: Orders.get,
		create: Orders.create,
		update: Orders.update,
		addNote: Orders.addNote,
		markAsPosted: Orders.markAsPosted,
	},
	items: {
		list: Items.list,
		get: Items.get,
		create: Items.create,
		update: Items.update,
		delete: Items.delete,
	},
	groups: {
		list: Groups.list,
		get: Groups.get,
		create: Groups.create,
		update: Groups.update,
		delete: Groups.delete,
	},
	locations: {
		list: Locations.list,
	},
	promotions: {
		list: Promotions.list,
	},
	reports: {
		listTransactions: Reports.listTransactions,
		getTransaction: Reports.getTransaction,
	},
	settings: {
		getCheckout: Settings.getCheckout,
		updateCheckout: Settings.updateCheckout,
		getEmail: Settings.getEmail,
		updateEmail: Settings.updateEmail,
		getGiftCard: Settings.getGiftCard,
		updateGiftCard: Settings.updateGiftCard,
		listArtwork: Settings.listArtwork,
		uploadArtwork: Settings.uploadArtwork,
		deleteArtwork: Settings.deleteArtwork,
		getShipping: Settings.getShipping,
	},
	users: {
		list: Users.list,
		get: Users.get,
		invite: Users.invite,
		update: Users.update,
		delete: Users.delete,
	},
	integrations: {
		getStripeConnection: Integrations.getStripeConnection,
		updateStripeConnection: Integrations.updateStripeConnection,
	},
	partners: {
		createAccount: Partners.createAccount,
	},
} as const;

export const giftupEndpointSchemas = {
	'ping.get': {
		input: GiftUpEndpointInputSchemas['ping.get'],
		output: GiftUpEndpointOutputSchemas['ping.get'],
	},
	'ping.post': {
		input: GiftUpEndpointInputSchemas['ping.post'],
		output: GiftUpEndpointOutputSchemas['ping.post'],
	},
	'company.get': {
		input: GiftUpEndpointInputSchemas['company.get'],
		output: GiftUpEndpointOutputSchemas['company.get'],
	},
	'giftCards.list': {
		input: GiftUpEndpointInputSchemas['giftCards.list'],
		output: GiftUpEndpointOutputSchemas['giftCards.list'],
	},
	'giftCards.get': {
		input: GiftUpEndpointInputSchemas['giftCards.get'],
		output: GiftUpEndpointOutputSchemas['giftCards.get'],
	},
	'giftCards.update': {
		input: GiftUpEndpointInputSchemas['giftCards.update'],
		output: GiftUpEndpointOutputSchemas['giftCards.update'],
	},
	'giftCards.reactivate': {
		input: GiftUpEndpointInputSchemas['giftCards.reactivate'],
		output: GiftUpEndpointOutputSchemas['giftCards.reactivate'],
	},
	'giftCards.void': {
		input: GiftUpEndpointInputSchemas['giftCards.void'],
		output: GiftUpEndpointOutputSchemas['giftCards.void'],
	},
	'giftCards.topUp': {
		input: GiftUpEndpointInputSchemas['giftCards.topUp'],
		output: GiftUpEndpointOutputSchemas['giftCards.topUp'],
	},
	'giftCards.redeem': {
		input: GiftUpEndpointInputSchemas['giftCards.redeem'],
		output: GiftUpEndpointOutputSchemas['giftCards.redeem'],
	},
	'giftCards.redeemInFull': {
		input: GiftUpEndpointInputSchemas['giftCards.redeemInFull'],
		output: GiftUpEndpointOutputSchemas['giftCards.redeemInFull'],
	},
	'giftCards.undoRedemption': {
		input: GiftUpEndpointInputSchemas['giftCards.undoRedemption'],
		output: GiftUpEndpointOutputSchemas['giftCards.undoRedemption'],
	},
	'giftCards.transferBalances': {
		input: GiftUpEndpointInputSchemas['giftCards.transferBalances'],
		output: GiftUpEndpointOutputSchemas['giftCards.transferBalances'],
	},
	'orders.list': {
		input: GiftUpEndpointInputSchemas['orders.list'],
		output: GiftUpEndpointOutputSchemas['orders.list'],
	},
	'orders.get': {
		input: GiftUpEndpointInputSchemas['orders.get'],
		output: GiftUpEndpointOutputSchemas['orders.get'],
	},
	'orders.create': {
		input: GiftUpEndpointInputSchemas['orders.create'],
		output: GiftUpEndpointOutputSchemas['orders.create'],
	},
	'orders.update': {
		input: GiftUpEndpointInputSchemas['orders.update'],
		output: GiftUpEndpointOutputSchemas['orders.update'],
	},
	'orders.addNote': {
		input: GiftUpEndpointInputSchemas['orders.addNote'],
		output: GiftUpEndpointOutputSchemas['orders.addNote'],
	},
	'orders.markAsPosted': {
		input: GiftUpEndpointInputSchemas['orders.markAsPosted'],
		output: GiftUpEndpointOutputSchemas['orders.markAsPosted'],
	},
	'items.list': {
		input: GiftUpEndpointInputSchemas['items.list'],
		output: GiftUpEndpointOutputSchemas['items.list'],
	},
	'items.get': {
		input: GiftUpEndpointInputSchemas['items.get'],
		output: GiftUpEndpointOutputSchemas['items.get'],
	},
	'items.create': {
		input: GiftUpEndpointInputSchemas['items.create'],
		output: GiftUpEndpointOutputSchemas['items.create'],
	},
	'items.update': {
		input: GiftUpEndpointInputSchemas['items.update'],
		output: GiftUpEndpointOutputSchemas['items.update'],
	},
	'items.delete': {
		input: GiftUpEndpointInputSchemas['items.delete'],
		output: GiftUpEndpointOutputSchemas['items.delete'],
	},
	'groups.list': {
		input: GiftUpEndpointInputSchemas['groups.list'],
		output: GiftUpEndpointOutputSchemas['groups.list'],
	},
	'groups.get': {
		input: GiftUpEndpointInputSchemas['groups.get'],
		output: GiftUpEndpointOutputSchemas['groups.get'],
	},
	'groups.create': {
		input: GiftUpEndpointInputSchemas['groups.create'],
		output: GiftUpEndpointOutputSchemas['groups.create'],
	},
	'groups.update': {
		input: GiftUpEndpointInputSchemas['groups.update'],
		output: GiftUpEndpointOutputSchemas['groups.update'],
	},
	'groups.delete': {
		input: GiftUpEndpointInputSchemas['groups.delete'],
		output: GiftUpEndpointOutputSchemas['groups.delete'],
	},
	'locations.list': {
		input: GiftUpEndpointInputSchemas['locations.list'],
		output: GiftUpEndpointOutputSchemas['locations.list'],
	},
	'promotions.list': {
		input: GiftUpEndpointInputSchemas['promotions.list'],
		output: GiftUpEndpointOutputSchemas['promotions.list'],
	},
	'reports.listTransactions': {
		input: GiftUpEndpointInputSchemas['reports.listTransactions'],
		output: GiftUpEndpointOutputSchemas['reports.listTransactions'],
	},
	'reports.getTransaction': {
		input: GiftUpEndpointInputSchemas['reports.getTransaction'],
		output: GiftUpEndpointOutputSchemas['reports.getTransaction'],
	},
	'settings.getCheckout': {
		input: GiftUpEndpointInputSchemas['settings.getCheckout'],
		output: GiftUpEndpointOutputSchemas['settings.getCheckout'],
	},
	'settings.updateCheckout': {
		input: GiftUpEndpointInputSchemas['settings.updateCheckout'],
		output: GiftUpEndpointOutputSchemas['settings.updateCheckout'],
	},
	'settings.getEmail': {
		input: GiftUpEndpointInputSchemas['settings.getEmail'],
		output: GiftUpEndpointOutputSchemas['settings.getEmail'],
	},
	'settings.updateEmail': {
		input: GiftUpEndpointInputSchemas['settings.updateEmail'],
		output: GiftUpEndpointOutputSchemas['settings.updateEmail'],
	},
	'settings.getGiftCard': {
		input: GiftUpEndpointInputSchemas['settings.getGiftCard'],
		output: GiftUpEndpointOutputSchemas['settings.getGiftCard'],
	},
	'settings.updateGiftCard': {
		input: GiftUpEndpointInputSchemas['settings.updateGiftCard'],
		output: GiftUpEndpointOutputSchemas['settings.updateGiftCard'],
	},
	'settings.listArtwork': {
		input: GiftUpEndpointInputSchemas['settings.listArtwork'],
		output: GiftUpEndpointOutputSchemas['settings.listArtwork'],
	},
	'settings.uploadArtwork': {
		input: GiftUpEndpointInputSchemas['settings.uploadArtwork'],
		output: GiftUpEndpointOutputSchemas['settings.uploadArtwork'],
	},
	'settings.deleteArtwork': {
		input: GiftUpEndpointInputSchemas['settings.deleteArtwork'],
		output: GiftUpEndpointOutputSchemas['settings.deleteArtwork'],
	},
	'settings.getShipping': {
		input: GiftUpEndpointInputSchemas['settings.getShipping'],
		output: GiftUpEndpointOutputSchemas['settings.getShipping'],
	},
	'users.list': {
		input: GiftUpEndpointInputSchemas['users.list'],
		output: GiftUpEndpointOutputSchemas['users.list'],
	},
	'users.get': {
		input: GiftUpEndpointInputSchemas['users.get'],
		output: GiftUpEndpointOutputSchemas['users.get'],
	},
	'users.invite': {
		input: GiftUpEndpointInputSchemas['users.invite'],
		output: GiftUpEndpointOutputSchemas['users.invite'],
	},
	'users.update': {
		input: GiftUpEndpointInputSchemas['users.update'],
		output: GiftUpEndpointOutputSchemas['users.update'],
	},
	'users.delete': {
		input: GiftUpEndpointInputSchemas['users.delete'],
		output: GiftUpEndpointOutputSchemas['users.delete'],
	},
	'integrations.getStripeConnection': {
		input: GiftUpEndpointInputSchemas['integrations.getStripeConnection'],
		output: GiftUpEndpointOutputSchemas['integrations.getStripeConnection'],
	},
	'integrations.updateStripeConnection': {
		input: GiftUpEndpointInputSchemas['integrations.updateStripeConnection'],
		output: GiftUpEndpointOutputSchemas['integrations.updateStripeConnection'],
	},
	'partners.createAccount': {
		input: GiftUpEndpointInputSchemas['partners.createAccount'],
		output: GiftUpEndpointOutputSchemas['partners.createAccount'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof giftupEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const giftupEndpointMeta = {
	'ping.get': {
		riskLevel: 'read',
		description: 'Test connectivity and authorization with the Gift Up! API',
	},
	'ping.post': {
		riskLevel: 'write',
		description: 'Echo test with the Gift Up! API returning the posted payload',
	},
	'company.get': {
		riskLevel: 'read',
		description: 'Retrieve current company account profile and settings',
	},
	'giftCards.list': {
		riskLevel: 'read',
		description: 'List gift cards with optional date filters and pagination',
	},
	'giftCards.get': {
		riskLevel: 'read',
		description:
			'Retrieve details and remaining balance of a gift card by code',
	},
	'giftCards.update': {
		riskLevel: 'write',
		description: 'Update gift card properties using JSON Patch',
	},
	'giftCards.reactivate': {
		riskLevel: 'write',
		description: 'Reactivate a previously voided gift card',
	},
	'giftCards.void': {
		riskLevel: 'destructive',
		description: 'Void a gift card to prevent further redemptions',
	},
	'giftCards.topUp': {
		riskLevel: 'write',
		description: 'Top up remaining credit or units on a gift card',
	},
	'giftCards.redeem': {
		riskLevel: 'destructive',
		description: 'Redeem an amount or units against a gift card balance',
	},
	'giftCards.redeemInFull': {
		riskLevel: 'destructive',
		description: 'Redeem the entire remaining balance of a gift card',
	},
	'giftCards.undoRedemption': {
		riskLevel: 'write',
		description: 'Refund or reverse a previously executed gift card redemption',
	},
	'giftCards.transferBalances': {
		riskLevel: 'destructive',
		description:
			'Transfer remaining balances from source gift cards to a destination gift card',
	},
	'orders.list': {
		riskLevel: 'read',
		description: 'List orders with optional date filters and pagination',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific order by ID',
	},
	'orders.create': {
		riskLevel: 'destructive',
		description: 'Create an order and issue associated gift cards',
	},
	'orders.update': {
		riskLevel: 'write',
		description: 'Update order properties using JSON Patch',
	},
	'orders.addNote': {
		riskLevel: 'write',
		description: 'Add an internal note to an order',
	},
	'orders.markAsPosted': {
		riskLevel: 'write',
		description: 'Mark a postal order as posted and update gift card codes',
	},
	'items.list': {
		riskLevel: 'read',
		description: 'List gift card items with optional group filter',
	},
	'items.get': {
		riskLevel: 'read',
		description: 'Retrieve details of an item by ID',
	},
	'items.create': {
		riskLevel: 'write',
		description: 'Create a new gift card item product',
	},
	'items.update': {
		riskLevel: 'write',
		description: 'Update item properties using JSON Patch',
	},
	'items.delete': {
		riskLevel: 'destructive',
		description: 'Delete a gift card item product',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List all item groups',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Retrieve details of an item group by ID',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a new item group',
	},
	'groups.update': {
		riskLevel: 'write',
		description: 'Update an item group using JSON Patch',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Delete an item group',
	},
	'locations.list': {
		riskLevel: 'read',
		description: 'List all company store locations',
	},
	'promotions.list': {
		riskLevel: 'read',
		description: 'List all active and scheduled checkout promotions',
	},
	'reports.listTransactions': {
		riskLevel: 'read',
		description:
			'List ledger report transactions with optional date range and pagination',
	},
	'reports.getTransaction': {
		riskLevel: 'read',
		description: 'Retrieve a specific ledger report transaction by ID',
	},
	'settings.getCheckout': {
		riskLevel: 'read',
		description: 'Get company checkout styling, tips, and service fee settings',
	},
	'settings.updateCheckout': {
		riskLevel: 'write',
		description: 'Update checkout settings using JSON Patch',
	},
	'settings.getEmail': {
		riskLevel: 'read',
		description: 'Get email branding, sender, and template settings',
	},
	'settings.updateEmail': {
		riskLevel: 'write',
		description: 'Update email settings using JSON Patch',
	},
	'settings.getGiftCard': {
		riskLevel: 'read',
		description: 'Get gift card barcode, expiry, and terms defaults',
	},
	'settings.updateGiftCard': {
		riskLevel: 'write',
		description: 'Update gift card settings using JSON Patch',
	},
	'settings.listArtwork': {
		riskLevel: 'read',
		description: 'List uploaded gift card design artwork',
	},
	'settings.uploadArtwork': {
		riskLevel: 'write',
		description: 'Upload or set new gift card design artwork',
	},
	'settings.deleteArtwork': {
		riskLevel: 'destructive',
		description: 'Delete uploaded gift card design artwork by ID',
	},
	'settings.getShipping': {
		riskLevel: 'read',
		description: 'Get physical shipping and postal delivery options',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List staff users and administrators',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Retrieve user details by ID',
	},
	'users.invite': {
		riskLevel: 'destructive',
		description: 'Invite a staff user or administrator',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update staff user details using JSON Patch',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete a staff user account',
	},
	'integrations.getStripeConnection': {
		riskLevel: 'read',
		description:
			'Get Stripe integration connection status and enabled payment methods',
	},
	'integrations.updateStripeConnection': {
		riskLevel: 'write',
		description: 'Update Stripe payment method settings',
	},
	'partners.createAccount': {
		riskLevel: 'write',
		description: 'Provision a new Gift Up! merchant account via Partner API',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof giftupEndpointsNested>;

export const giftupAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseGiftUpPlugin<T extends GiftUpPluginOptions> = CorsairPlugin<
	'giftup',
	typeof GiftUpSchema,
	typeof giftupEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalGiftUpPlugin = BaseGiftUpPlugin<GiftUpPluginOptions>;

export type ExternalGiftUpPlugin<T extends GiftUpPluginOptions> =
	BaseGiftUpPlugin<T>;

export function giftup<const T extends GiftUpPluginOptions>(
	incomingOptions: GiftUpPluginOptions & T = {} as GiftUpPluginOptions & T,
): ExternalGiftUpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};

	return {
		id: 'giftup',
		authConfig: giftupAuthConfig,
		schema: GiftUpSchema,
		options,
		hooks: options.hooks,
		endpoints: giftupEndpointsNested,
		webhooks: {},
		endpointMeta: giftupEndpointMeta,
		endpointSchemas: giftupEndpointSchemas,
		errorHandlers: {
			...callers,
			...builtIns,
			...callers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: GiftUpKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('giftup', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('giftup', 'api_key');
			return apiKey;
		},
	} satisfies InternalGiftUpPlugin;
}

export type * from './endpoints/types';
