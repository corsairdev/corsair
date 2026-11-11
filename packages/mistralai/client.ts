import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type MistralAiHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export class MistralAiAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		// unknown: the parsed error response. Mistral documents only the 422
		// shape (HTTPValidationError); other statuses can carry any JSON or text,
		// so callers narrow it themselves.
		public readonly body?: unknown,
		public readonly method?: MistralAiHttpMethod,
	) {
		super(message);
		this.name = 'MistralAiAPIError';
	}
}

export const MISTRALAI_API_BASE = 'https://api.mistral.ai';

// Retries are the error handlers' call (error-handlers.ts), so the transport
// makes one attempt: a retried completion is billed again.
const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

type QueryValue = string | number | boolean | readonly string[] | undefined;

export type MistralAiRequestOptions = {
	method?: MistralAiHttpMethod;
	/** Values for `{name}` placeholders in the path; each is URI-encoded. */
	path?: Record<string, string | number>;
	query?: Record<string, QueryValue>;
	// unknown: each operation sends its own JSON body, already checked by that
	// operation's zod input schema before it gets here.
	body?: Record<string, unknown>;
	/** Multipart body, for files.upload and audio.transcribe. */
	formData?: FormData;
};

/**
 * One line per field Mistral rejected, from its 422 HTTPValidationError:
 * `detail[].loc` joined with dots (the leading "body"/"query" is kept so the
 * reader knows where the field lives), then `msg`.
 */
// unknown: any parsed error body; only an HTTPValidationError yields lines.
export function formatValidationDetail(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null || !('detail' in body)) {
		return undefined;
	}
	const { detail } = body;
	if (!Array.isArray(detail) || detail.length === 0) return undefined;
	// unknown: each item is checked for loc and msg before use.
	const lines = detail.flatMap((item: unknown) => {
		if (typeof item !== 'object' || item === null) return [];
		const loc =
			'loc' in item && Array.isArray(item.loc) ? item.loc.join('.') : '';
		const msg = 'msg' in item && typeof item.msg === 'string' ? item.msg : '';
		if (!loc && !msg) return [];
		return [loc ? `${loc}: ${msg}` : msg];
	});
	return lines.length > 0 ? lines.join('; ') : undefined;
}

function messageOf(error: ApiError): string {
	const validation = formatValidationDetail(error.body);
	if (validation) return `Mistral AI rejected the request: ${validation}`;
	// unknown: core types the error body as any; narrow it before reading.
	const body: unknown = error.body;
	if (typeof body === 'object' && body !== null) {
		if ('message' in body && typeof body.message === 'string') {
			return `${error.status} ${body.message}`;
		}
		if ('detail' in body && typeof body.detail === 'string') {
			return `${error.status} ${body.detail}`;
		}
	}
	if (typeof body === 'string' && body.trim()) {
		return `${error.status} ${body.trim().slice(0, 500)}`;
	}
	return error.message;
}

export async function makeMistralAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: MistralAiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', path, query, body, formData } = options;

	// `request` turns TOKEN into `Authorization: Bearer <key>`.
	const config: OpenAPIConfig = {
		BASE: MISTRALAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		ENCODE_PATH: encodeURIComponent,
		// Completions, OCR and transcriptions routinely run past the 20 s default.
		TIMEOUT: 300_000,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		// A FormData body goes out as is; fetch sets the multipart boundary.
		...(formData
			? { body: formData }
			: body !== undefined
				? { body, mediaType: 'application/json' }
				: {}),
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MistralAiAPIError(
				messageOf(error),
				error.status,
				error.retryAfter,
				error.body,
				method,
			);
		}
		if (error instanceof Error) {
			throw new MistralAiAPIError(
				error.message,
				undefined,
				undefined,
				undefined,
				method,
			);
		}
		throw new MistralAiAPIError('Unknown error');
	}
}
