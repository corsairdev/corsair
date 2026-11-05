import type {
	AgentReply,
	ChatMessage,
	ChatSummary,
	CreateChatResult,
} from '../../hub/chats';
import {
	createChat,
	listChatMessages,
	listChats,
	postChatMessage,
} from '../../hub/chats';
import type { HubConfig } from '../../hub/types';

export type {
	AgentMessageRole,
	AgentReply,
	ChatMessage,
	ChatSummary,
	CreateChatResult,
} from '../../hub/chats';

/** Handle for one chat: `corsair.withTenant(t).chats.get(id).message(...)`. */
export interface ChatHandle {
	/** Send a message to this chat; the agent may create/edit the workflow. */
	message(text: string): Promise<AgentReply>;
	/** List every message in this chat, oldest first. */
	listMessages(): Promise<ChatMessage[]>;
}

/**
 * Chat interface over the Hub workflow agent:
 *   await corsair.withTenant('dev').chats.create('build a workflow that ...')
 *   await corsair.withTenant('dev').chats.list()
 *   await corsair.withTenant('dev').chats.get(id).message('actually, change it to ...')
 *   await corsair.withTenant('dev').chats.get(id).listMessages()
 */
export interface CorsairChatsNamespace {
	create(message: string): Promise<CreateChatResult>;
	list(): Promise<ChatSummary[]>;
	get(chatId: string): ChatHandle;
}

export function buildChatsNamespace(
	hub: HubConfig | undefined,
	tenantId: string,
): CorsairChatsNamespace {
	const requireHub = (): HubConfig => {
		if (!hub) {
			throw new Error(
				'corsair.chats requires Hub to be configured. Pass `hub` to createCorsair({ hub: { projectApiKey, ... } }).',
			);
		}
		return hub;
	};

	return {
		create: (message) => createChat(requireHub(), { tenantId, message }),
		list: () => listChats(requireHub(), { tenantId }),
		get: (chatId) => ({
			message: (text) =>
				postChatMessage(requireHub(), { chatId, tenantId, message: text }),
			listMessages: () => listChatMessages(requireHub(), { chatId, tenantId }),
		}),
	};
}
