import { hubApiGet, hubApiPost } from './client/http';
import type { HubConfig } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Agent chats (SDK client)
//
// Thin CRUD-through-chat client over the Hub's `/threads` endpoints. The
// Hub-hosted agent authors and edits workflows from the conversation; the SDK
// just sends messages and reads back chats/messages. Auth is the project API
// key (Bearer); the tenant is sent in the body (POST) or query (GET).
//
// The Hub wire still names the chat `thread`/`threadId`; the public surface uses
// `chat`/`chatId`, so responses are remapped here (see `readAgentReply`).
// ─────────────────────────────────────────────────────────────────────────────

export type AgentMessageRole = 'user' | 'assistant' | 'system';

export type ChatSummary = {
	id: string;
	title: string;
	workflowId: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ChatMessage = {
	id: string;
	role: AgentMessageRole;
	content: string;
	workflowId: string | null;
	versionId: string | null;
	createdAt: string;
};

export type AgentReply = {
	chatId: string;
	message: ChatMessage;
	workflowId: string | null;
	action: 'created' | 'updated' | 'none';
};

export type CreateChatResult = {
	chat: ChatSummary;
	reply: AgentReply;
};

function asRecord(payload: unknown): Record<string, unknown> {
	return payload && typeof payload === 'object'
		? (payload as Record<string, unknown>)
		: {};
}

// The Hub sends `threadId`; the public reply names it `chatId`.
function readAgentReply(payload: unknown): AgentReply {
	const record = asRecord(payload);
	return {
		chatId: record.threadId as string,
		message: record.message as ChatMessage,
		workflowId: (record.workflowId ?? null) as string | null,
		action: record.action as AgentReply['action'],
	};
}

export async function createChat(
	hub: HubConfig,
	input: { tenantId: string; message: string },
): Promise<CreateChatResult> {
	return hubApiPost<CreateChatResult>({
		hub,
		path: '/threads',
		body: { tenantId: input.tenantId, message: input.message },
		parseResponse: (payload) => {
			const record = asRecord(payload);
			return {
				chat: record.thread as ChatSummary,
				reply: readAgentReply(record.reply),
			};
		},
	});
}

export async function postChatMessage(
	hub: HubConfig,
	input: { chatId: string; tenantId: string; message: string },
): Promise<AgentReply> {
	return hubApiPost<AgentReply>({
		hub,
		path: `/threads/${encodeURIComponent(input.chatId)}/messages`,
		body: { tenantId: input.tenantId, message: input.message },
		notFoundMessage: `Chat "${input.chatId}" not found`,
		parseResponse: readAgentReply,
	});
}

export async function listChats(
	hub: HubConfig,
	input: { tenantId: string },
): Promise<ChatSummary[]> {
	return hubApiGet<ChatSummary[]>({
		hub,
		path: `/threads?tenantId=${encodeURIComponent(input.tenantId)}`,
		parseResponse: (payload) => {
			const threads = asRecord(payload).threads;
			return Array.isArray(threads) ? (threads as ChatSummary[]) : [];
		},
	});
}

export async function listChatMessages(
	hub: HubConfig,
	input: { chatId: string; tenantId: string },
): Promise<ChatMessage[]> {
	return hubApiGet<ChatMessage[]>({
		hub,
		path: `/threads/${encodeURIComponent(input.chatId)}/messages?tenantId=${encodeURIComponent(
			input.tenantId,
		)}`,
		notFoundMessage: `Chat "${input.chatId}" not found`,
		parseResponse: (payload) => {
			const messages = asRecord(payload).messages;
			return Array.isArray(messages) ? (messages as ChatMessage[]) : [];
		},
	});
}
