import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { OcrResponse } from './endpoints/types';

export class OcrSpaceAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// OCR.space error bodies differ between the parse and statistics services,
	// so the raw body is kept as `unknown` rather than modelled per endpoint.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;
	// Set when the failure was reported in the response body rather than by an
	// HTTP status, so error handlers can tell the two cases apart.
	public readonly ocrExitCode?: number;

	constructor(
		message: string,
		options?: { cause?: Error; body?: unknown; ocrExitCode?: number },
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'OcrSpaceAPIError';
		this.body = options?.body;
		this.ocrExitCode = options?.ocrExitCode;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

const OCRSPACE_API_BASE = 'https://api.ocr.space';
const OCRSPACE_MYAPI_BASE = 'https://myapi.ocr.space';

// OCR of a multi-page PDF regularly runs past the 20s shared default.
const OCRSPACE_TIMEOUT_MS = 60_000;

const OCRSPACE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		limit: 'X-RateLimit-Limit',
		remaining: 'X-RateLimit-Remaining',
		resetTime: 'X-RateLimit-Reset',
	},
};

export type OcrSpaceQueryValue = string | number | boolean | undefined;

/**
 * OCR.space reports failures as either a string or an array of strings.
 */
export function flattenOcrErrorMessage(
	message: string | string[] | null | undefined,
): string | undefined {
	if (Array.isArray(message)) {
		const joined = message.filter(Boolean).join(' ');
		return joined.length > 0 ? joined : undefined;
	}
	return message ?? undefined;
}

/**
 * OCR.space answers with HTTP 200 even when the parse failed, signalling the
 * failure through `IsErroredOnProcessing` / `OCRExitCode` in the body. Without
 * this check a failed parse would be returned to the caller as an empty
 * success.
 *
 * `OCRExitCode === 2` is a partial success: some pages of a multi-page PDF were
 * parsed and some were not. Those pages are real results, so this is allowed
 * through rather than thrown away.
 */
export function assertOcrSuccess(response: OcrResponse): void {
	const exitCode = response.OCRExitCode ?? undefined;
	const failed =
		response.IsErroredOnProcessing === true || exitCode === 3 || exitCode === 4;
	const parsedResults = response.ParsedResults ?? [];
	const pageError = parsedResults
		.map((result) => flattenOcrErrorMessage(result.ErrorMessage))
		.find((value) => value !== undefined);

	if (!failed) {
		if (
			(exitCode !== 1 && exitCode !== 2) ||
			!parsedResults.some((result) => result.FileParseExitCode === 1)
		) {
			throw new OcrSpaceAPIError(
				pageError ?? 'OCR.space returned no successfully parsed pages',
				{ body: response, ocrExitCode: exitCode },
			);
		}
		return;
	}

	const message =
		flattenOcrErrorMessage(response.ErrorMessage) ??
		response.ErrorDetails ??
		pageError ??
		'OCR.space failed to process the request';

	throw new OcrSpaceAPIError(message, {
		body: response,
		ocrExitCode: exitCode,
	});
}

function buildConfig(baseUrl: string, apiKey: string): OpenAPIConfig {
	return {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: OCRSPACE_TIMEOUT_MS,
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			// OCR.space accepts the key as a query parameter too, but the header
			// keeps it out of request URLs and logs.
			apikey: apiKey,
		},
	};
}

async function send<T>(
	config: OpenAPIConfig,
	requestOptions: ApiRequestOptions,
): Promise<T> {
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: OCRSPACE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// ApiError extends Error, and the OcrSpaceAPIError constructor pulls the
		// status and rate-limit headers off an ApiError cause, so one branch
		// covers both.
		if (error instanceof Error) {
			throw new OcrSpaceAPIError(error.message, { cause: error });
		}
		throw new OcrSpaceAPIError('Unknown OCR.space API error');
	}
}

export async function makeOcrSpaceGetRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, OcrSpaceQueryValue>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	return send<T>(buildConfig(options.baseUrl ?? OCRSPACE_API_BASE, apiKey), {
		method: 'GET',
		url: endpoint,
		query: options.query,
	});
}

export async function makeOcrSpacePostRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		formData?: Record<string, unknown>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const config = buildConfig(options.baseUrl ?? OCRSPACE_API_BASE, apiKey);
	const fields = options.formData ?? {};
	const hasFields = Object.values(fields).some(
		(value) => value !== undefined && value !== null,
	);

	// An empty multipart payload is sent without a content length, which the
	// provider rejects with HTTP 411. Endpoints whose parameters are all
	// optional therefore fall back to an empty form-encoded body.
	if (!hasFields) {
		return send<T>(config, {
			method: 'POST',
			url: endpoint,
			body: '',
			mediaType: 'application/x-www-form-urlencoded',
		});
	}

	return send<T>(config, {
		method: 'POST',
		url: endpoint,
		// `formData` (not `body`) is required: the transport builds the
		// multipart payload and lets fetch generate the boundary. Setting a
		// `multipart/form-data` media type by hand would omit the boundary.
		formData: fields,
	});
}

export { OCRSPACE_API_BASE, OCRSPACE_MYAPI_BASE };
