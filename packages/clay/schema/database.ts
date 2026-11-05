import { z } from 'zod';

// Source: PublicApiPersonSearchResult in https://developers.clay.com/openapi.json
export const ClayPerson = z.object({
	clayProfileId: z.number(),
	name: z.string().nullable(),
	firstName: z.string().nullable(),
	lastName: z.string().nullable(),
	linkedinUrl: z.string().nullable().optional(),
	location: z.string().nullable(),
	currentTitle: z.string().nullable().optional(),
	currentCompany: z.string().nullable().optional(),
});

export type ClayPerson = z.infer<typeof ClayPerson>;

// Source: PublicApiCompanySearchResult in https://developers.clay.com/openapi.json
export const ClayCompany = z.object({
	clayCompanyId: z.number(),
	name: z.string().nullable(),
	domain: z.string().nullable(),
	size: z.string().nullable(),
	industry: z.string().nullable(),
	country: z.string().nullable(),
	linkedinUrl: z.string().nullable(),
});

export type ClayCompany = z.infer<typeof ClayCompany>;

// Source: RunRoutineResponse, RunResultsInProgress and RunResultsComplete in
// https://developers.clay.com/openapi.json
export const ClayRoutineRun = z.object({
	routineRunId: z.string(),
	routineId: z.string().optional(),
	status: z.string(),
	total: z.number().optional(),
	finished: z.number().optional(),
	updatedAt: z.coerce.date(),
});

export type ClayRoutineRun = z.infer<typeof ClayRoutineRun>;
