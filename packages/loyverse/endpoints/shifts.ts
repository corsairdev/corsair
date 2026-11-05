import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactQuery, csv, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

/**
 * Shifts - a cashier's till session, from opening float to closing count.
 *
 * Read-only over the API: a shift is opened and closed on a physical till, and
 * there is no endpoint to create one.
 *
 * **List only.** The API does expose `GET /shifts/{shift_id}`, but the OSS
 * catalog lists no Get Shift operation, so none is implemented here - the surface
 * matches the catalog rather than the API. A shift is in practice read as part of
 * a date range anyway.
 *
 * Not mirrored. A shift is transactional, appended as tills close, and only
 * meaningful against a date range - the same call this plugin makes for receipts.
 *
 * Its response schema is also the one shape in this plugin that could not be
 * captured from a live response: the development account had no closed shift and
 * no way to create one over the API. The schema therefore comes from the
 * published spec, is fully nullable and optional, and is `.loose()`, so a field
 * that differs in name or presence cannot reject a row.
 */

/**
 * Lists shifts, optionally narrowed to stores and an opening-date range.
 *
 * There are no `updated_at` bounds and no `show_deleted` here, unlike the other
 * collections: a closed shift is never revised or removed.
 */
export const list: LoyverseEndpoints['shiftsList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['shiftsList']>(
		ctx,
		'shifts',
		{
			query: compactQuery({
				cursor: input.cursor,
				limit: input.limit,
				store_ids: csv(input.store_ids),
				created_at_min: input.created_at_min,
				created_at_max: input.created_at_max,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'loyverse.shifts.list',
		auditPayload(input, ['cursor', 'limit']),
		'completed',
	);
	return result;
};
