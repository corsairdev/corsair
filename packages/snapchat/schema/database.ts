import { z } from 'zod';

export const SnapchatActionEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		updated_at: z.coerce.date().nullable().optional(),
		created_at: z.coerce.date().nullable().optional(),
		data: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type SnapchatActionEntity = z.infer<typeof SnapchatActionEntity>;
