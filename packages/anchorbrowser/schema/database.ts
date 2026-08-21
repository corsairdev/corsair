import { z } from 'zod';

/**
 * Cached entity shapes mirror the Anchor Browser API payloads verbatim, so
 * field names follow the wire format (snake_case for sessions/profiles,
 * camelCase for the legacy task API) rather than being normalised.
 *
 * Every entity is `.catchall(z.unknown())` because the API adds fields over
 * time and cached rows must not be rejected for being newer than this schema.
 */

/**
 * Sessions — union of the two documented session payloads:
 *   POST /v1/sessions            -> data: { id, cdp_url, live_view_url }
 *   GET  /v1/sessions/{id}       -> data: { session_id, team_id, duration,
 *                                   status, credits_used, configuration,
 *                                   playground, proxy_bytes, tokens, steps,
 *                                   tags, created_at }
 */
export const AnchorBrowserSession = z
	.object({
		id: z.string().optional(),
		session_id: z.string().optional(),
		team_id: z.string().optional(),
		status: z.string().optional(),
		cdp_url: z.string().optional(),
		live_view_url: z.string().optional(),
		duration: z.number().optional(),
		credits_used: z.number().optional(),
		configuration: z.record(z.string(), z.unknown()).optional(),
		playground: z.boolean().optional(),
		proxy_bytes: z.number().optional(),
		tokens: z.record(z.string(), z.unknown()).optional(),
		steps: z.number().optional(),
		tags: z.array(z.unknown()).optional(),
		created_at: z.string().optional(),
	})
	.catchall(z.unknown());

/**
 * Tasks — shape of an item from GET /v1/task (legacy task API). The identifier
 * is `id`; there is no `taskId` field on the response.
 */
export const AnchorBrowserTask = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		language: z.string().optional(),
		teamId: z.string().optional(),
		applicationId: z.string().optional(),
		taskVersionId: z.string().optional(),
		selectedTaskVersion: z.string().optional(),
		latestVersion: z.string().optional(),
		isDraft: z.boolean().optional(),
		outputFileOnly: z.boolean().optional(),
		humanIntervention: z.boolean().optional(),
		aiFallbackEnabled: z.boolean().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.catchall(z.unknown());

/**
 * Profiles — ProfileResponseSchema from the API reference:
 *   GET /v1/profiles -> data.items[]
 */
export const AnchorBrowserProfile = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		source: z.string().optional(),
		session_id: z.string().optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
	})
	.catchall(z.unknown());

export type AnchorBrowserSession = z.infer<typeof AnchorBrowserSession>;
export type AnchorBrowserTask = z.infer<typeof AnchorBrowserTask>;
export type AnchorBrowserProfile = z.infer<typeof AnchorBrowserProfile>;
