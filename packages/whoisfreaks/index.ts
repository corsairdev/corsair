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
import {
	AsnWhois,
	Availability,
	BulkWhois,
	Dns,
	DomainReputation,
	Geolocation,
	IpReputation,
	IpWhois,
	Ssl,
	Subdomains,
	Typosquatting,
	WhoisHistory,
	WhoisLive,
	WhoisReverse,
} from './endpoints';
import type {
	WhoisfreaksEndpointInputs,
	WhoisfreaksEndpointOutputs,
} from './endpoints/types';
import {
	WhoisfreaksEndpointInputSchemas,
	WhoisfreaksEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WhoisfreaksSchema } from './schema';

export type WhoisfreaksPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWhoisfreaksPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof whoisfreaksEndpointsNested>;
};

export type WhoisfreaksContext = CorsairPluginContext<
	typeof WhoisfreaksSchema,
	WhoisfreaksPluginOptions
>;

export type WhoisfreaksKeyBuilderContext =
	KeyBuilderContext<WhoisfreaksPluginOptions>;

export type WhoisfreaksBoundEndpoints = BindEndpoints<
	typeof whoisfreaksEndpointsNested
>;

type WhoisfreaksEndpoint<K extends keyof WhoisfreaksEndpointOutputs> =
	CorsairEndpoint<
		WhoisfreaksContext,
		WhoisfreaksEndpointInputs[K],
		WhoisfreaksEndpointOutputs[K]
	>;

export type WhoisfreaksEndpoints = {
	whoisLiveLookupV2: WhoisfreaksEndpoint<'whoisLiveLookupV2'>;
	whoisHistoryLookup: WhoisfreaksEndpoint<'whoisHistoryLookup'>;
	whoisReverseLookup: WhoisfreaksEndpoint<'whoisReverseLookup'>;
	bulkWhoisLookup: WhoisfreaksEndpoint<'bulkWhoisLookup'>;
	dnsLiveLookup: WhoisfreaksEndpoint<'dnsLiveLookup'>;
	dnsHistoricalLookup: WhoisfreaksEndpoint<'dnsHistoricalLookup'>;
	dnsReverseLookup: WhoisfreaksEndpoint<'dnsReverseLookup'>;
	dnsBulkLookup: WhoisfreaksEndpoint<'dnsBulkLookup'>;
	domainAvailabilityCheck: WhoisfreaksEndpoint<'domainAvailabilityCheck'>;
	bulkDomainAvailabilityCheck: WhoisfreaksEndpoint<'bulkDomainAvailabilityCheck'>;
	typosquattingLookup: WhoisfreaksEndpoint<'typosquattingLookup'>;
	sslLookup: WhoisfreaksEndpoint<'sslLookup'>;
	geolocationLookup: WhoisfreaksEndpoint<'geolocationLookup'>;
	bulkGeolocationLookup: WhoisfreaksEndpoint<'bulkGeolocationLookup'>;
	subdomainsLookup: WhoisfreaksEndpoint<'subdomainsLookup'>;
	ipReputationLookup: WhoisfreaksEndpoint<'ipReputationLookup'>;
	bulkIpReputationLookup: WhoisfreaksEndpoint<'bulkIpReputationLookup'>;
	domainReputationLookup: WhoisfreaksEndpoint<'domainReputationLookup'>;
	asnWhoisLookup: WhoisfreaksEndpoint<'asnWhoisLookup'>;
	ipWhoisLookup: WhoisfreaksEndpoint<'ipWhoisLookup'>;
};

const whoisfreaksEndpointsNested = {
	whoisLive: {
		lookupV2: WhoisLive.lookupV2,
	},
	whoisHistory: {
		lookup: WhoisHistory.lookup,
	},
	whoisReverse: {
		lookup: WhoisReverse.lookup,
	},
	bulkWhois: {
		lookup: BulkWhois.lookup,
	},
	dns: {
		live: Dns.live,
		historical: Dns.historical,
		reverse: Dns.reverse,
		bulk: Dns.bulk,
	},
	availability: {
		check: Availability.check,
		bulkCheck: Availability.bulkCheck,
	},
	typosquatting: {
		lookup: Typosquatting.lookup,
	},
	ssl: {
		lookup: Ssl.lookup,
	},
	geolocation: {
		lookup: Geolocation.lookup,
		bulkLookup: Geolocation.bulkLookup,
	},
	subdomains: {
		lookup: Subdomains.lookup,
	},
	ipReputation: {
		lookup: IpReputation.lookup,
		bulkLookup: IpReputation.bulkLookup,
	},
	domainReputation: {
		lookup: DomainReputation.lookup,
	},
	asnWhois: {
		lookup: AsnWhois.lookup,
	},
	ipWhois: {
		lookup: IpWhois.lookup,
	},
} as const;

/**
 * WhoisFreaks currently has no webhook/trigger operations. It is a
 * request/response lookup API; monitoring products deliver results via
 * dashboard and email, not inbound webhooks.
 * See https://whoisfreaks.com/documentation.
 */
const whoisfreaksWebhooksNested = {} as const;

export const whoisfreaksEndpointSchemas = {
	'whoisLive.lookupV2': {
		input: WhoisfreaksEndpointInputSchemas.whoisLiveLookupV2,
		output: WhoisfreaksEndpointOutputSchemas.whoisLiveLookupV2,
	},
	'whoisHistory.lookup': {
		input: WhoisfreaksEndpointInputSchemas.whoisHistoryLookup,
		output: WhoisfreaksEndpointOutputSchemas.whoisHistoryLookup,
	},
	'whoisReverse.lookup': {
		input: WhoisfreaksEndpointInputSchemas.whoisReverseLookup,
		output: WhoisfreaksEndpointOutputSchemas.whoisReverseLookup,
	},
	'bulkWhois.lookup': {
		input: WhoisfreaksEndpointInputSchemas.bulkWhoisLookup,
		output: WhoisfreaksEndpointOutputSchemas.bulkWhoisLookup,
	},
	'dns.live': {
		input: WhoisfreaksEndpointInputSchemas.dnsLiveLookup,
		output: WhoisfreaksEndpointOutputSchemas.dnsLiveLookup,
	},
	'dns.historical': {
		input: WhoisfreaksEndpointInputSchemas.dnsHistoricalLookup,
		output: WhoisfreaksEndpointOutputSchemas.dnsHistoricalLookup,
	},
	'dns.reverse': {
		input: WhoisfreaksEndpointInputSchemas.dnsReverseLookup,
		output: WhoisfreaksEndpointOutputSchemas.dnsReverseLookup,
	},
	'dns.bulk': {
		input: WhoisfreaksEndpointInputSchemas.dnsBulkLookup,
		output: WhoisfreaksEndpointOutputSchemas.dnsBulkLookup,
	},
	'availability.check': {
		input: WhoisfreaksEndpointInputSchemas.domainAvailabilityCheck,
		output: WhoisfreaksEndpointOutputSchemas.domainAvailabilityCheck,
	},
	'availability.bulkCheck': {
		input: WhoisfreaksEndpointInputSchemas.bulkDomainAvailabilityCheck,
		output: WhoisfreaksEndpointOutputSchemas.bulkDomainAvailabilityCheck,
	},
	'typosquatting.lookup': {
		input: WhoisfreaksEndpointInputSchemas.typosquattingLookup,
		output: WhoisfreaksEndpointOutputSchemas.typosquattingLookup,
	},
	'ssl.lookup': {
		input: WhoisfreaksEndpointInputSchemas.sslLookup,
		output: WhoisfreaksEndpointOutputSchemas.sslLookup,
	},
	'geolocation.lookup': {
		input: WhoisfreaksEndpointInputSchemas.geolocationLookup,
		output: WhoisfreaksEndpointOutputSchemas.geolocationLookup,
	},
	'geolocation.bulkLookup': {
		input: WhoisfreaksEndpointInputSchemas.bulkGeolocationLookup,
		output: WhoisfreaksEndpointOutputSchemas.bulkGeolocationLookup,
	},
	'subdomains.lookup': {
		input: WhoisfreaksEndpointInputSchemas.subdomainsLookup,
		output: WhoisfreaksEndpointOutputSchemas.subdomainsLookup,
	},
	'ipReputation.lookup': {
		input: WhoisfreaksEndpointInputSchemas.ipReputationLookup,
		output: WhoisfreaksEndpointOutputSchemas.ipReputationLookup,
	},
	'ipReputation.bulkLookup': {
		input: WhoisfreaksEndpointInputSchemas.bulkIpReputationLookup,
		output: WhoisfreaksEndpointOutputSchemas.bulkIpReputationLookup,
	},
	'domainReputation.lookup': {
		input: WhoisfreaksEndpointInputSchemas.domainReputationLookup,
		output: WhoisfreaksEndpointOutputSchemas.domainReputationLookup,
	},
	'asnWhois.lookup': {
		input: WhoisfreaksEndpointInputSchemas.asnWhoisLookup,
		output: WhoisfreaksEndpointOutputSchemas.asnWhoisLookup,
	},
	'ipWhois.lookup': {
		input: WhoisfreaksEndpointInputSchemas.ipWhoisLookup,
		output: WhoisfreaksEndpointOutputSchemas.ipWhoisLookup,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof whoisfreaksEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const whoisfreaksEndpointMeta = {
	'whoisLive.lookupV2': {
		riskLevel: 'read',
		description: 'Fetch real-time WHOIS information for a domain',
	},
	'whoisHistory.lookup': {
		riskLevel: 'read',
		description: 'Fetch historical WHOIS records for a domain',
	},
	'whoisReverse.lookup': {
		riskLevel: 'read',
		description: 'Search WHOIS records by keyword across domains',
	},
	'bulkWhois.lookup': {
		riskLevel: 'read',
		description: 'Fetch WHOIS records for up to 100 domains at once',
	},
	'dns.live': {
		riskLevel: 'read',
		description: 'Fetch live DNS records for a domain or IP',
	},
	'dns.historical': {
		riskLevel: 'read',
		description: 'Fetch historical DNS records for a domain',
	},
	'dns.reverse': {
		riskLevel: 'read',
		description: 'Find domains pointing at an IP or record value',
	},
	'dns.bulk': {
		riskLevel: 'read',
		description: 'Fetch DNS records for up to 100 domains and IPs at once',
	},
	'availability.check': {
		riskLevel: 'read',
		description: 'Check whether a domain is available for registration',
	},
	'availability.bulkCheck': {
		riskLevel: 'read',
		description: 'Check availability for up to 100 domains or TLDs at once',
	},
	'typosquatting.lookup': {
		riskLevel: 'read',
		description: 'Find typo-squat domain variants of a brand keyword',
	},
	'ssl.lookup': {
		riskLevel: 'read',
		description: 'Fetch the live SSL certificate for a domain',
	},
	'geolocation.lookup': {
		riskLevel: 'read',
		description: 'Look up geolocation data for an IP address',
	},
	'geolocation.bulkLookup': {
		riskLevel: 'read',
		description: 'Look up geolocation data for up to 100 IPs at once',
	},
	'subdomains.lookup': {
		riskLevel: 'read',
		description: 'Enumerate subdomains of a domain',
	},
	'ipReputation.lookup': {
		riskLevel: 'read',
		description: 'Fetch threat reputation for an IP address',
	},
	'ipReputation.bulkLookup': {
		riskLevel: 'read',
		description: 'Fetch threat reputation for up to 100 IPs at once',
	},
	'domainReputation.lookup': {
		riskLevel: 'read',
		description: 'Assess threat reputation and trust score of a domain',
	},
	'asnWhois.lookup': {
		riskLevel: 'read',
		description: 'Fetch WHOIS data for an autonomous system number',
	},
	'ipWhois.lookup': {
		riskLevel: 'read',
		description: 'Fetch WHOIS data for an IP address',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof whoisfreaksEndpointsNested
>;

export const whoisfreaksAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWhoisfreaksPlugin<T extends WhoisfreaksPluginOptions> =
	CorsairPlugin<
		'whoisfreaks',
		typeof WhoisfreaksSchema,
		typeof whoisfreaksEndpointsNested,
		typeof whoisfreaksWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalWhoisfreaksPlugin =
	BaseWhoisfreaksPlugin<WhoisfreaksPluginOptions>;

export type ExternalWhoisfreaksPlugin<T extends WhoisfreaksPluginOptions> =
	BaseWhoisfreaksPlugin<T>;

export function whoisfreaks<const T extends WhoisfreaksPluginOptions>(
	incomingOptions: WhoisfreaksPluginOptions &
		T = {} as WhoisfreaksPluginOptions & T,
): ExternalWhoisfreaksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'whoisfreaks',
		authConfig: whoisfreaksAuthConfig,
		schema: WhoisfreaksSchema,
		options,
		hooks: options.hooks,
		endpoints: whoisfreaksEndpointsNested,
		webhooks: whoisfreaksWebhooksNested,
		endpointMeta: whoisfreaksEndpointMeta,
		endpointSchemas: whoisfreaksEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WhoisfreaksKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalWhoisfreaksPlugin;
}

export type {
	WhoisfreaksEndpointInputs,
	WhoisfreaksEndpointOutputs,
	WhoisLiveLookupV2Input,
	WhoisLiveLookupV2Response,
} from './endpoints/types';
