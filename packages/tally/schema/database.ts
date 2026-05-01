import { z } from 'zod';

export const TallyForm = z.object({
	id: z.string(),
	name: z.string().optional(),
	status: z.string().optional(),
	workspaceId: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const TallySubmission = z.object({
	id: z.string(),
	formId: z.string().optional(),
	respondentId: z.string().nullable().optional(),
	isCompleted: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	fields: z.array(z.record(z.unknown())).optional(),
});

export const TallyWorkspace = z.object({
	id: z.string(),
	name: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type TallyForm = z.infer<typeof TallyForm>;
export type TallySubmission = z.infer<typeof TallySubmission>;
export type TallyWorkspace = z.infer<typeof TallyWorkspace>;
