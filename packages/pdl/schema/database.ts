import { z } from 'zod';

/**
 * People matched by `person.enrich`, keyed by the PDL person id so
 * re-enriching the same profile refreshes the row instead of duplicating it.
 */
export const PdlPerson = z.object({
	pdlId: z.string(),
	name: z.string().nullable().optional(),
	jobTitle: z.string().nullable().optional(),
	jobCompanyName: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	country: z.string().nullable().optional(),
	locality: z.string().nullable().optional(),
	likelihood: z.number().min(1).max(10).nullable().optional(),
	enrichedAt: z.coerce.date().nullable().optional(),
});

export type PdlPerson = z.infer<typeof PdlPerson>;

/**
 * Companies matched by `company.enrich`, keyed by the PDL company id with
 * the website as fallback when PDL returns no id.
 */
export const PdlCompany = z.object({
	companyId: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
	ticker: z.string().nullable().optional(),
	industry: z.string().nullable().optional(),
	employeeCount: z.number().nullable().optional(),
	foundedYear: z.number().nullable().optional(),
	likelihood: z.number().min(1).max(10).nullable().optional(),
	enrichedAt: z.coerce.date().nullable().optional(),
});

export type PdlCompany = z.infer<typeof PdlCompany>;
