import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class PdfApiError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'PdfApiError';
	}
}

const PDF_API_BASE = 'https://pdf-api.io';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Single retry owner: the plugin error handler owns the 429 retry policy,
	// so the transport stays single-attempt (maxRetries 0). Keeping enabled
	// true makes the shared transport read the Retry-After/reset headers and
	// attach them to the thrown error without ever retrying on its own.
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type PdfApiAccept = 'application/pdf' | 'application/json';

async function parseProviderError(response: Response): Promise<PdfApiError> {
	// unknown: the provider error body shape is documented only loosely
	// ("appropriate error codes and messages"), so it is read structurally.
	let message = `PDF-API.io request failed with status ${response.status}`;
	try {
		const body = (await response.json()) as {
			message?: string;
			error?: string;
		};
		message = body?.message || body?.error || message;
	} catch {
		// non-JSON error body: keep the status-based message
	}
	return new PdfApiError(message, response.status);
}

export async function makePdfApiRequest<T>(
	ctx: { key: string },
	endpoint: string,
	options: {
		method?: 'GET' | 'POST';
		// unknown: PDF-API.io request bodies differ per operation and are
		// validated by the corresponding endpoint schema before this boundary.
		body?: Record<string, unknown>;
		// The provider returns a binary PDF when Accept is application/pdf
		// and a JSON envelope when Accept is application/json.
		accept?: PdfApiAccept;
	} = {},
): Promise<T> {
	const { method = 'GET', body, accept = 'application/json' } = options;

	const config: OpenAPIConfig = {
		BASE: PDF_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: accept,
			'Content-Type': 'application/json',
			// The shared transport builds this from the per-request headers merge;
			// asserted at the client seam.
			Authorization: `Bearer ${ctx.key}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// Auth rides in config.HEADERS only: the shared transport merges
		// config.HEADERS into the outgoing request, and keeping the key out of
		// requestOptions means a stored ApiError never retains the credential.
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// R8: the original ApiError passes through unchanged so callers and
			// custom handlers keep the full error (body, request details,
			// status, Retry-After); only the message is enriched with the
			// provider text from the body, read structurally because the
			// provider error shape is documented only loosely.
			// unknown: the provider error body shape is documented only
			// loosely, so it is read structurally.
			const provider = error.body as
				| { message?: string; error?: string }
				| undefined;
			error.message = provider?.message || provider?.error || error.message;
			throw error;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new PdfApiError('Unknown PDF-API.io error');
	}
}

export const REQUEST_TIMEOUT_MS = 60_000;

// Render and merge return a binary PDF by default; the shared transport has
// no binary branch, so this operation uses a plugin-local fetch that
// preserves auth and returns byte-exact data (docmosis/browserless pattern).
export async function makePdfApiBinaryRequest(
	ctx: { key: string },
	endpoint: string,
	body: Record<string, unknown>,
): Promise<{ dataBase64: string; contentType: string }> {
	const response = await fetch(PDF_API_BASE + endpoint, {
		method: 'POST',
		headers: {
			Accept: 'application/pdf',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${ctx.key}`,
		},
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});
	if (!response.ok) {
		throw await parseProviderError(response);
	}
	const buffer = await response.arrayBuffer();
	return {
		contentType:
			response.headers.get('Content-Type')?.split(';')[0]?.trim() ||
			'application/pdf',
		dataBase64: Buffer.from(buffer).toString('base64'),
	};
}
