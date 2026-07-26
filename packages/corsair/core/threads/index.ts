import type {
	AgentReply,
	CreateThreadResult,
	ThreadMessage,
	ThreadSummary,
} from '../../hub/threads';
import {
	createThread,
	listThreadMessages,
	listThreads,
	postThreadMessage,
} from '../../hub/threads';
import type { HubConfig } from '../../hub/types';

export type {
	AgentReply,
	CreateThreadResult,
	ThreadMessage,
	ThreadSummary,
} from '../../hub/threads';

/** Handle for one thread: `corsair.withTenant(t).threads(id).message(...)`. */
export interface ThreadHandle {
	/** Send a message to this thread; the agent may create/edit the workflow. */
	message(text: string): Promise<AgentReply>;
	/** List every message in this thread, oldest first. */
	listMessages(): Promise<ThreadMessage[]>;
}

/**
 * Chat interface over the Hub workflow agent. Callable to address one thread,
 * with methods to create and list threads:
 *   await corsair.withTenant('dev').threads.create('build a workflow that ...')
 *   await corsair.withTenant('dev').threads(id).message('actually, change it to ...')
 *   await corsair.withTenant('dev').threads.list()
 *   await corsair.withTenant('dev').threads.listMessages(threadId)
 */
export interface CorsairThreadsNamespace {
	(threadId: string): ThreadHandle;
	create(message: string): Promise<CreateThreadResult>;
	list(): Promise<ThreadSummary[]>;
	listMessages(threadId: string): Promise<ThreadMessage[]>;
}

export function buildThreadsNamespace(
	hub: HubConfig | undefined,
	tenantId: string,
): CorsairThreadsNamespace {
	const requireHub = (): HubConfig => {
		if (!hub) {
			throw new Error(
				'corsair.threads requires Hub to be configured. Pass `hub` to createCorsair({ hub: { projectApiKey, ... } }).',
			);
		}
		return hub;
	};

	const namespace = ((threadId: string): ThreadHandle => ({
		message: (text: string) =>
			postThreadMessage(requireHub(), { threadId, tenantId, message: text }),
		listMessages: () =>
			listThreadMessages(requireHub(), { threadId, tenantId }),
	})) as CorsairThreadsNamespace;

	namespace.create = (message: string) =>
		createThread(requireHub(), { tenantId, message });
	namespace.list = () => listThreads(requireHub(), { tenantId });
	namespace.listMessages = (threadId: string) =>
		listThreadMessages(requireHub(), { threadId, tenantId });

	return namespace;
}
