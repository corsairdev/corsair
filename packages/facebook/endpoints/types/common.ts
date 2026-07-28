import { z } from 'zod';

export const MetaPaginationSchema = z
	.object({
		cursors: z
			.object({
				before: z.string().optional(),
				after: z.string().optional(),
			})
			.optional(),
		next: z.string().optional(),
		previous: z.string().optional(),
	})
	.optional();

export const GraphIdResponseSchema = z.object({
	id: z.string(),
});

export const GraphSuccessResponseSchema = z.object({
	success: z.boolean(),
});

export const FacebookUserSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
});

export const FacebookPageSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	access_token: z.string().optional(),
	category: z.string().optional(),
	category_list: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
			}),
		)
		.optional(),
	tasks: z.array(z.string()).optional(),
	about: z.string().optional(),
	link: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),
	emails: z.array(z.string()).optional(),
	picture: z
		.object({
			data: z
				.object({
					url: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
});

export const FacebookPagesListSchema = z.object({
	data: z.array(FacebookPageSchema),
	paging: MetaPaginationSchema,
});

export const FacebookPostSchema = z
	.object({
		id: z.string(),
		message: z.string().optional(),
		created_time: z.string().optional(),
		updated_time: z.string().optional(),
		is_published: z.boolean().optional(),
		scheduled_publish_time: z.number().optional(),
		status_type: z.string().optional(),
		permalink_url: z.string().optional(),
		full_picture: z.string().optional(),
	})
	.passthrough();

export const FacebookPostsListSchema = z.object({
	data: z.array(FacebookPostSchema),
	paging: MetaPaginationSchema,
});

export const FacebookCommentSchema = z
	.object({
		id: z.string(),
		message: z.string().optional(),
		created_time: z.string().optional(),
		from: z
			.object({
				id: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
		is_hidden: z.boolean().optional(),
		like_count: z.number().optional(),
		comment_count: z.number().optional(),
	})
	.passthrough();

export const FacebookCommentsListSchema = z.object({
	data: z.array(FacebookCommentSchema),
	paging: MetaPaginationSchema,
});

export const FacebookReactionSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough();

export const FacebookReactionsListSchema = z.object({
	data: z.array(FacebookReactionSchema),
	paging: MetaPaginationSchema,
});

export const FacebookPhotoSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		created_time: z.string().optional(),
		source: z.string().optional(),
		link: z.string().optional(),
		images: z
			.array(
				z.object({
					height: z.number().optional(),
					width: z.number().optional(),
					source: z.string().optional(),
				}),
			)
			.optional(),
	})
	.passthrough();

export const FacebookPhotosListSchema = z.object({
	data: z.array(FacebookPhotoSchema),
	paging: MetaPaginationSchema,
});

export const FacebookAlbumSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
		created_time: z.string().optional(),
		count: z.number().optional(),
		link: z.string().optional(),
	})
	.passthrough();

export const FacebookVideoSchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
		created_time: z.string().optional(),
		source: z.string().optional(),
		length: z.number().optional(),
		permalink_url: z.string().optional(),
		status: z
			.object({
				video_status: z.string().optional(),
				processing_progress: z.number().optional(),
			})
			.optional(),
	})
	.passthrough();

export const FacebookVideosListSchema = z.object({
	data: z.array(FacebookVideoSchema),
	paging: MetaPaginationSchema,
});

export const FacebookConversationSchema = z
	.object({
		id: z.string(),
		link: z.string().optional(),
		updated_time: z.string().optional(),
		message_count: z.number().optional(),
		unread_count: z.number().optional(),
		snippet: z.string().optional(),
		participants: z
			.object({
				data: z
					.array(
						z.object({
							id: z.string().optional(),
							name: z.string().optional(),
							email: z.string().optional(),
						}),
					)
					.optional(),
			})
			.optional(),
	})
	.passthrough();

export const FacebookConversationsListSchema = z.object({
	data: z.array(FacebookConversationSchema),
	paging: MetaPaginationSchema,
});

export const FacebookMessageSchema = z
	.object({
		id: z.string(),
		message: z.string().optional(),
		created_time: z.string().optional(),
		from: z
			.object({
				id: z.string().optional(),
				name: z.string().optional(),
				email: z.string().optional(),
			})
			.optional(),
		to: z
			.object({
				data: z
					.array(
						z.object({
							id: z.string().optional(),
							name: z.string().optional(),
							email: z.string().optional(),
						}),
					)
					.optional(),
			})
			.optional(),
		attachments: z
			.object({
				data: z.array(z.record(z.string(), z.unknown())).optional(),
			})
			.optional(),
	})
	.passthrough();

export const FacebookMessagesListSchema = z.object({
	data: z.array(FacebookMessageSchema),
	paging: MetaPaginationSchema,
});

export const FacebookInsightValueSchema = z.object({
	value: z.union([z.number(), z.string(), z.record(z.string(), z.unknown())]),
	end_time: z.string().optional(),
});

export const FacebookInsightSchema = z.object({
	name: z.string(),
	period: z.string().optional(),
	values: z.array(FacebookInsightValueSchema).optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	id: z.string().optional(),
});

export const FacebookInsightsListSchema = z.object({
	data: z.array(FacebookInsightSchema),
	paging: MetaPaginationSchema,
});

export const FacebookPageRoleSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		role: z.string().optional(),
	})
	.passthrough();

export const FacebookPageRolesListSchema = z.object({
	data: z.array(FacebookPageRoleSchema),
	paging: MetaPaginationSchema,
});

export const FacebookMessengerActionResponseSchema = z.object({
	recipient_id: z.string().optional(),
	message_id: z.string().optional(),
});

export const FacebookBatchItemResponseSchema = z.object({
	code: z.number(),
	headers: z
		.array(z.object({ name: z.string(), value: z.string() }))
		.optional(),
	body: z.string().optional(),
});

export const FacebookBatchResponseSchema = z.array(
	FacebookBatchItemResponseSchema,
);

export const PaginationInputSchema = z.object({
	fields: z.string().optional(),
	limit: z.number().int().positive().max(100).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});

export const PageIdInputSchema = z.object({
	page_id: z.string().describe('Facebook Page ID'),
});

export const ReactionTypeSchema = z.enum([
	'LIKE',
	'LOVE',
	'WOW',
	'HAHA',
	'SAD',
	'ANGRY',
	'CARE',
]);

export type MetaPagination = z.infer<typeof MetaPaginationSchema>;
export type GraphIdResponse = z.infer<typeof GraphIdResponseSchema>;
export type GraphSuccessResponse = z.infer<typeof GraphSuccessResponseSchema>;
