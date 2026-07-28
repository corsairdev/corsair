import { z } from 'zod';

import {
	FacebookBatchResponseSchema,
	FacebookCommentSchema,
	FacebookCommentsListSchema,
	FacebookConversationSchema,
	FacebookConversationsListSchema,
	FacebookInsightSchema,
	FacebookInsightsListSchema,
	FacebookMessageSchema,
	FacebookMessagesListSchema,
	FacebookMessengerActionResponseSchema,
	FacebookPageRoleSchema,
	FacebookPageRolesListSchema,
	FacebookPageSchema,
	FacebookPagesListSchema,
	FacebookPhotoSchema,
	FacebookPhotosListSchema,
	FacebookPostSchema,
	FacebookPostsListSchema,
	FacebookReactionSchema,
	FacebookReactionsListSchema,
	FacebookUserSchema,
	FacebookVideoSchema,
	FacebookVideosListSchema,
	GraphIdResponseSchema,
	GraphSuccessResponseSchema,
	PageIdInputSchema,
	PaginationInputSchema,
	ReactionTypeSchema,
} from './types/common';

export * from './types/common';

// ─── Users ───────────────────────────────────────────────────────────────────

const GetCurrentUserInputSchema = PaginationInputSchema.pick({
	fields: true,
}).describe('Retrieve the authenticated Facebook user.');

const GetUserPagesInputSchema = PaginationInputSchema.extend({}).describe(
	'Deprecated. Use pages.listManaged instead. Lists Facebook Pages for the authenticated user via /me/accounts.',
);

const ListManagedPagesInputSchema = PaginationInputSchema.describe(
	'List Facebook Pages the authenticated user manages, including page access tokens and assigned tasks.',
);

// ─── Pages ───────────────────────────────────────────────────────────────────

const GetPageDetailsInputSchema = PageIdInputSchema.merge(
	PaginationInputSchema.pick({ fields: true }),
).describe('Retrieve metadata for a Facebook Page.');

const SearchPagesInputSchema = z
	.object({
		q: z.string().describe('Search query for page names.'),
		fields: z.string().optional(),
		limit: z.number().int().positive().max(100).optional(),
		after: z.string().optional(),
	})
	.describe(
		'DEPRECATED for standard Facebook apps: /pages/search is Workplace-only and returns Error #10 for most apps. Prefer pages.listManaged or direct page ID lookup.',
	);

const UpdatePageSettingsInputSchema = z
	.object({
		page_id: z.string(),
		about: z.string().optional(),
		description: z.string().optional(),
		emails: z.array(z.string()).optional(),
		phone: z.string().optional(),
		website: z.string().optional(),
		general_info: z.string().optional(),
	})
	.describe('Update editable settings on a Facebook Page.');

const GetPageInsightsInputSchema = PageIdInputSchema.extend({
	metric: z
		.union([z.string(), z.array(z.string())])
		.describe('Insight metric name(s), e.g. page_impressions.'),
	period: z.enum(['day', 'week', 'days_28', 'month', 'lifetime']).optional(),
	since: z.union([z.string(), z.number()]).optional(),
	until: z.union([z.string(), z.number()]).optional(),
}).describe('Retrieve Page insights for the given metrics and period.');

const GetPageRolesInputSchema = PageIdInputSchema.merge(PaginationInputSchema)
	.pick({ page_id: true, fields: true, limit: true, after: true, before: true })
	.describe('List users and their roles on a Facebook Page.');

const AssignPageTaskInputSchema = z
	.object({
		page_id: z.string(),
		user: z.string().describe('Facebook User ID to assign tasks to.'),
		tasks: z
			.array(z.string())
			.describe(
				'Page tasks such as MANAGE, CREATE_CONTENT, MODERATE, ADVERTISE, ANALYZE.',
			),
	})
	.describe('Assign Page tasks to a user.');

const RemovePageTaskInputSchema = z
	.object({
		page_id: z.string(),
		user: z.string().describe('Facebook User ID to remove from Page tasks.'),
	})
	.describe('Remove a user from Page task assignments.');

// ─── Posts ───────────────────────────────────────────────────────────────────

const CreatePostInputSchema = z
	.object({
		page_id: z.string(),
		message: z.string().optional(),
		link: z.string().optional(),
		published: z.boolean().optional(),
		scheduled_publish_time: z.number().optional(),
		targeting: z.record(z.string(), z.unknown()).optional(),
	})
	.refine((value) => Boolean(value.message || value.link), {
		message: 'Either message or link is required to create a post.',
	})
	.describe('Publish or schedule a Page feed post.');

const GetPostInputSchema = z
	.object({
		post_id: z.string(),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when post_id is composite PageID_PostID.',
			),
		fields: z.string().optional(),
	})
	.describe('Retrieve a single Page post by ID.');

const GetPagePostsInputSchema = PageIdInputSchema.merge(
	PaginationInputSchema,
).describe(
	'List Page timeline posts via /feed (page posts + visitor posts + tagged posts).',
);

const GetScheduledPostsInputSchema = PageIdInputSchema.merge(
	PaginationInputSchema,
).describe('List scheduled but unpublished Page posts.');

const UpdatePostInputSchema = z
	.object({
		post_id: z.string(),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when post_id is composite PageID_PostID.',
			),
		message: z.string().optional(),
		is_hidden: z.boolean().optional(),
	})
	.describe('Update an existing Page post.');

const DeletePostInputSchema = z
	.object({
		post_id: z.string(),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when post_id is composite PageID_PostID.',
			),
	})
	.describe('Delete a Page post.');

const ReschedulePostInputSchema = z
	.object({
		post_id: z.string(),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when post_id is composite PageID_PostID.',
			),
		scheduled_publish_time: z
			.number()
			.describe('Unix timestamp for the new scheduled publish time.'),
	})
	.describe('Change the scheduled publish time of a post.');

const PublishScheduledPostInputSchema = z
	.object({
		post_id: z.string(),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when post_id is composite PageID_PostID.',
			),
	})
	.describe('Publish a previously scheduled post immediately.');

const GetPageTaggedPostsInputSchema = PageIdInputSchema.merge(
	PaginationInputSchema,
).describe('List posts in which the Page is tagged.');

const GetPostInsightsInputSchema = z
	.object({
		post_id: z.string(),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when post_id is composite PageID_PostID.',
			),
		metric: z.union([z.string(), z.array(z.string())]),
	})
	.describe('Retrieve insights for a Page post.');

const GetPostReactionsInputSchema = z
	.object({
		post_id: z.string(),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when post_id is composite PageID_PostID.',
			),
		type: ReactionTypeSchema.optional(),
		limit: z.number().int().positive().max(100).optional(),
		after: z.string().optional(),
		before: z.string().optional(),
	})
	.describe('List reactions on a Page post.');

// ─── Comments ────────────────────────────────────────────────────────────────

const CreateCommentInputSchema = z
	.object({
		object_id: z
			.string()
			.describe('Post ID, photo ID, or other commentable object ID.'),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when object_id is composite PageID_PostID.',
			),
		message: z.string(),
	})
	.describe('Create a comment on a Page post or other object.');

const GetCommentInputSchema = z
	.object({
		comment_id: z.string(),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when comment_id embeds the page id.',
			),
		fields: z.string().optional(),
	})
	.describe('Retrieve a single comment by ID.');

const GetCommentsInputSchema = z
	.object({
		object_id: z
			.string()
			.describe('Object ID whose comments should be listed.'),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when object_id is composite PageID_PostID.',
			),
		fields: z.string().optional(),
		limit: z.number().int().positive().max(100).optional(),
		after: z.string().optional(),
		before: z.string().optional(),
		filter: z.enum(['stream', 'toplevel']).optional(),
	})
	.describe('List comments on a Page post or other object.');

const UpdateCommentInputSchema = z
	.object({
		comment_id: z.string(),
		page_id: z
			.string()
			.describe('Page ID used to resolve the Page access token.'),
		message: z.string().optional(),
		is_hidden: z.boolean().optional(),
	})
	.describe('Update or hide a comment.');

const DeleteCommentInputSchema = z
	.object({
		comment_id: z.string(),
		page_id: z
			.string()
			.describe('Page ID used to resolve the Page access token.'),
	})
	.describe('Delete a comment.');

// ─── Reactions ───────────────────────────────────────────────────────────────

const AddReactionInputSchema = z
	.object({
		object_id: z
			.string()
			.describe('Post ID, comment ID, or other reactable object ID.'),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when object_id is composite PageID_PostID.',
			),
		type: ReactionTypeSchema.optional().describe(
			'Only LIKE is supported by the Graph API for programmatic reactions.',
		),
	})
	.describe('Add a LIKE reaction to a post or comment.');

const UnlikePostOrCommentInputSchema = z
	.object({
		object_id: z
			.string()
			.describe('Post ID or comment ID to remove a like/reaction from.'),
		page_id: z
			.string()
			.optional()
			.describe(
				'Page ID for Page-token auth. Optional when object_id is composite PageID_PostID.',
			),
	})
	.describe('Remove the Page like from an object.');

// ─── Photos ──────────────────────────────────────────────────────────────────

const UploadPhotoInputSchema = z
	.object({
		page_id: z.string(),
		url: z.string().optional(),
		caption: z.string().optional(),
		published: z.boolean().optional(),
		temporary: z.boolean().optional(),
		no_story: z.boolean().optional(),
	})
	.describe('Upload a photo to a Page. Provide a publicly accessible url.');

const UploadPhotosBatchInputSchema = z
	.object({
		page_id: z.string(),
		photos: z
			.array(
				z.object({
					url: z.string(),
					caption: z.string().optional(),
					published: z.boolean().optional(),
				}),
			)
			.min(1)
			.max(50),
	})
	.describe('Upload multiple photos using the Graph API batch endpoint.');

const CreatePhotoPostInputSchema = z
	.object({
		page_id: z.string(),
		url: z.string(),
		message: z.string().optional(),
		published: z.boolean().optional(),
		scheduled_publish_time: z.number().optional(),
	})
	.describe('Create and publish a photo post on a Page.');

const AddPhotosToAlbumInputSchema = z
	.object({
		album_id: z.string(),
		page_id: z
			.string()
			.describe('Page ID used to resolve the Page access token.'),
		url: z.string().optional(),
		message: z.string().optional(),
	})
	.describe('Add a photo to an existing album.');

const CreatePhotoAlbumInputSchema = z
	.object({
		page_id: z.string(),
		name: z.string(),
		message: z.string().optional(),
		location: z.string().optional(),
	})
	.describe('Create a photo album on a Page.');

const GetPagePhotosInputSchema = PageIdInputSchema.merge(
	PaginationInputSchema,
).describe('List photos uploaded to a Page.');

// ─── Videos ──────────────────────────────────────────────────────────────────

const CreateVideoPostInputSchema = z
	.object({
		page_id: z.string(),
		file_url: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		published: z.boolean().optional(),
		scheduled_publish_time: z.number().optional(),
	})
	.describe('Create a video post on a Page using file_url.');

const GetPageVideosInputSchema = PageIdInputSchema.merge(
	PaginationInputSchema,
).describe('List videos uploaded to a Page.');

const UploadVideoInputSchema = z
	.object({
		page_id: z.string(),
		file_url: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
		published: z.boolean().optional(),
	})
	.describe(
		'Deprecated direct upload helper. Prefer videos.createPost with resumable upload for large files.',
	);

// ─── Conversations & Messages ────────────────────────────────────────────────

const GetPageConversationsInputSchema = PageIdInputSchema.merge(
	PaginationInputSchema,
).describe('List Messenger conversations for a Page.');

const GetConversationMessagesInputSchema = z
	.object({
		page_id: z.string(),
		conversation_id: z.string(),
		fields: z.string().optional(),
		limit: z.number().int().positive().max(100).optional(),
		after: z.string().optional(),
		before: z.string().optional(),
	})
	.describe('List messages in a Messenger conversation.');

const GetMessageDetailsInputSchema = z
	.object({
		page_id: z.string(),
		message_id: z.string(),
		fields: z.string().optional(),
	})
	.describe('Retrieve a single Messenger message by ID.');

const SendMessageInputSchema = z
	.object({
		page_id: z.string(),
		recipient_id: z.string(),
		message: z.string(),
		messaging_type: z.enum(['RESPONSE', 'UPDATE', 'MESSAGE_TAG']).optional(),
		tag: z.string().optional(),
	})
	.describe('Send a text Messenger message from a Page.');

const SendMediaMessageInputSchema = z
	.object({
		page_id: z.string(),
		recipient_id: z.string(),
		attachment_type: z.enum(['image', 'video', 'audio', 'file']),
		attachment_url: z.string(),
		messaging_type: z.enum(['RESPONSE', 'UPDATE', 'MESSAGE_TAG']).optional(),
		tag: z.string().optional(),
	})
	.describe('Send a media Messenger message from a Page.');

const MarkMessageSeenInputSchema = z
	.object({
		page_id: z.string(),
		recipient_id: z.string(),
	})
	.describe('Mark the most recent messages in a conversation as seen.');

const ToggleTypingIndicatorInputSchema = z
	.object({
		page_id: z.string(),
		recipient_id: z.string(),
		action: z.enum(['typing_on', 'typing_off']),
	})
	.describe('Show or hide the Messenger typing indicator.');

// ─── Input / Output maps ───────────────────────────────────────────────────────

export type FacebookEndpointInputs = {
	getCurrentUser: z.infer<typeof GetCurrentUserInputSchema>;
	getUserPages: z.infer<typeof GetUserPagesInputSchema>;
	listManagedPages: z.infer<typeof ListManagedPagesInputSchema>;
	getPageDetails: z.infer<typeof GetPageDetailsInputSchema>;
	searchPages: z.infer<typeof SearchPagesInputSchema>;
	updatePageSettings: z.infer<typeof UpdatePageSettingsInputSchema>;
	getPageInsights: z.infer<typeof GetPageInsightsInputSchema>;
	getPageRoles: z.infer<typeof GetPageRolesInputSchema>;
	assignPageTask: z.infer<typeof AssignPageTaskInputSchema>;
	removePageTask: z.infer<typeof RemovePageTaskInputSchema>;
	createPost: z.infer<typeof CreatePostInputSchema>;
	getPost: z.infer<typeof GetPostInputSchema>;
	getPagePosts: z.infer<typeof GetPagePostsInputSchema>;
	getScheduledPosts: z.infer<typeof GetScheduledPostsInputSchema>;
	updatePost: z.infer<typeof UpdatePostInputSchema>;
	deletePost: z.infer<typeof DeletePostInputSchema>;
	reschedulePost: z.infer<typeof ReschedulePostInputSchema>;
	publishScheduledPost: z.infer<typeof PublishScheduledPostInputSchema>;
	getPageTaggedPosts: z.infer<typeof GetPageTaggedPostsInputSchema>;
	getPostInsights: z.infer<typeof GetPostInsightsInputSchema>;
	getPostReactions: z.infer<typeof GetPostReactionsInputSchema>;
	createComment: z.infer<typeof CreateCommentInputSchema>;
	getComment: z.infer<typeof GetCommentInputSchema>;
	getComments: z.infer<typeof GetCommentsInputSchema>;
	updateComment: z.infer<typeof UpdateCommentInputSchema>;
	deleteComment: z.infer<typeof DeleteCommentInputSchema>;
	addReaction: z.infer<typeof AddReactionInputSchema>;
	unlikePostOrComment: z.infer<typeof UnlikePostOrCommentInputSchema>;
	uploadPhoto: z.infer<typeof UploadPhotoInputSchema>;
	uploadPhotosBatch: z.infer<typeof UploadPhotosBatchInputSchema>;
	createPhotoPost: z.infer<typeof CreatePhotoPostInputSchema>;
	addPhotosToAlbum: z.infer<typeof AddPhotosToAlbumInputSchema>;
	createPhotoAlbum: z.infer<typeof CreatePhotoAlbumInputSchema>;
	getPagePhotos: z.infer<typeof GetPagePhotosInputSchema>;
	createVideoPost: z.infer<typeof CreateVideoPostInputSchema>;
	getPageVideos: z.infer<typeof GetPageVideosInputSchema>;
	uploadVideo: z.infer<typeof UploadVideoInputSchema>;
	getPageConversations: z.infer<typeof GetPageConversationsInputSchema>;
	getConversationMessages: z.infer<typeof GetConversationMessagesInputSchema>;
	getMessageDetails: z.infer<typeof GetMessageDetailsInputSchema>;
	sendMessage: z.infer<typeof SendMessageInputSchema>;
	sendMediaMessage: z.infer<typeof SendMediaMessageInputSchema>;
	markMessageSeen: z.infer<typeof MarkMessageSeenInputSchema>;
	toggleTypingIndicator: z.infer<typeof ToggleTypingIndicatorInputSchema>;
};

export type FacebookEndpointOutputs = {
	getCurrentUser: z.infer<typeof FacebookUserSchema>;
	getUserPages: z.infer<typeof FacebookPagesListSchema>;
	listManagedPages: z.infer<typeof FacebookPagesListSchema>;
	getPageDetails: z.infer<typeof FacebookPageSchema>;
	searchPages: z.infer<typeof FacebookPagesListSchema>;
	updatePageSettings: z.infer<typeof GraphSuccessResponseSchema>;
	getPageInsights: z.infer<typeof FacebookInsightsListSchema>;
	getPageRoles: z.infer<typeof FacebookPageRolesListSchema>;
	assignPageTask: z.infer<typeof GraphSuccessResponseSchema>;
	removePageTask: z.infer<typeof GraphSuccessResponseSchema>;
	createPost: z.infer<typeof GraphIdResponseSchema>;
	getPost: z.infer<typeof FacebookPostSchema>;
	getPagePosts: z.infer<typeof FacebookPostsListSchema>;
	getScheduledPosts: z.infer<typeof FacebookPostsListSchema>;
	updatePost: z.infer<typeof GraphSuccessResponseSchema>;
	deletePost: z.infer<typeof GraphSuccessResponseSchema>;
	reschedulePost: z.infer<typeof GraphSuccessResponseSchema>;
	publishScheduledPost: z.infer<typeof GraphSuccessResponseSchema>;
	getPageTaggedPosts: z.infer<typeof FacebookPostsListSchema>;
	getPostInsights: z.infer<typeof FacebookInsightsListSchema>;
	getPostReactions: z.infer<typeof FacebookReactionsListSchema>;
	createComment: z.infer<typeof GraphIdResponseSchema>;
	getComment: z.infer<typeof FacebookCommentSchema>;
	getComments: z.infer<typeof FacebookCommentsListSchema>;
	updateComment: z.infer<typeof GraphSuccessResponseSchema>;
	deleteComment: z.infer<typeof GraphSuccessResponseSchema>;
	addReaction: z.infer<typeof GraphSuccessResponseSchema>;
	unlikePostOrComment: z.infer<typeof GraphSuccessResponseSchema>;
	uploadPhoto: z.infer<typeof GraphIdResponseSchema>;
	uploadPhotosBatch: z.infer<typeof FacebookBatchResponseSchema>;
	createPhotoPost: z.infer<typeof GraphIdResponseSchema>;
	addPhotosToAlbum: z.infer<typeof GraphIdResponseSchema>;
	createPhotoAlbum: z.infer<typeof GraphIdResponseSchema>;
	getPagePhotos: z.infer<typeof FacebookPhotosListSchema>;
	createVideoPost: z.infer<typeof GraphIdResponseSchema>;
	getPageVideos: z.infer<typeof FacebookVideosListSchema>;
	uploadVideo: z.infer<typeof GraphIdResponseSchema>;
	getPageConversations: z.infer<typeof FacebookConversationsListSchema>;
	getConversationMessages: z.infer<typeof FacebookMessagesListSchema>;
	getMessageDetails: z.infer<typeof FacebookMessageSchema>;
	sendMessage: z.infer<typeof FacebookMessengerActionResponseSchema>;
	sendMediaMessage: z.infer<typeof FacebookMessengerActionResponseSchema>;
	markMessageSeen: z.infer<typeof FacebookMessengerActionResponseSchema>;
	toggleTypingIndicator: z.infer<typeof FacebookMessengerActionResponseSchema>;
};

export const FacebookEndpointInputSchemas = {
	getCurrentUser: GetCurrentUserInputSchema,
	getUserPages: GetUserPagesInputSchema,
	listManagedPages: ListManagedPagesInputSchema,
	getPageDetails: GetPageDetailsInputSchema,
	searchPages: SearchPagesInputSchema,
	updatePageSettings: UpdatePageSettingsInputSchema,
	getPageInsights: GetPageInsightsInputSchema,
	getPageRoles: GetPageRolesInputSchema,
	assignPageTask: AssignPageTaskInputSchema,
	removePageTask: RemovePageTaskInputSchema,
	createPost: CreatePostInputSchema,
	getPost: GetPostInputSchema,
	getPagePosts: GetPagePostsInputSchema,
	getScheduledPosts: GetScheduledPostsInputSchema,
	updatePost: UpdatePostInputSchema,
	deletePost: DeletePostInputSchema,
	reschedulePost: ReschedulePostInputSchema,
	publishScheduledPost: PublishScheduledPostInputSchema,
	getPageTaggedPosts: GetPageTaggedPostsInputSchema,
	getPostInsights: GetPostInsightsInputSchema,
	getPostReactions: GetPostReactionsInputSchema,
	createComment: CreateCommentInputSchema,
	getComment: GetCommentInputSchema,
	getComments: GetCommentsInputSchema,
	updateComment: UpdateCommentInputSchema,
	deleteComment: DeleteCommentInputSchema,
	addReaction: AddReactionInputSchema,
	unlikePostOrComment: UnlikePostOrCommentInputSchema,
	uploadPhoto: UploadPhotoInputSchema,
	uploadPhotosBatch: UploadPhotosBatchInputSchema,
	createPhotoPost: CreatePhotoPostInputSchema,
	addPhotosToAlbum: AddPhotosToAlbumInputSchema,
	createPhotoAlbum: CreatePhotoAlbumInputSchema,
	getPagePhotos: GetPagePhotosInputSchema,
	createVideoPost: CreateVideoPostInputSchema,
	getPageVideos: GetPageVideosInputSchema,
	uploadVideo: UploadVideoInputSchema,
	getPageConversations: GetPageConversationsInputSchema,
	getConversationMessages: GetConversationMessagesInputSchema,
	getMessageDetails: GetMessageDetailsInputSchema,
	sendMessage: SendMessageInputSchema,
	sendMediaMessage: SendMediaMessageInputSchema,
	markMessageSeen: MarkMessageSeenInputSchema,
	toggleTypingIndicator: ToggleTypingIndicatorInputSchema,
} as const;

export const FacebookEndpointOutputSchemas = {
	getCurrentUser: FacebookUserSchema,
	getUserPages: FacebookPagesListSchema,
	listManagedPages: FacebookPagesListSchema,
	getPageDetails: FacebookPageSchema,
	searchPages: FacebookPagesListSchema,
	updatePageSettings: GraphSuccessResponseSchema,
	getPageInsights: FacebookInsightsListSchema,
	getPageRoles: FacebookPageRolesListSchema,
	assignPageTask: GraphSuccessResponseSchema,
	removePageTask: GraphSuccessResponseSchema,
	createPost: GraphIdResponseSchema,
	getPost: FacebookPostSchema,
	getPagePosts: FacebookPostsListSchema,
	getScheduledPosts: FacebookPostsListSchema,
	updatePost: GraphSuccessResponseSchema,
	deletePost: GraphSuccessResponseSchema,
	reschedulePost: GraphSuccessResponseSchema,
	publishScheduledPost: GraphSuccessResponseSchema,
	getPageTaggedPosts: FacebookPostsListSchema,
	getPostInsights: FacebookInsightsListSchema,
	getPostReactions: FacebookReactionsListSchema,
	createComment: GraphIdResponseSchema,
	getComment: FacebookCommentSchema,
	getComments: FacebookCommentsListSchema,
	updateComment: GraphSuccessResponseSchema,
	deleteComment: GraphSuccessResponseSchema,
	addReaction: GraphSuccessResponseSchema,
	unlikePostOrComment: GraphSuccessResponseSchema,
	uploadPhoto: GraphIdResponseSchema,
	uploadPhotosBatch: FacebookBatchResponseSchema,
	createPhotoPost: GraphIdResponseSchema,
	addPhotosToAlbum: GraphIdResponseSchema,
	createPhotoAlbum: GraphIdResponseSchema,
	getPagePhotos: FacebookPhotosListSchema,
	createVideoPost: GraphIdResponseSchema,
	getPageVideos: FacebookVideosListSchema,
	uploadVideo: GraphIdResponseSchema,
	getPageConversations: FacebookConversationsListSchema,
	getConversationMessages: FacebookMessagesListSchema,
	getMessageDetails: FacebookMessageSchema,
	sendMessage: FacebookMessengerActionResponseSchema,
	sendMediaMessage: FacebookMessengerActionResponseSchema,
	markMessageSeen: FacebookMessengerActionResponseSchema,
	toggleTypingIndicator: FacebookMessengerActionResponseSchema,
} as const;

export {
	FacebookCommentSchema,
	FacebookConversationSchema,
	FacebookInsightSchema,
	FacebookMessageSchema,
	FacebookPageRoleSchema,
	FacebookPageSchema,
	FacebookPhotoSchema,
	FacebookPostSchema,
	FacebookReactionSchema,
	FacebookUserSchema,
	FacebookVideoSchema,
};
