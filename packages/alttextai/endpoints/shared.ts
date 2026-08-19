import type { AltTextAiContext } from '../index';
import type { AltTextAiImage } from './types';

/** AltText.ai rejects multipart uploads without a filename — coerce Blob → File. */
export function toCsvUploadFile(file: Blob): File {
	if (typeof File !== 'undefined' && file instanceof File && file.name) {
		return file;
	}
	return new File([file], 'bulk.csv', {
		type: file.type || 'text/csv',
	});
}

export function toImageDbRecord(image: AltTextAiImage) {
	return {
		assetId: image.asset_id,
		url: image.url,
		altText: image.alt_text ?? null,
		altTexts: image.alt_texts,
		tags: image.tags,
		metadata: image.metadata,
		createdAt: image.created_at ? new Date(image.created_at * 1000) : null,
		creditsUsed: image.credits_used,
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
		console.warn('[alttextai] Failed to save image to database:', error);
	}
}
