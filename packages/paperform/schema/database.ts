import { z } from 'zod';

export const PaperformFormEntity = z.object({
	id: z.string().min(1),
	title: z.string().optional(),
	slug: z.string().optional(),
});

export const PaperformSpaceEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
});

/** Translation row. The mapping object is not stored. */
export const PaperformTranslationEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
});

export type PaperformFormEntity = z.infer<typeof PaperformFormEntity>;
export type PaperformSpaceEntity = z.infer<typeof PaperformSpaceEntity>;
export type PaperformTranslationEntity = z.infer<
	typeof PaperformTranslationEntity
>;
