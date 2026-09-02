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
import { Asn, Location, Network, Security, Validation } from './endpoints';
import type {
	BigDataCloudEndpointInputs,
	BigDataCloudEndpointOutputs,
} from './endpoints/types';
import {
	BigDataCloudEndpointInputSchemas,
	BigDataCloudEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BigDataCloudSchema } from './schema';

export type BigDataCloudPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBigDataCloudPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bigdatacloudEndpointsNested>;
};

export type BigDataCloudContext = CorsairPluginContext<
	typeof BigDataCloudSchema,
	BigDataCloudPluginOptions
>;

export type BigDataCloudKeyBuilderContext =
	KeyBuilderContext<BigDataCloudPluginOptions>;

export type BigDataCloudBoundEndpoints = BindEndpoints<
	typeof bigdatacloudEndpointsNested
>;

type BigDataCloudEndpoint<K extends keyof BigDataCloudEndpointOutputs> =
	CorsairEndpoint<
		BigDataCloudContext,
		BigDataCloudEndpointInputs[K],
		BigDataCloudEndpointOutputs[K]
	>;

export type BigDataCloudEndpoints = {
	// ASN Operations
	asnExtendedReceivingFromInfo: BigDataCloudEndpoint<'asnExtendedReceivingFromInfo'>;
	asnExtendedTransitToInfo: BigDataCloudEndpoint<'asnExtendedTransitToInfo'>;
	asnRankList: BigDataCloudEndpoint<'asnRankList'>;
	bgpActivePrefixes: BigDataCloudEndpoint<'bgpActivePrefixes'>;

	// Network Operations
	networkByIpAddress: BigDataCloudEndpoint<'networkByIpAddress'>;
	networksByCidr: BigDataCloudEndpoint<'networksByCidr'>;

	// Location Operations
	countryInfo: BigDataCloudEndpoint<'countryInfo'>;
	countryByIpAddress: BigDataCloudEndpoint<'countryByIpAddress'>;
	reverseGeocodingWithTimezone: BigDataCloudEndpoint<'reverseGeocodingWithTimezone'>;
	timeZoneByIpAddress: BigDataCloudEndpoint<'timeZoneByIpAddress'>;
	amIRoaming: BigDataCloudEndpoint<'amIRoaming'>;

	// Security Operations
	hazardReport: BigDataCloudEndpoint<'hazardReport'>;
	torExitNodesGeolocated: BigDataCloudEndpoint<'torExitNodesGeolocated'>;
	userRisk: BigDataCloudEndpoint<'userRisk'>;

	// Validation Operations
	emailAddressVerification: BigDataCloudEndpoint<'emailAddressVerification'>;
	phoneNumberValidationByIp: BigDataCloudEndpoint<'phoneNumberValidationByIp'>;
	userAgentParser: BigDataCloudEndpoint<'userAgentParser'>;
};

const bigdatacloudEndpointsNested = {
	asn: {
		asnExtendedReceivingFromInfo: Asn.asnExtendedReceivingFromInfo,
		asnExtendedTransitToInfo: Asn.asnExtendedTransitToInfo,
		asnRankList: Asn.asnRankList,
		bgpActivePrefixes: Asn.bgpActivePrefixes,
	},
	network: {
		networkByIpAddress: Network.networkByIpAddress,
		networksByCidr: Network.networksByCidr,
	},
	location: {
		countryInfo: Location.countryInfo,
		countryByIpAddress: Location.countryByIpAddress,
		reverseGeocodingWithTimezone: Location.reverseGeocodingWithTimezone,
		timeZoneByIpAddress: Location.timeZoneByIpAddress,
		amIRoaming: Location.amIRoaming,
	},
	security: {
		hazardReport: Security.hazardReport,
		torExitNodesGeolocated: Security.torExitNodesGeolocated,
		userRisk: Security.userRisk,
	},
	validation: {
		emailAddressVerification: Validation.emailAddressVerification,
		phoneNumberValidationByIp: Validation.phoneNumberValidationByIp,
		userAgentParser: Validation.userAgentParser,
	},
} as const;

export const bigdatacloudEndpointSchemas = {
	'asn.asnExtendedReceivingFromInfo': {
		input: BigDataCloudEndpointInputSchemas.asnExtendedReceivingFromInfo,
		output: BigDataCloudEndpointOutputSchemas.asnExtendedReceivingFromInfo,
	},
	'asn.asnExtendedTransitToInfo': {
		input: BigDataCloudEndpointInputSchemas.asnExtendedTransitToInfo,
		output: BigDataCloudEndpointOutputSchemas.asnExtendedTransitToInfo,
	},
	'asn.asnRankList': {
		input: BigDataCloudEndpointInputSchemas.asnRankList,
		output: BigDataCloudEndpointOutputSchemas.asnRankList,
	},
	'asn.bgpActivePrefixes': {
		input: BigDataCloudEndpointInputSchemas.bgpActivePrefixes,
		output: BigDataCloudEndpointOutputSchemas.bgpActivePrefixes,
	},
	'network.networkByIpAddress': {
		input: BigDataCloudEndpointInputSchemas.networkByIpAddress,
		output: BigDataCloudEndpointOutputSchemas.networkByIpAddress,
	},
	'network.networksByCidr': {
		input: BigDataCloudEndpointInputSchemas.networksByCidr,
		output: BigDataCloudEndpointOutputSchemas.networksByCidr,
	},
	'location.countryInfo': {
		input: BigDataCloudEndpointInputSchemas.countryInfo,
		output: BigDataCloudEndpointOutputSchemas.countryInfo,
	},
	'location.countryByIpAddress': {
		input: BigDataCloudEndpointInputSchemas.countryByIpAddress,
		output: BigDataCloudEndpointOutputSchemas.countryByIpAddress,
	},
	'location.reverseGeocodingWithTimezone': {
		input: BigDataCloudEndpointInputSchemas.reverseGeocodingWithTimezone,
		output: BigDataCloudEndpointOutputSchemas.reverseGeocodingWithTimezone,
	},
	'location.timeZoneByIpAddress': {
		input: BigDataCloudEndpointInputSchemas.timeZoneByIpAddress,
		output: BigDataCloudEndpointOutputSchemas.timeZoneByIpAddress,
	},
	'location.amIRoaming': {
		input: BigDataCloudEndpointInputSchemas.amIRoaming,
		output: BigDataCloudEndpointOutputSchemas.amIRoaming,
	},
	'security.hazardReport': {
		input: BigDataCloudEndpointInputSchemas.hazardReport,
		output: BigDataCloudEndpointOutputSchemas.hazardReport,
	},
	'security.torExitNodesGeolocated': {
		input: BigDataCloudEndpointInputSchemas.torExitNodesGeolocated,
		output: BigDataCloudEndpointOutputSchemas.torExitNodesGeolocated,
	},
	'security.userRisk': {
		input: BigDataCloudEndpointInputSchemas.userRisk,
		output: BigDataCloudEndpointOutputSchemas.userRisk,
	},
	'validation.emailAddressVerification': {
		input: BigDataCloudEndpointInputSchemas.emailAddressVerification,
		output: BigDataCloudEndpointOutputSchemas.emailAddressVerification,
	},
	'validation.phoneNumberValidationByIp': {
		input: BigDataCloudEndpointInputSchemas.phoneNumberValidationByIp,
		output: BigDataCloudEndpointOutputSchemas.phoneNumberValidationByIp,
	},
	'validation.userAgentParser': {
		input: BigDataCloudEndpointInputSchemas.userAgentParser,
		output: BigDataCloudEndpointOutputSchemas.userAgentParser,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bigdatacloudEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bigdatacloudEndpointMeta = {
	'asn.asnExtendedReceivingFromInfo': {
		riskLevel: 'read',
		description:
			'Tool to return upstream providers (receivingFrom) for a given ASN. Use when you need a paginated list of ASes feeding traffic for the specified ASN.',
	},
	'asn.asnExtendedTransitToInfo': {
		riskLevel: 'read',
		description:
			'Tool to return downstream customers (transitTo) for a given ASN. Use when you need a paginated list of ASes receiving traffic from a specific ASN.',
	},
	'asn.asnRankList': {
		riskLevel: 'read',
		description:
			'Retrieves a ranked list of Autonomous Systems (ASNs) sorted by IPv4 address announcement volumes. Use cases: - Find the largest ASNs by IP address count (DoD, Amazon, Microsoft, etc.) - Look up ASN rankings for network analysis - Paginate through the global ASN database (79,000+ entries) - Sort ASNs by various criteria (rank, name, organisation, country) Returns paginated results with total count for navigation.',
	},
	'asn.bgpActivePrefixes': {
		riskLevel: 'read',
		description:
			'Tool to retrieve IPv4 or IPv6 prefixes currently announced on BGP. Use when inspecting BGP routing announcements for a given ASN.',
	},
	'network.networkByIpAddress': {
		riskLevel: 'read',
		description:
			'Tool to retrieve registry, ASN, and BGP details for a given IP address’s network. Use when you need detailed network information (e.g., ASNs, prefixes) after confirming the target IP.',
	},
	'network.networksByCidr': {
		riskLevel: 'read',
		description:
			'Tool to retrieve BGP-announced networks within a specified CIDR range. Use when you need to analyze network announcements within a particular CIDR after confirming the range format.',
	},
	'location.countryInfo': {
		riskLevel: 'read',
		description:
			'Tool to fetch detailed country information by ISO code. Use when you need localized names, currencies, regions, and other metadata for a country.',
	},
	'location.countryByIpAddress': {
		riskLevel: 'read',
		description:
			'Tool to geolocate an IP address and retrieve country details and demographics. Use when you need country-level data after obtaining the target IP address.',
	},
	'location.reverseGeocodingWithTimezone': {
		riskLevel: 'read',
		description:
			'Tool to return reverse geocoding and time zone info for given coordinates. Use when you need both locality details and timezone data in one call.',
	},
	'location.timeZoneByIpAddress': {
		riskLevel: 'read',
		description:
			'Tool to retrieve time zone information for a given IP address. Use when you need DST status, UTC offsets, and local/UTC time for a specific IP.',
	},
	'location.amIRoaming': {
		riskLevel: 'read',
		description:
			'Tool to determine if the user is roaming based on their IP address and GPS coordinates. Use after obtaining device location to verify roaming status before mobile actions.',
	},
	'security.hazardReport': {
		riskLevel: 'read',
		description:
			"Tool to fetch a cybersecurity hazard report for a specified IP address. Use when assessing an IP's threat profile (VPN, proxy, blacklists, hosting risk).",
	},
	'security.torExitNodesGeolocated': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of active TOR exit node IP addresses with geolocation and carrier (ASN) details. Use this tool to: - Get a list of known TOR exit node IPs to detect/block anonymous traffic - Analyze geographic distribution of TOR exit nodes by country - Look up carrier/ASN information for TOR nodes - Build IP blocklists or allowlists for TOR traffic Returns nodes with IP address, country info (when available), and detailed carrier/ASN data including BGP prefix counts and global ranking.',
	},
	'security.userRisk': {
		riskLevel: 'read',
		description:
			'Tool to return a risk assessment for a user based on IP signals for fraud prevention. Use after initial IP checks to decide whether to bypass or require captcha challenges.',
	},
	'validation.emailAddressVerification': {
		riskLevel: 'read',
		description:
			'Tool to verify email addresses for syntax, domain validity, and disposability. Use after obtaining the email input.',
	},
	'validation.phoneNumberValidationByIp': {
		riskLevel: 'read',
		description:
			'Tool to validate phone numbers by inferring country from client IP. Use when you want to validate a number without specifying country.',
	},
	'validation.userAgentParser': {
		riskLevel: 'read',
		description:
			'Tool to parse a User-Agent string into device, OS, browser, and bot details. Use when you have a raw User-Agent header and need structured client info.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof bigdatacloudEndpointsNested
>;

export const bigdatacloudAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBigDataCloudPlugin<T extends BigDataCloudPluginOptions> =
	CorsairPlugin<
		'bigdatacloud',
		typeof BigDataCloudSchema,
		typeof bigdatacloudEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalBigDataCloudPlugin =
	BaseBigDataCloudPlugin<BigDataCloudPluginOptions>;

export type ExternalBigDataCloudPlugin<T extends BigDataCloudPluginOptions> =
	BaseBigDataCloudPlugin<T>;

export function bigdatacloud<const T extends BigDataCloudPluginOptions>(
	incomingOptions: BigDataCloudPluginOptions &
		T = {} as BigDataCloudPluginOptions & T,
): ExternalBigDataCloudPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bigdatacloud',
		authConfig: bigdatacloudAuthConfig,
		schema: BigDataCloudSchema,
		options: options,
		hooks: options.hooks,
		endpoints: bigdatacloudEndpointsNested,
		webhooks: {},
		endpointMeta: bigdatacloudEndpointMeta,
		endpointSchemas: bigdatacloudEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BigDataCloudKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBigDataCloudPlugin;
}

export * from './client';
export * from './endpoints/types';
export * from './schema';
