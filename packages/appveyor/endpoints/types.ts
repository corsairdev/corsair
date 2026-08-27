import { z } from 'zod';

const ProjectsListInputSchema = z.object({});

const ProjectsListOutputSchema = z.array(
	z
		.object({
			projectId: z.number(),
			accountName: z.string().optional(),
			name: z.string(),
			slug: z.string(),
			repositoryType: z.string().optional(),
			repositoryName: z.string().optional(),
		})
		.passthrough(),
);

const BuildsGetLastInputSchema = z.object({
	accountName: z.string(),
	projectSlug: z.string(),
});

const BuildsGetLastOutputSchema = z
	.object({
		project: z
			.object({
				projectId: z.number(),
				accountName: z.string().optional(),
				name: z.string(),
				slug: z.string(),
				repositoryType: z.string().optional(),
				repositoryName: z.string().optional(),
			})
			.passthrough(),
		build: z
			.object({
				buildId: z.number(),
				buildNumber: z.number(),
				version: z.string().optional(),
				message: z.string().optional(),
				branch: z.string().optional(),
				status: z.string(),
			})
			.passthrough(),
	})
	.passthrough();

export const EndpointInputSchemas = {
	projectsList: ProjectsListInputSchema,
	buildsGetLast: BuildsGetLastInputSchema,
} as const;

export type EndpointInputs = {
	[K in keyof typeof EndpointInputSchemas]: z.infer<
		(typeof EndpointInputSchemas)[K]
	>;
};

export const EndpointOutputSchemas = {
	projectsList: ProjectsListOutputSchema,
	buildsGetLast: BuildsGetLastOutputSchema,
} as const;

export type EndpointOutputs = {
	[K in keyof typeof EndpointOutputSchemas]: z.infer<
		(typeof EndpointOutputSchemas)[K]
	>;
};

export type ProjectsListResponse = z.infer<
	typeof EndpointOutputSchemas.projectsList
>;

export type BuildsGetLastResponse = z.infer<
	typeof EndpointOutputSchemas.buildsGetLast
>;
