import { z } from 'zod';

// ============================================================================
// Shared Sub-Schemas
// ============================================================================

export const CarrierSchema = z
	.object({
		asn: z.string().optional(),
		asnNumeric: z.number().optional(),
		organisation: z.string().optional(),
		name: z.string().optional(),
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
	})
	.passthrough();

export const CountryDetailSchema = z
	.object({
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
	})
	.passthrough();

export const TimeZoneDetailSchema = z
	.object({
		ianaTimeId: z.string(),
		displayName: z.string().optional(),
		effectiveTimeZoneFull: z.string().optional(),
		effectiveTimeZoneShort: z.string().optional(),
		utcOffsetSeconds: z.number().optional(),
		utcOffset: z.string().optional(),
		isDaylightSavingTime: z.boolean().optional(),
		localTime: z.string().optional(),
	})
	.passthrough();

// ============================================================================
// Endpoint Input Schemas
// ============================================================================

export const BigDataCloudEndpointInputSchemas = {
	// ASN Operations
	asnExtendedReceivingFromInfo: z.object({
		asn: z.string().min(1, 'ASN is required (e.g. "AS13335" or "13335")'),
		batchSize: z.number().int().positive().max(100).optional(),
		offset: z.number().int().nonnegative().optional(),
		localityLanguage: z.string().optional(),
	}),
	asnExtendedTransitToInfo: z.object({
		asn: z.string().min(1, 'ASN is required (e.g. "AS13335" or "13335")'),
		batchSize: z.number().int().positive().max(100).optional(),
		offset: z.number().int().nonnegative().optional(),
		localityLanguage: z.string().optional(),
	}),
	asnRankList: z.object({
		batchSize: z.number().int().positive().max(100).optional(),
		offset: z.number().int().nonnegative().optional(),
	}),
	bgpActivePrefixes: z.object({
		asn: z.string().min(1, 'ASN is required (e.g. "AS13335" or "13335")'),
		isIPv4: z.boolean().optional(),
		isv4: z.boolean().optional(),
		batchSize: z.number().int().positive().max(100).optional(),
		offset: z.number().int().nonnegative().optional(),
	}),

	// Network Operations
	networkByIpAddress: z.object({
		ip: z.string().min(1, 'IP address is required'),
		localityLanguage: z.string().optional(),
	}),
	networksByCidr: z.object({
		cidr: z.string().min(1, 'CIDR block is required (e.g. "8.8.8.0/24")'),
		localityLanguage: z.string().optional(),
	}),

	// Location Operations
	countryInfo: z.object({
		code: z.string().min(2, 'ISO country code is required (e.g. "US", "AU")'),
		localityLanguage: z.string().optional(),
	}),
	countryByIpAddress: z.object({
		ip: z.string().min(1, 'IP address is required'),
		localityLanguage: z.string().optional(),
	}),
	reverseGeocodingWithTimezone: z.object({
		latitude: z.number().min(-90).max(90),
		longitude: z.number().min(-180).max(180),
		localityLanguage: z.string().optional(),
	}),
	timeZoneByIpAddress: z.object({
		ip: z.string().min(1, 'IP address is required'),
		utcReference: z.string().optional(),
	}),
	amIRoaming: z.object({
		latitude: z.number().min(-90).max(90),
		longitude: z.number().min(-180).max(180),
		ip: z.string().min(1, 'IP address is required'),
		localityLanguage: z.string().optional(),
	}),

	// Security Operations
	hazardReport: z.object({
		ip: z.string().min(1, 'IP address is required'),
	}),
	torExitNodesGeolocated: z.object({
		batchSize: z.number().int().positive().max(100).optional(),
		offset: z.number().int().nonnegative().optional(),
		localityLanguage: z.string().optional(),
	}),
	userRisk: z.object({
		ip: z.string().min(1, 'IP address is required'),
	}),

	// Validation Operations
	emailAddressVerification: z.object({
		emailAddress: z.string().min(1, 'Email address is required'),
	}),
	phoneNumberValidationByIp: z
		.object({
			number: z.string().optional(),
			phoneNumber: z.string().optional(),
			ip: z.string().optional(),
			localityLanguage: z.string().optional(),
		})
		.refine((v) => Boolean(v.number?.trim() || v.phoneNumber?.trim()), {
			message: 'Provide `number` or `phoneNumber`',
		}),
	userAgentParser: z
		.object({
			userAgentRaw: z.string().optional(),
			userAgent: z.string().optional(),
		})
		.refine((v) => Boolean(v.userAgentRaw?.trim() || v.userAgent?.trim()), {
			message: 'Provide `userAgentRaw` or `userAgent`',
		}),
};

// ============================================================================
// Endpoint Output Schemas
// ============================================================================

export const BigDataCloudEndpointOutputSchemas = {
	// ASN Operations
	asnExtendedReceivingFromInfo: z
		.object({
			asn: z.string(),
			asnNumeric: z.number(),
			organisation: z.string().optional(),
			name: z.string().optional(),
			totalReceivingFrom: z.number().optional(),
			receivingFrom: z.array(CarrierSchema).optional(),
		})
		.passthrough(),

	asnExtendedTransitToInfo: z
		.object({
			asn: z.string(),
			asnNumeric: z.number(),
			organisation: z.string().optional(),
			name: z.string().optional(),
			totalTransitTo: z.number().optional(),
			transitTo: z.array(CarrierSchema).optional(),
		})
		.passthrough(),

	asnRankList: z
		.object({
			total: z.number(),
			offset: z.number(),
			batch: z.number(),
			asns: z.array(CarrierSchema),
		})
		.passthrough(),

	bgpActivePrefixes: z
		.object({
			total: z.number(),
			offset: z.number(),
			batch: z.number(),
			prefixes: z.array(
				z
					.object({
						bgpPrefix: z.string(),
						bgpPrefixNetworkAddress: z.string().optional(),
						bgpPrefixLastAddress: z.string().optional(),
						registryStatus: z.string().optional(),
						isBogon: z.boolean().optional(),
						isAnnounced: z.boolean().optional(),
						carriers: z.array(CarrierSchema).optional(),
					})
					.passthrough(),
			),
		})
		.passthrough(),

	// Network Operations
	networkByIpAddress: z
		.object({
			ip: z.string(),
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
			carriers: z.array(CarrierSchema).optional(),
			viaCarriers: z.array(CarrierSchema).optional(),
		})
		.passthrough(),

	networksByCidr: z
		.object({
			cidr: z.string(),
			parent: z.string().optional(),
			network: z
				.object({
					cidr: z.string().optional(),
					type: z.string().optional(),
					carriers: z.array(CarrierSchema).optional(),
					viaCarriers: z.array(CarrierSchema).optional(),
					totalSubnets: z.number().optional(),
					subnets: z
						.array(
							z
								.object({
									startAddress: z.string().optional(),
									endAddress: z.string().optional(),
									organisation: z.string().optional(),
									registeredCountry: z.string().optional(),
									registeredCountryName: z.string().optional(),
								})
								.passthrough(),
						)
						.optional(),
				})
				.passthrough()
				.optional(),
		})
		.passthrough(),

	// Location Operations
	countryInfo: CountryDetailSchema,

	countryByIpAddress: z
		.object({
			ip: z.string(),
			localityLanguageRequested: z.string().optional(),
			isReachableGlobally: z.boolean().optional(),
			country: CountryDetailSchema.optional(),
			lastUpdated: z.string().optional(),
		})
		.passthrough(),

	reverseGeocodingWithTimezone: z
		.object({
			latitude: z.number(),
			longitude: z.number(),
			localityLanguageRequested: z.string().optional(),
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
			localityInfo: z
				.object({
					administrative: z
						.array(
							z
								.object({
									name: z.string().optional(),
									description: z.string().optional(),
									isoName: z.string().optional(),
									order: z.number().optional(),
									adminLevel: z.number().optional(),
									isoCode: z.string().optional(),
									wikidataId: z.string().optional(),
									geonameId: z.number().optional(),
								})
								.passthrough(),
						)
						.optional(),
					informative: z
						.array(
							z
								.object({
									name: z.string().optional(),
									description: z.string().optional(),
									isoName: z.string().optional(),
									order: z.number().optional(),
									isoCode: z.string().optional(),
									wikidataId: z.string().optional(),
									geonameId: z.number().optional(),
								})
								.passthrough(),
						)
						.optional(),
				})
				.passthrough()
				.optional(),
			timeZone: TimeZoneDetailSchema.optional(),
		})
		.passthrough(),

	timeZoneByIpAddress: TimeZoneDetailSchema,

	amIRoaming: z
		.object({
			isRoaming: z.boolean(),
		})
		.passthrough(),

	// Security Operations
	hazardReport: z
		.object({
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
		})
		.passthrough(),

	torExitNodesGeolocated: z
		.object({
			total: z.number(),
			offset: z.number(),
			batch: z.number(),
			nodes: z.array(
				z
					.object({
						ip: z.string(),
						countryName: z.string().optional(),
						countryCode: z.string().optional(),
						carriers: z.array(CarrierSchema).optional(),
					})
					.passthrough(),
			),
		})
		.passthrough(),

	userRisk: z
		.object({
			risk: z.string(),
			description: z.string().optional(),
		})
		.passthrough(),

	// Validation Operations
	emailAddressVerification: z
		.object({
			inputData: z.string(),
			isValid: z.boolean(),
			isSyntaxValid: z.boolean().optional(),
			isMailServerDefined: z.boolean().optional(),
			isKnownSpammerDomain: z.boolean().optional(),
			isDisposable: z.boolean().optional(),
		})
		.passthrough(),

	phoneNumberValidationByIp: z
		.object({
			isValid: z.boolean(),
			e164Format: z.string().optional(),
			internationalFormat: z.string().optional(),
			nationalFormat: z.string().optional(),
			location: z.string().optional(),
			lineType: z.string().optional(),
			country: CountryDetailSchema.optional(),
		})
		.passthrough(),

	userAgentParser: z
		.object({
			device: z.string().optional(),
			os: z.string().optional(),
			userAgent: z.string().optional(),
			family: z.string().optional(),
			isSpider: z.boolean().optional(),
			isMobile: z.boolean().optional(),
			userAgentDisplay: z.string().optional(),
		})
		.passthrough(),
};

// ============================================================================
// Inferred TypeScript Types
// ============================================================================

export type BigDataCloudEndpointInputs = {
	[K in keyof typeof BigDataCloudEndpointInputSchemas]: z.infer<
		(typeof BigDataCloudEndpointInputSchemas)[K]
	>;
};

export type BigDataCloudEndpointOutputs = {
	[K in keyof typeof BigDataCloudEndpointOutputSchemas]: z.infer<
		(typeof BigDataCloudEndpointOutputSchemas)[K]
	>;
};
