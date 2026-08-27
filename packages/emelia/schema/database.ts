import { z } from 'zod';

export const EmeliaCampaign = z.object({
	id: z.string(),
	name: z.string().optional(),
	status: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});
export type EmeliaCampaign = z.infer<typeof EmeliaCampaign>;

export const EmeliaContactList = z.object({
	id: z.string(),
	name: z.string().optional(),
	contact_count: z.number().optional(),
	fields: z.array(z.string()).optional(),
});
export type EmeliaContactList = z.infer<typeof EmeliaContactList>;
