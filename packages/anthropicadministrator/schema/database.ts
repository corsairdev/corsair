import {
	ApiKeySchema,
	InviteSchema,
	UserSchema,
	WorkspaceMemberSchema,
	WorkspaceSchema,
} from '../endpoints/types';

/**
 * Cached entities are the Admin API response objects verbatim, so the schemas
 * are reused directly from `endpoints/types.ts` rather than restated — a
 * second copy could drift from the shape the API actually returns.
 *
 * Workspace members have no standalone ID and are keyed by
 * `${workspace_id}:${user_id}` (see `endpoints/shared.ts`).
 */
export const AnthropicAdministratorUser = UserSchema;
export const AnthropicAdministratorInvite = InviteSchema;
export const AnthropicAdministratorWorkspace = WorkspaceSchema;
export const AnthropicAdministratorWorkspaceMember = WorkspaceMemberSchema;
export const AnthropicAdministratorApiKey = ApiKeySchema;
