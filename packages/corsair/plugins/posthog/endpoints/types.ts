import { z } from 'zod';

const AliasCreateInputSchema = z.object({
	distinct_id: z.string(),
	alias: z.string(),
});

const EventCreateInputSchema = z.object({
	distinct_id: z.string(),
	event: z.string(),
	properties: z.record(z.unknown()).optional(),
	timestamp: z.string().optional(),
	uuid: z.string().optional(),
});

const IdentityCreateInputSchema = z.object({
	distinct_id: z.string(),
	properties: z.record(z.unknown()).optional(),
});

const TrackPageInputSchema = z.object({
	distinct_id: z.string(),
	url: z.string(),
	properties: z.record(z.unknown()).optional(),
	timestamp: z.string().optional(),
	uuid: z.string().optional(),
});

const TrackScreenInputSchema = z.object({
	distinct_id: z.string(),
	screen_name: z.string(),
	properties: z.record(z.unknown()).optional(),
	timestamp: z.string().optional(),
	uuid: z.string().optional(),
});

export const PostHogEndpointInputSchemas = {
	aliasCreate: AliasCreateInputSchema,
	eventCreate: EventCreateInputSchema,
	identityCreate: IdentityCreateInputSchema,
	trackPage: TrackPageInputSchema,
	trackScreen: TrackScreenInputSchema,
} as const;

export type PostHogEndpointInputs = {
	[K in keyof typeof PostHogEndpointInputSchemas]: z.infer<
		(typeof PostHogEndpointInputSchemas)[K]
	>;
};

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
		(typeof PostHogEndpointOutputSchemas)[K]
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
