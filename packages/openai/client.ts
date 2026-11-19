import type { ApiRequestOptions, FileInput, OpenAPIConfig } from 'corsair/http';
import { ApiError, request, resolveFileInput } from 'corsair/http';

export class OpenaiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'OpenaiAPIError';
	}
}

const OPENAI_API_BASE = 'https://api.openai.com/v1';

/** Form field values: scalars or repeated keys (e.g. timestamp_granularities[]). */
export type OpenaiMultipartFieldValue = string | string[] | undefined;

/**
 * Parse OpenAI's `Retry-After` header into milliseconds.
 * Matches corsair/http rate-limit handling (seconds × 1000) so error-handlers can
 * set `headersRetryAfterMs` correctly for fetch-based helpers.
 */
export function parseRetryAfterMs(response: Response): number | undefined {
	const raw = response.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number.parseInt(raw, 10);
	if (!Number.isFinite(seconds) || seconds < 0) return undefined;
	return seconds * 1000;
}

function throwFromFetchResponse(response: Response, bodyText: string): never {
	throw new OpenaiAPIError(
		`Generic Error: status: ${response.status}; status text: ${response.statusText}; body: "${bodyText}"`,
		undefined,
		response.status,
		parseRetryAfterMs(response),
	);
}

/**
 * Query values for OpenAI requests.
 * Arrays are emitted as repeated keys by corsair/http (`include=a&include=b`),
 * which is required for multi-value params such as Conversations `include`.
 */
export type OpenaiQueryValue =
	| string
	| number
	| boolean
	| string[]
	| number[]
	| undefined;

export async function makeOpenaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// body shape varies per endpoint; validated by callers via typed Zod input schemas
		body?: Record<string, unknown>;
		query?: Record<string, OpenaiQueryValue>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;

	const config: OpenAPIConfig = {
		BASE: OPENAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		headers,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		// Forward query for all methods (some OpenAI POST endpoints accept query params)
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError so error-handlers can read status / Retry-After
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new OpenaiAPIError(error.message);
		}
		throw new OpenaiAPIError('Unknown error');
	}
}

const buildUrl = (endpoint: string): string => {
	const baseUrl = OPENAI_API_BASE.endsWith('/')
		? OPENAI_API_BASE.slice(0, -1)
		: OPENAI_API_BASE;
	const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	return `${baseUrl}/${path}`;
};

/**
 * OpenAI's documented upload limits. A link or base64 is held to them when it is
 * turned into bytes, so an oversized file fails here instead of at OpenAI.
 */
export const OPENAI_UPLOAD_MAX_BYTES = {
	/** Files API: "Individual files can be up to 512 MB". */
	file: 512 * 1024 * 1024,
	/** Audio transcriptions and translations: "File uploads are currently limited to 25 MB". */
	audio: 25 * 1024 * 1024,
	/** Image edits: gpt-image-1 takes "a png, webp, or jpg file less than 50MB". */
	imageEdit: 50 * 1024 * 1024,
	/** Image variations and edit masks: "a valid PNG file, less than 4MB". */
	imagePng: 4 * 1024 * 1024,
	/** Upload parts: "Each Part can be at most 64 MB". */
	uploadPart: 64 * 1024 * 1024,
} as const;

// A string that starts like this is a link to the file. Any other string is the
// file's own text (a JSONL batch, say), which is what a string meant before.
const LINK = /^(https?:|data:)/i;

/**
 * The bytes to send for a file part. A Blob goes as it was given and a plain
 * string as its text. A link, `{ url }` or `{ base64 }` becomes a File through
 * core's guarded download, held to `maxBytes` (core's 25 MB when unset).
 */
export async function toOpenaiBlob(
	file: FileInput,
	maxBytes?: number,
): Promise<Blob> {
	if (file instanceof Blob) return file;
	if (typeof file === 'string' && !LINK.test(file)) return new Blob([file]);
	return (await resolveFileInput(file, { maxBytes, fallbackName: 'file' }))
		.file;
}

/** One file in a multipart request; `fileName` is the part's name either way. */
export type OpenaiFilePart = {
	field: string;
	file: FileInput;
	fileName: string;
	maxBytes?: number;
};

/**
 * OpenAI's multipart endpoints (e.g. POST /files) need an explicit filename on the
 * uploaded blob part — corsair/http's shared formData builder doesn't pass one through
 * to FormData.append, so this bypasses it with a direct fetch, mirroring
 * packages/box/client.ts's makeBoxUploadRequest.
 */
export async function uploadOpenaiFile<T>(
	endpoint: string,
	apiKey: string,
	options: {
		file: FileInput;
		fileName: string;
		fields: Record<string, string | undefined>;
		maxBytes?: number;
	},
): Promise<T> {
	const { file, fileName, fields, maxBytes } = options;
	const blob = await toOpenaiBlob(file, maxBytes);

	const formData = new FormData();
	formData.append('file', blob, fileName);
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined) formData.append(key, value);
	}

	const response = await fetch(buildUrl(endpoint), {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}` },
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text();
		throwFromFetchResponse(response, text);
	}

	// fetch Response.json() is untyped; cast to the caller-supplied response shape T
	return response.json() as Promise<T>;
}

/**
 * File content downloads (e.g. GET /files/{id}/content) return raw bytes, not JSON —
 * fetch directly instead of going through the JSON-oriented request() helper.
 */
/**
 * Most bytes a download returns inline to a caller without a host. A host that
 * keeps files (setFileSink) caps it at its own limit and gets a `fileId` instead.
 */
export const DOWNLOAD_MAX_BYTES = 100_000_000;

export type OpenaiDownload = {
	bytes: Uint8Array;
	contentType: string | null;
	filename?: string;
};

/**
 * The file name a Content-Disposition header offers, if any (RFC 6266):
 * `filename*=UTF-8''…` first, then a quoted `filename="…"`, then a bare token.
 */
export function dispositionFilename(header: string | null): string | undefined {
	if (!header) return undefined;
	const extended = /filename\*\s*=\s*[^']*'[^']*'([^;\s]+)/i.exec(header);
	if (extended?.[1]) {
		try {
			const name = decodeURIComponent(extended[1]);
			if (name) return name;
		} catch {
			// A malformed percent-escape: fall back to the plain parameter.
		}
	}
	const quoted = /filename\s*=\s*"((?:[^"\\]|\\.)*)"/i.exec(header);
	if (quoted) return quoted[1]?.replace(/\\(.)/g, '$1') || undefined;
	return /filename\s*=\s*([^;\s]+)/i.exec(header)?.[1] || undefined;
}

export async function downloadOpenaiFile(
	endpoint: string,
	apiKey: string,
): Promise<OpenaiDownload> {
	const response = await fetch(buildUrl(endpoint), {
		method: 'GET',
		headers: { Authorization: `Bearer ${apiKey}` },
	});

	if (!response.ok) {
		const text = await response.text();
		throwFromFetchResponse(response, text);
	}

	const filename = dispositionFilename(
		response.headers.get('content-disposition'),
	);
	return {
		bytes: new Uint8Array(await response.arrayBuffer()),
		contentType: response.headers.get('content-type'),
		...(filename ? { filename } : {}),
	};
}

/**
 * Parse a successful multipart/form POST body from OpenAI.
 *
 * Whisper transcription/translation can return plain text (`text`, `srt`, `vtt`)
 * instead of JSON. Always calling `response.json()` throws SyntaxError on those
 * formats. JSON content-types (and JSON-looking bodies) are parsed as JSON;
 * everything else is wrapped as `{ text }` to match audio response schemas.
 */
export function parseOpenaiMultipartBody<T>(
	contentType: string | null,
	bodyText: string,
): T {
	const ct = (contentType ?? '').toLowerCase();
	const contentTypeSaysJson =
		ct.includes('application/json') || ct.includes('+json');

	if (contentTypeSaysJson) {
		return JSON.parse(bodyText) as T;
	}

	// Some gateways omit/mislabel content-type; still try JSON when body looks like it.
	const trimmed = bodyText.trimStart();
	if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
		try {
			return JSON.parse(bodyText) as T;
		} catch {
			// fall through to plain-text handling
		}
	}

	// text/plain, text/vtt, application/x-subrip, empty type with SRT/VTT body, etc.
	// Matches audio response schemas that require a top-level `text` field.
	return { text: bodyText } as T;
}

/**
 * Endpoints that accept one or more file parts alongside plain fields
 * (audio transcription/translation, image edits/variations, skill uploads,
 * container files). Bypasses corsair/http's shared formData builder for the
 * same filename reason as uploadOpenaiFile.
 *
 * String-array field values are appended once per entry (required for OpenAI
 * form keys like `timestamp_granularities[]`).
 *
 * Response handling supports both JSON and plain-text Whisper formats
 * (`text` / `srt` / `vtt`) via {@link parseOpenaiMultipartBody}.
 */
export async function multipartOpenaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		files: OpenaiFilePart[];
		fields?: Record<string, OpenaiMultipartFieldValue>;
	},
): Promise<T> {
	const { files, fields = {} } = options;

	// Every file is fetched or decoded before anything is sent to OpenAI.
	const parts = await Promise.all(
		files.map(async ({ field, file, fileName, maxBytes }) => ({
			field,
			fileName,
			blob: await toOpenaiBlob(file, maxBytes),
		})),
	);
	const formData = new FormData();
	for (const { field, blob, fileName } of parts) {
		formData.append(field, blob, fileName);
	}
	for (const [key, value] of Object.entries(fields)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				formData.append(key, item);
			}
		} else {
			formData.append(key, value);
		}
	}

	const response = await fetch(buildUrl(endpoint), {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}` },
		body: formData,
	});

	// Always read as text first so non-JSON Whisper formats (text/srt/vtt)
	// never hit response.json() and throw SyntaxError.
	const bodyText = await response.text();

	if (!response.ok) {
		throwFromFetchResponse(response, bodyText);
	}

	return parseOpenaiMultipartBody<T>(
		response.headers.get('content-type'),
		bodyText,
	);
}

/**
 * Endpoints whose response is raw bytes rather than JSON even though the
 * request itself is a normal JSON POST (e.g. text-to-speech audio output).
 */
export async function requestOpenaiBinary(
	endpoint: string,
	apiKey: string,
	options: { body: Record<string, unknown> },
): Promise<ArrayBuffer> {
	const response = await fetch(buildUrl(endpoint), {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(options.body),
	});

	if (!response.ok) {
		const text = await response.text();
		throwFromFetchResponse(response, text);
	}

	return response.arrayBuffer();
}
