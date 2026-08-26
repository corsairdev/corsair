import { z } from 'zod';

import { InstagramUser } from '../schema/database';

const GetInstagramUserInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe('The Instagram User ID (IG User ID) of the Instagram account.'),
		q: z
			.string()
			.optional()
			.describe(
				'Optional search query or keyword used to filter related Instagram user data.',
			),
	})
	.describe(
		'Retrieve information about an Instagram user associated with the specified Instagram User ID.',
	);

const GetInstagramMediaListInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account or createro account whose media should be retrieved.',
			),
		q: z
			.string()
			.optional()
			.describe(
				'Optional search keyword or filter to narrow the media results.',
			),
	})
	.describe(
		'Retrieve a list of media (posts, reels, stories, or videos) published by the specified Instagram account.',
	);

const GetInstagramMediaInputSchema = z
	.object({
		media_id: z
			.string()
			.describe(
				'The Instagram Media ID of the post, reel, story, carousel, or video to retrieve.',
			),
		q: z
			.string()
			.optional()
			.describe(
				'Optional search query or filter used when retrieving media-related information.',
			),
	})
	.describe(
		'Retrieve detailed information about a specific Instagram media object.',
	);

const CreateImageContainerInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account that will publish the image.',
			),

		image_url: z
			.url()
			.describe(
				'A publicly accessible URL of the image to be uploaded to Instagram.',
			),

		caption: z
			.string()
			.optional()
			.describe(
				'Optional caption text that will be displayed with the Instagram post.',
			),

		alt_text: z
			.string()
			.optional()
			.describe(
				'Optional accessibility description of the image for screen readers.',
			),

		is_carousel_item: z
			.boolean()
			.optional()
			.describe(
				'Set to true if this image will be added as an item in a carousel post rather than published as a standalone post.',
			),

		location_id: z
			.string()
			.optional()
			.describe(
				'Optional Facebook Location ID to associate a location with the Instagram post.',
			),

		user_tags: z
			.array(
				z.object({
					username: z
						.string()
						.describe('Instagram username of the account to tag in the image.'),

					x: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Horizontal position of the user tag in the image, from 0.0 (left) to 1.0 (right).',
						),

					y: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Vertical position of the user tag in the image, from 0.0 (top) to 1.0 (bottom).',
						),
				}),
			)
			.optional()
			.describe(
				'Optional list of Instagram users to tag in the image along with their positions.',
			),

		product_tags: z
			.array(
				z.object({
					product_id: z
						.string()
						.describe('The Instagram Shopping product ID to tag in the image.'),

					x: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Horizontal position of the product tag in the image, from 0.0 (left) to 1.0 (right).',
						),

					y: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Vertical position of the product tag in the image, from 0.0 (top) to 1.0 (bottom).',
						),
				}),
			)
			.optional()
			.describe(
				'Optional list of products to tag in the image for Instagram Shopping.',
			),
	})
	.describe(
		'Create an Instagram image media container that can later be published as a post or included in a carousel.',
	);

const PublishInstagramMediaInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account that will publish the media.',
			),
		creation_id: z
			.string()
			.describe(
				'The media container ID returned by a previous media container creation request. This container will be published to Instagram.',
			),
	})
	.describe(
		'Publish a previously created Instagram media container as a post on the specified Instagram account.',
	);

const CreateReelContainerInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account that will publish the Reel.',
			),

		video_url: z
			.url()
			.describe(
				'A publicly accessible URL of the video file to be uploaded as an Instagram Reel.',
			),

		media_type: z
			.string()
			.describe(
				'The type of media container to create. For Reels, this is typically set to REELS.',
			),

		caption: z
			.string()
			.optional()
			.describe(
				'Optional caption text that will accompany the Reel when published.',
			),

		share_to_feed: z
			.boolean()
			.optional()
			.describe(
				'Whether the Reel should also be shared to the Instagram profile feed in addition to the Reels tab.',
			),

		collaborators: z
			.array(z.string())
			.optional()
			.describe(
				'Optional list of Instagram User IDs to invite as collaborators on the Reel.',
			),

		cover_url: z
			.url()
			.optional()
			.describe(
				'Optional publicly accessible URL of a custom cover image to use as the Reel thumbnail.',
			),

		audio_name: z
			.string()
			.optional()
			.describe('Optional name of the audio track associated with the Reel.'),

		thumb_offset: z
			.number()
			.optional()
			.describe(
				'Optional timestamp offset in milliseconds used to generate the Reel thumbnail from the video.',
			),

		location_id: z
			.string()
			.optional()
			.describe(
				'Optional Facebook Location ID to associate a location with the Reel.',
			),

		user_tags: z
			.array(
				z.object({
					username: z
						.string()
						.describe('Instagram username of the account to tag in the Reel.'),

					x: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Horizontal position of the tag, from 0.0 (left) to 1.0 (right).',
						),

					y: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Vertical position of the tag, from 0.0 (top) to 1.0 (bottom).',
						),
				}),
			)
			.optional()
			.describe('Optional list of Instagram users to tag in the Reel.'),

		trial_params: z
			.unknown()
			.optional()
			.describe(
				'Optional experimental or trial parameters supported by the Instagram API.',
			),
	})
	.describe(
		'Create an Instagram Reel media container that can later be published using the media publish endpoint.',
	);

const GetMediaContainerStatusInputSchema = z
	.object({
		container_id: z
			.string()
			.describe(
				'The Instagram media container ID whose processing status should be retrieved.',
			),
	})
	.describe(
		'Retrieve the current status of an Instagram media container, including whether processing has completed and the container is ready to be published.',
	);

const CreateImageStoryContainerinputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account that will publish the Story.',
			),

		image_url: z
			.url()
			.describe(
				'A publicly accessible URL of the image to be uploaded as an Instagram Story.',
			),

		user_tags: z
			.array(z.string())
			.optional()
			.describe(
				'Optional list of Instagram usernames or user IDs to mention or tag in the Story.',
			),
	})
	.describe(
		'Create an Instagram Story image media container that can later be published as a Story.',
	);

const CreateVideoStoryContainerinputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account that will publish the Story.',
			),

		video_url: z
			.url()
			.describe(
				'A publicly accessible URL of the video to be uploaded as an Instagram Story.',
			),

		user_tags: z
			.array(z.string())
			.optional()
			.describe(
				'Optional list of Instagram usernames or user IDs to mention or tag in the Story.',
			),
	})
	.describe(
		'Create an Instagram Story video media container that can later be published as a Story.',
	);

const CreateCarouselContainerInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account that will publish the carousel post.',
			),

		children: z
			.array(z.string())
			.min(2, 'Carousel must contain at least 2 media items')
			.describe(
				'An array of media container IDs that will be included in the carousel. A carousel must contain at least two media items.',
			),

		media_type: z
			.string()
			.describe(
				'The type of media container to create. For carousel posts, this is typically set to CAROUSEL.',
			),

		caption: z
			.string()
			.optional()
			.describe(
				'Optional caption text that will be displayed with the carousel post.',
			),

		share_to_feed: z
			.boolean()
			.optional()
			.describe(
				'Whether the carousel post should be shared to the Instagram profile feed.',
			),

		collaborators: z
			.array(z.string())
			.optional()
			.describe(
				'Optional list of Instagram User IDs to invite as collaborators on the carousel post.',
			),

		location_id: z
			.string()
			.optional()
			.describe(
				'Optional Facebook Location ID to associate a location with the carousel post.',
			),

		product_tags: z
			.array(
				z.object({
					product_id: z
						.string()
						.describe(
							'The Instagram Shopping product ID to tag in the carousel post.',
						),
				}),
			)
			.optional()
			.describe(
				'Optional list of Instagram Shopping products to tag in the carousel.',
			),
	})
	.describe(
		'Create an Instagram carousel media container that can later be published as a carousel post.',
	);

const CreateVideoContainerInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account that will publish the video.',
			),

		video_url: z
			.url()
			.describe(
				'A publicly accessible URL of the video to be uploaded to Instagram.',
			),

		caption: z
			.string()
			.optional()
			.describe(
				'Optional caption text that will be displayed with the video post.',
			),

		alt_text: z
			.string()
			.optional()
			.describe(
				'Optional accessibility description of the video for screen readers.',
			),

		location_id: z
			.string()
			.optional()
			.describe(
				'Optional Facebook Location ID to associate a location with the video post.',
			),

		user_tags: z
			.array(
				z.object({
					username: z
						.string()
						.describe('Instagram username of the account to tag in the video.'),

					x: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Horizontal position of the user tag, from 0.0 (left) to 1.0 (right).',
						),

					y: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Vertical position of the user tag, from 0.0 (top) to 1.0 (bottom).',
						),
				}),
			)
			.optional()
			.describe(
				'Optional list of Instagram users to tag in the video along with their positions.',
			),

		product_tags: z
			.array(
				z.object({
					product_id: z
						.string()
						.describe('The Instagram Shopping product ID to tag in the video.'),

					x: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Horizontal position of the product tag, from 0.0 (left) to 1.0 (right).',
						),

					y: z
						.number()
						.min(0)
						.max(1)
						.describe(
							'Vertical position of the product tag, from 0.0 (top) to 1.0 (bottom).',
						),
				}),
			)
			.optional()
			.describe(
				'Optional list of Instagram Shopping products to tag in the video.',
			),
	})
	.describe(
		'Create an Instagram video media container that can later be published as a video post or included in a carousel.',
	);

export const MEDIA_TYPE_METRICS = {
	IMAGE: [
		'reach',
		'likes',
		'comments',
		'shares',
		'saved',
		'total_interactions',
		'profile_visits',
		'profile_activity',
		'follows',
		'reposts',
		'facebook_views',
		'total_likes',
		'total_comments',
		'total_views',
	],

	VIDEO: [
		'reach',
		'likes',
		'comments',
		'shares',
		'saved',
		'total_interactions',
		'views',
		'profile_visits',
		'profile_activity',
		'follows',
		'reposts',
		'facebook_views',
		'crossposted_views',
		'total_likes',
		'total_comments',
		'total_views',
	],

	CAROUSEL_ALBUM: [
		'reach',
		'likes',
		'comments',
		'shares',
		'saved',
		'total_interactions',
		'profile_visits',
		'profile_activity',
		'follows',
		'reposts',
		'facebook_views',
		'total_likes',
		'total_comments',
		'total_views',
	],

	REELS: [
		'reach',
		'likes',
		'comments',
		'shares',
		'saved',
		'total_interactions',
		'views',
		'reposts',
		'ig_reels_avg_watch_time',
		'ig_reels_video_view_total_time',
		'reels_skip_rate',
		'total_likes',
		'total_comments',
		'total_views',
	],

	STORY: [
		'reach',
		'replies',
		'navigation',
		'profile_visits',
		'profile_activity',
		'follows',
		'shares',
		'reposts',
		'views',
		'facebook_views',
		'total_interactions',
		'total_views',
	],
} as const;

const GetMediaInsightsInputSchema = z
	.object({
		media_id: z
			.string()
			.describe(
				'The Instagram Media ID of the post, Reel, Story, video, or carousel whose insights should be retrieved.',
			),

		type: z
			.enum(['IMAGE', 'VIDEO', 'REELS', 'STORY', 'CAROUSEL_ALBUM'])
			.describe(
				'The type of Instagram media for which insights are being requested.',
			),

		metric: z
			.string()
			.optional()
			.describe(
				'Optional insight metric to retrieve, such as impressions, reach, engagement, saved, likes, comments, shares, plays, or other supported Instagram insight metrics.',
			),
	})
	.describe(
		'Retrieve performance insights and analytics for a specific Instagram media object.',
	);

const GetAccountInsightsInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe(
				'The Instagram User ID (IG User ID) of the Instagram professional account whose insights should be retrieved.',
			),

		metric: z
			.string()
			.min(1)
			.describe(
				'One or more Instagram insight metrics to retrieve, such as impressions, reach, profile_views, follower_count, accounts_engaged, or other supported account-level metrics.',
			),

		period: z
			.string()
			.describe(
				'The aggregation period for the requested metrics, such as day, week, days_28, lifetime, or other supported periods.',
			),

		timeframe: z
			.string()
			.optional()
			.describe(
				'Required for demographics-related metrics. Specifies how far back Instagram should look when calculating the requested data.',
			),

		metric_type: z
			.string()
			.optional()
			.describe(
				'Optional metric category or calculation type used when requesting specific insight metrics.',
			),

		breakdown: z
			.string()
			.optional()
			.describe(
				'Optional dimension by which to break down the results, such as age, gender, country, city, or other supported demographic categories.',
			),

		since: z
			.string()
			.optional()
			.describe(
				'Optional start date or timestamp for the insights query. Results will include data from this point onward.',
			),

		until: z
			.string()
			.optional()
			.describe(
				'Optional end date or timestamp for the insights query. Results will include data up to this point.',
			),
	})
	.describe(
		'Retrieve account-level insights and analytics for an Instagram account.',
	);

const GetInstagramConversationsInputSchema = z
	.object({
		page_id: z
			.string()
			.describe(
				'The Facebook Page ID connected to the Instagram professional account whose conversations should be retrieved.',
			),

		q: z
			.string()
			.optional()
			.describe(
				'Optional search query used to filter conversations by participant, message content, or other supported criteria.',
			),
	})
	.describe(
		'Retrieve Instagram Direct Message conversations associated with a Facebook Page and its connected Instagram professional account.',
	);

const GetConversationMessagesInputSchema = z
	.object({
		conversation_id: z
			.string()
			.describe(
				'The Instagram conversation or message thread ID whose messages should be retrieved.',
			),

		page_id: z
			.string()
			.describe(
				'The Facebook Page ID connected to the Instagram professional account that owns the conversation.',
			),

		q: z
			.string()
			.optional()
			.describe(
				'Optional search query used to filter messages within the conversation.',
			),
	})
	.describe(
		'Retrieve messages from a specific Instagram Direct Message conversation.',
	);

const GetMessageInputSchema = z
	.object({
		page_id: z
			.string()
			.describe(
				'The Facebook Page ID connected to the Instagram professional account that owns the message.',
			),

		message_id: z
			.string()
			.describe('The unique ID of the Instagram Direct Message to retrieve.'),

		q: z
			.string()
			.min(1)
			.describe(
				'A search query or filter string used when retrieving message details.',
			),
	})
	.describe('Retrieve details for a specific Instagram Direct Message.');

const AttachmentSchema = z
	.object({
		type: z
			.enum(['image', 'video', 'audio', 'file', 'template'])
			.describe(
				'The type of attachment being sent with the message. Supported values include image, video, audio, file, and template.',
			),

		payload: z
			.record(z.string(), z.any())
			.describe(
				'The attachment payload containing type-specific data such as media URLs, file information, template configuration, or other attachment metadata.',
			),
	})
	.describe(
		'Represents a message attachment that can be included in an Instagram or Messenger message.',
	);

const SendMessageInputSchema = z
	.object({
		page_id: z
			.string()
			.describe(
				'The Facebook Page ID connected to the Instagram professional account that will send the message.',
			),

		recipient: z
			.string()
			.describe(
				'The recipient Instagram-scoped user ID (IGSID) or Messenger user ID that will receive the message.',
			),

		message: z
			.object({
				text: z
					.string()
					.optional()
					.describe('The text content of the message to send.'),

				attachment: AttachmentSchema.optional().describe(
					'A single attachment to include with the message.',
				),

				attachments: z
					.array(AttachmentSchema)
					.min(1)
					.optional()
					.describe('A list of attachments to include with the message.'),

				quick_replies: z
					.array(
						z.object({
							content_type: z
								.literal('text')
								.describe('The quick reply content type. Must be set to text.'),

							title: z
								.string()
								.describe('The text displayed on the quick reply button.'),

							payload: z
								.string()
								.describe(
									'The payload value returned when the user taps the quick reply.',
								),
						}),
					)
					.optional()
					.describe(
						'Optional quick reply buttons that the recipient can tap to respond.',
					),
			})
			.refine((msg) => msg.text || msg.attachment, {
				message: 'Either text or attachment is required',
			})
			.describe(
				'The message content, including text, attachments, and optional quick replies.',
			),

		messaging_type: z
			.enum(['RESPONSE', 'UPDATE', 'MESSAGE_TAG'])
			.optional()
			.describe(
				'The type of message being sent. Determines how Meta categorizes and delivers the message.',
			),

		tag: z
			.string()
			.optional()
			.describe(
				'Required for certain MESSAGE_TAG messages. Specifies the approved message tag used for the message.',
			),
	})
	.describe(
		'Send a direct message to an Instagram or Messenger user through a connected Facebook Page.',
	);

const GetCommentsInputSchema = z
	.object({
		media_id: z
			.string()
			.describe(
				'The Instagram Media ID of the post, Reel, video, or carousel whose comments should be retrieved.',
			),

		q: z
			.string()
			.optional()
			.describe(
				'Optional search query used to filter comments by text, username, or other supported criteria.',
			),
	})
	.describe(
		'Retrieve comments associated with a specific Instagram media object.',
	);

const ReplyCommentsInputSchema = z
	.object({
		comment_id: z
			.string()
			.describe(
				'The Instagram Comment ID of the comment that should receive a reply.',
			),

		message: z
			.string()
			.describe(
				'The text content of the reply to post in response to the specified comment.',
			),
	})
	.describe('Reply to an existing Instagram comment on a media object.');

const SendCommentsInputSchema = z
	.object({
		media_id: z
			.string()
			.describe(
				'The Instagram Media ID of the post, Reel, video, Story, or carousel on which the comment will be created.',
			),

		message: z
			.string()
			.describe(
				'The text content of the comment to post on the specified Instagram media.',
			),
	})
	.describe('Create a new comment on a specific Instagram media object.');

const GetInstagramCommentDetailsInputSchema = z
	.object({
		comment_id: z
			.string()
			.describe(
				'The Instagram Comment ID of the comment whose details should be retrieved.',
			),

		q: z
			.string()
			.optional()
			.describe(
				'Optional search query or filter used when retrieving comment details.',
			),
	})
	.describe(
		'Retrieve detailed information about a specific Instagram comment.',
	);

const UpdateCommentsInputSchema = z
	.object({
		comment_id: z
			.string()
			.describe('The Instagram Comment ID of the comment to update.'),

		hide: z
			.boolean()
			.describe(
				'Whether the comment should be hidden. Set to true to hide the comment or false to unhide it.',
			),
	})
	.describe('Update the visibility status of an Instagram comment.');

const DeleteCommentInputSchema = z
	.object({
		comment_id: z
			.string()
			.describe(
				'The Instagram Comment ID of the comment that should be permanently deleted.',
			),
	})
	.describe('Delete a specific Instagram comment from a media object.');

// Create Media Container (Deprecated)
// INSTAGRAM_CREATE_MEDIA_CONTAINER
const CreateMediaContainerInputSchema = z
	.object({
		ig_id: z
			.string()
			.describe('The Instagram User ID of the Instagram professional account.'),
		image_url: z
			.string()
			.url()
			.optional()
			.describe('A publicly accessible URL of the image to be uploaded.'),
		video_url: z
			.string()
			.url()
			.optional()
			.describe('A publicly accessible URL of the video to be uploaded.'),
		media_type: z
			.string()
			.optional()
			.describe('The media type of the container (e.g. IMAGE, VIDEO).'),
		caption: z.string().optional().describe('Optional caption text.'),
		is_carousel_item: z
			.boolean()
			.optional()
			.describe('Whether this is a carousel item.'),
		user_tags: z
			.array(
				z.object({
					username: z.string().describe('Instagram username to tag.'),
					x: z
						.number()
						.min(0)
						.max(1)
						.optional()
						.describe('Horizontal tag position (0.0–1.0).'),
					y: z
						.number()
						.min(0)
						.max(1)
						.optional()
						.describe('Vertical tag position (0.0–1.0).'),
				}),
			)
			.optional()
			.describe('Optional user tags.'),
	})
	.refine((data) => data.image_url || data.video_url, {
		message: 'Either image_url or video_url is required',
		path: ['image_url'],
	});

// Create Post (Deprecated)
// INSTAGRAM_CREATE_POST
const CreatePostInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
	creation_id: z.string().describe('The container ID to publish.'),
});

// Delete Messenger Profile
// INSTAGRAM_DELETE_MESSENGER_PROFILE
const DeleteMessengerProfileInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	fields: z
		.array(z.string())
		.optional()
		.describe('The messenger profile fields to delete.'),
});

// Get Conversation
// INSTAGRAM_GET_CONVERSATION
const GetConversationInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	conversation_id: z.string().describe('The DM conversation ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
});

// Get IG Comment Replies
// INSTAGRAM_GET_IG_COMMENT_REPLIES
const GetIgCommentRepliesInputSchema = z.object({
	comment_id: z.string().describe('The Instagram Comment ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Get IG Media Children
// INSTAGRAM_GET_IG_MEDIA_CHILDREN
const GetIgMediaChildrenInputSchema = z.object({
	media_id: z
		.string()
		.describe('The Instagram Media ID (parent carousel/album).'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Get IG Media Comments
// INSTAGRAM_GET_IG_MEDIA_COMMENTS
const GetIgMediaCommentsInputSchema = z.object({
	media_id: z.string().describe('The Instagram Media ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Get IG Media Insights
// INSTAGRAM_GET_IG_MEDIA_INSIGHTS
const GetIgMediaInsightsInputSchema = z.object({
	media_id: z.string().describe('The Instagram Media ID.'),
	metrics: z.array(z.string()).describe('The metrics to retrieve.'),
});

// Get IG User Content Publishing Limit
// INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT
const GetIgUserContentPublishingLimitInputSchema = z.object({
	ig_id: z
		.string()
		.describe('The Instagram User ID (Instagram Business Account ID).'),
});

// Get IG User Live Media
// INSTAGRAM_GET_IG_USER_LIVE_MEDIA
const GetIgUserLiveMediaInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
});

// Get IG User Media
// INSTAGRAM_GET_IG_USER_MEDIA
const GetIgUserMediaInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Get IG User Stories
// INSTAGRAM_GET_IG_USER_STORIES
const GetIgUserStoriesInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Get IG User Tags
// INSTAGRAM_GET_IG_USER_TAGS
const GetIgUserTagsInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Get Messenger Profile
// INSTAGRAM_GET_MESSENGER_PROFILE
const GetMessengerProfileInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	fields: z.array(z.string()).optional().describe('Optional fields to query.'),
});

// Get Page Conversations
// INSTAGRAM_GET_PAGE_CONVERSATIONS
const GetPageConversationsInputSchema = z.object({
	page_id: z
		.string()
		.describe(
			'The Facebook Page ID connected to the Instagram Business account.',
		),
	platform: z.string().optional().describe('The platform (use "instagram").'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Get Post Comments (Deprecated)
// INSTAGRAM_GET_POST_COMMENTS
const GetPostCommentsInputSchema = z.object({
	post_id: z.string().describe('The post (media) ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Get Post Insights (Deprecated)
// INSTAGRAM_GET_POST_INSIGHTS
const GetPostInsightsInputSchema = z.object({
	post_id: z.string().describe('The post (media) ID.'),
	metrics: z.array(z.string()).describe('The metrics to retrieve.'),
});

// Get Post Status (Deprecated)
// INSTAGRAM_GET_POST_STATUS
const GetPostStatusInputSchema = z.object({
	container_id: z.string().describe('The container ID to check.'),
});

// Get User Info
// INSTAGRAM_GET_USER_INFO
const GetUserInfoInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
});

// Get User Insights
// INSTAGRAM_GET_USER_INSIGHTS
const GetUserInsightsInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
	metrics: z.array(z.string()).describe('The metrics to retrieve.'),
	period: z.string().optional().describe('The period (e.g. day).'),
	since: z.string().optional().describe('Start timestamp.'),
	until: z.string().optional().describe('End timestamp.'),
	metric_type: z
		.string()
		.optional()
		.describe('The metric type (e.g. time_series, total_value).'),
	breakdown: z.string().optional().describe('The metric breakdown.'),
	timeframe: z.string().optional().describe('The demographic timeframe.'),
});

// Get User Media (Deprecated)
// INSTAGRAM_GET_USER_MEDIA
const GetUserMediaInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// List All Conversations
// INSTAGRAM_LIST_ALL_CONVERSATIONS
const ListAllConversationsInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// List All Messages
// INSTAGRAM_LIST_ALL_MESSAGES
const ListAllMessagesInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	conversation_id: z.string().describe('The DM conversation ID.'),
	fields: z.string().optional().describe('Optional fields to query.'),
	after: z.string().optional().describe('Cursor for the next page of results.'),
	before: z
		.string()
		.optional()
		.describe('Cursor for the previous page of results.'),
});

// Mark Seen
// INSTAGRAM_MARK_SEEN
const MarkSeenInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	recipient_id: z
		.string()
		.describe('The recipient user ID to mark messages as seen.'),
});

// Post IG Comment Replies
// INSTAGRAM_POST_IG_COMMENT_REPLIES
const PostIgCommentRepliesInputSchema = z.object({
	comment_id: z.string().describe('The Instagram Comment ID.'),
	message: z.string().max(300).describe('The text of the reply.'),
});

// Post IG Media Comments
// INSTAGRAM_POST_IG_MEDIA_COMMENTS
const PostIgMediaCommentsInputSchema = z.object({
	media_id: z.string().describe('The Instagram Media ID.'),
	message: z.string().max(300).describe('The text of the comment.'),
});

// Post IG User Media
// INSTAGRAM_POST_IG_USER_MEDIA
const PostIgUserMediaInputSchema = z
	.object({
		ig_id: z.string().describe('The Instagram User ID.'),
		image_url: z
			.string()
			.url()
			.optional()
			.describe('A publicly accessible URL of the image to be uploaded.'),
		video_url: z
			.string()
			.url()
			.optional()
			.describe('A publicly accessible URL of the video to be uploaded.'),
		media_type: z
			.string()
			.optional()
			.describe('The media type of the container (e.g. IMAGE, VIDEO).'),
		caption: z.string().optional().describe('Optional caption text.'),
		is_carousel_item: z
			.boolean()
			.optional()
			.describe('Whether this is a carousel item.'),
		user_tags: z
			.array(
				z.object({
					username: z.string().describe('Instagram username to tag.'),
					x: z
						.number()
						.min(0)
						.max(1)
						.optional()
						.describe('Horizontal tag position (0.0–1.0).'),
					y: z
						.number()
						.min(0)
						.max(1)
						.optional()
						.describe('Vertical tag position (0.0–1.0).'),
				}),
			)
			.optional()
			.describe('Optional user tags.'),
	})
	.refine((data) => data.image_url || data.video_url, {
		message: 'Either image_url or video_url is required',
		path: ['image_url'],
	});

// Publish IG User Media
// INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH
const PublishIgUserMediaInputSchema = z.object({
	ig_id: z.string().describe('The Instagram User ID.'),
	creation_id: z.string().describe('The container ID to publish.'),
});

// Reply To Comment (Deprecated)
// INSTAGRAM_REPLY_TO_COMMENT
const ReplyToCommentInputSchema = z.object({
	comment_id: z.string().describe('The Instagram Comment ID.'),
	message: z.string().max(300).describe('The text of the reply.'),
});

// Reply to IG User Mentions
// INSTAGRAM_POST_IG_USER_MENTIONS
const ReplyToIgUserMentionsInputSchema = z.object({
	mention_id: z.string().describe('The mention ID (media or comment ID).'),
	message: z.string().max(300).describe('The text of the reply.'),
});

// Send Image
// INSTAGRAM_SEND_IMAGE
const SendImageInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	recipient_id: z.string().describe('The recipient ID.'),
	image_url: z.string().url().describe('The URL of the image to send via DM.'),
});

// Send Text Message
// INSTAGRAM_SEND_TEXT_MESSAGE
const SendTextMessageInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	recipient_id: z.string().describe('The recipient ID.'),
	message: z.string().describe('The text message to send via DM.'),
});

// Update Messenger Profile
// INSTAGRAM_UPDATE_MESSENGER_PROFILE
const UpdateMessengerProfileInputSchema = z.object({
	page_id: z.string().describe('The Facebook Page ID.'),
	persistent_menu: z
		.array(
			z.object({
				locale: z
					.string()
					.describe('The locale for this menu (e.g. "default").'),
				composer_input_disabled: z
					.boolean()
					.optional()
					.describe('Whether to disable composer input.'),
				call_to_actions: z
					.array(
						z.object({
							type: z
								.string()
								.describe('The menu item type (e.g. "postback", "web_url").'),
							title: z.string().describe('The menu item label.'),
							url: z
								.string()
								.optional()
								.describe('URL for web_url type items.'),
							payload: z
								.string()
								.optional()
								.describe('Payload for postback type items.'),
						}),
					)
					.optional()
					.describe('The menu items.'),
			}),
		)
		.optional()
		.describe('Persistent menu configuration.'),
	ice_breakers: z
		.array(
			z.object({
				question: z.string().describe('The ice breaker question text.'),
				payload: z
					.string()
					.describe('The payload sent when the user taps the ice breaker.'),
			}),
		)
		.optional()
		.describe('Ice breaker configuration.'),
});

export const InstagramEndpointInputSchemas = {
	// GetFacebookUser: GetFacebookUserInputSchema,
	// GetFacebookPages: GetFacebookPagesInputSchema,
	GetInstagramUser: GetInstagramUserInputSchema,
	GetInstagramMediaList: GetInstagramMediaListInputSchema,
	GetInstagramMedia: GetInstagramMediaInputSchema,
	CreateImageContainer: CreateImageContainerInputSchema,
	CreateReelContainer: CreateReelContainerInputSchema,
	CreateImageStoryContainer: CreateImageStoryContainerinputSchema,
	PublishInstagramMedia: PublishInstagramMediaInputSchema,
	CreateVideoStoryContainer: CreateVideoStoryContainerinputSchema,
	CreateCarouselContainer: CreateCarouselContainerInputSchema,
	CreateVideoContainer: CreateVideoContainerInputSchema,
	GetMediaContainerStatus: GetMediaContainerStatusInputSchema,
	GetMediaInsights: GetMediaInsightsInputSchema,
	GetAccountInsights: GetAccountInsightsInputSchema,
	GetInstagramConversations: GetInstagramConversationsInputSchema,
	GetConversationMessages: GetConversationMessagesInputSchema,
	GetMessage: GetMessageInputSchema,
	SendMessage: SendMessageInputSchema,
	GetComments: GetCommentsInputSchema,
	ReplyComments: ReplyCommentsInputSchema,
	SendComments: SendCommentsInputSchema,
	GetCommentsDetails: GetInstagramCommentDetailsInputSchema,
	UpdateComments: UpdateCommentsInputSchema,
	DeleteComment: DeleteCommentInputSchema,
	CreateMediaContainer: CreateMediaContainerInputSchema,
	CreatePost: CreatePostInputSchema,
	DeleteMessengerProfile: DeleteMessengerProfileInputSchema,
	GetConversation: GetConversationInputSchema,
	GetIgCommentReplies: GetIgCommentRepliesInputSchema,
	GetIgMediaChildren: GetIgMediaChildrenInputSchema,
	GetIgMediaComments: GetIgMediaCommentsInputSchema,
	GetIgMediaInsights: GetIgMediaInsightsInputSchema,
	GetIgUserContentPublishingLimit: GetIgUserContentPublishingLimitInputSchema,
	GetIgUserLiveMedia: GetIgUserLiveMediaInputSchema,
	GetIgUserMedia: GetIgUserMediaInputSchema,
	GetIgUserStories: GetIgUserStoriesInputSchema,
	GetIgUserTags: GetIgUserTagsInputSchema,
	GetMessengerProfile: GetMessengerProfileInputSchema,
	GetPageConversations: GetPageConversationsInputSchema,
	GetPostComments: GetPostCommentsInputSchema,
	GetPostInsights: GetPostInsightsInputSchema,
	GetPostStatus: GetPostStatusInputSchema,
	GetUserInfo: GetUserInfoInputSchema,
	GetUserInsights: GetUserInsightsInputSchema,
	GetUserMedia: GetUserMediaInputSchema,
	ListAllConversations: ListAllConversationsInputSchema,
	ListAllMessages: ListAllMessagesInputSchema,
	MarkSeen: MarkSeenInputSchema,
	PostIgCommentReplies: PostIgCommentRepliesInputSchema,
	PostIgMediaComments: PostIgMediaCommentsInputSchema,
	PostIgUserMedia: PostIgUserMediaInputSchema,
	PublishIgUserMedia: PublishIgUserMediaInputSchema,
	ReplyToComment: ReplyToCommentInputSchema,
	ReplyToIgUserMentions: ReplyToIgUserMentionsInputSchema,
	SendImage: SendImageInputSchema,
	SendTextMessage: SendTextMessageInputSchema,
	UpdateMessengerProfile: UpdateMessengerProfileInputSchema,
} as const;

export type InstagramEndpointInputs = {
	[K in keyof typeof InstagramEndpointInputSchemas]: z.infer<
		(typeof InstagramEndpointInputSchemas)[K]
	>;
};

// output schema

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

const GetInstagramUserOutputSchema = InstagramUser;

const InstagramMediaType = z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']);

export const InstagramMedia = z
	.object({
		id: z.string().describe('The unique Instagram Media ID.'),

		caption: z
			.string()
			.optional()
			.describe('The caption text associated with the media.'),

		media_type: InstagramMediaType.describe(
			'The type of Instagram media, such as IMAGE, VIDEO, REELS, STORY, or CAROUSEL_ALBUM.',
		),

		media_url: z
			.url()
			.nullable()
			.optional()
			.describe(
				'The URL of the media asset. May be null or unavailable for certain media types.',
			),

		thumbnail_url: z
			.url()
			.nullable()
			.optional()
			.describe(
				'The URL of the media thumbnail image, typically available for videos and reels.',
			),

		permalink: z
			.url()
			.describe('The permanent public URL to view the media on Instagram.'),

		timestamp: z.iso
			.datetime()
			.describe(
				'The ISO 8601 timestamp indicating when the media was created.',
			),

		username: z
			.string()
			.describe('The Instagram username that published the media.'),

		like_count: z
			.number()
			.default(0)
			.describe('The total number of likes received by the media.'),

		comments_count: z
			.number()
			.default(0)
			.describe('The total number of comments on the media.'),

		is_comment_enabled: z
			.boolean()
			.describe('Indicates whether commenting is enabled for the media.'),

		children: z
			.object({
				data: z.array(
					z.object({
						id: z
							.string()
							.describe('The unique Media ID of the carousel item.'),

						media_type: z
							.enum(['IMAGE', 'VIDEO'])
							.describe('The type of carousel item.'),

						media_url: z
							.url()
							.describe('The URL of the carousel item media asset.'),
					}),
				),
			})
			.optional()
			.describe('Carousel child media items. Present only for carousel posts.'),

		createdAt: z.coerce
			.date()
			.nullable()
			.optional()
			.describe(
				'The date and time when this record was created in the local system.',
			),

		updatedAt: z.coerce
			.date()
			.nullable()
			.optional()
			.describe(
				'The date and time when this record was last updated in the local system.',
			),
	})
	.describe(
		'Represents an Instagram media object, including posts, videos, reels, stories, and carousel content.',
	);

const MessageAttachmentDataSchema = z
	.object({
		id: z.string().optional().describe('The unique ID of the attachment.'),

		mime_type: z
			.string()
			.optional()
			.describe(
				'The MIME type of the attachment, such as image/jpeg or video/mp4.',
			),

		name: z
			.string()
			.optional()
			.describe('The filename or display name of the attachment.'),

		image_data: z
			.record(z.string(), z.unknown())
			.optional()
			.describe(
				'Image-specific attachment metadata, including URLs and dimensions.',
			),

		video_data: z
			.record(z.string(), z.unknown())
			.optional()
			.describe(
				'Video-specific attachment metadata, including URLs and dimensions.',
			),

		file_url: z
			.string()
			.optional()
			.describe('The URL of the attached file when returned by the Graph API.'),
	})
	.loose()
	.describe(
		'A single attachment item returned on an Instagram or Messenger message.',
	);

const MessageAttachmentsSchema = z
	.object({
		data: z
			.array(MessageAttachmentDataSchema)
			.optional()
			.describe('The list of attachments included with the message.'),
	})
	.loose()
	.describe('Graph API collection wrapper for message attachments.');

export const MessageSchema = z
	.object({
		id: z.string().describe('The unique identifier of the message.'),

		message: z.string().optional().describe('The text content of the message.'),

		created_time: z
			.string()
			.optional()
			.describe('The timestamp indicating when the message was created.'),

		from: z
			.object({
				id: z.string().optional().describe('The unique ID of the sender.'),

				username: z.string().optional().describe('The username of the sender.'),
			})
			.optional()
			.describe('Information about the user who sent the message.'),

		attachments: MessageAttachmentsSchema.optional().describe(
			'Attachment data associated with the message, such as images, videos, files, or other media.',
		),
	})
	.describe(
		'Represents an Instagram or Messenger message, including sender information, content, and attachments.',
	);

export const CommentsOutputSchema = z
	.object({
		id: z.string().describe('The unique Instagram Comment ID.'),

		text: z.string().optional().describe('The text content of the comment.'),

		timestamp: z
			.string()
			.optional()
			.describe('The timestamp indicating when the comment was created.'),

		username: z
			.string()
			.optional()
			.describe('The Instagram username of the user who created the comment.'),
	})
	.describe('Represents an Instagram comment and its associated metadata.');

// Response schemas

const CreateMediaContainerResponseSchema = z
	.object({
		id: z.string().describe('The created container ID.'),
		creation_id: z.string().optional().describe('The creation ID.'),
	})
	.passthrough();

const CreatePostResponseSchema = z.object({ id: z.string() }).passthrough();

const DeleteMessengerProfileResponseSchema = z
	.object({
		result: z
			.string()
			.describe('The API status response, typically "success".'),
	})
	.passthrough();

const GetConversationResponseSchema = z
	.object({
		id: z.string().describe('The DM conversation ID.'),
		updated_time: z.string().optional().describe('Last updated timestamp.'),
		message_count: z.number().optional().describe('Total message count.'),
		unread_count: z.number().optional().describe('Unread message count.'),
	})
	.passthrough();

const GetIgCommentRepliesResponseSchema = z
	.object({
		data: z.array(CommentsOutputSchema).describe('The replies.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetIgMediaChildrenResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					id: z.string().describe('Child Media ID.'),
					media_type: z
						.enum(['IMAGE', 'VIDEO'])
						.optional()
						.describe('Child media type.'),
					media_url: z.string().url().optional().describe('Child media URL.'),
				}),
			)
			.describe('Media children items.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetIgMediaCommentsResponseSchema = z
	.object({
		data: z.array(CommentsOutputSchema).describe('Comments list.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetIgMediaInsightsResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					name: z.string(),
					period: z.string(),
					values: z.array(z.object({ value: z.number() })),
					title: z.string().optional(),
					description: z.string().optional(),
					id: z.string().optional(),
				}),
			)
			.describe('Insights data list.'),
	})
	.passthrough();

const GetIgUserContentPublishingLimitResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					quota_usage: z.number().optional(),
					config: z
						.object({
							quota_total: z.number(),
							quota_duration: z.number(),
						})
						.optional(),
				}),
			)
			.optional(),
	})
	.passthrough();

const GetIgUserLiveMediaResponseSchema = z
	.object({
		data: z.array(InstagramMedia).describe('Live media items.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetIgUserMediaResponseSchema = z
	.object({
		data: z.array(InstagramMedia).describe('Media list.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetIgUserStoriesResponseSchema = z
	.object({
		data: z.array(InstagramMedia).describe('Stories list.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetIgUserTagsResponseSchema = z
	.object({
		data: z.array(InstagramMedia).describe('Tagged media list.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetMessengerProfileResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					persistent_menu: z
						.array(z.any())
						.optional()
						.describe('Persistent menu options.'),
					ice_breakers: z
						.array(z.any())
						.optional()
						.describe('Ice breaker options.'),
				}),
			)
			.describe('Messenger Profile options.'),
	})
	.passthrough();

const GetPageConversationsResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					id: z.string(),
					updated_time: z.string().optional(),
				}),
			)
			.describe('Conversations.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetPostCommentsResponseSchema = z
	.object({
		data: z.array(CommentsOutputSchema).describe('Comments.'),
		paging: MetaPagination,
	})
	.passthrough();

const GetPostInsightsResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					name: z.string(),
					period: z.string(),
					values: z.array(z.object({ value: z.number() })),
				}),
			)
			.describe('Insights.'),
	})
	.passthrough();

const GetPostStatusResponseSchema = z
	.object({
		id: z.string().describe('The container ID.'),
		status_code: z.enum(['IN_PROGRESS', 'FINISHED', 'ERROR', 'EXPIRED']),
	})
	.passthrough();

const GetUserInfoResponseSchema = z
	.object({
		id: z.string().describe('User ID.'),
		username: z.string().optional(),
		name: z.string().optional(),
		biography: z.string().optional(),
		followers_count: z.number().optional(),
		follows_count: z.number().optional(),
		media_count: z.number().optional(),
		profile_picture_url: z.string().url().optional(),
	})
	.passthrough();

const GetUserInsightsResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					name: z.string(),
					period: z.string(),
					values: z.array(z.object({ value: z.number() })),
				}),
			)
			.describe('Insights.'),
	})
	.passthrough();

const GetUserMediaResponseSchema = z
	.object({
		data: z.array(InstagramMedia).describe('User media.'),
		paging: MetaPagination,
	})
	.passthrough();

const ListAllConversationsResponseSchema = z
	.object({
		data: z
			.array(
				z.object({
					id: z.string().describe('Conversation ID.'),
					updated_time: z.string().optional().describe('Last updated time.'),
				}),
			)
			.describe('Conversations list.'),
		paging: MetaPagination,
	})
	.passthrough();

const ListAllMessagesResponseSchema = z
	.object({
		data: z.array(MessageSchema).describe('Messages list.'),
		paging: MetaPagination,
	})
	.passthrough();

const MarkSeenResponseSchema = z
	.object({
		success: z.boolean().describe('Whether action succeeded.'),
	})
	.passthrough();

const PostIgCommentRepliesResponseSchema = z
	.object({
		id: z.string().describe('The created comment reply ID.'),
	})
	.passthrough();

const PostIgMediaCommentsResponseSchema = z
	.object({
		id: z.string().describe('The created comment ID.'),
	})
	.passthrough();

const PostIgUserMediaResponseSchema = z
	.object({
		id: z.string().describe('The created media container ID.'),
	})
	.passthrough();

const PublishIgUserMediaResponseSchema = z
	.object({
		id: z.string().describe('The published media ID.'),
	})
	.passthrough();

const ReplyToCommentResponseSchema = z.object({ id: z.string() }).passthrough();

const ReplyToIgUserMentionsResponseSchema = z
	.object({
		id: z.string().describe('The created comment reply ID.'),
	})
	.passthrough();

const SendImageResponseSchema = z
	.object({
		message_id: z.string().describe('The message ID.'),
	})
	.passthrough();

const SendTextMessageResponseSchema = z
	.object({
		message_id: z.string().describe('The message ID.'),
	})
	.passthrough();

const UpdateMessengerProfileResponseSchema = z
	.object({
		result: z
			.string()
			.describe('The API response result, typically "success".'),
	})
	.passthrough();

const GetInstagramMediaListOutputSchema = z
	.object({
		data: z
			.array(InstagramMedia)
			.describe('The list of Instagram media objects returned by the request.'),

		paging: MetaPagination.describe(
			'Pagination information used to navigate through additional pages of media results.',
		),
	})
	.describe('A paginated collection of Instagram media objects.');

const CreateInstagramMediaOutputSchema = z
	.object({
		id: z
			.string()
			.describe(
				'The media container ID that can be used to check processing status or publish the media.',
			),
	})
	.describe(
		'Response returned after successfully creating an Instagram media container.',
	);

const GetMediaContainerStatusOutputSchema = z
	.object({
		id: z
			.string()
			.describe('The Instagram media container ID whose status was requested.'),

		status_code: z
			.enum(['IN_PROGRESS', 'FINISHED', 'ERROR', 'EXPIRED'])
			.describe(
				'The current processing status of the media container. IN_PROGRESS indicates processing is ongoing, FINISHED indicates the media is ready to publish, ERROR indicates processing failed, and EXPIRED indicates the container is no longer valid.',
			),
	})
	.describe(
		'Represents the processing status of an Instagram media container.',
	);

const GetMediaInsightsOutputSchema = z
	.object({
		data: z
			.array(z.record(z.string(), z.any()))
			.describe(
				'A collection of insight metrics and values returned for the requested Instagram media.',
			),
	})
	.describe(
		'Represents performance insights and analytics for an Instagram media object.',
	);

const GetAccountInsightsOutputSchema = GetMediaInsightsOutputSchema;

const GetInstagramConversationsOutputSchema = z
	.object({
		data: z
			.array(
				z.object({
					id: z
						.string()
						.describe(
							'The unique ID of an Instagram Direct Message conversation.',
						),
				}),
			)
			.describe(
				'The list of Instagram conversations associated with the connected account.',
			),
	})
	.describe(
		'Represents a collection of Instagram Direct Message conversations.',
	);

const GetConversationMessagesOutputSchema = z
	.object({
		data: z
			.array(MessageSchema)
			.describe(
				'The list of messages contained within the specified conversation.',
			),
	})
	.describe(
		'Represents the messages retrieved from an Instagram Direct Message conversation.',
	);

const SendMessageOutputSchema = z
	.object({
		recipient_id: z
			.string()
			.describe('The ID of the user who received the message.'),

		message_id: z
			.string()
			.describe('The unique identifier of the message that was sent.'),

		timestamp: z
			.number()
			.optional()
			.describe('The Unix timestamp indicating when the message was sent.'),
	})
	.describe('Represents the result of successfully sending a message.');

const GetCommentsOutputSchema = z
	.object({
		data: z
			.array(CommentsOutputSchema)
			.optional()
			.describe(
				'The list of comments associated with the requested Instagram media.',
			),
	})
	.describe('Represents the comments retrieved for an Instagram media object.');

const ReplyCommentsOutputSchema = z
	.object({
		id: z
			.string()
			.describe('The unique ID of the newly created reply comment.'),
	})
	.describe(
		'Represents the result of successfully replying to an Instagram comment.',
	);

const SendCommentsOutputSchema = z
	.object({
		id: z
			.string()
			.describe('The unique ID of the newly created Instagram comment.'),
	})
	.describe(
		'Represents the result of successfully creating a comment on an Instagram media object.',
	);

export const GetInstagramCommentDetailsOutputSchema = z
	.object({
		id: z.string().describe('The unique Instagram Comment ID.'),

		text: z.string().optional().describe('The text content of the comment.'),

		hidden: z
			.boolean()
			.optional()
			.describe('Indicates whether the comment is hidden from public view.'),

		like_count: z
			.number()
			.optional()
			.describe('The total number of likes received by the comment.'),

		legacy_instagram_comment_id: z
			.string()
			.optional()
			.describe('The legacy Instagram comment identifier, if available.'),

		timestamp: z
			.string()
			.datetime()
			.optional()
			.describe(
				'The ISO 8601 timestamp indicating when the comment was created.',
			),

		parent_id: z
			.string()
			.optional()
			.describe('The ID of the parent comment if this comment is a reply.'),

		from: z
			.object({
				id: z
					.string()
					.describe('The unique ID of the user who created the comment.'),

				username: z
					.string()
					.describe(
						'The Instagram username of the user who created the comment.',
					),
			})
			.optional()
			.describe('Information about the user who created the comment.'),

		media: z
			.object({
				id: z
					.string()
					.describe('The Instagram Media ID associated with the comment.'),

				media_product_type: z
					.string()
					.optional()
					.describe('The type of Instagram media associated with the comment.'),
			})
			.optional()
			.describe('Information about the media on which the comment was posted.'),

		user: z
			.string()
			.optional()
			.describe('The ID of the Instagram user associated with the comment.'),

		username: z
			.string()
			.optional()
			.describe('The Instagram username of the comment author.'),

		replies: z
			.array(
				z.object({
					id: z.string().describe('The unique ID of the reply comment.'),

					text: z
						.string()
						.optional()
						.describe('The text content of the reply.'),

					timestamp: z
						.string()
						.optional()
						.describe('The timestamp indicating when the reply was created.'),
				}),
			)
			.optional()
			.describe('The list of replies associated with this comment.'),
	})
	.describe(
		'Represents detailed information about an Instagram comment, including author, media, engagement metrics, and replies.',
	);

const UpdateCommentsOutputSchema = z
	.object({
		success: z
			.boolean()
			.describe(
				'Indicates whether the comment update operation completed successfully.',
			),
	})
	.describe('Represents the result of updating an Instagram comment.');

const DeleteCommentOutputSchema = UpdateCommentsOutputSchema;

export type GetInstagramUserOutputSchema = z.infer<
	typeof GetInstagramUserOutputSchema
>;
export type GetInstagramMediaOutputSchema = z.infer<
	typeof GetInstagramMediaListOutputSchema
>;
export type GetInstagramMediaOutputchema = z.infer<typeof InstagramMedia>;
export type CreateInstagramMediaOutputSchema = z.infer<
	typeof CreateInstagramMediaOutputSchema
>;
export type GetMediaContainerStatusOutputSchema = z.infer<
	typeof GetMediaContainerStatusOutputSchema
>;
export type GetMediaInsightsOutputSchema = z.infer<
	typeof GetMediaInsightsOutputSchema
>;
export type GetAccountInsightsOutputSchema = z.infer<
	typeof GetAccountInsightsOutputSchema
>;
export type GetInstagramConversationsOutputSchema = z.infer<
	typeof GetInstagramConversationsOutputSchema
>;
export type GetConversationMessagesOutputSchema = z.infer<
	typeof GetConversationMessagesOutputSchema
>;
export type MessageSchema = z.infer<typeof MessageSchema>;
export type SendMessageOutputSchema = z.infer<typeof SendMessageOutputSchema>;
export type GetCommentsOutputSchema = z.infer<typeof GetCommentsOutputSchema>;
export type ReplyCommentsOutputSchema = z.infer<
	typeof ReplyCommentsOutputSchema
>;
export type SendCommentsOutputSchema = z.infer<typeof SendCommentsOutputSchema>;
export type GetInstagramCommentDetailsOutputSchema = z.infer<
	typeof GetInstagramCommentDetailsOutputSchema
>;
export type UpdateCommentsOutputSchema = z.infer<
	typeof UpdateCommentsOutputSchema
>;
export type DeleteCommentOutputSchema = z.infer<
	typeof DeleteCommentOutputSchema
>;
export type media = keyof typeof MEDIA_TYPE_METRICS;

export const InstagramEndpointOutputSchemas = {
	GetInstagramUser: GetInstagramUserOutputSchema,
	GetInstagramMediaList: GetInstagramMediaListOutputSchema,
	GetInstagramMedia: InstagramMedia,
	CreateImageContainer: CreateInstagramMediaOutputSchema,
	CreateReelContainer: CreateInstagramMediaOutputSchema,
	PublishInstagramMedia: CreateInstagramMediaOutputSchema,
	CreateImageStoryContainer: CreateInstagramMediaOutputSchema,
	CreateVideoStoryContainer: CreateInstagramMediaOutputSchema,
	CreateCarouselContainer: CreateInstagramMediaOutputSchema,
	CreateVideoContainer: CreateInstagramMediaOutputSchema,
	GetMediaContainerStatus: GetMediaContainerStatusOutputSchema,
	GetMediaInsights: GetMediaInsightsOutputSchema,
	GetAccountInsights: GetAccountInsightsOutputSchema,
	GetInstagramConversations: GetInstagramConversationsOutputSchema,
	GetConversationMessages: GetConversationMessagesOutputSchema,
	GetMessage: MessageSchema,
	SendMessage: SendMessageOutputSchema,
	GetComments: GetCommentsOutputSchema,
	ReplyComments: ReplyCommentsOutputSchema,
	SendComments: SendCommentsOutputSchema,
	GetCommentsDetails: GetInstagramCommentDetailsOutputSchema,
	UpdateComments: UpdateCommentsOutputSchema,
	DeleteComment: DeleteCommentOutputSchema,
	CreateMediaContainer: CreateMediaContainerResponseSchema,
	CreatePost: CreatePostResponseSchema,
	DeleteMessengerProfile: DeleteMessengerProfileResponseSchema,
	GetConversation: GetConversationResponseSchema,
	GetIgCommentReplies: GetIgCommentRepliesResponseSchema,
	GetIgMediaChildren: GetIgMediaChildrenResponseSchema,
	GetIgMediaComments: GetIgMediaCommentsResponseSchema,
	GetIgMediaInsights: GetIgMediaInsightsResponseSchema,
	GetIgUserContentPublishingLimit:
		GetIgUserContentPublishingLimitResponseSchema,
	GetIgUserLiveMedia: GetIgUserLiveMediaResponseSchema,
	GetIgUserMedia: GetIgUserMediaResponseSchema,
	GetIgUserStories: GetIgUserStoriesResponseSchema,
	GetIgUserTags: GetIgUserTagsResponseSchema,
	GetMessengerProfile: GetMessengerProfileResponseSchema,
	GetPageConversations: GetPageConversationsResponseSchema,
	GetPostComments: GetPostCommentsResponseSchema,
	GetPostInsights: GetPostInsightsResponseSchema,
	GetPostStatus: GetPostStatusResponseSchema,
	GetUserInfo: GetUserInfoResponseSchema,
	GetUserInsights: GetUserInsightsResponseSchema,
	GetUserMedia: GetUserMediaResponseSchema,
	ListAllConversations: ListAllConversationsResponseSchema,
	ListAllMessages: ListAllMessagesResponseSchema,
	MarkSeen: MarkSeenResponseSchema,
	PostIgCommentReplies: PostIgCommentRepliesResponseSchema,
	PostIgMediaComments: PostIgMediaCommentsResponseSchema,
	PostIgUserMedia: PostIgUserMediaResponseSchema,
	PublishIgUserMedia: PublishIgUserMediaResponseSchema,
	ReplyToComment: ReplyToCommentResponseSchema,
	ReplyToIgUserMentions: ReplyToIgUserMentionsResponseSchema,
	SendImage: SendImageResponseSchema,
	SendTextMessage: SendTextMessageResponseSchema,
	UpdateMessengerProfile: UpdateMessengerProfileResponseSchema,
} as const;

export type InstagramEndpointOutputs = {
	GetInstagramUser: GetInstagramUserOutputSchema;
	GetInstagramMediaList: GetInstagramMediaOutputSchema;
	GetInstagramMedia: GetInstagramMediaOutputchema;
	CreateImageContainer: CreateInstagramMediaOutputSchema;
	CreateReelContainer: CreateInstagramMediaOutputSchema;
	PublishInstagramMedia: CreateInstagramMediaOutputSchema;
	CreateImageStoryContainer: CreateInstagramMediaOutputSchema;
	CreateVideoStoryContainer: CreateInstagramMediaOutputSchema;
	CreateCarouselContainer: CreateInstagramMediaOutputSchema;
	CreateVideoContainer: CreateInstagramMediaOutputSchema;
	GetMediaContainerStatus: GetMediaContainerStatusOutputSchema;
	GetMediaInsights: GetMediaInsightsOutputSchema;
	GetAccountInsights: GetAccountInsightsOutputSchema;
	GetInstagramConversations: GetInstagramConversationsOutputSchema;
	GetConversationMessages: GetConversationMessagesOutputSchema;
	GetMessage: MessageSchema;
	SendMessage: SendMessageOutputSchema;
	GetComments: GetCommentsOutputSchema;
	ReplyComments: ReplyCommentsOutputSchema;
	SendComments: SendCommentsOutputSchema;
	GetCommentsDetails: GetInstagramCommentDetailsOutputSchema;
	UpdateComments: UpdateCommentsOutputSchema;
	DeleteComment: DeleteCommentOutputSchema;
	CreateMediaContainer: z.infer<typeof CreateMediaContainerResponseSchema>;
	CreatePost: z.infer<typeof CreatePostResponseSchema>;
	DeleteMessengerProfile: z.infer<typeof DeleteMessengerProfileResponseSchema>;
	GetConversation: z.infer<typeof GetConversationResponseSchema>;
	GetIgCommentReplies: z.infer<typeof GetIgCommentRepliesResponseSchema>;
	GetIgMediaChildren: z.infer<typeof GetIgMediaChildrenResponseSchema>;
	GetIgMediaComments: z.infer<typeof GetIgMediaCommentsResponseSchema>;
	GetIgMediaInsights: z.infer<typeof GetIgMediaInsightsResponseSchema>;
	GetIgUserContentPublishingLimit: z.infer<
		typeof GetIgUserContentPublishingLimitResponseSchema
	>;
	GetIgUserLiveMedia: z.infer<typeof GetIgUserLiveMediaResponseSchema>;
	GetIgUserMedia: z.infer<typeof GetIgUserMediaResponseSchema>;
	GetIgUserStories: z.infer<typeof GetIgUserStoriesResponseSchema>;
	GetIgUserTags: z.infer<typeof GetIgUserTagsResponseSchema>;
	GetMessengerProfile: z.infer<typeof GetMessengerProfileResponseSchema>;
	GetPageConversations: z.infer<typeof GetPageConversationsResponseSchema>;
	GetPostComments: z.infer<typeof GetPostCommentsResponseSchema>;
	GetPostInsights: z.infer<typeof GetPostInsightsResponseSchema>;
	GetPostStatus: z.infer<typeof GetPostStatusResponseSchema>;
	GetUserInfo: z.infer<typeof GetUserInfoResponseSchema>;
	GetUserInsights: z.infer<typeof GetUserInsightsResponseSchema>;
	GetUserMedia: z.infer<typeof GetUserMediaResponseSchema>;
	ListAllConversations: z.infer<typeof ListAllConversationsResponseSchema>;
	ListAllMessages: z.infer<typeof ListAllMessagesResponseSchema>;
	MarkSeen: z.infer<typeof MarkSeenResponseSchema>;
	PostIgCommentReplies: z.infer<typeof PostIgCommentRepliesResponseSchema>;
	PostIgMediaComments: z.infer<typeof PostIgMediaCommentsResponseSchema>;
	PostIgUserMedia: z.infer<typeof PostIgUserMediaResponseSchema>;
	PublishIgUserMedia: z.infer<typeof PublishIgUserMediaResponseSchema>;
	ReplyToComment: z.infer<typeof ReplyToCommentResponseSchema>;
	ReplyToIgUserMentions: z.infer<typeof ReplyToIgUserMentionsResponseSchema>;
	SendImage: z.infer<typeof SendImageResponseSchema>;
	SendTextMessage: z.infer<typeof SendTextMessageResponseSchema>;
	UpdateMessengerProfile: z.infer<typeof UpdateMessengerProfileResponseSchema>;
};
