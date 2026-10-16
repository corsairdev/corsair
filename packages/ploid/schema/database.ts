import { z } from 'zod';

// One contact field as returned by POST /v1/enrich, kept so a later enrich of
// the same person shows when a value went stale.
export const ContactField = z.object({
	value: z.string().nullable(),
	status: z.enum(['found', 'not_found', 'unavailable']),
	confidence: z.enum(['guess', 'strong', 'verified']).nullable().optional(),
	lastSeen: z.string().nullable().optional(),
});

// The stable Ploid person_id is the entity key. Rows merge: resolve plants
// the identity, person.get deepens it, enrich adds contact fields.
export const Person = z.object({
	personId: z.string(),
	name: z.string().nullable().optional(),
	headline: z.string().nullable().optional(),
	company: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	linkedinUrl: z.string().nullable().optional(),
	profileUrl: z.string().nullable().optional(),
	githubUrl: z.string().nullable().optional(),
	xUrl: z.string().nullable().optional(),
	identityVerified: z.boolean().optional(),
	confidence: z.number().nullable().optional(),
	summary: z.string().nullable().optional(),
	workEmail: ContactField.optional(),
	personalEmail: ContactField.optional(),
	phone: ContactField.optional(),
	sources: z.array(z.string()).optional(),
	updatedAt: z.coerce.date().optional(),
});

export type ContactField = z.infer<typeof ContactField>;
export type Person = z.infer<typeof Person>;
