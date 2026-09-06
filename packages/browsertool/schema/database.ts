import { z } from 'zod';

/**
 * Composio tool execution envelope.
 * Official toolkit outputs: https://docs.composio.dev/toolkits/browser_tool
 * Execute API: https://docs.composio.dev/reference/api-reference/tools/postToolsExecuteByToolSlug
 */
export const BrowserToolExecution = z.object({
	data: z.unknown(),
	error: z.string().nullable().optional(),
	successful: z.boolean(),
	session_info: z.unknown().nullable().optional(),
	log_id: z.string().optional(),
});
export type BrowserToolExecution = z.infer<typeof BrowserToolExecution>;

/**
 * Fields named in WatchTask / CreateTask docs.
 * Official: https://docs.composio.dev/toolkits/browser_tool
 */
export const BrowserToolTask = z
	.object({
		taskId: z.string().optional(),
		sessionId: z.string().optional(),
		watch_task_id: z.string().optional(),
		browser_session_id: z.string().optional(),
		status: z.string().optional(),
		is_success: z.boolean().optional(),
		current_goal: z.string().optional(),
		current_url: z.string().optional(),
		liveUrl: z.string().optional(),
		output: z.unknown().optional(),
		outputFiles: z.array(z.unknown()).optional(),
	})
	.loose();
export type BrowserToolTask = z.infer<typeof BrowserToolTask>;
