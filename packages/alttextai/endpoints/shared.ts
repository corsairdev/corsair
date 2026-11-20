import type { FileInput } from 'corsair/http';
import { resolveFileInput } from 'corsair/http';
import type { AltTextAiContext } from '../index';
import type { AltTextAiImage } from './types';

/**
 * Most bytes taken from a link, base64 or a data: URL: core's download default,
 * passed explicitly so inline base64 is held to it too (core caps it only when asked).
 */
const FILE_MAX_BYTES = 25 * 1024 * 1024;

/** AltText.ai rejects multipart uploads without a filename — coerce Blob → File. */
export function toCsvUploadFile(file: Blob): File {
	if (typeof File !== 'undefined' && file instanceof File && file.name) {
		return file;
	}
	return new File([file], 'bulk.csv', {
		type: file.type || 'text/csv',
	});
}

// Types a server sends when it doesn't say what a file is.
const GENERIC_TYPES = new Set([
	'application/octet-stream',
	'binary/octet-stream',
]);

/**
 * The CSV to upload, from a Blob or from a link or base64. A Blob goes through
 * toCsvUploadFile as before. A linked or base64 file keeps its own name, with
 * `.csv` added when it lacks it, or is called bulk.csv when it has none (a link
 * ending in a bare id), and is typed text/csv when the server sent only a
 * generic type. AltText.ai documents no size limit for the CSV, so core's
 * default download cap applies.
 */
export async function toBulkCsvFile(input: FileInput): Promise<File> {
	if (input instanceof Blob) return toCsvUploadFile(input);
	const resolved = await resolveFileInput(input, {
		maxBytes: FILE_MAX_BYTES,
		fallbackName: 'bulk.csv',
	});
	const name = /\.csv$/i.test(resolved.filename)
		? resolved.filename
		: `${resolved.filename}.csv`;
	const type = GENERIC_TYPES.has(resolved.contentType.toLowerCase())
		? 'text/csv'
		: resolved.contentType;
	return new File([resolved.bytes], name, { type });
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
