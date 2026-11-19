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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	SearchAnalyticsEndpoints,
	SitemapsEndpoints,
	SitesEndpoints,
	UrlInspectionEndpoints,
} from './endpoints';
import type {
	GoogleSearchConsoleEndpointInputs,
	GoogleSearchConsoleEndpointOutputs,
} from './endpoints/types';
import {
	GoogleSearchConsoleEndpointInputSchemas,
	GoogleSearchConsoleEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GoogleSearchConsoleSchema } from './schema';

export type GoogleSearchConsolePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	hooks?: InternalGoogleSearchConsolePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof googleSearchConsoleEndpointsNested
	>;
};

/**
 * The OAuth tokens are all this plugin needs; an unfilled extra field would
 * mark every connection as partial.
 */
export const googleSearchConsoleAuthConfig = {
	oauth_2: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type GoogleSearchConsoleContext = CorsairPluginContext<
	typeof GoogleSearchConsoleSchema,
	GoogleSearchConsolePluginOptions
>;

export type GoogleSearchConsoleKeyBuilderContext =
	KeyBuilderContext<GoogleSearchConsolePluginOptions>;

export type GoogleSearchConsoleBoundEndpoints = BindEndpoints<
	typeof googleSearchConsoleEndpointsNested
>;

type GoogleSearchConsoleEndpoint<
	K extends keyof GoogleSearchConsoleEndpointOutputs,
> = CorsairEndpoint<
	GoogleSearchConsoleContext,
	GoogleSearchConsoleEndpointInputs[K],
	GoogleSearchConsoleEndpointOutputs[K]
>;

export type GoogleSearchConsoleEndpoints = {
	searchanalyticsQuery: GoogleSearchConsoleEndpoint<'searchanalyticsQuery'>;
	sitesList: GoogleSearchConsoleEndpoint<'sitesList'>;
	sitesGet: GoogleSearchConsoleEndpoint<'sitesGet'>;
	sitesAdd: GoogleSearchConsoleEndpoint<'sitesAdd'>;
	sitesDelete: GoogleSearchConsoleEndpoint<'sitesDelete'>;
	sitemapsList: GoogleSearchConsoleEndpoint<'sitemapsList'>;
	sitemapsGet: GoogleSearchConsoleEndpoint<'sitemapsGet'>;
	sitemapsSubmit: GoogleSearchConsoleEndpoint<'sitemapsSubmit'>;
	sitemapsDelete: GoogleSearchConsoleEndpoint<'sitemapsDelete'>;
	urlInspectionInspect: GoogleSearchConsoleEndpoint<'urlInspectionInspect'>;
};

const googleSearchConsoleEndpointsNested = {
	searchanalytics: SearchAnalyticsEndpoints,
	sites: SitesEndpoints,
	sitemaps: SitemapsEndpoints,
	urlInspection: UrlInspectionEndpoints,
} as const;

export const googleSearchConsoleEndpointSchemas = {
	'searchanalytics.query': {
		input: GoogleSearchConsoleEndpointInputSchemas.searchanalyticsQuery,
		output: GoogleSearchConsoleEndpointOutputSchemas.searchanalyticsQuery,
	},
	'sites.list': {
		input: GoogleSearchConsoleEndpointInputSchemas.sitesList,
		output: GoogleSearchConsoleEndpointOutputSchemas.sitesList,
	},
	'sites.get': {
		input: GoogleSearchConsoleEndpointInputSchemas.sitesGet,
		output: GoogleSearchConsoleEndpointOutputSchemas.sitesGet,
	},
	'sites.add': {
		input: GoogleSearchConsoleEndpointInputSchemas.sitesAdd,
		output: GoogleSearchConsoleEndpointOutputSchemas.sitesAdd,
	},
	'sites.delete': {
		input: GoogleSearchConsoleEndpointInputSchemas.sitesDelete,
		output: GoogleSearchConsoleEndpointOutputSchemas.sitesDelete,
	},
	'sitemaps.list': {
		input: GoogleSearchConsoleEndpointInputSchemas.sitemapsList,
		output: GoogleSearchConsoleEndpointOutputSchemas.sitemapsList,
	},
	'sitemaps.get': {
		input: GoogleSearchConsoleEndpointInputSchemas.sitemapsGet,
		output: GoogleSearchConsoleEndpointOutputSchemas.sitemapsGet,
	},
	'sitemaps.submit': {
		input: GoogleSearchConsoleEndpointInputSchemas.sitemapsSubmit,
		output: GoogleSearchConsoleEndpointOutputSchemas.sitemapsSubmit,
	},
	'sitemaps.delete': {
		input: GoogleSearchConsoleEndpointInputSchemas.sitemapsDelete,
		output: GoogleSearchConsoleEndpointOutputSchemas.sitemapsDelete,
	},
	'urlInspection.inspect': {
		input: GoogleSearchConsoleEndpointInputSchemas.urlInspectionInspect,
		output: GoogleSearchConsoleEndpointOutputSchemas.urlInspectionInspect,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleSearchConsoleEndpointsNested
>;

const defaultAuthType = 'oauth_2' as const;

const googleSearchConsoleEndpointMeta = {
	'searchanalytics.query': {
		riskLevel: 'read',
		description:
			'Query search traffic: clicks, impressions, CTR and position, grouped by date, query, page, country, device or another dimension',
	},
	'sites.list': {
		riskLevel: 'read',
		description:
			'List the properties the credentials can reach, with the permission level on each',
	},
	'sites.get': {
		riskLevel: 'read',
		description: 'Read one property and the permission level on it',
	},
	'sites.add': {
		riskLevel: 'write',
		description:
			"Add a property the account already controls to the API's property list. It does not verify ownership",
	},
	'sites.delete': {
		riskLevel: 'destructive',
		description:
			"Remove a property from this account's Search Console property list. Other owners keep it, and it can usually be re-added without verifying again",
	},
	'sitemaps.list': {
		riskLevel: 'read',
		description:
			'List the sitemaps submitted for a property, with their errors and warnings',
	},
	'sitemaps.get': {
		riskLevel: 'read',
		description: 'Read one submitted sitemap',
	},
	'sitemaps.submit': {
		riskLevel: 'write',
		description:
			'Submit a sitemap URL, which asks Google to fetch it. Sending one already listed refreshes its status',
	},
	'sitemaps.delete': {
		riskLevel: 'destructive',
		description:
			"Remove a sitemap from the property's Sitemaps report. Google may still crawl the sitemap and the URLs it already found",
	},
	'urlInspection.inspect': {
		riskLevel: 'read',
		description:
			'Inspect one URL: whether Google indexed it, the canonical it chose, and any mobile-usability, rich-result or AMP issues',
	},
} satisfies RequiredPluginEndpointMeta<
	typeof googleSearchConsoleEndpointsNested
>;

export type BaseGoogleSearchConsolePlugin<
	T extends GoogleSearchConsolePluginOptions,
> = CorsairPlugin<
	'googlesearchconsole',
	typeof GoogleSearchConsoleSchema,
	typeof googleSearchConsoleEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof googleSearchConsoleAuthConfig
>;

export type InternalGoogleSearchConsolePlugin =
	BaseGoogleSearchConsolePlugin<GoogleSearchConsolePluginOptions>;

export type ExternalGoogleSearchConsolePlugin<
	T extends GoogleSearchConsolePluginOptions,
> = BaseGoogleSearchConsolePlugin<T>;

export function googlesearchconsole<
	const T extends GoogleSearchConsolePluginOptions,
>(
	incomingOptions: GoogleSearchConsolePluginOptions &
		T = {} as GoogleSearchConsolePluginOptions & T,
): ExternalGoogleSearchConsolePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlesearchconsole',
		authConfig: googleSearchConsoleAuthConfig,
		schema: GoogleSearchConsoleSchema,
		options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				// Covers every method in this plugin, reads and the sitemap and site
				// writes. The readonly scope cannot submit a sitemap.
				'https://www.googleapis.com/auth/webmasters',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		endpoints: googleSearchConsoleEndpointsNested,
		webhooks: {},
		endpointMeta: googleSearchConsoleEndpointMeta,
		endpointSchemas: googleSearchConsoleEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		// Search Console has no key auth: the credential must be an OAuth token
		// belonging to an account with access to the property.
		keyBuilder: async (ctx: GoogleSearchConsoleKeyBuilderContext) => {
			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('googlesearchconsole', 'oauth_2');
			}
			return getOAuthAccessToken(ctx, {
				plugin: 'googlesearchconsole',
				tokenUrl: 'https://oauth2.googleapis.com/token',
			});
		},
	} satisfies InternalGoogleSearchConsolePlugin;
}

export type {
	GoogleSearchConsoleEndpointInputs,
	GoogleSearchConsoleEndpointOutputSchemas,
	GoogleSearchConsoleEndpointOutputs,
} from './endpoints/types';
export { GoogleSearchConsoleSchema } from './schema';
