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

// `unknown` because this guard is what narrows a caller's input before it is trusted as a Blob.
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

// The media type, any parameters (`;charset=utf-8`), then `;base64` when the body is base64.
const DATA_URL = /^data:([^;,]*)((?:;[^;,=]+=[^;,]*)*)(;base64)?,(.*)$/is;

const tooLarge = (maxBytes: number) =>
	new Error(
		`The file is larger than the ${Math.round(maxBytes / (1024 * 1024))} MB limit.`,
	);

/** Holds bytes from any input to the caller's limit, the way a download is held. */
function withinLimit(
	bytes: Uint8Array,
	maxBytes: number | undefined,
): Uint8Array {
	if (bytes.byteLength === 0) throw new Error('The file is empty.');
	if (maxBytes !== undefined && bytes.byteLength > maxBytes)
		throw tooLarge(maxBytes);
	return bytes;
}

/**
 * A data URL's percent-encoded body as the bytes it encodes; `%FF` is byte 255, not text.
 *
 * Decoding stops once the output passes `maxBytes`, and a body too long to fit
 * is refused before it is encoded at all.
 */
function fromPercentEncoded(
	body: string,
	maxBytes: number | undefined,
): Uint8Array {
	// Every three characters decode to at least one byte (`%41` is the tightest).
	if (maxBytes !== undefined && Math.ceil(body.length / 3) > maxBytes)
		throw tooLarge(maxBytes);
	const raw = new TextEncoder().encode(body);
	const out = new Uint8Array(
		maxBytes === undefined ? raw.length : Math.min(raw.length, maxBytes),
	);
	let length = 0;
	for (let i = 0; i < raw.length; i++) {
		if (maxBytes !== undefined && length === maxBytes) throw tooLarge(maxBytes);
		// The digits come from the bytes too: `i` counts bytes, so a non-ASCII
		// character earlier in `body` would shift a string index.
		const hex =
			raw[i] === 0x25
				? String.fromCharCode(raw[i + 1] ?? 0, raw[i + 2] ?? 0)
				: '';
		if (/^[0-9a-fA-F]{2}$/.test(hex)) {
			out[length++] = Number.parseInt(hex, 16);
			i += 2;
		} else {
			out[length++] = raw[i] as number;
		}
	}
	return length === out.length ? out : out.slice(0, length);
}

const notBase64 = () => new Error('The file is not valid base64.');

// Tab, line feed, vertical tab, form feed, carriage return and space.
const ASCII_WHITESPACE = new Set([0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x20]);

/**
 * A base64 data URL's body as base64 text. Like `fetch`, the body is
 * percent-decoded first, so `%2Fw%3D%3D` reads as `/w==`. Whitespace, escaped
 * or not, is dropped because base64 ignores it, and the text that remains is
 * held to the longest base64 that can fit `maxBytes`. A plain `{ base64 }`
 * input is not a URL and skips this.
 */
function base64Text(body: string, maxBytes: number | undefined): string {
	if (!body.includes('%')) return body;
	const text = body.replace(/\s+/g, '');
	// Padded base64 is 4 characters for every 3 bytes, so longer text is over the limit.
	const cap =
		maxBytes === undefined
			? text.length
			: Math.min(text.length, Math.ceil(maxBytes / 3) * 4);
	const out = new Uint8Array(cap);
	let length = 0;
	for (let i = 0; i < text.length; i++) {
		let code = text.charCodeAt(i);
		const hex = code === 0x25 ? text.slice(i + 1, i + 3) : '';
		if (/^[0-9a-fA-F]{2}$/.test(hex)) {
			code = Number.parseInt(hex, 16);
			i += 2;
		}
		if (ASCII_WHITESPACE.has(code)) continue;
		// Base64 is ASCII; anything wider is refused, not cut down to a byte.
		if (code > 0x7f) throw notBase64();
		if (length === cap) throw tooLarge(maxBytes ?? cap);
		out[length++] = code;
	}
	return Buffer.from(out.buffer, 0, length).toString('latin1');
}

/**
 * Base64 or base64url text as bytes, by the forgiving-base64 rules browsers use:
 * whitespace is ignored and padding is optional, but `=` only ends a full group
 * of four, and a group left with one character is refused. Node's decoder
 * would drop that character and return a shorter file.
 */
function fromBase64(text: string, maxBytes: number | undefined): Uint8Array {
	let clean = text.replace(/\s+/g, '');
	if (clean.length % 4 === 0) {
		if (clean.endsWith('==')) clean = clean.slice(0, -2);
		else if (clean.endsWith('=')) clean = clean.slice(0, -1);
	}
	if (
		clean.length === 0 ||
		clean.length % 4 === 1 ||
		!/^[A-Za-z0-9+/_-]+$/.test(clean)
	)
		throw notBase64();
	// Without padding, 4 characters are exactly 3 bytes, so the size is known before decoding.
	if (maxBytes !== undefined && Math.floor((clean.length * 3) / 4) > maxBytes)
		throw tooLarge(maxBytes);
	return withinLimit(new Uint8Array(Buffer.from(clean, 'base64')), maxBytes);
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
		if (options.maxBytes !== undefined && input.size > options.maxBytes)
			throw tooLarge(options.maxBytes);
		return build(
			withinLimit(new Uint8Array(await input.arrayBuffer()), options.maxBytes),
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
		const [, type, , isBase64, body = ''] = data;
		const bytes = isBase64
			? fromBase64(base64Text(body, options.maxBytes), options.maxBytes)
			: withinLimit(
					fromPercentEncoded(body, options.maxBytes),
					options.maxBytes,
				);
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
