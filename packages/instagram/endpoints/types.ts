import { z } from "zod";

// import type {
//     InstagramMediaResponse,
//     InstagramCommentResponse,
//     InstagramConversationResponse,
//     InstagramMessageResponse
// } from "../schema/database"

import {
    FacebookPagesResponseSchema,
    InstagramUser
} from "../schema/database"

// input schema
const GetFacebookUserInputSchema = z.object({
    id: z.string().optional()
});
const GetFacebookPagesInputSchema = z.object({
    q: z.string().optional()
});
const GetInstagramUserInputSchema = z.object({
    ig_id: z.string(),
    q: z.string().optional()
});
const GetInstagramMediaListInputSchema = z.object({
    ig_id: z.string(),
    q: z.string().optional()
});
const GetInstagramMediaInputSchema = z.object({
    media_id: z.string(),
    q: z.string().optional()
});
const CreateImageContainerInputSchema = z.object({
  ig_id: z.string(),
  image_url: z.url(),

  caption: z.string().optional(),
  alt_text: z.string().optional(),
  is_carousel_item: z.boolean().optional(),

  location_id: z.string().optional(),

  user_tags: z.array(
    z.object({
      username: z.string(),
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
  ).optional(),

  product_tags: z.array(
    z.object({
      product_id: z.string(),
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
  ).optional(),
});
const PublishInstagramMediaInputSchema = z.object({
  ig_id: z.string(),
  creation_id: z.string(),
});
const CreateReelContainerInputSchema = z.object({
  ig_id: z.string(),
  video_url: z.url(),

  media_type: z.string(),
  caption: z.string().optional(),

  share_to_feed: z.boolean().optional(),

  collaborators: z.array(z.string()).optional(),

  cover_url: z.url().optional(),

  audio_name: z.string().optional(),

  thumb_offset: z.number().optional(),

  location_id: z.string().optional(),

  user_tags: z.array(
    z.object({
      username: z.string(),
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
  ).optional(),

  trial_params: z.unknown().optional(),
});
const GetMediaContainerStatusInputSchema = z.object({
  container_id: z.string(),
});
const CreateImageStoryContainerinputSchema = z.object({
    ig_id: z.string(),
    image_url: z.url(),
    media_type: z.string(),
    user_tags: z.array(z.string()).optional(),
});
const CreateVideoStoryContainerinputSchema = z.object({
    ig_id: z.string(),
    video_url: z.url(),
    media_type: z.string(),
    user_tags: z.array(z.string()).optional(),
});
const CreateCarouselContainerInputSchema = z.object({
    ig_id: z.string(),
  children: z
    .array(z.string())
    .min(2, 'Carousel must contain at least 2 media items'),

    media_type: z.string(),

  caption: z.string().optional(),

  share_to_feed: z.boolean().optional(),

  collaborators: z.array(z.string()).optional(),

  location_id: z.string().optional(),

  product_tags: z
    .array(
      z.object({
        product_id: z.string(),
      })
    )
    .optional(),
});
const CreateVideoContainerInputSchema = z.object({
  ig_id: z.string(),
  video_url: z.url(),
  media_type: z.literal('VIDEO'),

  caption: z.string().optional(),
  alt_text: z.string().optional(),
  is_carousel_item: z.boolean().optional(),

  location_id: z.string().optional(),

  user_tags: z.array(
    z.object({
      username: z.string(),
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
  ).optional(),

  product_tags: z.array(
    z.object({
      product_id: z.string(),
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
  ).optional(),
});
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
const GetMediaInsightsInputSchema = z.object({
    media_id: z.string(),
    type: z.enum(['IMAGE', 'VIDEO', 'REELS', 'STORY', 'CAROUSEL_ALBUM']),
    metric: z.string().optional()
})
const GetAccountInsightsInputSchema = z.object({
    ig_id: z.string(),
    metric: z.string().min(1),
    period: z.string(),
    timeframe: z.string().optional().describe('Required for demographics-related metrics. Designates how far to look back for data. See Timeframe.'),
    metric_type: z.string().optional(),
    breakdown: z.string().optional(),
    since: z.string().optional(),
    until: z.string().optional()
})

export const InstagramEndpointInputSchemas = {
    GetFacebookUser: GetFacebookUserInputSchema, 
    GetFacebookPages: GetFacebookPagesInputSchema,
    GetInstagramUser: GetInstagramUserInputSchema,
    GetInstagramMediaList: GetInstagramMediaListInputSchema,
    GetInstagramMedia: GetInstagramMediaInputSchema,
    CreateImageContainer: CreateImageContainerInputSchema, // for Image post
    CreateReelContainer: CreateReelContainerInputSchema, // for reels
    CreateImageStoryContainer: CreateImageStoryContainerinputSchema,
    PublishInstagramMedia: PublishInstagramMediaInputSchema,
    CreateVideoStoryContainer: CreateVideoStoryContainerinputSchema,
    CreateCarouselContainer: CreateCarouselContainerInputSchema,
    CreateVideoContainer: CreateVideoContainerInputSchema,
    GetMediaContainerStatus: GetMediaContainerStatusInputSchema, 
    GetMediaInsights: GetMediaInsightsInputSchema, 
    GetAccountInsights: GetAccountInsightsInputSchema
} as const;

export type InstagramEndpointInputs = {
	[K in keyof typeof InstagramEndpointInputSchemas]: z.infer<
		(typeof InstagramEndpointInputSchemas)[K]
	>;
};

// output schema

const MetaPagination = z.object({
    cursors: z.object({
        before: z.string().optional(),
        after: z.string().optional(),
    }).optional(),
    next: z.url().optional(),
}).optional();

const GetFacebookUserOutputSchema = z.object({
    name: z.string().optional(),
    id: z.string()
});
const GetFacebookPagesOutputSchema = FacebookPagesResponseSchema;
const GetInstagramUserOutputSchema = InstagramUser;

const InstagramMediaType = z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']);
export const InstagramMedia = z.object({
    id: z.string(),
    caption: z.string().optional(),
    media_type: InstagramMediaType,
    media_url: z.url().nullable().optional(),
    thumbnail_url: z.url().nullable().optional(),
    permalink: z.url(),
    timestamp: z.iso.datetime(), // Validates strict ISO 8601 strings
    username: z.string(),
    like_count: z.number().default(0),
    comments_count: z.number().default(0),
    is_comment_enabled: z.boolean(),

    // Handles the nested structural edge for Carousel sub-items
    children: z.object({
        data: z.array(z.object({
            id: z.string(),
            media_type: z.enum(['IMAGE', 'VIDEO']),
            media_url: z.url(),
        }))
    }).optional(),

    createdAt: z.coerce.date().nullable().optional(),
    updatedAt: z.coerce.date().nullable().optional(),
});
const GetInstagramMediaListOutputSchema = z.object({
    data: z.array(InstagramMedia),
    paging: MetaPagination,
});
const CreateInstagramMediaOutputSchema = z.object({
  id: z.string(),
});
const GetMediaContainerStatusOutputSchema = z.object({
    id: z.string(),
    status_code: z.enum([
      "IN_PROGRESS",
      "FINISHED",
      "ERROR",
      "EXPIRED",
    ]),
});
const GetMediaInsightsOutputSchema = z.object({
  data: z.array(z.record(z.string(), z.any())),
});
const GetAccountInsightsOutputSchema = GetMediaInsightsOutputSchema;

export type GetFacebookUserOutputSchema = z.infer<typeof GetFacebookUserOutputSchema>
export type GetFacebookPagesOutputSchema = z.infer<typeof GetFacebookPagesOutputSchema>
export type GetInstagramUserOutputSchema = z.infer<typeof GetInstagramUserOutputSchema>
export type GetInstagramMediaOutputSchema = z.infer<typeof GetInstagramMediaListOutputSchema>
export type GetInstagramMediaOutputchema = z.infer<typeof InstagramMedia>
export type CreateInstagramMediaOutputSchema = z.infer<typeof CreateInstagramMediaOutputSchema>
export type GetMediaContainerStatusOutputSchema = z.infer<typeof GetMediaContainerStatusOutputSchema>
export type GetMediaInsightsOutputSchema = z.infer<typeof GetMediaInsightsOutputSchema>
export type GetAccountInsightsOutputSchema = z.infer<typeof GetAccountInsightsOutputSchema>
export type media = keyof typeof MEDIA_TYPE_METRICS

export const InstagramEndpointOutputSchemas = {
    GetFacebookUser: GetFacebookUserOutputSchema,
    GetFacebookPages: GetFacebookPagesOutputSchema,
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
    GetAccountInsights: GetAccountInsightsOutputSchema
} as const;

export type InstagramEndpointOutputs = {
	GetFacebookUser: GetFacebookUserOutputSchema,
    GetFacebookPages: GetFacebookPagesOutputSchema,
    GetInstagramUser: GetInstagramUserOutputSchema,
    GetInstagramMediaList: GetInstagramMediaOutputSchema,
    GetInstagramMedia: GetInstagramMediaOutputchema,
    CreateImageContainer: CreateInstagramMediaOutputSchema,
    CreateReelContainer: CreateInstagramMediaOutputSchema,
    PublishInstagramMedia: CreateInstagramMediaOutputSchema,
    CreateImageStoryContainer: CreateInstagramMediaOutputSchema,
    CreateVideoStoryContainer: CreateInstagramMediaOutputSchema,
    CreateCarouselContainer: CreateInstagramMediaOutputSchema,
    CreateVideoContainer: CreateInstagramMediaOutputSchema,
    GetMediaContainerStatus: GetMediaContainerStatusOutputSchema,
    GetMediaInsights: GetMediaInsightsOutputSchema,
    GetAccountInsights: GetAccountInsightsOutputSchema
};