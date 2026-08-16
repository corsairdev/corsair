import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseMerchantEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntity } from './persist';
import { loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

/**
 * Merchant information - the account itself: business name, country and
 * currency.
 *
 * A per-account singleton, but unlike Harvest's company settings it carries an
 * `id`, so the default entity-id resolver applies and no override is needed.
 *
 * The currency's `decimal_places` is the reason this is mirrored: every money
 * figure elsewhere in the API is a bare number, and rendering one correctly
 * needs this record.
 *
 * The response includes the account owner's email address, which is why the
 * event log records nothing from it.
 */
export const get: LoyverseEndpoints['merchantGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['merchantGet']>(
		ctx,
		'merchant/',
	);

	await cacheEntity(ctx.db.merchant, LoyverseMerchantEntity, result, {
		label: 'merchant',
	});

	await logEventFromContext(
		ctx,
		'loyverse.merchant.get',
		auditPayload(input, []),
		'completed',
	);
	return result;
};
