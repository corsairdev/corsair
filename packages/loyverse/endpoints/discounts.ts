import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseDiscountEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity, evictEntity } from './persist';
import {
	compactBody,
	compactQuery,
	csv,
	listQuery,
	loyverseCall,
} from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'discount';

/**
 * Lists discounts.
 *
 * Every account has a built-in `DISCOUNT_BY_POINTS` discount that cannot be
 * removed, so this collection is never empty.
 *
 * `/discounts` does not paginate: it answers 200 and ignores a cursor rather than
 * rejecting it, and returns the whole collection.
 */
export const list: LoyverseEndpoints['discountsList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['discountsList']>(
		ctx,
		'discounts',
		{ query: compactQuery({ cursor: input.cursor, limit: input.limit }) },
	);

	await cacheEntities(
		ctx.db.discounts,
		LoyverseDiscountEntity,
		result.discounts,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.discounts.list',
		auditPayload(input, ['cursor', 'limit']),
		'completed',
	);
	return result;
};

/**
 * Lists discounts with the full filter set.
 *
 * The OSS catalog lists two discount list operations, and this is the second.
 * Both reach the same `GET /discounts` endpoint - Loyverse exposes only one - and
 * the difference is the filters offered: this one accepts an id filter, the four
 * timestamp bounds and `show_deleted`, so it can answer "which discounts changed
 * since Monday" or retrieve a soft-deleted discount that a plain list hides.
 *
 * Kept as a separate operation rather than folded into `list` so the plugin
 * matches the catalog surface exactly.
 */
export const listFiltered: LoyverseEndpoints['discountsListFiltered'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<
		LoyverseEndpointOutputs['discountsListFiltered']
	>(ctx, 'discounts', {
		query: listQuery(input, { discount_ids: csv(input.discount_ids) }),
	});

	await cacheEntities(
		ctx.db.discounts,
		LoyverseDiscountEntity,
		result.discounts,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'loyverse.discounts.listFiltered',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one discount by id. */
export const get: LoyverseEndpoints['discountsGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['discountsGet']>(
		ctx,
		`discounts/${input.discount_id}`,
	);

	await cacheEntity(ctx.db.discounts, LoyverseDiscountEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.discounts.get',
		auditPayload(input, ['discount_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a discount.
 *
 * Which amount field applies depends on `type`; the input schema rejects a
 * `FIXED_PERCENT` without `discount_percent` and a `FIXED_AMOUNT` without
 * `discount_amount` before the request is made.
 */
export const upsert: LoyverseEndpoints['discountsUpsert'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['discountsUpsert']>(
		ctx,
		'discounts',
		{
			method: 'POST',
			body: compactBody({
				id: input.id,
				name: input.name,
				type: input.type,
				discount_amount: input.discount_amount,
				discount_percent: input.discount_percent,
				stores: input.stores,
				restricted_access: input.restricted_access,
			}),
		},
	);

	await cacheEntity(ctx.db.discounts, LoyverseDiscountEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'loyverse.discounts.upsert',
		{
			discount_id: result.id,
			type: input.type,
			created: input.id === undefined,
		},
		'completed',
	);
	return result;
};

/** Deletes a discount and drops it from the mirror. */
export const remove: LoyverseEndpoints['discountsDelete'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['discountsDelete']>(
		ctx,
		`discounts/${input.discount_id}`,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.discounts, input.discount_id, LABEL);

	await logEventFromContext(
		ctx,
		'loyverse.discounts.delete',
		auditPayload(input, ['discount_id']),
		'completed',
	);
	return result;
};
