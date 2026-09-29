import { z } from 'zod';

/** Official PersonResponseDto fields used for local storage. */
export const ChMeetingsPerson = z.object({
	id: z.union([z.string(), z.number()]),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	full_name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	mobile: z.string().nullable().optional(),
	gender: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

/** Official OrganizationResponse fields. */
export const ChMeetingsOrganization = z.object({
	id: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	type: z.enum(['diocese', 'church', 'ministry']).optional(),
	parent_id: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

/** Official EventApiDetails fields. */
export const ChMeetingsEvent = z.object({
	id: z.union([z.string(), z.number()]),
	title: z.string().nullable().optional(),
	start_date: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type ChMeetingsPerson = z.infer<typeof ChMeetingsPerson>;
export type ChMeetingsOrganization = z.infer<typeof ChMeetingsOrganization>;
export type ChMeetingsEvent = z.infer<typeof ChMeetingsEvent>;
