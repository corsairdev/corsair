import { z } from 'zod';

/**
 * Locally persisted Publora entities.
 *
 * Accounts are the connected social profiles every post targets by
 * `platformId` (`<platform>-<id>`, e.g. `linkedin-ABC123`). Posts are post
 * groups: one logical post with a delivery record per target under `posts`.
 * Media, account context and webhooks are not stored.
 *
 * Field names match the official JSON keys.
 * Spec: https://docs.publora.com/openapi.json
 *
 * Only the primary key is required. Every other field is optional and
 * nullable so a record still parses when Publora omits or nulls a field.
 */

const S = z.string().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * A connected social account.
 * Spec: `components.schemas.PlatformConnection`
 */
export const PubloraAccount = z
	.object({
		/** Connection id (`<platform>-<id>`); pass it in `platforms` when creating a post. */
		platformId: z.string(),
		/** Handle on the network; null for a private Telegram channel. */
		username: S,
		displayName: S,
		profileImageUrl: S,
		profileUrl: S,
		/** `active` or `reconnect_required`. Only active connections can publish. */
		connectionStatus: S,
		/** `valid`, `expiring_soon`, `expired` or `unknown`. */
		tokenStatus: S,
		accessTokenExpiresAt: S,
		tokenExpiresIn: S,
		lastSuccessfulPost: S,
		lastError: z
			.object({ message: S, occurredAt: S })
			.loose()
			.nullable()
			.optional(),
		/** X only: `None`, `Basic`, `Premium` or `PremiumPlus`. */
		subscriptionType: S,
	})
	.loose();
export type PubloraAccount = z.infer<typeof PubloraAccount>;

/**
 * Delivery state of a post group on one network.
 * Spec: `components.schemas.Post`
 */
export const PubloraPlatformPost = z
	.object({
		/** `linkedin`, `twitter`, `instagram`, `threads`, `tiktok`, `youtube`, `facebook`, `bluesky`, `mastodon`, `telegram`, `pinterest`. */
		platform: S,
		platformId: S,
		content: S,
		/** `draft`, `scheduled`, `pending`, `processing`, `published` or `failed`. */
		status: S,
		/** The network's own id for the live post; null until published. */
		postedId: S,
		/** Public URL of the live post; null until published or when the network has none. */
		permalink: S,
		isThread: B,
	})
	.loose();
export type PubloraPlatformPost = z.infer<typeof PubloraPlatformPost>;

/**
 * One post group that can target several connected accounts.
 * Spec: `GET /get-post/{postGroupId}` and `GET /list-posts`
 */
export const PubloraPost = z
	.object({
		postGroupId: z.string(),
		content: S,
		/** `draft`, `scheduled`, `published`, `failed` or `partially_published`. */
		status: S,
		/** Stored publish time; null for drafts. */
		scheduledTime: S,
		createdAt: S,
		updatedAt: S,
		/**
		 * `get-post` returns the connection ids as strings; `list-posts`
		 * returns `{ platformId, platform, status }` objects.
		 */
		platforms: z
			.array(
				z.union([
					z.string(),
					z.object({ platformId: S, platform: S, status: S }).loose(),
				]),
			)
			.nullable()
			.optional(),
		posts: z.array(PubloraPlatformPost).nullable().optional(),
		mediaUrls: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type PubloraPost = z.infer<typeof PubloraPost>;
