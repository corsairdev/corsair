import { z } from 'zod';

const MetaPagination = z
	.object({
		cursors: z
			.object({
				before: z.string().optional(),
				after: z.string().optional(),
			})
			.optional(),
		next: z.url().optional(),
	})
	.optional();

export const InstagramUser = z.object({
	id: z.string(),
	ig_id: z.number().optional(),
	username: z.string().optional(),
	name: z.string().nullable().optional(),
	biography: z.string().nullable().optional(),
	profile_picture_url: z.url().nullable().optional(),
	followers_count: z.number().default(0),
	follows_count: z.number().default(0),
	media_count: z.number().default(0),
	website: z.url().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookPageSchema = z.object({
	access_token: z.string().optional().describe('Page Access Token'),
	category: z.string().optional(),
	category_list: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
			}),
		)
		.optional(),

	name: z.string().optional(),
	id: z.string().describe('Facebook Page ID'),
	instagram_business_account: z
		.object({
			id: z.string(),
		})
		.optional(),
	tasks: z.array(z.string()).optional(),
});

export const FacebookPagesResponseSchema = z.object({
	data: z.array(FacebookPageSchema),
	paging: MetaPagination,
});

export const FacebookUser = z.object({
	name: z.string().optional(),
	id: z.string(),
});

export const UserDetails = z.object({
	facebookUserId: z.string().optional(),
	pageId: z.string().optional(),
	pageAccessToken: z.string().optional(),
	instagramBusinessAccountId: z.string().optional(),
	instagramUsername: z.string().optional(),
	createdAt: z.iso.datetime().default(() => new Date().toISOString()),
});

export const InstagramMessage = z.object({
	messageId: z.string().optional(),
	conversationId: z.string().optional(),
	senderId: z.string().optional(),
	recipient: z.string().optional(),
	senderName: z.string().optional(),
	message: z.string().optional(),
	createdAt: z.iso.datetime().default(() => new Date().toISOString()),
	updatedAt: z.iso.datetime().default(() => new Date().toISOString()),
});

export const InstagramConversation = z.object({
	conversationId: z.string().optional(),
	pageId: z.string().optional(),
	createdAt: z.iso.datetime().default(() => new Date().toISOString()),
});

export const FacebookPages = z.object({
	facebookId: z.string().optional(),
	id: z.string().optional(),
	access_token: z.string().optional(),
	name: z.string().optional(),
});

export const InstagramMedia = z.object({
	id: z.string(),
	username: z.string().optional(),
	media_url: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	caption: z.string().optional(),
});

export type InstagramUser = z.infer<typeof InstagramUser>;
export type FacebookPageSchema = z.infer<typeof FacebookPageSchema>;
export type FacebookPagesResponseSchema = z.infer<
	typeof FacebookPagesResponseSchema
>;
export type InstagramConversation = z.infer<typeof InstagramConversation>;
export type InstagramMessage = z.infer<typeof InstagramMessage>;
export type UserDetails = z.infer<typeof UserDetails>;
export type FacebookUser = z.infer<typeof FacebookUser>;
export type FacebookPages = z.infer<typeof FacebookPages>;
