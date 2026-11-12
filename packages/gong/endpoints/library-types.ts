import { z } from 'zod';

const folder = z
	.object({
		id: z.string(),
		name: z.string(),
		parentFolderId: z.string().nullable().optional(),
	})
	.passthrough();
const libraryCall = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		note: z.string().optional(),
		addedBy: z.string().optional(),
		created: z.string().optional(),
		url: z.string().optional(),
		snippet: z
			.object({
				fromSec: z.number().optional(),
				toSec: z.number().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
	})
	.passthrough();
export const GongLibraryInputSchemas = {
	getLibraryStructure: z.object({ workspaceId: z.string().optional() }),
	getCallsInSpecificFolder: z.object({
		folderId: z.string().regex(/^\d{1,20}$/),
	}),
} as const;
export const GongLibraryOutputSchemas = {
	getLibraryStructure: z
		.object({ requestId: z.string(), folders: z.array(folder) })
		.passthrough(),
	getCallsInSpecificFolder: z
		.object({
			requestId: z.string(),
			id: z.string(),
			name: z.string(),
			createdBy: z.string(),
			updated: z.string(),
			calls: z.array(libraryCall),
		})
		.passthrough(),
} as const;
export type GongLibraryInputs = {
	[K in keyof typeof GongLibraryInputSchemas]: z.infer<
		(typeof GongLibraryInputSchemas)[K]
	>;
};
export type GongLibraryOutputs = {
	[K in keyof typeof GongLibraryOutputSchemas]: z.infer<
		(typeof GongLibraryOutputSchemas)[K]
	>;
};
