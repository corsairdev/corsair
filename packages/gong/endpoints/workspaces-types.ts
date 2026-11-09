import { z } from 'zod';

export const GongWorkspacesInputSchemas = {
	listWorkspaces: z.object({}),
} as const;
export const GongWorkspacesOutputSchemas = {
	listWorkspaces: z
		.object({
			requestId: z.string(),
			workspaces: z.array(
				z
					.object({ id: z.string(), name: z.string(), description: z.string() })
					.passthrough(),
			),
		})
		.passthrough(),
} as const;
export type GongWorkspacesInputs = {
	[K in keyof typeof GongWorkspacesInputSchemas]: z.infer<
		(typeof GongWorkspacesInputSchemas)[K]
	>;
};
export type GongWorkspacesOutputs = {
	[K in keyof typeof GongWorkspacesOutputSchemas]: z.infer<
		(typeof GongWorkspacesOutputSchemas)[K]
	>;
};
