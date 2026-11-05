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
	await deleteProductsForImages(ctx, guids);
}

const PRODUCT_PAGE = 500;

/**
 * FinerWorks deletes the virtual inventory products assigned to an inventory
 * image when the image is deleted, so drop their local copies too.
 * https://v2.api.finerworks.com/Help/Api/DELETE-v3-delete_images
 *
 * The rows are scanned page by page and matched on `image_guid` in memory:
 * a JSON field filter can't run while `encryptDataAtRest` seals the rows.
 */
async function deleteProductsForImages(
	ctx: FinerWorksContext,
	guids: string[],
): Promise<void> {
	if (!guids.length) return;
	const deleted = new Set(guids);
	try {
		const skus: string[] = [];
		for (let offset = 0; ; offset += PRODUCT_PAGE) {
			const rows = await ctx.db.virtualInventoryProducts.search({
				limit: PRODUCT_PAGE,
				offset,
			});
			for (const row of rows) {
				const imageGuid = row.data.image_guid;
				if (imageGuid && deleted.has(imageGuid)) skus.push(row.entity_id);
			}
			if (rows.length < PRODUCT_PAGE) break;
		}
		for (const sku of skus) {
			await ctx.db.virtualInventoryProducts.deleteByEntityId(sku);
		}
	} catch (error) {
		console.warn(
			'Failed to delete FinerWorks inventory products for deleted images:',
			error,
		);
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
