import { z } from 'zod';

export type CreateAliasResponse =
	| number
	| {
			status?: number;
			message?: string;
	  };

export type CreateEventResponse =
	| number
	| {
			status?: number;
			message?: string;
	  };

export type CreateIdentityResponse =
	| number
	| {
			status?: number;
			message?: string;
	  };

export type TrackPageResponse =
	| number
	| {
			status?: number;
			message?: string;
	  };

export type TrackScreenResponse =
	| number
	| {
			status?: number;
			message?: string;
	  };

export type PostHogEndpointOutputs = {
	aliasCreate: CreateAliasResponse;
	eventCreate: CreateEventResponse;
	identityCreate: CreateIdentityResponse;
	trackPage: TrackPageResponse;
	trackScreen: TrackScreenResponse;
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

export const PostHogEndpointOutputSchemas: {
	[K in keyof PostHogEndpointOutputs]: z.ZodType<unknown>;
} = {
	aliasCreate: PostHogSuccessResponseSchema,
	eventCreate: PostHogSuccessResponseSchema,
	identityCreate: PostHogSuccessResponseSchema,
	trackPage: PostHogSuccessResponseSchema,
	trackScreen: PostHogSuccessResponseSchema,
};
