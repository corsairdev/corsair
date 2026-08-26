import { z } from 'zod';

/**
 * BigDataCloud Country information entity.
 * Represents metadata for a sovereign nation or dependent territory.
 */
export const BigDataCloudCountry = z.object({
	/** ISO 3166-1 alpha-2 code (e.g. 'US', 'AU', 'GB') */
	id: z.string(),
	isoAlpha2: z.string(),
	isoAlpha3: z.string().optional(),
	m49Code: z.number().optional(),
	name: z.string(),
	isoName: z.string().optional(),
	isoNameFull: z.string().optional(),
	isoAdminLanguages: z
		.array(
			z.object({
				isoAlpha3: z.string().optional(),
				isoAlpha2: z.string().optional(),
				isoName: z.string().optional(),
				nativeName: z.string().optional(),
			}),
		)
		.optional(),
	unRegion: z.string().optional(),
	currency: z
		.object({
			numericCode: z.number().optional(),
			code: z.string().optional(),
			name: z.string().optional(),
			minorUnits: z.number().optional(),
		})
		.optional(),
	wbRegion: z
		.object({
			id: z.string().optional(),
			iso2Code: z.string().optional(),
			value: z.string().optional(),
		})
		.optional(),
	wbIncomeLevel: z
		.object({
			id: z.string().optional(),
			iso2Code: z.string().optional(),
			value: z.string().optional(),
		})
		.optional(),
	callingCode: z.string().optional(),
	countryFlagEmoji: z.string().optional(),
	wikidataId: z.string().optional(),
	geonameId: z.number().optional(),
	isIndependent: z.boolean().optional(),
});
export type BigDataCloudCountry = z.infer<typeof BigDataCloudCountry>;

/**
 * BigDataCloud Autonomous System (ASN) entity.
 */
export const BigDataCloudAsn = z.object({
	/** ASN string (e.g. 'AS13335') */
	id: z.string(),
	asn: z.string(),
	asnNumeric: z.number(),
	name: z.string().optional(),
	organisation: z.string().optional(),
	registry: z.string().optional(),
	registeredCountry: z.string().optional(),
	registeredCountryName: z.string().optional(),
	registrationDate: z.string().optional(),
	registrationLastChange: z.string().optional(),
	totalIpv4Addresses: z.number().optional(),
	totalIpv4Prefixes: z.number().optional(),
	totalIpv4BogonPrefixes: z.number().optional(),
	totalIpv6Prefixes: z.number().optional(),
	totalIpv6BogonPrefixes: z.number().optional(),
	rank: z.number().optional(),
	rankText: z.string().optional(),
});
export type BigDataCloudAsn = z.infer<typeof BigDataCloudAsn>;

/**
 * BigDataCloud Network information entity.
 */
export const BigDataCloudNetwork = z.object({
	/** IP address or CIDR string */
	id: z.string(),
	ip: z.string().optional(),
	cidr: z.string().optional(),
	registry: z.string().optional(),
	registryStatus: z.string().optional(),
	registeredCountry: z.string().optional(),
	registeredCountryName: z.string().optional(),
	organisation: z.string().optional(),
	isReachableGlobally: z.boolean().optional(),
	isBogon: z.boolean().optional(),
	bgpPrefix: z.string().optional(),
	bgpPrefixNetworkAddress: z.string().optional(),
	bgpPrefixLastAddress: z.string().optional(),
	totalAddresses: z.number().optional(),
});
export type BigDataCloudNetwork = z.infer<typeof BigDataCloudNetwork>;

/**
 * BigDataCloud BGP Prefix entity.
 */
export const BigDataCloudPrefix = z.object({
	/** BGP prefix CIDR string (e.g. '1.0.0.0/24') */
	id: z.string(),
	bgpPrefix: z.string(),
	bgpPrefixNetworkAddress: z.string().optional(),
	bgpPrefixLastAddress: z.string().optional(),
	registryStatus: z.string().optional(),
	isBogon: z.boolean().optional(),
	isAnnounced: z.boolean().optional(),
	asn: z.string().optional(),
});
export type BigDataCloudPrefix = z.infer<typeof BigDataCloudPrefix>;

/**
 * BigDataCloud Cybersecurity Hazard Report entity.
 */
export const BigDataCloudHazardReport = z.object({
	/** Target IP address */
	id: z.string(),
	ip: z.string(),
	isKnownAsTorServer: z.boolean().optional(),
	isKnownAsVpn: z.boolean().optional(),
	isKnownAsProxy: z.boolean().optional(),
	isSpamhausDrop: z.boolean().optional(),
	isSpamhausEdrop: z.boolean().optional(),
	isSpamhausAsnDrop: z.boolean().optional(),
	isBlacklistedUceprotect: z.boolean().optional(),
	isBlacklistedBlocklistDe: z.boolean().optional(),
	isKnownAsMailServer: z.boolean().optional(),
	isKnownAsPublicRouter: z.boolean().optional(),
	isBogon: z.boolean().optional(),
	isUnreachable: z.boolean().optional(),
	hostingLikelihood: z.number().optional(),
	isHostingAsn: z.boolean().optional(),
	isCellular: z.boolean().optional(),
	iCloudPrivateRelay: z.boolean().optional(),
});
export type BigDataCloudHazardReport = z.infer<typeof BigDataCloudHazardReport>;

/**
 * BigDataCloud User Risk Assessment entity.
 */
export const BigDataCloudUserRisk = z.object({
	/** Target IP address */
	id: z.string(),
	ip: z.string(),
	risk: z.string(),
	description: z.string().optional(),
});
export type BigDataCloudUserRisk = z.infer<typeof BigDataCloudUserRisk>;

/**
 * BigDataCloud Tor Exit Node entity.
 */
export const BigDataCloudTorExitNode = z.object({
	/** Tor exit node IP address */
	id: z.string(),
	ip: z.string(),
	countryName: z.string().optional(),
	countryCode: z.string().optional(),
	asn: z.string().optional(),
	organisation: z.string().optional(),
});
export type BigDataCloudTorExitNode = z.infer<typeof BigDataCloudTorExitNode>;

/**
 * BigDataCloud Timezone entity.
 */
export const BigDataCloudTimeZone = z.object({
	/** IANA Timezone ID (e.g. 'Australia/Sydney', 'America/New_York') */
	id: z.string(),
	ianaTimeId: z.string(),
	displayName: z.string().optional(),
	effectiveTimeZoneFull: z.string().optional(),
	effectiveTimeZoneShort: z.string().optional(),
	utcOffsetSeconds: z.number().optional(),
	utcOffset: z.string().optional(),
	isDaylightSavingTime: z.boolean().optional(),
	localTime: z.string().optional(),
});
export type BigDataCloudTimeZone = z.infer<typeof BigDataCloudTimeZone>;

/**
 * BigDataCloud Reverse Geocoding entity.
 */
export const BigDataCloudReverseGeocode = z.object({
	/** Coordinates composite key or plus code */
	id: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	continent: z.string().optional(),
	continentCode: z.string().optional(),
	countryName: z.string().optional(),
	countryCode: z.string().optional(),
	principalSubdivision: z.string().optional(),
	principalSubdivisionCode: z.string().optional(),
	city: z.string().optional(),
	locality: z.string().optional(),
	postcode: z.string().optional(),
	plusCode: z.string().optional(),
});
export type BigDataCloudReverseGeocode = z.infer<
	typeof BigDataCloudReverseGeocode
>;

/**
 * BigDataCloud Phone Number Validation entity.
 */
export const BigDataCloudPhoneValidation = z.object({
	/** Normalized E.164 phone number */
	id: z.string(),
	number: z.string(),
	isValid: z.boolean(),
	e164Format: z.string().optional(),
	internationalFormat: z.string().optional(),
	nationalFormat: z.string().optional(),
	location: z.string().optional(),
	lineType: z.string().optional(),
	countryCode: z.string().optional(),
});
export type BigDataCloudPhoneValidation = z.infer<
	typeof BigDataCloudPhoneValidation
>;

/**
 * BigDataCloud Email Address Verification entity.
 */
export const BigDataCloudEmailValidation = z.object({
	/** Verified email address */
	id: z.string(),
	emailAddress: z.string(),
	isValid: z.boolean(),
	isSyntaxValid: z.boolean().optional(),
	isMailServerDefined: z.boolean().optional(),
	isKnownSpammerDomain: z.boolean().optional(),
	isDisposable: z.boolean().optional(),
});
export type BigDataCloudEmailValidation = z.infer<
	typeof BigDataCloudEmailValidation
>;

/**
 * BigDataCloud Parsed User Agent entity.
 */
export const BigDataCloudUserAgent = z.object({
	/** Raw user-agent string */
	id: z.string(),
	userAgentRaw: z.string(),
	device: z.string().optional(),
	os: z.string().optional(),
	userAgent: z.string().optional(),
	family: z.string().optional(),
	isSpider: z.boolean().optional(),
	isMobile: z.boolean().optional(),
	userAgentDisplay: z.string().optional(),
});
export type BigDataCloudUserAgent = z.infer<typeof BigDataCloudUserAgent>;

/**
 * BigDataCloud Roaming Status entity.
 */
export const BigDataCloudRoaming = z.object({
	/** Composite key `${ip}:${latitude},${longitude}` */
	id: z.string(),
	ip: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	isRoaming: z.boolean(),
});
export type BigDataCloudRoaming = z.infer<typeof BigDataCloudRoaming>;
