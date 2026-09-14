/**
 * Custom error class for failures originating from Turso APIs.
 */
export class TursoAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
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
function tursoError(status: number, rawText: string): TursoAPIError {
	let message = `Turso request failed with status ${status}`;
	try {
		const parsed: unknown = JSON.parse(rawText);
		if (parsed && typeof parsed === 'object') {
			const body = parsed as { error?: unknown; message?: unknown };
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
	return new TursoAPIError(message, undefined, status);
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
		throw tursoError(response.status, await response.text());
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
