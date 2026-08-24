import { z } from 'zod';

// Sparse local cache — metadata only, not full email bodies.
export const AgentMailMessage = z.object({
	id: z.string(),
	inbox_id: z.string(),
	thread_id: z.string(),
	message_id: z.string(),
	labels: z.array(z.string()),
	timestamp: z.string(),
	from: z.string(),
	to: z.array(z.string()),
	size: z.number(),
	updated_at: z.string(),
	created_at: z.string(),
	subject: z.string().optional(),
	preview: z.string().optional(),
});

export type AgentMailMessage = z.infer<typeof AgentMailMessage>;
