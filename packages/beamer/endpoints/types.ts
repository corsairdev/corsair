import { z } from 'zod';

const PostsGetInputSchema = z.object({
	page: z.coerce.number().int().positive().optional(),
	limit: z.coerce.number().int().positive().max(100).optional(),
});

export type PostsGetInput = z.infer<typeof PostsGetInputSchema>;

const BeamerBooleanSchema = z.union([
	z.boolean(),
	z.literal('true').transform(() => true),
	z.literal('false').transform(() => false),
]);

const BeamerTranslationSchema = z.object({
	title: z.string(),
	content: z.string(),
	contentHtml: z.string(),
	language: z.string(),
	category: z.string(),
	linkUrl: z.string(),
	linkText: z.string(),
	images: z.array(z.string()),
});

const BeamerPostSchema = z.object({
	id: z.coerce.number().int(),
	date: z.string(),
	dueDate: z.string(),
	published: BeamerBooleanSchema,
	pinned: BeamerBooleanSchema,
	showInWidget: BeamerBooleanSchema,
	showInStandalone: BeamerBooleanSchema,
	category: z.string(),
	boostedAnnouncement: z.string(),
	translations: z.array(BeamerTranslationSchema),
	filter: z.string(),
	filterUrl: z.string(),
	autoOpen: BeamerBooleanSchema,
	editionDate: z.string(),
	feedbackEnabled: BeamerBooleanSchema,
	reactionsEnabled: BeamerBooleanSchema,
	views: z.coerce.number().int(),
	uniqueViews: z.coerce.number().int(),
	clicks: z.coerce.number().int(),
	feedbacks: z.coerce.number().int(),
	positiveReactions: z.coerce.number().int(),
	neutralReactions: z.coerce.number().int(),
	negativeReactions: z.coerce.number().int(),
});

const PostsGetResponseSchema = z.array(BeamerPostSchema);

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
