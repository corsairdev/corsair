import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { AgentyMethod } from './endpoints/routes';

export class AgentyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// body is unknown because Agenty error payloads vary by endpoint and are not schema-validated here.
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'AgentyAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

const AGENTY_API_BASE = 'https://api.agenty.com/v2';
const AGENTY_ALLOWED_HOSTS = new Set(['api.agenty.com', 'browser.agenty.com']);

function resolveAgentyBase(baseUrl?: string): {
	base: string;
	isBrowserHost: boolean;
} {
	const resolvedBase = baseUrl ?? AGENTY_API_BASE;
	let url: URL;
	try {
		url = new URL(resolvedBase);
	} catch {
		throw new AgentyAPIError(`[agenty] invalid baseUrl: ${resolvedBase}`);
	}

	const hostname = url.hostname.replace(/\.$/, '').toLowerCase();
	if (
		url.protocol !== 'https:' ||
		(url.port !== '' && url.port !== '443') ||
		!AGENTY_ALLOWED_HOSTS.has(hostname)
	) {
		throw new AgentyAPIError(
			`[agenty] baseUrl host not allowed: ${hostname || resolvedBase}`,
		);
	}

	return {
		base: resolvedBase,
		isBrowserHost: hostname === 'browser.agenty.com',
	};
}

export type AgentyRequestOptions = {
	method?: AgentyMethod;
	// body is unknown because request payloads vary per Agenty endpoint and are built dynamically.
	body?: unknown;
	// query values are heterogeneous (pagination, filters); not fully typed across 79 ops.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

export async function makeAgentyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AgentyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, baseUrl } = options;
	// Main API accepts Bearer; browser API docs require X-Agenty-ApiKey (not Bearer).
	// Keep key out of query strings — URL leakage was a prior P1.
	// Fail closed: never attach credentials unless hostname is an allowlisted Agenty host.
	const { base: resolvedBase, isBrowserHost } = resolveAgentyBase(baseUrl);
	const config: OpenAPIConfig = {
		BASE: resolvedBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			...headers,
			Authorization: `Bearer ${apiKey}`,
			...(isBrowserHost ? { 'X-Agenty-ApiKey': apiKey } : {}),
		},
	};

	const hasBody =
		body !== undefined && !['GET', 'HEAD', 'OPTIONS'].includes(method);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError || error instanceof Error) {
			throw new AgentyAPIError(error.message, { cause: error });
		}
		throw new AgentyAPIError('Unknown error');
	}
}
