import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Official GraphQL endpoint: `{instance}/.api/graphql` */
export const SOURCEGRAPH_DEFAULT_INSTANCE = 'https://sourcegraph.com';
export const SOURCEGRAPH_GRAPHQL_PATH = '/.api/graphql';

export class SourcegraphAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'SourcegraphAPIError';
	}
}

export class SourcegraphRateLimitError extends SourcegraphAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'SourcegraphRateLimitError';
	}
}

export type SourcegraphGraphqlEnvelope<T> = {
	data?: T | null;
	errors?: Array<{ message?: string }>;
};

export function resolveInstanceUrl(instanceUrl?: string): string {
	const raw = (instanceUrl ?? SOURCEGRAPH_DEFAULT_INSTANCE).trim();
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		throw new SourcegraphAPIError(
			'Sourcegraph instance URL must be a valid HTTPS origin',
		);
	}
	if (parsed.protocol !== 'https:') {
		throw new SourcegraphAPIError('Sourcegraph instance URL must use HTTPS');
	}
	const path = parsed.pathname
		.replace(/\/\.api\/graphql(?:\/+)?$/i, '')
		.replace(/\/+$/, '');
	return path === '' || path === '/'
		? parsed.origin
		: `${parsed.origin}${path}`;
}

function errorMessage(error: ApiError): string {
	const body =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	return (
		(body && typeof body.message === 'string' ? body.message : undefined) ||
		(body && typeof body.error === 'string' ? body.error : undefined) ||
		error.message
	);
}

export function unwrapGraphqlData<T>(
	envelope: SourcegraphGraphqlEnvelope<T>,
): T {
	const messages = (envelope.errors ?? [])
		.map((error) => error.message)
		.filter((message): message is string => Boolean(message));
	if (envelope.data == null) {
		throw new SourcegraphAPIError(
			messages.join('; ') || 'Sourcegraph GraphQL returned no data',
		);
	}
	if (messages.length > 0) {
		throw new SourcegraphAPIError(messages.join('; '), undefined, undefined, {
			data: envelope.data,
			errors: envelope.errors,
		});
	}
	return envelope.data;
}

/**
 * POST GraphQL. Auth is `Authorization: token <access-token>`
 * (https://sourcegraph.com/docs/api/graphql). Do not set OpenAPI TOKEN —
 * that helper sends Bearer and overwrites the header.
 */
export async function sourcegraphGraphql<T>(
	apiKey: string,
	query: string,
	variables?: Record<string, unknown>,
	instanceUrl?: string,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: resolveInstanceUrl(instanceUrl),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `token ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: SOURCEGRAPH_GRAPHQL_PATH,
		body: variables ? { query, variables } : { query },
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const envelope = await request<SourcegraphGraphqlEnvelope<T>>(
			config,
			requestOptions,
		);
		return unwrapGraphqlData(envelope);
	} catch (error: unknown) {
		if (error instanceof SourcegraphAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new SourcegraphRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new SourcegraphAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new SourcegraphAPIError(error.message);
		}
		throw new SourcegraphAPIError('Unknown error');
	}
}
