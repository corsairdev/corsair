import { logEventFromContext } from 'corsair/core';
import type { ApiRequestOptions } from 'corsair/http';
import { ApiError } from 'corsair/http';

export const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io';

/**
 * How long one call may take, by kind. A timed-out generation can still finish
 * and bill on ElevenLabs' side, so these are generous. A script on Corsair's
 * cloud has a 25 s wall (SCRIPT_WALL_MS in Hub), which is the shorter limit there.
 * Single runs on 2026-11-08 took 7 s or less: a 10 s sound effect 2.1 s, 530
 * characters of speech 1.1 to 1.7 s, 60 s of music 6.9 s. Long transcription,
 * isolation, voice changer and stems weren't timed.
 */
export const TIMEOUTS_MS = {
	read: 30_000,
	shortGeneration: 120_000,
	longGeneration: 300_000,
} as const;

/** An HTTP answer from ElevenLabs that wasn't a success. */
export class ElevenLabsAPIError extends ApiError {
	/** `detail.code`, or the older `detail.status` where only that is sent. */
	public readonly code?: string;
	public readonly errorType?: string;
	public readonly requestId?: string;
	public readonly param?: string;

	constructor(
		request: ApiRequestOptions,
		response: {
			url: string;
			status: number;
			statusText: string;
			// unknown: the provider's error body, kept as sent (with the key scrubbed).
			body: unknown;
		},
		parsed: ParsedError,
		retryAfter: number | undefined,
	) {
		super(
			request,
			{ ...response, ok: false },
			formatMessage(response.status, parsed, request.method),
			{ retryAfter },
		);
		this.name = 'ElevenLabsAPIError';
		this.code = parsed.code;
		this.errorType = parsed.type;
		this.requestId = parsed.requestId;
		this.param = parsed.param;
	}
}

/** No usable HTTP answer: bad input to the client, a network fault or a timeout. */
export class ElevenLabsRequestError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ElevenLabsRequestError';
	}
}

type ParsedError = {
	message: string;
	code?: string;
	type?: string;
	requestId?: string;
	param?: string;
};

/** What to tell a caller when a call that may spend credits ended with no clear answer. */
const MAY_HAVE_RUN =
	'ElevenLabs may still have run it, so check before sending it again (a generation bills again).';

function formatMessage(
	status: number,
	parsed: ParsedError,
	method: string,
): string {
	const code = parsed.code ? ` ${parsed.code}` : '';
	const requestId = parsed.requestId ? ` (request id ${parsed.requestId})` : '';
	const consequence =
		status === 402
			? ' Nothing was generated; add credits in the ElevenLabs dashboard before trying again.'
			: status >= 500 && method !== 'GET'
				? ` ${MAY_HAVE_RUN}`
				: '';
	return `ElevenLabs ${status}${code}: ${parsed.message}${consequence}${requestId}`;
}

/**
 * ElevenLabs sends `detail` in three shapes: an object
 * `{type, code, message, request_id, param, status}`, a legacy string, or a
 * validation list `[{loc, msg, type}]`. Anything else is reported as sent.
 */
export function parseErrorBody(
	// unknown: the error body before it is told apart.
	body: unknown,
	fallback: string,
): ParsedError {
	if (typeof body === 'string' && body.trim()) {
		return { message: body.trim().slice(0, 500) };
	}
	if (!body || typeof body !== 'object') return { message: fallback };
	// unknown: `detail` is one of the shapes above; each branch narrows it.
	const detail = (body as { detail?: unknown }).detail;

	if (typeof detail === 'string' && detail.trim()) {
		return { message: detail.trim() };
	}

	if (Array.isArray(detail)) {
		const items = detail.map((item) => {
			// unknown: loc mixes field names and list indexes.
			const entry = (item ?? {}) as { loc?: unknown[]; msg?: string };
			const loc = Array.isArray(entry.loc) ? entry.loc.join('.') : '';
			return { loc, text: loc ? `${loc}: ${entry.msg}` : (entry.msg ?? '') };
		});
		return {
			message: items.map((item) => item.text).join('; ') || fallback,
			type: 'validation_error',
			param: items[0]?.loc || undefined,
		};
	}

	if (detail && typeof detail === 'object') {
		// unknown: every field of the object form is read as optional text below.
		const fields = detail as Record<string, unknown>;
		const text = (key: string) =>
			typeof fields[key] === 'string' && fields[key]
				? (fields[key] as string)
				: undefined;
		return {
			message: text('message') ?? fallback,
			code: text('code') ?? text('status'),
			type: text('type'),
			requestId: text('request_id'),
			param: text('param'),
		};
	}

	return { message: fallback };
}

export function parseRetryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const seconds = Number(header);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const at = Date.parse(header);
	return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
}

const scrub = (text: string, apiKey: string) =>
	apiKey ? text.split(apiKey).join('[redacted]') : text;

type QueryValue = string | number | boolean | readonly string[] | undefined;

export type ElevenLabsRequestInit = {
	method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	query?: Record<string, QueryValue>;
	/** JSON body. */
	// unknown: each endpoint builds its own body; the transport only serialises it.
	json?: unknown;
	/** Multipart body, for the endpoints that take a file. */
	form?: FormData;
	timeoutMs?: number;
};

function buildUrl(path: string, query: ElevenLabsRequestInit['query']): string {
	const url = new URL(`${ELEVENLABS_API_BASE}${path}`);
	for (const [name, value] of Object.entries(query ?? {})) {
		if (value === undefined) continue;
		if (typeof value === 'string' || typeof value !== 'object') {
			url.searchParams.set(name, String(value));
		} else {
			for (const item of value) url.searchParams.append(name, item);
		}
	}
	return url.toString();
}

/**
 * One attempt, nothing retried here: retries are error-handlers.ts's call,
 * because a retried generation bills twice and ElevenLabs has no idempotency
 * keys. Answers only with a success; anything else throws.
 */
async function send(
	path: string,
	apiKey: string,
	init: ElevenLabsRequestInit,
): Promise<Response> {
	const method = init.method ?? 'GET';
	const url = buildUrl(path, init.query);
	const timeoutMs = init.timeoutMs ?? TIMEOUTS_MS.read;
	const headers: Record<string, string> = { 'xi-api-key': apiKey };
	if (init.json !== undefined) headers['Content-Type'] = 'application/json';

	let response: Response;
	try {
		response = await fetch(url, {
			method,
			headers,
			body:
				init.form ??
				(init.json !== undefined ? JSON.stringify(init.json) : undefined),
			signal: AbortSignal.timeout(timeoutMs),
		});
	} catch (error) {
		const timedOut =
			error instanceof Error &&
			(error.name === 'TimeoutError' || error.name === 'AbortError');
		const what = timedOut
			? `timed out after ${Math.round(timeoutMs / 1000)} s`
			: `failed: ${scrub(error instanceof Error ? error.message : String(error), apiKey)}`;
		throw new ElevenLabsRequestError(
			`ElevenLabs ${method} ${path} ${what}.${method === 'GET' ? '' : ` ${MAY_HAVE_RUN}`}`,
		);
	}

	if (response.ok) return response;

	const text = scrub(await response.text().catch(() => ''), apiKey);
	// unknown: JSON of any shape, or plain text from a proxy in front of the API.
	let body: unknown = text;
	try {
		body = JSON.parse(text);
	} catch {
		// Not JSON: the text itself is the message.
	}
	const parsed = parseErrorBody(
		body,
		response.statusText || 'request failed with no error body',
	);
	// By default error-handlers.ts doesn't retry a generation on this error unless
	// ElevenLabs refused it with a 429 before running it. That's a default: a
	// matching custom handler in createCorsair's or this plugin's errorHandlers can
	// still retry it, and then a 5xx that did run bills twice.
	throw new ElevenLabsAPIError(
		{ method, url: path },
		{
			url,
			status: response.status,
			statusText: response.statusText,
			body,
		},
		{
			...parsed,
			requestId:
				parsed.requestId ?? response.headers.get('x-trace-id') ?? undefined,
		},
		parseRetryAfterMs(response.headers.get('retry-after')),
	);
}

/** Reads the body of a success; a transfer that breaks here may already have billed. */
async function readBody<T>(
	path: string,
	method: string,
	read: () => Promise<T>,
): Promise<T> {
	try {
		return await read();
	} catch (error) {
		throw new ElevenLabsRequestError(
			`ElevenLabs ${method} ${path} answered, but reading the response failed: ${error instanceof Error ? error.message : String(error)}. It may have been billed, so check before sending it again.`,
		);
	}
}

/** A JSON call; `T` is unchecked here, each endpoint parses it with its schema. */
export async function elevenLabsJson<T>(
	path: string,
	apiKey: string,
	init: ElevenLabsRequestInit = {},
): Promise<T> {
	const { body } = await elevenLabsJsonWithHeaders<T>(path, apiKey, init);
	return body;
}

export async function elevenLabsJsonWithHeaders<T>(
	path: string,
	apiKey: string,
	init: ElevenLabsRequestInit = {},
): Promise<{ body: T; metadata: ResponseMetadata }> {
	const response = await send(path, apiKey, init);
	const text = await readBody(path, init.method ?? 'GET', () =>
		response.text(),
	);
	let body: T;
	try {
		// A few deletes answer with an empty body.
		body = (text ? JSON.parse(text) : {}) as T;
	} catch {
		throw new ElevenLabsRequestError(
			`ElevenLabs ${init.method ?? 'GET'} ${path} answered with something that isn't JSON.`,
		);
	}
	return { body, metadata: responseMetadata(response) };
}

// ── Binary responses ────────────────────────────────────────────────────────

/** What ElevenLabs reports about a generation in its response headers. */
export type ResponseMetadata = {
	requestId?: string;
	traceId?: string;
	/** Credits charged, from `character-cost`. */
	characterCost?: number;
	historyItemId?: string;
	songId?: string;
};

export function responseMetadata(response: Response): ResponseMetadata {
	const header = (name: string) => response.headers.get(name) ?? undefined;
	const cost = Number(header('character-cost'));
	return {
		requestId: header('request-id'),
		traceId: header('x-trace-id'),
		characterCost:
			header('character-cost') !== undefined && Number.isFinite(cost)
				? cost
				: undefined,
		historyItemId: header('history-item-id'),
		songId: header('song-id'),
	};
}

export type FetchedBinary = ResponseMetadata & {
	bytes: Buffer;
	contentType: string;
};

/** A call that answers with raw bytes (audio, video, a zip). */
export async function elevenLabsBinary(
	path: string,
	apiKey: string,
	init: ElevenLabsRequestInit = {},
): Promise<FetchedBinary> {
	const response = await send(path, apiKey, init);
	const buffer = await readBody(path, init.method ?? 'GET', () =>
		response.arrayBuffer(),
	);
	return {
		...responseMetadata(response),
		bytes: Buffer.from(buffer),
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
	};
}

/**
 * Most a result carries inline when the bytes can be fetched again, sized so the
 * base64 fits the 1,000,000 byte cap on a script's result on Corsair's cloud
 * (maxResultBytes in Hub). About 43 s of 128 kbps mp3.
 */
export const DEFAULT_MAX_CONTENT_BYTES = 700_000;
/** Most any result carries inline, whatever the caller asks. */
export const HARD_MAX_CONTENT_BYTES = 50 * 1024 * 1024;

export type BinaryResultOptions = {
	includeContent?: boolean;
	maxBytes?: number;
	/** The bytes can be read again from where they came (a read, not a generation). */
	refetchable?: boolean;
	/** Where to download them directly when they're over HARD_MAX_CONTENT_BYTES. */
	downloadPath?: string;
};

const directDownload = (path: string) =>
	`Over ${HARD_MAX_CONTENT_BYTES} bytes it can't come back in a result, so download it directly: GET ${ELEVENLABS_API_BASE}${path} with your xi-api-key header.`;

/**
 * Decides whether the bytes stay out of the result, and says why and how to get
 * them. Audio that can be fetched again (it has a history item, or this call was
 * itself a read) is left out when the caller asks or when it's over the limit.
 * Audio that can't be fetched again was paid for and exists nowhere else, so it's
 * left out only over HARD_MAX_CONTENT_BYTES, and the note says it's gone.
 */
export function contentOmission(
	byteLength: number,
	historyItemId: string | undefined,
	options: BinaryResultOptions = {},
):
	| { contentOmitted: 'not_requested' | 'over_limit'; note: string }
	| undefined {
	const refetchable = options.refetchable || Boolean(historyItemId);

	if (refetchable && options.includeContent === false) {
		return {
			contentOmitted: 'not_requested',
			note: historyItemId
				? `Left out as asked. Read it with history.getAudio({ historyItemId: '${historyItemId}' }); a new item can take a few seconds to appear.`
				: 'Left out as asked. Ask again with includeContent true to get it.',
		};
	}

	const limit = refetchable
		? Math.min(
				options.maxBytes ?? DEFAULT_MAX_CONTENT_BYTES,
				HARD_MAX_CONTENT_BYTES,
			)
		: HARD_MAX_CONTENT_BYTES;
	if (byteLength <= limit) return undefined;

	const downloadPath =
		options.downloadPath ??
		(historyItemId ? `/v1/history/${pathId(historyItemId)}/audio` : undefined);
	const how = !refetchable
		? "ElevenLabs keeps no copy of this output, so it can't be fetched again; generate less at a time."
		: byteLength > HARD_MAX_CONTENT_BYTES && downloadPath
			? directDownload(downloadPath)
			: historyItemId
				? `Read it with history.getAudio({ historyItemId: '${historyItemId}', maxBytes: ${byteLength} }).`
				: `Read it again with maxBytes: ${byteLength}.`;
	return {
		contentOmitted: 'over_limit',
		note: `${byteLength} bytes is over the ${limit} byte limit for a result. ${how}`,
	};
}

/** Puts fetched bytes in a result, unless contentOmission says they stay out. */
export function toBinaryResult(
	fetched: FetchedBinary,
	options: BinaryResultOptions = {},
) {
	const { bytes, ...fields } = fetched;
	const byteLength = bytes.byteLength;
	const omission = contentOmission(byteLength, fetched.historyItemId, options);
	return omission
		? { ...fields, byteLength, ...omission }
		: { ...fields, byteLength, contentBase64: bytes.toString('base64') };
}

/**
 * Writes the event log without ever failing the call. The work behind a result is
 * already done and often paid for, so a log entry that can't be written (no KEK
 * with encryptDataAtRest on, a database fault) must not throw that result away.
 * It warns the way core's logger does, so a missing KEK still shows up.
 */
export async function logQuietly(
	ctx: Parameters<typeof logEventFromContext>[0],
	event: string,
	// unknown: the event's fields, stored as given.
	payload: Record<string, unknown>,
) {
	try {
		await logEventFromContext(ctx, event, payload, 'completed');
	} catch (error) {
		console.warn('Failed to log event:', error);
	}
}

// ── Inputs ──────────────────────────────────────────────────────────────────

/** An id for a URL path. `encodeURIComponent` leaves `.` and `..`, which fetch would resolve away. */
export function pathId(value: string): string {
	if (value === '.' || value === '..') {
		throw new ElevenLabsRequestError(`"${value}" is not a valid id.`);
	}
	return encodeURIComponent(value);
}

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

/**
 * Decodes standard or URL-safe base64, padded or not, after checking the
 * decoded size. Node's decoder silently drops an incomplete last group, so a
 * length that leaves one spare character, or padding that doesn't complete the
 * last group, is refused rather than uploaded as a shorter file.
 */
export function decodeBase64(content: string): Buffer {
	const data = content
		.replace(/^data:[^,]*;base64,/, '')
		.replace(/\s+/g, '')
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const unpadded = data.replace(/={1,2}$/, '');
	const padded = data.length !== unpadded.length;
	if (
		!/^[A-Za-z0-9+/]*$/.test(unpadded) ||
		unpadded.length % 4 === 1 ||
		(padded && data.length % 4 !== 0)
	) {
		throw new ElevenLabsRequestError('fileBase64 is not valid base64.');
	}
	const size = Math.floor((unpadded.length * 3) / 4);
	if (size === 0) {
		throw new ElevenLabsRequestError('fileBase64 decodes to an empty file.');
	}
	if (size > MAX_UPLOAD_BYTES) {
		throw new ElevenLabsRequestError(
			`fileBase64 decodes to ${size} bytes; the limit here is ${MAX_UPLOAD_BYTES}. Where the operation takes sourceUrl, pass a URL instead.`,
		);
	}
	return Buffer.from(unpadded, 'base64');
}

export type FileInput = {
	fileBase64: string;
	fileName?: string;
	contentType?: string;
};

export function appendFile(form: FormData, field: string, file: FileInput) {
	const blob = new Blob([new Uint8Array(decodeBase64(file.fileBase64))], {
		type: file.contentType ?? 'application/octet-stream',
	});
	form.append(field, blob, file.fileName ?? 'audio');
}

/** Sets multipart fields, skipping undefined and JSON-encoding objects. */
export function appendFields(
	form: FormData,
	// unknown: form fields come from different typed inputs and only their string form is sent.
	fields: Record<string, unknown>,
) {
	for (const [name, value] of Object.entries(fields)) {
		if (value === undefined || value === null) continue;
		form.append(
			name,
			typeof value === 'object' ? JSON.stringify(value) : String(value),
		);
	}
}

/** Best-effort bytes behind a base64 string, without decoding it. */
export function base64ByteLength(value: string): number {
	const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;
	return Math.max(0, Math.floor((value.length * 3) / 4) - padding);
}

/** The audio type an `output_format` such as mp3_44100_128 produces. */
export function contentTypeOfOutputFormat(format: string | undefined): string {
	const codec = (format ?? 'mp3').split('_')[0];
	switch (codec) {
		case 'mp3':
			return 'audio/mpeg';
		case 'pcm':
			return 'audio/pcm';
		case 'ulaw':
			return 'audio/basic';
		case 'alaw':
			return 'audio/alaw';
		case 'opus':
			return 'audio/opus';
		case 'wav':
			return 'audio/wav';
		default:
			return 'application/octet-stream';
	}
}
