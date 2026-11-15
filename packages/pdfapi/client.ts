import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
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

// Documented API base: every route lives under /api (a bare
// https://pdf-api.io/templates answers a 307 redirect to the marketing site).
export const PDF_API_BASE = 'https://pdf-api.io/api';

export type PdfApiAccept = 'application/pdf' | 'application/json';

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
		// Core's default rate-limit config owns 429 retries (three, honouring
		// Retry-After); the plugin's 429 handler does not retry again (R8).
		return await request<T>(config, requestOptions);
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
