// Export base plugin types
export type {
	BaseDefaultSchema,
	BasePluginConfig,
	BasePluginContext,
	BasePluginCredentials,
	BasePluginResponse,
	BaseSchemaOverride,
	BaseDatabaseContext,
	ResolvedSchema,
	SchemaOverrideValue,
} from './base';

// Export base utilities
export {
	createDatabaseContext,
	resolveSchema,
	BaseAPIError,
	createErrorResponse,
	createSuccessResponse,
	executeDatabaseHook,
	validateCredentials,
	wrapOperation,
	BaseWebhookHandler,
	SignatureVerifiers,
	initializePlugin,
} from './base';

// Export plugin-specific types
export type { GitHubSchemaOverride } from './github/schema';
export type { GitHubPlugin } from './github/types';
export type { GmailSchemaOverride } from './gmail/schema';
export type { GmailPlugin } from './gmail/types';
export type { HubSpotSchemaOverride } from './hubspot/schema';
export type { HubSpotPlugin } from './hubspot/types';
export type { LinearSchemaOverride } from './linear/schema';
export type { LinearPlugin } from './linear/types';
export type { PostHogSchemaOverride } from './posthog/schema';
export type { PostHogPlugin } from './posthog/types';
export type { SlackSchemaOverride } from './slack/schema';
export type { SlackChannels, SlackMembers, SlackPlugin } from './slack/types';
