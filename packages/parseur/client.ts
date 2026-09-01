import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PARSEUR_API_BASE = 'https://api.parseur.com';

export type ParseurQueryValue =
	| string
	| number
	| boolean
	| undefined
	| null
	| string[]
	| number[]
	| Record<string, string | number | boolean | undefined>;

export type ParseurRequestOptions = {
	apiKey?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, ParseurQueryValue>;
	headers?: Record<string, string>;
};

export type ParseurMultipartOptions = {
	apiKey?: string;
	file: Blob | Buffer | Uint8Array | string;
	fileName?: string;
	contentType?: string;
};

export function formatAuthHeader(apiKey: string): string {
	if (apiKey.startsWith('Token ') || apiKey.startsWith('Bearer ')) {
		return apiKey;
	}
	return `Token ${apiKey}`;
}

function buildConfig(
	apiKey?: string,
	isWrite = false,
	customHeaders?: Record<string, string>,
): OpenAPIConfig {
	return {
		BASE: PARSEUR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(apiKey ? { Authorization: formatAuthHeader(apiKey) } : {}),
			...(isWrite ? { 'Content-Type': 'application/json' } : {}),
			...customHeaders,
		},
	};
}

async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof ApiError || error instanceof Error) {
		throw error;
	}
	throw new Error('Unknown Parseur API error');
}

function retryAfterMs(response: Response): number | undefined {
	const raw = response.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

export async function makeParseurRequest<T>(
	endpoint: string,
	options: ParseurRequestOptions = {},
): Promise<T> {
	const { apiKey, method = 'GET', body, query = {}, headers } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config = buildConfig(apiKey, isWrite, headers);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}

export async function uploadParseurMultipart<T>(
	endpoint: string,
	options: ParseurMultipartOptions,
): Promise<T> {
	const { apiKey, file, fileName = 'document.pdf', contentType } = options;
	const formData = new FormData();

	if (typeof file === 'string') {
		if (file.startsWith('data:')) {
			const commaIndex = file.indexOf(',');
			const metadata = commaIndex !== -1 ? file.slice(5, commaIndex) : '';
			const data = commaIndex !== -1 ? file.slice(commaIndex + 1) : file;
			const isBase64 = metadata
				.split(';')
				.some((token) => token.trim() === 'base64');
			const mime = metadata.split(';')[0] || 'application/octet-stream';
			const buffer = isBase64
				? Buffer.from(data, 'base64')
				: Buffer.from(decodeURIComponent(data), 'utf8');
			formData.append('file', new Blob([buffer], { type: mime }), fileName);
		} else {
			formData.append(
				'file',
				new Blob([file], { type: contentType || 'application/octet-stream' }),
				fileName,
			);
		}
	} else if (file instanceof Blob) {
		formData.append('file', file, fileName);
	} else {
		const blob = new Blob([new Uint8Array(file)], {
			type: contentType || 'application/octet-stream',
		});
		formData.append('file', blob, fileName);
	}

	const url = endpoint.startsWith('http')
		? endpoint
		: `${PARSEUR_API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			...(apiKey ? { Authorization: formatAuthHeader(apiKey) } : {}),
		},
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new ApiError(
			{ method: 'POST', url },
			{
				url,
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: text,
			},
			`Parseur upload failed (${response.status}): ${text}`,
			{ retryAfter: retryAfterMs(response) },
		);
	}

	return (await response.json()) as T;
}
