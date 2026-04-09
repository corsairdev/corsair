import z from 'zod';

export const CursorAgent = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		status: z
			.enum(['RUNNING', 'FINISHED', 'ERROR', 'CREATING', 'EXPIRED'])
			.optional(),
		summary: z.string().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		sourceRef: z.string().optional(),
		sourceRepository: z.string().optional(),
		targetUrl: z.string().optional(),
		targetPrUrl: z.string().optional(),
		targetBranchName: z.string().optional(),
		targetAutoCreatePr: z.boolean().optional(),
	})
	.passthrough();

export type CursorAgent = z.infer<typeof CursorAgent>;

export const CursorRepository = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		owner: z.string().optional(),
		repository: z.string().optional(),
	})
	.passthrough();

export type CursorRepository = z.infer<typeof CursorRepository>;

export const CursorModel = z
	.object({
		id: z.string(),
	})
	.passthrough();

export type CursorModel = z.infer<typeof CursorModel>;

export const CursorApiKey = z
	.object({
		id: z.string(),
		apiKeyName: z.string(),
		createdAt: z.coerce.date().nullable().optional(),
		userEmail: z.string().optional(),
	})
	.passthrough();

export type CursorApiKey = z.infer<typeof CursorApiKey>;
