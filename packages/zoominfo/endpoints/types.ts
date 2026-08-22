import { z } from 'zod';

const SearchCompaniesInputSchema = z.object({
	companyName: z.string().optional(),
	industry: z.string().optional(),
	location: z.string().optional(),
	employeeCountMin: z.number().optional(),
	employeeCountMax: z.number().optional(),
});

export type SearchCompaniesInput = z.infer<typeof SearchCompaniesInputSchema>;

const SearchCompaniesResponseSchema = z.object({
	companies: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			industry: z.string().optional(),
			employeeCount: z.number().optional(),
			website: z.string().optional(),
		}),
	),
});

export type SearchCompaniesResponse = z.infer<
	typeof SearchCompaniesResponseSchema
>;

export type ZoominfoEndpointInputs = {
	searchCompanies: SearchCompaniesInput;
};

export type ZoominfoEndpointOutputs = {
	searchCompanies: SearchCompaniesResponse;
};

export const ZoominfoEndpointInputSchemas = {
	searchCompanies: SearchCompaniesInputSchema,
} as const;

export const ZoominfoEndpointOutputSchemas = {
	searchCompanies: SearchCompaniesResponseSchema,
} as const;
