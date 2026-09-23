import { z } from 'zod';

const CompanyFindInputSchema = z
	.object({
		domain: z.string().trim().min(1),
		webhookUrl: z.string().trim().url().optional(),
		webhookId: z.string().trim().min(1).optional(),
	})
	.refine(
		(value) => value.webhookId === undefined || value.webhookUrl !== undefined,
	);

export type CompanyFindInput = z.infer<typeof CompanyFindInputSchema>;

const CompanyStreamInputSchema = z.object({
	domain: z.string().trim().min(1),
});

export type CompanyStreamInput = z.infer<typeof CompanyStreamInputSchema>;

const IpFindInputSchema = z.object({
	ip: z
		.string()
		.trim()
		.pipe(z.union([z.ipv4(), z.ipv6()])),
});

export type IpFindInput = z.infer<typeof IpFindInputSchema>;

const CompanyFieldsSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		legalName: z.string().optional(),
		domain: z.string().optional(),
		url: z.string().optional(),
		logo: z.string().optional(),
		type: z.string().optional(),
		phone: z.string().optional(),
		ticker: z.string().optional(),
		description: z.string().optional(),
		foundedYear: z.number().optional(),

		tags: z.array(z.string()).optional(),
		tech: z.array(z.string()).optional(),
		aliases: z.array(z.string()).optional(),
		domainAliases: z.array(z.string()).optional(),

		category: z
			.object({
				sector: z.string().optional(),
				industryGroup: z.string().optional(),
				industry: z.string().optional(),
				subIndustry: z.string().optional(),
				naicsCode: z.string().optional(),
			})
			.optional(),

		metrics: z
			.object({
				raised: z.number().optional(),
				employees: z.number().optional(),
				marketCap: z.number().optional(),
				trancoRank: z.number().optional(),
				alexaUsRank: z.number().optional(),
				annualRevenue: z.number().optional(),
				employeesRange: z.string().optional(),
				alexaGlobalRank: z.number().optional(),
				estimatedAnnualRevenue: z.string().optional(),
			})
			.optional(),

		location: z.string().optional(),

		geo: z
			.object({
				streetNumber: z.string().nullable().optional(),
				streetName: z.string().nullable().optional(),
				subPremise: z.string().nullable().optional(),
				city: z.string().nullable().optional(),
				state: z.string().nullable().optional(),
				postalCode: z.string().nullable().optional(),
				stateCode: z.string().nullable().optional(),
				country: z.string().nullable().optional(),
				countryCode: z.string().nullable().optional(),
			})
			.optional(),

		facebook: z
			.object({
				handle: z.string().optional(),
			})
			.optional(),

		linkedin: z
			.object({
				handle: z.string().optional(),
				industry: z.string().optional(),
			})
			.optional(),

		twitter: z
			.object({
				id: z.string().optional(),
				bio: z.string().optional(),
				site: z.string().optional(),
				avatar: z.string().optional(),
				handle: z.string().optional(),
				location: z.string().optional(),
				followers: z.number().optional(),
				following: z.number().optional(),
			})
			.optional(),

		crunchbase: z
			.object({
				handle: z.string().optional(),
			})
			.optional(),

		emailProvider: z.boolean().optional(),
		indexedAt: z.string().optional(),
	})
	.passthrough();

export function hasCompanyIdentity(value: unknown): boolean {
	if (!value || typeof value !== 'object') {
		return false;
	}
	const { id, name, domain } = value as Record<string, unknown>;
	return [id, name, domain].some(
		(field) => typeof field === 'string' && field.trim().length > 0,
	);
}

const CompanyProfileSchema = CompanyFieldsSchema.refine(hasCompanyIdentity);

const CompanyPendingSchema = z.object({
	pending: z.literal(true),
	webhookUrl: z.string().url(),
	webhookId: z.string().optional(),
});

const CompanyFindResponseSchema = z.union([
	CompanyProfileSchema,
	CompanyPendingSchema,
]);

export type CompanyFindResponse = z.infer<typeof CompanyFindResponseSchema>;
export type CompanyStreamResponse = z.infer<typeof CompanyProfileSchema>;

const IpFindResponseSchema = z
	.object({
		ip: z.string().min(1),
		type: z.string().optional(),
		fuzzy: z.boolean().optional(),
		confidence: z.number().optional(),
		geo: z
			.object({
				city: z.string().optional(),
				state: z.string().optional(),
				stateCode: z.string().optional(),
				country: z.string().optional(),
				countryCode: z.string().optional(),
				continent: z.string().optional(),
				continentCode: z.string().optional(),
				isEU: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		company: CompanyFieldsSchema.optional(),
		whois: z
			.object({
				domain: z.string().optional(),
				name: z.string().optional(),
			})
			.passthrough()
			.optional(),
		asn: z
			.object({
				asn: z.string().optional(),
				name: z.string().optional(),
				route: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export type IpFindResponse = z.infer<typeof IpFindResponseSchema>;

export type BigpictureioEndpointInputs = {
	companyFind: CompanyFindInput;
	companyStream: CompanyStreamInput;
	ipFind: IpFindInput;
};

export type BigpictureioEndpointOutputs = {
	companyFind: CompanyFindResponse;
	companyStream: CompanyStreamResponse;
	ipFind: IpFindResponse;
};

export const BigpictureioEndpointInputSchemas = {
	companyFind: CompanyFindInputSchema,
	companyStream: CompanyStreamInputSchema,
	ipFind: IpFindInputSchema,
} as const;

export const BigpictureioEndpointOutputSchemas = {
	companyFind: CompanyFindResponseSchema,
	companyStream: CompanyProfileSchema,
	ipFind: IpFindResponseSchema,
} as const;
