import { z } from 'zod';

const PostsGetInputSchema = z.object({
	page: z.coerce.number().int().positive().optional(),
	limit: z.coerce.number().int().positive().max(100).optional(),
});

export type PostsGetInput = z.infer<typeof PostsGetInputSchema>;

const PostsGetResponseSchema = z.unknown();

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
