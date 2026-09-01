import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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

function errorMessage(error: ApiError): string {
	const body =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	return (
		(body && typeof body.message === 'string' ? body.message : undefined) ||
		(body && typeof body.error === 'string' ? body.error : undefined) ||
		error.message
	);
}

function wrapUnknown(error: unknown): never {
	if (error instanceof ApiError) {
		if (error.status === 429) {
			throw new CapsuleCrmRateLimitError(
				errorMessage(error),
				error.retryAfter,
				error.body,
			);
		}
		throw new CapsuleCrmAPIError(
			errorMessage(error),
			error.status,
			error.status,
			error.body,
			error.retryAfter,
		);
	}
	if (error instanceof Error) {
		throw new CapsuleCrmAPIError(error.message);
	}
	throw new CapsuleCrmAPIError('Unknown Capsule CRM API error');
}

function compactQuery(
	query: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	);
}

export async function makeCapsuleCrmRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CapsuleCrmRequestOptions = {},
): Promise<T | undefined> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: CAPSULE_CRM_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query: compactQuery(query),
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		wrapUnknown(error);
	}
}

function filenameFromDisposition(header: string | null): string | undefined {
	if (!header) return undefined;
	const utf = header.match(/filename\*=UTF-8''([^;]+)/i);
	if (utf?.[1]) return decodeURIComponent(utf[1]);
	const plain = header.match(/filename="([^"]+)"/i);
	return plain?.[1];
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
		const parsed = (await res.json().catch(() => undefined)) as
			| { upload?: { token?: string }; message?: string; error?: string }
			| undefined;
		if (res.status === 429) {
			throw new CapsuleCrmRateLimitError(
				parsed?.error || parsed?.message || 'Too Many Requests',
			);
		}
		if (!res.ok) {
			throw new CapsuleCrmAPIError(
				parsed?.message || parsed?.error || `Upload failed (${res.status})`,
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
			throw new CapsuleCrmRateLimitError('Too Many Requests');
		}
		if (!res.ok) {
			const parsed = (await res.json().catch(() => undefined)) as
				| { message?: string; error?: string }
				| undefined;
			throw new CapsuleCrmAPIError(
				parsed?.message || parsed?.error || `Download failed (${res.status})`,
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
