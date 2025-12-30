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
	createBaseHTTPClient,
	createBaseGraphQLClient,
	BaseAPIError,
	createErrorResponse,
	createSuccessResponse,
	executeDatabaseHook,
	validateCredentials,
	wrapOperation,
	BaseWebhookHandler,
	SignatureVerifiers,
	createBasePlugin,
	initializePlugin,
} from './base';

// Export plugin-specific types
export type { GitHubSchemaOverride } from './github/schema';
export type { GitHubPlugin } from './github/types';
export type { GmailSchemaOverride } from './gmail/schema';
export type { GmailPlugin } from './gmail/types';
export type { LinearSchemaOverride } from './linear/schema';
export type { LinearPlugin } from './linear/types';
export type { SlackSchemaOverride } from './slack/schema';
export type { SlackChannels, SlackMembers, SlackPlugin } from './slack/types';
