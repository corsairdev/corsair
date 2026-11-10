import { z } from 'zod';

// Gong ids are 64-bit; a string keeps the digits a JavaScript number would round.
const gongId = z.union([
	z.string().regex(/^\d{1,20}$/),
	z.number().int().nonnegative(),
]);
export const GongTargetsInputSchemas = {
	listTargetDefinitions: z.object({ workspaceId: gongId }),
	uploadAssignments: z.object({
		targetId: z.string().regex(/^\d{1,20}$/),
		workspaceId: gongId,
		validateOnly: z.boolean().optional(),
		file: z.instanceof(Blob),
	}),
} as const;
export const GongTargetsOutputSchemas = {
	listTargetDefinitions: z
		.object({
			requestId: z.string(),
			targets: z.array(
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						description: z.string().optional(),
						type: z.string().optional(),
						unit: z.string().optional(),
						hierarchyType: z.string().optional(),
						createdDateTime: z.string().nullable().optional(),
					})
					.passthrough(),
			),
		})
		.passthrough(),
	uploadAssignments: z
		.object({
			requestId: z.string(),
			validateOnly: z.boolean(),
			processedRows: z.number().int(),
		})
		.passthrough(),
} as const;
export type GongTargetsInputs = {
	[K in keyof typeof GongTargetsInputSchemas]: z.infer<
		(typeof GongTargetsInputSchemas)[K]
	>;
};
export type GongTargetsOutputs = {
	[K in keyof typeof GongTargetsOutputSchemas]: z.infer<
		(typeof GongTargetsOutputSchemas)[K]
	>;
};
