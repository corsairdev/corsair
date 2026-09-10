import { z } from 'zod';

/**
 * Stability REST v1 Engine.
 * Official: GET /v1/engines/list
 * https://api.stability.ai/docs (ListEnginesResponseBody / Engine)
 */
export const DreamstudioEngine = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	type: z.enum([
		'AUDIO',
		'CLASSIFICATION',
		'PICTURE',
		'STORAGE',
		'TEXT',
		'VIDEO',
	]),
});

export type DreamstudioEngine = z.infer<typeof DreamstudioEngine>;

/**
 * Stability REST v1 organization membership on AccountResponseBody.
 */
export const DreamstudioOrganizationMembership = z.object({
	id: z.string(),
	name: z.string(),
	role: z.string(),
	is_default: z.boolean(),
});

export type DreamstudioOrganizationMembership = z.infer<
	typeof DreamstudioOrganizationMembership
>;

/**
 * Stability REST v1 user account.
 * Official: GET /v1/user/account (AccountResponseBody)
 */
export const DreamstudioAccount = z.object({
	id: z.string(),
	email: z.string(),
	organizations: z.array(DreamstudioOrganizationMembership),
	profile_picture: z.string().optional(),
});

export type DreamstudioAccount = z.infer<typeof DreamstudioAccount>;

/**
 * Stability REST v1 credit balance.
 * Official: GET /v1/user/balance (BalanceResponseBody)
 */
export const DreamstudioBalance = z.object({
	credits: z.number(),
});

export type DreamstudioBalance = z.infer<typeof DreamstudioBalance>;

/**
 * Stability REST v1 generation artifact (Image).
 * Official: POST /v1/generation/{engine_id}/image-to-image
 */
export const DreamstudioImage = z.object({
	base64: z.string(),
	finishReason: z.enum(['CONTENT_FILTERED', 'ERROR', 'SUCCESS']),
	seed: z.number(),
});

export type DreamstudioImage = z.infer<typeof DreamstudioImage>;
