import {
	ApiKeySchema,
	InviteSchema,
	UserSchema,
	WorkspaceMemberSchema,
	WorkspaceSchema,
} from '../endpoints/types/index';

/**
 * Cached entities are the Admin API response objects verbatim, so the schemas
 * are reused directly from `endpoints/types` rather than restated — a
 * second copy could drift from the shape the API actually returns.
 *
 * Field names and types follow the Admin API reference objects:
 * users https://platform.claude.com/docs/en/api/admin/users,
 * invites https://platform.claude.com/docs/en/api/admin/invites,
 * workspaces https://platform.claude.com/docs/en/api/admin/workspaces,
 * workspace members https://platform.claude.com/docs/en/api/admin/workspaces/members,
 * API keys https://platform.claude.com/docs/en/api/admin/api_keys.
 *
 * Workspace members have no standalone ID and are keyed by
 * `${workspace_id}:${user_id}` (see `endpoints/shared.ts`).
 */
export const AnthropicAdministratorUser = UserSchema;
export const AnthropicAdministratorInvite = InviteSchema;
export const AnthropicAdministratorWorkspace = WorkspaceSchema;
export const AnthropicAdministratorWorkspaceMember = WorkspaceMemberSchema;
export const AnthropicAdministratorApiKey = ApiKeySchema;
