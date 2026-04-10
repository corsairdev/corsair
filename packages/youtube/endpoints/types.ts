import { z } from 'zod';

// ── Shared Primitives ─────────────────────────────────────────────────────────

const ThumbnailDetailSchema = z.object({
	url: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
});

const ThumbnailsSchema = z.object({
	default: ThumbnailDetailSchema.optional(),
	medium: ThumbnailDetailSchema.optional(),
	high: ThumbnailDetailSchema.optional(),
	standard: ThumbnailDetailSchema.optional(),
	maxres: ThumbnailDetailSchema.optional(),
});

const PageInfoSchema = z.object({
	totalResults: z.number().optional(),
	resultsPerPage: z.number().optional(),
});

const ResourceIdSchema = z.object({
	kind: z.string().optional(),
	videoId: z.string().optional(),
	channelId: z.string().optional(),
	playlistId: z.string().optional(),
});

// ── Playlists ─────────────────────────────────────────────────────────────────

const PlaylistsListInputSchema = z.object({
	part: z
		.string()
		.optional()
		.describe(
			'Comma-separated list of resource parts (snippet,status,contentDetails)',
		),
	pageToken: z
		.string()
		.optional()
		.describe('Token for the next page of results'),
	maxResults: z
		.number()
		.int()
		.optional()
		.describe('Maximum number of results to return (1-50)'),
});

const PlaylistSnippetSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	channelId: z.string().optional(),
	channelTitle: z.string().optional(),
	publishedAt: z.string().optional(),
	thumbnails: ThumbnailsSchema.optional(),
	localized: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
		})
		.optional(),
});

const PlaylistItemSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: PlaylistSnippetSchema.optional(),
		status: z.object({ privacyStatus: z.string().optional() }).optional(),
		contentDetails: z.object({ itemCount: z.number().optional() }).optional(),
	})
	.passthrough();

const PlaylistsListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(PlaylistItemSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

const PlaylistsCreateInputSchema = z.object({
	title: z.string().describe('Playlist title (max 150 characters)'),
	description: z.string().optional().describe('Playlist description'),
	privacyStatus: z
		.enum(['public', 'private', 'unlisted'])
		.optional()
		.describe('Privacy status of the playlist'),
});

const PlaylistsCreateResponseSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: PlaylistSnippetSchema.optional(),
		status: z.object({ privacyStatus: z.string().optional() }).optional(),
		contentDetails: z.object({ itemCount: z.number().optional() }).optional(),
	})
	.passthrough();

const PlaylistsUpdateInputSchema = z.object({
	id: z.string().describe('The ID of the playlist to update'),
	snippet: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
		})
		.describe('Updated snippet fields'),
	part: z
		.string()
		.optional()
		.describe('Comma-separated list of parts to update'),
	status: z.object({ privacyStatus: z.string().optional() }).optional(),
	onBehalfOfContentOwner: z.string().optional(),
});

const PlaylistsUpdateResponseSchema = PlaylistsCreateResponseSchema;

const PlaylistsDeleteInputSchema = z.object({
	id: z.string().describe('The ID of the playlist to delete'),
	confirmDelete: z
		.boolean()
		.describe('Confirm that you want to delete the playlist'),
	onBehalfOfContentOwner: z.string().optional(),
});

const PlaylistsDeleteResponseSchema = z.object({
	deleted: z.boolean().optional(),
	playlist_id: z.string().optional(),
	http_status: z.number().optional(),
	error: z.string().optional(),
});

// ── Playlist Items ────────────────────────────────────────────────────────────

const PlaylistItemSnippetSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	position: z.number().optional(),
	channelId: z.string().optional(),
	channelTitle: z.string().optional(),
	playlistId: z.string().optional(),
	publishedAt: z.string().optional(),
	thumbnails: ThumbnailsSchema.optional(),
	resourceId: ResourceIdSchema.optional(),
	videoOwnerChannelId: z.string().optional(),
	videoOwnerChannelTitle: z.string().optional(),
});

const PlaylistItemResourceSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: PlaylistItemSnippetSchema.optional(),
		status: z.object({ privacyStatus: z.string().optional() }).optional(),
		contentDetails: z
			.object({
				videoId: z.string().optional(),
				videoPublishedAt: z.string().optional(),
				note: z.string().optional(),
				startAt: z.string().optional(),
				endAt: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const PlaylistItemsAddInputSchema = z.object({
	videoId: z.string().describe('The YouTube video ID to add to the playlist'),
	playlistId: z.string().describe('The ID of the playlist to add the video to'),
	position: z
		.number()
		.int()
		.optional()
		.describe('Zero-based position to insert the video'),
});

const PlaylistItemsAddResponseSchema = PlaylistItemResourceSchema;

const PlaylistItemsListInputSchema = z.object({
	playlistId: z.string().describe('The ID of the playlist to list items for'),
	part: z.string().optional(),
	fields: z.string().optional(),
	videoId: z.string().optional().describe('Filter by video ID'),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
	onBehalfOfContentOwner: z.string().optional(),
});

const PlaylistItemsListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(PlaylistItemResourceSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
		eventId: z.string().optional(),
		visitorId: z.string().optional(),
	})
	.passthrough();

const PlaylistItemsUpdateInputSchema = z.object({
	id: z.string().describe('The ID of the playlist item to update'),
	snippet: z
		.object({
			playlistId: z.string().describe('The playlist ID this item belongs to'),
			resourceId: ResourceIdSchema.optional(),
			position: z.number().int().optional(),
		})
		.describe('Updated snippet'),
	part: z.string().optional(),
	contentDetails: z
		.object({
			note: z.string().optional(),
			startAt: z.string().optional(),
			endAt: z.string().optional(),
		})
		.optional(),
	onBehalfOfContentOwner: z.string().optional(),
});

const PlaylistItemsUpdateResponseSchema = PlaylistItemResourceSchema;

const PlaylistItemsDeleteInputSchema = z.object({
	id: z.string().describe('The ID of the playlist item to delete'),
});

const PlaylistItemsDeleteResponseSchema = z.object({
	deleted: z.boolean().optional(),
	playlist_item_id: z.string().optional(),
	http_status: z.number().optional(),
	error: z.string().optional(),
});

// ── Videos ────────────────────────────────────────────────────────────────────

const VideoSnippetSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	channelId: z.string().optional(),
	channelTitle: z.string().optional(),
	publishedAt: z.string().optional(),
	thumbnails: ThumbnailsSchema.optional(),
	tags: z.array(z.string()).optional(),
	categoryId: z.string().optional(),
	defaultLanguage: z.string().optional(),
	liveBroadcastContent: z.string().optional(),
});

const VideoResourceSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: VideoSnippetSchema.optional(),
		status: z
			.object({
				privacyStatus: z.string().optional(),
				uploadStatus: z.string().optional(),
				publishAt: z.string().optional(),
				license: z.string().optional(),
				embeddable: z.boolean().optional(),
				publicStatsViewable: z.boolean().optional(),
			})
			.optional(),
		statistics: z
			.object({
				viewCount: z.string().optional(),
				likeCount: z.string().optional(),
				dislikeCount: z.string().optional(),
				favoriteCount: z.string().optional(),
				commentCount: z.string().optional(),
			})
			.optional(),
		contentDetails: z
			.object({
				duration: z.string().optional(),
				dimension: z.string().optional(),
				definition: z.string().optional(),
				caption: z.string().optional(),
				licensedContent: z.boolean().optional(),
			})
			.optional(),
	})
	.passthrough();

const VideosGetInputSchema = z.object({
	video_id: z.string().describe('The YouTube video ID'),
	part: z
		.string()
		.optional()
		.describe('Comma-separated list of resource parts'),
});

const VideosGetResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(VideoResourceSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

const VideosGetBatchInputSchema = z.object({
	id: z
		.array(z.string())
		.describe('Array of YouTube video IDs to retrieve (max 50)'),
	hl: z.string().optional().describe('Language for localized metadata'),
	parts: z.array(z.string()).optional().describe('Resource parts to include'),
});

const VideosGetBatchResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(VideoResourceSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		found_count: z.number().optional(),
		not_found_count: z.number().optional(),
		requested_count: z.number().optional(),
		not_found_video_ids: z.array(z.string()).optional(),
		requested_video_ids: z.array(z.string()).optional(),
		partial_failure: z.boolean().optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
		composio_execution_message: z.string().optional(),
	})
	.passthrough();

const VideosListInputSchema = z.object({
	mine: z
		.boolean()
		.optional()
		.describe('List videos for the authenticated user'),
	channelId: z.string().optional().describe('Filter by channel ID'),
	part: z.string().optional(),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
});

const VideosListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(VideoResourceSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		regionCode: z.string().optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

const VideosListMostPopularInputSchema = z.object({
	part: z.string().optional(),
	chart: z.string().optional().describe('Chart to use (mostPopular)'),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
	regionCode: z.string().optional(),
	videoCategoryId: z.string().optional(),
});

const VideosListMostPopularResponseSchema = VideosListResponseSchema;

const VideosUpdateInputSchema = z.object({
	video_id: z.string().describe('The ID of the video to update'),
	title: z.string().optional().describe('Updated video title'),
	description: z.string().optional().describe('Updated video description'),
	tags: z.array(z.string()).optional().describe('Updated video tags'),
	categoryId: z.string().optional().describe('Updated category ID'),
	privacy_status: z
		.string()
		.optional()
		.describe('Updated privacy status (public, private, unlisted)'),
	composio_execution_message: z.string().optional(),
});

const VideosUpdateResponseSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: VideoSnippetSchema.optional(),
		status: z
			.object({
				privacyStatus: z.string().optional(),
				uploadStatus: z.string().optional(),
			})
			.optional(),
		statistics: z
			.object({
				viewCount: z.string().optional(),
				likeCount: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const VideoFileSchema = z.object({
	name: z.string().optional(),
	content_type: z.string().optional(),
	s3_key: z.string().optional(),
	s3_url: z.string().optional(),
	storage_type: z.string().optional(),
	content_length: z.number().optional(),
});

const VideosUploadInputSchema = z.object({
	title: z.string().describe('Video title'),
	categoryId: z.string().describe('Video category ID'),
	description: z.string().describe('Video description'),
	privacyStatus: z
		.enum(['public', 'private', 'unlisted'])
		.describe('Privacy status'),
	tags: z.array(z.string()).describe('Video tags'),
	videoFilePath: VideoFileSchema.describe('Video file reference'),
});

const VideosUploadResponseSchema = z
	.object({
		// Upload response structure varies by resumable upload state and YouTube API version
		response_data: z.unknown().optional(),
	})
	.passthrough();

const VideosUploadMultipartInputSchema = z.object({
	title: z.string().describe('Video title'),
	videoFile: VideoFileSchema.describe('Video file reference'),
	categoryId: z.string().describe('Video category ID'),
	description: z.string().describe('Video description'),
	privacyStatus: z
		.enum(['public', 'private', 'unlisted'])
		.describe('Privacy status'),
	tags: z.array(z.string()).optional().describe('Video tags'),
});

const VideosUploadMultipartResponseSchema = z
	.object({
		video: VideoResourceSchema.optional(),
	})
	.passthrough();

const VideosDeleteInputSchema = z.object({
	videoId: z.string().describe('The ID of the video to delete'),
	confirmDelete: z
		.boolean()
		.describe('Confirm that you want to delete the video'),
	onBehalfOfContentOwner: z.string().optional(),
});

const VideosDeleteResponseSchema = z.object({
	deleted: z.boolean().optional(),
	video_id: z.string().optional(),
	http_status: z.number().optional(),
	error: z.string().optional(),
});

// ── Channels ──────────────────────────────────────────────────────────────────

const ChannelSnippetSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	customUrl: z.string().optional(),
	publishedAt: z.string().optional(),
	country: z.string().optional(),
	thumbnails: ThumbnailsSchema.optional(),
});

const ChannelResourceSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: ChannelSnippetSchema.optional(),
		statistics: z
			.object({
				viewCount: z.string().optional(),
				subscriberCount: z.string().optional(),
				videoCount: z.string().optional(),
				hiddenSubscriberCount: z.boolean().optional(),
			})
			.optional(),
		contentDetails: z
			.object({
				relatedPlaylists: z
					.object({
						uploads: z.string().optional(),
						likes: z.string().optional(),
					})
					.optional(),
			})
			.optional(),
		brandingSettings: z
			.object({
				channel: z
					.object({
						title: z.string().optional(),
						description: z.string().optional(),
						keywords: z.string().optional(),
					})
					.optional(),
			})
			.optional(),
	})
	.passthrough();

const ChannelsGetStatisticsInputSchema = z.object({
	id: z.string().optional().describe('Channel ID(s), comma-separated'),
	mine: z
		.boolean()
		.optional()
		.describe("Get statistics for the authenticated user's channel"),
	part: z.string().optional(),
	forHandle: z
		.string()
		.optional()
		.describe('Channel handle (e.g. @channelname)'),
	forUsername: z.string().optional(),
});

const ChannelsGetStatisticsResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(ChannelResourceSchema).optional(),
		channels: z.array(ChannelResourceSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

const ChannelsGetIdByHandleInputSchema = z.object({
	channel_handle: z
		.string()
		.describe('YouTube channel handle (e.g. @channelname)'),
});

const ChannelsGetIdByHandleResponseSchema = ChannelsGetStatisticsResponseSchema;

const ChannelsGetActivitiesInputSchema = z.object({
	channelId: z.string().describe('The channel ID to get activities for'),
	part: z.string().optional(),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
	publishedAfter: z
		.string()
		.optional()
		.describe('RFC 3339 datetime - only return activities after this time'),
	publishedBefore: z
		.string()
		.optional()
		.describe('RFC 3339 datetime - only return activities before this time'),
});

const ChannelsGetActivitiesResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z
			.array(
				z
					.object({
						id: z.string().optional(),
						etag: z.string().optional(),
						kind: z.string().optional(),
						snippet: z
							.object({
								channelId: z.string().optional(),
								title: z.string().optional(),
								description: z.string().optional(),
								publishedAt: z.string().optional(),
								type: z.string().optional(),
								thumbnails: ThumbnailsSchema.optional(),
							})
							.optional(),
						// contentDetails varies per activity type (upload, like, favorite, etc.) — no fixed shape
						contentDetails: z.record(z.unknown()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

const ChannelsUpdateInputSchema = z.object({
	id: z.string().describe('The channel ID to update'),
	part: z.string().optional(),
	brandingSettings: z
		.object({
			channel: z
				.object({
					title: z.string().optional(),
					description: z.string().optional(),
					keywords: z.string().optional(),
					country: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	// localizations is a map of language code to localized strings — shape varies per channel
	localizations: z.record(z.unknown()).optional(),
	onBehalfOfContentOwner: z.string().optional(),
});

const ChannelsUpdateResponseSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: ChannelSnippetSchema.optional(),
		statistics: z
			.object({
				viewCount: z.string().optional(),
				subscriberCount: z.string().optional(),
				videoCount: z.string().optional(),
			})
			.optional(),
		// brandingSettings and localizations have deeply nested arbitrary structures not fully documented
		brandingSettings: z.record(z.unknown()).optional(),
		// localizations is a map of BCP-47 language tags to localized channel metadata
		localizations: z.record(z.unknown()).optional(),
	})
	.passthrough();

const ChannelSectionsListInputSchema = z.object({
	part: z
		.string()
		.describe('Comma-separated list of parts (snippet,contentDetails)'),
	hl: z.string().optional(),
	id: z.string().optional().describe('Section ID(s), comma-separated'),
	mine: z.boolean().optional(),
	channelId: z.string().optional(),
	onBehalfOfContentOwner: z.string().optional(),
});

const ChannelSectionSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: z
			.object({
				type: z.string().optional(),
				title: z.string().optional(),
				position: z.number().optional(),
				channelId: z.string().optional(),
			})
			.optional(),
		contentDetails: z
			.object({
				playlists: z.array(z.string()).optional(),
				channels: z.array(z.string()).optional(),
			})
			.optional(),
	})
	.passthrough();

const ChannelSectionsListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(ChannelSectionSchema).optional(),
		eventId: z.string().optional(),
		visitorId: z.string().optional(),
	})
	.passthrough();

const ChannelSectionsCreateInputSchema = z.object({
	snippet: z
		.object({
			type: z
				.enum([
					'allPlaylists',
					'completedEvents',
					'liveEvents',
					'multipleChannels',
					'multiplePlaylists',
					'popularUploads',
					'recentUploads',
					'singlePlaylist',
					'subscriptions',
					'upcomingEvents',
				])
				.describe('The type of channel section'),
			title: z
				.string()
				.optional()
				.describe(
					'Section title (for multiplePlaylists/multipleChannels types)',
				),
			position: z
				.number()
				.int()
				.optional()
				.describe('Zero-based position on the channel page'),
		})
		.describe('Section snippet'),
	contentDetails: z
		.object({
			channels: z
				.array(z.string())
				.optional()
				.describe('Channel IDs to feature (for multipleChannels type)'),
			playlists: z
				.array(z.string())
				.optional()
				.describe('Playlist IDs to include'),
		})
		.optional(),
});

const ChannelSectionsCreateResponseSchema = ChannelSectionSchema;

const ChannelSectionsUpdateInputSchema = z.object({
	id: z.string().describe('The ID of the channel section to update'),
	snippet: z
		.object({
			type: z.string().optional(),
			title: z.string().optional(),
			position: z.number().int().optional(),
		})
		.optional(),
	contentDetails: z
		.object({
			playlists: z.array(z.string()).optional(),
			channels: z.array(z.string()).optional(),
		})
		.optional(),
});

const ChannelSectionsUpdateResponseSchema = ChannelSectionSchema;

const ChannelSectionsDeleteInputSchema = z.object({
	id: z.string().describe('The ID of the channel section to delete'),
	onBehalfOfContentOwner: z.string().optional(),
});

const ChannelSectionsDeleteResponseSchema = z.object({
	deleted: z.boolean().optional(),
	channel_section_id: z.string().optional(),
	http_status: z.number().optional(),
	error: z.string().optional(),
});

// ── Comments ──────────────────────────────────────────────────────────────────

const CommentSnippetSchema = z.object({
	videoId: z.string().optional(),
	textDisplay: z.string().optional(),
	textOriginal: z.string().optional(),
	authorDisplayName: z.string().optional(),
	authorProfileImageUrl: z.string().optional(),
	authorChannelUrl: z.string().optional(),
	authorChannelId: z.object({ value: z.string().optional() }).optional(),
	likeCount: z.number().optional(),
	publishedAt: z.string().optional(),
	updatedAt: z.string().optional(),
	parentId: z.string().optional(),
	canRate: z.boolean().optional(),
	viewerRating: z.string().optional(),
});

const CommentResourceSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: CommentSnippetSchema.optional(),
	})
	.passthrough();

const CommentsListInputSchema = z.object({
	id: z.string().optional().describe('Comment ID(s), comma-separated'),
	part: z.string().optional(),
	parentId: z
		.string()
		.optional()
		.describe('Parent comment thread ID to list replies for'),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
	textFormat: z.enum(['html', 'plainText']).optional(),
});

const CommentsListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(CommentResourceSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
	})
	.passthrough();

const CommentThreadResourceSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: z
			.object({
				channelId: z.string().optional(),
				videoId: z.string().optional(),
				totalReplyCount: z.number().optional(),
				isPublic: z.boolean().optional(),
				topLevelComment: CommentResourceSchema.optional(),
			})
			.optional(),
		replies: z
			.object({
				comments: z.array(CommentResourceSchema).optional(),
			})
			.optional(),
	})
	.passthrough();

const CommentThreadsListInputSchema = z.object({
	id: z.string().optional(),
	part: z.string().optional(),
	order: z.enum(['time', 'relevance']).optional(),
	videoId: z.string().optional(),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
	textFormat: z.enum(['html', 'plainText']).optional(),
	searchTerms: z.string().optional(),
	allThreadsRelatedToChannelId: z.string().optional(),
});

const CommentThreadsListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(CommentThreadResourceSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
	})
	.passthrough();

const CommentThreadsList2InputSchema = z.object({
	id: z.string().optional(),
	part: z.string().describe('Comma-separated list of parts'),
	order: z.enum(['time', 'relevance']).optional(),
	videoId: z.string().optional(),
	channelId: z.string().optional(),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
	textFormat: z.enum(['html', 'plainText']).optional(),
	searchTerms: z.string().optional(),
	moderationStatus: z
		.enum(['heldForReview', 'likelySpam', 'published', 'rejected'])
		.optional(),
	allThreadsRelatedToChannelId: z.string().optional(),
});

const CommentThreadsList2ResponseSchema = CommentThreadsListResponseSchema;

const CommentsPostInputSchema = z.object({
	videoId: z.string().describe('The ID of the video to comment on'),
	channelId: z.string().describe('The channel ID that owns the video'),
	textOriginal: z.string().describe('The comment text'),
});

const CommentsPostResponseSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: z
			.object({
				channelId: z.string().optional(),
				videoId: z.string().optional(),
				totalReplyCount: z.number().optional(),
				isPublic: z.boolean().optional(),
				topLevelComment: CommentResourceSchema.optional(),
			})
			.optional(),
	})
	.passthrough();

const CommentsCreateReplyInputSchema = z.object({
	parentId: z
		.string()
		.describe('The ID of the parent comment thread to reply to'),
	textOriginal: z.string().describe('The reply text'),
});

const CommentsCreateReplyResponseSchema = CommentResourceSchema;

const CommentsUpdateInputSchema = z.object({
	id: z.string().describe('The ID of the comment to update'),
	textOriginal: z.string().describe('The updated comment text'),
});

const CommentsUpdateResponseSchema = CommentResourceSchema;

const CommentsDeleteInputSchema = z.object({
	id: z.string().describe('The ID of the comment to delete'),
});

const CommentsDeleteResponseSchema = z.object({
	deleted: z.boolean().optional(),
	comment_id: z.string().optional(),
	http_status: z.number().optional(),
	error: z.string().optional(),
});

const CommentsMarkSpamInputSchema = z.object({
	id: z.string().describe('The ID of the comment to mark as spam'),
});

const CommentsMarkSpamResponseSchema = z.object({
	success: z.boolean().optional(),
	comment_ids: z.array(z.string()).optional(),
	http_status: z.number().optional(),
});

const CommentsSetModerationStatusInputSchema = z.object({
	id: z.string().describe('The ID of the comment to moderate'),
	moderationStatus: z
		.enum(['heldForReview', 'published', 'rejected'])
		.describe('The moderation status to set'),
	banAuthor: z.boolean().optional().describe('Ban the author from the channel'),
});

const CommentsSetModerationStatusResponseSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
});

// ── Search ────────────────────────────────────────────────────────────────────

const SearchYouTubeInputSchema = z.object({
	q: z.string().describe('Search query'),
	part: z.string().optional(),
	type: z
		.string()
		.optional()
		.describe('Resource type to search (video, channel, playlist)'),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
});

const SearchResultSchema = z
	.object({
		id: z
			.object({
				kind: z.string().optional(),
				videoId: z.string().optional(),
				channelId: z.string().optional(),
				playlistId: z.string().optional(),
			})
			.optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: z
			.object({
				publishedAt: z.string().optional(),
				channelId: z.string().optional(),
				title: z.string().optional(),
				description: z.string().optional(),
				channelTitle: z.string().optional(),
				thumbnails: ThumbnailsSchema.optional(),
				liveBroadcastContent: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const SearchYouTubeResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(SearchResultSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		regionCode: z.string().optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

// ── Subscriptions ─────────────────────────────────────────────────────────────

const SubscriptionSnippetSchema = z.object({
	publishedAt: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	channelId: z.string().optional(),
	thumbnails: ThumbnailsSchema.optional(),
	resourceId: ResourceIdSchema.optional(),
	channelTitle: z.string().optional(),
});

const SubscriptionResourceSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: SubscriptionSnippetSchema.optional(),
		contentDetails: z
			.object({
				totalItemCount: z.number().optional(),
				newItemCount: z.number().optional(),
				activityType: z.string().optional(),
			})
			.optional(),
		subscriberSnippet: z
			.object({
				title: z.string().optional(),
				description: z.string().optional(),
				channelId: z.string().optional(),
				thumbnails: ThumbnailsSchema.optional(),
			})
			.optional(),
	})
	.passthrough();

const SubscriptionsListInputSchema = z.object({
	part: z.string().optional(),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
});

const SubscriptionsListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(SubscriptionResourceSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

const SubscriptionsSubscribeInputSchema = z.object({
	channelId: z.string().describe('The ID of the channel to subscribe to'),
});

const SubscriptionsSubscribeResponseSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: SubscriptionSnippetSchema.optional(),
		contentDetails: z
			.object({
				totalItemCount: z.number().optional(),
				newItemCount: z.number().optional(),
			})
			.optional(),
		subscriberSnippet: z
			.object({
				title: z.string().optional(),
				channelId: z.string().optional(),
			})
			.optional(),
		already_subscribed: z.boolean().optional(),
		composio_execution_message: z.string().optional(),
	})
	.passthrough();

const SubscriptionsUnsubscribeInputSchema = z.object({
	subscriptionId: z.string().describe('The ID of the subscription to remove'),
});

const SubscriptionsUnsubscribeResponseSchema = z.object({
	unsubscribed: z.boolean().optional(),
	subscription_id: z.string().optional(),
	http_status: z.number().optional(),
	error: z.string().optional(),
});

// ── Video Actions ─────────────────────────────────────────────────────────────

const VideoActionsRateInputSchema = z.object({
	id: z.string().describe('The YouTube video ID to rate'),
	rating: z.enum(['like', 'dislike', 'none']).describe('The rating to apply'),
});

const VideoActionsRateResponseSchema = z.object({
	rating: z.string().optional(),
	success: z.boolean().optional(),
	video_id: z.string().optional(),
	http_status: z.number().optional(),
});

const VideoActionsGetRatingInputSchema = z.object({
	id: z.string().describe('The YouTube video ID to get the rating for'),
	onBehalfOfContentOwner: z.string().optional(),
});

const VideoActionsGetRatingResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z
			.array(
				z.object({
					videoId: z.string().optional(),
					rating: z.string().optional(),
				}),
			)
			.optional(),
	})
	.passthrough();

const VideoActionsReportAbuseInputSchema = z.object({
	videoId: z.string().describe('The YouTube video ID to report'),
	reasonId: z.string().describe('The ID of the abuse reason'),
	comments: z
		.string()
		.optional()
		.describe('Additional comments about the abuse'),
	language: z.string().optional(),
	secondaryReasonId: z.string().optional(),
});

const VideoActionsReportAbuseResponseSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
	http_status: z.number().optional(),
});

const VideoActionsListAbuseReasonsInputSchema = z.object({
	hl: z.string().optional().describe('Language for the response'),
	part: z.string().optional(),
});

const VideoActionsListAbuseReasonsResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z
			.array(
				z.object({
					id: z.string().optional(),
					label: z.string().optional(),
					secondaryReasons: z
						.array(
							z.object({
								id: z.string().optional(),
								label: z.string().optional(),
							}),
						)
						.optional(),
				}),
			)
			.optional(),
		eventId: z.string().optional(),
		visitorId: z.string().optional(),
	})
	.passthrough();

const VideoActionsUpdateThumbnailInputSchema = z.object({
	videoId: z
		.string()
		.describe('The ID of the video to update the thumbnail for'),
	thumbnailUrl: z.string().describe('URL of the new thumbnail image'),
});

const VideoActionsUpdateThumbnailResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z
			.array(
				z.object({
					url: z.string().optional(),
					width: z.number().optional(),
					height: z.number().optional(),
				}),
			)
			.optional(),
		eventId: z.string().optional(),
		visitorId: z.string().optional(),
	})
	.passthrough();

// ── Captions ──────────────────────────────────────────────────────────────────

const CaptionResourceSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: z
			.object({
				videoId: z.string().optional(),
				lastUpdated: z.string().optional(),
				trackKind: z.string().optional(),
				language: z.string().optional(),
				name: z.string().optional(),
				audioTrackType: z.string().optional(),
				isCC: z.boolean().optional(),
				isLarge: z.boolean().optional(),
				isEasyReader: z.boolean().optional(),
				isDraft: z.boolean().optional(),
				isAutoSynced: z.boolean().optional(),
				status: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const CaptionsListInputSchema = z.object({
	video_id: z.string().describe('The YouTube video ID to list captions for'),
	part: z.string().optional(),
});

const CaptionsListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(CaptionResourceSchema).optional(),
		eventId: z.string().optional(),
		visitorId: z.string().optional(),
	})
	.passthrough();

const CaptionsUpdateInputSchema = z.object({
	id: z.string().describe('The caption track ID to update'),
	snippet: z
		.object({
			isDraft: z
				.boolean()
				.optional()
				.describe('Whether the caption track is a draft'),
		})
		.describe('Updated caption snippet'),
});

const CaptionsUpdateResponseSchema = CaptionResourceSchema;

const CaptionsLoadInputSchema = z.object({
	id: z.string().describe('The caption track ID to download'),
	tfmt: z.string().optional().describe('Caption format (srt, vtt, etc.)'),
});

const CaptionsLoadResponseSchema = z
	.object({
		captions_text: z.string().optional(),
	})
	.passthrough();

// ── Live Chat ─────────────────────────────────────────────────────────────────

const LiveChatListMessagesInputSchema = z.object({
	liveChatId: z
		.string()
		.describe('The ID of the live chat to list messages for'),
	hl: z.string().optional(),
	part: z.string().optional(),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
	profileImageSize: z.number().int().optional(),
});

const LiveChatMessageSchema = z
	.object({
		id: z.string().optional(),
		etag: z.string().optional(),
		kind: z.string().optional(),
		snippet: z
			.object({
				type: z.string().optional(),
				liveChatId: z.string().optional(),
				authorChannelId: z.string().optional(),
				publishedAt: z.string().optional(),
				hasDisplayContent: z.boolean().optional(),
				displayMessage: z.string().optional(),
				textMessageDetails: z
					.object({ messageText: z.string().optional() })
					.optional(),
			})
			.optional(),
		authorDetails: z
			.object({
				channelId: z.string().optional(),
				channelUrl: z.string().optional(),
				displayName: z.string().optional(),
				profileImageUrl: z.string().optional(),
				isVerified: z.boolean().optional(),
				isChatOwner: z.boolean().optional(),
				isChatModerator: z.boolean().optional(),
			})
			.optional(),
	})
	.passthrough();

const LiveChatListMessagesResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z.array(LiveChatMessageSchema).optional(),
		pageInfo: PageInfoSchema.optional(),
		offlineAt: z.string().optional(),
		nextPageToken: z.string().optional(),
		// activePollItem shape is undocumented and varies depending on active poll configuration
		activePollItem: z.unknown().optional(),
		pollingIntervalMillis: z.number().optional(),
	})
	.passthrough();

const LiveChatListSuperChatEventsInputSchema = z.object({
	hl: z.string().optional(),
	part: z.string().optional(),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
});

const LiveChatListSuperChatEventsResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z
			.array(
				z
					.object({
						id: z.string().optional(),
						snippet: z
							.object({
								displayString: z.string().optional(),
								amountMicros: z.string().optional(),
								currency: z.string().optional(),
								channelId: z.string().optional(),
								createdAt: z.string().optional(),
							})
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
	})
	.passthrough();

// ── i18n ──────────────────────────────────────────────────────────────────────

const I18nListLanguagesInputSchema = z.object({
	hl: z.string().optional().describe('Language to use for the response'),
	part: z.string().optional(),
});

const I18nListLanguagesResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z
			.array(
				z.object({
					id: z.string().optional(),
					etag: z.string().optional(),
					kind: z.string().optional(),
					snippet: z
						.object({ hl: z.string().optional(), name: z.string().optional() })
						.optional(),
				}),
			)
			.optional(),
	})
	.passthrough();

const I18nListRegionsInputSchema = z.object({
	hl: z.string().optional(),
	part: z.string().optional(),
});

const I18nListRegionsResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z
			.array(
				z.object({
					id: z.string().optional(),
					etag: z.string().optional(),
					kind: z.string().optional(),
					snippet: z
						.object({ gl: z.string().optional(), name: z.string().optional() })
						.optional(),
				}),
			)
			.optional(),
	})
	.passthrough();

const VideoCategoriesListInputSchema = z.object({
	hl: z.string().optional(),
	id: z.string().optional().describe('Category ID(s), comma-separated'),
	part: z.string().optional(),
	regionCode: z.string().optional(),
});

const VideoCategoriesListResponseSchema = z
	.object({
		etag: z.string().optional(),
		kind: z.string().optional(),
		items: z
			.array(
				z.object({
					id: z.string().optional(),
					etag: z.string().optional(),
					kind: z.string().optional(),
					snippet: z
						.object({
							channelId: z.string().optional(),
							title: z.string().optional(),
							assignable: z.boolean().optional(),
						})
						.optional(),
				}),
			)
			.optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

// ── Playlist Images ───────────────────────────────────────────────────────────

const PlaylistImagesListInputSchema = z.object({
	id: z.string().optional(),
	part: z.string().optional(),
	parent: z.string().optional().describe('The parent playlist ID'),
	pageToken: z.string().optional(),
	maxResults: z.number().int().optional(),
	onBehalfOfContentOwner: z.string().optional(),
	onBehalfOfContentOwnerChannel: z.string().optional(),
});

const PlaylistImagesListResponseSchema = z
	.object({
		kind: z.string().optional(),
		items: z
			.array(
				z
					.object({
						id: z.string().optional(),
						kind: z.string().optional(),
						snippet: z
							.object({
								type: z.string().optional(),
								width: z.number().optional(),
								height: z.number().optional(),
								url: z.string().optional(),
							})
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		pageInfo: PageInfoSchema.optional(),
		nextPageToken: z.string().optional(),
		prevPageToken: z.string().optional(),
	})
	.passthrough();

// ── Input/Output Maps ─────────────────────────────────────────────────────────
// YoutubeEndpointInputs and YoutubeEndpointOutputs are defined explicitly (not derived
// from the schema maps) to avoid "inferred type exceeds serialization limit" TS errors
// that occur when 51+ schemas are collected under a single `as const` object.

export type YoutubeEndpointInputs = {
	// Playlists
	playlistsList: z.infer<typeof PlaylistsListInputSchema>;
	playlistsCreate: z.infer<typeof PlaylistsCreateInputSchema>;
	playlistsUpdate: z.infer<typeof PlaylistsUpdateInputSchema>;
	playlistsDelete: z.infer<typeof PlaylistsDeleteInputSchema>;
	// Playlist Items
	playlistItemsAdd: z.infer<typeof PlaylistItemsAddInputSchema>;
	playlistItemsList: z.infer<typeof PlaylistItemsListInputSchema>;
	playlistItemsUpdate: z.infer<typeof PlaylistItemsUpdateInputSchema>;
	playlistItemsDelete: z.infer<typeof PlaylistItemsDeleteInputSchema>;
	// Videos
	videosGet: z.infer<typeof VideosGetInputSchema>;
	videosGetBatch: z.infer<typeof VideosGetBatchInputSchema>;
	videosList: z.infer<typeof VideosListInputSchema>;
	videosListMostPopular: z.infer<typeof VideosListMostPopularInputSchema>;
	videosUpdate: z.infer<typeof VideosUpdateInputSchema>;
	videosUpload: z.infer<typeof VideosUploadInputSchema>;
	videosUploadMultipart: z.infer<typeof VideosUploadMultipartInputSchema>;
	videosDelete: z.infer<typeof VideosDeleteInputSchema>;
	// Channels
	channelsGetStatistics: z.infer<typeof ChannelsGetStatisticsInputSchema>;
	channelsGetIdByHandle: z.infer<typeof ChannelsGetIdByHandleInputSchema>;
	channelsGetActivities: z.infer<typeof ChannelsGetActivitiesInputSchema>;
	channelsUpdate: z.infer<typeof ChannelsUpdateInputSchema>;
	channelSectionsList: z.infer<typeof ChannelSectionsListInputSchema>;
	channelSectionsCreate: z.infer<typeof ChannelSectionsCreateInputSchema>;
	channelSectionsUpdate: z.infer<typeof ChannelSectionsUpdateInputSchema>;
	channelSectionsDelete: z.infer<typeof ChannelSectionsDeleteInputSchema>;
	// Comments
	commentsList: z.infer<typeof CommentsListInputSchema>;
	commentThreadsList: z.infer<typeof CommentThreadsListInputSchema>;
	commentThreadsList2: z.infer<typeof CommentThreadsList2InputSchema>;
	commentsPost: z.infer<typeof CommentsPostInputSchema>;
	commentsCreateReply: z.infer<typeof CommentsCreateReplyInputSchema>;
	commentsUpdate: z.infer<typeof CommentsUpdateInputSchema>;
	commentsDelete: z.infer<typeof CommentsDeleteInputSchema>;
	commentsMarkSpam: z.infer<typeof CommentsMarkSpamInputSchema>;
	commentsSetModerationStatus: z.infer<
		typeof CommentsSetModerationStatusInputSchema
	>;
	// Search
	searchYouTube: z.infer<typeof SearchYouTubeInputSchema>;
	// Subscriptions
	subscriptionsList: z.infer<typeof SubscriptionsListInputSchema>;
	subscriptionsSubscribe: z.infer<typeof SubscriptionsSubscribeInputSchema>;
	subscriptionsUnsubscribe: z.infer<typeof SubscriptionsUnsubscribeInputSchema>;
	// Video Actions
	videoActionsRate: z.infer<typeof VideoActionsRateInputSchema>;
	videoActionsGetRating: z.infer<typeof VideoActionsGetRatingInputSchema>;
	videoActionsReportAbuse: z.infer<typeof VideoActionsReportAbuseInputSchema>;
	videoActionsListAbuseReasons: z.infer<
		typeof VideoActionsListAbuseReasonsInputSchema
	>;
	videoActionsUpdateThumbnail: z.infer<
		typeof VideoActionsUpdateThumbnailInputSchema
	>;
	// Captions
	captionsList: z.infer<typeof CaptionsListInputSchema>;
	captionsUpdate: z.infer<typeof CaptionsUpdateInputSchema>;
	captionsLoad: z.infer<typeof CaptionsLoadInputSchema>;
	// Live Chat
	liveChatListMessages: z.infer<typeof LiveChatListMessagesInputSchema>;
	liveChatListSuperChatEvents: z.infer<
		typeof LiveChatListSuperChatEventsInputSchema
	>;
	// i18n
	i18nListLanguages: z.infer<typeof I18nListLanguagesInputSchema>;
	i18nListRegions: z.infer<typeof I18nListRegionsInputSchema>;
	videoCategoriesList: z.infer<typeof VideoCategoriesListInputSchema>;
	// Playlist Images
	playlistImagesList: z.infer<typeof PlaylistImagesListInputSchema>;
};

export type YoutubeEndpointOutputs = {
	// Playlists
	playlistsList: z.infer<typeof PlaylistsListResponseSchema>;
	playlistsCreate: z.infer<typeof PlaylistsCreateResponseSchema>;
	playlistsUpdate: z.infer<typeof PlaylistsUpdateResponseSchema>;
	playlistsDelete: z.infer<typeof PlaylistsDeleteResponseSchema>;
	// Playlist Items
	playlistItemsAdd: z.infer<typeof PlaylistItemsAddResponseSchema>;
	playlistItemsList: z.infer<typeof PlaylistItemsListResponseSchema>;
	playlistItemsUpdate: z.infer<typeof PlaylistItemsUpdateResponseSchema>;
	playlistItemsDelete: z.infer<typeof PlaylistItemsDeleteResponseSchema>;
	// Videos
	videosGet: z.infer<typeof VideosGetResponseSchema>;
	videosGetBatch: z.infer<typeof VideosGetBatchResponseSchema>;
	videosList: z.infer<typeof VideosListResponseSchema>;
	videosListMostPopular: z.infer<typeof VideosListMostPopularResponseSchema>;
	videosUpdate: z.infer<typeof VideosUpdateResponseSchema>;
	videosUpload: z.infer<typeof VideosUploadResponseSchema>;
	videosUploadMultipart: z.infer<typeof VideosUploadMultipartResponseSchema>;
	videosDelete: z.infer<typeof VideosDeleteResponseSchema>;
	// Channels
	channelsGetStatistics: z.infer<typeof ChannelsGetStatisticsResponseSchema>;
	channelsGetIdByHandle: z.infer<typeof ChannelsGetIdByHandleResponseSchema>;
	channelsGetActivities: z.infer<typeof ChannelsGetActivitiesResponseSchema>;
	channelsUpdate: z.infer<typeof ChannelsUpdateResponseSchema>;
	channelSectionsList: z.infer<typeof ChannelSectionsListResponseSchema>;
	channelSectionsCreate: z.infer<typeof ChannelSectionsCreateResponseSchema>;
	channelSectionsUpdate: z.infer<typeof ChannelSectionsUpdateResponseSchema>;
	channelSectionsDelete: z.infer<typeof ChannelSectionsDeleteResponseSchema>;
	// Comments
	commentsList: z.infer<typeof CommentsListResponseSchema>;
	commentThreadsList: z.infer<typeof CommentThreadsListResponseSchema>;
	commentThreadsList2: z.infer<typeof CommentThreadsList2ResponseSchema>;
	commentsPost: z.infer<typeof CommentsPostResponseSchema>;
	commentsCreateReply: z.infer<typeof CommentsCreateReplyResponseSchema>;
	commentsUpdate: z.infer<typeof CommentsUpdateResponseSchema>;
	commentsDelete: z.infer<typeof CommentsDeleteResponseSchema>;
	commentsMarkSpam: z.infer<typeof CommentsMarkSpamResponseSchema>;
	commentsSetModerationStatus: z.infer<
		typeof CommentsSetModerationStatusResponseSchema
	>;
	// Search
	searchYouTube: z.infer<typeof SearchYouTubeResponseSchema>;
	// Subscriptions
	subscriptionsList: z.infer<typeof SubscriptionsListResponseSchema>;
	subscriptionsSubscribe: z.infer<typeof SubscriptionsSubscribeResponseSchema>;
	subscriptionsUnsubscribe: z.infer<
		typeof SubscriptionsUnsubscribeResponseSchema
	>;
	// Video Actions
	videoActionsRate: z.infer<typeof VideoActionsRateResponseSchema>;
	videoActionsGetRating: z.infer<typeof VideoActionsGetRatingResponseSchema>;
	videoActionsReportAbuse: z.infer<
		typeof VideoActionsReportAbuseResponseSchema
	>;
	videoActionsListAbuseReasons: z.infer<
		typeof VideoActionsListAbuseReasonsResponseSchema
	>;
	videoActionsUpdateThumbnail: z.infer<
		typeof VideoActionsUpdateThumbnailResponseSchema
	>;
	// Captions
	captionsList: z.infer<typeof CaptionsListResponseSchema>;
	captionsUpdate: z.infer<typeof CaptionsUpdateResponseSchema>;
	captionsLoad: z.infer<typeof CaptionsLoadResponseSchema>;
	// Live Chat
	liveChatListMessages: z.infer<typeof LiveChatListMessagesResponseSchema>;
	liveChatListSuperChatEvents: z.infer<
		typeof LiveChatListSuperChatEventsResponseSchema
	>;
	// i18n
	i18nListLanguages: z.infer<typeof I18nListLanguagesResponseSchema>;
	i18nListRegions: z.infer<typeof I18nListRegionsResponseSchema>;
	videoCategoriesList: z.infer<typeof VideoCategoriesListResponseSchema>;
	// Playlist Images
	playlistImagesList: z.infer<typeof PlaylistImagesListResponseSchema>;
};

// Schema maps annotated with Record<> to avoid "inferred type exceeds serialization limit" with 51 schemas
// ZodTypeAny used here to prevent TypeScript from serializing the full union type across all 51 schemas
export const YoutubeEndpointInputSchemas: Record<
	keyof YoutubeEndpointInputs,
	z.ZodTypeAny
> = {
	// Playlists
	playlistsList: PlaylistsListInputSchema,
	playlistsCreate: PlaylistsCreateInputSchema,
	playlistsUpdate: PlaylistsUpdateInputSchema,
	playlistsDelete: PlaylistsDeleteInputSchema,
	// Playlist Items
	playlistItemsAdd: PlaylistItemsAddInputSchema,
	playlistItemsList: PlaylistItemsListInputSchema,
	playlistItemsUpdate: PlaylistItemsUpdateInputSchema,
	playlistItemsDelete: PlaylistItemsDeleteInputSchema,
	// Videos
	videosGet: VideosGetInputSchema,
	videosGetBatch: VideosGetBatchInputSchema,
	videosList: VideosListInputSchema,
	videosListMostPopular: VideosListMostPopularInputSchema,
	videosUpdate: VideosUpdateInputSchema,
	videosUpload: VideosUploadInputSchema,
	videosUploadMultipart: VideosUploadMultipartInputSchema,
	videosDelete: VideosDeleteInputSchema,
	// Channels
	channelsGetStatistics: ChannelsGetStatisticsInputSchema,
	channelsGetIdByHandle: ChannelsGetIdByHandleInputSchema,
	channelsGetActivities: ChannelsGetActivitiesInputSchema,
	channelsUpdate: ChannelsUpdateInputSchema,
	channelSectionsList: ChannelSectionsListInputSchema,
	channelSectionsCreate: ChannelSectionsCreateInputSchema,
	channelSectionsUpdate: ChannelSectionsUpdateInputSchema,
	channelSectionsDelete: ChannelSectionsDeleteInputSchema,
	// Comments
	commentsList: CommentsListInputSchema,
	commentThreadsList: CommentThreadsListInputSchema,
	commentThreadsList2: CommentThreadsList2InputSchema,
	commentsPost: CommentsPostInputSchema,
	commentsCreateReply: CommentsCreateReplyInputSchema,
	commentsUpdate: CommentsUpdateInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	commentsMarkSpam: CommentsMarkSpamInputSchema,
	commentsSetModerationStatus: CommentsSetModerationStatusInputSchema,
	// Search
	searchYouTube: SearchYouTubeInputSchema,
	// Subscriptions
	subscriptionsList: SubscriptionsListInputSchema,
	subscriptionsSubscribe: SubscriptionsSubscribeInputSchema,
	subscriptionsUnsubscribe: SubscriptionsUnsubscribeInputSchema,
	// Video Actions
	videoActionsRate: VideoActionsRateInputSchema,
	videoActionsGetRating: VideoActionsGetRatingInputSchema,
	videoActionsReportAbuse: VideoActionsReportAbuseInputSchema,
	videoActionsListAbuseReasons: VideoActionsListAbuseReasonsInputSchema,
	videoActionsUpdateThumbnail: VideoActionsUpdateThumbnailInputSchema,
	// Captions
	captionsList: CaptionsListInputSchema,
	captionsUpdate: CaptionsUpdateInputSchema,
	captionsLoad: CaptionsLoadInputSchema,
	// Live Chat
	liveChatListMessages: LiveChatListMessagesInputSchema,
	liveChatListSuperChatEvents: LiveChatListSuperChatEventsInputSchema,
	// i18n
	i18nListLanguages: I18nListLanguagesInputSchema,
	i18nListRegions: I18nListRegionsInputSchema,
	videoCategoriesList: VideoCategoriesListInputSchema,
	// Playlist Images
	playlistImagesList: PlaylistImagesListInputSchema,
};

// ZodTypeAny used here to prevent TypeScript from serializing the full union type across all 51 schemas
export const YoutubeEndpointOutputSchemas: Record<
	keyof YoutubeEndpointOutputs,
	z.ZodTypeAny
> = {
	// Playlists
	playlistsList: PlaylistsListResponseSchema,
	playlistsCreate: PlaylistsCreateResponseSchema,
	playlistsUpdate: PlaylistsUpdateResponseSchema,
	playlistsDelete: PlaylistsDeleteResponseSchema,
	// Playlist Items
	playlistItemsAdd: PlaylistItemsAddResponseSchema,
	playlistItemsList: PlaylistItemsListResponseSchema,
	playlistItemsUpdate: PlaylistItemsUpdateResponseSchema,
	playlistItemsDelete: PlaylistItemsDeleteResponseSchema,
	// Videos
	videosGet: VideosGetResponseSchema,
	videosGetBatch: VideosGetBatchResponseSchema,
	videosList: VideosListResponseSchema,
	videosListMostPopular: VideosListMostPopularResponseSchema,
	videosUpdate: VideosUpdateResponseSchema,
	videosUpload: VideosUploadResponseSchema,
	videosUploadMultipart: VideosUploadMultipartResponseSchema,
	videosDelete: VideosDeleteResponseSchema,
	// Channels
	channelsGetStatistics: ChannelsGetStatisticsResponseSchema,
	channelsGetIdByHandle: ChannelsGetIdByHandleResponseSchema,
	channelsGetActivities: ChannelsGetActivitiesResponseSchema,
	channelsUpdate: ChannelsUpdateResponseSchema,
	channelSectionsList: ChannelSectionsListResponseSchema,
	channelSectionsCreate: ChannelSectionsCreateResponseSchema,
	channelSectionsUpdate: ChannelSectionsUpdateResponseSchema,
	channelSectionsDelete: ChannelSectionsDeleteResponseSchema,
	// Comments
	commentsList: CommentsListResponseSchema,
	commentThreadsList: CommentThreadsListResponseSchema,
	commentThreadsList2: CommentThreadsList2ResponseSchema,
	commentsPost: CommentsPostResponseSchema,
	commentsCreateReply: CommentsCreateReplyResponseSchema,
	commentsUpdate: CommentsUpdateResponseSchema,
	commentsDelete: CommentsDeleteResponseSchema,
	commentsMarkSpam: CommentsMarkSpamResponseSchema,
	commentsSetModerationStatus: CommentsSetModerationStatusResponseSchema,
	// Search
	searchYouTube: SearchYouTubeResponseSchema,
	// Subscriptions
	subscriptionsList: SubscriptionsListResponseSchema,
	subscriptionsSubscribe: SubscriptionsSubscribeResponseSchema,
	subscriptionsUnsubscribe: SubscriptionsUnsubscribeResponseSchema,
	// Video Actions
	videoActionsRate: VideoActionsRateResponseSchema,
	videoActionsGetRating: VideoActionsGetRatingResponseSchema,
	videoActionsReportAbuse: VideoActionsReportAbuseResponseSchema,
	videoActionsListAbuseReasons: VideoActionsListAbuseReasonsResponseSchema,
	videoActionsUpdateThumbnail: VideoActionsUpdateThumbnailResponseSchema,
	// Captions
	captionsList: CaptionsListResponseSchema,
	captionsUpdate: CaptionsUpdateResponseSchema,
	captionsLoad: CaptionsLoadResponseSchema,
	// Live Chat
	liveChatListMessages: LiveChatListMessagesResponseSchema,
	liveChatListSuperChatEvents: LiveChatListSuperChatEventsResponseSchema,
	// i18n
	i18nListLanguages: I18nListLanguagesResponseSchema,
	i18nListRegions: I18nListRegionsResponseSchema,
	videoCategoriesList: VideoCategoriesListResponseSchema,
	// Playlist Images
	playlistImagesList: PlaylistImagesListResponseSchema,
};

// ── Named Type Aliases ────────────────────────────────────────────────────────

export type PlaylistsListInput = YoutubeEndpointInputs['playlistsList'];
export type PlaylistsListResponse = YoutubeEndpointOutputs['playlistsList'];
export type PlaylistsCreateInput = YoutubeEndpointInputs['playlistsCreate'];
export type PlaylistsCreateResponse = YoutubeEndpointOutputs['playlistsCreate'];
export type PlaylistsUpdateInput = YoutubeEndpointInputs['playlistsUpdate'];
export type PlaylistsUpdateResponse = YoutubeEndpointOutputs['playlistsUpdate'];
export type PlaylistsDeleteInput = YoutubeEndpointInputs['playlistsDelete'];
export type PlaylistsDeleteResponse = YoutubeEndpointOutputs['playlistsDelete'];

export type PlaylistItemsAddInput = YoutubeEndpointInputs['playlistItemsAdd'];
export type PlaylistItemsAddResponse =
	YoutubeEndpointOutputs['playlistItemsAdd'];
export type PlaylistItemsListInput = YoutubeEndpointInputs['playlistItemsList'];
export type PlaylistItemsListResponse =
	YoutubeEndpointOutputs['playlistItemsList'];
export type PlaylistItemsUpdateInput =
	YoutubeEndpointInputs['playlistItemsUpdate'];
export type PlaylistItemsUpdateResponse =
	YoutubeEndpointOutputs['playlistItemsUpdate'];
export type PlaylistItemsDeleteInput =
	YoutubeEndpointInputs['playlistItemsDelete'];
export type PlaylistItemsDeleteResponse =
	YoutubeEndpointOutputs['playlistItemsDelete'];

export type VideosGetInput = YoutubeEndpointInputs['videosGet'];
export type VideosGetResponse = YoutubeEndpointOutputs['videosGet'];
export type VideosGetBatchInput = YoutubeEndpointInputs['videosGetBatch'];
export type VideosGetBatchResponse = YoutubeEndpointOutputs['videosGetBatch'];
export type VideosListInput = YoutubeEndpointInputs['videosList'];
export type VideosListResponse = YoutubeEndpointOutputs['videosList'];
export type VideosListMostPopularInput =
	YoutubeEndpointInputs['videosListMostPopular'];
export type VideosListMostPopularResponse =
	YoutubeEndpointOutputs['videosListMostPopular'];
export type VideosUpdateInput = YoutubeEndpointInputs['videosUpdate'];
export type VideosUpdateResponse = YoutubeEndpointOutputs['videosUpdate'];
export type VideosUploadInput = YoutubeEndpointInputs['videosUpload'];
export type VideosUploadResponse = YoutubeEndpointOutputs['videosUpload'];
export type VideosUploadMultipartInput =
	YoutubeEndpointInputs['videosUploadMultipart'];
export type VideosUploadMultipartResponse =
	YoutubeEndpointOutputs['videosUploadMultipart'];
export type VideosDeleteInput = YoutubeEndpointInputs['videosDelete'];
export type VideosDeleteResponse = YoutubeEndpointOutputs['videosDelete'];

export type ChannelsGetStatisticsInput =
	YoutubeEndpointInputs['channelsGetStatistics'];
export type ChannelsGetStatisticsResponse =
	YoutubeEndpointOutputs['channelsGetStatistics'];
export type ChannelsGetIdByHandleInput =
	YoutubeEndpointInputs['channelsGetIdByHandle'];
export type ChannelsGetIdByHandleResponse =
	YoutubeEndpointOutputs['channelsGetIdByHandle'];
export type ChannelsGetActivitiesInput =
	YoutubeEndpointInputs['channelsGetActivities'];
export type ChannelsGetActivitiesResponse =
	YoutubeEndpointOutputs['channelsGetActivities'];
export type ChannelsUpdateInput = YoutubeEndpointInputs['channelsUpdate'];
export type ChannelsUpdateResponse = YoutubeEndpointOutputs['channelsUpdate'];
export type ChannelSectionsListInput =
	YoutubeEndpointInputs['channelSectionsList'];
export type ChannelSectionsListResponse =
	YoutubeEndpointOutputs['channelSectionsList'];
export type ChannelSectionsCreateInput =
	YoutubeEndpointInputs['channelSectionsCreate'];
export type ChannelSectionsCreateResponse =
	YoutubeEndpointOutputs['channelSectionsCreate'];
export type ChannelSectionsUpdateInput =
	YoutubeEndpointInputs['channelSectionsUpdate'];
export type ChannelSectionsUpdateResponse =
	YoutubeEndpointOutputs['channelSectionsUpdate'];
export type ChannelSectionsDeleteInput =
	YoutubeEndpointInputs['channelSectionsDelete'];
export type ChannelSectionsDeleteResponse =
	YoutubeEndpointOutputs['channelSectionsDelete'];

export type CommentsListInput = YoutubeEndpointInputs['commentsList'];
export type CommentsListResponse = YoutubeEndpointOutputs['commentsList'];
export type CommentThreadsListInput =
	YoutubeEndpointInputs['commentThreadsList'];
export type CommentThreadsListResponse =
	YoutubeEndpointOutputs['commentThreadsList'];
export type CommentThreadsList2Input =
	YoutubeEndpointInputs['commentThreadsList2'];
export type CommentThreadsList2Response =
	YoutubeEndpointOutputs['commentThreadsList2'];
export type CommentsPostInput = YoutubeEndpointInputs['commentsPost'];
export type CommentsPostResponse = YoutubeEndpointOutputs['commentsPost'];
export type CommentsCreateReplyInput =
	YoutubeEndpointInputs['commentsCreateReply'];
export type CommentsCreateReplyResponse =
	YoutubeEndpointOutputs['commentsCreateReply'];
export type CommentsUpdateInput = YoutubeEndpointInputs['commentsUpdate'];
export type CommentsUpdateResponse = YoutubeEndpointOutputs['commentsUpdate'];
export type CommentsDeleteInput = YoutubeEndpointInputs['commentsDelete'];
export type CommentsDeleteResponse = YoutubeEndpointOutputs['commentsDelete'];
export type CommentsMarkSpamInput = YoutubeEndpointInputs['commentsMarkSpam'];
export type CommentsMarkSpamResponse =
	YoutubeEndpointOutputs['commentsMarkSpam'];
export type CommentsSetModerationStatusInput =
	YoutubeEndpointInputs['commentsSetModerationStatus'];
export type CommentsSetModerationStatusResponse =
	YoutubeEndpointOutputs['commentsSetModerationStatus'];

export type SearchYouTubeInput = YoutubeEndpointInputs['searchYouTube'];
export type SearchYouTubeResponse = YoutubeEndpointOutputs['searchYouTube'];

export type SubscriptionsListInput = YoutubeEndpointInputs['subscriptionsList'];
export type SubscriptionsListResponse =
	YoutubeEndpointOutputs['subscriptionsList'];
export type SubscriptionsSubscribeInput =
	YoutubeEndpointInputs['subscriptionsSubscribe'];
export type SubscriptionsSubscribeResponse =
	YoutubeEndpointOutputs['subscriptionsSubscribe'];
export type SubscriptionsUnsubscribeInput =
	YoutubeEndpointInputs['subscriptionsUnsubscribe'];
export type SubscriptionsUnsubscribeResponse =
	YoutubeEndpointOutputs['subscriptionsUnsubscribe'];

export type VideoActionsRateInput = YoutubeEndpointInputs['videoActionsRate'];
export type VideoActionsRateResponse =
	YoutubeEndpointOutputs['videoActionsRate'];
export type VideoActionsGetRatingInput =
	YoutubeEndpointInputs['videoActionsGetRating'];
export type VideoActionsGetRatingResponse =
	YoutubeEndpointOutputs['videoActionsGetRating'];
export type VideoActionsReportAbuseInput =
	YoutubeEndpointInputs['videoActionsReportAbuse'];
export type VideoActionsReportAbuseResponse =
	YoutubeEndpointOutputs['videoActionsReportAbuse'];
export type VideoActionsListAbuseReasonsInput =
	YoutubeEndpointInputs['videoActionsListAbuseReasons'];
export type VideoActionsListAbuseReasonsResponse =
	YoutubeEndpointOutputs['videoActionsListAbuseReasons'];
export type VideoActionsUpdateThumbnailInput =
	YoutubeEndpointInputs['videoActionsUpdateThumbnail'];
export type VideoActionsUpdateThumbnailResponse =
	YoutubeEndpointOutputs['videoActionsUpdateThumbnail'];

export type CaptionsListInput = YoutubeEndpointInputs['captionsList'];
export type CaptionsListResponse = YoutubeEndpointOutputs['captionsList'];
export type CaptionsUpdateInput = YoutubeEndpointInputs['captionsUpdate'];
export type CaptionsUpdateResponse = YoutubeEndpointOutputs['captionsUpdate'];
export type CaptionsLoadInput = YoutubeEndpointInputs['captionsLoad'];
export type CaptionsLoadResponse = YoutubeEndpointOutputs['captionsLoad'];

export type LiveChatListMessagesInput =
	YoutubeEndpointInputs['liveChatListMessages'];
export type LiveChatListMessagesResponse =
	YoutubeEndpointOutputs['liveChatListMessages'];
export type LiveChatListSuperChatEventsInput =
	YoutubeEndpointInputs['liveChatListSuperChatEvents'];
export type LiveChatListSuperChatEventsResponse =
	YoutubeEndpointOutputs['liveChatListSuperChatEvents'];

export type I18nListLanguagesInput = YoutubeEndpointInputs['i18nListLanguages'];
export type I18nListLanguagesResponse =
	YoutubeEndpointOutputs['i18nListLanguages'];
export type I18nListRegionsInput = YoutubeEndpointInputs['i18nListRegions'];
export type I18nListRegionsResponse = YoutubeEndpointOutputs['i18nListRegions'];
export type VideoCategoriesListInput =
	YoutubeEndpointInputs['videoCategoriesList'];
export type VideoCategoriesListResponse =
	YoutubeEndpointOutputs['videoCategoriesList'];

export type PlaylistImagesListInput =
	YoutubeEndpointInputs['playlistImagesList'];
export type PlaylistImagesListResponse =
	YoutubeEndpointOutputs['playlistImagesList'];
