import { z } from 'zod';
import { AccountId, NoContentSchema } from './shared';

// Generated from the per-operation OpenAPI definitions in Unipile's v2
// reference (API 2.62). Inputs follow the spec field for field; outputs
// type two levels of each response and pass the rest through.

const PostsGetShape1 = z
	.object({
		contact_name: z.string().nullish(),
		messaging_identifier: z.string().nullish(),
		location: z.string().nullish(),
		network_distance: z.string().nullish(),
		industry: z.string().nullish(),
		is_following: z.boolean().nullish(),
		followers_count: z.number().nullish(),
		relations_count: z.number().nullish(),
		shared_relations_count: z.number().nullish(),
		website_url: z.string().nullish(),
		portfolio_url: z.string().nullish(),
		services_page_url: z.string().nullish(),
		is_premium: z.boolean().nullish(),
		is_verified: z.boolean().nullish(),
	})
	.loose();

const PostsGetShape2 = z
	.object({
		id: z.string().describe('The ID of the event.'),
		name: z.string().describe('The name of the event.'),
		url: z.string().nullish().describe('The link to the event.'),
		online: z.boolean().describe('Whether the event is an online event.'),
		location: z.string().nullish().describe('The location of the event.'),
		description: z.string().nullish().describe('The description of the event.'),
		public_picture_url: z
			.string()
			.nullish()
			.describe('Public url to the picture of the event.'),
		starts_on: z
			.string()
			.nullish()
			.describe(
				'The date when the event will start. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
			),
		ends_on: z
			.string()
			.nullish()
			.describe(
				'The date when the event will end. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
			),
	})
	.loose();

const PostsGetShape3 = z
	.object({
		impressions_counter: z
			.number()
			.nullish()
			.describe('The number of impressions of the post.'),
		engagements_counter: z
			.number()
			.nullish()
			.describe('The number of engagements of the post.'),
		engagement_rate: z
			.number()
			.nullish()
			.describe('The engagement rate of the post.'),
		clicks_counter: z
			.number()
			.nullish()
			.describe('The number of clicks of the post.'),
		clickthrough_rate: z
			.number()
			.nullish()
			.describe('The clickthrough rate of the post.'),
		page_viewers_from_this_post_counter: z
			.number()
			.nullish()
			.describe('The number of page viewers from this post.'),
		followers_gained_from_this_post_counter: z
			.number()
			.nullish()
			.describe('The number of followers gained from this post.'),
		users_reached_counter: z
			.number()
			.nullish()
			.describe('The number of users reached from this post.'),
	})
	.loose();

const PostsGetShape4 = z
	.object({
		object: z.string().nullish(),
		id: z.string().nullish(),
		file_size: z.number().nullish(),
		is_inline: z.boolean().nullish(),
		content_id: z.string().nullish(),
		is_unavailable: z.boolean().nullish(),
		mimetype: z.string().nullish(),
		url: z.string().nullish(),
		url_expires_at: z.string().nullish(),
		content: z.string().nullish(),
		type: z.string().nullish(),
		duration: z.number().nullish(),
		voice_note: z.boolean().nullish(),
		size: z.record(z.string(), z.unknown()).nullish(),
		sticker: z.boolean().nullish(),
		gif: z.boolean().nullish(),
		filename: z.string().nullish(),
		media_type: z.string().nullish(),
		author: z.string().nullish(),
		description: z.string().nullish(),
		display_name: z.string().nullish(),
		organization: z.string().nullish(),
		phones: z.array(z.unknown()).nullish(),
		emails: z.array(z.unknown()).nullish(),
	})
	.loose();

const PostsCreateShape5 = z
	.object({
		id: z
			.string()
			.describe(
				'Unique identifier of the user for the provider. Usually an internal identifier used by the API only.',
			),
		object: z.string(),
		type: z
			.string()
			.describe(
				'Type of the user - `individual` is an individual user. - `organization` is an organization / business entity. - `other` is an other type of entity.',
			),
		public_identifier: z
			.string()
			.nullish()
			.describe(
				'Public identifier of the user for the provider. Usually a shareable tag visible in urls and profiles.',
			),
		display_name: z
			.string()
			.describe('Display name of the user as exposed by the provider.'),
		first_name: z.string().nullish().describe('First name of the user.'),
		last_name: z.string().nullish().describe('Last name of the user.'),
		profile_url: z
			.string()
			.nullish()
			.describe('Public url to the profile of the user.'),
		public_picture_url: z
			.string()
			.nullish()
			.describe('Public url to the profile picture of the user.'),
		private_picture_download_url: z
			.string()
			.nullish()
			.describe(
				'Private url to download the profile picture of the user. This url require authentication.',
			),
		description: z.string().nullish().describe('Description of the user.'),
		specifics: z.unknown().nullish().describe('Provider-specific user data.'),
	})
	.loose();

const PostsGetShape6 = z
	.object({
		id: z
			.string()
			.describe(
				'Unique identifier of the user for the provider. Usually an internal identifier used by the API only.',
			),
		object: z.string(),
		type: z
			.string()
			.describe(
				'Type of the user - `individual` is an individual user. - `organization` is an organization / business entity. - `other` is an other type of entity.',
			),
		public_identifier: z
			.string()
			.nullish()
			.describe(
				'Public identifier of the user for the provider. Usually a shareable tag visible in urls and profiles.',
			),
		display_name: z
			.string()
			.describe('Display name of the user as exposed by the provider.'),
		first_name: z.string().nullish().describe('First name of the user.'),
		last_name: z.string().nullish().describe('Last name of the user.'),
		profile_url: z
			.string()
			.nullish()
			.describe('Public url to the profile of the user.'),
		public_picture_url: z
			.string()
			.nullish()
			.describe('Public url to the profile picture of the user.'),
		private_picture_download_url: z
			.string()
			.nullish()
			.describe(
				'Private url to download the profile picture of the user. This url require authentication.',
			),
		description: z.string().nullish().describe('Description of the user.'),
		specifics: PostsGetShape1.nullish().describe(
			'Object containing provider-specific user profile data.',
		),
	})
	.loose();

const PostsCreateShape7 = z
	.object({
		object: z.string(),
		id: z.string().describe('The ID of the post for the provider.'),
		share_url: z.string().describe('The URL to share the post.'),
		created_at: z
			.string()
			.describe(
				'The creation date of the post. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
			),
		title: z.string().nullish().describe('The title of the post.'),
		text: z.string().describe('The text content of the post.'),
		author: z
			.object({
				id: z.string(),
				object: z.string(),
				type: z.string(),
				public_identifier: z.string().nullish(),
				display_name: z.string(),
				first_name: z.string().nullish(),
				last_name: z.string().nullish(),
				profile_url: z.string().nullish(),
				public_picture_url: z.string().nullish(),
				private_picture_download_url: z.string().nullish(),
				description: z.string().nullish(),
				specifics: z.unknown().nullish(),
			})
			.loose()
			.describe('The author of the post.'),
		user_reacted: z
			.union([z.boolean(), z.string()])
			.describe(
				'If the account owner has reacted to this post, the value of the reaction (emoji unicode or reaction type), `true` if no details on the reaction, else `false`.',
			),
		permissions: z
			.object({
				can_share: z.boolean(),
				can_react: z.boolean(),
				can_post_comments: z.boolean(),
			})
			.loose()
			.describe('The permissions for the account owner on the post.'),
		reactions_counter: z
			.array(z.unknown())
			.nullable()
			.describe(
				'The counter of reactions to the post. `null` if counter is hidden.',
			),
		comments_counter: z
			.number()
			.nullable()
			.describe(
				'The number of comments to the post. `null` if counter is hidden.',
			),
		reposts_counter: z
			.number()
			.nullable()
			.describe(
				'The number of reposts of the post. `null` if counter is hidden.',
			),
		poll: z
			.object({
				id: z.string(),
				total_votes_count: z.number(),
				question: z.string(),
				is_open: z.boolean(),
				options: z.array(z.unknown()),
			})
			.loose()
			.nullish()
			.describe('Data about the poll if the post is a poll.'),
		event: z
			.object({
				id: z.string(),
				name: z.string(),
				url: z.string().nullish(),
				online: z.boolean(),
				location: z.string().nullish(),
				description: z.string().nullish(),
				public_picture_url: z.string().nullish(),
				starts_on: z.string().nullish(),
				ends_on: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe('Data about the event if the post is an event.'),
		attachments: z.array(z.unknown()).describe('List of post attachments.'),
		analytics: z
			.object({
				impressions_counter: z.number().nullish(),
				engagements_counter: z.number().nullish(),
				engagement_rate: z.number().nullish(),
				clicks_counter: z.number().nullish(),
				clickthrough_rate: z.number().nullish(),
				page_viewers_from_this_post_counter: z.number().nullish(),
				followers_gained_from_this_post_counter: z.number().nullish(),
				users_reached_counter: z.number().nullish(),
			})
			.loose()
			.nullish()
			.describe('Analytics data of the post.'),
		specifics: z
			.unknown()
			.nullish()
			.describe('Object containing provider-specific post data.'),
	})
	.loose();

const PostsAddCommentShape8 = z
	.object({
		object: z.string(),
		id: z.string().describe('The ID of the comment.'),
		thread_id: z
			.string()
			.nullish()
			.describe('The ID of the thread if this is a reply to another comment.'),
		author: PostsCreateShape5.describe('The author of the comment.'),
		created_at: z
			.string()
			.describe(
				'The creation date of the comment. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
			),
		text: z.string().describe('The text content of the comment.'),
		attachments: z
			.array(PostsGetShape4)
			.describe('List of comment attachments.'),
		is_sender: z
			.boolean()
			.describe('Is the current user the sender of the comment.'),
		can_reply: z
			.boolean()
			.describe('Whether the current user can reply to the comment or not.'),
		can_react: z
			.boolean()
			.describe('Whether the current user can react to the comment or not.'),
		reply_counter: z.number().describe('The number of replies to the comment.'),
		impressions_counter: z
			.number()
			.nullish()
			.describe('The number of impressions of the comment.'),
		reactions_counter: z
			.array(z.object({ reaction: z.string(), count: z.number() }).loose())
			.describe('A list of reactions to the element.'),
	})
	.loose();

const PostsCreateShape9 = z
	.object({
		object: z.string(),
		id: z.string().describe('The ID of the post for the provider.'),
		share_url: z.string().describe('The URL to share the post.'),
		created_at: z
			.string()
			.describe(
				'The creation date of the post. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
			),
		title: z.string().nullish().describe('The title of the post.'),
		text: z.string().describe('The text content of the post.'),
		author: PostsCreateShape5.describe('The author of the post.'),
		user_reacted: z
			.union([z.boolean(), z.string()])
			.describe(
				'If the account owner has reacted to this post, the value of the reaction (emoji unicode or reaction type), `true` if no details on the reaction, else `false`.',
			),
		permissions: z
			.object({
				can_share: z
					.boolean()
					.describe('Whether the account owner can share the post.'),
				can_react: z
					.boolean()
					.describe('Whether the account owner can react to the post.'),
				can_post_comments: z
					.boolean()
					.describe('Whether the account owner can comment on the post.'),
			})
			.loose()
			.describe('The permissions for the account owner on the post.'),
		reactions_counter: z
			.array(z.object({ reaction: z.string(), count: z.number() }).loose())
			.nullable()
			.describe(
				'The counter of reactions to the post. `null` if counter is hidden.',
			),
		comments_counter: z
			.number()
			.nullable()
			.describe(
				'The number of comments to the post. `null` if counter is hidden.',
			),
		reposts_counter: z
			.number()
			.nullable()
			.describe(
				'The number of reposts of the post. `null` if counter is hidden.',
			),
		poll: z
			.object({
				id: z.string().describe('The ID of the poll.'),
				total_votes_count: z
					.number()
					.describe('The total number of votes for the poll.'),
				question: z.string().describe('The question of the poll.'),
				is_open: z
					.boolean()
					.describe(
						'Whether the poll is open. If the poll is closed, the user can only see the results.',
					),
				options: z.array(z.unknown()),
			})
			.loose()
			.nullish()
			.describe('Data about the poll if the post is a poll.'),
		event: PostsGetShape2.nullish().describe(
			'Data about the event if the post is an event.',
		),
		attachments: z.array(PostsGetShape4).describe('List of post attachments.'),
		analytics: PostsGetShape3.nullish().describe('Analytics data of the post.'),
		specifics: z
			.unknown()
			.nullish()
			.describe('Object containing provider-specific post data.'),
		is_repost: z
			.boolean()
			.describe(
				'`true` if this post is reposted by someone without quote. Quoted post does not qualify as a repost.',
			),
		reposted_by: PostsCreateShape5.nullish().describe(
			'The user who reposted the post if `is_repost` is `true`.',
		),
		quoted_post: PostsCreateShape7.nullish().describe(
			'The post that is quoted in this post.',
		),
	})
	.loose();

export const PostsInputSchemas = {
	postsGet: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post to retrieve. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		account_id: AccountId,
	}),
	postsCreate: z.object({
		account_id: AccountId,
		text: z
			.string()
			.describe(
				'Textual content of the post. User mentions can be added by inserting an @ followed by the ID or public identifier of the user (example: @JohnDoe).',
			),
		attachments: z
			.array(
				z.object({
					content: z
						.string()
						.describe(
							'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
						),
					content_type: z.string().describe('MIME type of the file.'),
					filename: z
						.string()
						.describe('Name of the file (including extension).'),
					metadata: z
						.object({
							duration: z
								.number()
								.optional()
								.describe('Duration of the media file.'),
						})
						.loose()
						.optional()
						.describe('Metadata of the the file.'),
				}),
			)
			.optional()
			.describe('The list of files to appear in the post.'),
		can_read: z
			.enum(['anyone', 'relations_only'])
			.optional()
			.describe(
				"The visibility level for the new post (if supported by the provider). - `anyone` is visible to anyone. - `relations_only` is visible only to the user's relations.",
			),
		can_comment: z
			.enum(['anyone', 'relations_only', 'no_one'])
			.optional()
			.describe(
				"The comment control level for the new post (if supported by the provider). - `anyone` anyone can comment. - `relations_only` only to the user's relations can comment. - `no_one` no one can comment.",
			),
		quoted_post_id: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The ID of a Post to be quoted. For a simple repost without commentary, leave `text` as an empty string.',
			),
		post_as: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The ID of the User on whose behalf the post should be published (if supported by the provider).',
			),
		specifics: z
			.object({
				instagram: z
					.object({
						location_id: z
							.string()
							.optional()
							.describe('The ID of the location to tag the post with.'),
					})
					.loose()
					.optional()
					.describe(
						'Specific options to apply if the provider of the targeted account is Instagram',
					),
			})
			.loose()
			.optional(),
	}),
	postsUpdate: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post to update. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		account_id: AccountId,
		text: z
			.string()
			.optional()
			.describe(
				'Textual content of the post. User mentions can be added by inserting an @ followed by the ID or public identifier of the user (example: @JohnDoe).',
			),
		can_comment: z
			.enum(['anyone', 'relations_only', 'no_one'])
			.optional()
			.describe(
				"The comment control level for the new post (if supported by the provider). - `anyone` is visible to anyone. - `relations_only` is visible only to the user's relations. - `no_one` is visible to no one.",
			),
	}),
	postsDelete: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post to delete. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		account_id: AccountId,
	}),
	postsCreateStory: z.object({
		account_id: AccountId,
		attachment: z
			.object({
				content: z
					.string()
					.describe(
						'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
					),
				content_type: z.string().describe('MIME type of the file.'),
				filename: z
					.string()
					.describe('Name of the file (including extension).'),
				metadata: z
					.object({
						duration: z
							.number()
							.optional()
							.describe('Duration of the media file.'),
					})
					.loose()
					.optional()
					.describe('Metadata of the the file.'),
			})
			.describe('A file to be uploaded.'),
		text: z
			.string()
			.optional()
			.describe(
				'Optional caption for the story. User mentions can be added by inserting an @ followed by the ID or public identifier of the user (example: @JohnDoe), if supported by the provider.',
			),
		specifics: z
			.object({
				instagram: z
					.object({
						location: z
							.object({
								id: z
									.string()
									.describe(
										'The ID of the location (from the Search Locations method) to attach as a sticker.',
									),
								name: z
									.string()
									.describe(
										'The display name of the location, rendered as the sticker text.',
									),
							})
							.loose()
							.optional()
							.describe('Location sticker to attach to the story.'),
					})
					.loose()
					.optional()
					.describe(
						'Specific options to apply if the provider of the targeted account is Instagram',
					),
			})
			.loose()
			.optional(),
	}),
	postsAddReaction: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post to add the reaction to. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		account_id: AccountId,
		reaction: z.union([
			z.string(),
			z.enum([
				'linkedin_like',
				'linkedin_celebrate',
				'linkedin_support',
				'linkedin_love',
				'linkedin_insightful',
				'linkedin_funny',
			]),
			z.enum(['instagram_like']),
		]),
		react_as: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The ID of the User on whose behalf the reaction should be published (if supported by the provider).',
			),
	}),
	postsRemoveReaction: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post where the reaction is. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		account_id: AccountId,
		reaction: z.union([
			z.string(),
			z.enum([
				'linkedin_like',
				'linkedin_celebrate',
				'linkedin_support',
				'linkedin_love',
				'linkedin_insightful',
				'linkedin_funny',
			]),
			z.enum(['instagram_like']),
		]),
	}),
	postsAddComment: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post to add the comment to. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		account_id: AccountId,
		text: z
			.string()
			.describe(
				'Textual content of the comment. User mentions can be added by inserting an @ followed by the `id` or `public_identifier` of the user (example: @JohnDoe).',
			),
		comment_as: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The ID of the User on whose behalf the comment should be published (if supported by the provider).',
			),
		attachments: z
			.array(
				z.object({
					content: z
						.string()
						.describe(
							'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
						),
					content_type: z.string().describe('MIME type of the file.'),
					filename: z
						.string()
						.describe('Name of the file (including extension).'),
					metadata: z
						.object({
							duration: z
								.number()
								.optional()
								.describe('Duration of the media file.'),
						})
						.loose()
						.optional()
						.describe('Metadata of the the file.'),
				}),
			)
			.optional()
			.describe('Attachment associated with the comment'),
	}),
	postsUpdateComment: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post where the comment is. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		comment_id: z.string().min(1).describe('The ID of the Comment to update.'),
		account_id: AccountId,
		text: z
			.string()
			.describe(
				'Updated textual content of the comment. User mentions can be added by inserting an @ followed by the `id` or `public_identifier` of the user (example: @JohnDoe).',
			),
	}),
	postsDeleteComment: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post where the comment is. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		comment_id: z.string().min(1).describe('The ID of the Comment to delete.'),
		account_id: AccountId,
	}),
	postsReplyToComment: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post to add the comment to. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		comment_id: z
			.string()
			.min(1)
			.describe('The ID of the Comment to reply to.'),
		account_id: AccountId,
		text: z
			.string()
			.describe(
				'Textual content of the comment. User mentions can be added by inserting an @ followed by the `id` or `public_identifier` of the user (example: @JohnDoe).',
			),
		comment_as: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The ID of the User on whose behalf the comment should be published (if supported by the provider).',
			),
		attachments: z
			.array(
				z.object({
					content: z
						.string()
						.describe(
							'Content of the file encoded as base64. For large files, prefer using multipart, learn more here: https://developer.unipile.com/v2.0/reference/api-usage#sending-files',
						),
					content_type: z.string().describe('MIME type of the file.'),
					filename: z
						.string()
						.describe('Name of the file (including extension).'),
					metadata: z
						.object({
							duration: z
								.number()
								.optional()
								.describe('Duration of the media file.'),
						})
						.loose()
						.optional()
						.describe('Metadata of the the file.'),
				}),
			)
			.optional()
			.describe('Attachment associated with the comment'),
	}),
	postsListCommentReplies: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post where the comment is. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		comment_id: z
			.string()
			.min(1)
			.describe('The ID of the Comment to retrieve replies from.'),
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	postsListCommentReactions: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post where the comment is. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		comment_id: z
			.string()
			.min(1)
			.describe('The ID of the Comment to retrieve reactions from.'),
		account_id: AccountId,
		offset: z.number().optional(),
		cursor: z.string().optional(),
		limit: z.number().min(1).optional(),
	}),
	postsAddCommentReaction: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post where the comment is. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		comment_id: z
			.string()
			.min(1)
			.describe('The ID of the Comment to add the reaction to.'),
		account_id: AccountId,
		reaction: z.union([
			z.string(),
			z.enum([
				'linkedin_like',
				'linkedin_celebrate',
				'linkedin_support',
				'linkedin_love',
				'linkedin_insightful',
				'linkedin_funny',
			]),
			z.enum(['instagram_like']),
		]),
		react_as: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The ID of the User on whose behalf the reaction should be published (if supported by the provider).',
			),
	}),
	postsRemoveCommentReaction: z.object({
		post_id: z
			.string()
			.min(1)
			.describe(
				"The ID of the Post where the comment is. Use IDs from *Get a Post*, *Create a Post* or *List all User's Posts* methods responses only.",
			),
		comment_id: z
			.string()
			.min(1)
			.describe('The ID of the Comment where the reaction is.'),
		account_id: AccountId,
		reaction: z.union([
			z.string(),
			z.enum([
				'linkedin_like',
				'linkedin_celebrate',
				'linkedin_support',
				'linkedin_love',
				'linkedin_insightful',
				'linkedin_funny',
			]),
			z.enum(['instagram_like']),
		]),
	}),
} as const;

export const PostsOutputSchemas = {
	postsGet: z
		.object({
			object: z.string(),
			id: z.string().describe('The ID of the post for the provider.'),
			share_url: z.string().describe('The URL to share the post.'),
			created_at: z
				.string()
				.describe(
					'The creation date of the post. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
			title: z.string().nullish().describe('The title of the post.'),
			text: z.string().describe('The text content of the post.'),
			user_reacted: z
				.union([z.boolean(), z.string()])
				.describe(
					'If the account owner has reacted to this post, the value of the reaction (emoji unicode or reaction type), `true` if no details on the reaction, else `false`.',
				),
			permissions: z
				.object({
					can_share: z
						.boolean()
						.describe('Whether the account owner can share the post.'),
					can_react: z
						.boolean()
						.describe('Whether the account owner can react to the post.'),
					can_post_comments: z
						.boolean()
						.describe('Whether the account owner can comment on the post.'),
				})
				.loose()
				.describe('The permissions for the account owner on the post.'),
			reactions_counter: z
				.array(z.object({ reaction: z.string(), count: z.number() }).loose())
				.nullable()
				.describe(
					'The counter of reactions to the post. `null` if counter is hidden.',
				),
			comments_counter: z
				.number()
				.nullable()
				.describe(
					'The number of comments to the post. `null` if counter is hidden.',
				),
			reposts_counter: z
				.number()
				.nullable()
				.describe(
					'The number of reposts of the post. `null` if counter is hidden.',
				),
			poll: z
				.object({
					id: z.string().describe('The ID of the poll.'),
					total_votes_count: z
						.number()
						.describe('The total number of votes for the poll.'),
					question: z.string().describe('The question of the poll.'),
					is_open: z
						.boolean()
						.describe(
							'Whether the poll is open. If the poll is closed, the user can only see the results.',
						),
					options: z.array(z.unknown()),
				})
				.loose()
				.nullish()
				.describe('Data about the poll if the post is a poll.'),
			event: PostsGetShape2.nullish().describe(
				'Data about the event if the post is an event.',
			),
			attachments: z
				.array(PostsGetShape4)
				.describe('List of post attachments.'),
			analytics: PostsGetShape3.nullish().describe(
				'Analytics data of the post.',
			),
			is_repost: z
				.boolean()
				.describe(
					'`true` if this post is reposted by someone without quote. Quoted post does not qualify as a repost.',
				),
			author: PostsGetShape6.describe('The author of the post.'),
			reposted_by: PostsGetShape6.nullish().describe(
				'The user who reposted the post if `is_repost` is `true`.',
			),
			quoted_post: z
				.object({
					object: z.string(),
					id: z.string().describe('The ID of the post for the provider.'),
					share_url: z.string().describe('The URL to share the post.'),
					created_at: z
						.string()
						.describe(
							'The creation date of the post. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
						),
					title: z.string().nullish().describe('The title of the post.'),
					text: z.string().describe('The text content of the post.'),
					user_reacted: z
						.union([z.boolean(), z.string()])
						.describe(
							'If the account owner has reacted to this post, the value of the reaction (emoji unicode or reaction type), `true` if no details on the reaction, else `false`.',
						),
					permissions: z
						.object({
							can_share: z.boolean(),
							can_react: z.boolean(),
							can_post_comments: z.boolean(),
						})
						.loose()
						.describe('The permissions for the account owner on the post.'),
					reactions_counter: z
						.array(z.unknown())
						.nullable()
						.describe(
							'The counter of reactions to the post. `null` if counter is hidden.',
						),
					comments_counter: z
						.number()
						.nullable()
						.describe(
							'The number of comments to the post. `null` if counter is hidden.',
						),
					reposts_counter: z
						.number()
						.nullable()
						.describe(
							'The number of reposts of the post. `null` if counter is hidden.',
						),
					poll: z
						.object({
							id: z.string(),
							total_votes_count: z.number(),
							question: z.string(),
							is_open: z.boolean(),
							options: z.array(z.unknown()),
						})
						.loose()
						.nullish()
						.describe('Data about the poll if the post is a poll.'),
					event: z
						.object({
							id: z.string(),
							name: z.string(),
							url: z.string().nullish(),
							online: z.boolean(),
							location: z.string().nullish(),
							description: z.string().nullish(),
							public_picture_url: z.string().nullish(),
							starts_on: z.string().nullish(),
							ends_on: z.string().nullish(),
						})
						.loose()
						.nullish()
						.describe('Data about the event if the post is an event.'),
					attachments: z
						.array(z.unknown())
						.describe('List of post attachments.'),
					analytics: z
						.object({
							impressions_counter: z.number().nullish(),
							engagements_counter: z.number().nullish(),
							engagement_rate: z.number().nullish(),
							clicks_counter: z.number().nullish(),
							clickthrough_rate: z.number().nullish(),
							page_viewers_from_this_post_counter: z.number().nullish(),
							followers_gained_from_this_post_counter: z.number().nullish(),
							users_reached_counter: z.number().nullish(),
						})
						.loose()
						.nullish()
						.describe('Analytics data of the post.'),
					author: z
						.object({
							id: z.string(),
							object: z.string(),
							type: z.string(),
							public_identifier: z.string().nullish(),
							display_name: z.string(),
							first_name: z.string().nullish(),
							last_name: z.string().nullish(),
							profile_url: z.string().nullish(),
							public_picture_url: z.string().nullish(),
							private_picture_download_url: z.string().nullish(),
							description: z.string().nullish(),
							specifics: z.record(z.string(), z.unknown()).nullish(),
						})
						.loose()
						.describe('The author of the post.'),
					specifics: z
						.object({
							mentions: z.array(z.unknown()).nullish(),
							job_posting: z.record(z.string(), z.unknown()).nullish(),
							article: z.record(z.string(), z.unknown()).nullish(),
						})
						.loose()
						.nullish()
						.describe('Object containing provider-specific post data.'),
				})
				.loose()
				.nullish()
				.describe('The post that is quoted in this post.'),
			specifics: z
				.object({
					mentions: z.array(z.unknown()).nullish(),
					job_posting: z
						.object({
							id: z.string().nullable(),
							title: z.string(),
							location: z.string(),
							company: z.record(z.string(), z.unknown()),
						})
						.loose()
						.nullish()
						.describe(
							'A job posting that can be included as an insert in the post.',
						),
					article: z
						.object({
							id: z.string().nullable(),
							title: z.string(),
							author: z.string().nullish(),
							url: z.string().nullish(),
							published_at: z.string().nullish(),
							excerpt: z.string().nullish(),
							picture_url: z.string().nullish(),
						})
						.loose()
						.nullish()
						.describe(
							'An article that can be included as an insert in the post.',
						),
				})
				.loose()
				.nullish()
				.describe('Object containing provider-specific post data.'),
		})
		.loose(),
	postsCreate: PostsCreateShape9,
	postsUpdate: PostsCreateShape9,
	postsDelete: NoContentSchema,
	postsCreateStory: z
		.object({
			object: z.string(),
			id: z.string().describe('The ID of the story for the provider.'),
			provider_id: z
				.string()
				.describe("The story's raw provider-native identifier."),
			media_type: z
				.string()
				.describe('The type of media attached to the story.'),
			created_at: z
				.string()
				.describe(
					'The creation date of the story. Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
			expires_at: z
				.string()
				.nullish()
				.describe(
					'The expiration date of the story (~24h after creation, if supported by the provider). Uses ISO 8601 UTC datetime (YYYY-MM-DDTHH:MM:SS.sssZ).',
				),
		})
		.loose(),
	postsAddReaction: z.object({ object: z.string() }).loose(),
	postsRemoveReaction: z.object({ object: z.string() }).loose(),
	postsAddComment: PostsAddCommentShape8,
	postsUpdateComment: PostsAddCommentShape8,
	postsDeleteComment: NoContentSchema,
	postsReplyToComment: PostsAddCommentShape8,
	postsListCommentReplies: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						id: z.string(),
						thread_id: z.string().nullish(),
						created_at: z.string(),
						text: z.string(),
						attachments: z.array(z.unknown()),
						is_sender: z.boolean(),
						can_reply: z.boolean(),
						can_react: z.boolean(),
						reply_counter: z.number(),
						impressions_counter: z.number().nullish(),
						reactions_counter: z.array(z.unknown()),
						author: z.record(z.string(), z.unknown()),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	postsListCommentReactions: z
		.object({
			data: z.array(
				z
					.object({
						object: z.string(),
						value: z.string(),
						is_sender: z.boolean(),
						sender: z.record(z.string(), z.unknown()),
					})
					.loose(),
			),
			total_count: z
				.number()
				.nullish()
				.describe('Total number of results if supported by the provider.'),
			next_cursor: z
				.string()
				.nullish()
				.describe(
					'Cursor to get the next page of results if supported. Else use `offset`.',
				),
		})
		.loose(),
	postsAddCommentReaction: z.object({ object: z.string() }).loose(),
	postsRemoveCommentReaction: z.object({ object: z.string() }).loose(),
} as const;
