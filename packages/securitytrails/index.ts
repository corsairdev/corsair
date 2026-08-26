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
	Account,
	Company,
	Domain,
	Ips,
	Projects,
	Scroll,
	Sql,
} from './endpoints';
import type {
	SecuritytrailsEndpointInputs,
	SecuritytrailsEndpointOutputs,
} from './endpoints/types';
import {
	SecuritytrailsEndpointInputSchemas,
	SecuritytrailsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SecuritytrailsSchema } from './schema';

export type SecuritytrailsPluginOptions = {
	// SecurityTrails issues API keys only — there is no OAuth flow.
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSecuritytrailsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof securitytrailsEndpointsNested>;
};

export type SecuritytrailsContext = CorsairPluginContext<
	typeof SecuritytrailsSchema,
	SecuritytrailsPluginOptions
>;

export type SecuritytrailsKeyBuilderContext =
	KeyBuilderContext<SecuritytrailsPluginOptions>;

export type SecuritytrailsBoundEndpoints = BindEndpoints<
	typeof securitytrailsEndpointsNested
>;

type SecuritytrailsEndpoint<K extends keyof SecuritytrailsEndpointOutputs> =
	CorsairEndpoint<
		SecuritytrailsContext,
		SecuritytrailsEndpointInputs[K],
		SecuritytrailsEndpointOutputs[K]
	>;

export type SecuritytrailsEndpoints = {
	ping: SecuritytrailsEndpoint<'ping'>;
	accountUsage: SecuritytrailsEndpoint<'accountUsage'>;
	domainGet: SecuritytrailsEndpoint<'domainGet'>;
	domainSsl: SecuritytrailsEndpoint<'domainSsl'>;
	ipsSearch: SecuritytrailsEndpoint<'ipsSearch'>;
	ipsStats: SecuritytrailsEndpoint<'ipsStats'>;
	scrollGet: SecuritytrailsEndpoint<'scrollGet'>;
	sqlQuery: SecuritytrailsEndpoint<'sqlQuery'>;
	sqlScroll: SecuritytrailsEndpoint<'sqlScroll'>;
	companyAssociatedIps: SecuritytrailsEndpoint<'companyAssociatedIps'>;
	projectsList: SecuritytrailsEndpoint<'projectsList'>;
	projectsBulkStaticAssetRules: SecuritytrailsEndpoint<'projectsBulkStaticAssetRules'>;
};

const securitytrailsEndpointsNested = {
	account: {
		ping: Account.ping,
		usage: Account.usage,
	},
	domain: {
		get: Domain.get,
		ssl: Domain.ssl,
	},
	ips: {
		search: Ips.search,
		stats: Ips.stats,
	},
	scroll: {
		get: Scroll.get,
	},
	sql: {
		query: Sql.query,
		scroll: Sql.scroll,
	},
	company: {
		associatedIps: Company.associatedIps,
	},
	projects: {
		list: Projects.list,
		bulkStaticAssetRules: Projects.bulkStaticAssetRules,
	},
} as const;

const securitytrailsWebhooksNested = {} as const;

export const securitytrailsEndpointSchemas = {
	'account.ping': {
		input: SecuritytrailsEndpointInputSchemas.ping,
		output: SecuritytrailsEndpointOutputSchemas.ping,
	},
	'account.usage': {
		input: SecuritytrailsEndpointInputSchemas.accountUsage,
		output: SecuritytrailsEndpointOutputSchemas.accountUsage,
	},
	'domain.get': {
		input: SecuritytrailsEndpointInputSchemas.domainGet,
		output: SecuritytrailsEndpointOutputSchemas.domainGet,
	},
	'domain.ssl': {
		input: SecuritytrailsEndpointInputSchemas.domainSsl,
		output: SecuritytrailsEndpointOutputSchemas.domainSsl,
	},
	'ips.search': {
		input: SecuritytrailsEndpointInputSchemas.ipsSearch,
		output: SecuritytrailsEndpointOutputSchemas.ipsSearch,
	},
	'ips.stats': {
		input: SecuritytrailsEndpointInputSchemas.ipsStats,
		output: SecuritytrailsEndpointOutputSchemas.ipsStats,
	},
	'scroll.get': {
		input: SecuritytrailsEndpointInputSchemas.scrollGet,
		output: SecuritytrailsEndpointOutputSchemas.scrollGet,
	},
	'sql.query': {
		input: SecuritytrailsEndpointInputSchemas.sqlQuery,
		output: SecuritytrailsEndpointOutputSchemas.sqlQuery,
	},
	'sql.scroll': {
		input: SecuritytrailsEndpointInputSchemas.sqlScroll,
		output: SecuritytrailsEndpointOutputSchemas.sqlScroll,
	},
	'company.associatedIps': {
		input: SecuritytrailsEndpointInputSchemas.companyAssociatedIps,
		output: SecuritytrailsEndpointOutputSchemas.companyAssociatedIps,
	},
	'projects.list': {
		input: SecuritytrailsEndpointInputSchemas.projectsList,
		output: SecuritytrailsEndpointOutputSchemas.projectsList,
	},
	'projects.bulkStaticAssetRules': {
		input: SecuritytrailsEndpointInputSchemas.projectsBulkStaticAssetRules,
		output: SecuritytrailsEndpointOutputSchemas.projectsBulkStaticAssetRules,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof securitytrailsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const securitytrailsEndpointMeta = {
	'account.ping': {
		riskLevel: 'read',
		description:
			'Verify the configured SecurityTrails API key is accepted and the API is reachable.',
	},
	'account.usage': {
		riskLevel: 'read',
		description:
			'Return the current and allowed monthly API usage for the account.',
	},
	'domain.get': {
		riskLevel: 'read',
		description:
			'Get current DNS records (A, AAAA, MX, NS, SOA, TXT) and co-occurrence statistics for a hostname.',
	},
	'domain.ssl': {
		riskLevel: 'read',
		description:
			'List current and historical SSL/TLS certificates for a hostname, optionally including subdomains. Paginated.',
	},
	'ips.search': {
		riskLevel: 'read',
		description:
			'Search the IP dataset with a DSL query, returning matching addresses, PTR records and open ports. Paginated.',
	},
	'ips.stats': {
		riskLevel: 'read',
		description:
			'Return aggregate open-port and PTR-pattern statistics for a DSL query over the IP dataset.',
	},
	'scroll.get': {
		riskLevel: 'read',
		description:
			'Fetch the next page of a DSL search using a scroll cursor from a previous response.',
	},
	'sql.query': {
		riskLevel: 'read',
		description:
			'Run a SQL-like query against the hosts or ips tables. Returns up to 100 records plus a scroll cursor.',
	},
	'sql.scroll': {
		riskLevel: 'read',
		description:
			'Fetch the next 100 records for an open SQL API scroll cursor.',
	},
	'company.associatedIps': {
		riskLevel: 'read',
		description:
			'List the CIDR blocks associated with a company domain. Paginated.',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List the Attack Surface Intelligence projects the API key can access.',
	},
	'projects.bulkStaticAssetRules': {
		riskLevel: 'write',
		description:
			"Add or remove static asset rules for an ASI project, changing which assets are in the project's monitoring scope. Up to 1000 rules per request.",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof securitytrailsEndpointsNested
>;

export const securitytrailsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSecuritytrailsPlugin<T extends SecuritytrailsPluginOptions> =
	CorsairPlugin<
		'securitytrails',
		typeof SecuritytrailsSchema,
		typeof securitytrailsEndpointsNested,
		typeof securitytrailsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalSecuritytrailsPlugin =
	BaseSecuritytrailsPlugin<SecuritytrailsPluginOptions>;

export type ExternalSecuritytrailsPlugin<
	T extends SecuritytrailsPluginOptions,
> = BaseSecuritytrailsPlugin<T>;

export function securitytrails<const T extends SecuritytrailsPluginOptions>(
	incomingOptions: SecuritytrailsPluginOptions &
		T = {} as SecuritytrailsPluginOptions & T,
): ExternalSecuritytrailsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'securitytrails',
		authConfig: securitytrailsAuthConfig,
		schema: SecuritytrailsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: securitytrailsEndpointsNested,
		endpointMeta: securitytrailsEndpointMeta,
		endpointSchemas: securitytrailsEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SecuritytrailsKeyBuilderContext, source) => {
			// Fail closed. Returning an empty string here would send an empty
			// `APIKEY` header, which SecurityTrails answers with a generic 401
			// instead of Corsair surfacing its disconnected-auth flow.
			if (source !== 'endpoint') {
				throw new AuthMissingError('securitytrails', 'api_key');
			}

			if (options.key) return options.key;

			const res = await ctx.keys?.get_api_key();
			if (!res) {
				throw new AuthMissingError('securitytrails', 'api_key');
			}

			return res;
		},
	} satisfies InternalSecuritytrailsPlugin;
}

export type {
	AccountUsageInput,
	AccountUsageResponse,
	BulkStaticAssetRulesInput,
	BulkStaticAssetRulesResponse,
	CompanyAssociatedIpsInput,
	CompanyAssociatedIpsResponse,
	DomainGetInput,
	DomainGetResponse,
	DomainSslInput,
	DomainSslResponse,
	IpsSearchInput,
	IpsSearchResponse,
	IpsStatsInput,
	IpsStatsResponse,
	PingInput,
	PingResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ScrollGetInput,
	ScrollGetResponse,
	SecuritytrailsEndpointInputs,
	SecuritytrailsEndpointOutputs,
	SqlQueryInput,
	SqlQueryResponse,
	SqlScrollInput,
	StaticAssetRule,
} from './endpoints/types';
