import { z } from 'zod';
import {
	TurbotPipesActorSchema,
	TurbotPipesConnectionSchema,
	TurbotPipesDatatankSchema,
	TurbotPipesOrgSchema,
	TurbotPipesProcessSchema,
	TurbotPipesUserSchema,
	TurbotPipesWorkspaceSchema,
} from '../schema/database';

// ── Actor Schemas ────────────────────────────────────────────────────────────
export const ActorGetInputSchema = z.object({});
export type ActorGetInput = z.infer<typeof ActorGetInputSchema>;

export const ActorListWorkspacesInputSchema = z.object({
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ActorListWorkspacesInput = z.infer<
	typeof ActorListWorkspacesInputSchema
>;

export const ActorListOrgsInputSchema = z.object({
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ActorListOrgsInput = z.infer<typeof ActorListOrgsInputSchema>;

export const ActorListConnectionsInputSchema = z.object({
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ActorListConnectionsInput = z.infer<
	typeof ActorListConnectionsInputSchema
>;

export const ActorListActivityInputSchema = z.object({
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ActorListActivityInput = z.infer<
	typeof ActorListActivityInputSchema
>;

// ── Users Schemas ────────────────────────────────────────────────────────────
export const GetUserInputSchema = z.object({ user_handle: z.string() });
export type GetUserInput = z.infer<typeof GetUserInputSchema>;

export const UpdateUserInputSchema = z.object({
	user_handle: z.string(),
	display_name: z.string().optional(),
	url: z.string().optional(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;

export const ListUserWorkspacesInputSchema = z.object({
	user_handle: z.string(),
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ListUserWorkspacesInput = z.infer<
	typeof ListUserWorkspacesInputSchema
>;

export const GetUserWorkspaceInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type GetUserWorkspaceInput = z.infer<typeof GetUserWorkspaceInputSchema>;

export const UpdateUserWorkspaceInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	desired_state: z.string().optional(),
	instance_type: z.string().optional(),
	db_volume_size: z.number().optional(),
});
export type UpdateUserWorkspaceInput = z.infer<
	typeof UpdateUserWorkspaceInputSchema
>;

export const RunUserWorkspaceCommandInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	command: z.string(),
});
export type RunUserWorkspaceCommandInput = z.infer<
	typeof RunUserWorkspaceCommandInputSchema
>;

export const ListUserProcessesInputSchema = z.object({
	user_handle: z.string(),
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ListUserProcessesInput = z.infer<
	typeof ListUserProcessesInputSchema
>;

export const GetUserProcessInputSchema = z.object({
	user_handle: z.string(),
	process_id: z.string(),
});
export type GetUserProcessInput = z.infer<typeof GetUserProcessInputSchema>;

export const ListUserUsageInputSchema = z.object({ user_handle: z.string() });
export type ListUserUsageInput = z.infer<typeof ListUserUsageInputSchema>;

export const ListUserConstraintsInputSchema = z.object({
	user_handle: z.string(),
});
export type ListUserConstraintsInput = z.infer<
	typeof ListUserConstraintsInputSchema
>;

export const ListUserAuditLogsInputSchema = z.object({
	user_handle: z.string(),
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ListUserAuditLogsInput = z.infer<
	typeof ListUserAuditLogsInputSchema
>;

export const GetUserEmailInputSchema = z.object({
	user_handle: z.string(),
	email_id: z.string(),
});
export type GetUserEmailInput = z.infer<typeof GetUserEmailInputSchema>;

export const ListUserEmailsInputSchema = z.object({ user_handle: z.string() });
export type ListUserEmailsInput = z.infer<typeof ListUserEmailsInputSchema>;

export const GetUserPreferencesInputSchema = z.object({
	user_handle: z.string(),
});
export type GetUserPreferencesInput = z.infer<
	typeof GetUserPreferencesInputSchema
>;

// unknown: subscription toggles are a provider-defined map of channel to preference.
export const EmailSubscriptionsSchema = z.record(z.string(), z.unknown());

export const UpdateUserPreferencesInputSchema = z.object({
	user_handle: z.string(),
	email_subscriptions: EmailSubscriptionsSchema.optional(),
});
export type UpdateUserPreferencesInput = z.infer<
	typeof UpdateUserPreferencesInputSchema
>;

export const DeleteUserAvatarInputSchema = z.object({
	user_handle: z.string(),
});
export type DeleteUserAvatarInput = z.infer<typeof DeleteUserAvatarInputSchema>;

// ── Orgs Schemas ─────────────────────────────────────────────────────────────
export const GetOrgInputSchema = z.object({ org_handle: z.string() });
export type GetOrgInput = z.infer<typeof GetOrgInputSchema>;

export const DeleteOrgInputSchema = z.object({ org_handle: z.string() });
export type DeleteOrgInput = z.infer<typeof DeleteOrgInputSchema>;

export const ListOrgWorkspacesInputSchema = z.object({
	org_handle: z.string(),
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ListOrgWorkspacesInput = z.infer<
	typeof ListOrgWorkspacesInputSchema
>;

export const DeleteOrgWorkspaceInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
});
export type DeleteOrgWorkspaceInput = z.infer<
	typeof DeleteOrgWorkspaceInputSchema
>;

export const RunOrgWorkspaceCommandInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	command: z.string(),
});
export type RunOrgWorkspaceCommandInput = z.infer<
	typeof RunOrgWorkspaceCommandInputSchema
>;

export const ListOrgProcessesInputSchema = z.object({
	org_handle: z.string(),
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ListOrgProcessesInput = z.infer<typeof ListOrgProcessesInputSchema>;

export const ListOrgServiceAccountsInputSchema = z.object({
	org_handle: z.string(),
});
export type ListOrgServiceAccountsInput = z.infer<
	typeof ListOrgServiceAccountsInputSchema
>;

export const UpdateOrgServiceAccountInputSchema = z.object({
	org_handle: z.string(),
	service_account_handle: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
});
export type UpdateOrgServiceAccountInput = z.infer<
	typeof UpdateOrgServiceAccountInputSchema
>;

export const UpdateOrgServiceAccountTokenInputSchema = z.object({
	org_handle: z.string(),
	service_account_handle: z.string(),
	token_id: z.string(),
	status: z.string().optional(),
});
export type UpdateOrgServiceAccountTokenInput = z.infer<
	typeof UpdateOrgServiceAccountTokenInputSchema
>;

export const GetOrgMemberInputSchema = z.object({
	org_handle: z.string(),
	user_handle: z.string(),
});
export type GetOrgMemberInput = z.infer<typeof GetOrgMemberInputSchema>;

export const UpdateOrgMemberRoleInputSchema = z.object({
	org_handle: z.string(),
	user_handle: z.string(),
	role: z.string(),
});
export type UpdateOrgMemberRoleInput = z.infer<
	typeof UpdateOrgMemberRoleInputSchema
>;

export const ListOrgUsageInputSchema = z.object({ org_handle: z.string() });
export type ListOrgUsageInput = z.infer<typeof ListOrgUsageInputSchema>;

// ── Connections Schemas ──────────────────────────────────────────────────────
// unknown: connection and integration configs are provider-defined maps (e.g.
// AWS/GCP credentials); the provider does not fix a shared shape.
export const ProviderConfigSchema = z.record(z.string(), z.unknown());

export const CreateUserConnectionInputSchema = z.object({
	user_handle: z.string(),
	handle: z.string(),
	plugin: z.string(),
	config: ProviderConfigSchema.optional(),
});
export type CreateUserConnectionInput = z.infer<
	typeof CreateUserConnectionInputSchema
>;

export const GetUserConnectionInputSchema = z.object({
	user_handle: z.string(),
	connection_handle: z.string(),
});
export type GetUserConnectionInput = z.infer<
	typeof GetUserConnectionInputSchema
>;

export const ListUserConnectionsInputSchema = z.object({
	user_handle: z.string(),
	limit: z.number().optional(),
	next_token: z.string().optional(),
});
export type ListUserConnectionsInput = z.infer<
	typeof ListUserConnectionsInputSchema
>;

export const UpdateUserConnectionInputSchema = z.object({
	user_handle: z.string(),
	connection_handle: z.string(),
	handle: z.string().optional(),
	config: ProviderConfigSchema.optional(),
});
export type UpdateUserConnectionInput = z.infer<
	typeof UpdateUserConnectionInputSchema
>;

export const DeleteUserConnectionDeprecatedInputSchema = z.object({
	user_handle: z.string(),
	connection_handle: z.string(),
});
export type DeleteUserConnectionDeprecatedInput = z.infer<
	typeof DeleteUserConnectionDeprecatedInputSchema
>;

export const TestUserConnectionInputSchema = z.object({
	user_handle: z.string(),
	connection_handle: z.string().optional(),
	plugin: z.string(),
	config: ProviderConfigSchema,
});
export type TestUserConnectionInput = z.infer<
	typeof TestUserConnectionInputSchema
>;

export const CreateOrgConnectionInputSchema = z.object({
	org_handle: z.string(),
	handle: z.string(),
	plugin: z.string(),
	config: ProviderConfigSchema.optional(),
});
export type CreateOrgConnectionInput = z.infer<
	typeof CreateOrgConnectionInputSchema
>;

export const UpdateOrgConnectionInputSchema = z.object({
	org_handle: z.string(),
	connection_handle: z.string(),
	handle: z.string().optional(),
	config: ProviderConfigSchema.optional(),
});
export type UpdateOrgConnectionInput = z.infer<
	typeof UpdateOrgConnectionInputSchema
>;

export const GetOrgConnectionPermissionInputSchema = z.object({
	org_handle: z.string(),
	connection_handle: z.string(),
});
export type GetOrgConnectionPermissionInput = z.infer<
	typeof GetOrgConnectionPermissionInputSchema
>;

export const DeleteOrgConnectionPermissionInputSchema = z.object({
	org_handle: z.string(),
	connection_handle: z.string(),
});
export type DeleteOrgConnectionPermissionInput = z.infer<
	typeof DeleteOrgConnectionPermissionInputSchema
>;

export const CreateOrgConnectionFolderInputSchema = z.object({
	org_handle: z.string(),
	title: z.string(),
	parent_id: z.string().optional(),
});
export type CreateOrgConnectionFolderInput = z.infer<
	typeof CreateOrgConnectionFolderInputSchema
>;

export const UpdateOrgConnectionFolderInputSchema = z.object({
	org_handle: z.string(),
	folder_id: z.string(),
	title: z.string().optional(),
});
export type UpdateOrgConnectionFolderInput = z.infer<
	typeof UpdateOrgConnectionFolderInputSchema
>;

// ── Workspaces Schemas ───────────────────────────────────────────────────────
export const CreateUserWorkspaceConnectionInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	connection_handle: z.string(),
});
export type CreateUserWorkspaceConnectionInput = z.infer<
	typeof CreateUserWorkspaceConnectionInputSchema
>;

export const GetUserWorkspaceConnectionInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	connection_handle: z.string(),
});
export type GetUserWorkspaceConnectionInput = z.infer<
	typeof GetUserWorkspaceConnectionInputSchema
>;

export const ListUserWorkspaceConnectionsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceConnectionsInput = z.infer<
	typeof ListUserWorkspaceConnectionsInputSchema
>;

export const ListUserWorkspaceConnectionAssociationsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceConnectionAssociationsInput = z.infer<
	typeof ListUserWorkspaceConnectionAssociationsInputSchema
>;

export const ListUserWorkspaceConnectionTreeInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceConnectionTreeInput = z.infer<
	typeof ListUserWorkspaceConnectionTreeInputSchema
>;

export const TestUserWorkspaceConnectionInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	connection_handle: z.string(),
});
export type TestUserWorkspaceConnectionInput = z.infer<
	typeof TestUserWorkspaceConnectionInputSchema
>;

export const CreateUserWorkspaceConnectionFolderInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	title: z.string(),
});
export type CreateUserWorkspaceConnectionFolderInput = z.infer<
	typeof CreateUserWorkspaceConnectionFolderInputSchema
>;

export const GetUserWorkspaceConnectionFolderInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	folder_id: z.string(),
});
export type GetUserWorkspaceConnectionFolderInput = z.infer<
	typeof GetUserWorkspaceConnectionFolderInputSchema
>;

export const ListUserWorkspaceConnectionFoldersInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceConnectionFoldersInput = z.infer<
	typeof ListUserWorkspaceConnectionFoldersInputSchema
>;

export const CreateOrgWorkspaceConnectionInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	connection_handle: z.string(),
});
export type CreateOrgWorkspaceConnectionInput = z.infer<
	typeof CreateOrgWorkspaceConnectionInputSchema
>;

export const GetOrgWorkspaceConnectionInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	connection_handle: z.string(),
});
export type GetOrgWorkspaceConnectionInput = z.infer<
	typeof GetOrgWorkspaceConnectionInputSchema
>;

export const CreateOrgWorkspaceConnectionFolderInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	title: z.string(),
});
export type CreateOrgWorkspaceConnectionFolderInput = z.infer<
	typeof CreateOrgWorkspaceConnectionFolderInputSchema
>;

export const GetOrgWorkspaceConnectionFolderInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	folder_id: z.string(),
});
export type GetOrgWorkspaceConnectionFolderInput = z.infer<
	typeof GetOrgWorkspaceConnectionFolderInputSchema
>;

export const CreateOrgWorkspaceAggregatorInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	handle: z.string(),
	connections: z.array(z.string()),
});
export type CreateOrgWorkspaceAggregatorInput = z.infer<
	typeof CreateOrgWorkspaceAggregatorInputSchema
>;

export const GetUserWorkspaceAggregatorInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	aggregator_handle: z.string(),
});
export type GetUserWorkspaceAggregatorInput = z.infer<
	typeof GetUserWorkspaceAggregatorInputSchema
>;

export const ListUserWorkspaceAggregatorsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceAggregatorsInput = z.infer<
	typeof ListUserWorkspaceAggregatorsInputSchema
>;

export const ListUserWorkspaceAggregatorConnectionsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	aggregator_handle: z.string(),
});
export type ListUserWorkspaceAggregatorConnectionsInput = z.infer<
	typeof ListUserWorkspaceAggregatorConnectionsInputSchema
>;

export const ListUserWorkspaceAuditLogsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceAuditLogsInput = z.infer<
	typeof ListUserWorkspaceAuditLogsInputSchema
>;

export const ListUserWorkspaceDatabaseLogsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceDatabaseLogsInput = z.infer<
	typeof ListUserWorkspaceDatabaseLogsInputSchema
>;

export const ListUserWorkspaceProcessesInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceProcessesInput = z.infer<
	typeof ListUserWorkspaceProcessesInputSchema
>;

export const GetUserWorkspaceProcessInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	process_id: z.string(),
});
export type GetUserWorkspaceProcessInput = z.infer<
	typeof GetUserWorkspaceProcessInputSchema
>;

export const GetUserWorkspaceProcessLogInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	process_id: z.string(),
	log_file: z.string(),
	content_type: z.string().optional(),
});
export type GetUserWorkspaceProcessLogInput = z.infer<
	typeof GetUserWorkspaceProcessLogInputSchema
>;

export const ListOrgWorkspaceProcessesInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListOrgWorkspaceProcessesInput = z.infer<
	typeof ListOrgWorkspaceProcessesInputSchema
>;

export const ListUserWorkspaceUsageInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceUsageInput = z.infer<
	typeof ListUserWorkspaceUsageInputSchema
>;

// ── Query & Snapshot Schemas ─────────────────────────────────────────────────
export const CreateOrgWorkspaceQueryInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	sql: z.string(),
});
export type CreateOrgWorkspaceQueryInput = z.infer<
	typeof CreateOrgWorkspaceQueryInputSchema
>;

export const GetOrgWorkspaceQueryDataInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	sql: z.string(),
});
export type GetOrgWorkspaceQueryDataInput = z.infer<
	typeof GetOrgWorkspaceQueryDataInputSchema
>;

export const CreateOrgWorkspaceSnapshotInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	title: z.string().optional(),
});
export type CreateOrgWorkspaceSnapshotInput = z.infer<
	typeof CreateOrgWorkspaceSnapshotInputSchema
>;

export const GetUserWorkspaceQueryInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	sql: z.string(),
});
export type GetUserWorkspaceQueryInput = z.infer<
	typeof GetUserWorkspaceQueryInputSchema
>;

export const GetUserWorkspaceQueryDataInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	sql: z.string(),
});
export type GetUserWorkspaceQueryDataInput = z.infer<
	typeof GetUserWorkspaceQueryDataInputSchema
>;

export const PostUserWorkspaceQueryInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	sql: z.string(),
});
export type PostUserWorkspaceQueryInput = z.infer<
	typeof PostUserWorkspaceQueryInputSchema
>;

export const RunUserWorkspaceQueryInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	sql: z.string(),
});
export type RunUserWorkspaceQueryInput = z.infer<
	typeof RunUserWorkspaceQueryInputSchema
>;

export const ListUserWorkspaceSnapshotsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceSnapshotsInput = z.infer<
	typeof ListUserWorkspaceSnapshotsInputSchema
>;

// ── AI Schemas ───────────────────────────────────────────────────────────────
export const CreateUserAiKeyInputSchema = z.object({
	user_handle: z.string(),
	provider: z.string(),
	key: z.string(),
});
export type CreateUserAiKeyInput = z.infer<typeof CreateUserAiKeyInputSchema>;

export const GetUserAiKeyInputSchema = z.object({
	user_handle: z.string(),
	provider: z.string(),
});
export type GetUserAiKeyInput = z.infer<typeof GetUserAiKeyInputSchema>;

export const ListUserAiKeysInputSchema = z.object({ user_handle: z.string() });
export type ListUserAiKeysInput = z.infer<typeof ListUserAiKeysInputSchema>;

export const UpdateUserAiKeyInputSchema = z.object({
	user_handle: z.string(),
	provider: z.string(),
	key: z.string(),
});
export type UpdateUserAiKeyInput = z.infer<typeof UpdateUserAiKeyInputSchema>;

export const TestUserAiKeyInputSchema = z.object({
	user_handle: z.string(),
	provider: z.string(),
	key: z.string(),
});
export type TestUserAiKeyInput = z.infer<typeof TestUserAiKeyInputSchema>;

export const DeleteOrgWorkspaceConversationInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	conversation_id: z.string(),
});
export type DeleteOrgWorkspaceConversationInput = z.infer<
	typeof DeleteOrgWorkspaceConversationInputSchema
>;

export const GetUserWorkspaceConversationInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	conversation_id: z.string(),
});
export type GetUserWorkspaceConversationInput = z.infer<
	typeof GetUserWorkspaceConversationInputSchema
>;

export const UpdateUserWorkspaceConversationInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	conversation_id: z.string(),
	title: z.string(),
});
export type UpdateUserWorkspaceConversationInput = z.infer<
	typeof UpdateUserWorkspaceConversationInputSchema
>;

export const ListUserWorkspaceConversationsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceConversationsInput = z.infer<
	typeof ListUserWorkspaceConversationsInputSchema
>;

export const SendUserWorkspaceChatMessageInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	message: z.string(),
	conversation_id: z.string().optional(),
});
export type SendUserWorkspaceChatMessageInput = z.infer<
	typeof SendUserWorkspaceChatMessageInputSchema
>;

// ── Integrations Schemas ─────────────────────────────────────────────────────
export const CreateUserIntegrationInputSchema = z.object({
	user_handle: z.string(),
	integration_handle: z.string(),
	type: z.string(),
});
export type CreateUserIntegrationInput = z.infer<
	typeof CreateUserIntegrationInputSchema
>;

export const DeleteUserIntegrationInputSchema = z.object({
	user_handle: z.string(),
	integration_handle: z.string(),
});
export type DeleteUserIntegrationInput = z.infer<
	typeof DeleteUserIntegrationInputSchema
>;

export const GetUserIntegrationInputSchema = z.object({
	user_handle: z.string(),
	integration_handle: z.string(),
});
export type GetUserIntegrationInput = z.infer<
	typeof GetUserIntegrationInputSchema
>;

export const ListUserIntegrationsInputSchema = z.object({
	user_handle: z.string(),
});
export type ListUserIntegrationsInput = z.infer<
	typeof ListUserIntegrationsInputSchema
>;

export const UpdateUserIntegrationInputSchema = z.object({
	user_handle: z.string(),
	integration_handle: z.string(),
	state: z.string().optional(),
});
export type UpdateUserIntegrationInput = z.infer<
	typeof UpdateUserIntegrationInputSchema
>;

export const TestUserIntegrationInputSchema = z.object({
	user_handle: z.string(),
	integration_handle: z.string(),
	type: z.string(),
});
export type TestUserIntegrationInput = z.infer<
	typeof TestUserIntegrationInputSchema
>;

export const GetOrgWorkspaceIntegrationInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	integration_handle: z.string(),
});
export type GetOrgWorkspaceIntegrationInput = z.infer<
	typeof GetOrgWorkspaceIntegrationInputSchema
>;

export const GetOrgIntegrationInputSchema = z.object({
	org_handle: z.string(),
	integration_handle: z.string(),
});
export type GetOrgIntegrationInput = z.infer<
	typeof GetOrgIntegrationInputSchema
>;

export const GetUserWorkspaceIntegrationInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	integration_handle: z.string(),
});
export type GetUserWorkspaceIntegrationInput = z.infer<
	typeof GetUserWorkspaceIntegrationInputSchema
>;

export const ListUserWorkspaceIntegrationsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceIntegrationsInput = z.infer<
	typeof ListUserWorkspaceIntegrationsInputSchema
>;

export const InstallUserSlackIntegrationInputSchema = z.object({
	user_handle: z.string(),
	integration_handle: z.string(),
});
export type InstallUserSlackIntegrationInput = z.infer<
	typeof InstallUserSlackIntegrationInputSchema
>;

// ── Notifiers Schemas ────────────────────────────────────────────────────────
export const CreateUserNotifierInputSchema = z.object({
	user_handle: z.string(),
	handle: z.string(),
	type: z.string(),
});
export type CreateUserNotifierInput = z.infer<
	typeof CreateUserNotifierInputSchema
>;

export const ListUserNotifiersInputSchema = z.object({
	user_handle: z.string(),
});
export type ListUserNotifiersInput = z.infer<
	typeof ListUserNotifiersInputSchema
>;

export const GetOrgWorkspaceNotifierInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	notifier_handle: z.string(),
});
export type GetOrgWorkspaceNotifierInput = z.infer<
	typeof GetOrgWorkspaceNotifierInputSchema
>;

export const CreateUserWorkspaceNotifierInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	handle: z.string(),
	type: z.string(),
});
export type CreateUserWorkspaceNotifierInput = z.infer<
	typeof CreateUserWorkspaceNotifierInputSchema
>;

export const DeleteUserWorkspaceNotifierInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	notifier_handle: z.string(),
});
export type DeleteUserWorkspaceNotifierInput = z.infer<
	typeof DeleteUserWorkspaceNotifierInputSchema
>;

export const GetUserWorkspaceNotifierInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	notifier_handle: z.string(),
});
export type GetUserWorkspaceNotifierInput = z.infer<
	typeof GetUserWorkspaceNotifierInputSchema
>;

export const ListUserWorkspaceNotifiersInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceNotifiersInput = z.infer<
	typeof ListUserWorkspaceNotifiersInputSchema
>;

export const PostUserWorkspaceNotifierCommandInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	notifier_handle: z.string(),
	command: z.string(),
});
export type PostUserWorkspaceNotifierCommandInput = z.infer<
	typeof PostUserWorkspaceNotifierCommandInputSchema
>;

// ── Datatanks Schemas ────────────────────────────────────────────────────────
export const CreateUserWorkspaceDatatankInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	handle: z.string(),
});
export type CreateUserWorkspaceDatatankInput = z.infer<
	typeof CreateUserWorkspaceDatatankInputSchema
>;

export const GetUserWorkspaceDatatankInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	datatank_handle: z.string(),
});
export type GetUserWorkspaceDatatankInput = z.infer<
	typeof GetUserWorkspaceDatatankInputSchema
>;

export const ListUserWorkspaceDatatanksInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceDatatanksInput = z.infer<
	typeof ListUserWorkspaceDatatanksInputSchema
>;

export const ListOrgWorkspaceDatatanksInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListOrgWorkspaceDatatanksInput = z.infer<
	typeof ListOrgWorkspaceDatatanksInputSchema
>;

export const CreateUserWorkspaceDatatankTableInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	datatank_handle: z.string(),
	table_name: z.string(),
});
export type CreateUserWorkspaceDatatankTableInput = z.infer<
	typeof CreateUserWorkspaceDatatankTableInputSchema
>;

export const GetDatatankTableInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	datatank_handle: z.string(),
	table_name: z.string(),
});
export type GetDatatankTableInput = z.infer<typeof GetDatatankTableInputSchema>;

export const ListUserWorkspaceDatatankTablesInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	datatank_handle: z.string(),
});
export type ListUserWorkspaceDatatankTablesInput = z.infer<
	typeof ListUserWorkspaceDatatankTablesInputSchema
>;

export const ListUserWorkspaceDatatankPartitionsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	datatank_handle: z.string(),
	table_name: z.string(),
});
export type ListUserWorkspaceDatatankPartitionsInput = z.infer<
	typeof ListUserWorkspaceDatatankPartitionsInputSchema
>;

export const GetUserWorkspaceSchemaInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	schema_name: z.string(),
});
export type GetUserWorkspaceSchemaInput = z.infer<
	typeof GetUserWorkspaceSchemaInputSchema
>;

export const ListUserWorkspaceSchemasInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceSchemasInput = z.infer<
	typeof ListUserWorkspaceSchemasInputSchema
>;

export const GetUserWorkspaceSchemaTableInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	schema_name: z.string(),
	table_name: z.string(),
});
export type GetUserWorkspaceSchemaTableInput = z.infer<
	typeof GetUserWorkspaceSchemaTableInputSchema
>;

export const ListUserWorkspaceSchemaTablesInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	schema_name: z.string(),
});
export type ListUserWorkspaceSchemaTablesInput = z.infer<
	typeof ListUserWorkspaceSchemaTablesInputSchema
>;

// ── Mods Schemas ─────────────────────────────────────────────────────────────
export const InstallUserWorkspaceModInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	path: z.string(),
});
export type InstallUserWorkspaceModInput = z.infer<
	typeof InstallUserWorkspaceModInputSchema
>;

export const GetUserWorkspaceModInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
});
export type GetUserWorkspaceModInput = z.infer<
	typeof GetUserWorkspaceModInputSchema
>;

export const ListUserWorkspaceModsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceModsInput = z.infer<
	typeof ListUserWorkspaceModsInputSchema
>;

export const ListOrgWorkspaceModsInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListOrgWorkspaceModsInput = z.infer<
	typeof ListOrgWorkspaceModsInputSchema
>;

// unknown: mod variable values accept any JSON value per the provider API.
export const CreateUserWorkspaceModVariableSettingInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
	variable_name: z.string(),
	value: z.unknown(),
});
export type CreateUserWorkspaceModVariableSettingInput = z.infer<
	typeof CreateUserWorkspaceModVariableSettingInputSchema
>;

export const DeleteUserWorkspaceModVariableSettingInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
	variable_name: z.string(),
});
export type DeleteUserWorkspaceModVariableSettingInput = z.infer<
	typeof DeleteUserWorkspaceModVariableSettingInputSchema
>;

export const GetUserWorkspaceModVariableSettingInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
	variable_name: z.string(),
});
export type GetUserWorkspaceModVariableSettingInput = z.infer<
	typeof GetUserWorkspaceModVariableSettingInputSchema
>;

export const ListUserWorkspaceModVariablesInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
});
export type ListUserWorkspaceModVariablesInput = z.infer<
	typeof ListUserWorkspaceModVariablesInputSchema
>;

export const GetOrgWorkspaceModVariableSettingInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
	variable_name: z.string(),
});
export type GetOrgWorkspaceModVariableSettingInput = z.infer<
	typeof GetOrgWorkspaceModVariableSettingInputSchema
>;

export const DeleteOrgWorkspaceModVariableSettingInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
	variable_name: z.string(),
});
export type DeleteOrgWorkspaceModVariableSettingInput = z.infer<
	typeof DeleteOrgWorkspaceModVariableSettingInputSchema
>;

// ── Pipelines Schemas ────────────────────────────────────────────────────────
export const InstallUserWorkspaceFlowpipeModInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	path: z.string(),
});
export type InstallUserWorkspaceFlowpipeModInput = z.infer<
	typeof InstallUserWorkspaceFlowpipeModInputSchema
>;

export const GetUserWorkspaceFlowpipeModInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
});
export type GetUserWorkspaceFlowpipeModInput = z.infer<
	typeof GetUserWorkspaceFlowpipeModInputSchema
>;

export const UninstallFlowpipeModInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
});
export type UninstallFlowpipeModInput = z.infer<
	typeof UninstallFlowpipeModInputSchema
>;

export const UninstallOrgWorkspaceFlowpipeModInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
});
export type UninstallOrgWorkspaceFlowpipeModInput = z.infer<
	typeof UninstallOrgWorkspaceFlowpipeModInputSchema
>;

export const ListOrgWorkspaceFlowpipeModVariablesInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
});
export type ListOrgWorkspaceFlowpipeModVariablesInput = z.infer<
	typeof ListOrgWorkspaceFlowpipeModVariablesInputSchema
>;

export const ListUserWorkspaceFlowpipeModVariablesInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	mod_alias: z.string(),
});
export type ListUserWorkspaceFlowpipeModVariablesInput = z.infer<
	typeof ListUserWorkspaceFlowpipeModVariablesInputSchema
>;

export const GetUserWorkspaceFlowpipePipelineInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	pipeline_id: z.string(),
});
export type GetUserWorkspaceFlowpipePipelineInput = z.infer<
	typeof GetUserWorkspaceFlowpipePipelineInputSchema
>;

export const ListUserWorkspaceFlowpipePipelinesInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceFlowpipePipelinesInput = z.infer<
	typeof ListUserWorkspaceFlowpipePipelinesInputSchema
>;

export const RunUserWorkspaceFlowpipePipelineCommandInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	pipeline_id: z.string(),
	command: z.string(),
});
export type RunUserWorkspaceFlowpipePipelineCommandInput = z.infer<
	typeof RunUserWorkspaceFlowpipePipelineCommandInputSchema
>;

export const GetOrgWorkspaceFlowpipeTriggerInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
	trigger_name: z.string(),
});
export type GetOrgWorkspaceFlowpipeTriggerInput = z.infer<
	typeof GetOrgWorkspaceFlowpipeTriggerInputSchema
>;

export const ListUserWorkspaceFlowpipeTriggersInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceFlowpipeTriggersInput = z.infer<
	typeof ListUserWorkspaceFlowpipeTriggersInputSchema
>;

export const RunUserWorkspaceFlowpipeTriggerCommandInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	trigger_name: z.string(),
	command: z.string(),
});
export type RunUserWorkspaceFlowpipeTriggerCommandInput = z.infer<
	typeof RunUserWorkspaceFlowpipeTriggerCommandInputSchema
>;

export const ListUserWorkspaceFlowpipeInputsInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspaceFlowpipeInputsInput = z.infer<
	typeof ListUserWorkspaceFlowpipeInputsInputSchema
>;

export const ListUserWorkspacePipelineTriggersInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	pipeline_id: z.string(),
});
export type ListUserWorkspacePipelineTriggersInput = z.infer<
	typeof ListUserWorkspacePipelineTriggersInputSchema
>;

export const DeleteUserWorkspacePipelineInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	pipeline_id: z.string(),
});
export type DeleteUserWorkspacePipelineInput = z.infer<
	typeof DeleteUserWorkspacePipelineInputSchema
>;

export const GetUserWorkspacePipelineInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
	pipeline_id: z.string(),
});
export type GetUserWorkspacePipelineInput = z.infer<
	typeof GetUserWorkspacePipelineInputSchema
>;

export const ListUserWorkspacePipelinesInputSchema = z.object({
	user_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListUserWorkspacePipelinesInput = z.infer<
	typeof ListUserWorkspacePipelinesInputSchema
>;

export const ListOrgWorkspacePipelinesInputSchema = z.object({
	org_handle: z.string(),
	workspace_handle: z.string(),
});
export type ListOrgWorkspacePipelinesInput = z.infer<
	typeof ListOrgWorkspacePipelinesInputSchema
>;

// ── Billing Schemas ──────────────────────────────────────────────────────────
export const DeleteOrgBillingSubscriptionInputSchema = z.object({
	org_handle: z.string(),
	subscription_id: z.string(),
});
export type DeleteOrgBillingSubscriptionInput = z.infer<
	typeof DeleteOrgBillingSubscriptionInputSchema
>;

export const UpdateOrgBillingSubscriptionInputSchema = z.object({
	org_handle: z.string(),
	subscription_id: z.string(),
	action: z.string().optional(),
});
export type UpdateOrgBillingSubscriptionInput = z.infer<
	typeof UpdateOrgBillingSubscriptionInputSchema
>;

export const GetOrgBillingInvoiceInputSchema = z.object({
	org_handle: z.string(),
	invoice_id: z.string(),
});
export type GetOrgBillingInvoiceInput = z.infer<
	typeof GetOrgBillingInvoiceInputSchema
>;

export const GetUserBillingPlanInputSchema = z.object({
	user_handle: z.string(),
});
export type GetUserBillingPlanInput = z.infer<
	typeof GetUserBillingPlanInputSchema
>;

export const GetUserBillingUpcomingInvoiceInputSchema = z.object({
	user_handle: z.string(),
});
export type GetUserBillingUpcomingInvoiceInput = z.infer<
	typeof GetUserBillingUpcomingInvoiceInputSchema
>;

export const ListUserBillingInvoicesInputSchema = z.object({
	user_handle: z.string(),
});
export type ListUserBillingInvoicesInput = z.infer<
	typeof ListUserBillingInvoicesInputSchema
>;

export const ListUserBillingPaymentMethodsInputSchema = z.object({
	user_handle: z.string(),
});
export type ListUserBillingPaymentMethodsInput = z.infer<
	typeof ListUserBillingPaymentMethodsInputSchema
>;

export const ListUserBillingSubscriptionsInputSchema = z.object({
	user_handle: z.string(),
});
export type ListUserBillingSubscriptionsInput = z.infer<
	typeof ListUserBillingSubscriptionsInputSchema
>;

// ── Auth Schemas ─────────────────────────────────────────────────────────────
export const CreateUserPasswordInputSchema = z.object({
	user_handle: z.string(),
	password: z.string().optional(),
});
export type CreateUserPasswordInput = z.infer<
	typeof CreateUserPasswordInputSchema
>;

export const GetUserPasswordInputSchema = z.object({ user_handle: z.string() });
export type GetUserPasswordInput = z.infer<typeof GetUserPasswordInputSchema>;

export const GetUserTokenInputSchema = z.object({
	user_handle: z.string(),
	token_id: z.string(),
});
export type GetUserTokenInput = z.infer<typeof GetUserTokenInputSchema>;

export const DeleteUserTokenInputSchema = z.object({
	user_handle: z.string(),
	token_id: z.string(),
});
export type DeleteUserTokenInput = z.infer<typeof DeleteUserTokenInputSchema>;

export const UpdateUserTokenInputSchema = z.object({
	user_handle: z.string(),
	token_id: z.string(),
	status: z.string().optional(),
});
export type UpdateUserTokenInput = z.infer<typeof UpdateUserTokenInputSchema>;

export const CreateSignupInputSchema = z.object({ email: z.string() });
export type CreateSignupInput = z.infer<typeof CreateSignupInputSchema>;

export const InitiateLoginInputSchema = z.object({ email: z.string() });
export type InitiateLoginInput = z.infer<typeof InitiateLoginInputSchema>;

export const CreateLoginTokenEmailInputSchema = z.object({ email: z.string() });
export type CreateLoginTokenEmailInput = z.infer<
	typeof CreateLoginTokenEmailInputSchema
>;

export const GetAuthProviderInputSchema = z.object({ provider: z.string() });
export type GetAuthProviderInput = z.infer<typeof GetAuthProviderInputSchema>;

// ── Tenants Schemas ──────────────────────────────────────────────────────────
export const GetTenantInputSchema = z.object({ tenant_handle: z.string() });
export type GetTenantInput = z.infer<typeof GetTenantInputSchema>;

export const GetTenantAvatarInputSchema = z.object({
	tenant_handle: z.string(),
});
export type GetTenantAvatarInput = z.infer<typeof GetTenantAvatarInputSchema>;

export const GetTenantSettingsInputSchema = z.object({});
export type GetTenantSettingsInput = z.infer<
	typeof GetTenantSettingsInputSchema
>;

export const ListTenantsInputSchema = z.object({});
export type ListTenantsInput = z.infer<typeof ListTenantsInputSchema>;

// ── Identities Schemas ───────────────────────────────────────────────────────
export const GetIdentityInputSchema = z.object({ identity_handle: z.string() });
export type GetIdentityInput = z.infer<typeof GetIdentityInputSchema>;

export const GetIdentityAvatarInputSchema = z.object({
	identity_handle: z.string(),
});
export type GetIdentityAvatarInput = z.infer<
	typeof GetIdentityAvatarInputSchema
>;

export const ListIdentitiesInputSchema = z.object({});
export type ListIdentitiesInput = z.infer<typeof ListIdentitiesInputSchema>;

// ── Output Schemas ───────────────────────────────────────────────────────────
// unknown: list items are per-endpoint records; the provider does not fix a shared shape.
export const ListItemsOutputSchema = z.object({
	items: z.array(z.record(z.string(), z.unknown())),
	next_token: z.string().optional(),
});

export const SuccessOutputSchema = z.object({
	success: z.boolean(),
});

export const StatusOutputSchema = z.object({
	status: z.string().optional(),
});

// unknown: generic endpoints return provider-defined JSON objects without a fixed shape.
export const GenericRecordOutputSchema = z.record(z.string(), z.unknown());

// Avatar endpoints redirect to the hosted image (`*/*`), and the shared HTTP
// client would read those binary bodies as text and corrupt them. The handlers
// resolve the redirect instead and return the directly usable image URL.
export const AvatarOutputSchema = z.object({
	avatar_url: z.string(),
});

// ── Master Schemas Maps required by Corsair plugin validation ────────────────
export const TurbotPipesEndpointInputSchemas = {
	actorGet: ActorGetInputSchema,
	actorListWorkspaces: ActorListWorkspacesInputSchema,
	actorListOrgs: ActorListOrgsInputSchema,
	actorListConnections: ActorListConnectionsInputSchema,
	actorListActivity: ActorListActivityInputSchema,
	getUser: GetUserInputSchema,
	updateUser: UpdateUserInputSchema,
	listUserWorkspaces: ListUserWorkspacesInputSchema,
	getUserWorkspace: GetUserWorkspaceInputSchema,
	updateUserWorkspace: UpdateUserWorkspaceInputSchema,
	runUserWorkspaceCommand: RunUserWorkspaceCommandInputSchema,
	listUserProcesses: ListUserProcessesInputSchema,
	getUserProcess: GetUserProcessInputSchema,
	listUserUsage: ListUserUsageInputSchema,
	listUserConstraints: ListUserConstraintsInputSchema,
	listUserAuditLogs: ListUserAuditLogsInputSchema,
	getUserEmail: GetUserEmailInputSchema,
	listUserEmails: ListUserEmailsInputSchema,
	getUserPreferences: GetUserPreferencesInputSchema,
	updateUserPreferences: UpdateUserPreferencesInputSchema,
	deleteUserAvatar: DeleteUserAvatarInputSchema,
	getOrg: GetOrgInputSchema,
	deleteOrg: DeleteOrgInputSchema,
	listOrgWorkspaces: ListOrgWorkspacesInputSchema,
	deleteOrgWorkspace: DeleteOrgWorkspaceInputSchema,
	runOrgWorkspaceCommand: RunOrgWorkspaceCommandInputSchema,
	listOrgProcesses: ListOrgProcessesInputSchema,
	listOrgServiceAccounts: ListOrgServiceAccountsInputSchema,
	updateOrgServiceAccount: UpdateOrgServiceAccountInputSchema,
	updateOrgServiceAccountToken: UpdateOrgServiceAccountTokenInputSchema,
	getOrgMember: GetOrgMemberInputSchema,
	updateOrgMemberRole: UpdateOrgMemberRoleInputSchema,
	listOrgUsage: ListOrgUsageInputSchema,
	createUserConnection: CreateUserConnectionInputSchema,
	getUserConnection: GetUserConnectionInputSchema,
	listUserConnections: ListUserConnectionsInputSchema,
	updateUserConnection: UpdateUserConnectionInputSchema,
	deleteUserConnectionDeprecated: DeleteUserConnectionDeprecatedInputSchema,
	testUserConnection: TestUserConnectionInputSchema,
	createOrgConnection: CreateOrgConnectionInputSchema,
	updateOrgConnection: UpdateOrgConnectionInputSchema,
	getOrgConnectionPermission: GetOrgConnectionPermissionInputSchema,
	deleteOrgConnectionPermission: DeleteOrgConnectionPermissionInputSchema,
	createOrgConnectionFolder: CreateOrgConnectionFolderInputSchema,
	updateOrgConnectionFolder: UpdateOrgConnectionFolderInputSchema,
	createUserWorkspaceConnection: CreateUserWorkspaceConnectionInputSchema,
	getUserWorkspaceConnection: GetUserWorkspaceConnectionInputSchema,
	listUserWorkspaceConnections: ListUserWorkspaceConnectionsInputSchema,
	listUserWorkspaceConnectionAssociations:
		ListUserWorkspaceConnectionAssociationsInputSchema,
	listUserWorkspaceConnectionTree: ListUserWorkspaceConnectionTreeInputSchema,
	testUserWorkspaceConnection: TestUserWorkspaceConnectionInputSchema,
	createUserWorkspaceConnectionFolder:
		CreateUserWorkspaceConnectionFolderInputSchema,
	getUserWorkspaceConnectionFolder: GetUserWorkspaceConnectionFolderInputSchema,
	listUserWorkspaceConnectionFolders:
		ListUserWorkspaceConnectionFoldersInputSchema,
	createOrgWorkspaceConnection: CreateOrgWorkspaceConnectionInputSchema,
	getOrgWorkspaceConnection: GetOrgWorkspaceConnectionInputSchema,
	createOrgWorkspaceConnectionFolder:
		CreateOrgWorkspaceConnectionFolderInputSchema,
	getOrgWorkspaceConnectionFolder: GetOrgWorkspaceConnectionFolderInputSchema,
	createOrgWorkspaceAggregator: CreateOrgWorkspaceAggregatorInputSchema,
	getUserWorkspaceAggregator: GetUserWorkspaceAggregatorInputSchema,
	listUserWorkspaceAggregators: ListUserWorkspaceAggregatorsInputSchema,
	listUserWorkspaceAggregatorConnections:
		ListUserWorkspaceAggregatorConnectionsInputSchema,
	listUserWorkspaceAuditLogs: ListUserWorkspaceAuditLogsInputSchema,
	listUserWorkspaceDatabaseLogs: ListUserWorkspaceDatabaseLogsInputSchema,
	listUserWorkspaceProcesses: ListUserWorkspaceProcessesInputSchema,
	getUserWorkspaceProcess: GetUserWorkspaceProcessInputSchema,
	getUserWorkspaceProcessLog: GetUserWorkspaceProcessLogInputSchema,
	listOrgWorkspaceProcesses: ListOrgWorkspaceProcessesInputSchema,
	listUserWorkspaceUsage: ListUserWorkspaceUsageInputSchema,
	createOrgWorkspaceQuery: CreateOrgWorkspaceQueryInputSchema,
	getOrgWorkspaceQueryData: GetOrgWorkspaceQueryDataInputSchema,
	createOrgWorkspaceSnapshot: CreateOrgWorkspaceSnapshotInputSchema,
	getUserWorkspaceQuery: GetUserWorkspaceQueryInputSchema,
	getUserWorkspaceQueryData: GetUserWorkspaceQueryDataInputSchema,
	postUserWorkspaceQuery: PostUserWorkspaceQueryInputSchema,
	runUserWorkspaceQuery: RunUserWorkspaceQueryInputSchema,
	listUserWorkspaceSnapshots: ListUserWorkspaceSnapshotsInputSchema,
	createUserAiKey: CreateUserAiKeyInputSchema,
	getUserAiKey: GetUserAiKeyInputSchema,
	listUserAiKeys: ListUserAiKeysInputSchema,
	updateUserAiKey: UpdateUserAiKeyInputSchema,
	testUserAiKey: TestUserAiKeyInputSchema,
	deleteOrgWorkspaceConversation: DeleteOrgWorkspaceConversationInputSchema,
	getUserWorkspaceConversation: GetUserWorkspaceConversationInputSchema,
	updateUserWorkspaceConversation: UpdateUserWorkspaceConversationInputSchema,
	listUserWorkspaceConversations: ListUserWorkspaceConversationsInputSchema,
	sendUserWorkspaceChatMessage: SendUserWorkspaceChatMessageInputSchema,
	createUserIntegration: CreateUserIntegrationInputSchema,
	deleteUserIntegration: DeleteUserIntegrationInputSchema,
	getUserIntegration: GetUserIntegrationInputSchema,
	listUserIntegrations: ListUserIntegrationsInputSchema,
	updateUserIntegration: UpdateUserIntegrationInputSchema,
	testUserIntegration: TestUserIntegrationInputSchema,
	getOrgWorkspaceIntegration: GetOrgWorkspaceIntegrationInputSchema,
	getOrgIntegration: GetOrgIntegrationInputSchema,
	getUserWorkspaceIntegration: GetUserWorkspaceIntegrationInputSchema,
	listUserWorkspaceIntegrations: ListUserWorkspaceIntegrationsInputSchema,
	installUserSlackIntegration: InstallUserSlackIntegrationInputSchema,
	createUserNotifier: CreateUserNotifierInputSchema,
	listUserNotifiers: ListUserNotifiersInputSchema,
	getOrgWorkspaceNotifier: GetOrgWorkspaceNotifierInputSchema,
	createUserWorkspaceNotifier: CreateUserWorkspaceNotifierInputSchema,
	deleteUserWorkspaceNotifier: DeleteUserWorkspaceNotifierInputSchema,
	getUserWorkspaceNotifier: GetUserWorkspaceNotifierInputSchema,
	listUserWorkspaceNotifiers: ListUserWorkspaceNotifiersInputSchema,
	postUserWorkspaceNotifierCommand: PostUserWorkspaceNotifierCommandInputSchema,
	createUserWorkspaceDatatank: CreateUserWorkspaceDatatankInputSchema,
	getUserWorkspaceDatatank: GetUserWorkspaceDatatankInputSchema,
	listUserWorkspaceDatatanks: ListUserWorkspaceDatatanksInputSchema,
	listOrgWorkspaceDatatanks: ListOrgWorkspaceDatatanksInputSchema,
	createUserWorkspaceDatatankTable: CreateUserWorkspaceDatatankTableInputSchema,
	getDatatankTable: GetDatatankTableInputSchema,
	listUserWorkspaceDatatankTables: ListUserWorkspaceDatatankTablesInputSchema,
	listUserWorkspaceDatatankPartitions:
		ListUserWorkspaceDatatankPartitionsInputSchema,
	getUserWorkspaceSchema: GetUserWorkspaceSchemaInputSchema,
	listUserWorkspaceSchemas: ListUserWorkspaceSchemasInputSchema,
	getUserWorkspaceSchemaTable: GetUserWorkspaceSchemaTableInputSchema,
	listUserWorkspaceSchemaTables: ListUserWorkspaceSchemaTablesInputSchema,
	installUserWorkspaceMod: InstallUserWorkspaceModInputSchema,
	getUserWorkspaceMod: GetUserWorkspaceModInputSchema,
	listUserWorkspaceMods: ListUserWorkspaceModsInputSchema,
	listOrgWorkspaceMods: ListOrgWorkspaceModsInputSchema,
	createUserWorkspaceModVariableSetting:
		CreateUserWorkspaceModVariableSettingInputSchema,
	deleteUserWorkspaceModVariableSetting:
		DeleteUserWorkspaceModVariableSettingInputSchema,
	getUserWorkspaceModVariableSetting:
		GetUserWorkspaceModVariableSettingInputSchema,
	listUserWorkspaceModVariables: ListUserWorkspaceModVariablesInputSchema,
	getOrgWorkspaceModVariableSetting:
		GetOrgWorkspaceModVariableSettingInputSchema,
	deleteOrgWorkspaceModVariableSetting:
		DeleteOrgWorkspaceModVariableSettingInputSchema,
	installUserWorkspaceFlowpipeMod: InstallUserWorkspaceFlowpipeModInputSchema,
	getUserWorkspaceFlowpipeMod: GetUserWorkspaceFlowpipeModInputSchema,
	uninstallFlowpipeMod: UninstallFlowpipeModInputSchema,
	uninstallOrgWorkspaceFlowpipeMod: UninstallOrgWorkspaceFlowpipeModInputSchema,
	listOrgWorkspaceFlowpipeModVariables:
		ListOrgWorkspaceFlowpipeModVariablesInputSchema,
	listUserWorkspaceFlowpipeModVariables:
		ListUserWorkspaceFlowpipeModVariablesInputSchema,
	getUserWorkspaceFlowpipePipeline: GetUserWorkspaceFlowpipePipelineInputSchema,
	listUserWorkspaceFlowpipePipelines:
		ListUserWorkspaceFlowpipePipelinesInputSchema,
	runUserWorkspaceFlowpipePipelineCommand:
		RunUserWorkspaceFlowpipePipelineCommandInputSchema,
	getOrgWorkspaceFlowpipeTrigger: GetOrgWorkspaceFlowpipeTriggerInputSchema,
	listUserWorkspaceFlowpipeTriggers:
		ListUserWorkspaceFlowpipeTriggersInputSchema,
	runUserWorkspaceFlowpipeTriggerCommand:
		RunUserWorkspaceFlowpipeTriggerCommandInputSchema,
	listUserWorkspaceFlowpipeInputs: ListUserWorkspaceFlowpipeInputsInputSchema,
	listUserWorkspacePipelineTriggers:
		ListUserWorkspacePipelineTriggersInputSchema,
	deleteUserWorkspacePipeline: DeleteUserWorkspacePipelineInputSchema,
	getUserWorkspacePipeline: GetUserWorkspacePipelineInputSchema,
	listUserWorkspacePipelines: ListUserWorkspacePipelinesInputSchema,
	listOrgWorkspacePipelines: ListOrgWorkspacePipelinesInputSchema,
	deleteOrgBillingSubscription: DeleteOrgBillingSubscriptionInputSchema,
	updateOrgBillingSubscription: UpdateOrgBillingSubscriptionInputSchema,
	getOrgBillingInvoice: GetOrgBillingInvoiceInputSchema,
	getUserBillingPlan: GetUserBillingPlanInputSchema,
	getUserBillingUpcomingInvoice: GetUserBillingUpcomingInvoiceInputSchema,
	listUserBillingInvoices: ListUserBillingInvoicesInputSchema,
	listUserBillingPaymentMethods: ListUserBillingPaymentMethodsInputSchema,
	listUserBillingSubscriptions: ListUserBillingSubscriptionsInputSchema,
	createUserPassword: CreateUserPasswordInputSchema,
	getUserPassword: GetUserPasswordInputSchema,
	getUserToken: GetUserTokenInputSchema,
	deleteUserToken: DeleteUserTokenInputSchema,
	updateUserToken: UpdateUserTokenInputSchema,
	createSignup: CreateSignupInputSchema,
	initiateLogin: InitiateLoginInputSchema,
	createLoginTokenEmail: CreateLoginTokenEmailInputSchema,
	getAuthProvider: GetAuthProviderInputSchema,
	getTenant: GetTenantInputSchema,
	getTenantAvatar: GetTenantAvatarInputSchema,
	getTenantSettings: GetTenantSettingsInputSchema,
	listTenants: ListTenantsInputSchema,
	getIdentity: GetIdentityInputSchema,
	getIdentityAvatar: GetIdentityAvatarInputSchema,
	listIdentities: ListIdentitiesInputSchema,
} as const;

export const TurbotPipesEndpointOutputSchemas = {
	actorGet: TurbotPipesActorSchema,
	actorListWorkspaces: ListItemsOutputSchema,
	actorListOrgs: ListItemsOutputSchema,
	actorListConnections: ListItemsOutputSchema,
	actorListActivity: ListItemsOutputSchema,
	getUser: TurbotPipesUserSchema,
	updateUser: TurbotPipesUserSchema,
	listUserWorkspaces: ListItemsOutputSchema,
	getUserWorkspace: TurbotPipesWorkspaceSchema,
	updateUserWorkspace: TurbotPipesWorkspaceSchema,
	runUserWorkspaceCommand: StatusOutputSchema,
	listUserProcesses: ListItemsOutputSchema,
	getUserProcess: TurbotPipesProcessSchema,
	listUserUsage: ListItemsOutputSchema,
	listUserConstraints: ListItemsOutputSchema,
	listUserAuditLogs: ListItemsOutputSchema,
	getUserEmail: GenericRecordOutputSchema,
	listUserEmails: ListItemsOutputSchema,
	getUserPreferences: GenericRecordOutputSchema,
	updateUserPreferences: GenericRecordOutputSchema,
	deleteUserAvatar: SuccessOutputSchema,
	getOrg: TurbotPipesOrgSchema,
	deleteOrg: SuccessOutputSchema,
	listOrgWorkspaces: ListItemsOutputSchema,
	deleteOrgWorkspace: SuccessOutputSchema,
	runOrgWorkspaceCommand: StatusOutputSchema,
	listOrgProcesses: ListItemsOutputSchema,
	listOrgServiceAccounts: ListItemsOutputSchema,
	updateOrgServiceAccount: GenericRecordOutputSchema,
	updateOrgServiceAccountToken: GenericRecordOutputSchema,
	getOrgMember: GenericRecordOutputSchema,
	updateOrgMemberRole: GenericRecordOutputSchema,
	listOrgUsage: ListItemsOutputSchema,
	createUserConnection: TurbotPipesConnectionSchema,
	getUserConnection: TurbotPipesConnectionSchema,
	listUserConnections: ListItemsOutputSchema,
	updateUserConnection: TurbotPipesConnectionSchema,
	deleteUserConnectionDeprecated: TurbotPipesConnectionSchema,
	testUserConnection: GenericRecordOutputSchema,
	createOrgConnection: TurbotPipesConnectionSchema,
	updateOrgConnection: TurbotPipesConnectionSchema,
	getOrgConnectionPermission: GenericRecordOutputSchema,
	deleteOrgConnectionPermission: SuccessOutputSchema,
	createOrgConnectionFolder: GenericRecordOutputSchema,
	updateOrgConnectionFolder: GenericRecordOutputSchema,
	createUserWorkspaceConnection: TurbotPipesConnectionSchema,
	getUserWorkspaceConnection: TurbotPipesConnectionSchema,
	listUserWorkspaceConnections: ListItemsOutputSchema,
	listUserWorkspaceConnectionAssociations: ListItemsOutputSchema,
	listUserWorkspaceConnectionTree: GenericRecordOutputSchema,
	testUserWorkspaceConnection: GenericRecordOutputSchema,
	createUserWorkspaceConnectionFolder: GenericRecordOutputSchema,
	getUserWorkspaceConnectionFolder: GenericRecordOutputSchema,
	listUserWorkspaceConnectionFolders: ListItemsOutputSchema,
	createOrgWorkspaceConnection: TurbotPipesConnectionSchema,
	getOrgWorkspaceConnection: TurbotPipesConnectionSchema,
	createOrgWorkspaceConnectionFolder: GenericRecordOutputSchema,
	getOrgWorkspaceConnectionFolder: GenericRecordOutputSchema,
	createOrgWorkspaceAggregator: GenericRecordOutputSchema,
	getUserWorkspaceAggregator: GenericRecordOutputSchema,
	listUserWorkspaceAggregators: ListItemsOutputSchema,
	listUserWorkspaceAggregatorConnections: ListItemsOutputSchema,
	listUserWorkspaceAuditLogs: ListItemsOutputSchema,
	listUserWorkspaceDatabaseLogs: ListItemsOutputSchema,
	listUserWorkspaceProcesses: ListItemsOutputSchema,
	getUserWorkspaceProcess: TurbotPipesProcessSchema,
	getUserWorkspaceProcessLog: GenericRecordOutputSchema,
	listOrgWorkspaceProcesses: ListItemsOutputSchema,
	listUserWorkspaceUsage: ListItemsOutputSchema,
	createOrgWorkspaceQuery: GenericRecordOutputSchema,
	getOrgWorkspaceQueryData: GenericRecordOutputSchema,
	createOrgWorkspaceSnapshot: GenericRecordOutputSchema,
	getUserWorkspaceQuery: GenericRecordOutputSchema,
	getUserWorkspaceQueryData: GenericRecordOutputSchema,
	postUserWorkspaceQuery: GenericRecordOutputSchema,
	runUserWorkspaceQuery: GenericRecordOutputSchema,
	listUserWorkspaceSnapshots: ListItemsOutputSchema,
	createUserAiKey: GenericRecordOutputSchema,
	getUserAiKey: GenericRecordOutputSchema,
	listUserAiKeys: ListItemsOutputSchema,
	updateUserAiKey: GenericRecordOutputSchema,
	testUserAiKey: GenericRecordOutputSchema,
	deleteOrgWorkspaceConversation: SuccessOutputSchema,
	getUserWorkspaceConversation: GenericRecordOutputSchema,
	updateUserWorkspaceConversation: GenericRecordOutputSchema,
	listUserWorkspaceConversations: ListItemsOutputSchema,
	sendUserWorkspaceChatMessage: GenericRecordOutputSchema,
	createUserIntegration: GenericRecordOutputSchema,
	deleteUserIntegration: SuccessOutputSchema,
	getUserIntegration: GenericRecordOutputSchema,
	listUserIntegrations: ListItemsOutputSchema,
	updateUserIntegration: GenericRecordOutputSchema,
	testUserIntegration: GenericRecordOutputSchema,
	getOrgWorkspaceIntegration: GenericRecordOutputSchema,
	getOrgIntegration: GenericRecordOutputSchema,
	getUserWorkspaceIntegration: GenericRecordOutputSchema,
	listUserWorkspaceIntegrations: ListItemsOutputSchema,
	installUserSlackIntegration: GenericRecordOutputSchema,
	createUserNotifier: GenericRecordOutputSchema,
	listUserNotifiers: ListItemsOutputSchema,
	getOrgWorkspaceNotifier: GenericRecordOutputSchema,
	createUserWorkspaceNotifier: GenericRecordOutputSchema,
	deleteUserWorkspaceNotifier: SuccessOutputSchema,
	getUserWorkspaceNotifier: GenericRecordOutputSchema,
	listUserWorkspaceNotifiers: ListItemsOutputSchema,
	postUserWorkspaceNotifierCommand: StatusOutputSchema,
	createUserWorkspaceDatatank: TurbotPipesDatatankSchema,
	getUserWorkspaceDatatank: TurbotPipesDatatankSchema,
	listUserWorkspaceDatatanks: ListItemsOutputSchema,
	listOrgWorkspaceDatatanks: ListItemsOutputSchema,
	createUserWorkspaceDatatankTable: GenericRecordOutputSchema,
	getDatatankTable: GenericRecordOutputSchema,
	listUserWorkspaceDatatankTables: ListItemsOutputSchema,
	listUserWorkspaceDatatankPartitions: ListItemsOutputSchema,
	getUserWorkspaceSchema: GenericRecordOutputSchema,
	listUserWorkspaceSchemas: ListItemsOutputSchema,
	getUserWorkspaceSchemaTable: GenericRecordOutputSchema,
	listUserWorkspaceSchemaTables: ListItemsOutputSchema,
	installUserWorkspaceMod: GenericRecordOutputSchema,
	getUserWorkspaceMod: GenericRecordOutputSchema,
	listUserWorkspaceMods: ListItemsOutputSchema,
	listOrgWorkspaceMods: ListItemsOutputSchema,
	createUserWorkspaceModVariableSetting: GenericRecordOutputSchema,
	deleteUserWorkspaceModVariableSetting: SuccessOutputSchema,
	getUserWorkspaceModVariableSetting: GenericRecordOutputSchema,
	listUserWorkspaceModVariables: ListItemsOutputSchema,
	getOrgWorkspaceModVariableSetting: GenericRecordOutputSchema,
	deleteOrgWorkspaceModVariableSetting: SuccessOutputSchema,
	installUserWorkspaceFlowpipeMod: GenericRecordOutputSchema,
	getUserWorkspaceFlowpipeMod: GenericRecordOutputSchema,
	uninstallFlowpipeMod: SuccessOutputSchema,
	uninstallOrgWorkspaceFlowpipeMod: SuccessOutputSchema,
	listOrgWorkspaceFlowpipeModVariables: ListItemsOutputSchema,
	listUserWorkspaceFlowpipeModVariables: ListItemsOutputSchema,
	getUserWorkspaceFlowpipePipeline: GenericRecordOutputSchema,
	listUserWorkspaceFlowpipePipelines: ListItemsOutputSchema,
	runUserWorkspaceFlowpipePipelineCommand: StatusOutputSchema,
	getOrgWorkspaceFlowpipeTrigger: GenericRecordOutputSchema,
	listUserWorkspaceFlowpipeTriggers: ListItemsOutputSchema,
	runUserWorkspaceFlowpipeTriggerCommand: StatusOutputSchema,
	listUserWorkspaceFlowpipeInputs: ListItemsOutputSchema,
	listUserWorkspacePipelineTriggers: ListItemsOutputSchema,
	deleteUserWorkspacePipeline: SuccessOutputSchema,
	getUserWorkspacePipeline: GenericRecordOutputSchema,
	listUserWorkspacePipelines: ListItemsOutputSchema,
	listOrgWorkspacePipelines: ListItemsOutputSchema,
	deleteOrgBillingSubscription: SuccessOutputSchema,
	updateOrgBillingSubscription: GenericRecordOutputSchema,
	getOrgBillingInvoice: GenericRecordOutputSchema,
	getUserBillingPlan: GenericRecordOutputSchema,
	getUserBillingUpcomingInvoice: GenericRecordOutputSchema,
	listUserBillingInvoices: ListItemsOutputSchema,
	listUserBillingPaymentMethods: ListItemsOutputSchema,
	listUserBillingSubscriptions: ListItemsOutputSchema,
	createUserPassword: SuccessOutputSchema,
	getUserPassword: GenericRecordOutputSchema,
	getUserToken: GenericRecordOutputSchema,
	deleteUserToken: SuccessOutputSchema,
	updateUserToken: GenericRecordOutputSchema,
	createSignup: SuccessOutputSchema,
	initiateLogin: SuccessOutputSchema,
	createLoginTokenEmail: SuccessOutputSchema,
	getAuthProvider: GenericRecordOutputSchema,
	getTenant: GenericRecordOutputSchema,
	getTenantAvatar: AvatarOutputSchema,
	getTenantSettings: GenericRecordOutputSchema,
	listTenants: ListItemsOutputSchema,
	getIdentity: GenericRecordOutputSchema,
	getIdentityAvatar: AvatarOutputSchema,
	listIdentities: ListItemsOutputSchema,
} as const;

export type TurbotPipesEndpointInputs = {
	[K in keyof typeof TurbotPipesEndpointInputSchemas]: z.infer<
		(typeof TurbotPipesEndpointInputSchemas)[K]
	>;
};

export type TurbotPipesEndpointOutputs = {
	[K in keyof typeof TurbotPipesEndpointOutputSchemas]: z.infer<
		(typeof TurbotPipesEndpointOutputSchemas)[K]
	>;
};
