import { z } from 'zod';

export const CarboneTemplate = z
	.object({
		versionId: z
			.string()
			.optional()
			.describe('Unique version identifier of the template'),
		id: z.string().nullable().optional().describe('Template identifier alias'),
		name: z.string().optional().describe('Name of the template'),
		category: z
			.string()
			.optional()
			.describe('Category folder organizing the template'),
		type: z
			.string()
			.optional()
			.describe('Document format/type of the template file'),
		size: z.number().optional().describe('File size of the template in bytes'),
		comment: z
			.string()
			.optional()
			.describe('Version description or user comment'),
		tags: z
			.array(z.string())
			.optional()
			.describe('List of tag strings attached to the template'),
		deployedAt: z
			.number()
			.nullable()
			.optional()
			.describe('Timestamp when the template version was deployed'),
		createdAt: z
			.number()
			.optional()
			.describe('Timestamp when the template was created'),
		expireAt: z
			.number()
			.nullable()
			.optional()
			.describe('Timestamp when the template expires and is deleted'),
		origin: z
			.number()
			.optional()
			.describe('Origin source type identifier of the template'),
	})
	.describe('Carbone document template entity schema');
export type CarboneTemplate = z.infer<typeof CarboneTemplate>;

export const CarboneCategory = z
	.object({
		name: z.string().describe('Category name identifier'),
	})
	.describe('Carbone template category entity schema');
export type CarboneCategory = z.infer<typeof CarboneCategory>;

export const CarboneTag = z
	.object({
		name: z.string().describe('Tag name identifier'),
	})
	.describe('Carbone template tag entity schema');
export type CarboneTag = z.infer<typeof CarboneTag>;
