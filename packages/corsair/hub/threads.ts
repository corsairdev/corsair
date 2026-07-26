import { hubApiGet, hubApiPost } from './client/http';
import type { HubConfig } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Agent chat threads (SDK client)
//
// Thin CRUD-through-chat client over the Hub's `/threads` endpoints. The
// Hub-hosted agent authors and edits workflows from the conversation; the SDK
// just sends messages and reads back threads/messages. Auth is the project API
// key (Bearer); the tenant is sent in the body (POST) or query (GET).
// ─────────────────────────────────────────────────────────────────────────────

export type AgentMessageRole = 'user' | 'assistant' | 'system';

export type ThreadSummary = {
	id: string;
	title: string;
	workflowId: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ThreadMessage = {
	id: string;
	role: AgentMessageRole;
	content: string;
	workflowId: string | null;
	versionId: string | null;
	createdAt: string;
};

export type AgentReply = {
	threadId: string;
	message: ThreadMessage;
	workflowId: string | null;
	action: 'created' | 'updated' | 'none';
};

export type CreateThreadResult = {
	thread: ThreadSummary;
	reply: AgentReply;
};

function asRecord(payload: unknown): Record<string, unknown> {
	return payload && typeof payload === 'object'
		? (payload as Record<string, unknown>)
		: {};
}

export async function createThread(
	hub: HubConfig,
	input: { tenantId: string; message: string },
): Promise<CreateThreadResult> {
	return hubApiPost<CreateThreadResult>({
		hub,
		path: '/threads',
		body: { tenantId: input.tenantId, message: input.message },
		parseResponse: (payload) => payload as CreateThreadResult,
	});
}

export async function postThreadMessage(
	hub: HubConfig,
	input: { threadId: string; tenantId: string; message: string },
): Promise<AgentReply> {
	return hubApiPost<AgentReply>({
		hub,
		path: `/threads/${encodeURIComponent(input.threadId)}/messages`,
		body: { tenantId: input.tenantId, message: input.message },
		notFoundMessage: `Thread "${input.threadId}" not found`,
		parseResponse: (payload) => payload as AgentReply,
	});
}

export async function listThreads(
	hub: HubConfig,
	input: { tenantId: string },
): Promise<ThreadSummary[]> {
	return hubApiGet<ThreadSummary[]>({
		hub,
		path: `/threads?tenantId=${encodeURIComponent(input.tenantId)}`,
		parseResponse: (payload) => {
			const threads = asRecord(payload).threads;
			return Array.isArray(threads) ? (threads as ThreadSummary[]) : [];
		},
	});
}

export async function listThreadMessages(
	hub: HubConfig,
	input: { threadId: string; tenantId: string },
): Promise<ThreadMessage[]> {
	return hubApiGet<ThreadMessage[]>({
		hub,
		path: `/threads/${encodeURIComponent(input.threadId)}/messages?tenantId=${encodeURIComponent(
			input.tenantId,
		)}`,
		notFoundMessage: `Thread "${input.threadId}" not found`,
		parseResponse: (payload) => {
			const messages = asRecord(payload).messages;
			return Array.isArray(messages) ? (messages as ThreadMessage[]) : [];
		},
	});
}
