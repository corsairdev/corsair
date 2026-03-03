import { z } from 'zod';

export const AirtableRecord = z.object({
	id: z.string(),
	fields: z.record(z.unknown()).optional(),
	createdTime: z.string().optional(),
	baseId: z.string().optional(),
	tableId: z.string().optional(),
});

export const AirtableBase = z.object({
	id: z.string(),
	name: z.string().optional(),
	permissionLevel: z.string().optional(),
});

export type AirtableRecord = z.infer<typeof AirtableRecord>;
export type AirtableBase = z.infer<typeof AirtableBase>;
