import { z } from 'zod';

export const FilloutForm = z
	.object({
		formId: z.string(),
		name: z.string(),
	})
	.loose();

export type FilloutForm = z.infer<typeof FilloutForm>;

export const FilloutFormMetadata = z
	.object({
		id: z.string(),
		name: z.string(),
		questions: z.array(z.record(z.string(), z.unknown())),
		calculations: z.array(z.record(z.string(), z.unknown())).optional(),
		urlParameters: z.array(z.record(z.string(), z.unknown())).optional(),
		scheduling: z.array(z.record(z.string(), z.unknown())).optional(),
		payments: z.array(z.record(z.string(), z.unknown())).optional(),
		quiz: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type FilloutFormMetadata = z.infer<typeof FilloutFormMetadata>;

export const FilloutSubmission = z
	.object({
		submissionId: z.string(),
		submissionTime: z.string(),
		lastUpdatedAt: z.string().optional(),
		questions: z.array(z.record(z.string(), z.unknown())),
		calculations: z.array(z.record(z.string(), z.unknown())).optional(),
		urlParameters: z.array(z.record(z.string(), z.unknown())).optional(),
		scheduling: z.array(z.record(z.string(), z.unknown())).optional(),
		payments: z.array(z.record(z.string(), z.unknown())).optional(),
		quiz: z.record(z.string(), z.unknown()).optional(),
		login: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type FilloutSubmission = z.infer<typeof FilloutSubmission>;

export const FilloutWebhook = z
	.object({
		id: z.union([z.string(), z.number()]),
		formId: z.string().optional(),
		url: z.string().optional(),
	})
	.loose();

export type FilloutWebhook = z.infer<typeof FilloutWebhook>;

export const ZiteDatabase = z
	.object({
		id: z.string(),
		name: z.string(),
		url: z.string().optional(),
	})
	.loose();

export type ZiteDatabase = z.infer<typeof ZiteDatabase>;

export const ZiteRecord = z
	.object({
		id: z.string(),
		data: z.record(z.string(), z.unknown()).optional(),
		fields: z.record(z.string(), z.unknown()).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type ZiteRecord = z.infer<typeof ZiteRecord>;
