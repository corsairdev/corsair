import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class JiraAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'JiraAPIError';
	}
}

const JIRA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Makes a request to the Jira REST API v3.
 * The apiKey should be in "email:apiToken" format for Basic auth (Jira Cloud).
 */
export async function makeJiraRequest<T>(
	endpoint: string,
	apiKey: string,
	cloudUrl: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: `${cloudUrl}/rest/api/3`,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// Jira Cloud uses Basic auth: base64(email:apiToken)
			Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
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
		// Allow query params for GET and DELETE (DELETE with query is used by Jira for some endpoints)
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: JIRA_RATE_LIMIT_CONFIG,
	});

	return response;
}

/**
 * Uploads a file attachment to a Jira issue using multipart/form-data.
 * The Jira attachments endpoint requires this format and rejects JSON bodies.
 *
 * Provide either:
 * - file.content: base64-encoded file content (for any file type — images, PDFs, etc.)
 * - file.url: a URL to fetch the file from; mime type is auto-detected from the response
 */
export async function uploadJiraAttachment<T>(
	issueIdOrKey: string,
	apiKey: string,
	cloudUrl: string,
	file: {
		name: string;
		mimeType?: string;
	} & ({ content: string; url?: never } | { url: string; content?: never }),
): Promise<T> {
	let buffer: Buffer;
	let mimeType = file.mimeType;

	if (file.url) {
		const fetched = await fetch(file.url);
		if (!fetched.ok) {
			throw new JiraAPIError(
				`Failed to fetch file from URL: ${fetched.status} ${fetched.statusText}`,
				String(fetched.status),
			);
		}
		buffer = Buffer.from(await fetched.arrayBuffer());
		mimeType ??=
			fetched.headers.get('content-type')?.split(';')[0] ??
			'application/octet-stream';
	} else {
		buffer = Buffer.from(file.content!, 'base64');
		mimeType ??= 'application/octet-stream';
	}

	const formData = new FormData();
	const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
	formData.append('file', blob, file.name);

	const response = await fetch(
		`${cloudUrl}/rest/api/3/issue/${issueIdOrKey}/attachments`,
		{
			method: 'POST',
			headers: {
				Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
				'X-Atlassian-Token': 'no-check',
				Accept: 'application/json',
				// Content-Type is intentionally omitted — fetch sets it with the multipart boundary
			},
			body: formData,
		},
	);

	if (!response.ok) {
		const text = await response.text();
		throw new JiraAPIError(
			`Failed to upload attachment: ${response.status} ${text}`,
			String(response.status),
		);
	}
	// response.json() returns Promise<any> from the Fetch API; cast to Promise<T> here
	// because the caller is responsible for validating the shape via JiraEndpointOutputSchemas.
	return response.json() as Promise<T>;
}

/**
 * Makes a request to the Jira Agile REST API v1.0 (for boards/sprints).
 * The apiKey should be in "email:apiToken" format for Basic auth (Jira Cloud).
 */
export async function makeJiraAgileRequest<T>(
	endpoint: string,
	apiKey: string,
	cloudUrl: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: `${cloudUrl}/rest/agile/1.0`,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
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
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: JIRA_RATE_LIMIT_CONFIG,
	});

	return response;
}
