import { z } from 'zod';

/**
 * Locally persisted PostOnce entities.
 *
 * Accounts are the connected social profiles every post targets by `id`.
 * Posts are the aggregate records agents create, read, list and cancel, with
 * per-account delivery state under `targets`. Analytics, drafts and media
 * uploads are not stored: this plugin does not call those routes.
 *
 * Field names match the official JSON keys.
 * Spec: https://postonce.to/api/openapi.json
 *
 * Only the primary key is required. Every other field is optional and
 * nullable so a record still parses when PostOnce omits or nulls a field.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * What an account can do, as reported by `GET /v1/accounts`.
 * Spec: `components.schemas.Account.properties.capabilities`
 */
export const PostOnceAccountCapabilities = z
	.object({
		connection_mode: S,
		/** Can receive posts. */
		destination: B,
		/** Can be a workflow source. */
		source: B,
		backfill: B,
		text: B,
		images: B,
		video: B,
		replies: B,
		threads: B,
	})
	.loose();
export type PostOnceAccountCapabilities = z.infer<
	typeof PostOnceAccountCapabilities
>;

/**
 * Media input constraints from PostOnce's publishing validator. Check
 * `required_media` before a text-only post (Instagram, TikTok, YouTube and
 * Pinterest need media).
 * Spec: `components.schemas.Account.properties.media_requirements`
 */
export const PostOnceMediaRequirements = z
	.object({
		supported_formats: z.array(z.string()).nullable().optional(),
		convertible_formats: z.record(z.string(), z.string()).nullable().optional(),
		max_size_bytes: z
			.object({ image: N, video: N, gif: N })
			.loose()
			.nullable()
			.optional(),
		// These four objects vary by platform and PostOnce does not publish their
		// fields, so they stay open records.
		file_constraints: z.record(z.string(), z.unknown()).nullable().optional(),
		required_media: z.record(z.string(), z.unknown()).nullable().optional(),
		max_hashtags: N,
		min_video_duration_seconds: N,
		max_video_duration_seconds: N,
		aspect_ratio: z.record(z.string(), z.unknown()).nullable().optional(),
		thumbnail: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type PostOnceMediaRequirements = z.infer<
	typeof PostOnceMediaRequirements
>;

/**
 * A connected social account.
 * Spec: `components.schemas.Account`
 */
export const PostOnceAccount = z
	.object({
		/** Account id; pass it as `targets[].account_id` when creating a post. */
		id: z.string(),
		/** `linkedin`, `twitter`, `threads`, `bluesky`, `facebook`, `instagram`, `tiktok`, `youtube`, `pinterest`, … */
		platform: S,
		/** Handle on the network. */
		username: S,
		avatar_url: S,
		/** `active`, `auth_required` or `disconnected`. Only active accounts can be posted to. */
		status: S,
		capabilities: PostOnceAccountCapabilities.nullable().optional(),
		media_requirements: PostOnceMediaRequirements.nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();
export type PostOnceAccount = z.infer<typeof PostOnceAccount>;

/**
 * Media attached to a post.
 * Spec: `components.schemas.MediaInput`
 */
export const PostOnceMedia = z
	.object({
		/** Absolute HTTP(S) URL of the image or video. */
		url: z.string(),
		/** `image` or `video`. */
		type: S,
		width: N,
		height: N,
		size: N,
		/** Video duration in seconds when known. */
		duration: N,
		/** Cover image URL for video media. */
		thumbnail_url: S,
	})
	.loose();
export type PostOnceMedia = z.infer<typeof PostOnceMedia>;

/**
 * Per-account delivery state of a post.
 * Spec: `components.schemas.PostTarget`
 */
export const PostOncePostTarget = z
	.object({
		/** Concrete destination row id. */
		target_post_id: S,
		account_id: S,
		platform: S,
		/** `spotlight` or `public_story` for platforms that fan one target out. */
		target_variant: S,
		username: S,
		/** `pending`, `scheduled`, `processing`, `submitted`, `published`, `failed`, `skipped` or `cancelled`. */
		status: S,
		/** Platform error when the target failed. */
		error: S,
		platform_post_id: S,
		/** Link to the published post on the network. */
		platform_post_url: S,
		scheduled_time: S,
	})
	.loose();
export type PostOncePostTarget = z.infer<typeof PostOncePostTarget>;

/**
 * One aggregate post that can target several connected accounts.
 * Spec: `components.schemas.Post`
 */
export const PostOncePost = z
	.object({
		/** Aggregate post id (UUID). */
		id: z.string(),
		content: S,
		/** Caller's own reference, if one was sent. */
		external_id: S,
		media: z.array(PostOnceMedia).nullable().optional(),
		/** `ui`, `api` or `workflow`. Workflow posts are read-only. */
		origin: S,
		/** Scheduled publish time; null when sent immediately. */
		publish_at: S,
		/** `queued`, `scheduled`, `processing`, `partial`, `published`, `failed` or `cancelled`. */
		status: S,
		created_at: S,
		targets: z.array(PostOncePostTarget).nullable().optional(),
	})
	.loose();
export type PostOncePost = z.infer<typeof PostOncePost>;
