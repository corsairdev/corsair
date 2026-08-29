import { z } from 'zod';

export const CapsuleCrmParty = z.object({
	id: z.string(),
	type: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	organisation: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type CapsuleCrmParty = z.infer<typeof CapsuleCrmParty>;