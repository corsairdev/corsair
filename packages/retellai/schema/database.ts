import { z } from 'zod';

// These nested values are provider-defined and extensible. The outer entity
// remains validated while unknown nested fields are intentionally preserved.
export const RetellCallEntity = z
	.object({
		call_id: z.string(),
		call_type: z.string().optional(),
		agent_id: z.string().optional(),
		call_status: z.string().optional(),
		start_timestamp: z.number().optional(),
		end_timestamp: z.number().optional(),
		transcript: z.string().optional(),
		transcript_object: z.array(z.record(z.string(), z.unknown())).optional(),
		recording_url: z.string().optional(),
		call_analysis: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export const RetellChatEntity = z
	.object({
		chat_id: z.string(),
		agent_id: z.string().optional(),
		chat_status: z.string().optional(),
		start_timestamp: z.number().optional(),
		end_timestamp: z.number().optional(),
		transcript: z.string().optional(),
		transcript_with_tool_calls: z
			.array(z.record(z.string(), z.unknown()))
			.optional(),
		chat_analysis: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type RetellCallEntity = z.infer<typeof RetellCallEntity>;
export type RetellChatEntity = z.infer<typeof RetellChatEntity>;
