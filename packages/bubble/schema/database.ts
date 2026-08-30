import { z } from 'zod';
import { N } from './primitives';

/**
 * A single Bubble thing (database record), as returned by the Data API.
 *
 * Bubble pre-defines three field names on every thing type that `_id` is
 * required for here; the rest are whatever the app's own Data Type editor
 * declares, including fields with spaces in their names ("Unit name") - see
 * the GET /obj/{typename}/{uid} sample in the manual. `.loose()` keeps every
 * caller-defined field (and the auto-generated Created/Modified dates) on
 * the persisted row instead of stripping them.
 *
 * https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests.md
 */
export const BubbleThingEntity = z
	.object({
		/** Unique ID of the record. Always present on reads and in list results. */
		_id: z.string(),
	})
	.loose();

export type BubbleThingEntity = z.infer<typeof BubbleThingEntity>;

/**
 * The list envelope every `GET /obj/{typename}` response wraps its results
 * in. Confirmed from the manual's pagination sample: `cursor` is the rank
 * of the first returned item, `count` the number in this response, and
 * `remaining` how many records are left to fetch.
 */
export const BubbleListResponse = z
	.object({
		response: z
			.object({
				cursor: N,
				count: N,
				remaining: N,
				results: z.array(BubbleThingEntity),
			})
			.loose(),
	})
	.loose();

export type BubbleListResponse = z.infer<typeof BubbleListResponse>;
