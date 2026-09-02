import { z } from 'zod';

export const BoldsignDocument = z
	.object({
		id: z.string(),
		title: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		next_cursor: z.number().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type BoldsignDocument = z.infer<typeof BoldsignDocument>;

export const BoldsignBrand = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type BoldsignBrand = z.infer<typeof BoldsignBrand>;

export const BoldsignCustomField = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		brand_id: z.string().nullable().optional(),
		updated_at: z.coerce.date().nullable().optional(),
	})
	.loose();

export type BoldsignCustomField = z.infer<typeof BoldsignCustomField>;
