import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type BackendlessClientConfig = {
	baseUrl: string;
	applicationId: string;
	restApiKey: string;
	userToken?: string;
};

export class BackendlessAPIError extends Error {
	readonly status?: number;
	readonly statusText?: string;
	readonly body?: unknown;
	readonly code?: number;

	constructor(message: string, options?: { cause?: unknown; code?: number }) {
		super(message, options);
		this.name = 'BackendlessAPIError';
		this.code = options?.code;
		const cause = options?.cause;
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.statusText = cause.statusText;
			this.body = cause.body;
		}
	}
}

function safeBaseUrl(value: string): string {
	const url = new URL(value);
	if (url.protocol !== 'https:') {
		throw new BackendlessAPIError('Backendless base URL must use HTTPS');
	}
	return url.toString().replace(/\/$/, '');
}

function pathSegments(...segments: string[]): string {
	return segments.map((segment) => encodeURIComponent(segment)).join('/');
}

export class BackendlessClient {
	private readonly config: OpenAPIConfig;
	private readonly userToken?: string;

	constructor(config: BackendlessClientConfig) {
		const baseUrl = safeBaseUrl(config.baseUrl);
		this.userToken = config.userToken;
		this.config = {
			BASE: baseUrl,
			VERSION: '',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: undefined,
			HEADERS: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'application-id': config.applicationId,
				'api-key': config.restApiKey,
			},
		};
	}

	segment(...values: string[]): string {
		return pathSegments(...values);
	}

	async call<T>(
		method: ApiRequestOptions['method'],
		path: string,
		options: {
			query?: Record<string, string | number | boolean | undefined>;
			body?: unknown;
			userScoped?: boolean;
		} = {},
	): Promise<T> {
		const requestOptions: ApiRequestOptions = {
			method,
			url: `/api/${path.replace(/^\//, '')}`,
			query: options.query,
			body: options.body,
			headers:
				options.userScoped && this.userToken
					? { 'user-token': this.userToken }
					: undefined,
		};
		try {
			return await request<T>(this.config, requestOptions);
		} catch (error) {
			if (error instanceof ApiError) {
				throw new BackendlessAPIError(error.message, {
					cause: error,
					code: error.status,
				});
			}
			if (error instanceof Error) {
				throw new BackendlessAPIError(error.message, { cause: error });
			}
			throw new BackendlessAPIError('Unknown Backendless API error');
		}
	}
}

export function redactSecrets(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(redactSecrets);
	if (!value || typeof value !== 'object') return value;
	const output: Record<string, unknown> = {};
	for (const [key, item] of Object.entries(value)) {
		const sensitive = ['password', 'token', 'key', 'secret'].some((part) =>
			key.toLowerCase().includes(part),
		);
		output[key] = sensitive ? '[REDACTED]' : redactSecrets(item);
	}
	return output;
}
