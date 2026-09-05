import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared record shapes (all `.loose()` so provider-side additions keep parsing)
// ---------------------------------------------------------------------------

const WhoisRecordSchema = z
	.object({
		status: z.boolean().optional(),
		domain_name: z.string().optional(),
		query_time: z.string().optional(),
		whois_server: z.string().optional(),
		// The provider documents this as the string "yes"/"no".
		// https://whoisfreaks.com/documentation/whois-api
		domain_registered: z.string().optional(),
		secure_dns: z.boolean().optional(),
		domain_handle: z.string().optional(),
		create_date: z.string().optional(),
		update_date: z.string().optional(),
		expiry_date: z.string().optional(),
		name_servers: z.array(z.string()).optional(),
		domain_status: z.array(z.string()).optional(),
	})
	.loose();

const DnsRecordSchema = z
	.object({
		domainName: z.string().optional(),
		ipAddress: z.string().optional(),
		queryTime: z.string().optional(),
		status: z.boolean().optional(),
		// unknown: per-type DNS payloads vary by record type; the provider does not fix their shape.
		dnsTypes: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// WHOIS — https://whoisfreaks.com/documentation/whois-api
// ---------------------------------------------------------------------------

const WhoisLiveLookupV2InputSchema = z.object({
	domainName: z.string().min(1),
});

const WhoisLiveLookupV2OutputSchema = WhoisRecordSchema;

// GET /v2.0/whois/history (spec operationId: whoisHistory)
const WhoisHistoryLookupInputSchema = z.object({
	domainName: z.string().min(1),
	page: z.number().int().min(1).optional(),
});

const WhoisHistoryLookupOutputSchema = z
	.object({
		status: z.boolean().optional(),
		whois: z.string().optional(),
		total_records: z.union([z.string(), z.number()]).optional(),
		total_Result: z.number().optional(),
		total_Pages: z.number().optional(),
		current_Page: z.number().optional(),
		whois_domains_historical: z.array(WhoisRecordSchema).optional(),
	})
	.loose();

// GET /v2.0/whois/reverse (spec operationId: whoisReverse)
const WhoisReverseLookupInputSchema = z.object({
	keyword: z.string().min(1),
	page: z.number().int().min(1).optional(),
});

const WhoisReverseLookupOutputSchema = z
	.object({
		Total_Result: z.number().optional(),
		Total_Pages: z.number().optional(),
		Current_Page: z.number().optional(),
		whois_domains_historical: z.array(WhoisRecordSchema).optional(),
	})
	.loose();

// POST /v2.0/bulkwhois/live (spec operationId: bulkWhois, max 100 domains)
const BulkWhoisLookupInputSchema = z.object({
	domainNames: z.array(z.string().min(1)).min(1).max(100),
});

const BulkWhoisLookupOutputSchema = z
	.object({
		bulk_whois_response: z.array(WhoisRecordSchema).optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// DNS — https://whoisfreaks.com/documentation/dns-checker-api
// ---------------------------------------------------------------------------

const DnsLiveLookupInputSchema = z
	.object({
		domainName: z.string().min(1).optional(),
		ipAddress: z.string().min(1).optional(),
		type: z.string().min(1).default('all'),
	})
	.refine((v) => v.domainName !== undefined || v.ipAddress !== undefined, {
		message: 'Either domainName or ipAddress is required',
	});

const DnsLiveLookupOutputSchema = DnsRecordSchema;

const DnsHistoricalLookupInputSchema = z.object({
	domainName: z.string().min(1),
	type: z.string().min(1).default('all'),
	page: z.number().int().min(1).default(1),
});

const DnsHistoricalLookupOutputSchema = z
	.object({
		totalPages: z.number().optional(),
		currenPage: z.number().optional(),
		totalRecords: z.number().optional(),
		historicalDns: z.array(DnsRecordSchema).optional(),
	})
	.loose();

const DnsReverseLookupInputSchema = z.object({
	value: z.string().min(1),
	type: z.enum(['a', 'mx', 'cname', 'ns', 'aaaa', 'txt', 'soa']),
	exact: z.boolean().default(true),
	page: z.number().int().min(1).default(1),
});

const DnsReverseLookupOutputSchema = z
	.object({
		totalRecords: z.number().optional(),
		totalPages: z.number().optional(),
		currentPage: z.number().optional(),
		reverseDnsRecords: z.array(DnsRecordSchema).optional(),
	})
	.loose();

const DnsBulkLookupInputSchema = z
	.object({
		domainNames: z.array(z.string().min(1)).max(100).optional(),
		ipAddresses: z.array(z.string().min(1)).max(100).optional(),
		type: z.string().min(1).default('all'),
	})
	.refine(
		(v) =>
			(v.domainNames !== undefined && v.domainNames.length > 0) ||
			(v.ipAddresses !== undefined && v.ipAddresses.length > 0),
		{ message: 'Either domainNames or ipAddresses is required' },
	);

const DnsBulkLookupOutputSchema = z
	.object({
		bulk_dns_info: z.array(DnsRecordSchema).optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Domain availability — https://whoisfreaks.com/documentation/domain-availability-api
// ---------------------------------------------------------------------------

const DomainAvailabilityCheckInputSchema = z.object({
	domain: z.string().min(1),
	sug: z.boolean().default(false),
	count: z.number().int().min(1).max(100).default(5),
});

const DomainAvailabilityItemSchema = z
	.object({
		domain: z.string().optional(),
		availability: z.string().optional(),
		message: z.string().optional(),
	})
	.loose();

const DomainAvailabilityCheckOutputSchema = z
	.object({
		domain: z.string().optional(),
		availability: z.string().optional(),
		message: z.string().optional(),
		domain_available_response: z.array(DomainAvailabilityItemSchema).optional(),
	})
	.loose();

const BulkDomainAvailabilityCheckInputSchema = z
	.object({
		domain: z.string().min(1).optional(),
		domainNames: z.array(z.string().min(1)).max(100).optional(),
		tld: z.array(z.string().min(1)).max(100).optional(),
	})
	.refine(
		(v) =>
			(v.domainNames !== undefined) !== (v.tld !== undefined) &&
			(v.domainNames !== undefined || v.tld !== undefined),
		{ message: 'Provide exactly one of domainNames or tld' },
	)
	.refine((v) => v.tld === undefined || v.domain !== undefined, {
		message: 'domain is required when checking by tld',
	});

const BulkDomainAvailabilityCheckOutputSchema = z
	.object({
		bulk_domain_availability_response: z
			.array(DomainAvailabilityItemSchema)
			.optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Typosquatting — https://whoisfreaks.com/documentation/domain-typosquats-api
// ---------------------------------------------------------------------------

const TyposquattingLookupInputSchema = z
	.object({
		keyword: z.string().min(1).optional(),
		pattern: z.string().min(1).optional(),
		pageToken: z.string().min(1).optional(),
	})
	.refine((v) => v.keyword !== undefined || v.pattern !== undefined, {
		message: 'Either keyword or pattern is required',
	});

const TyposquattingLookupOutputSchema = z
	.object({
		status: z.boolean().optional(),
		totalRecords: z.number().optional(),
		currentPage: z.number().optional(),
		totalPages: z.number().optional(),
		hasNextPage: z.boolean().optional(),
		nextPageToken: z.string().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// SSL — https://whoisfreaks.com/documentation/ssl-certificate-api
// ---------------------------------------------------------------------------

const SslLookupInputSchema = z.object({
	domainName: z.string().min(1),
	chain: z.boolean().default(false),
	sslRaw: z.boolean().default(false),
});

const SslLookupOutputSchema = z
	.object({
		domainName: z.string().optional(),
		queryTime: z.string().optional(),
		// unknown: certificate fields vary by issuer and chain depth.
		sslCertificates: z.array(z.record(z.string(), z.unknown())).optional(),
		sslRaw: z.string().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Geolocation — https://whoisfreaks.com/documentation/ip-geolocation-api
// ---------------------------------------------------------------------------

const GeolocationLookupInputSchema = z.object({
	ip: z.string().min(1),
});

const GeolocationLookupOutputSchema = z
	.object({
		ip: z.string().optional(),
		// unknown: nested provider objects vary by IP and plan; keys are not fixed.
		location: z.record(z.string(), z.unknown()).optional(),
		country_metadata: z.record(z.string(), z.unknown()).optional(),
		network: z.record(z.string(), z.unknown()).optional(),
		currency: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const BulkGeolocationLookupInputSchema = z.object({
	ips: z.array(z.string().min(1)).min(1).max(100),
});

const BulkGeolocationLookupOutputSchema = z.array(
	GeolocationLookupOutputSchema,
);

// ---------------------------------------------------------------------------
// Subdomains — https://whoisfreaks.com/documentation/subdomains-api
// ---------------------------------------------------------------------------

const SubdomainsLookupInputSchema = z.object({
	domain: z.string().min(1),
	after: z.string().min(1).optional(),
	before: z.string().min(1).optional(),
	status: z.enum(['active', 'inactive']).optional(),
	page: z.number().int().min(1).default(1),
});

const SubdomainsLookupOutputSchema = z
	.object({
		domain: z.string().optional(),
		status: z.boolean().optional(),
		current_page: z.number().optional(),
		total_pages: z.number().optional(),
		query_time: z.string().optional(),
		total_records: z.number().optional(),
		// unknown: subdomain entries gain provider-side fields over time.
		subdomains: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// IP reputation — https://whoisfreaks.com/documentation/ip-security-api
// ---------------------------------------------------------------------------

const IpReputationLookupInputSchema = z.object({
	ip: z.string().min(1),
});

const IpReputationLookupOutputSchema = z
	.object({
		ip: z.string().optional(),
		// unknown: threat-intel sub-objects vary by IP and feed coverage.
		location: z.record(z.string(), z.unknown()).optional(),
		network: z.record(z.string(), z.unknown()).optional(),
		asn: z.record(z.string(), z.unknown()).optional(),
		security: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const BulkIpReputationLookupInputSchema = z.object({
	ips: z.array(z.string().min(1)).min(1).max(100),
});

const BulkIpReputationLookupOutputSchema = z.array(
	IpReputationLookupOutputSchema,
);

// ---------------------------------------------------------------------------
// Domain reputation — https://whoisfreaks.com/documentation/domain-reputation-api
// ---------------------------------------------------------------------------

const DomainReputationLookupInputSchema = z.object({
	domainName: z.string().min(1),
});

const DomainReputationLookupOutputSchema = z
	.object({
		assessed_at: z.string().optional(),
		version: z.string().optional(),
		processing_time_ms: z.number().optional(),
		// unknown: scoring sub-objects evolve with the provider's models.
		risk_category: z.record(z.string(), z.unknown()).optional(),
		dga_score: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// ASN / IP WHOIS — https://whoisfreaks.com/documentation/asn-whois-api,
// https://whoisfreaks.com/documentation/ip-whois-api
// ---------------------------------------------------------------------------

const AsnWhoisLookupInputSchema = z.object({
	asn: z.string().min(1),
});

const AsnWhoisLookupOutputSchema = z
	.object({
		// unknown: ASN detail objects are provider pass-through data with no fixed shape.
		asn: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const IpWhoisLookupInputSchema = z.object({
	ip: z.string().min(1),
});

const IpWhoisLookupOutputSchema = z
	.object({
		status: z.boolean().optional(),
		ip_address: z.string().optional(),
		as_number: z.string().optional(),
		query_time: z.string().optional(),
		whois_server: z.string().optional(),
		whois_raw_response: z.string().optional(),
	})
	.loose();

export const WhoisfreaksEndpointInputSchemas = {
	whoisLiveLookupV2: WhoisLiveLookupV2InputSchema,
	whoisHistoryLookup: WhoisHistoryLookupInputSchema,
	whoisReverseLookup: WhoisReverseLookupInputSchema,
	bulkWhoisLookup: BulkWhoisLookupInputSchema,
	dnsLiveLookup: DnsLiveLookupInputSchema,
	dnsHistoricalLookup: DnsHistoricalLookupInputSchema,
	dnsReverseLookup: DnsReverseLookupInputSchema,
	dnsBulkLookup: DnsBulkLookupInputSchema,
	domainAvailabilityCheck: DomainAvailabilityCheckInputSchema,
	bulkDomainAvailabilityCheck: BulkDomainAvailabilityCheckInputSchema,
	typosquattingLookup: TyposquattingLookupInputSchema,
	sslLookup: SslLookupInputSchema,
	geolocationLookup: GeolocationLookupInputSchema,
	bulkGeolocationLookup: BulkGeolocationLookupInputSchema,
	subdomainsLookup: SubdomainsLookupInputSchema,
	ipReputationLookup: IpReputationLookupInputSchema,
	bulkIpReputationLookup: BulkIpReputationLookupInputSchema,
	domainReputationLookup: DomainReputationLookupInputSchema,
	asnWhoisLookup: AsnWhoisLookupInputSchema,
	ipWhoisLookup: IpWhoisLookupInputSchema,
} as const;

export const WhoisfreaksEndpointOutputSchemas = {
	whoisLiveLookupV2: WhoisLiveLookupV2OutputSchema,
	whoisHistoryLookup: WhoisHistoryLookupOutputSchema,
	whoisReverseLookup: WhoisReverseLookupOutputSchema,
	bulkWhoisLookup: BulkWhoisLookupOutputSchema,
	dnsLiveLookup: DnsLiveLookupOutputSchema,
	dnsHistoricalLookup: DnsHistoricalLookupOutputSchema,
	dnsReverseLookup: DnsReverseLookupOutputSchema,
	dnsBulkLookup: DnsBulkLookupOutputSchema,
	domainAvailabilityCheck: DomainAvailabilityCheckOutputSchema,
	bulkDomainAvailabilityCheck: BulkDomainAvailabilityCheckOutputSchema,
	typosquattingLookup: TyposquattingLookupOutputSchema,
	sslLookup: SslLookupOutputSchema,
	geolocationLookup: GeolocationLookupOutputSchema,
	bulkGeolocationLookup: BulkGeolocationLookupOutputSchema,
	subdomainsLookup: SubdomainsLookupOutputSchema,
	ipReputationLookup: IpReputationLookupOutputSchema,
	bulkIpReputationLookup: BulkIpReputationLookupOutputSchema,
	domainReputationLookup: DomainReputationLookupOutputSchema,
	asnWhoisLookup: AsnWhoisLookupOutputSchema,
	ipWhoisLookup: IpWhoisLookupOutputSchema,
} as const;

export type WhoisfreaksEndpointInputs = {
	[K in keyof typeof WhoisfreaksEndpointInputSchemas]: z.infer<
		(typeof WhoisfreaksEndpointInputSchemas)[K]
	>;
};

export type WhoisfreaksEndpointOutputs = {
	[K in keyof typeof WhoisfreaksEndpointOutputSchemas]: z.infer<
		(typeof WhoisfreaksEndpointOutputSchemas)[K]
	>;
};

export type WhoisLiveLookupV2Input = z.infer<
	typeof WhoisLiveLookupV2InputSchema
>;
export type WhoisLiveLookupV2Response = z.infer<
	typeof WhoisLiveLookupV2OutputSchema
>;
