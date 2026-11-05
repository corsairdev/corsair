import { z } from 'zod';

export const AgentyAgent = z
	.object({
		agent_id: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
		status: z.string().optional(),
	})
	.catchall(z.unknown());

export const AgentyJob = z
	.object({
		job_id: z.number().optional(),
		agent_id: z.string().optional(),
		status: z.string().optional(),
	})
	.catchall(z.unknown());

export const AgentyList = z
	.object({
		list_id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
	})
	.catchall(z.unknown());

export type AgentyAgent = z.infer<typeof AgentyAgent>;
export type AgentyJob = z.infer<typeof AgentyJob>;
export type AgentyList = z.infer<typeof AgentyList>;
