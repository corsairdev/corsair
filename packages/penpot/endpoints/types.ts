import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

const uuid = z.string().uuid().describe('UUID');

// Penpot documents request schemas only; response objects come from the
// /api/_doc docstrings and are kept loose.
export const TeamSchema = z
	.object({
		id: uuid,
		name: z.string().nullish().describe('Team name'),
	})
	.loose()
	.describe('A Penpot team');
export type Team = z.infer<typeof TeamSchema>;

export const ProjectSchema = z
	.object({
		id: uuid,
		name: z.string().nullish().describe('Project name'),
		teamId: z.string().nullish().describe('Team the project belongs to'),
	})
	.loose()
	.describe('A Penpot project');
export type Project = z.infer<typeof ProjectSchema>;

export const FileSchema = z
	.object({
		id: uuid,
		name: z.string().nullish().describe('File name'),
		projectId: z.string().nullish().describe('Project the file belongs to'),
		modifiedAt: z.string().nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('A Penpot design file');
export type File = z.infer<typeof FileSchema>;

export const FileSnapshotSchema = z
	.object({
		id: uuid,
		label: z.string().nullish().describe('Snapshot label'),
		createdAt: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A Penpot file snapshot');
export type FileSnapshot = z.infer<typeof FileSnapshotSchema>;

export const CommentThreadSchema = z
	.object({
		id: uuid,
		content: z.string().nullish().describe('Thread opening comment content'),
		pageId: z.string().nullish().describe('Page the thread sits on'),
		createdAt: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A Penpot comment thread');
export type CommentThread = z.infer<typeof CommentThreadSchema>;

export const CommentSchema = z
	.object({
		id: uuid,
		content: z.string().nullish().describe('Comment content'),
		createdAt: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A Penpot comment');
export type Comment = z.infer<typeof CommentSchema>;

export const WebhookSubscriptionSchema = z
	.object({
		id: uuid,
		uri: z.string().nullish().describe('Endpoint deliveries are posted to'),
		mtype: z
			.string()
			.nullish()
			.describe('Payload format: application/json or application/transit+json'),
		isActive: z.boolean().nullish().describe('Whether deliveries are active'),
		teamId: z.string().nullish().describe('Team the webhook belongs to'),
	})
	.loose()
	.describe('A Penpot webhook subscription');
export type WebhookSubscription = z.infer<typeof WebhookSubscriptionSchema>;

export const AccessTokenSchema = z
	.object({
		id: uuid,
		name: z.string().nullish().describe('Token name'),
		createdAt: z.string().nullish().describe('Creation timestamp'),
		expiration: z.number().nullish().describe('Expiration duration in seconds'),
	})
	.loose()
	.describe(
		'A Penpot API access token (the token value itself is shown once at creation)',
	);
export type AccessToken = z.infer<typeof AccessTokenSchema>;

// ── teams ──────────────────────────────────────────────────────────────────

export const ListTeamsInputSchema = z
	.object({})
	.describe('Input for listing the teams of the authenticated profile (none)');
export type ListTeamsInput = z.infer<typeof ListTeamsInputSchema>;

export const ListTeamsOutputSchema = z
	.array(TeamSchema)
	.describe('The teams of the authenticated profile');
export type ListTeamsOutput = z.infer<typeof ListTeamsOutputSchema>;

export const CreateTeamInputSchema = z
	.object({
		name: z.string().min(1).max(250).describe('Team name'),
		isDefault: z.boolean().optional().describe('Make this the default team'),
	})
	.describe('Create a team');
export type CreateTeamInput = z.infer<typeof CreateTeamInputSchema>;

export const CreateTeamOutputSchema = TeamSchema.describe(
	'The team as created',
);
export type CreateTeamOutput = z.infer<typeof CreateTeamOutputSchema>;

export const GetTeamInputSchema = z
	.object({ id: uuid.describe('Team id') })
	.describe('Input for reading one team');
export type GetTeamInput = z.infer<typeof GetTeamInputSchema>;

export const GetTeamOutputSchema = TeamSchema.describe('The team');
export type GetTeamOutput = z.infer<typeof GetTeamOutputSchema>;

export const DeleteTeamInputSchema = z
	.object({ id: uuid.describe('Team id') })
	.describe('Delete a team');
export type DeleteTeamInput = z.infer<typeof DeleteTeamInputSchema>;

export const DeleteTeamOutputSchema = z
	.object({
		id: z.string().describe('Deleted team id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The team was deleted');
export type DeleteTeamOutput = z.infer<typeof DeleteTeamOutputSchema>;

// ── projects ───────────────────────────────────────────────────────────────

export const ListAllProjectsInputSchema = z
	.object({})
	.describe('Input for listing all projects of the profile (none)');
export type ListAllProjectsInput = z.infer<typeof ListAllProjectsInputSchema>;

export const ListAllProjectsOutputSchema = z
	.array(ProjectSchema)
	.describe('All projects of the authenticated profile');
export type ListAllProjectsOutput = z.infer<typeof ListAllProjectsOutputSchema>;

export const CreateProjectInputSchema = z
	.object({
		teamId: uuid.describe('Team the project is created in'),
		name: z.string().min(1).max(250).describe('Project name'),
	})
	.describe('Create a project in a team');
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

export const CreateProjectOutputSchema = ProjectSchema.describe(
	'The project as created',
);
export type CreateProjectOutput = z.infer<typeof CreateProjectOutputSchema>;

export const GetProjectInputSchema = z
	.object({ id: uuid.describe('Project id') })
	.describe('Input for reading one project');
export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;

export const GetProjectOutputSchema = ProjectSchema.describe('The project');
export type GetProjectOutput = z.infer<typeof GetProjectOutputSchema>;

export const RenameProjectInputSchema = z
	.object({
		id: uuid.describe('Project id'),
		name: z.string().min(1).describe('New project name'),
	})
	.describe('Rename a project');
export type RenameProjectInput = z.infer<typeof RenameProjectInputSchema>;

// rename-project answers an empty body (live, 2026-11-21); the plugin
// echoes the id and the new name.
export const RenameProjectOutputSchema = z
	.object({
		id: uuid,
		name: z.string().nullish().describe('The new project name'),
	})
	.loose()
	.describe('The project id and its new name');
export type RenameProjectOutput = z.infer<typeof RenameProjectOutputSchema>;

export const DeleteProjectInputSchema = z
	.object({ id: uuid.describe('Project id') })
	.describe('Delete a project');
export type DeleteProjectInput = z.infer<typeof DeleteProjectInputSchema>;

export const DeleteProjectOutputSchema = z
	.object({
		id: z.string().describe('Deleted project id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The project was deleted');
export type DeleteProjectOutput = z.infer<typeof DeleteProjectOutputSchema>;

export const DuplicateProjectInputSchema = z
	.object({
		id: uuid.describe('Project id to duplicate'),
		name: z.string().optional().describe('Name of the duplicate'),
	})
	.describe('Duplicate a project');
export type DuplicateProjectInput = z.infer<typeof DuplicateProjectInputSchema>;

export const DuplicateProjectOutputSchema = ProjectSchema.describe(
	'The duplicated project',
);
export type DuplicateProjectOutput = z.infer<
	typeof DuplicateProjectOutputSchema
>;

// ── files ──────────────────────────────────────────────────────────────────

export const GetFileInputSchema = z
	.object({ id: uuid.describe('File id') })
	.describe('Input for reading one design file');
export type GetFileInput = z.infer<typeof GetFileInputSchema>;

export const GetFileOutputSchema = FileSchema.describe(
	'The design file with its data',
);
export type GetFileOutput = z.infer<typeof GetFileOutputSchema>;

export const CreateFileInputSchema = z
	.object({
		projectId: uuid.describe('Project the file is created in'),
		name: z.string().min(1).describe('File name'),
		isShared: z
			.boolean()
			.optional()
			.describe('Share the file for team editing'),
	})
	.describe('Create a design file');
export type CreateFileInput = z.infer<typeof CreateFileInputSchema>;

export const CreateFileOutputSchema = FileSchema.describe(
	'The file as created',
);
export type CreateFileOutput = z.infer<typeof CreateFileOutputSchema>;

export const DeleteFileInputSchema = z
	.object({ id: uuid.describe('File id') })
	.describe('Delete a design file');
export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

export const DeleteFileOutputSchema = z
	.object({
		id: z.string().describe('Deleted file id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The file was deleted');
export type DeleteFileOutput = z.infer<typeof DeleteFileOutputSchema>;

export const DuplicateFileInputSchema = z
	.object({
		fileId: uuid.describe('File id to duplicate'),
		name: z.string().optional().describe('Name of the duplicate'),
	})
	.describe('Duplicate a design file');
export type DuplicateFileInput = z.infer<typeof DuplicateFileInputSchema>;

export const DuplicateFileOutputSchema = FileSchema.describe(
	'The duplicated file',
);
export type DuplicateFileOutput = z.infer<typeof DuplicateFileOutputSchema>;

export const RenameFileInputSchema = z
	.object({
		id: uuid.describe('File id'),
		name: z.string().min(1).describe('New file name'),
	})
	.describe('Rename a design file');
export type RenameFileInput = z.infer<typeof RenameFileInputSchema>;

export const RenameFileOutputSchema = FileSchema.describe(
	'The file as renamed',
);
export type RenameFileOutput = z.infer<typeof RenameFileOutputSchema>;

export const ListSnapshotsInputSchema = z
	.object({ fileId: uuid.describe('File id') })
	.describe('Input for listing the snapshots of a file');
export type ListSnapshotsInput = z.infer<typeof ListSnapshotsInputSchema>;

export const ListSnapshotsOutputSchema = z
	.array(FileSnapshotSchema)
	.describe('The snapshots of the file');
export type ListSnapshotsOutput = z.infer<typeof ListSnapshotsOutputSchema>;

export const CreateSnapshotInputSchema = z
	.object({
		fileId: uuid.describe('File id'),
		label: z.string().optional().describe('Snapshot label'),
	})
	.describe('Create a snapshot of a file');
export type CreateSnapshotInput = z.infer<typeof CreateSnapshotInputSchema>;

export const CreateSnapshotOutputSchema = FileSnapshotSchema.describe(
	'The snapshot as created',
);
export type CreateSnapshotOutput = z.infer<typeof CreateSnapshotOutputSchema>;

export const DeleteSnapshotInputSchema = z
	.object({ id: uuid.describe('Snapshot id') })
	.describe('Delete a file snapshot');
export type DeleteSnapshotInput = z.infer<typeof DeleteSnapshotInputSchema>;

export const DeleteSnapshotOutputSchema = z
	.object({
		id: z.string().describe('Deleted snapshot id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The snapshot was deleted');
export type DeleteSnapshotOutput = z.infer<typeof DeleteSnapshotOutputSchema>;

export const CreateShareLinkInputSchema = z
	.object({
		fileId: uuid.describe('File id to share'),
		pages: z
			.array(uuid)
			.min(1)
			.describe(
				'Page ids the link shows (files.get answers them in data.pages)',
			),
		whoComment: z
			.enum(['all', 'team'])
			.optional()
			.describe('Who can comment through the link; team when unset'),
		whoInspect: z
			.enum(['all', 'team'])
			.optional()
			.describe('Who can inspect through the link; team when unset'),
	})
	.describe('Create a share link for a file');
export type CreateShareLinkInput = z.infer<typeof CreateShareLinkInputSchema>;

export const ShareLinkSchema = z
	.object({
		id: uuid,
		fileId: z.string().nullish().describe('Shared file id'),
	})
	.loose()
	.describe('A Penpot share link');
export type ShareLink = z.infer<typeof ShareLinkSchema>;

export const CreateShareLinkOutputSchema = ShareLinkSchema.describe(
	'The share link as created',
);
export type CreateShareLinkOutput = z.infer<typeof CreateShareLinkOutputSchema>;

export const DeleteShareLinkInputSchema = z
	.object({ id: uuid.describe('Share link id') })
	.describe('Delete a share link');
export type DeleteShareLinkInput = z.infer<typeof DeleteShareLinkInputSchema>;

export const DeleteShareLinkOutputSchema = z
	.object({
		id: z.string().describe('Deleted share link id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The share link was deleted');
export type DeleteShareLinkOutput = z.infer<typeof DeleteShareLinkOutputSchema>;

// ── comments ───────────────────────────────────────────────────────────────

export const ListThreadsInputSchema = z
	.object({
		// get-comment-threads with only a teamId answers 404 (live), so the
		// file is required.
		fileId: uuid.describe('List threads of this file'),
	})
	.describe('Input for listing comment threads');
export type ListThreadsInput = z.infer<typeof ListThreadsInputSchema>;

export const ListThreadsOutputSchema = z
	.array(CommentThreadSchema)
	.describe('The comment threads');
export type ListThreadsOutput = z.infer<typeof ListThreadsOutputSchema>;

export const GetThreadInputSchema = z
	.object({
		fileId: uuid.describe('File id'),
		id: uuid.describe('Thread id'),
	})
	.describe('Input for reading one comment thread');
export type GetThreadInput = z.infer<typeof GetThreadInputSchema>;

export const GetThreadOutputSchema =
	CommentThreadSchema.describe('The comment thread');
export type GetThreadOutput = z.infer<typeof GetThreadOutputSchema>;

export const CreateThreadInputSchema = z
	.object({
		fileId: uuid.describe('File the thread is opened on'),
		pageId: uuid.describe('Page the thread sits on'),
		frameId: uuid
			.optional()
			.describe(
				'Frame the thread is attached to; the page root frame when unset',
			),
		position: z
			.object({
				x: z.number().describe('X on the page'),
				y: z.number().describe('Y on the page'),
			})
			.describe('Where the thread pin sits on the page'),
		content: z
			.string()
			.min(1)
			.max(750)
			.describe('Thread opening comment content'),
	})
	.describe('Open a comment thread on a file');
export type CreateThreadInput = z.infer<typeof CreateThreadInputSchema>;

export const CreateThreadOutputSchema = CommentThreadSchema.describe(
	'The thread as created',
);
export type CreateThreadOutput = z.infer<typeof CreateThreadOutputSchema>;

export const ListCommentsInputSchema = z
	.object({ threadId: uuid.describe('Thread id') })
	.describe('Input for listing the comments of a thread');
export type ListCommentsInput = z.infer<typeof ListCommentsInputSchema>;

export const ListCommentsOutputSchema = z
	.array(CommentSchema)
	.describe('The comments of the thread');
export type ListCommentsOutput = z.infer<typeof ListCommentsOutputSchema>;

export const CreateCommentInputSchema = z
	.object({
		threadId: uuid.describe('Thread to comment on'),
		content: z
			.string()
			.min(1)
			.max(750)
			.describe('Comment content (max 750 characters)'),
	})
	.describe('Comment on a thread');
export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>;

export const CreateCommentOutputSchema = CommentSchema.describe(
	'The comment as created',
);
export type CreateCommentOutput = z.infer<typeof CreateCommentOutputSchema>;

// ── webhooks ───────────────────────────────────────────────────────────────

export const ListWebhooksInputSchema = z
	.object({ teamId: uuid.describe('Team id') })
	.describe('Input for listing the webhooks of a team');
export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

export const ListWebhooksOutputSchema = z
	.array(WebhookSubscriptionSchema)
	.describe('The webhooks of the team');
export type ListWebhooksOutput = z.infer<typeof ListWebhooksOutputSchema>;

export const CreateWebhookInputSchema = z
	.object({
		teamId: uuid.describe('Team the webhook belongs to'),
		uri: z.string().url().describe('Endpoint deliveries are posted to'),
		mtype: z
			.enum(['application/json'])
			.describe('Payload format; JSON, the format the plugin reads'),
	})
	.describe(
		'Create a webhook for a team; Penpot sends no signature header, so verify deliveries another way',
	);
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;

export const CreateWebhookOutputSchema = WebhookSubscriptionSchema.describe(
	'The webhook as created',
);
export type CreateWebhookOutput = z.infer<typeof CreateWebhookOutputSchema>;

export const UpdateWebhookInputSchema = z
	.object({
		id: uuid.describe('Webhook id'),
		uri: z.string().url().describe('Endpoint deliveries are posted to'),
		mtype: z.enum(['application/json']).describe('Payload format'),
		isActive: z.boolean().describe('Whether deliveries are active'),
	})
	.describe('Update a webhook');
export type UpdateWebhookInput = z.infer<typeof UpdateWebhookInputSchema>;

export const UpdateWebhookOutputSchema = WebhookSubscriptionSchema.describe(
	'The webhook as updated',
);
export type UpdateWebhookOutput = z.infer<typeof UpdateWebhookOutputSchema>;

export const DeleteWebhookInputSchema = z
	.object({ id: uuid.describe('Webhook id') })
	.describe('Delete a webhook');
export type DeleteWebhookInput = z.infer<typeof DeleteWebhookInputSchema>;

export const DeleteWebhookOutputSchema = z
	.object({
		id: z.string().describe('Deleted webhook id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The webhook was deleted');
export type DeleteWebhookOutput = z.infer<typeof DeleteWebhookOutputSchema>;

// ── accessTokens ───────────────────────────────────────────────────────────

export const ListAccessTokensInputSchema = z
	.object({})
	.describe('Input for listing API access tokens (none)');
export type ListAccessTokensInput = z.infer<typeof ListAccessTokensInputSchema>;

export const ListAccessTokensOutputSchema = z
	.array(AccessTokenSchema)
	.describe('The API access tokens of the account');
export type ListAccessTokensOutput = z.infer<
	typeof ListAccessTokensOutputSchema
>;

export const DeleteAccessTokenInputSchema = z
	.object({ id: uuid.describe('Token id') })
	.describe('Revoke an API access token');
export type DeleteAccessTokenInput = z.infer<
	typeof DeleteAccessTokenInputSchema
>;

export const DeleteAccessTokenOutputSchema = z
	.object({
		id: z.string().describe('Revoked token id'),
		success: z.boolean().describe('Whether the revoke succeeded'),
	})
	.describe('The access token was revoked');
export type DeleteAccessTokenOutput = z.infer<
	typeof DeleteAccessTokenOutputSchema
>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PenpotEndpointInputSchemas = {
	teamsList: ListTeamsInputSchema,
	teamsCreate: CreateTeamInputSchema,
	teamsGet: GetTeamInputSchema,
	teamsDelete: DeleteTeamInputSchema,
	projectsListAll: ListAllProjectsInputSchema,
	projectsCreate: CreateProjectInputSchema,
	projectsGet: GetProjectInputSchema,
	projectsRename: RenameProjectInputSchema,
	projectsDelete: DeleteProjectInputSchema,
	projectsDuplicate: DuplicateProjectInputSchema,
	filesGet: GetFileInputSchema,
	filesCreate: CreateFileInputSchema,
	filesDelete: DeleteFileInputSchema,
	filesDuplicate: DuplicateFileInputSchema,
	filesRename: RenameFileInputSchema,
	filesSnapshotsList: ListSnapshotsInputSchema,
	filesSnapshotsCreate: CreateSnapshotInputSchema,
	filesSnapshotsDelete: DeleteSnapshotInputSchema,
	filesShareLinkCreate: CreateShareLinkInputSchema,
	filesShareLinkDelete: DeleteShareLinkInputSchema,
	commentsThreadsList: ListThreadsInputSchema,
	commentsThreadGet: GetThreadInputSchema,
	commentsThreadCreate: CreateThreadInputSchema,
	commentsList: ListCommentsInputSchema,
	commentsCreate: CreateCommentInputSchema,
	webhooksList: ListWebhooksInputSchema,
	webhooksCreate: CreateWebhookInputSchema,
	webhooksUpdate: UpdateWebhookInputSchema,
	webhooksDelete: DeleteWebhookInputSchema,
	accessTokensList: ListAccessTokensInputSchema,
	accessTokensDelete: DeleteAccessTokenInputSchema,
};

export const PenpotEndpointOutputSchemas = {
	teamsList: ListTeamsOutputSchema,
	teamsCreate: CreateTeamOutputSchema,
	teamsGet: GetTeamOutputSchema,
	teamsDelete: DeleteTeamOutputSchema,
	projectsListAll: ListAllProjectsOutputSchema,
	projectsCreate: CreateProjectOutputSchema,
	projectsGet: GetProjectOutputSchema,
	projectsRename: RenameProjectOutputSchema,
	projectsDelete: DeleteProjectOutputSchema,
	projectsDuplicate: DuplicateProjectOutputSchema,
	filesGet: GetFileOutputSchema,
	filesCreate: CreateFileOutputSchema,
	filesDelete: DeleteFileOutputSchema,
	filesDuplicate: DuplicateFileOutputSchema,
	filesRename: RenameFileOutputSchema,
	filesSnapshotsList: ListSnapshotsOutputSchema,
	filesSnapshotsCreate: CreateSnapshotOutputSchema,
	filesSnapshotsDelete: DeleteSnapshotOutputSchema,
	filesShareLinkCreate: CreateShareLinkOutputSchema,
	filesShareLinkDelete: DeleteShareLinkOutputSchema,
	commentsThreadsList: ListThreadsOutputSchema,
	commentsThreadGet: GetThreadOutputSchema,
	commentsThreadCreate: CreateThreadOutputSchema,
	commentsList: ListCommentsOutputSchema,
	commentsCreate: CreateCommentOutputSchema,
	webhooksList: ListWebhooksOutputSchema,
	webhooksCreate: CreateWebhookOutputSchema,
	webhooksUpdate: UpdateWebhookOutputSchema,
	webhooksDelete: DeleteWebhookOutputSchema,
	accessTokensList: ListAccessTokensOutputSchema,
	accessTokensDelete: DeleteAccessTokenOutputSchema,
};

export type PenpotEndpointInputs = {
	[K in keyof typeof PenpotEndpointInputSchemas]: z.input<
		(typeof PenpotEndpointInputSchemas)[K]
	>;
};

export type PenpotEndpointOutputs = {
	[K in keyof typeof PenpotEndpointOutputSchemas]: z.infer<
		(typeof PenpotEndpointOutputSchemas)[K]
	>;
};
