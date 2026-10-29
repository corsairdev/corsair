export class CapsuleCrmAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'CapsuleCrmAPIError';
	}
}

export class CapsuleCrmRateLimitError extends CapsuleCrmAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body, retryAfterMs);
		this.name = 'CapsuleCrmRateLimitError';
	}
}

/** Official Capsule REST host. https://developer.capsulecrm.com/v2/overview/authentication */
export const CAPSULE_CRM_API_BASE = 'https://api.capsulecrm.com/api/v2';

export type CapsuleCrmRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function errorMessage(body: unknown, fallback: string): string {
	if (typeof body === 'object' && body !== null) {
		const record = body as Record<string, unknown>;
		if (typeof record.message === 'string') return record.message;
		if (typeof record.error === 'string') return record.error;
	}
	return fallback;
}

function wrapUnknown(error: unknown): never {
	if (error instanceof Error) {
		throw new CapsuleCrmAPIError(error.message);
	}
	throw new CapsuleCrmAPIError('Unknown Capsule CRM API error');
}

export function retryAfterMsFromHeaders(headers: Headers): number | undefined {
	const retryAfter = headers.get('Retry-After');
	if (retryAfter) {
		const seconds = Number.parseInt(retryAfter, 10);
		if (!Number.isNaN(seconds)) return seconds * 1000;
	}
	const reset = headers.get('X-RateLimit-Reset');
	if (reset) {
		const timestamp = Number.parseInt(reset, 10);
		if (!Number.isNaN(timestamp)) {
			const resetMs =
				timestamp > 1_000_000_000_000 ? timestamp : timestamp * 1000;
			const wait = resetMs - Date.now();
			if (wait > 0) return wait;
		}
	}
	return undefined;
}

function throwIfLimited(res: Response, body: unknown): void {
	if (res.status !== 429) return;
	throw new CapsuleCrmRateLimitError(
		errorMessage(body, 'Too Many Requests'),
		retryAfterMsFromHeaders(res.headers),
		body,
	);
}

async function readJson(res: Response): Promise<unknown> {
	const text = await res.text();
	if (!text) return undefined;
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

function filenameFromDisposition(header: string | null): string | undefined {
	if (!header) return undefined;
	const lower = header.toLowerCase();
	const star = "filename*=utf-8''";
	const starAt = lower.indexOf(star);
	if (starAt >= 0) {
		const rest = header.slice(starAt + star.length);
		const semi = rest.indexOf(';');
		const value = (semi === -1 ? rest : rest.slice(0, semi)).trim();
		if (value) return decodeURIComponent(value);
	}
	const quoted = 'filename="';
	const quotedAt = lower.indexOf(quoted);
	if (quotedAt >= 0) {
		const start = quotedAt + quoted.length;
		const end = header.indexOf('"', start);
		if (end > start) return header.slice(start, end);
	}
	return undefined;
}

function requestUrl(
	endpoint: string,
	query: Record<string, string | number | boolean | undefined> = {},
): string {
	const url = new URL(`${CAPSULE_CRM_API_BASE}/${endpoint}`);
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}
	return url.toString();
}

export async function makeCapsuleCrmRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CapsuleCrmRequestOptions = {},
): Promise<T | undefined> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	try {
		const res = await fetch(requestUrl(endpoint, query), {
			method,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
				...(isWrite
					? { 'Content-Type': 'application/json; charset=utf-8' }
					: {}),
			},
			body: isWrite && body !== undefined ? JSON.stringify(body) : undefined,
		});
		const parsed = await readJson(res);
		throwIfLimited(res, parsed);
		if (!res.ok) {
			throw new CapsuleCrmAPIError(
				errorMessage(parsed, res.statusText || 'Capsule CRM API error'),
				res.status,
				res.status,
				parsed,
				retryAfterMsFromHeaders(res.headers),
			);
		}
		return parsed as T | undefined;
	} catch (error: unknown) {
		if (
			error instanceof CapsuleCrmAPIError ||
			error instanceof CapsuleCrmRateLimitError
		) {
			throw error;
		}
		wrapUnknown(error);
	}
}

/** Official: POST /api/v2/attachments/upload */
export async function uploadCapsuleCrmAttachment(
	apiKey: string,
	input: { filename: string; contentType: string; contentBase64: string },
): Promise<{ upload: { token: string } }> {
	const bytes = Buffer.from(input.contentBase64, 'base64');
	try {
		const res = await fetch(`${CAPSULE_CRM_API_BASE}/attachments/upload`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': input.contentType,
				'Content-Length': String(bytes.length),
				'X-Attachment-Filename': encodeURIComponent(input.filename),
			},
			body: bytes,
		});
		const parsed = (await readJson(res)) as
			| { upload?: { token?: string } }
			| undefined;
		throwIfLimited(res, parsed);
		if (!res.ok) {
			throw new CapsuleCrmAPIError(
				errorMessage(parsed, `Upload failed (${res.status})`),
				res.status,
				res.status,
				parsed,
			);
		}
		const token = parsed?.upload?.token;
		if (!token) {
			throw new CapsuleCrmAPIError('Upload response missing token', res.status);
		}
		return { upload: { token } };
	} catch (error: unknown) {
		if (
			error instanceof CapsuleCrmAPIError ||
			error instanceof CapsuleCrmRateLimitError
		) {
			throw error;
		}
		wrapUnknown(error);
	}
}

/** Official: GET /api/v2/attachments/{attachmentId} */
export async function downloadCapsuleCrmAttachment(
	id: number,
	apiKey: string,
): Promise<{
	filename?: string;
	contentType?: string;
	contentBase64: string;
}> {
	try {
		const res = await fetch(`${CAPSULE_CRM_API_BASE}/attachments/${id}`, {
			headers: { Authorization: `Bearer ${apiKey}` },
		});
		if (res.status === 429) {
			throw new CapsuleCrmRateLimitError(
				'Too Many Requests',
				retryAfterMsFromHeaders(res.headers),
			);
		}
		if (!res.ok) {
			const parsed = await readJson(res);
			throw new CapsuleCrmAPIError(
				errorMessage(parsed, `Download failed (${res.status})`),
				res.status,
				res.status,
				parsed,
			);
		}
		const buf = Buffer.from(await res.arrayBuffer());
		return {
			filename: filenameFromDisposition(res.headers.get('content-disposition')),
			contentType: res.headers.get('content-type') ?? undefined,
			contentBase64: buf.toString('base64'),
		};
	} catch (error: unknown) {
		if (
			error instanceof CapsuleCrmAPIError ||
			error instanceof CapsuleCrmRateLimitError
		) {
			throw error;
		}
		wrapUnknown(error);
	}
}
