import { z } from 'zod';

export const DockerHubRepoRef = z.object({
	id: z.string(),
	namespace: z.string().optional(),
	name: z.string().optional(),
});
export type DockerHubRepoRef = z.infer<typeof DockerHubRepoRef>;
