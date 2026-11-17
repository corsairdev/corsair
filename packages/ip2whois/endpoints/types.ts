import { z } from 'zod';

export const DomainLookupInputSchema = z.object({
	domain: z.string().min(1).describe('Domain name, without a scheme or www.'),
});

/** A WHOIS contact block. Registries often redact it, so every field is optional. */
const WhoisContactSchema = z
	.object({
		name: z.string().optional(),
		organization: z.string().optional(),
		street_address: z.string().optional(),
		city: z.string().optional(),
		region: z.string().optional(),
		zip_code: z.string().optional(),
		country: z.string().optional(),
		phone: z.string().optional(),
		fax: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

export const DomainLookupResponseSchema = z
	.object({
		domain: z.string(),
		domain_id: z.string().optional(),
		status: z.string().optional(),
		create_date: z.string().optional(),
		update_date: z.string().optional(),
		expire_date: z.string().optional(),
		domain_age: z.number().optional(),
		whois_server: z.string().optional(),
		nameservers: z.array(z.string()).optional(),
		registrar: z
			.object({
				iana_id: z.string().optional(),
				name: z.string().optional(),
				url: z.string().optional(),
			})
			.passthrough()
			.optional(),
		registrant: WhoisContactSchema.optional(),
		admin: WhoisContactSchema.optional(),
		tech: WhoisContactSchema.optional(),
		billing: WhoisContactSchema.optional(),
	})
	.passthrough();

export const HostedLookupInputSchema = z.object({
	ip: z.string().min(1).describe('IPv4 or IPv6 address.'),
	page: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Page number, starting at 1.'),
});

export const HostedLookupResponseSchema = z
	.object({
		ip: z.string(),
		total_domains: z.number(),
		page: z.number(),
		per_page: z.number(),
		total_pages: z.number(),
		// A list of domain names, e.g. ["000180.top"]. The free plan returns one per page.
		domains: z.array(z.string()),
	})
	.passthrough();

export type DomainLookupInput = z.infer<typeof DomainLookupInputSchema>;
export type DomainLookupResponse = z.infer<typeof DomainLookupResponseSchema>;
export type HostedLookupInput = z.infer<typeof HostedLookupInputSchema>;
export type HostedLookupResponse = z.infer<typeof HostedLookupResponseSchema>;

export const Ip2whoisEndpointInputSchemas = {
	domainLookup: DomainLookupInputSchema,
	hostedLookup: HostedLookupInputSchema,
} as const;

export const Ip2whoisEndpointOutputSchemas = {
	domainLookup: DomainLookupResponseSchema,
	hostedLookup: HostedLookupResponseSchema,
} as const;

export type Ip2whoisEndpointInputs = {
	[K in keyof typeof Ip2whoisEndpointInputSchemas]: z.infer<
		(typeof Ip2whoisEndpointInputSchemas)[K]
	>;
};

export type Ip2whoisEndpointOutputs = {
	[K in keyof typeof Ip2whoisEndpointOutputSchemas]: z.infer<
		(typeof Ip2whoisEndpointOutputSchemas)[K]
	>;
};
