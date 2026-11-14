import { z } from 'zod';
import type { DownloadDeps, DownloadOptions } from './public-download';
import { downloadPublicFile, filenameFromUrl } from './public-download';

/**
 * One shape for a file going into an endpoint and one for a file coming out.
 *
 * An agent rarely holds bytes. It holds a link to a file, or at best a short
 * base64 string, and its arguments travel as JSON. A plugin whose API wants a
 * multipart upload or raw bytes therefore declares `FileInputSchema`, and calls
 * `resolveFileInput` to turn whatever arrived into bytes with a name and type.
 *
 * In TypeScript a caller may also pass a `Blob` or `File`: `resolveFileInput`
 * takes it as it is. The schema does not list it, because a Blob has no JSON
 * form and would show to an agent as an unknown value.
 */

const named = {
	filename: z
		.string()
		.optional()
		.describe('What to call the file. Defaults to the name in its URL.'),
	contentType: z
		.string()
		.optional()
		.describe(
			'Media type, for example application/pdf. Defaults to what the server states.',
		),
};

export const FileInputSchema = z
	.union([
		z.string().min(1).describe('A public http(s) URL to the file.'),
		z.object({
			url: z.string().min(1).describe('A public http(s) URL to the file.'),
			...named,
		}),
		z.object({
			base64: z.string().min(1).describe('The file, base64-encoded.'),
			...named,
		}),
	])
	.describe(
		'A file: a public URL to it, or {url, filename?, contentType?}, or {base64, filename?, contentType?} for a small one.',
	);

export type FileInput = z.infer<typeof FileInputSchema> | Blob;

export type ResolvedFile = {
	bytes: Uint8Array;
	filename: string;
	contentType: string;
	/** The same bytes as a File, ready for a multipart body. */
	file: File;
};

export type ResolveFileOptions = DownloadOptions & {
	/** The name used when neither the input nor its URL gives one. */
	fallbackName?: string;
};

function isBlob(value: unknown): value is Blob {
	return typeof Blob !== 'undefined' && value instanceof Blob;
}

function build(
	bytes: Uint8Array,
	filename: string,
	contentType: string,
): ResolvedFile {
	return {
		bytes,
		filename,
		contentType,
		file: new File([new Uint8Array(bytes)], filename, { type: contentType }),
	};
}

const DATA_URL = /^data:([^;,]*)(;base64)?,(.*)$/s;

function fromBase64(text: string, maxBytes: number | undefined): Uint8Array {
	const clean = text.replace(/\s+/g, '');
	if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(clean) || clean.length === 0) {
		throw new Error('The file is not valid base64.');
	}
	const bytes = Buffer.from(clean, 'base64');
	if (bytes.byteLength === 0) throw new Error('The file is empty.');
	if (maxBytes !== undefined && bytes.byteLength > maxBytes) {
		throw new Error(
			`The file is larger than the ${Math.round(maxBytes / (1024 * 1024))} MB limit.`,
		);
	}
	return new Uint8Array(bytes);
}

/**
 * Turns a file input into bytes with a name and a media type.
 *
 * A URL is fetched through `downloadPublicFile`, so it must be public and is
 * capped in size. A `data:` URL and a base64 object are decoded here. A Blob or
 * File is read as it is.
 */
export async function resolveFileInput(
	input: FileInput,
	options: ResolveFileOptions = {},
	deps: DownloadDeps = {},
): Promise<ResolvedFile> {
	const fallback = options.fallbackName ?? 'file';

	if (isBlob(input)) {
		const name =
			typeof File !== 'undefined' && input instanceof File && input.name
				? input.name
				: fallback;
		return build(
			new Uint8Array(await input.arrayBuffer()),
			name,
			input.type || 'application/octet-stream',
		);
	}

	const given = typeof input === 'string' ? { url: input } : input;

	if ('base64' in given) {
		return build(
			fromBase64(given.base64, options.maxBytes),
			given.filename ?? fallback,
			given.contentType ?? 'application/octet-stream',
		);
	}

	const data = DATA_URL.exec(given.url);
	if (data) {
		const [, type, isBase64, body] = data;
		const bytes = isBase64
			? fromBase64(body ?? '', options.maxBytes)
			: new TextEncoder().encode(decodeURIComponent(body ?? ''));
		return build(
			bytes,
			given.filename ?? fallback,
			given.contentType ?? (type || 'application/octet-stream'),
		);
	}

	const got = await downloadPublicFile(given.url, options, deps);
	return build(
		got.bytes,
		given.filename ?? got.filename ?? filenameFromUrl(got.url, fallback),
		given.contentType ?? got.contentType,
	);
}

/**
 * A file an endpoint returns. Bytes cannot ride in a JSON result as they are,
 * and a large base64 string can push a result past what a host returns, so the
 * content is included only up to a limit and its size and type always are.
 */
export const FileOutputSchema = z.object({
	contentBase64: z
		.string()
		.optional()
		.describe('The file, base64-encoded. Missing when contentOmitted is set.'),
	contentType: z
		.string()
		.describe('Media type of the file, for example application/pdf.'),
	byteLength: z.number().describe('Size of the file in bytes.'),
	filename: z.string().optional().describe('The file name, when known.'),
	contentOmitted: z
		.enum(['not_requested', 'over_limit'])
		.optional()
		.describe(
			'Set when contentBase64 was left out: the caller did not ask for it, or the file was over the limit.',
		),
});

export type FileOutput = z.infer<typeof FileOutputSchema>;

/** Default most bytes returned inline: under the 1 MB a hosted script result may carry, once base64 adds a third. */
export const FILE_OUTPUT_MAX_BYTES = 700_000;

/**
 * Shapes downloaded bytes as a `FileOutput`. The content goes in when it was
 * asked for and fits `maxBytes`; the size and type are always reported, so a
 * caller that got no content still knows what it would be.
 */
export function toFileOutput(
	bytes: Uint8Array,
	contentType: string | null | undefined,
	options: {
		includeContent?: boolean;
		maxBytes?: number;
		filename?: string;
	} = {},
): FileOutput {
	const base = {
		contentType:
			contentType?.split(';')[0]?.trim() || 'application/octet-stream',
		byteLength: bytes.byteLength,
		...(options.filename ? { filename: options.filename } : {}),
	};
	if (options.includeContent === false) {
		return { ...base, contentOmitted: 'not_requested' };
	}
	if (bytes.byteLength > (options.maxBytes ?? FILE_OUTPUT_MAX_BYTES)) {
		return { ...base, contentOmitted: 'over_limit' };
	}
	return { ...base, contentBase64: Buffer.from(bytes).toString('base64') };
}
