import type {
	ResolvedGmailSchema,
	GmailDefaultSchema,
	GmailSchemaOverride,
} from './schema';

export type GmailPlugin = {
	/**
	 * Gmail API access token
	 */
	accessToken: string;
	/**
	 * Optional refresh token for token refresh
	 */
	refreshToken?: string;
	/**
	 * Optional user ID (defaults to 'me')
	 */
	userId?: string;
	/**
	 * Schema override configuration
	 */
	schema?: GmailSchemaOverride;
};

export type BaseGmailPluginResponse<T extends Record<string, unknown>> = {
	success: boolean;
	data?: T;
	error?: string;
};

// Response type for sendMessage operation
export type SendMessageResponse = BaseGmailPluginResponse<{
	messageId: string;
	threadId: string;
	labelIds: string[];
}>;

// Response type for listMessages operation
export type ListMessagesResponse = BaseGmailPluginResponse<{
	messages: Array<{
		id: string;
		threadId: string;
	}>;
	nextPageToken?: string;
	resultSizeEstimate: number;
}>;

// Response type for getMessage operation
export type GetMessageResponse = BaseGmailPluginResponse<{
	id: string;
	threadId: string;
	subject: string;
	from: string;
	to: string;
	body: string;
	date: string;
	labelIds: string[];
	snippet: string;
}>;

// Response type for listThreads operation
export type ListThreadsResponse = BaseGmailPluginResponse<{
	threads: Array<{
		id: string;
		historyId: string;
		snippet: string;
	}>;
	nextPageToken?: string;
	resultSizeEstimate: number;
}>;

// Response type for getThread operation
export type GetThreadResponse = BaseGmailPluginResponse<{
	id: string;
	historyId: string;
	messages: Array<{
		id: string;
		threadId: string;
		snippet: string;
	}>;
}>;

// Response type for listLabels operation
export type ListLabelsResponse = BaseGmailPluginResponse<{
	labels: Array<{
		id: string;
		name: string;
		type: string;
		color?: string;
	}>;
}>;

// Response type for createDraft operation
export type CreateDraftResponse = BaseGmailPluginResponse<{
	id: string;
	messageId: string;
}>;

/**
 * Database context type for plugin operations
 * This provides typed database access based on the resolved schema
 */
export type GmailDatabaseContext<
	TSchemaOverride extends GmailSchemaOverride = GmailSchemaOverride,
> = {
	[K in keyof ResolvedGmailSchema<TSchemaOverride>]: ResolvedGmailSchema<TSchemaOverride>[K] extends never
		? never
		: {
				insert: (data: Record<string, unknown>) => Promise<unknown>;
				select: () => Promise<Array<Record<string, unknown>>>;
				update: (
					data: Record<string, unknown>,
				) => Promise<unknown>;
				delete: () => Promise<unknown>;
			};
};

/**
 * Plugin operation context
 * Includes database access and other context
 */
export type GmailPluginContext<
	TSchemaOverride extends GmailSchemaOverride = GmailSchemaOverride,
> = {
	db: GmailDatabaseContext<TSchemaOverride>;
	userId?: string;
};

/**
 * GmailClient type for operations
 */
export type { GmailClient } from './client';

export type { GmailSchemaOverride } from './schema';

