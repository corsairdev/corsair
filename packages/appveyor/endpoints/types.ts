import { z } from 'zod';

export const EndpointInputSchemas = {
	getProjects: z.object({}),
	getLastBuild: z.object({
		accountName: z.string(),
		projectSlug: z.string(),
	}),
} as const;

export const EndpointOutputSchemas = {
	getProjects: z.array(z.unknown()),
	getLastBuild: z.unknown(),
} as const;
