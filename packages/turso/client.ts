import { asRecord } from 'corsair/core';
/**
 * Custom error class for failures originating from Turso APIs.
 */
export class TursoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		/** Milliseconds to wait before retrying, from the Retry-After header. */
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'TursoAPIError';
	}
}

/**
 * Turso platform API host.
 *
 * Docs: https://docs.turso.tech/api-reference
 */
export const TURSO_API_BASE = 'https://api.turso.tech';

/**
 * Closest-region service. Unauthenticated by design — it reports which edge
 * location answered, so a credential would tell it nothing extra.
 *
 * Docs: https://docs.turso.tech/api-reference/locations/closest-region
 */
export const TURSO_REGION_BASE = 'https://region.turso.io';

/**
 * Hosts that may receive an authenticated Turso request.
 *
 * `databaseUrl` is caller-supplied and the change stream sends the tenant's
 * bearer token to it, so the destination is pinned to Turso's own domain.
 * Without this a caller could name any host and harvest the credential.
 */
const TURSO_DATABASE_SUFFIX = '.turso.io';

/**
 * Reports whether a URL is an https Turso database host.
 *
 * @param value - Candidate database URL.
 * @returns True when the URL is safe to send a credential to.
 */
export function isTursoDatabaseUrl(value: string): boolean {
	let parsed: URL;
	try {
		parsed = new URL(value);
	} catch {
		return false;
	}
	if (parsed.protocol !== 'https:') return false;
	return (
		parsed.hostname === 'turso.io' ||
		parsed.hostname.endsWith(TURSO_DATABASE_SUFFIX)
	);
}

/** Request timeout for non-streaming Turso calls. */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Reads an error body from Turso, which answers with either `{ error }` or a
 * bare string depending on the surface.
 *
 * @param status - HTTP status of the failed response.
 * @param rawText - Raw response body.
 * @returns The error to throw.
 */
function tursoError(
	status: number,
	rawText: string,
	retryAfter?: number,
): TursoAPIError {
	let message = `Turso request failed with status ${status}`;
	try {
		const body = asRecord(JSON.parse(rawText));
		if (body) {
			const detail =
				typeof body.error === 'string' && body.error.length > 0
					? body.error
					: typeof body.message === 'string' && body.message.length > 0
						? body.message
						: undefined;
			if (detail) message = detail;
		}
	} catch {
		if (rawText.trim().length > 0) message = rawText.trim();
	}
	return new TursoAPIError(message, undefined, status, retryAfter);
}

/**
 * Reads a `Retry-After` header, which Turso sends in seconds on a 429.
 *
 * @param response - The rate-limited response.
 * @returns The delay in milliseconds, or undefined when absent.
 */
export function retryAfterMs(response: Response): number | undefined {
	const raw = response.headers.get('retry-after');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const at = Date.parse(raw);
	return Number.isNaN(at) ? undefined : Math.max(0, at - Date.now());
}

/**
 * Performs a JSON request against a Turso host.
 *
 * @param url - Fully qualified request URL.
 * @param options - Method, optional bearer token and optional JSON body.
 * @returns The parsed JSON body, untyped until the caller validates it.
 */
export async function tursoFetchJson(
	url: string,
	options: {
		method?: 'GET' | 'POST';
		apiKey?: string;
		body?: Record<string, unknown>;
	} = {},
): Promise<unknown> {
	const { method = 'GET', apiKey, body } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
			redirect: 'error',
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (err) {
		const detail = err instanceof Error ? `: ${err.message}` : '';
		throw new TursoAPIError(`Failed to reach Turso${detail}`);
	}

	if (!response.ok) {
		throw tursoError(
			response.status,
			await response.text(),
			retryAfterMs(response),
		);
	}

	return response.json();
}

/** One decoded Server-Sent Event. */
export type SseEvent = { event?: string; data: string };

/**
 * Splits a Server-Sent Events buffer into complete events.
 *
 * SSE frames are separated by a blank line; a trailing partial frame is left
 * in the returned remainder so the caller can prepend the next chunk.
 *
 * @param buffer - Accumulated text from the stream.
 * @returns The complete events plus whatever tail is still incomplete.
 */
export function parseSseBuffer(buffer: string): {
	events: SseEvent[];
	rest: string;
} {
	const normalized = buffer.replace(/\r\n/g, '\n');
	const frames = normalized.split('\n\n');
	const rest = frames.pop() ?? '';

	const events: SseEvent[] = [];
	for (const frame of frames) {
		let name: string | undefined;
		const dataLines: string[] = [];
		for (const line of frame.split('\n')) {
			if (line.startsWith('event:')) name = line.slice(6).trim();
			else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
		}
		if (dataLines.length > 0) {
			events.push(
				name
					? { event: name, data: dataLines.join('\n') }
					: { data: dataLines.join('\n') },
			);
		}
	}

	return { events, rest };
}

/**
 * Probes a database with the smallest possible statement over /v2/pipeline.
 *
 * Used as the documented fallback when /beta/listen is unavailable, which
 * Turso notes for AWS regions on the Free, Developer and Scaler plans.
 *
 * @param databaseUrl - Database-specific URL.
 * @param apiKey - Bearer token for the database.
 * @returns Whether the database answered successfully.
 */
export async function tursoPipelineHealthCheck(
	databaseUrl: string,
	apiKey: string,
): Promise<boolean> {
	try {
		await tursoFetchJson(`${databaseUrl.replace(/\/$/, '')}/v2/pipeline`, {
			method: 'POST',
			apiKey,
			body: {
				requests: [
					{ type: 'execute', stmt: { sql: 'SELECT 1' } },
					{ type: 'close' },
				],
			},
		});
		return true;
	} catch {
		return false;
	}
}
