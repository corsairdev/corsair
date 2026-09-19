export class VestaboardAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'VestaboardAPIError';
	}
}

export class VestaboardRateLimitError extends VestaboardAPIError {
	constructor(
		message = 'Vestaboard API rate limit exceeded',
		public readonly retryAfterMs?: number,
	) {
		super(message, 'RATE_LIMIT_ERROR', 429);
		this.name = 'VestaboardRateLimitError';
	}
}

/** Official: https://docs.vestaboard.com/docs/subscription-api/endpoints */
export const VESTABOARD_API_BASE = 'https://subscriptions.vestaboard.com';

const REQUEST_TIMEOUT_MS = 30_000;
const NO_DEK_ERROR_PATTERN = /no dek found/i;
const CREDENTIAL_SEP = '\x1e';

export function packVestaboardCredentials(
	apiKey: string,
	apiSecret: string,
): string {
	return `${apiKey}${CREDENTIAL_SEP}${apiSecret}`;
}

export function unpackVestaboardCredentials(packed: string): {
	apiKey: string;
	apiSecret: string;
} {
	const sep = packed.indexOf(CREDENTIAL_SEP);
	if (sep < 1 || sep === packed.length - 1) {
		throw new VestaboardAPIError('Vestaboard API key and secret are required');
	}
	return {
		apiKey: packed.slice(0, sep),
		apiSecret: packed.slice(sep + 1),
	};
}

export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

function errorMessage(status: number, body: unknown): string {
	if (body && typeof body === 'object' && 'message' in body) {
		const message = (body as { message?: unknown }).message;
		if (typeof message === 'string' && message.length > 0) return message;
	}
	if (typeof body === 'string' && body.length > 0) return body;
	return `Vestaboard request failed (${status})`;
}

async function parseBody(res: Response): Promise<unknown> {
	const text = await res.text();
	if (!text) return undefined;
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

export async function makeVestaboardRequest(
	path: string,
	packedKey: string,
	options: {
		method?: 'GET' | 'POST';
		body?: Record<string, unknown>;
	} = {},
): Promise<unknown> {
	const { apiKey, apiSecret } = unpackVestaboardCredentials(packedKey);
	const url = `${VESTABOARD_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
	let res: Response;
	try {
		res = await fetch(url, {
			method: options.method ?? 'GET',
			redirect: 'error',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Vestaboard-Api-Key': apiKey,
				'X-Vestaboard-Api-Secret': apiSecret,
			},
			body:
				options.method === 'POST'
					? JSON.stringify(options.body ?? {})
					: undefined,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new VestaboardAPIError('Vestaboard request timed out');
		}
		throw new VestaboardAPIError(
			error instanceof Error ? error.message : 'Vestaboard request failed',
		);
	}

	if (res.status === 429) {
		await res.body?.cancel();
		throw new VestaboardRateLimitError(undefined, retryAfterMs(res));
	}

	const parsed = await parseBody(res);
	if (!res.ok) {
		throw new VestaboardAPIError(
			errorMessage(res.status, parsed),
			undefined,
			res.status,
		);
	}
	if (parsed === undefined) {
		throw new VestaboardAPIError(
			'Vestaboard returned an empty response',
			undefined,
			res.status,
		);
	}
	return parsed;
}
