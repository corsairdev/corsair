import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class StudioByAI21LabsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'StudioByAI21LabsAPIError';
	}
}

export const STUDIOBYAI21LABS_API_BASE = 'https://api.ai21.com/studio/v1';

export async function makeStudioByAI21LabsRequest<T>(
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
		BASE: STUDIOBYAI21LABS_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new StudioByAI21LabsAPIError(error.message);
		}
		throw new StudioByAI21LabsAPIError('Unknown error');
	}
}

const buildUrl = (endpoint: string): string => {
	const baseUrl = STUDIOBYAI21LABS_API_BASE.endsWith('/')
		? STUDIOBYAI21LABS_API_BASE.slice(0, -1)
		: STUDIOBYAI21LABS_API_BASE;
	const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
	return `${baseUrl}/${path}`;
};

export async function uploadStudioByAI21LabsFile<T>(
	endpoint: string,
	apiKey: string,
	options: {
		file: Blob | string;
		fileName: string;
		fields?: Record<string, string | undefined>;
	},
): Promise<T> {
	const { file, fileName, fields = {} } = options;
	const blob = typeof file === 'string' ? new Blob([file]) : file;

	const formData = new FormData();
	formData.append('file', blob, fileName);
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined) formData.append(key, value);
	}

	const response = await fetch(buildUrl(endpoint), {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}` },
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new StudioByAI21LabsAPIError(
			`Upload failed: status ${response.status}; body: ${text}`,
		);
	}

	return response.json() as Promise<T>;
}
