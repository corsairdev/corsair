import type { AltTextAiContext } from '../index';
import type { AltTextAiImage } from './types';

export function toImageDbRecord(image: AltTextAiImage) {
	return {
		assetId: image.asset_id,
		url: image.url,
		altText: image.alt_text ?? null,
		createdAt: image.created_at
			? new Date(image.created_at * 1000)
			: null,
	};
}

export async function cacheImageRecord(
	ctx: AltTextAiContext,
	image: AltTextAiImage,
): Promise<void> {
	if (!image.asset_id || !ctx.db.images) {
		return;
	}

	try {
		await ctx.db.images.upsertByEntityId(
			image.asset_id,
			toImageDbRecord(image),
		);
	} catch (error) {
		console.warn('[alttext_ai] Failed to save image to database:', error);
	}
}
