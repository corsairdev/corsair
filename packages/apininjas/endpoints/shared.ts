/**
 * Helpers shared by the endpoint modules.
 *
 * There is no pagination envelope to share here: API Ninjas has no cursor, no
 * limit/offset wrapper and no total count. Collections come back as bare JSON
 * arrays capped server-side, and where a `limit` parameter exists at all it is
 * premium-gated. What is shared instead is the handling of the free tier's two
 * quirks - masked values and missing rows.
 */

/**
 * Matches the prose the free tier returns in place of a value.
 *
 * The wording is not consistent between endpoints. Across the responses
 * captured from every operation there are 38 distinct variants - "This field is
 * for premium subscribers only.", "Only available for premium subscribers.",
 * "sector is reserved for premium subscribers only.", "premium subscription
 * required.", a lowercase form, and the electric-vehicle endpoint's bare "No
 * Data" - so this cannot match a phrase.
 *
 * It deliberately does not match the bare word "premium" either. A field value
 * like "Premium Economy" or a fund named "... Premium Fund" is real data, and
 * treating it as withheld would silently drop it from the mirror. Every one of
 * the 38 observed variants names the subscription, so that is what is matched.
 */
const PREMIUM_PLACEHOLDER =
	/premium subscriber|premium subscription|premium users only|^no data$/i;

/**
 * True when a field holds the provider's placeholder prose rather than data.
 *
 * Useful before mirroring a value into the cache: storing "This field is for
 * premium subscribers only." as an airline's fleet size would be worse than
 * storing nothing.
 */
export function isMaskedValue(value: unknown): boolean {
	return typeof value === 'string' && PREMIUM_PLACEHOLDER.test(value);
}

/** Returns the value unless the provider masked it, in which case undefined. */
export function unmasked<T>(value: T): T | undefined {
	return isMaskedValue(value) ? undefined : value;
}

/** Coerces a value the provider may send as a number or as a numeric string. */
export function asNumber(value: unknown): number | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && !isMaskedValue(value)) {
		const parsed = Number.parseFloat(value.replace(/,/g, ''));
		if (Number.isFinite(parsed)) return parsed;
	}
	return undefined;
}

/**
 * Builds a stable cache key from the fields that identify a row.
 *
 * Most of these endpoints return no identifier of their own, so the key is
 * composed from the natural key instead - an airport's ICAO code, a city's name
 * and country. Parts are lowercased and blanks are kept as empty segments, so
 * the same row always produces the same key.
 */
export function entityId(
	...parts: (string | number | null | undefined)[]
): string {
	return parts
		.map((part) => (part === null || part === undefined ? '' : String(part)))
		.map((part) => part.trim().toLowerCase())
		.join('|');
}

/**
 * True when at least one part of a natural key carries a value.
 *
 * A row with nothing to key on has to be skipped rather than stored, or every
 * such row collides on the same blank key and overwrites the last. Checking the
 * parts rather than the joined string keeps that independent of how many parts
 * a key has - comparing the result against `'|'` only catches it for a key of
 * exactly two, and silently misses a three-part one.
 */
export function keyed(
	...parts: (string | number | null | undefined)[]
): boolean {
	return parts.some(
		(part) =>
			part !== null && part !== undefined && String(part).trim().length > 0,
	);
}

/**
 * Content types the image endpoints answer with, keyed by the `format`
 * parameter the provider documents.
 */
const IMAGE_CONTENT_TYPES: Record<string, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	svg: 'image/svg+xml',
	eps: 'application/postscript',
};

/**
 * Maps a requested image format onto its content type, defaulting to PNG - the
 * provider's own default when `format` is omitted.
 */
export function imageContentType(format: string | undefined): string {
	if (!format) return 'image/png';
	return (
		IMAGE_CONTENT_TYPES[format.toLowerCase()] ?? 'application/octet-stream'
	);
}

/** Formats whose payload is text, and therefore survives the transport exactly. */
const TEXT_IMAGE_FORMATS = new Set(['svg', 'eps']);

/**
 * Whether the payload for a format is exactly what the provider sent.
 *
 * The shared transport decodes any non-JSON response with `response.text()`.
 * SVG and EPS are text and come back byte-for-byte; raster bytes do not
 * survive that decode and cannot be written back out as an image. The
 * operations report this rather than leaving a caller to infer it from
 * `content_type`, which describes what was asked for, not what arrived.
 */
export function imageEncoding(
	format: string | undefined,
): 'text' | 'lossy-text' {
	return TEXT_IMAGE_FORMATS.has((format ?? '').toLowerCase())
		? 'text'
		: 'lossy-text';
}

/** Normalises a collection response that may arrive as a bare object. */
export function asArray<T>(result: T[] | T | null | undefined): T[] {
	if (Array.isArray(result)) return result;
	if (result === null || result === undefined) return [];
	return [result];
}
