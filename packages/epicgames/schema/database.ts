import { z } from 'zod';

/**
 * Fortnite Data API `IslandMetadataSummary`.
 * Official OpenAPI: https://api.fortnite.com/ecosystem/v1/docs/openapi.yaml
 *
 * Fields match the documented schema. Live list/get responses currently omit
 * `type` even though OpenAPI marks it required — keep it optional.
 * `.catchall` retains pagination `meta` on list rows and any future fields.
 */
export const EpicGamesIsland = z
	.object({
		code: z.string(),
		title: z.string().optional(),
		creatorCode: z.string().optional(),
		displayName: z.string().optional(),
		category: z.string().optional(),
		createdIn: z.string().optional(),
		type: z.string().optional(),
		tags: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());

export type EpicGamesIsland = z.infer<typeof EpicGamesIsland>;
