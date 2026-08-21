import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GroqcloudAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GroqcloudAPIError';
	}
}

const GROQCLOUD_API_BASE = 'https://api.groq.com/openai/v1';

export async function makeGroqcloudRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: GROQCLOUD_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new GroqcloudAPIError(error.message);
		}
		throw new GroqcloudAPIError('Unknown error');
	}
}

export type GroqcloudMultipartFieldValue = string | string[] | undefined;

function throwFromFetchResponse(response: Response, bodyText: string): never {
	throw new GroqcloudAPIError(
		`Generic Error: status: ${response.status}; status text: ${response.statusText}; body: "${bodyText}"`,
		undefined,
	);
}

const buildUrl = (endpoint: string): string => {
	const baseUrl = GROQCLOUD_API_BASE.endsWith('/')
		? GROQCLOUD_API_BASE.slice(0, -1)
		: GROQCLOUD_API_BASE;
	const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	return `${baseUrl}/${path}`;
};

export function parseGroqcloudMultipartBody<T>(
	contentType: string | null,
	bodyText: string,
): T {
	const ct = (contentType ?? '').toLowerCase();
	const contentTypeSaysJson =
		ct.includes('application/json') || ct.includes('+json');

	if (contentTypeSaysJson) {
		return JSON.parse(bodyText) as T;
	}

	const trimmed = bodyText.trimStart();
	if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
		try {
			return JSON.parse(bodyText) as T;
		} catch {
			// fall through
		}
	}

	return { text: bodyText } as T;
}

export async function multipartGroqcloudRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		files: Array<{ field: string; file: Blob | string; fileName: string }>;
		fields?: Record<string, GroqcloudMultipartFieldValue>;
	},
): Promise<T> {
	const { files, fields = {} } = options;

	const formData = new FormData();
	for (const { field, file, fileName } of files) {
		const blob = typeof file === 'string' ? new Blob([file]) : file;
		formData.append(field, blob, fileName);
	}
	for (const [key, value] of Object.entries(fields)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				formData.append(key, item);
			}
		} else {
			formData.append(key, value);
		}
	}

	const response = await fetch(buildUrl(endpoint), {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}` },
		body: formData,
	});

	const bodyText = await response.text();

	if (!response.ok) {
		throwFromFetchResponse(response, bodyText);
	}

	return parseGroqcloudMultipartBody<T>(
		response.headers.get('content-type'),
		bodyText,
	);
}
