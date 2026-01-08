import { z } from 'zod';

// Common schemas
export const TokenOverridableSchema = z.object({
	token: z.string().optional(),
});

export const PropertiesSchema = z.record(z.string(), z.any()).optional();

// Alias schemas
export const CreateAliasArgsSchema = z
	.object({
		distinct_id: z.string(),
		alias: z.string(),
	})
	.merge(TokenOverridableSchema);
export type CreateAliasArgs = z.infer<typeof CreateAliasArgsSchema>;

// PostHog capture endpoint returns 1 on success, or an object
export const CreateAliasResponseSchema = z.union([
	z.number(),
	z.object({
		status: z.number().optional(),
		message: z.string().optional(),
	}),
]);
export type CreateAliasResponse = z.infer<typeof CreateAliasResponseSchema>;

// Event schemas
export const CreateEventArgsSchema = z
	.object({
		distinct_id: z.string(),
		event: z.string(),
		properties: PropertiesSchema,
		timestamp: z.string().optional(),
		uuid: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type CreateEventArgs = z.infer<typeof CreateEventArgsSchema>;

// PostHog capture endpoint returns 1 on success, or an object
export const CreateEventResponseSchema = z.union([
	z.number(),
	z.object({
		status: z.number().optional(),
		message: z.string().optional(),
	}),
]);
export type CreateEventResponse = z.infer<typeof CreateEventResponseSchema>;

// Identity schemas
export const CreateIdentityArgsSchema = z
	.object({
		distinct_id: z.string(),
		properties: PropertiesSchema,
	})
	.merge(TokenOverridableSchema);
export type CreateIdentityArgs = z.infer<typeof CreateIdentityArgsSchema>;

// PostHog capture endpoint returns 1 on success, or an object
export const CreateIdentityResponseSchema = z.union([
	z.number(),
	z.object({
		status: z.number().optional(),
		message: z.string().optional(),
	}),
]);
export type CreateIdentityResponse = z.infer<typeof CreateIdentityResponseSchema>;

// Track page schemas
export const TrackPageArgsSchema = z
	.object({
		distinct_id: z.string(),
		url: z.string(),
		properties: PropertiesSchema,
		timestamp: z.string().optional(),
		uuid: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type TrackPageArgs = z.infer<typeof TrackPageArgsSchema>;

// PostHog capture endpoint returns 1 on success, or an object
export const TrackPageResponseSchema = z.union([
	z.number(),
	z.object({
		status: z.number().optional(),
		message: z.string().optional(),
	}),
]);
export type TrackPageResponse = z.infer<typeof TrackPageResponseSchema>;

// Track screen schemas
export const TrackScreenArgsSchema = z
	.object({
		distinct_id: z.string(),
		screen_name: z.string(),
		properties: PropertiesSchema,
		timestamp: z.string().optional(),
		uuid: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type TrackScreenArgs = z.infer<typeof TrackScreenArgsSchema>;

// PostHog capture endpoint returns 1 on success, or an object
export const TrackScreenResponseSchema = z.union([
	z.number(),
	z.object({
		status: z.number().optional(),
		message: z.string().optional(),
	}),
]);
export type TrackScreenResponse = z.infer<typeof TrackScreenResponseSchema>;

