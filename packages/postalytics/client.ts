export const POSTALYTICS_PRODUCTION_URL = 'https://api.postalytics.com';
export const POSTALYTICS_SANDBOX_URL = 'https://api-dev.postalytics.com';

export class PostalyticsAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		// Error responses may be arbitrary JSON or plain text, so no narrower provider type is safe.
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'PostalyticsAPIError';
	}
}

export class PostalyticsRateLimitError extends PostalyticsAPIError {
	constructor(
		// Rate-limit responses have the same unstructured error boundary as other errors.
		body: unknown,
		public readonly retryAfterMs?: number,
	) {
		super('Postalytics rate limit exceeded', 429, body);
		this.name = 'PostalyticsRateLimitError';
	}
}

export async function makePostalyticsRequest(
	path: string,
	apiKey: string,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		query?: Record<string, string | number | boolean | undefined>;
		// Each endpoint validates a different request body before it reaches this shared transport.
		body?: unknown;
		sandbox?: boolean;
	},
	// Responses remain untrusted until the calling endpoint parses its specific output schema.
): Promise<unknown> {
	if (!apiKey) throw new PostalyticsAPIError('Postalytics API key is required');
	if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
		throw new PostalyticsAPIError(
			'Postalytics request path must be relative to the API host',
		);
	}
	const url = new URL(
		path,
		options.sandbox ? POSTALYTICS_SANDBOX_URL : POSTALYTICS_PRODUCTION_URL,
	);
	for (const [key, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}
	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
	};
	if (options.body !== undefined) headers['Content-Type'] = 'application/json';
	const response = await fetch(url.toString(), {
		method: options.method,
		headers,
		body: options.body === undefined ? undefined : JSON.stringify(options.body),
		redirect: 'error',
		signal: AbortSignal.timeout(30_000),
	});
	const text = await response.text();
	// JSON.parse can return any JSON value, and non-JSON error responses can be text.
	let body: unknown = undefined;
	if (text) {
		try {
			body = JSON.parse(text);
		} catch {
			body = text;
		}
	}
	if (response.status === 429) {
		const raw = response.headers.get('Retry-After');
		const seconds = raw === null ? NaN : Number(raw);
		const date = raw === null ? NaN : Date.parse(raw);
		const retryAfterMs =
			Number.isFinite(seconds) && seconds >= 0
				? seconds * 1000
				: Number.isFinite(date)
					? Math.max(0, date - Date.now())
					: undefined;
		throw new PostalyticsRateLimitError(body, retryAfterMs);
	}
	if (!response.ok) {
		const message =
			typeof body === 'string'
				? body
				: `Postalytics request failed (${response.status})`;
		throw new PostalyticsAPIError(message, response.status, body);
	}
	return body;
}
