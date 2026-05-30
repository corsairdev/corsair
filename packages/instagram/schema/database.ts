import { z } from "zod";

const MetaPagination = z.object({
    cursors: z.object({
        before: z.string().optional(),
        after: z.string().optional(),
    }).optional(),
    next: z.url().optional(),
}).optional();

export const InstagramUser = z.object({
    id: z.string(),
    ig_id: z.number(),
    username: z.string(),
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

export const InstagramMediaType = z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']);

export const InstagramMedia = z.object({
    id: z.string(),
    caption: z.string().nullable().optional(),
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

export const InstagramComment = z.object({
    id: z.string(),
    text: z.string(),
    timestamp: z.iso.datetime(),
    username: z.string(),
    like_count: z.number().default(0),
    hidden: z.boolean().optional(),

    // Single-level nested edge array for comment replies
    replies: z.object({
        data: z.array(z.object({
            id: z.string(),
            text: z.string(),
            timestamp: z.iso.datetime(),
            username: z.string(),
            like_count: z.number().default(0),
        }))
    }).optional(),

    createdAt: z.coerce.date().nullable().optional(),
    updatedAt: z.coerce.date().nullable().optional(),
});

export const FacebookPageSchema = z.object({
    access_token: z.string().describe('Page Access Token'),
    category: z.string(),
    category_list: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
            })
        )
        .optional(),

    name: z.string(),
    id: z.string().describe('Facebook Page ID'),

    tasks: z.array(z.string()),
});

export const FacebookPagesResponseSchema = z.object({
    data: z.array(FacebookPageSchema),
    paging: MetaPagination
});

export const InstagramConversation = z.object({
  id: z.string(),

  name: z.string().optional(),
  updated_time: z.string().optional(),
  message_count: z.number().optional(),
  unread_count: z.number().optional(),
  snippet: z.string().optional(),

  can_reply: z.boolean().optional(),
  is_subscribed: z.boolean().optional(),

  participants: z.object({
    data: z.array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
      })
    ),
  }).optional(),

  senders: z.object({
    data: z.array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
      })
    ),
  }).optional(),

  tags: z.array(z.string()).optional(),
});

export const InstagramMessage = z.object({
    id: z.string(),
    created_time: z.string().optional(),
    message: z.string().optional(),
    from: z.object({
        id: z.string(),
        username: z.string().optional(),
    }).optional(),
    to: z.object({
        data: z.array(
            z.object({
                id: z.string(),
                username: z.string().optional(),
            })
        ),
    }).optional(),
});

export const InstagramMediaResponse = z.object({
    data: z.array(InstagramMedia),
    paging: MetaPagination,
});

export const InstagramCommentResponse = z.object({
    data: z.array(InstagramComment),
    paging: MetaPagination,
});

export const InstagramConversationResponse = z.object({
    data: z.array(InstagramConversation),
});

export const InstagramMessageResponse = z.object({
    data: z.array(InstagramMessage),
});

export type InstagramUser = z.infer<typeof InstagramUser>
export type InstagramMedia = z.infer<typeof InstagramMedia>;
export type InstagramComment = z.infer<typeof InstagramComment>;
export type FacebookPageSchema = z.infer<typeof FacebookPageSchema>;
export type InstagramConversation = z.infer<typeof InstagramConversation>
export type InstagramMessage = z.infer<typeof InstagramMessage>
export type InstagramMediaResponse = z.infer<typeof InstagramMediaResponse>
export type InstagramCommentResponse = z.infer<typeof InstagramCommentResponse>
export type InstagramConversationResponse = z.infer<typeof InstagramConversationResponse>
export type InstagramMessageResponse = z.infer<typeof InstagramMessageResponse>