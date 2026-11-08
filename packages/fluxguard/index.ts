import type {
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
import { Account, Categories, Monitoring, Webhooks } from './endpoints';
import type {
	FluxguardEndpointInputs,
	FluxguardEndpointOutputs,
} from './endpoints/types';
import {
	FluxguardEndpointInputSchemas,
	FluxguardEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { FluxguardSchema } from './schema';
import { ChangeWebhooks } from './webhooks';
import { matchFluxguardTenantWebhook } from './webhooks/tenant-matcher';
import type {
	FluxguardChangeEvent,
	FluxguardWebhookOutputs,
} from './webhooks/types';
import {
	FluxguardChangeEventSchema,
	matchFluxguardWebhook,
} from './webhooks/types';

export type FluxguardPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Fluxguard API key from Account Settings (https://app.fluxguard.com/settings). */
	key?: string;
	/**
	 * The webhook's secret key, shown beside the URL in Account Settings.
	 * Fluxguard signs each delivery with it. Overrides the one stored with
	 * keys.set_webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalFluxguardPlugin['hooks'];
	webhookHooks?: InternalFluxguardPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fluxguardEndpointsNested>;
};

export type FluxguardContext = CorsairPluginContext<
	typeof FluxguardSchema,
	FluxguardPluginOptions
>;

export type FluxguardKeyBuilderContext =
	KeyBuilderContext<FluxguardPluginOptions>;

export type FluxguardBoundEndpoints = BindEndpoints<
	typeof fluxguardEndpointsNested
>;

type FluxguardEndpoint<K extends keyof FluxguardEndpointOutputs> =
	CorsairEndpoint<
		FluxguardContext,
		FluxguardEndpointInputs[K],
		FluxguardEndpointOutputs[K]
	>;

export type FluxguardEndpoints = {
	[K in keyof FluxguardEndpointOutputs]: FluxguardEndpoint<K>;
};

type FluxguardWebhook<K extends keyof FluxguardWebhookOutputs> = CorsairWebhook<
	FluxguardContext,
	FluxguardChangeEvent,
	FluxguardWebhookOutputs[K]
>;

export type FluxguardWebhooks = {
	[K in keyof FluxguardWebhookOutputs]: FluxguardWebhook<K>;
};

export type FluxguardBoundWebhooks = BindWebhooks<FluxguardWebhooks>;

const fluxguardEndpointsNested = {
	account: {
		get: Account.get,
	},
	monitoring: {
		addPage: Monitoring.addPage,
		startCrawl: Monitoring.startCrawl,
		getPage: Monitoring.getPage,
		deletePage: Monitoring.removePage,
		deleteSite: Monitoring.removeSite,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		delete: Webhooks.remove,
		sample: Webhooks.sample,
	},
	categories: {
		list: Categories.list,
		create: Categories.create,
	},
} as const;

const fluxguardWebhooksNested = {
	change: {
		detected: ChangeWebhooks.detected,
	},
} as const;

export const fluxguardEndpointSchemas = {
	'account.get': {
		input: FluxguardEndpointInputSchemas.accountGet,
		output: FluxguardEndpointOutputSchemas.accountGet,
	},
	'monitoring.addPage': {
		input: FluxguardEndpointInputSchemas.monitoringAddPage,
		output: FluxguardEndpointOutputSchemas.monitoringAddPage,
	},
	'monitoring.startCrawl': {
		input: FluxguardEndpointInputSchemas.monitoringStartCrawl,
		output: FluxguardEndpointOutputSchemas.monitoringStartCrawl,
	},
	'monitoring.getPage': {
		input: FluxguardEndpointInputSchemas.monitoringGetPage,
		output: FluxguardEndpointOutputSchemas.monitoringGetPage,
	},
	'monitoring.deletePage': {
		input: FluxguardEndpointInputSchemas.monitoringDeletePage,
		output: FluxguardEndpointOutputSchemas.monitoringDeletePage,
	},
	'monitoring.deleteSite': {
		input: FluxguardEndpointInputSchemas.monitoringDeleteSite,
		output: FluxguardEndpointOutputSchemas.monitoringDeleteSite,
	},
	'webhooks.list': {
		input: FluxguardEndpointInputSchemas.webhooksList,
		output: FluxguardEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: FluxguardEndpointInputSchemas.webhooksCreate,
		output: FluxguardEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.delete': {
		input: FluxguardEndpointInputSchemas.webhooksDelete,
		output: FluxguardEndpointOutputSchemas.webhooksDelete,
	},
	'webhooks.sample': {
		input: FluxguardEndpointInputSchemas.webhooksSample,
		output: FluxguardEndpointOutputSchemas.webhooksSample,
	},
	'categories.list': {
		input: FluxguardEndpointInputSchemas.categoriesList,
		output: FluxguardEndpointOutputSchemas.categoriesList,
	},
	'categories.create': {
		input: FluxguardEndpointInputSchemas.categoriesCreate,
		output: FluxguardEndpointOutputSchemas.categoriesCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof fluxguardEndpointsNested
>;

const fluxguardWebhookSchemas = {
	'change.detected': {
		description:
			'A monitored page changed: Fluxguard posts the captured version with references to its HTML, screenshot and diff files',
		payload: FluxguardChangeEventSchema,
		response: FluxguardChangeEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof fluxguardWebhooksNested
>;

const fluxguardEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			'Get the organisation account: plan, credits, site count and flags',
	},
	'monitoring.addPage': {
		riskLevel: 'write',
		description:
			'Add a URL for monitoring, creating a site and session when none is given',
	},
	'monitoring.startCrawl': {
		riskLevel: 'write',
		description:
			'Start capturing a session now; the capture runs in the background and spends account credits',
	},
	'monitoring.getPage': {
		riskLevel: 'read',
		description:
			'Get one monitored page with its version counts and categories',
	},
	'monitoring.deletePage': {
		riskLevel: 'destructive',
		irreversible: true,
		// Fluxguard sets status to `ignore` rather than removing the row, so the
		// id keeps resolving while the page and its versions stop being shown.
		description:
			'Stop monitoring a page: Fluxguard hides it and everything captured for it, and the id still resolves with status ignore',
	},
	'monitoring.deleteSite': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a site with all of its sessions, pages and captured versions',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhook URLs change events are posted to',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Add a webhook URL. Every later change event is POSTed to it, so a live URL starts receiving data immediately',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Remove a webhook so its URL stops receiving change events',
	},
	'webhooks.sample': {
		riskLevel: 'read',
		description:
			'Get a sample delivery built from this account, to inspect the payload shape',
	},
	'categories.list': {
		riskLevel: 'read',
		description:
			'List the site categories change notifications can be limited to',
	},
	'categories.create': {
		riskLevel: 'write',
		description:
			'Create a site category; sites are assigned to it in the Fluxguard console',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof fluxguardEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const fluxguardAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFluxguardPlugin<T extends FluxguardPluginOptions> =
	CorsairPlugin<
		'fluxguard',
		typeof FluxguardSchema,
		typeof fluxguardEndpointsNested,
		typeof fluxguardWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalFluxguardPlugin =
	BaseFluxguardPlugin<FluxguardPluginOptions>;

export type ExternalFluxguardPlugin<T extends FluxguardPluginOptions> =
	BaseFluxguardPlugin<T>;

export function fluxguard<const T extends FluxguardPluginOptions>(
	incomingOptions: FluxguardPluginOptions & T = {} as FluxguardPluginOptions &
		T,
): ExternalFluxguardPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fluxguard',
		authConfig: fluxguardAuthConfig,
		schema: FluxguardSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: fluxguardEndpointsNested,
		webhooks: fluxguardWebhooksNested,
		endpointMeta: fluxguardEndpointMeta,
		endpointSchemas: fluxguardEndpointSchemas,
		webhookSchemas: fluxguardWebhookSchemas,
		pluginWebhookMatcher: matchFluxguardWebhook,
		pluginTenantWebhookMatcher: matchFluxguardTenantWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: FluxguardKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// An empty key makes verification fail closed with a clear error.
				const secret =
					options.webhookSecret?.trim() ??
					(await ctx.keys.get_webhook_signature())?.trim();
				return secret ?? '';
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}

			throw new AuthMissingError('fluxguard', ctx.authType ?? 'api_key');
		},
	} satisfies InternalFluxguardPlugin;
}

export { FluxguardAPIError } from './client';
export type {
	AccountGetInput,
	AccountGetResponse,
	CategoriesCreateInput,
	CategoriesCreateResponse,
	CategoriesListResponse,
	FluxguardCategory,
	FluxguardEndpointInputs,
	FluxguardEndpointOutputs,
	FluxguardWebhook,
	MonitoringAddPageInput,
	MonitoringAddPageResponse,
	MonitoringDeletePageResponse,
	MonitoringDeleteSiteResponse,
	MonitoringGetPageResponse,
	MonitoringStartCrawlInput,
	MonitoringStartCrawlResponse,
	WebhooksCreateInput,
	WebhooksCreateResponse,
	WebhooksDeleteResponse,
	WebhooksListResponse,
	WebhooksSampleResponse,
} from './endpoints/types';
export {
	FLUXGUARD_SIGNATURE_HEADER,
	type FluxguardChangeEvent,
	type FluxguardWebhookOutputs,
} from './webhooks/types';
