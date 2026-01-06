import { initializePlugin } from '../base';
import { createPostHogClient } from './client';
import { createAlias } from './operations/create-alias';
import { createEvent } from './operations/create-event';
import { createIdentity } from './operations/create-identity';
import { handlePostHogWebhook } from './operations/handle-webhook';
import { trackPage } from './operations/track-page';
import { trackScreen } from './operations/track-screen';
import { posthogDefaultSchema } from './schema';
import type {
	PostHogDatabaseContext,
	PostHogPlugin,
	PostHogPluginContext,
	PostHogSchemaOverride,
} from './types';

/**
 * Creates a PostHog plugin instance with database access
 * Uses the unified initialization flow from base plugin system
 */
export function createPostHogPlugin<
	TSchemaOverride extends PostHogSchemaOverride = PostHogSchemaOverride,
	TDatabase extends
		PostHogDatabaseContext<TSchemaOverride> = PostHogDatabaseContext<TSchemaOverride>,
>(config: PostHogPlugin, db: unknown) {
	// Initialize plugin using unified flow
	const initResult = initializePlugin(
		config,
		posthogDefaultSchema,
		db,
		(config) => createPostHogClient(config.apiKey, config.apiHost),
	);
	const { config: pluginConfig, client, ctx } = {
		...initResult,
		ctx: {
			...initResult.ctx,
			db: initResult.db as PostHogDatabaseContext<TSchemaOverride>,
		},
	} as {
		config: PostHogPlugin;
		client: ReturnType<typeof createPostHogClient>;
		ctx: PostHogPluginContext<TSchemaOverride>;
	};

	return {
		createEvent: async (params: {
			distinct_id: string;
			event: string;
			properties?: Record<string, unknown>;
			timestamp?: string;
			uuid?: string;
		}): Promise<ReturnType<typeof createEvent>> => {
			return createEvent({
				config: pluginConfig,
				client,
				distinct_id: params.distinct_id,
				event: params.event,
				properties: params.properties,
				timestamp: params.timestamp,
				uuid: params.uuid,
				ctx,
			});
		},

		createIdentity: async (params: {
			distinct_id: string;
			properties?: Record<string, unknown>;
		}): Promise<ReturnType<typeof createIdentity>> => {
			return createIdentity({
				config: pluginConfig,
				client,
				distinct_id: params.distinct_id,
				properties: params.properties,
				ctx,
			});
		},

		createAlias: async (params: {
			distinct_id: string;
			alias: string;
		}): Promise<ReturnType<typeof createAlias>> => {
			return createAlias({
				config: pluginConfig,
				client,
				distinct_id: params.distinct_id,
				alias: params.alias,
				ctx,
			});
		},

		trackPage: async (params: {
			distinct_id: string;
			url: string;
			properties?: Record<string, unknown>;
			timestamp?: string;
			uuid?: string;
		}): Promise<ReturnType<typeof trackPage>> => {
			return trackPage({
				config: pluginConfig,
				client,
				distinct_id: params.distinct_id,
				url: params.url,
				properties: params.properties,
				timestamp: params.timestamp,
				uuid: params.uuid,
				ctx,
			});
		},

		trackScreen: async (params: {
			distinct_id: string;
			screen_name: string;
			properties?: Record<string, unknown>;
			timestamp?: string;
			uuid?: string;
		}): Promise<ReturnType<typeof trackScreen>> => {
			return trackScreen({
				config: pluginConfig,
				client,
				distinct_id: params.distinct_id,
				screen_name: params.screen_name,
				properties: params.properties,
				timestamp: params.timestamp,
				uuid: params.uuid,
				ctx,
			});
		},

		handleWebhook: async (params: {
			headers: Record<string, string | undefined>;
			payload: string | object | object[];
			secret?: string;
		}): Promise<ReturnType<typeof handlePostHogWebhook>> => {
			return handlePostHogWebhook({
				config: pluginConfig,
				client,
				ctx,
				headers: params.headers,
				payload: params.payload,
				secret: params.secret,
			});
		},
	};
}

export type { PostHogPlugin, PostHogSchemaOverride, PostHogPluginContext };

