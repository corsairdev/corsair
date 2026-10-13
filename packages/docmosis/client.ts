import { z } from 'zod';
import type { JsonValue } from './endpoints/types';

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

		if (typeof code === 'number') {
			this.status = code;
		}
		this.retryAfter = options?.retryAfter;
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

function parseRetryHeaderSeconds(value: string | null): number | undefined {
	if (!value) {
		return undefined;
	}

	const seconds = Number(value);
	if (!Number.isFinite(seconds)) {
		return undefined;
	}

	return seconds * 1000;
}

type DocmosisFormFields = Record<
	string,
	string | number | readonly string[] | undefined
>;

const DocmosisErrorBodySchema = z.object({
	shortMsg: z.string().optional(),
	longMsg: z.string().optional(),
});

function errorMessageFromBody(body: JsonValue | undefined): string | undefined {
	const parsed = DocmosisErrorBodySchema.safeParse(body);
	if (!parsed.success) {
		return undefined;
	}
	return parsed.data.longMsg || parsed.data.shortMsg || undefined;
}

function buildFormData(data?: DocmosisFormFields): FormData | undefined {
	if (!data) {
		return undefined;
	}

	const formData = new FormData();
	for (const [key, value] of Object.entries(data)) {
		if (value === undefined) {
			continue;
		}

		if (Array.isArray(value)) {
			for (const item of value) {
				formData.append(key, item);
			}
		} else {
			formData.append(key, String(value));
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

async function send(
	url: string,
	options: {
		method: string;
		apiKey: string;
		body?: FormData;
	},
): Promise<Response> {
	let response: Response;
	try {
		response = await fetch(url, {
			method: options.method,
			headers: { Accept: 'application/json', accessKey: options.apiKey },
			body: options.body,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new DocmosisAPIError(error.message, undefined, { cause: error });
		}
		throw new DocmosisAPIError('Unknown error');
	}

	if (response.ok) {
		return response;
	}

	let message = response.statusText;
	try {
		message =
			errorMessageFromBody(JSON.parse(await response.text())) ?? message;
	} catch {
		// binary or non-JSON error body
	}

	const retryAfterMs =
		parseRetryHeaderSeconds(response.headers.get('Retry-After')) ??
		parseRetryHeaderSeconds(
			response.headers.get('X-Docmosis-Queue-Delay-Seconds'),
		);

	throw new DocmosisAPIError(message, response.status, {
		retryAfter: retryAfterMs,
	});
}

/** Returns the raw provider payload; every caller validates it with zod. */
export async function makeDocmosisRequest(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		query?: Record<string, string | number | boolean | undefined>;
		formData?: DocmosisFormFields;
		responseType?: DocmosisResponseType;
		region?: DocmosisRegion;
	} = {},
): Promise<JsonValue | DocmosisBinaryResponse> {
	const {
		method = 'POST',
		query,
		formData,
		responseType,
		region = 'us1',
	} = options;

	const response = await send(
		buildUrl(DOCMOSIS_API_BASES[region], endpoint, query),
		{ method, apiKey, body: buildFormData(formData) },
	);

	if (responseType === 'arrayBuffer') {
		const buffer = await response.arrayBuffer();
		return {
			contentType:
				response.headers.get('Content-Type')?.split(';')[0]?.trim() ??
				'application/octet-stream',
			dataBase64: bufferToBase64(buffer),
			byteLength: buffer.byteLength,
		};
	}

	const text = await response.text();
	return text ? JSON.parse(text) : {};
}
