import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GOOGLE_PHOTOS_API_BASE = 'https://photoslibrary.googleapis.com/v1';

/** The upload endpoint, which is the base with `/uploads` appended. */
export const GOOGLE_PHOTOS_UPLOAD_URL = `${GOOGLE_PHOTOS_API_BASE}/uploads`;

/**
 * The Library API allows 10,000 requests per project per day, and a 429 can
 * also mean a per-user rate limit. The upload guide asks for a minimum 30
 * second delay after a 429, hence the fallback below.
 */
const GOOGLE_PHOTOS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Retries belong to error-handlers.ts, which knows a read may be repeated
	// and an upload may not.
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** An array value is sent as one repeated parameter per entry. */
export type GooglePhotosQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type GooglePhotosRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** A path below the `/v1` segment, e.g. `/albums`. */
	path: string;
	query?: GooglePhotosQuery;
	// unknown: each endpoint builds this from a zod-parsed input.
	body?: unknown; // unknown: each endpoint builds this from a zod-parsed input.
};

/**
 * A failure that never reached Google. It carries whether the request only read,
 * so the handlers can replay a read and leave an upload or a write alone.
 */
export class GooglePhotosTransportError extends Error {
	readonly isRead: boolean;

	constructor(message: string, isRead: boolean, cause: Error) {
		super(message, { cause });
		this.name = 'GooglePhotosTransportError';
		this.isRead = isRead;
	}
}

export function isReadMethod(method: GooglePhotosRequest['method']): boolean {
	return method === 'GET';
}

/**
 * Sends one Library API request.
 *
 * core's ApiError is rethrown untouched (R8) so a 429 keeps its status and the
 * handlers can read it. Anything else failed before a response arrived.
 *
 * unknown: the resolved value is the raw response body; callers parse it with
 * the endpoint's zod output schema. It is undefined for a bodyless success.
 */
export async function makeGooglePhotosRequest(
	token: string,
	{ method, path, query, body }: GooglePhotosRequest,
): Promise<unknown> {
	// unknown: parsed by the caller's output schema.
	const config: OpenAPIConfig = {
		BASE: GOOGLE_PHOTOS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: method === 'GET' ? undefined : body,
		mediaType: method === 'GET' ? undefined : 'application/json',
	};

	try {
		// unknown: the body is checked by the caller's output schema.
		// unknown: the response body is checked by the caller's output schema.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: GOOGLE_PHOTOS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw error;
		// DOMException (a timeout or abort) can fail `instanceof Error` across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GooglePhotosTransportError(
				error.message,
				isReadMethod(method),
				error,
			);
		}
		throw new GooglePhotosTransportError(
			'Unknown transport failure',
			isReadMethod(method),
			new Error('Unknown'),
		);
	}
}

/**
 * Uploads bytes and returns the upload token, which is a raw text body rather
 * than JSON.
 *
 * The guide documents three headers: `Content-type: application/octet-stream`,
 * `X-Goog-Upload-Content-Type` with the real MIME type (recommended), and
 * `X-Goog-Upload-Protocol: raw`. A successful upload answers the token as plain
 * text with a 200, so the body is read as text here instead of through the JSON
 * client.
 */
export async function uploadMediaBytes(
	token: string,
	bytes: Uint8Array,
	contentType: string,
): Promise<string> {
	const url = GOOGLE_PHOTOS_UPLOAD_URL;
	// The guide marks X-Goog-Upload-Content-Type as recommended. A generic
	// octet-stream says nothing, so it is left out and Google detects the type.
	const knownType =
		contentType && contentType.toLowerCase() !== 'application/octet-stream';
	const requestInit: RequestInit = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/octet-stream',
			...(knownType ? { 'X-Goog-Upload-Content-Type': contentType } : {}),
			'X-Goog-Upload-Protocol': 'raw',
		},
		body: new Uint8Array(bytes),
		signal: AbortSignal.timeout(120_000),
	};

	let response: Response;
	try {
		response = await fetch(url, requestInit);
	} catch (error) {
		throw new GooglePhotosTransportError(
			error instanceof Error ? error.message : 'Upload failed',
			false,
			error instanceof Error ? error : new Error('Upload failed'),
		);
	}

	if (!response.ok) {
		// The upload endpoint answers its failures in the same envelope as the
		// rest of the API, so core's ApiError is built from it for the handlers.
		const text = await response.text().catch(() => '');
		const parsed = parseJsonOrUndefined(text);
		const retryAfter = retryAfterMs(response.headers.get('retry-after'));
		throw new ApiError(
			{ method: 'POST', url },
			{
				url,
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: parsed ?? text,
			},
			readErrorMessage(parsed) ?? (response.statusText || 'Upload failed'),
			// core's request() reads Retry-After for JSON calls; this fetch has to
			// carry it itself so the 429 handler waits as long as Google asked.
			retryAfter === undefined ? undefined : { retryAfter },
		);
	}

	const uploadToken = (await response.text()).trim();
	if (!uploadToken) {
		throw new Error(
			'The upload answered 200 with an empty body; no upload token was returned',
		);
	}
	return uploadToken;
}

/**
 * A Retry-After header in milliseconds: either delay-seconds or an HTTP date.
 * Undefined when it is missing or unreadable.
 */
export function retryAfterMs(header: string | null): number | undefined {
	if (!header) return undefined;
	const trimmed = header.trim();
	if (/^\d+$/.test(trimmed)) return Number(trimmed) * 1000;
	const at = Date.parse(trimmed);
	if (Number.isNaN(at)) return undefined;
	return Math.max(0, at - Date.now());
}

/**
 * unknown: an error body is untyped until read. A proxy can answer HTML or text
 * where Google sends JSON.
 */
function parseJsonOrUndefined(text: string): unknown {
	// unknown: parse output.
	if (!text) return undefined;
	try {
		return JSON.parse(text) as unknown; // unknown: JSON has no static type.
	} catch {
		return undefined;
	}
}

/**
 * The message on Google's error envelope.
 *
 * unknown: same open error body as above.
 */
function readErrorMessage(
	body: unknown, // unknown: an error body until its members are checked.
): string | undefined {
	if (body === null || typeof body !== 'object') return undefined;
	// unknown: the envelope's members are read one field at a time.
	const error = (body as { error?: unknown }).error; // unknown: envelope member.
	if (error !== null && typeof error === 'object') {
		const message = (error as { message?: unknown }).message; // unknown: member.
		if (typeof message === 'string') return message;
	}
	const message = (body as { message?: unknown }).message; // unknown: member.
	return typeof message === 'string' ? message : undefined;
}

/**
 * A base URL is not usable as it is: the docs say a parameter must be appended
 * before the bytes can be fetched, and a base URL stops working 60 minutes
 * after the read that returned it.
 *
 * `=d` downloads a photo's original bytes without the location metadata, and
 * `=dv` downloads a video's bytes (`=d` on a video is outside the documented
 * contract). `=w<width>-h<height>` returns a scaled copy (a thumbnail for a
 * video), and `-c` crops it to exactly those dimensions.
 */
export type MediaBaseUrlOptions = {
	/** Download the original bytes instead of a scaled copy. */
	download?: boolean;
	/**
	 * The item is a video, so a download uses `=dv`. Read from the item itself
	 * when a media item is passed; needed only with a bare base URL string.
	 */
	video?: boolean;
	/** Requested width in pixels; must be paired with a height. */
	width?: number;
	/** Requested height in pixels; must be paired with a width. */
	height?: number;
	/** Crop to exactly the requested dimensions rather than preserving aspect. */
	crop?: boolean;
};

/** The parts of a media item mediaBytesUrl reads. */
export type MediaBaseUrlItem = {
	baseUrl?: string | null;
	mimeType?: string | null;
	// unknown: only its presence marks the item as a video.
	mediaMetadata?: { video?: unknown } | null;
};

function isVideoItem(item: MediaBaseUrlItem): boolean {
	if (item.mimeType?.toLowerCase().startsWith('video/')) return true;
	return (
		item.mediaMetadata?.video !== undefined &&
		item.mediaMetadata?.video !== null
	);
}

/**
 * Builds the fetchable URL for a media item's bytes. Pass the media item from
 * a read so a video download gets `=dv`, or a bare `baseUrl` with
 * `video: true` for a video.
 */
export function mediaBytesUrl(
	itemOrBaseUrl: string | MediaBaseUrlItem,
	options: MediaBaseUrlOptions = {},
): string {
	const baseUrl =
		typeof itemOrBaseUrl === 'string' ? itemOrBaseUrl : itemOrBaseUrl.baseUrl;
	if (!baseUrl) {
		throw new Error('The media item has no baseUrl');
	}
	const video =
		options.video ??
		(typeof itemOrBaseUrl === 'string' ? false : isVideoItem(itemOrBaseUrl));
	if (options.download) return `${baseUrl}=${video ? 'dv' : 'd'}`;
	const { width, height, crop } = options;
	if (width === undefined && height === undefined) {
		throw new Error(
			'A base URL needs a size: pass download, or both width and height',
		);
	}
	if (width === undefined || height === undefined) {
		throw new Error(
			'The API takes width and height together; pass both or neither',
		);
	}
	if (!Number.isInteger(width) || width <= 0) {
		throw new Error('width must be a positive integer');
	}
	if (!Number.isInteger(height) || height <= 0) {
		throw new Error('height must be a positive integer');
	}
	return `${baseUrl}=w${width}-h${height}${crop ? '-c' : ''}`;
}

/** Encodes one path segment: album and media item ids are opaque strings. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
