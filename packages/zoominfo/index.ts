import type {
	AuthTypes,
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
import type { ZoominfoAuthContext } from './auth';
import { resolveZoominfoToken } from './auth';
import { Zoominfo } from './endpoints';
import type {
	ZoominfoEndpointInputs,
	ZoominfoEndpointOutputs,
} from './endpoints/types';
import {
	ZoominfoEndpointInputSchemas,
	ZoominfoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZoominfoSchema } from './schema';
import { ZoominfoWebhookHandlers } from './webhooks';
import { zoominfoSubscribe } from './webhooks/subscribe';
import { matchZoominfoTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CompanyUpdateEvent,
	ContactUpdateEvent,
	ZoominfoWebhookOutputs,
} from './webhooks/types';
import {
	CompanyUpdateEventSchema,
	ContactUpdateEventSchema,
	ZOOMINFO_TOKEN_HEADER,
} from './webhooks/types';

export type ZoominfoPluginOptions = {
	// ZoomInfo has no long-lived API key: every call carries a JWT minted by
	// /authenticate that expires after an hour, so oauth_2 is the only auth type
	// whose key manager can hold and refresh one.
	authType?: PickAuth<'oauth_2'>;
	/** Pre-resolved JWT, mainly for tests. Expires an hour after it was issued. */
	key?: string;
	/** ZoomInfo webhook verification token, from the Monitoring API. */
	webhookSecret?: string;
	/** Overrides the API base, e.g. to point tests at a local server. */
	baseUrl?: string;
	hooks?: InternalZoominfoPlugin['hooks'];
	webhookHooks?: InternalZoominfoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zoominfoEndpointsNested>;
};

export type ZoominfoContext = CorsairPluginContext<
	typeof ZoominfoSchema,
	ZoominfoPluginOptions
>;

export type ZoominfoKeyBuilderContext =
	KeyBuilderContext<ZoominfoPluginOptions>;

export type ZoominfoBoundEndpoints = BindEndpoints<
	typeof zoominfoEndpointsNested
>;

type ZoominfoEndpoint<K extends keyof ZoominfoEndpointOutputs> =
	CorsairEndpoint<
		ZoominfoContext,
		ZoominfoEndpointInputs[K],
		ZoominfoEndpointOutputs[K]
	>;

export type ZoominfoEndpoints = {
	[K in keyof ZoominfoEndpointOutputs]: ZoominfoEndpoint<K>;
};

type ZoominfoWebhook<
	K extends keyof ZoominfoWebhookOutputs,
	TEvent,
> = CorsairWebhook<ZoominfoContext, TEvent, ZoominfoWebhookOutputs[K]>;

export type ZoominfoWebhooks = {
	contactUpdate: ZoominfoWebhook<'contactUpdate', ContactUpdateEvent>;
	companyUpdate: ZoominfoWebhook<'companyUpdate', CompanyUpdateEvent>;
};

export type ZoominfoBoundWebhooks = BindWebhooks<ZoominfoWebhooks>;

const zoominfoEndpointsNested = {
	zoominfo: {
		searchCompanies: Zoominfo.searchCompanies,
		searchContacts: Zoominfo.searchContacts,
		searchIntent: Zoominfo.searchIntent,
		searchNews: Zoominfo.searchNews,
		searchScoops: Zoominfo.searchScoops,
		enrichCompany: Zoominfo.enrichCompany,
		enrichContact: Zoominfo.enrichContact,
		enrichIntent: Zoominfo.enrichIntent,
		enrichLocation: Zoominfo.enrichLocation,
		enrichNews: Zoominfo.enrichNews,
		enrichScoop: Zoominfo.enrichScoop,
		enrichTechnology: Zoominfo.enrichTechnology,
		getCompanySearchInputFields: Zoominfo.getCompanySearchInputFields,
		getContactSearchInputFields: Zoominfo.getContactSearchInputFields,
		getIntentSearchInputFields: Zoominfo.getIntentSearchInputFields,
		getNewsSearchInputFields: Zoominfo.getNewsSearchInputFields,
		getScoopSearchInputFields: Zoominfo.getScoopSearchInputFields,
	},
} as const;

const zoominfoWebhooksNested = {
	zoominfo: ZoominfoWebhookHandlers,
} as const;

export const zoominfoEndpointSchemas = {
	'zoominfo.searchCompanies': {
		input: ZoominfoEndpointInputSchemas.searchCompanies,
		output: ZoominfoEndpointOutputSchemas.searchCompanies,
	},
	'zoominfo.searchContacts': {
		input: ZoominfoEndpointInputSchemas.searchContacts,
		output: ZoominfoEndpointOutputSchemas.searchContacts,
	},
	'zoominfo.searchIntent': {
		input: ZoominfoEndpointInputSchemas.searchIntent,
		output: ZoominfoEndpointOutputSchemas.searchIntent,
	},
	'zoominfo.searchNews': {
		input: ZoominfoEndpointInputSchemas.searchNews,
		output: ZoominfoEndpointOutputSchemas.searchNews,
	},
	'zoominfo.searchScoops': {
		input: ZoominfoEndpointInputSchemas.searchScoops,
		output: ZoominfoEndpointOutputSchemas.searchScoops,
	},
	'zoominfo.enrichCompany': {
		input: ZoominfoEndpointInputSchemas.enrichCompany,
		output: ZoominfoEndpointOutputSchemas.enrichCompany,
	},
	'zoominfo.enrichContact': {
		input: ZoominfoEndpointInputSchemas.enrichContact,
		output: ZoominfoEndpointOutputSchemas.enrichContact,
	},
	'zoominfo.enrichIntent': {
		input: ZoominfoEndpointInputSchemas.enrichIntent,
		output: ZoominfoEndpointOutputSchemas.enrichIntent,
	},
	'zoominfo.enrichLocation': {
		input: ZoominfoEndpointInputSchemas.enrichLocation,
		output: ZoominfoEndpointOutputSchemas.enrichLocation,
	},
	'zoominfo.enrichNews': {
		input: ZoominfoEndpointInputSchemas.enrichNews,
		output: ZoominfoEndpointOutputSchemas.enrichNews,
	},
	'zoominfo.enrichScoop': {
		input: ZoominfoEndpointInputSchemas.enrichScoop,
		output: ZoominfoEndpointOutputSchemas.enrichScoop,
	},
	'zoominfo.enrichTechnology': {
		input: ZoominfoEndpointInputSchemas.enrichTechnology,
		output: ZoominfoEndpointOutputSchemas.enrichTechnology,
	},
	'zoominfo.getCompanySearchInputFields': {
		input: ZoominfoEndpointInputSchemas.getCompanySearchInputFields,
		output: ZoominfoEndpointOutputSchemas.getCompanySearchInputFields,
	},
	'zoominfo.getContactSearchInputFields': {
		input: ZoominfoEndpointInputSchemas.getContactSearchInputFields,
		output: ZoominfoEndpointOutputSchemas.getContactSearchInputFields,
	},
	'zoominfo.getIntentSearchInputFields': {
		input: ZoominfoEndpointInputSchemas.getIntentSearchInputFields,
		output: ZoominfoEndpointOutputSchemas.getIntentSearchInputFields,
	},
	'zoominfo.getNewsSearchInputFields': {
		input: ZoominfoEndpointInputSchemas.getNewsSearchInputFields,
		output: ZoominfoEndpointOutputSchemas.getNewsSearchInputFields,
	},
	'zoominfo.getScoopSearchInputFields': {
		input: ZoominfoEndpointInputSchemas.getScoopSearchInputFields,
		output: ZoominfoEndpointOutputSchemas.getScoopSearchInputFields,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zoominfoEndpointsNested
>;

const zoominfoWebhookSchemas = {
	'zoominfo.contactUpdate': {
		description: 'A contact you have enriched was updated',
		payload: ContactUpdateEventSchema,
		response: ContactUpdateEventSchema,
	},
	'zoominfo.companyUpdate': {
		description: 'A company you have enriched was updated',
		payload: CompanyUpdateEventSchema,
		response: CompanyUpdateEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof zoominfoWebhooksNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const zoominfoEndpointMeta = {
	'zoominfo.searchCompanies': {
		riskLevel: 'read',
		description: 'Search companies by firmographics, location and technology',
	},
	'zoominfo.searchContacts': {
		riskLevel: 'read',
		description: 'Search contacts by name, title, seniority and company',
	},
	'zoominfo.searchIntent': {
		riskLevel: 'read',
		description: 'Search companies showing buying intent on given topics',
	},
	'zoominfo.searchNews': {
		riskLevel: 'read',
		description: 'Search news articles by category and publish date',
	},
	'zoominfo.searchScoops': {
		riskLevel: 'read',
		description: 'Search Scoops, ZoomInfo research notes about companies',
	},
	'zoominfo.enrichCompany': {
		riskLevel: 'read',
		description: 'Enrich up to 25 companies from partial identifiers',
	},
	'zoominfo.enrichContact': {
		riskLevel: 'read',
		description: 'Enrich up to 25 contacts from partial identifiers',
	},
	'zoominfo.enrichIntent': {
		riskLevel: 'read',
		description: 'Fetch intent signals for one company',
	},
	'zoominfo.enrichLocation': {
		riskLevel: 'read',
		description: 'Fetch every known office location for one company',
	},
	'zoominfo.enrichNews': {
		riskLevel: 'read',
		description: 'Fetch news articles for one company',
	},
	'zoominfo.enrichScoop': {
		riskLevel: 'read',
		description: 'Fetch Scoops for one company',
	},
	'zoominfo.enrichTechnology': {
		riskLevel: 'read',
		description: "Fetch the technologies detected in one company's stack",
	},
	'zoominfo.getCompanySearchInputFields': {
		riskLevel: 'read',
		description: 'List the company search filters this account may use',
	},
	'zoominfo.getContactSearchInputFields': {
		riskLevel: 'read',
		description: 'List the contact search filters this account may use',
	},
	'zoominfo.getIntentSearchInputFields': {
		riskLevel: 'read',
		description: 'List the intent search filters this account may use',
	},
	'zoominfo.getNewsSearchInputFields': {
		riskLevel: 'read',
		description: 'List the news search filters this account may use',
	},
	'zoominfo.getScoopSearchInputFields': {
		riskLevel: 'read',
		description: 'List the scoop search filters this account may use',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zoominfoEndpointsNested>;

export const zoominfoAuthConfig = {
	oauth_2: {
		// ZoomInfo authenticates with a username plus either a password or a PKI
		// private key, none of which map onto client_id/client_secret.
		integration: [
			'zoominfo_username',
			'zoominfo_password',
			'zoominfo_client_id',
			'zoominfo_private_key',
		] as const,
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseZoominfoPlugin<T extends ZoominfoPluginOptions> = CorsairPlugin<
	'zoominfo',
	typeof ZoominfoSchema,
	typeof zoominfoEndpointsNested,
	typeof zoominfoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalZoominfoPlugin = BaseZoominfoPlugin<ZoominfoPluginOptions>;

export type ExternalZoominfoPlugin<T extends ZoominfoPluginOptions> =
	BaseZoominfoPlugin<T>;

export function zoominfo<const T extends ZoominfoPluginOptions>(
	incomingOptions: ZoominfoPluginOptions & T = {} as ZoominfoPluginOptions & T,
): ExternalZoominfoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zoominfo',
		authConfig: zoominfoAuthConfig,
		schema: ZoominfoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zoominfoEndpointsNested,
		webhooks: zoominfoWebhooksNested,
		endpointMeta: zoominfoEndpointMeta,
		endpointSchemas: zoominfoEndpointSchemas,
		webhookSchemas: zoominfoWebhookSchemas,
		pluginWebhookMatcher: (request) =>
			Object.keys(request.headers ?? {}).some(
				(header) => header.toLowerCase() === ZOOMINFO_TOKEN_HEADER,
			),
		pluginTenantWebhookMatcher: matchZoominfoTenantWebhook,
		// ZoomInfo has no OAuth authorization-code flow, so there is no token
		// response to derive a tenant id from. `subscribe` creates the webhook
		// instead and reports back the id every delivery repeats.
		oauthWebhookTenantLinkResolver: undefined,
		subscribe: zoominfoSubscribe,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZoominfoKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const res = await ctx.keys.get_webhook_signature();
				if (!res) throw new AuthMissingError('zoominfo', 'webhook_signature');
				return res;
			}

			if (options.key) return options.key;

			return resolveZoominfoToken(ctx as unknown as ZoominfoAuthContext, {
				baseUrl: options.baseUrl,
			});
		},
	} satisfies InternalZoominfoPlugin;
}

export { selectZoominfoCredentials } from './auth';
export type {
	SearchCompaniesInput,
	SearchCompaniesResponse,
	ZoominfoEndpointInputs,
	ZoominfoEndpointOutputs,
	ZoominfoInputField,
} from './endpoints/types';
export type {
	CompanyUpdateEvent,
	ContactUpdateEvent,
	ZoominfoWebhookOutputs,
} from './webhooks/types';
