import type { AgentMailMessage } from './schema';

type CacheCtx = {
	db: {
		messages?: {
			upsertByEntityId: (
				entityId: string,
				data: AgentMailMessage,
			) => Promise<{ id?: string } | null | undefined>;
		};
	};
};

type MessageLike = {
	message_id: string;
	inbox_id: string;
	thread_id: string;
	labels: string[];
	timestamp: string;
	from: string;
	to: string[];
	size: number;
	updated_at: string;
	created_at: string;
	subject?: string;
	preview?: string;
};

export async function cacheAgentMailMessage(
	ctx: CacheCtx,
	message: MessageLike,
): Promise<string> {
	if (!ctx.db.messages) return '';

	try {
		const row: AgentMailMessage = {
			id: message.message_id,
			inbox_id: message.inbox_id,
			thread_id: message.thread_id,
			message_id: message.message_id,
			labels: message.labels,
			timestamp: message.timestamp,
			from: message.from,
			to: message.to,
			size: message.size,
			updated_at: message.updated_at,
			created_at: message.created_at,
			subject: message.subject,
			preview: message.preview,
		};
		const entity = await ctx.db.messages.upsertByEntityId(
			message.message_id,
			row,
		);
		return entity?.id || '';
	} catch (error) {
		console.warn('Failed to save AgentMail message to database:', error);
		return '';
	}
}
