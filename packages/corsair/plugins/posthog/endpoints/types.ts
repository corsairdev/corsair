import { z } from 'zod';


const PostHogSuccessResponseSchema = z.union([
	z.number(),
	z.string(),
	z
		.object({
			status: z.union([z.number(), z.string()]).optional(),
			message: z.string().optional(),
		})
		.passthrough(),
	z.any(),
]);

export const PostHogEndpointOutputSchemas = {
	aliasCreate: PostHogSuccessResponseSchema,
	eventCreate: PostHogSuccessResponseSchema,
	identityCreate: PostHogSuccessResponseSchema,
	trackPage: PostHogSuccessResponseSchema,
	trackScreen: PostHogSuccessResponseSchema,
} as const;

export type PostHogEndpointOutputs = {
	[K in keyof typeof PostHogEndpointOutputSchemas]: z.infer<
		typeof PostHogEndpointOutputSchemas[K]
	>;
};

export type CreateAliasResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.aliasCreate
>;
export type CreateEventResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.eventCreate
>;
export type CreateIdentityResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.identityCreate
>;
export type TrackPageResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.trackPage
>;
export type TrackScreenResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.trackScreen
>;
