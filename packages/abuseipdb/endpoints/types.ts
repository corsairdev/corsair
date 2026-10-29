import { z } from 'zod';

// Any IPv4 or IPv6 address.
const IpAddressSchema = z.union([z.ipv4(), z.ipv6()]);

// ─────────────────────────────────────────────────────────────────────────────
// CHECK — GET /api/v2/check
// Look up an IP address and get its abuse confidence score, country, ISP,
// usage type, and optionally recent reports (verbose).
// Docs: https://docs.abuseipdb.com/#check-endpoint
// ─────────────────────────────────────────────────────────────────────────────

export const CheckIpInputSchema = z.object({
	/** IPv4 or IPv6 address to look up, e.g. "118.25.6.39" */
	ipAddress: IpAddressSchema.describe('IPv4 or IPv6 address to check'),
	/** Only consider reports from the last N days (1–365, default 30) */
	maxAgeInDays: z
		.number()
		.int()
		.min(1)
		.max(365)
		.optional()
		.describe('Only consider reports from the last N days (1–365)'),
	/** Include the full reports array and country name in the response */
	verbose: z.boolean().optional().describe('Include the full reports array'),
});

export type CheckIpInput = z.infer<typeof CheckIpInputSchema>;

const CheckReportSchema = z
	.object({
		reportedAt: z.string(),
		comment: z.string().nullable().optional(),
		categories: z.array(z.number()),
		reporterId: z.number(),
		reporterCountryCode: z.string().nullable().optional(),
		reporterCountryName: z.string().nullable().optional(),
	})
	.loose();

export const CheckIpResponseSchema = z
	.object({
		ipAddress: z.string(),
		isPublic: z.boolean(),
		ipVersion: z.number(),
		isWhitelisted: z.boolean().nullable(),
		abuseConfidenceScore: z.number(),
		countryCode: z.string().nullable().optional(),
		countryName: z.string().nullable().optional(),
		usageType: z.string().nullable().optional(),
		isp: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		hostnames: z.array(z.string()),
		isTor: z.boolean(),
		totalReports: z.number(),
		numDistinctUsers: z.number(),
		lastReportedAt: z.string().nullable().optional(),
		reports: z.array(CheckReportSchema).optional(),
	})
	.loose();

export type CheckIpResponse = z.infer<typeof CheckIpResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS — GET /api/v2/reports
// Paginated list of reports filed against a single IP address.
// Docs: https://docs.abuseipdb.com/#reports-endpoint
// ─────────────────────────────────────────────────────────────────────────────

export const GetReportsInputSchema = z.object({
	/** IPv4 or IPv6 address to fetch reports for */
	ipAddress: IpAddressSchema.describe(
		'IPv4 or IPv6 address to fetch reports for',
	),
	/** Only consider reports from the last N days (1–365, default 30) */
	maxAgeInDays: z
		.number()
		.int()
		.min(1)
		.max(365)
		.optional()
		.describe('Only consider reports from the last N days (1–365)'),
	/** Page number (starts at 1, default 1) */
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	/** Reports per page (1–100, default 25) */
	perPage: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Reports per page (1–100)'),
});

export type GetReportsInput = z.infer<typeof GetReportsInputSchema>;

const ReportsItemSchema = CheckReportSchema;

export const GetReportsResponseSchema = z
	.object({
		total: z.number(),
		page: z.number(),
		count: z.number(),
		perPage: z.number(),
		lastPage: z.number(),
		nextPageUrl: z.string().nullable().optional(),
		previousPageUrl: z.string().nullable().optional(),
		results: z.array(ReportsItemSchema),
	})
	.loose();

export type GetReportsResponse = z.infer<typeof GetReportsResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// BLACKLIST — GET /api/v2/blacklist
// Download the blacklist of most-reported IPs, optionally filtered by
// confidence minimum, country, and IP version.
// Docs: https://docs.abuseipdb.com/#blacklist-endpoint
// ─────────────────────────────────────────────────────────────────────────────

export const GetBlacklistInputSchema = z.object({
	/** Minimum abuse confidence score (25–100, default 100) */
	confidenceMinimum: z
		.number()
		.int()
		.min(25)
		.max(100)
		.optional()
		.describe('Minimum abuse confidence score (25–100)'),
	/** Maximum number of entries to return (1–500000, default 10000) */
	limit: z
		.number()
		.int()
		.min(1)
		.max(500000)
		.optional()
		.describe('Maximum number of entries to return'),
	/** Only include IPs from these ISO 3166 alpha-2 country codes */
	onlyCountries: z
		.array(z.string().regex(/^[A-Za-z]{2}$/))
		.optional()
		.describe('Only include IPs from these ISO 3166 alpha-2 country codes'),
	/** Exclude IPs from these ISO 3166 alpha-2 country codes */
	exceptCountries: z
		.array(z.string().regex(/^[A-Za-z]{2}$/))
		.optional()
		.describe('Exclude IPs from these ISO 3166 alpha-2 country codes'),
	/** Restrict to a single IP version (4 or 6) */
	ipVersion: z
		.union([z.literal(4), z.literal(6)])
		.optional()
		.describe('Restrict to a single IP version (4 or 6)'),
});

export type GetBlacklistInput = z.infer<typeof GetBlacklistInputSchema>;

const BlacklistEntrySchema = z
	.object({
		ipAddress: z.string(),
		abuseConfidenceScore: z.number(),
		lastReportedAt: z.string().nullable().optional(),
		countryCode: z.string().nullable().optional(),
	})
	.loose();

export const GetBlacklistResponseSchema = z.object({
	generatedAt: z.string(),
	entries: z.array(BlacklistEntrySchema),
});

export type GetBlacklistResponse = z.infer<typeof GetBlacklistResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// REPORT — POST /api/v2/report
// Submit an abuse report for an IP address.
// Docs: https://docs.abuseipdb.com/#report-endpoint
// ─────────────────────────────────────────────────────────────────────────────

export const ReportIpInputSchema = z.object({
	/** IPv4 or IPv6 address being reported */
	ip: IpAddressSchema.describe('IPv4 or IPv6 address being reported'),
	/** Abuse category IDs (integers 1–30, at least one required) */
	categories: z
		.array(z.number().int().min(1).max(30))
		.min(1)
		.describe('Abuse category IDs (integers 1–30)'),
	/** Descriptive text of the attack (server logs, port numbers, etc.) */
	comment: z
		.string()
		.optional()
		.describe('Descriptive text of the attack; avoid any PII'),
	/** ISO 8601 datetime of the attack, defaults to now */
	timestamp: z.iso
		.datetime({ offset: true })
		.optional()
		.describe('ISO 8601 datetime of the attack, defaults to now'),
});

export type ReportIpInput = z.infer<typeof ReportIpInputSchema>;

export const ReportIpResponseSchema = z
	.object({
		ipAddress: z.string(),
		abuseConfidenceScore: z.number(),
	})
	.loose();

export type ReportIpResponse = z.infer<typeof ReportIpResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CHECK-BLOCK — GET /api/v2/check-block
// Check a CIDR network block for reported addresses.
// Docs: https://docs.abuseipdb.com/#check-block-endpoint
// ─────────────────────────────────────────────────────────────────────────────

export const CheckBlockInputSchema = z.object({
	/** CIDR notation network block, e.g. "127.0.0.1/24" or an IPv6 prefix */
	network: z
		.union([z.cidrv4(), z.cidrv6()])
		.describe('CIDR notation network block, e.g. "127.0.0.1/24"'),
	/** Only consider reports from the last N days (1–365, default 30) */
	maxAgeInDays: z
		.number()
		.int()
		.min(1)
		.max(365)
		.optional()
		.describe('Only consider reports from the last N days (1–365)'),
});

export type CheckBlockInput = z.infer<typeof CheckBlockInputSchema>;

const ReportedAddressSchema = z
	.object({
		ipAddress: z.string(),
		numReports: z.number(),
		mostRecentReport: z.string().nullable().optional(),
		abuseConfidenceScore: z.number(),
		countryCode: z.string().nullable().optional(),
	})
	.loose();

export const CheckBlockResponseSchema = z
	.object({
		networkAddress: z.string(),
		netmask: z.string(),
		minAddress: z.string(),
		maxAddress: z.string(),
		numPossibleHosts: z.number(),
		addressSpaceDesc: z.string().nullable().optional(),
		reportedAddress: z.array(ReportedAddressSchema),
	})
	.loose();

export type CheckBlockResponse = z.infer<typeof CheckBlockResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CLEAR-ADDRESS — DELETE /api/v2/clear-address
// Remove reports for an IP address from your account.
// Docs: https://docs.abuseipdb.com/#clear-address-endpoint
// ─────────────────────────────────────────────────────────────────────────────

export const ClearAddressInputSchema = z.object({
	/** IPv4 or IPv6 address to clear reports for from your account */
	ipAddress: IpAddressSchema.describe(
		'IPv4 or IPv6 address to clear reports for',
	),
});

export type ClearAddressInput = z.infer<typeof ClearAddressInputSchema>;

export const ClearAddressResponseSchema = z
	.object({
		numReportsDeleted: z.number(),
	})
	.loose();

export type ClearAddressResponse = z.infer<typeof ClearAddressResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Endpoint Input / Output Maps
// ─────────────────────────────────────────────────────────────────────────────

export type AbuseIPDBEndpointInputs = {
	checkIp: CheckIpInput;
	getReports: GetReportsInput;
	getBlacklist: GetBlacklistInput;
	reportIp: ReportIpInput;
	checkBlock: CheckBlockInput;
	clearAddress: ClearAddressInput;
};

export type AbuseIPDBEndpointOutputs = {
	checkIp: CheckIpResponse;
	getReports: GetReportsResponse;
	getBlacklist: GetBlacklistResponse;
	reportIp: ReportIpResponse;
	checkBlock: CheckBlockResponse;
	clearAddress: ClearAddressResponse;
};

export const AbuseIPDBEndpointInputSchemas = {
	checkIp: CheckIpInputSchema,
	getReports: GetReportsInputSchema,
	getBlacklist: GetBlacklistInputSchema,
	reportIp: ReportIpInputSchema,
	checkBlock: CheckBlockInputSchema,
	clearAddress: ClearAddressInputSchema,
} as const;

export const AbuseIPDBEndpointOutputSchemas = {
	checkIp: CheckIpResponseSchema,
	getReports: GetReportsResponseSchema,
	getBlacklist: GetBlacklistResponseSchema,
	reportIp: ReportIpResponseSchema,
	checkBlock: CheckBlockResponseSchema,
	clearAddress: ClearAddressResponseSchema,
} as const;
