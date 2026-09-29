import { z } from 'zod';

/**
 * Custom error class for failures originating from the Imejis.io render API.
 */
export class ImejisioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		/** Milliseconds to wait before retrying, derived from the quota reset time. */
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ImejisioAPIError';
	}
}

/**
 * Base URL for the Imejis.io render service.
 *
 * OpenAPI: https://api.imejis.io/openapi.json (`servers[1]`)
 */
export const IMEJISIO_RENDER_BASE = 'https://render.imejis.io/v1';

/**
 * Request timeout in milliseconds for Imejis render requests.
 */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Options for rendering an Imejis design template via the render service.
 */
export type ImejisioRenderOptions = {
	format?: 'png' | 'jpeg' | 'webp' | 'pdf';
	quality?: number;
	delivery?: 'stream' | 'hosted' | 'signed';
	expiresIn?: number;
	// unknown justified: template overrides accept arbitrary caller-supplied field values.
	overrides?: Record<string, unknown>;
};

const ImejisioErrorPayloadSchema = z.object({
	message: z.string().optional(),
	error: z.string().optional(),
	reason: z.string().optional(),
	data: z
		.object({
			resetAt: z.string().optional(),
		})
		.optional(),
});

// unknown justified: unvalidated external response JSON structure before endpoint schema parse.
const JsonObjectSchema = z.record(z.string(), z.unknown());

/**
 * Converts the official `QuotaError.data.resetAt` timestamp into a retry delay.
 *
 * OpenAPI: `#/components/schemas/QuotaError`
 *
 * @param data - Optional data object containing resetAt timestamp.
 * @returns Milliseconds until the quota resets, or undefined when unavailable.
 */
function retryAfterFromQuota(data?: { resetAt?: string }): number | undefined {
	if (!data?.resetAt) return undefined;
	const resetMs = Date.parse(data.resetAt);
	if (Number.isNaN(resetMs)) return undefined;
	return Math.max(0, resetMs - Date.now());
}

/**
 * Builds an ImejisioAPIError from a non-2xx render response.
 *
 * The render service uses two error body shapes: quota failures answer with
 * `{ success, message, reason, data }` and auth failures with
 * `{ success, error }`. Both are surfaced, and a quota body carries its reset
 * time through to the rate-limit error handler.
 *
 * @param status - HTTP status code of the failed response.
 * @param rawText - Raw response body text.
 * @returns The error to throw.
 */
function renderError(status: number, rawText: string): ImejisioAPIError {
	let message = `Imejis render request failed with status ${status}`;
	let code: string | undefined;
	let retryAfter: number | undefined;

	try {
		// unknown justified: parsed error payload is unvalidated external JSON before schema parse.
		const parsed: unknown = JSON.parse(rawText);
		const result = ImejisioErrorPayloadSchema.safeParse(parsed);
		if (result.success) {
			const {
				message: errMessage,
				error: errDetail,
				reason,
				data,
			} = result.data;
			const detail =
				errMessage && errMessage.length > 0
					? errMessage
					: errDetail && errDetail.length > 0
						? errDetail
						: undefined;
			if (detail) {
				message = detail;
			}
			code = reason;
			retryAfter = retryAfterFromQuota(data);
		}
	} catch {
		if (rawText.trim().length > 0) {
			message = rawText.trim();
		}
		return new ImejisioAPIError(message, code, status, retryAfter);
	}

	return new ImejisioAPIError(message, code, status, retryAfter);
}

/**
 * Dispatches a POST render request to the Imejis render service.
 *
 * API: POST https://render.imejis.io/v1/{design_id}
 * Docs: https://www.imejis.io/apis
 * OpenAPI: `renderDesignPost`
 *
 * Authenticates with the `dma-api-key` header (`renderKeyHeader` security
 * scheme) and normalizes binary stream responses to base64, leaving
 * hosted/signed JSON responses intact.
 *
 * @param designId - The unique design render code.
 * @param renderKey - The render API key required by the render service.
 * @param options - Render options including format, quality, delivery, expiresIn, and overrides.
 * @returns The normalized response, shaped for `RenderDesignResponseSchema` to
 * parse.
 */
// unknown justified: provider body is untrusted until Zod validates it at the endpoint layer.
export async function makeImejisioRenderRequest(
	designId: string,
	renderKey: string,
	options: ImejisioRenderOptions = {},
): Promise<unknown> {
	const format = options.format ?? 'jpeg';
	const delivery = options.delivery ?? 'stream';

	const url = new URL(
		`${IMEJISIO_RENDER_BASE}/${encodeURIComponent(designId)}`,
	);
	url.searchParams.set('format', format);
	url.searchParams.set('delivery', delivery);

	if (options.quality !== undefined) {
		url.searchParams.set('quality', String(options.quality));
	}
	if (options.expiresIn !== undefined) {
		url.searchParams.set('expiresIn', String(options.expiresIn));
	}

	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method: 'POST',
			headers: {
				'dma-api-key': renderKey,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(options.overrides ?? {}),
			// undici keeps custom headers across a cross-origin redirect, which
			// would hand the render key to whatever host the redirect names. No
			// documented render response redirects, so refuse them outright.
			redirect: 'error',
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (err) {
		const detail = err instanceof Error ? `: ${err.message}` : '';
		throw new ImejisioAPIError(
			`Failed to connect to Imejis render service${detail}`,
		);
	}

	if (!response.ok) {
		throw renderError(response.status, await response.text());
	}

	const contentTypeHeader = response.headers.get('content-type') ?? '';
	const isJson =
		delivery === 'hosted' ||
		delivery === 'signed' ||
		contentTypeHeader.toLowerCase().includes('application/json');

	if (isJson) {
		// unknown justified: untrusted provider JSON payload validated downstream by Zod at endpoint layer.
		const json: unknown = await response.json();
		const parsed = JsonObjectSchema.safeParse(json);
		return parsed.success ? { ...parsed.data, delivery } : { delivery };
	}

	const arrayBuffer = await response.arrayBuffer();
	const firstPart = contentTypeHeader.split(';')[0]?.trim();

	return {
		delivery: 'stream',
		format,
		contentType:
			firstPart || (format === 'pdf' ? 'application/pdf' : `image/${format}`),
		base64: Buffer.from(arrayBuffer).toString('base64'),
	};
}
