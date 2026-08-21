import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseStoreEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'store';

/**
 * Stores are read-only over the API and created in the back office.
 *
 * Almost every other entity references a store id - variant prices, tax and
 * discount availability, receipts, shifts, POS devices - so this is the most
 * frequently resolved lookup in the plugin and the clearest case for mirroring.
 */

/** Lists stores. */
export const list: LoyverseEndpoints['storesList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['storesList']>(
		ctx,
		'stores',
		{ query: listQuery(input, { store_ids: csv(input.store_ids) }) },
	);

	await cacheEntities(ctx.db.stores, LoyverseStoreEntity, result.stores, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.stores.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one store by id. */
export const get: LoyverseEndpoints['storesGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['storesGet']>(
		ctx,
		`stores/${input.store_id}`,
	);

	await cacheEntity(ctx.db.stores, LoyverseStoreEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.stores.get',
		auditPayload(input, ['store_id']),
		'completed',
	);
	return result;
};
