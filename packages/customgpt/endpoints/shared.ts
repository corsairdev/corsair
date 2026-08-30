import type { CustomGPTFileInput } from './types';

/**
 * Converts a base64 file input into a `File` so `multipart/form-data` uploads
 * carry the original filename, which CustomGPT uses as the document name.
 */
export function toUploadFile(file: CustomGPTFileInput): File {
	const bytes = Buffer.from(file.content_base64, 'base64');
	return new File([bytes], file.filename, {
		type: file.content_type ?? 'application/octet-stream',
	});
}

/**
 * Builds the `file` / `files[]` multipart fields the upload endpoints expect.
 * The bracketed key is the field name documented in the OpenAPI spec.
 */
export function fileFormFields(input: {
	file?: CustomGPTFileInput;
	files?: CustomGPTFileInput[];
}): Record<string, unknown> {
	const fields: Record<string, unknown> = {};
	if (input.file) {
		fields.file = toUploadFile(input.file);
	}
	if (input.files?.length) {
		fields['files[]'] = input.files.map(toUploadFile);
	}
	return fields;
}

/** Returns a shallow copy of `source` without the given keys. */
export function omit<T extends object, K extends keyof T>(
	source: T,
	keys: readonly K[],
): Omit<T, K> {
	const result = { ...source };
	for (const key of keys) {
		delete result[key];
	}
	return result;
}

/**
 * Writes a row to the plugin's entity cache. Cache writes are best-effort:
 * a storage failure must never fail an otherwise successful API call.
 */
export async function cacheEntity(
	label: string,
	write: () => Promise<unknown>,
): Promise<void> {
	try {
		await write();
	} catch (error) {
		console.warn(`Failed to cache CustomGPT ${label}:`, error);
	}
}
