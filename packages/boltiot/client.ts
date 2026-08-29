export class BoltIotAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'BoltIotAPIError';
	}
}

export class BoltIotRateLimitError extends BoltIotAPIError {
	constructor(
		message = 'Bolt IoT API rate limit exceeded',
		public readonly retryAfterMs?: number,
	) {
		super(message, 'RATE_LIMIT_ERROR', 429);
		this.name = 'BoltIotRateLimitError';
	}
}

const BOLT_IOT_API_BASE = 'https://cloud.boltiot.com/remote';
const REQUEST_TIMEOUT_MS = 20_000;

export interface BoltIotApiResponse {
	success: string | number;
	value: string;
	time?: string;
}

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

export async function makeBoltIotRequest<
	T extends BoltIotApiResponse = BoltIotApiResponse,
>(
	command: string,
	apiKey: string,
	query: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) params.set(key, String(value));
	}
	const qs = params.toString();
	const url = `${BOLT_IOT_API_BASE}/${apiKey}/${command}${qs ? `?${qs}` : ''}`;

	let res: Response;
	try {
		res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new BoltIotAPIError('Bolt IoT request timed out');
		}
		throw new BoltIotAPIError(
			error instanceof Error ? error.message : 'Bolt IoT request failed',
		);
	}

	if (res.status === 429) {
		await res.body?.cancel();
		throw new BoltIotRateLimitError(undefined, retryAfterMs(res));
	}

	let parsed: unknown;
	try {
		parsed = await res.json();
	} catch {
		throw new BoltIotAPIError(
			`Bolt IoT command ${command} failed`,
			undefined,
			res.status,
		);
	}

	if (parsed === null || typeof parsed !== 'object' || !('success' in parsed)) {
		throw new BoltIotAPIError(
			`Bolt IoT command ${command} failed`,
			undefined,
			res.status,
		);
	}

	const body = parsed as T;
	if (String(body.success) === '0') {
		throw new BoltIotAPIError(
			String(body.value || `Bolt IoT command ${command} failed`),
			undefined,
			res.status,
		);
	}
	if (!res.ok) {
		throw new BoltIotAPIError(
			String(body.value || `Bolt IoT command ${command} failed`),
			undefined,
			res.status,
		);
	}
	return body;
}
