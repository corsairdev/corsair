import { z } from 'zod';

export const ArynDocSet = z
	.object({
		docset_id: z.string(),
		name: z.string(),
		readonly: z.boolean(),
		properties: z.record(z.string(), z.unknown()).nullable().optional(),
		schema: z.unknown().nullable().optional(),
		size: z.number().nullable().optional(),
	})
	.loose();

export type ArynDocSet = z.infer<typeof ArynDocSet>;

export const ArynDocument = z
	.object({
		doc_id: z.string(),
		name: z.string().nullable().optional(),
		size: z.number().nullable().optional(),
		content_type: z.string().nullable().optional(),
		properties: z.record(z.string(), z.unknown()).nullable().optional(),
		account_id: z.string().nullable().optional(),
	})
	.loose();

export type ArynDocument = z.infer<typeof ArynDocument>;
