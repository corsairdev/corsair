import { z } from 'zod';

export const DnsfilterNetwork = z.object({
	id: z.string(),
	name: z.string().optional(),
	organizationId: z.string().optional(),
	policyId: z.string().optional(),
	blockPageId: z.string().optional(),
	scheduledPolicyId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterPolicy = z.object({
	id: z.string(),
	name: z.string().optional(),
	organizationId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterOrganization = z.object({
	id: z.string(),
	name: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterUser = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	role: z.string().optional(),
	organizationId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterUserAgent = z.object({
	id: z.string(),
	name: z.string().optional(),
	platform: z.string().optional(),
	status: z.string().optional(),
	organizationId: z.string().optional(),
	networkId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	lastSeenAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterIpAddress = z.object({
	id: z.string(),
	address: z.string().optional(),
	policyId: z.string().optional(),
	organizationId: z.string().optional(),
	comment: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterMacAddress = z.object({
	id: z.string(),
	address: z.string().optional(),
	policyId: z.string().optional(),
	organizationId: z.string().optional(),
	comment: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterSubnet = z.object({
	id: z.string(),
	subnet: z.string().optional(),
	networkId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterUnblockRequest = z.object({
	id: z.string(),
	domain: z.string().optional(),
	status: z.string().optional(),
	organizationId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	resolvedAt: z.coerce.date().nullable().optional(),
});

export const DnsfilterScheduledReport = z.object({
	id: z.string(),
	name: z.string().optional(),
	schedule: z.string().optional(),
	organizationId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type DnsfilterNetwork = z.infer<typeof DnsfilterNetwork>;
export type DnsfilterPolicy = z.infer<typeof DnsfilterPolicy>;
export type DnsfilterOrganization = z.infer<typeof DnsfilterOrganization>;
export type DnsfilterUser = z.infer<typeof DnsfilterUser>;
export type DnsfilterUserAgent = z.infer<typeof DnsfilterUserAgent>;
export type DnsfilterIpAddress = z.infer<typeof DnsfilterIpAddress>;
export type DnsfilterMacAddress = z.infer<typeof DnsfilterMacAddress>;
export type DnsfilterSubnet = z.infer<typeof DnsfilterSubnet>;
export type DnsfilterUnblockRequest = z.infer<typeof DnsfilterUnblockRequest>;
export type DnsfilterScheduledReport = z.infer<typeof DnsfilterScheduledReport>;
