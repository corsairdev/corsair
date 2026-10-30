import { logEventFromContext } from 'corsair/core';
import { LOYVERSE_IMAGE_MEDIA_TYPE } from '../client';
import type { LoyverseEndpoints } from '../index';
import { LoyverseItemEntity, LoyverseVariantEntity } from '../schema/database';
import { auditPayload } from './logging';
import {
	cacheEntities,
	cacheEntity,
	evictEntity,
	variantEntityId,
} from './persist';
import {
	compactBody,
	csv,
	listQuery,
	loyverseCall,
	loyverseUpload,
} from './shared';
import type { LoyverseEndpointOutputs } from './types';

const LABEL = 'item';

/**
 * Items carry their variants inline, so a read of either mirrors both.
 *
 * Without this a variant would only appear in the cache after a separate
 * `variants.list`, even though the data was already in hand.
 */
async function cacheItemVariants(
	ctx: Parameters<LoyverseEndpoints['itemsGet']>[0],
	items: readonly { variants?: unknown }[],
) {
	const variants = items.flatMap((item) =>
		Array.isArray(item.variants) ? item.variants : [],
	);
	await cacheEntities(ctx.db.variants, LoyverseVariantEntity, variants, {
		label: 'variant',
		entityId: variantEntityId,
	});
}

/** Lists items, mirroring each page and the variants nested in it. */
export const list: LoyverseEndpoints['itemsList'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['itemsList']>(
		ctx,
		'items',
		{ query: listQuery(input, { items_ids: csv(input.items_ids) }) },
	);

	await cacheEntities(ctx.db.items, LoyverseItemEntity, result.items, {
		label: LABEL,
	});
	await cacheItemVariants(ctx, result.items);

	await logEventFromContext(
		ctx,
		'loyverse.items.list',
		auditPayload(input, ['cursor', 'limit', 'show_deleted']),
		'completed',
	);
	return result;
};

/** Retrieves one item by id. */
export const get: LoyverseEndpoints['itemsGet'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['itemsGet']>(
		ctx,
		`items/${input.item_id}`,
	);

	await cacheEntity(ctx.db.items, LoyverseItemEntity, result, { label: LABEL });
	await cacheItemVariants(ctx, [result]);

	await logEventFromContext(
		ctx,
		'loyverse.items.get',
		auditPayload(input, ['item_id']),
		'completed',
	);
	return result;
};

/**
 * Creates or updates an item.
 *
 * Loyverse treats the collection POST as an upsert: with `id` in the body it
 * updates that item, without one it creates a new one. The input schema requires
 * `variants` whenever `id` is present, because an absent array is read as an
 * instruction to remove every variant.
 */
export const upsert: LoyverseEndpoints['itemsUpsert'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['itemsUpsert']>(
		ctx,
		'items',
		{
			method: 'POST',
			body: compactBody({
				id: input.id,
				item_name: input.item_name,
				description: input.description,
				reference_id: input.reference_id,
				category_id: input.category_id,
				track_stock: input.track_stock,
				sold_by_weight: input.sold_by_weight,
				is_composite: input.is_composite,
				use_production: input.use_production,
				components: input.components,
				primary_supplier_id: input.primary_supplier_id,
				tax_ids: input.tax_ids,
				modifier_ids: input.modifier_ids,
				form: input.form,
				color: input.color,
				option1_name: input.option1_name,
				option2_name: input.option2_name,
				option3_name: input.option3_name,
				variants: input.variants,
			}),
		},
	);

	await cacheEntity(ctx.db.items, LoyverseItemEntity, result, { label: LABEL });
	await cacheItemVariants(ctx, [result]);

	await logEventFromContext(
		ctx,
		'loyverse.items.upsert',
		// The item name and description are caller-authored, so only the id
		// Loyverse assigned is recorded.
		{ item_id: result.id, created: input.id === undefined },
		'completed',
	);
	return result;
};

/**
 * Deletes an item.
 *
 * The mirrored row is evicted, and so are the variants that belonged to it -
 * deleting an item takes its variants with it, so leaving them behind would
 * strand rows pointing at an item that no longer exists.
 */
export const remove: LoyverseEndpoints['itemsDelete'] = async (ctx, input) => {
	const result = await loyverseCall<LoyverseEndpointOutputs['itemsDelete']>(
		ctx,
		`items/${input.item_id}`,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.items, input.item_id, LABEL);
	for (const id of result.deleted_object_ids ?? []) {
		if (id !== input.item_id) {
			await evictEntity(ctx.db.variants, id, 'variant');
		}
	}

	await logEventFromContext(
		ctx,
		'loyverse.items.delete',
		auditPayload(input, ['item_id']),
		'completed',
	);
	return result;
};

/**
 * Uploads an item image.
 *
 * The bytes arrive base64-encoded and are decoded here, at the boundary where
 * the input schema is, then sent as the raw request body - Loyverse answers a
 * multipart request with 500.
 *
 * The response carries no body, so the outcome is reported explicitly. The
 * mirrored item is deliberately left alone: its `image_url` has changed, but
 * refreshing it would cost a second request on every upload, and the next read
 * of the item corrects it.
 */
export const uploadImage: LoyverseEndpoints['itemsUploadImage'] = async (
	ctx,
	input,
) => {
	const bytes = Buffer.from(input.image_base64, 'base64');
	const image = new Blob([bytes], {
		type: input.media_type ?? LOYVERSE_IMAGE_MEDIA_TYPE,
	});

	await loyverseUpload<unknown>(
		ctx,
		`items/${input.item_id}/image`,
		image,
		input.media_type,
	);

	await logEventFromContext(
		ctx,
		'loyverse.items.uploadImage',
		// The image itself is never logged, only its size.
		{ item_id: input.item_id, bytes: bytes.byteLength },
		'completed',
	);
	return { success: true, item_id: input.item_id };
};

/** Removes an item's image. Answers 200 with an empty body. */
export const deleteImage: LoyverseEndpoints['itemsDeleteImage'] = async (
	ctx,
	input,
) => {
	await loyverseCall<unknown>(ctx, `items/${input.item_id}/image`, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'loyverse.items.deleteImage',
		auditPayload(input, ['item_id']),
		'completed',
	);
	return { success: true, item_id: input.item_id };
};
