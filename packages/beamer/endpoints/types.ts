import { z } from 'zod';

const IntegerFromStringOrNumber = z
	.union([z.number(), z.string().regex(/^-?\d+$/)])
	.transform((value) => (typeof value === 'string' ? Number(value) : value))
	.pipe(z.number().int());

export const PostsGetInputSchema = z.object({
	page: IntegerFromStringOrNumber.pipe(z.number().int().positive()).optional(),
	maxResults: IntegerFromStringOrNumber.pipe(
		z.number().int().positive().max(10),
	).optional(),
});

export type PostsGetInput = z.infer<typeof PostsGetInputSchema>;

const BeamerBooleanSchema = z.union([
	z.boolean(),
	z.literal('true').transform(() => true),
	z.literal('false').transform(() => false),
]);

const BeamerLinkSchema = z.union([z.string(), z.array(z.string())]);

const BeamerTranslationSchema = z
	.object({
		title: z.string().optional(),
		content: z.string().optional(),
		contentHtml: z.string().optional(),
		language: z.string().optional(),
		category: z.string().optional(),
		linkUrl: BeamerLinkSchema.optional(),
		linkText: BeamerLinkSchema.optional(),
		images: z.array(z.string()).optional(),
	})
	.loose();

const BeamerPostSchema = z
	.object({
		id: IntegerFromStringOrNumber,
		date: z.string().optional(),
		dueDate: z.string().optional(),
		published: BeamerBooleanSchema.optional(),
		pinned: BeamerBooleanSchema.optional(),
		showInWidget: BeamerBooleanSchema.optional(),
		showInStandalone: BeamerBooleanSchema.optional(),
		category: z.string().optional(),
		boostedAnnouncement: z.string().optional(),
		translations: z.array(BeamerTranslationSchema).optional(),
		filter: z.string().optional(),
		filterUrl: z.string().optional(),
		autoOpen: BeamerBooleanSchema.optional(),
		editionDate: z.string().optional(),
		feedbackEnabled: BeamerBooleanSchema.optional(),
		reactionsEnabled: BeamerBooleanSchema.optional(),
		views: IntegerFromStringOrNumber.optional(),
		uniqueViews: IntegerFromStringOrNumber.optional(),
		clicks: IntegerFromStringOrNumber.optional(),
		feedbacks: IntegerFromStringOrNumber.optional(),
		positiveReactions: IntegerFromStringOrNumber.optional(),
		neutralReactions: IntegerFromStringOrNumber.optional(),
		negativeReactions: IntegerFromStringOrNumber.optional(),
	})
	.loose();

export const PostsGetResponseSchema = z.array(BeamerPostSchema);

export type PostsGetResponse = z.infer<typeof PostsGetResponseSchema>;

export type BeamerEndpointInputs = {
	postsGet: PostsGetInput;
};

export type BeamerEndpointOutputs = {
	postsGet: PostsGetResponse;
};

export const BeamerEndpointInputSchemas = {
	postsGet: PostsGetInputSchema,
} as const;

export const BeamerEndpointOutputSchemas = {
	postsGet: PostsGetResponseSchema,
} as const;
