import type { CorsairToolDef } from '@corsair-dev/mcp';
import type { CoreMessage } from 'ai';
import type { AnyCorsairInstance } from 'corsair';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { handleChat } from '../chat/handler.js';
import type { AgentKysely } from '../db/schema.js';
import type { CronScheduler } from '../scheduler/cron.js';
import type { HeartbeatScheduler } from '../scheduler/heartbeat.js';
import type { CorsairAgentOptions } from '../types.js';

export type AgentMcpContext = {
	db: AgentKysely;
	corsair: AnyCorsairInstance;
	options: CorsairAgentOptions;
	cronScheduler: CronScheduler;
	heartbeatScheduler: HeartbeatScheduler;
};

// In-memory session store: session_id → conversation history.
// Lives for the lifetime of the process; suitable for long-running MCP servers.
const sessions = new Map<string, CoreMessage[]>();

export function buildAgentMcpTools(ctx: AgentMcpContext): CorsairToolDef[] {
	return [
		{
			name: 'agent_chat',
			description:
				'Send a message to the Corsair workflow agent. The agent can create, update, list, and delete persistent background jobs, run one-off scripts against your connected tools, and answer questions about your integrations. Pass session_id from a previous response to continue a conversation across multiple turns.',
			shape: {
				message: z.string().describe('Your message or request for the agent'),
				session_id: z
					.string()
					.optional()
					.describe(
						'Session ID returned by a previous agent_chat call. Omit to start a new conversation.',
					),
			},
			handler: async (args) => {
				const { message, session_id } = args as {
					message: string;
					session_id?: string;
				};

				const sid = session_id ?? randomUUID();
				const history = sessions.get(sid) ?? [];

				const result = await handleChat(message, ctx, history);

				const replyText =
					result.type === 'message' ? result.text : result.message;

				sessions.set(sid, [
					...history,
					{ role: 'user', content: message },
					{ role: 'assistant', content: replyText },
				]);

				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify({
								reply: replyText,
								session_id: sid,
								result_type: result.type,
								...(result.type === 'job_created' ||
								result.type === 'job_updated'
									? { job_id: result.job.id }
									: {}),
								...(result.type === 'job_deleted'
									? { job_id: result.jobId }
									: {}),
							}),
						},
					],
					isError: false,
				};
			},
		},
	];
}
