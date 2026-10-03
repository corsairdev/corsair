import { z } from 'zod';

export const CodaDocument = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string().optional(),
		href: z.string().optional(),
		browserLink: z.string().optional(),
	})
	.loose();

export type CodaDocument = z.infer<typeof CodaDocument>;

export const CodaTable = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.string().optional(),
		href: z.string().optional(),
		browserLink: z.string().optional(),
	})
	.loose();

export type CodaTable = z.infer<typeof CodaTable>;
