import z from 'zod';

export const AppVeyorProject = z
	.object({
		projectId: z.number(),
		name: z.string(),
		slug: z.string(),
	})
	.passthrough();

export const AppVeyorBuild = z
	.object({
		buildId: z.number(),
		buildNumber: z.number(),
		status: z.string(),
	})
	.passthrough();

export type AppVeyorProject = z.infer<typeof AppVeyorProject>;
export type AppVeyorBuild = z.infer<typeof AppVeyorBuild>;
