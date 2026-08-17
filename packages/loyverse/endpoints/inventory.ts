import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { auditPayload, countOf } from './logging';
import { compactQuery, csv, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

/**
 * Inventory levels.
 *
 * Not mirrored, for two reasons. There is no id to key a row on - the natural
 * key is `variant_id` together with `store_id` - and a stock figure changes on
 * every sale, so a local copy would be stale the moment it was written. A
 * caller that needs a current level has to read it.
 *
 * Note the response key: this is the one collection whose array is not named
 * after its path segment. `GET /inventory` returns `inventory_levels`.
 */

/** Reads current stock levels, optionally narrowed to a store or variants. */
export const list: LoyverseEndpoints['inventoryList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['inventoryList']>(
		ctx,
		'inventory',
		{
			query: compactQuery({
				cursor: input.cursor,
				limit: input.limit,
				// Plural. Loyverse ignores `store_id` here and returns every
				// store's levels, so the singular form fails silently.
				store_ids: csv(input.store_ids),
				variant_ids: csv(input.variant_ids),
				updated_at_min: input.updated_at_min,
				updated_at_max: input.updated_at_max,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'loyverse.inventory.list',
		auditPayload(input, ['cursor', 'limit']),
		'completed',
	);
	return result;
};

/**
 * Sets stock levels for one or more variants.
 *
 * `stock_after` is the resulting absolute level, not an adjustment, which makes
 * the call idempotent - sending the same body twice leaves the same figure
 * rather than doubling it. That is why this operation is absent from the
 * non-idempotent set in `error-handlers.ts` despite being a POST, and it was
 * verified live rather than assumed from the field name.
 */
export const update: LoyverseEndpoints['inventoryUpdate'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['inventoryUpdate']>(
		ctx,
		'inventory',
		{
			method: 'POST',
			body: { inventory_levels: input.inventory_levels },
		},
	);

	await logEventFromContext(
		ctx,
		'loyverse.inventory.update',
		{ level_count: countOf(input.inventory_levels) },
		'completed',
	);
	return result;
};
