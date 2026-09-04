import { z } from 'zod';

/**
 * A single Bubble thing (database record) from GET /obj/{typename}/{uid}.
 *
 * Official GET sample fields (API 1.1): `_id`, `Created By`, `Created Date`,
 * `Modified Date`, plus whatever the Data Type editor defines (names may
 * contain spaces, e.g. "Unit name"). `.loose()` keeps those custom fields.
 *
 * https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests.md
 */
export const BubbleThingEntity = z
	.object({
		/** Unique ID of the record. Always present on reads and in list results. */
		_id: z.string(),
		/** Creator of the record. Official sample: `"Created By": "example@example.com"`. */
		'Created By': z.string().optional(),
		/** Created timestamp as ISO-8601 (`2016-11-11T19:14:46.517Z` in API 1.1). */
		'Created Date': z.string().optional(),
		/** Modified timestamp as ISO-8601. Not writable; Bubble updates it automatically. */
		'Modified Date': z.string().optional(),
	})
	.loose();

export type BubbleThingEntity = z.infer<typeof BubbleThingEntity>;

/**
 * Envelope for GET /obj/{typename}. Pagination fields from the manual:
 * cursor = rank of the first item, count = items in this response,
 * remaining = records left (skipped when `exclude_remaining=true`).
 */
export const BubbleListResponse = z
	.object({
		response: z
			.object({
				cursor: z.number(),
				count: z.number(),
				/** Absent when `exclude_remaining=true`. */
				remaining: z.number().optional(),
				results: z.array(BubbleThingEntity),
			})
			.loose(),
	})
	.loose();

export type BubbleListResponse = z.infer<typeof BubbleListResponse>;
