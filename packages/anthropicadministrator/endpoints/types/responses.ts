import {
	ApiKeySchema,
	InviteSchema,
	ModelSchema,
	UserSchema,
	WorkspaceMemberSchema,
	WorkspaceSchema,
} from './entities';
import { listResponse } from './shared';

// ── list response schemas ────────────────────────────────────────────────────
export const ListUsersResponseSchema = listResponse(UserSchema);
export const ListInvitesResponseSchema = listResponse(InviteSchema);
export const ListWorkspacesResponseSchema = listResponse(WorkspaceSchema);
export const ListWorkspaceMembersResponseSchema = listResponse(
	WorkspaceMemberSchema,
);
export const ListApiKeysResponseSchema = listResponse(ApiKeySchema);
export const ListModelsResponseSchema = listResponse(ModelSchema);
