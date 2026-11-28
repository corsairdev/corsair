import type {
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
} from 'corsair/core';
import { getOAuthAccessToken } from 'corsair/core';
import type { ZohoCrmRegion } from './client';
import { zohocrmOAuthAuthUrl, zohocrmOAuthTokenUrl } from './client';
import {
	zohocrmEndpointMeta as generatedEndpointMeta,
	zohocrmEndpointSchemas,
	zohocrmEndpointsNested,
} from './endpoints/catalog';
import type {
	ZohoCrmEndpointInputs,
	ZohoCrmEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZohoCrmSchema } from './schema';

export type ZohoCrmPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/**
	 * The Zoho data center the org lives in: `us` (default), `eu`, `in`, `au`,
	 * `jp`, `ca`, `cn` or `sa`. API calls and sign-in use that data center's hosts.
	 */
	region?: ZohoCrmRegion;
	/** A Zoho OAuth access token, for scripts and tests. Leave it out to use the connected account's token, which core refreshes. */
	key?: string;
	/**
	 * Another API base in front of Zoho, such as a proxy. Leave it out to use https://www.zohoapis.<tld> for the region.
	 */
	baseUrl?: string;
	hooks?: InternalZohoCrmPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zohocrmEndpointsNested>;
};

/** A Zoho OAuth connection per account; the access token goes in `Authorization: Zoho-oauthtoken <token>`. */
export const zohocrmAuthConfig = {
	oauth_2: {},
} as const satisfies PluginAuthConfig;

/**
 * The scopes the plugin asks for: every API area it calls. Zoho takes one
 * comma-separated list.
 */
export const zohocrmOAuthScopes = [
	'ZohoCRM.modules.ALL',
	'ZohoCRM.settings.ALL',
	'ZohoCRM.users.ALL',
	'ZohoCRM.org.ALL',
	'ZohoCRM.bulk.ALL',
	'ZohoCRM.notifications.ALL',
	'ZohoCRM.coql.READ',
	'ZohoCRM.files.CREATE',
	'ZohoCRM.files.READ',
	'ZohoCRM.mass_update.UPDATE',
	'ZohoCRM.mass_update.READ',
	'ZohoCRM.mass_delete.DELETE',
	'ZohoCRM.mass_delete.READ',
	'ZohoCRM.mass_convert.leads.CREATE',
	'ZohoCRM.mass_convert.leads.READ',
	'ZohoCRM.change_owner.CREATE',
	'ZohoCRM.change_owner.READ',
	'ZohoCRM.send_mail.all.CREATE',
	'ZohoCRM.templates.email.READ',
	'ZohoCRM.templates.inventory.READ',
	'ZohoCRM.composite_requests.CUSTOM',
	'ZohoCRM.features.READ',
	'ZohoCRM.apis.READ',
	'ZohoCRM.zia.enrichment.ALL',
	'ZohoCRM.share.ALL',
	'ZohoFiles.files.ALL',
	'ZohoCRM.settings.currencies.READ',
	'ZohoCRM.settings.currencies.CREATE',
	'ZohoCRM.settings.currencies.UPDATE',
	'ZohoCRM.settings.fiscal_year.READ',
	'ZohoCRM.settings.fiscal_year.UPDATE',
	'ZohoCRM.settings.audit_logs.READ',
	'ZohoCRM.settings.audit_logs.CREATE',
	'ZohoCRM.settings.recycle_bin.READ',
	'ZohoCRM.settings.recycle_bin.UPDATE',
	'ZohoCRM.settings.recycle_bin.DELETE',
] as const;

export type ZohoCrmContext = CorsairPluginContext<
	typeof ZohoCrmSchema,
	ZohoCrmPluginOptions,
	undefined,
	typeof zohocrmAuthConfig
>;

export type ZohoCrmKeyBuilderContext = KeyBuilderContext<
	ZohoCrmPluginOptions,
	typeof zohocrmAuthConfig
>;

export type ZohoCrmBoundEndpoints = BindEndpoints<
	typeof zohocrmEndpointsNested
>;

export type ZohoCrmEndpoints = {
	[Id in keyof ZohoCrmEndpointOutputs]: CorsairEndpoint<
		ZohoCrmContext,
		ZohoCrmEndpointInputs[Id],
		ZohoCrmEndpointOutputs[Id]
	>;
};

export { zohocrmEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const zohocrmEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof zohocrmEndpointsNested
	>;

const defaultAuthType = 'oauth_2' as const;

export type BaseZohoCrmPlugin<T extends ZohoCrmPluginOptions> = CorsairPlugin<
	'zohocrm',
	typeof ZohoCrmSchema,
	typeof zohocrmEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof zohocrmAuthConfig
>;

export type InternalZohoCrmPlugin = BaseZohoCrmPlugin<ZohoCrmPluginOptions>;

export type ExternalZohoCrmPlugin<T extends ZohoCrmPluginOptions> =
	BaseZohoCrmPlugin<T>;

export function zohocrm<const T extends ZohoCrmPluginOptions>(
	// Safe: every ZohoCrmPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: ZohoCrmPluginOptions & T = {} as ZohoCrmPluginOptions & T,
): ExternalZohoCrmPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zohocrm',
		schema: ZohoCrmSchema,
		options: options,
		hooks: options.hooks,
		endpoints: zohocrmEndpointsNested,
		webhooks: {},
		authConfig: zohocrmAuthConfig,
		oauthConfig: {
			providerName: 'Zoho CRM',
			authUrl: zohocrmOAuthAuthUrl(options.region),
			tokenUrl: zohocrmOAuthTokenUrl(options.region),
			scopes: [zohocrmOAuthScopes.join(',')],
			// A refresh token comes only with offline access; consent makes Zoho send it again on a reconnect.
			authParams: { access_type: 'offline', prompt: 'consent' },
			tokenAuthMethod: 'body',
		},
		endpointMeta: zohocrmEndpointMeta,
		endpointSchemas: zohocrmEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: ZohoCrmKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			// The connected account's token, refreshed at the region's accounts host.
			return getOAuthAccessToken(ctx, {
				plugin: 'zohocrm',
				tokenUrl: zohocrmOAuthTokenUrl(ctx.options.region),
				tokenAuthMethod: 'body',
			});
		},
	} satisfies InternalZohoCrmPlugin;
}

export type { ZohoCrmRegion } from './client';
export {
	ZOHOCRM_REGIONS,
	zohocrmApiBase,
	zohocrmOAuthTokenUrl,
} from './client';
export {
	createZohoCrmOperation,
	getZohoCrmInputSchema,
	getZohoCrmOutputSchema,
	ZOHOCRM_OPERATION_IDS,
} from './endpoints';
export type {
	ZohoCrmEndpointInputs,
	ZohoCrmEndpointOutputs,
	ZohoCrmJsonValue,
	ZohoCrmOperationId,
} from './endpoints/types';
export {
	ZohoCrmEndpointInputSchemas,
	ZohoCrmEndpointOutputSchemas,
} from './endpoints/types';
