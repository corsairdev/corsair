import type { FileInput, ResolveFileOptions } from 'corsair/http';
import { FileInputSchema, resolveFileInput } from 'corsair/http';
import { z } from 'zod';

/**
 * A file a Gong upload takes. An agent's arguments are JSON, so it passes a
 * link or base64; TypeScript callers can still pass a Blob or File.
 */
export function gongFileSchema(what: string) {
	return z
		.union([FileInputSchema, z.instanceof(Blob)])
		.describe(
			`${what}: a public URL, {url, filename?, contentType?}, or {base64, filename?, contentType?}; a Blob or File from TypeScript. On Corsair, pass a Files id (fil_…).`,
		);
}

/** Core's download default, for an upload whose limit Gong doesn't document. */
export const DEFAULT_FILE_MAX_BYTES = 25 * 1024 * 1024;
/** Gong documents call media uploads up to 1.5 GB (PUT /v2/calls/{id}/media). */
export const CALL_MEDIA_MAX_BYTES = 1_500_000_000;
/** Gong documents CRM data files (POST /v2/crm/entities) up to 200 MB. */
export const CRM_DATA_FILE_MAX_BYTES = 200 * 1024 * 1024;

/**
 * The multipart part for a file input. A Blob goes out as it was given; a link
 * is downloaded through core's guarded fetch and base64 is decoded, each into a
 * File that carries its name and media type.
 */
export async function gongUploadPart(
	value: FileInput,
	options: ResolveFileOptions,
): Promise<Blob> {
	if (value instanceof Blob) return value;
	// Core caps base64 and data: inputs only when asked, so an upload with no
	// documented limit still gets core's 25 MB download default.
	return (
		await resolveFileInput(value, {
			...options,
			maxBytes: options.maxBytes ?? DEFAULT_FILE_MAX_BYTES,
		})
	).file;
}
