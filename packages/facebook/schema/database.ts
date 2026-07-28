import { z } from 'zod';

export const FacebookUserEntity = z.object({
	facebookUserId: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookPageEntity = z.object({
	facebookId: z.string().optional(),
	name: z.string().optional(),
	accessToken: z.string().optional(),
	category: z.string().optional(),
	about: z.string().optional(),
	link: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),
	tasks: z.array(z.string()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookPostEntity = z.object({
	postId: z.string().optional(),
	pageId: z.string().optional(),
	message: z.string().optional(),
	createdTime: z.string().optional(),
	isPublished: z.boolean().optional(),
	permalinkUrl: z.string().optional(),
	scheduledPublishTime: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookCommentEntity = z.object({
	commentId: z.string().optional(),
	objectId: z.string().optional(),
	message: z.string().optional(),
	createdTime: z.string().optional(),
	authorId: z.string().optional(),
	authorName: z.string().optional(),
	isHidden: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookConversationEntity = z.object({
	conversationId: z.string().optional(),
	pageId: z.string().optional(),
	updatedTime: z.string().optional(),
	messageCount: z.number().optional(),
	unreadCount: z.number().optional(),
	snippet: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookMessageEntity = z.object({
	messageId: z.string().optional(),
	conversationId: z.string().optional(),
	pageId: z.string().optional(),
	message: z.string().optional(),
	createdTime: z.string().optional(),
	senderId: z.string().optional(),
	senderName: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookAlbumEntity = z.object({
	albumId: z.string().optional(),
	pageId: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	photoCount: z.number().optional(),
	link: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookPhotoEntity = z.object({
	photoId: z.string().optional(),
	pageId: z.string().optional(),
	albumId: z.string().optional(),
	name: z.string().optional(),
	source: z.string().optional(),
	link: z.string().optional(),
	createdTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookVideoEntity = z.object({
	videoId: z.string().optional(),
	pageId: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	source: z.string().optional(),
	permalinkUrl: z.string().optional(),
	createdTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookInsightEntity = z.object({
	insightId: z.string().optional(),
	objectId: z.string().optional(),
	name: z.string().optional(),
	period: z.string().optional(),
	value: z
		.union([z.number(), z.string(), z.record(z.string(), z.unknown())])
		.optional(),
	endTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookReactionEntity = z.object({
	objectId: z.string().optional(),
	userId: z.string().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookPageRoleEntity = z.object({
	pageId: z.string().optional(),
	userId: z.string().optional(),
	name: z.string().optional(),
	role: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type FacebookUserEntity = z.infer<typeof FacebookUserEntity>;
export type FacebookPageEntity = z.infer<typeof FacebookPageEntity>;
export type FacebookPostEntity = z.infer<typeof FacebookPostEntity>;
export type FacebookCommentEntity = z.infer<typeof FacebookCommentEntity>;
export type FacebookConversationEntity = z.infer<
	typeof FacebookConversationEntity
>;
export type FacebookMessageEntity = z.infer<typeof FacebookMessageEntity>;
export type FacebookAlbumEntity = z.infer<typeof FacebookAlbumEntity>;
export type FacebookPhotoEntity = z.infer<typeof FacebookPhotoEntity>;
export type FacebookVideoEntity = z.infer<typeof FacebookVideoEntity>;
export type FacebookInsightEntity = z.infer<typeof FacebookInsightEntity>;
export type FacebookReactionEntity = z.infer<typeof FacebookReactionEntity>;
export type FacebookPageRoleEntity = z.infer<typeof FacebookPageRoleEntity>;
