import { z } from 'zod';

export const KaggleDatasetEntity = z.object({
	ref: z.string(),
	title: z.string().optional(),
});
export type KaggleDatasetEntity = z.infer<typeof KaggleDatasetEntity>;

export const KaggleModelEntity = z.object({
	ref: z.string(),
	title: z.string().optional(),
});
export type KaggleModelEntity = z.infer<typeof KaggleModelEntity>;

export const KaggleCompetitionEntity = z.object({
	ref: z.string(),
	title: z.string().optional(),
});
export type KaggleCompetitionEntity = z.infer<typeof KaggleCompetitionEntity>;

export const KaggleKernelEntity = z.object({
	ref: z.string(),
	title: z.string().optional(),
});
export type KaggleKernelEntity = z.infer<typeof KaggleKernelEntity>;
