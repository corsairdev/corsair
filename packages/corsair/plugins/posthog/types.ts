import type {
	BasePluginConfig,
	BasePluginContext,
	BasePluginResponse,
	BaseDatabaseContext,
} from '../base';
import type { PostHogSchemaOverride, ResolvedPostHogSchema } from './schema';

export type PostHogPlugin = BasePluginConfig<PostHogSchemaOverride> & {
	/**
	 * PostHog API key (project API key)
	 */
	apiKey: string;
	/**
	 * PostHog API host (optional, defaults to https://app.posthog.com)
	 */
	apiHost?: string;
};

export type BasePostHogPluginResponse<T extends Record<string, unknown>> =
	BasePluginResponse<T>;

// Response type for createEvent operation
export type CreateEventResponse = BasePostHogPluginResponse<{
	success: boolean;
	distinct_id: string;
	event: string;
}>;

// Response type for createIdentity operation
export type CreateIdentityResponse = BasePostHogPluginResponse<{
	success: boolean;
	distinct_id: string;
}>;

// Response type for createAlias operation
export type CreateAliasResponse = BasePostHogPluginResponse<{
	success: boolean;
	distinct_id: string;
	alias: string;
}>;

// Response type for trackPage operation
export type TrackPageResponse = BasePostHogPluginResponse<{
	success: boolean;
	distinct_id: string;
	url: string;
}>;

// Response type for trackScreen operation
export type TrackScreenResponse = BasePostHogPluginResponse<{
	success: boolean;
	distinct_id: string;
	screen_name: string;
}>;

/**
 * Database context type for plugin operations
 */
export type PostHogDatabaseContext<
	TSchemaOverride extends PostHogSchemaOverride = PostHogSchemaOverride,
> = BaseDatabaseContext<ResolvedPostHogSchema<TSchemaOverride>>;

/**
 * Plugin operation context
 */
export type PostHogPluginContext<
	TSchemaOverride extends PostHogSchemaOverride = PostHogSchemaOverride,
> = BasePluginContext<ResolvedPostHogSchema<TSchemaOverride>>;

/**
 * PostHogClient type for operations
 */
export type { PostHogClient } from './client';

export type { PostHogSchemaOverride } from './schema';

