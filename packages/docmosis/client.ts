import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DocmosisAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number | string,
		options?: { cause?: Error; retryAfter?: number },
	) {
		super(message, options);
		this.name = 'DocmosisAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.retryAfter = options.cause.retryAfter;
		} else if (typeof code === 'number') {
			this.status = code;
			this.retryAfter = options?.retryAfter;
		} else if (options?.retryAfter !== undefined) {
			this.retryAfter = options.retryAfter;
		}
	}
}

export type DocmosisRegion = 'us1' | 'eu1' | 'au1';

type DocmosisResponseType = 'arrayBuffer';

const DOCMOSIS_API_BASES: Record<DocmosisRegion, string> = {
	us1: 'https://us1.dws4.docmosis.com/api',
	eu1: 'https://eu1.dws4.docmosis.com/api',
	au1: 'https://au1.dws4.docmosis.com/api',
};

const REQUEST_TIMEOUT_MS = 20_000;

function buildFormData(data?: Record<string, unknown>): FormData | undefined {
	if (!data) {
		return undefined;
	}

	const formData = new FormData();
	for (const [key, value] of Object.entries(data)) {
		if (value === undefined || value === null) {
			continue;
		}

		const appendValue = (item: unknown) => {
			if (typeof item === 'string' || item instanceof Blob) {
				formData.append(key, item);
				return;
			}
			formData.append(key, JSON.stringify(item));
		};

		if (Array.isArray(value)) {
			for (const item of value) {
				appendValue(item);
			}
		} else {
			appendValue(value);
		}
	}

	return formData;
}

function buildUrl(
	base: string,
	endpoint: string,
	query?: Record<string, string | number | boolean | undefined>,
): string {
	const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	let url = `${base.replace(/\/$/, '')}/${path}`;

	if (query) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) {
				params.set(key, String(value));
			}
		}
		const qs = params.toString();
		if (qs) {
			url = `${url}?${qs}`;
		}
	}

	return url;
}

export type DocmosisBinaryResponse = {
	contentType: string;
	dataBase64: string;
	byteLength: number;
};

function bufferToBase64(buffer: ArrayBuffer): string {
	return Buffer.from(buffer).toString('base64');
}

async function fetchBinaryResponse(
	url: string,
	options: {
		method: string;
		headers: Record<string, string>;
		body?: FormData;
	},
): Promise<DocmosisBinaryResponse> {
	const response = await fetch(url, {
		method: options.method,
		headers: options.headers,
		body: options.body,
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	if (!response.ok) {
		let message = response.statusText;
		try {
			const raw = await response.text();
			const body = JSON.parse(raw) as {
				shortMsg?: string;
				longMsg?: string;
			};
			message = body.longMsg ?? body.shortMsg ?? message;
		} catch {
			// binary or non-JSON error body
		}

		const retryAfterHeader = response.headers.get('Retry-After');
		const retryAfterSeconds = retryAfterHeader
			? Number(retryAfterHeader)
			: Number.NaN;

		throw new DocmosisAPIError(message, response.status, {
			retryAfter: Number.isFinite(retryAfterSeconds)
				? retryAfterSeconds * 1000
				: undefined,
		});
	}

	const buffer = await response.arrayBuffer();
	const contentType =
		response.headers.get('Content-Type')?.split(';')[0]?.trim() ??
		'application/octet-stream';

	return {
		contentType,
		dataBase64: bufferToBase64(buffer),
		byteLength: buffer.byteLength,
	};
}

export async function makeDocmosisRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
		mediaType?: string;
		responseType?: DocmosisResponseType;
		region?: DocmosisRegion;
	} = {},
): Promise<T> {
	const {
		method = 'POST',
		body,
		query,
		formData,
		mediaType,
		responseType,
		region = 'us1',
	} = options;

	if (responseType === 'arrayBuffer') {
		const url = buildUrl(DOCMOSIS_API_BASES[region], endpoint, query);
		const requestBody = buildFormData(formData);
		return (await fetchBinaryResponse(url, {
			method,
			headers: { accessKey: apiKey },
			body: requestBody,
		})) as T;
	}

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
