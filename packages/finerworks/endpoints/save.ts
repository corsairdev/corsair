import type { FinerWorksContext } from '../index';
import type {
	FinerWorksImage,
	FinerWorksOrder,
	FinerWorksVirtualInventoryProduct,
} from '../schema/database';

/**
 * Local copies of the account's own records: image files (keyed by `guid`),
 * virtual inventory products (keyed by `sku`) and orders (keyed by
 * `order_id`). Catalog lookups such as frames, mats and media types are the
 * same for every account, so they are returned but not stored.
 *
 * Every write goes through the entity client, which seals the row when the
 * app turns on `encryptDataAtRest`. A failed save never fails the API call.
 */

export async function saveImages(
	ctx: FinerWorksContext,
	images: FinerWorksImage[] | null | undefined,
): Promise<void> {
	if (!ctx.database || !images?.length) return;
	try {
		for (const image of images) {
			if (!image.guid) continue;
			await ctx.db.images.upsertByEntityId(image.guid, image);
		}
	} catch (error) {
		console.warn('Failed to save FinerWorks images to database:', error);
	}
}

export async function deleteImages(
	ctx: FinerWorksContext,
	guids: string[],
): Promise<void> {
	if (!ctx.database) return;
	try {
		for (const guid of guids) {
			await ctx.db.images.deleteByEntityId(guid);
		}
	} catch (error) {
		console.warn('Failed to delete FinerWorks images from database:', error);
	}
}

export async function saveInventoryProducts(
	ctx: FinerWorksContext,
	products: FinerWorksVirtualInventoryProduct[] | null | undefined,
): Promise<void> {
	if (!ctx.database || !products?.length) return;
	try {
		for (const product of products) {
			if (!product.sku) continue;
			await ctx.db.virtualInventoryProducts.upsertByEntityId(
				product.sku,
				product,
			);
		}
	} catch (error) {
		console.warn(
			'Failed to save FinerWorks inventory products to database:',
			error,
		);
	}
}

export async function deleteInventoryProducts(
	ctx: FinerWorksContext,
	skus: string[],
): Promise<void> {
	if (!ctx.database) return;
	try {
		for (const sku of skus) {
			await ctx.db.virtualInventoryProducts.deleteByEntityId(sku);
		}
	} catch (error) {
		console.warn(
			'Failed to delete FinerWorks inventory products from database:',
			error,
		);
	}
}

export async function saveOrders(
	ctx: FinerWorksContext,
	orders: FinerWorksOrder[] | null | undefined,
): Promise<void> {
	if (!ctx.database || !orders?.length) return;
	try {
		for (const order of orders) {
			if (order.order_id == null) continue;
			await ctx.db.orders.upsertByEntityId(String(order.order_id), order);
		}
	} catch (error) {
		console.warn('Failed to save FinerWorks orders to database:', error);
	}
}
