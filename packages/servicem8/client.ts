import { AuthMissingError } from 'corsair/core';

export class ServiceM8Error extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly providerCode?: number,
		/** A 429 for the 20,000-requests-a-day limit; retrying it the same day fails. */
		public readonly dailyLimit = false,
	) {
		super(message);
		this.name = 'ServiceM8Error';
	}
}

export type ServiceM8Response = {
	// Responses vary by endpoint and cannot be typed until their schema parses them.
	body: unknown;
	nextCursor?: string;
	recordUuid?: string;
};

/** HTTP data is unknown until validated by the operation's output schema. */
export async function serviceM8Request(
	key: string,
	authType: 'api_key' | 'oauth_2',
	method: 'GET' | 'POST' | 'DELETE',
	path: string,
	query: Record<string, string | undefined> = {},
	// Inputs vary by endpoint and are already validated by its own schema.
	body?: unknown,
	form = false,
): Promise<ServiceM8Response> {
	if (!key.trim()) throw new AuthMissingError('servicem8', authType);
	const url = new URL(path, 'https://api.servicem8.com');
	for (const [name, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(name, value);
	}
	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method,
			redirect: 'error',
			credentials: 'omit',
			signal: AbortSignal.timeout(20_000),
			headers: {
				Accept: 'application/json',
				...(authType === 'api_key'
					? { 'X-API-Key': key }
					: { Authorization: `Bearer ${key}` }),
				...(body === undefined
					? {}
					: {
							'Content-Type': form
								? 'application/x-www-form-urlencoded'
								: 'application/json',
						}),
			},
			...(body === undefined
				? {}
				: {
						body: form
							? new URLSearchParams(body as Record<string, string>).toString()
							: JSON.stringify(body),
					}),
		});
	} catch {
		throw new ServiceM8Error('ServiceM8 request failed');
	}
	if (!response.ok) {
		const retry = response.headers.get('retry-after');
		const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : undefined;
		const retryDate =
			retry && seconds === undefined ? Date.parse(retry) : Number.NaN;
		const retryAfter =
			seconds !== undefined
				? seconds * 1000
				: Number.isFinite(retryDate)
					? Math.max(0, retryDate - Date.now())
					: undefined;
		let providerCode: number | undefined;
		let detail: string | undefined;
		const text = await response.text().catch(() => '');
		try {
			// An HTTP error may be arbitrary JSON or plain text, so inspect it first.
			const error: unknown = JSON.parse(text);
			providerCode = errorCode(error);
			detail = errorMessage(error);
		} catch {
			// ServiceM8 documents plain-text rate-limit responses as well as JSON errors.
			if (/requests per (minute|day) exceeded/i.test(text))
				detail = text.trim().slice(0, 120);
		}
		throw new ServiceM8Error(
			detail
				? `ServiceM8 HTTP ${response.status}: ${detail}`
				: `ServiceM8 HTTP request failed (${response.status})`,
			response.status,
			retryAfter,
			providerCode,
			response.status === 429 && /per day/i.test(text),
		);
	}
	// JSON is untrusted until the calling operation validates its resource schema.
	let data: unknown;
	try {
		data = await response.json();
	} catch {
		throw new ServiceM8Error(
			'ServiceM8 returned invalid JSON',
			response.status,
		);
	}
	const code = errorCode(data);
	if (code !== undefined && code !== 0) {
		const detail = errorMessage(data);
		throw new ServiceM8Error(
			detail
				? `ServiceM8 returned an error: ${detail}`
				: 'ServiceM8 returned an error',
			response.status,
			undefined,
			code,
		);
	}
	return {
		body: data,
		nextCursor: response.headers.get('x-next-cursor') ?? undefined,
		recordUuid: response.headers.get('x-record-uuid') ?? undefined,
	};
}

// unknown: error bodies are untrusted JSON; only these two fields are read.
function errorCode(body: unknown): number | undefined {
	return body &&
		typeof body === 'object' &&
		'errorCode' in body &&
		typeof body.errorCode === 'number'
		? body.errorCode
		: undefined;
}

// ServiceM8's messages are fixed strings ("Record Not Found", "Invalid Record
// Filter Field Specified", "asset requires addon activation ..."); they don't
// echo request values. Capped in length all the same.
// unknown: see errorCode.
function errorMessage(body: unknown): string | undefined {
	return body &&
		typeof body === 'object' &&
		'message' in body &&
		typeof body.message === 'string' &&
		body.message.trim()
		? body.message.trim().slice(0, 200)
		: undefined;
}
