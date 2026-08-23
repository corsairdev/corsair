import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ImgBBAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// ImgBB error bodies vary by failure mode; unknown forces callers to narrow before use.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'ImgBBAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const IMGBB_API_BASE = 'https://api.imgbb.com';

// Catch values are untyped at runtime; unknown forces narrowing to ApiError/Error
// before rethrowing as ImgBBAPIError.
async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof ApiError) {
		let message = error.message;
		let code = error.status;

		if (
			error.body &&
			typeof error.body === 'object' &&
			'error' in error.body &&
			error.body.error &&
			typeof error.body.error === 'object'
		) {
			const errObj = error.body.error as { message?: string; code?: number };
			if (errObj.message) {
				message = errObj.message;
			}
			if (errObj.code !== undefined) {
				code = errObj.code;
			}
		}

		throw new ImgBBAPIError(message, code, { cause: error });
	}
	if (error instanceof Error) {
		throw new ImgBBAPIError(error.message, undefined, { cause: error });
	}
	throw new ImgBBAPIError('Unknown error');
}

function buildConfig(): OpenAPIConfig {
	return {
		BASE: IMGBB_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {},
	};
}

export type ImgBBUploadParams = {
	/** The ImgBB API key. Sent as a query parameter per the ImgBB API. */
	apiKey: string;
	/** Binary data (Blob, File, Buffer, Uint8Array), base64-encoded string, or an image URL (up to 32 MB). */
	image: string | Blob | Uint8Array | Buffer;
	/** Optional display name for the uploaded file. */
	name?: string;
	/** Optional auto-delete window in seconds (60-15552000). */
	expiration?: number;
};

/**
 * Uploads an image to ImgBB.
 *
 * Auth: API key as the `key` query parameter (ImgBB does not support header-based
 * auth for the upload endpoint). Always POST — GET is technically supported by
 * ImgBB but is capped by URL length, which silently corrupts larger base64
 * payloads, so this client never uses it.
 *
 * The `image` field is sent as multipart/form-data, which is the encoding the
 * ImgBB docs recommend for both binary uploads and base64 strings.
 */
export async function uploadImageToImgBB<T>(
	params: ImgBBUploadParams,
): Promise<T> {
	const { apiKey, image, name, expiration } = params;

	const config = buildConfig();

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/1/upload',
		query: {
			key: apiKey,
			...(expiration !== undefined ? { expiration } : {}),
		},
		formData: {
			image,
			...(name ? { name } : {}),
		},
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}
