import { z } from 'zod';

const CompanyFindInputSchema = z.object({
	domain: z.string().trim().min(1),
});

export type CompanyFindInput = z.infer<typeof CompanyFindInputSchema>;

const CompanyFindResponseSchema = z
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

export type CompanyFindResponse = z.infer<typeof CompanyFindResponseSchema>;

export type BigpictureioEndpointInputs = {
	companyFind: CompanyFindInput;
};

export type BigpictureioEndpointOutputs = {
	companyFind: CompanyFindResponse;
};

export const BigpictureioEndpointInputSchemas = {
	companyFind: CompanyFindInputSchema,
} as const;

export const BigpictureioEndpointOutputSchemas = {
	companyFind: CompanyFindResponseSchema,
} as const;
