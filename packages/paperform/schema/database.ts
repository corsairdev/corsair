import { z } from 'zod';

export const PaperformFormEntity = z.object({
	id: z.string().min(1),
	title: z.string().optional(),
	slug: z.string().optional(),
	spaceId: z.string().optional(),
	live: z.boolean().optional(),
	submissionCount: z.number().optional(),
});

export const PaperformSpaceEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
});

/** Translation row. The mapping object is not stored. */
export const PaperformTranslationEntity = z.object({
	id: z.string().min(1),
	title: z.string().optional(),
	language: z.string().optional(),
});

/** Submission metadata only. Answers, device and IP address are not stored. */
export const PaperformSubmissionEntity = z.object({
	id: z.string().min(1),
	formId: z.string().optional(),
	createdAt: z.string().optional(),
});

export type PaperformFormEntity = z.infer<typeof PaperformFormEntity>;
export type PaperformSpaceEntity = z.infer<typeof PaperformSpaceEntity>;
export type PaperformTranslationEntity = z.infer<
	typeof PaperformTranslationEntity
>;
export type PaperformSubmissionEntity = z.infer<
	typeof PaperformSubmissionEntity
>;
