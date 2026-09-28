import { z } from 'zod';

export const AppVeyorSchema = {
	version: '1.0.0',
	entities: {
		projects: z.object({}).passthrough(),
		builds: z.object({}).passthrough(),
	},
} as const;
