import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DocmosisAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number | string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'DocmosisAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export type DocmosisRegion = 'us1' | 'eu1' | 'au1';

const DOCMOSIS_API_BASES: Record<DocmosisRegion, string> = {
	us1: 'https://us1.dws4.docmosis.com/api',
	eu1: 'https://eu1.dws4.docmosis.com/api',
	au1: 'https://au1.dws4.docmosis.com/api',
};

export async function makeDocmosisRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
		mediaType?: string;
		region?: DocmosisRegion;
	} = {},
): Promise<T> {
	const {
		method = 'POST',
		body,
		query,
		formData,
		mediaType,
		region = 'us1',
	} = options;

	const config: OpenAPIConfig = {
		BASE: DOCMOSIS_API_BASES[region],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			accessKey: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body,
		formData,
		mediaType: mediaType ?? 'application/x-www-form-urlencoded',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DocmosisAPIError(error.message, error.status, { cause: error });
		}

		if (error instanceof Error) {
			throw new DocmosisAPIError(error.message, undefined, { cause: error });
		}

		throw new DocmosisAPIError('Unknown error');
	}
}
