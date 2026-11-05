import { z } from 'zod';

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

export const AbuseIPDBReport = z.object({
	ipAddress: z.string(),
	abuseConfidenceScore: z.number(),
	reportedAt: z.coerce.date().nullable().optional(),
});

export type AbuseIPDBIpCheck = z.infer<typeof AbuseIPDBIpCheck>;
export type AbuseIPDBReport = z.infer<typeof AbuseIPDBReport>;
