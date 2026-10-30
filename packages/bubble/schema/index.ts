import { BubbleThingEntity } from './database';

/**
 * `things` mirrors whatever records the agent has fetched via get/list.
 * Mirroring is best-effort (see `endpoints/persist.ts`), so a thing is only
 * ever stored once its full record has been returned by the API - create and
 * bulk-create only yield an id and never write here, and update/replace
 * evict the stale snapshot rather than trusting a partial rewrite.
 */
export const BubbleSchema = {
	version: '1.0.0',
	entities: {
		things: BubbleThingEntity,
	},
} as const;

export * from './database';
