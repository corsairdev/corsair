import { logEventFromContext } from 'corsair/core';
import type { LoyverseEndpoints } from '../index';
import { LoyverseVariantEntity } from '../schema/database';
import { auditPayload } from './logging';
import {
	cacheEntities,
	cacheEntity,
	evictEntity,
	variantEntityId,
} from './persist';
import { compactBody, csv, listQuery, loyverseCall } from './shared';
import type { LoyverseEndpointOutputs } from './types';

/**
 * Variants are keyed on `variant_id`, the one entity in the API whose primary
 * key is not called `id`, so every cache call passes the override.
 */
const LABEL = 'variant';
const KEY = { label: LABEL, entityId: variantEntityId };

/** Lists item variants across all items. */
export const list: LoyverseEndpoints['variantsList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['variantsList']>(
		ctx,
		'variants',
		{
			query: listQuery(input, {
				variants_ids: csv(input.variants_ids),
				items_ids: csv(input.items_ids),
				sku: input.sku,
			}),
		},
	);

	await cacheEntities(
		ctx.db.variants,
		LoyverseVariantEntity,
		result.variants,
		KEY,
	);

	await logEventFromContext(
		ctx,
		'loyverse.variants.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one variant by id. */
export const get: LoyverseEndpoints['variantsGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['variantsGet']>(
		ctx,
		`variants/${input.variant_id}`,
	);

	await cacheEntity(ctx.db.variants, LoyverseVariantEntity, result, KEY);

	await logEventFromContext(
		ctx,
		'loyverse.variants.get',
		auditPayload(input, ['variant_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates a variant.
 *
 * Supplying `variant_id` updates that variant; omitting it adds one, in which
 * case `item_id` names the item it belongs to.
 */
export const upsert: LoyverseEndpoints['variantsUpsert'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['variantsUpsert']>(
		ctx,
		'variants',
		{
			method: 'POST',
			body: compactBody({
				variant_id: input.variant_id,
				item_id: input.item_id,
				sku: input.sku,
				reference_variant_id: input.reference_variant_id,
				option1_value: input.option1_value,
				option2_value: input.option2_value,
				option3_value: input.option3_value,
				barcode: input.barcode,
				cost: input.cost,
				purchase_cost: input.purchase_cost,
				default_pricing_type: input.default_pricing_type,
				default_price: input.default_price,
				stores: input.stores,
			}),
		},
	);

	await cacheEntity(ctx.db.variants, LoyverseVariantEntity, result, KEY);

	await logEventFromContext(
		ctx,
		'loyverse.variants.upsert',
		{
			variant_id: result.variant_id,
			created: input.variant_id === undefined,
		},
		'completed',
	);
	return result;
};

/** Deletes a variant and drops it from the mirror. */
export const remove: LoyverseEndpoints['variantsDelete'] = async (
	ctx,
	input,
) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['variantsDelete']>(
		ctx,
		`variants/${input.variant_id}`,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.variants, input.variant_id, LABEL);

	await logEventFromContext(
		ctx,
		'loyverse.variants.delete',
		auditPayload(input, ['variant_id']),
		'completed',
	);
	return result;
};
