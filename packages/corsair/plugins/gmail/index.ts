import { createGmailClient } from './client';
import type {
	GmailDatabaseContext,
	GmailPlugin,
	GmailPluginContext,
	GmailSchemaOverride,
} from './types';
import { sendMessage } from './operations/send-message';
import { listMessages } from './operations/list-messages';
import { getMessage } from './operations/get-message';
import { listThreads } from './operations/list-threads';
import { getThread } from './operations/get-thread';
import { listLabels } from './operations/list-labels';
import { createDraft } from './operations/create-draft';

/**
 * Creates a Gmail plugin instance with database access
 */
export function createGmailPlugin<
	TSchemaOverride extends GmailSchemaOverride = GmailSchemaOverride,
	TDatabase extends GmailDatabaseContext<TSchemaOverride> = GmailDatabaseContext<TSchemaOverride>,
>(config: GmailPlugin, db: TDatabase) {
	const client = createGmailClient(config.accessToken);

	return {
		sendMessage: async (params: {
			to: string;
			subject: string;
			body: string;
			threadId?: string;
		}): Promise<ReturnType<typeof sendMessage>> => {
			return sendMessage({
				config,
				client,
				to: params.to,
				subject: params.subject,
				body: params.body,
				threadId: params.threadId,
				ctx: { db, userId: config.userId },
			});
		},

		listMessages: async (params?: {
			maxResults?: number;
			pageToken?: string;
			q?: string;
			labelIds?: string[];
		}): Promise<ReturnType<typeof listMessages>> => {
			return listMessages({
				config,
				client,
				options: params,
				ctx: { db, userId: config.userId },
			});
		},

		getMessage: async (params: {
			messageId: string;
		}): Promise<ReturnType<typeof getMessage>> => {
			return getMessage({
				config,
				client,
				messageId: params.messageId,
				ctx: { db, userId: config.userId },
			});
		},

		listThreads: async (params?: {
			maxResults?: number;
			pageToken?: string;
			q?: string;
			labelIds?: string[];
		}): Promise<ReturnType<typeof listThreads>> => {
			return listThreads({
				config,
				client,
				options: params,
				ctx: { db, userId: config.userId },
			});
		},

		getThread: async (params: {
			threadId: string;
		}): Promise<ReturnType<typeof getThread>> => {
			return getThread({
				config,
				client,
				threadId: params.threadId,
				ctx: { db, userId: config.userId },
			});
		},

		listLabels: async (): Promise<ReturnType<typeof listLabels>> => {
			return listLabels({
				config,
				client,
				ctx: { db, userId: config.userId },
			});
		},

		createDraft: async (params: {
			to: string;
			subject: string;
			body: string;
		}): Promise<ReturnType<typeof createDraft>> => {
			return createDraft({
				config,
				client,
				to: params.to,
				subject: params.subject,
				body: params.body,
				ctx: { db, userId: config.userId },
			});
		},
	};
}

export type { GmailPlugin, GmailSchemaOverride, GmailPluginContext };

