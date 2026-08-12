import { z } from 'zod';

/**
 * Soft persistence shapes for Hub entities (`ctx.db.*`).
 * Field names match live Hub REST (`GET /api/models|datasets|spaces/...`)
 * and huggingface_hub ModelInfo / DatasetInfo / SpaceInfo.
 * `.catchall` keeps cardData extras, runtime blobs, and future Hub fields.
 *
 * @see https://huggingface.co/.well-known/openapi.json
 * @see https://huggingface.co/docs/huggingface_hub/en/package_reference/hf_api
 */

const HubSibling = z
	.object({
		rfilename: z.string(),
		size: z.number().optional(),
		blobId: z.string().optional(),
		blob_id: z.string().optional(),
		lfs: z.unknown().optional(),
	})
	.catchall(z.unknown());

/** Hub `gated` is false | "auto" | "manual" (sometimes boolean true). */
const HubGated = z.union([z.boolean(), z.enum(['auto', 'manual'])]);

const HubAuthorRef = z
	.object({
		_id: z.string().optional(),
		name: z.string().optional(),
		fullname: z.string().optional(),
		type: z.string().optional(),
		avatarUrl: z.string().optional(),
	})
	.catchall(z.unknown());

/**
 * `GET /api/models/{ns}/{repo}` / list item (ModelInfo).
 * `id` is the Hub repo id (`namespace/name`).
 */
export const HuggingFaceModel = z
	.object({
		id: z.string(),
		modelId: z.string().optional(),
		author: z.string().optional(),
		sha: z.string().optional(),
		lastModified: z.string().optional(),
		createdAt: z.string().optional(),
		private: z.boolean().optional(),
		disabled: z.boolean().optional(),
		gated: HubGated.optional(),
		downloads: z.number().optional(),
		likes: z.number().optional(),
		trendingScore: z.number().optional(),
		tags: z.array(z.string()).optional(),
		pipeline_tag: z.string().nullable().optional(),
		library_name: z.string().nullable().optional(),
		siblings: z.array(HubSibling).optional(),
		cardData: z.record(z.string(), z.unknown()).nullable().optional(),
		config: z.record(z.string(), z.unknown()).nullable().optional(),
		transformersInfo: z.record(z.string(), z.unknown()).optional(),
		safetensors: z.unknown().optional(),
		usedStorage: z.number().optional(),
		_id: z.string().optional(),
	})
	.catchall(z.unknown());
export type HuggingFaceModel = z.infer<typeof HuggingFaceModel>;

/**
 * `GET /api/datasets/{ns}/{repo}` / list item (DatasetInfo).
 */
export const HuggingFaceDataset = z
	.object({
		id: z.string(),
		author: z.string().optional(),
		sha: z.string().optional(),
		lastModified: z.string().optional(),
		createdAt: z.string().optional(),
		private: z.boolean().optional(),
		disabled: z.boolean().optional(),
		gated: HubGated.optional(),
		downloads: z.number().optional(),
		likes: z.number().optional(),
		trendingScore: z.number().optional(),
		tags: z.array(z.string()).optional(),
		description: z.string().nullable().optional(),
		citation: z.string().nullable().optional(),
		paperswithcode_id: z.string().nullable().optional(),
		siblings: z.array(HubSibling).optional(),
		cardData: z.record(z.string(), z.unknown()).nullable().optional(),
		usedStorage: z.number().optional(),
		_id: z.string().optional(),
	})
	.catchall(z.unknown());
export type HuggingFaceDataset = z.infer<typeof HuggingFaceDataset>;

/**
 * `GET /api/spaces/{ns}/{repo}` / list item (SpaceInfo).
 */
export const HuggingFaceSpace = z
	.object({
		id: z.string(),
		author: z.string().optional(),
		sha: z.string().optional(),
		lastModified: z.string().optional(),
		createdAt: z.string().optional(),
		private: z.boolean().optional(),
		disabled: z.boolean().optional(),
		gated: HubGated.optional(),
		likes: z.number().optional(),
		trendingScore: z.number().optional(),
		tags: z.array(z.string()).optional(),
		sdk: z.string().nullable().optional(),
		subdomain: z.string().optional(),
		host: z.string().optional(),
		region: z.string().optional(),
		runtime: z.record(z.string(), z.unknown()).optional(),
		models: z.array(z.string()).optional(),
		datasets: z.array(z.string()).optional(),
		siblings: z.array(HubSibling).optional(),
		cardData: z.record(z.string(), z.unknown()).nullable().optional(),
		usedStorage: z.number().optional(),
		_id: z.string().optional(),
	})
	.catchall(z.unknown());
export type HuggingFaceSpace = z.infer<typeof HuggingFaceSpace>;

/**
 * `GET /api/collections` item.
 * Hub identity is `slug` (e.string); expose as `id` alias via catchall if callers store slug.
 */
export const HuggingFaceCollection = z
	.object({
		slug: z.string(),
		title: z.string().optional(),
		description: z.string().nullable().optional(),
		lastUpdated: z.string().optional(),
		private: z.boolean().optional(),
		gating: z
			.union([z.boolean(), z.record(z.string(), z.unknown())])
			.optional(),
		theme: z.string().optional(),
		upvotes: z.number().optional(),
		isUpvotedByUser: z.boolean().optional(),
		owner: HubAuthorRef.optional(),
		items: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.catchall(z.unknown());
export type HuggingFaceCollection = z.infer<typeof HuggingFaceCollection>;

/**
 * Entry from `GET /api/{repoType}/{ns}/{repo}/discussions`.
 * Hub key is `num` (discussion number), not a global id.
 */
export const HuggingFaceDiscussion = z
	.object({
		num: z.number(),
		title: z.string().optional(),
		status: z.enum(['open', 'closed']).or(z.string()).optional(),
		createdAt: z.string().optional(),
		isPullRequest: z.boolean().optional(),
		pinned: z.boolean().optional(),
		numComments: z.number().optional(),
		numReactionUsers: z.number().optional(),
		author: HubAuthorRef.optional(),
		repo: z
			.object({
				name: z.string().optional(),
				type: z.enum(['model', 'dataset', 'space']).or(z.string()).optional(),
			})
			.catchall(z.unknown())
			.optional(),
		repoOwner: z.record(z.string(), z.unknown()).optional(),
		topReactions: z.array(z.unknown()).optional(),
	})
	.catchall(z.unknown());
export type HuggingFaceDiscussion = z.infer<typeof HuggingFaceDiscussion>;

/**
 * Nested `paper` object from `GET /api/daily_papers` / papers search hits.
 */
export const HuggingFacePaper = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		summary: z.string().nullable().optional(),
		publishedAt: z.string().optional(),
		authors: z
			.array(
				z
					.object({
						_id: z.string().optional(),
						name: z.string().optional(),
						hidden: z.boolean().optional(),
					})
					.catchall(z.unknown()),
			)
			.optional(),
		upvotes: z.number().optional(),
		ai_summary: z.string().nullable().optional(),
		ai_keywords: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());
export type HuggingFacePaper = z.infer<typeof HuggingFacePaper>;
