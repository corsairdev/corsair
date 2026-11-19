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
import {
	Addons,
	Invoices,
	Jobs,
	Settings,
	Sites,
	UnitRentals,
	Units,
	Users,
} from './endpoints';
import type {
	StoreganiseEndpointInputs,
	StoreganiseEndpointOutputs,
} from './endpoints/types';
import {
	StoreganiseEndpointInputSchemas,
	StoreganiseEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { StoreganiseSchema } from './schema';
import { event } from './webhooks';
import {
	matchStoreganiseWebhook,
	StoreganiseEventSchema,
} from './webhooks/types';

export type StoreganisePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Storeganise admin API key (Main Settings > Developer). */
	key?: string;
	/**
	 * The business code of the Storeganise instance, the subdomain of
	 * https://<business_code>.storeganise.com. Overrides the one stored with
	 * keys.set_business_code.
	 */
	businessCode?: string;
	/**
	 * Secret used to sign webhook deliveries (visible from GET
	 * /admin/settings). Overrides the one stored with
	 * keys.set_webhook_signature. Every Storeganise delivery is signed, so a
	 * delivery is rejected unless a secret is configured.
	 */
	webhookSecret?: string;
	hooks?: InternalStoreganisePlugin['hooks'];
	webhookHooks?: InternalStoreganisePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof storeganiseEndpointsNested>;
};

export type StoreganiseContext = CorsairPluginContext<
	typeof StoreganiseSchema,
	StoreganisePluginOptions,
	undefined,
	typeof storeganiseAuthConfig
>;

export type StoreganiseKeyBuilderContext =
	KeyBuilderContext<StoreganisePluginOptions>;

export type StoreganiseBoundEndpoints = BindEndpoints<
	typeof storeganiseEndpointsNested
>;

type StoreganiseEndpoint<K extends keyof StoreganiseEndpointOutputs> =
	CorsairEndpoint<
		StoreganiseContext,
		StoreganiseEndpointInputs[K],
		StoreganiseEndpointOutputs[K]
	>;

export type StoreganiseEndpoints = {
	[K in keyof StoreganiseEndpointOutputs]: StoreganiseEndpoint<K>;
};

export type StoreganiseBoundWebhooks = BindWebhooks<
	typeof storeganiseWebhooksNested
>;

const storeganiseEndpointsNested = {
	settings: {
		get: Settings.get,
	},
	sites: {
		list: Sites.list,
		get: Sites.get,
	},
	units: {
		list: Units.list,
	},
	users: {
		list: Users.list,
		get: Users.get,
	},
	invoices: {
		list: Invoices.list,
	},
	unitRentals: {
		list: UnitRentals.list,
		get: UnitRentals.get,
		update: UnitRentals.update,
	},
	jobs: {
		get: Jobs.get,
	},
	addons: {
		list: Addons.list,
		get: Addons.get,
	},
} as const;

export const storeganiseWebhooksNested = {
	storeganise: {
		event,
	},
} as const;

export const storeganiseEndpointSchemas = {
	'settings.get': {
		input: StoreganiseEndpointInputSchemas.settingsGet,
		output: StoreganiseEndpointOutputSchemas.settingsGet,
	},
	'sites.list': {
		input: StoreganiseEndpointInputSchemas.sitesList,
		output: StoreganiseEndpointOutputSchemas.sitesList,
	},
	'sites.get': {
		input: StoreganiseEndpointInputSchemas.sitesGet,
		output: StoreganiseEndpointOutputSchemas.sitesGet,
	},
	'units.list': {
		input: StoreganiseEndpointInputSchemas.unitsList,
		output: StoreganiseEndpointOutputSchemas.unitsList,
	},
	'users.list': {
		input: StoreganiseEndpointInputSchemas.usersList,
		output: StoreganiseEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: StoreganiseEndpointInputSchemas.usersGet,
		output: StoreganiseEndpointOutputSchemas.usersGet,
	},
	'invoices.list': {
		input: StoreganiseEndpointInputSchemas.invoicesList,
		output: StoreganiseEndpointOutputSchemas.invoicesList,
	},
	'unitRentals.list': {
		input: StoreganiseEndpointInputSchemas.unitRentalsList,
		output: StoreganiseEndpointOutputSchemas.unitRentalsList,
	},
	'unitRentals.get': {
		input: StoreganiseEndpointInputSchemas.unitRentalsGet,
		output: StoreganiseEndpointOutputSchemas.unitRentalsGet,
	},
	'unitRentals.update': {
		input: StoreganiseEndpointInputSchemas.unitRentalsUpdate,
		output: StoreganiseEndpointOutputSchemas.unitRentalsUpdate,
	},
	'jobs.get': {
		input: StoreganiseEndpointInputSchemas.jobsGet,
		output: StoreganiseEndpointOutputSchemas.jobsGet,
	},
	'addons.list': {
		input: StoreganiseEndpointInputSchemas.addonsList,
		output: StoreganiseEndpointOutputSchemas.addonsList,
	},
	'addons.get': {
		input: StoreganiseEndpointInputSchemas.addonsGet,
		output: StoreganiseEndpointOutputSchemas.addonsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof storeganiseEndpointsNested
>;

const storeganiseWebhookSchemas = {
	'storeganise.event': {
		description: 'An event happened in the Storeganise system',
		payload: StoreganiseEventSchema,
		response: StoreganiseEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof storeganiseWebhooksNested
>;

const storeganiseEndpointMeta = {
	'settings.get': {
		riskLevel: 'read',
		description: 'Read the business settings, including the webhook secret',
	},
	'sites.list': {
		riskLevel: 'read',
		description: 'List storage sites, optionally filtered by a search term',
	},
	'sites.get': {
		riskLevel: 'read',
		description: 'Read one storage site by id or code',
	},
	'units.list': {
		riskLevel: 'read',
		description: 'List storage units with dimensions and default prices',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List users, filtered by update time or fetched in batches of ids',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one user by id or email address',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'List invoices, filtered by update time or fetched in batches of ids',
	},
	'unitRentals.list': {
		riskLevel: 'read',
		description:
			'List unit rentals in batches of ids, embedding related records',
	},
	'unitRentals.get': {
		riskLevel: 'read',
		description:
			'Read one unit rental, embedding its unit, owner and custom fields',
	},
	'unitRentals.update': {
		riskLevel: 'write',
		description: 'Set custom fields on a unit rental, such as access codes',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Read one job by the id a webhook delivery carries',
	},
	'addons.list': {
		riskLevel: 'read',
		description: 'List the add-ons installed on the account',
	},
	'addons.get': {
		riskLevel: 'read',
		description: 'Read one add-on record with its operator credentials',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof storeganiseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const storeganiseAuthConfig = {
	api_key: {
		// The business code is the per-tenant subdomain of
		// https://<business_code>.storeganise.com, so the account needs it
		// beside the API key.
		account: ['business_code'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseStoreganisePlugin<T extends StoreganisePluginOptions> =
	CorsairPlugin<
		'storeganise',
		typeof StoreganiseSchema,
		typeof storeganiseEndpointsNested,
		typeof storeganiseWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof storeganiseAuthConfig
	>;

export type InternalStoreganisePlugin =
	BaseStoreganisePlugin<StoreganisePluginOptions>;

export type ExternalStoreganisePlugin<T extends StoreganisePluginOptions> =
	BaseStoreganisePlugin<T>;

export function storeganise<const T extends StoreganisePluginOptions>(
	incomingOptions: StoreganisePluginOptions &
		T = {} as StoreganisePluginOptions & T,
): ExternalStoreganisePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'storeganise',
		authConfig: storeganiseAuthConfig,
		schema: StoreganiseSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: storeganiseEndpointsNested,
		webhooks: storeganiseWebhooksNested,
		endpointMeta: storeganiseEndpointMeta,
		endpointSchemas: storeganiseEndpointSchemas,
		webhookSchemas: storeganiseWebhookSchemas,
		pluginWebhookMatcher: matchStoreganiseWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: StoreganiseKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Every Storeganise delivery is signed, so an empty secret makes
				// the handler reject deliveries with 401 rather than accept them
				// unverified.
				if (options.webhookSecret) return options.webhookSecret;
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('storeganise', ctx.authType ?? 'api_key');
		},
	} satisfies InternalStoreganisePlugin;
}

export { StoreganiseAPIError } from './client';
export type {
	StoreganiseAddon,
	StoreganiseEndpointInputs,
	StoreganiseEndpointOutputs,
	StoreganiseInvoice,
	StoreganiseJob,
	StoreganiseSettings,
	StoreganiseSite,
	StoreganiseUnit,
	StoreganiseUnitRental,
	StoreganiseUser,
} from './endpoints/types';
export type { StoreganiseWebhookEventPayload } from './webhooks/types';
export {
	matchStoreganiseWebhook,
	SG_SIGNATURE_HEADER,
	verifyStoreganiseWebhook,
} from './webhooks/types';
