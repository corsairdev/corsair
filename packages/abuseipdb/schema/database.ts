import { z } from 'zod';

/**
 * Local storage record for an IP abuse lookup (the check endpoint).
 * Captures the abuse confidence score and identifying details returned by
 * the AbuseIPDB Check API.
 */
export const AbuseIPDBIpCheck = z.object({
	ipAddress: z.string(),
	abuseConfidenceScore: z.number(),
	isPublic: z.boolean(),
	ipVersion: z.number(),
	countryCode: z.string().nullable().optional(),
	countryName: z.string().nullable().optional(),
	usageType: z.string().nullable().optional(),
	isp: z.string().nullable().optional(),
	domain: z.string().nullable().optional(),
	isTor: z.boolean(),
	totalReports: z.number(),
	numDistinctUsers: z.number(),
	checkedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local storage record for an abuse report submission (the report endpoint).
 */
export const AbuseIPDBReport = z.object({
	ipAddress: z.string(),
	abuseConfidenceScore: z.number(),
	reportedAt: z.coerce.date().nullable().optional(),
});

/**
 * Local storage record for a single blacklist entry (the blacklist endpoint).
 */
export const AbuseIPDBBlacklistEntry = z.object({
	ipAddress: z.string(),
	abuseConfidenceScore: z.number(),
	lastReportedAt: z.string().nullable().optional(),
	countryCode: z.string().nullable().optional(),
});

export type AbuseIPDBIpCheck = z.infer<typeof AbuseIPDBIpCheck>;
export type AbuseIPDBReport = z.infer<typeof AbuseIPDBReport>;
export type AbuseIPDBBlacklistEntry = z.infer<typeof AbuseIPDBBlacklistEntry>;
