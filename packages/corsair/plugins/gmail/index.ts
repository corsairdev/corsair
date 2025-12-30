import { initializePlugin } from '../base';
import { createGmailClient } from './client';
import { createDraft } from './operations/create-draft';
import { getMessage } from './operations/get-message';
import { getThread } from './operations/get-thread';
import { listLabels } from './operations/list-labels';
import { listMessages } from './operations/list-messages';
import { listThreads } from './operations/list-threads';
import { sendMessage } from './operations/send-message';
import { gmailDefaultSchema } from './schema';
import type {
	GmailDatabaseContext,
	GmailPlugin,
	GmailPluginContext,
	GmailSchemaOverride,
} from './types';

/**
 * Creates a Gmail plugin instance with database access
 * Uses the unified initialization flow from base plugin system
 */
export function createGmailPlugin<
	TSchemaOverride extends GmailSchemaOverride = GmailSchemaOverride,
	TDatabase extends
		GmailDatabaseContext<TSchemaOverride> = GmailDatabaseContext<TSchemaOverride>,
>(config: GmailPlugin, db: unknown) {
	// Initialize plugin using unified flow
	const initResult = initializePlugin(
		config,
		gmailDefaultSchema,
		db,
		(config) => createGmailClient(config.accessToken),
	);
	const { config: pluginConfig, client, ctx: baseCtx } = {
		...initResult,
		ctx: {
			...initResult.ctx,
			db: initResult.db as GmailDatabaseContext<TSchemaOverride>,
		},
	} as {
		config: GmailPlugin;
		client: ReturnType<typeof createGmailClient>;
		ctx: GmailPluginContext<TSchemaOverride>;
	};

	// Gmail uses userId from config, so we override the ctx
	const ctx = {
		...baseCtx,
		userId: pluginConfig.userId,
	} as GmailPluginContext<TSchemaOverride>;

	return {
		sendMessage: async (params: {
			to: string;
			subject: string;
			body: string;
			threadId?: string;
		}): Promise<ReturnType<typeof sendMessage>> => {
			return sendMessage({
				config: pluginConfig,
				client,
				to: params.to,
				subject: params.subject,
				body: params.body,
				threadId: params.threadId,
				ctx,
			});
		},

		listMessages: async (params?: {
			maxResults?: number;
			pageToken?: string;
			q?: string;
			labelIds?: string[];
		}): Promise<ReturnType<typeof listMessages>> => {
			return listMessages({
				config: pluginConfig,
				client,
				options: params,
				ctx,
			});
		},

		getMessage: async (params: {
			messageId: string;
		}): Promise<ReturnType<typeof getMessage>> => {
			return getMessage({
				config: pluginConfig,
				client,
				messageId: params.messageId,
				ctx,
			});
		},

		listThreads: async (params?: {
			maxResults?: number;
			pageToken?: string;
			q?: string;
			labelIds?: string[];
		}): Promise<ReturnType<typeof listThreads>> => {
			return listThreads({
				config: pluginConfig,
				client,
				options: params,
				ctx,
			});
		},

		getThread: async (params: {
			threadId: string;
		}): Promise<ReturnType<typeof getThread>> => {
			return getThread({
				config: pluginConfig,
				client,
				threadId: params.threadId,
				ctx,
			});
		},

		listLabels: async (): Promise<ReturnType<typeof listLabels>> => {
			return listLabels({
				config: pluginConfig,
				client,
				ctx,
			});
		},

		createDraft: async (params: {
			to: string;
			subject: string;
			body: string;
		}): Promise<ReturnType<typeof createDraft>> => {
			return createDraft({
				config: pluginConfig,
				client,
				to: params.to,
				subject: params.subject,
				body: params.body,
				ctx,
			});
		},
	};
}

export type { GmailPlugin, GmailSchemaOverride, GmailPluginContext };
