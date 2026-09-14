import { webcrypto } from 'node:crypto';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const CLASSMARKER_API_BASE = 'https://api.classmarker.com';
const CREDENTIAL_SEPARATOR = '\x1e';
const NO_DEK_ERROR_PATTERN = /no dek found/i;

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ClassmarkerErrorResponse = {
	status?: string;
	error?: {
		error_code?: string;
		error_message?: string;
		next_request_after?: number;
	};
};

export class ClassmarkerAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;
	public readonly nextRequestAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: {
			status?: number;
			retryAfter?: number;
			nextRequestAfter?: number;
			cause?: unknown;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'ClassmarkerAPIError';
		this.status = options?.status;
		this.retryAfter = options?.retryAfter;
		this.nextRequestAfter = options?.nextRequestAfter;
	}
}

export function packClassmarkerCredentials(
	apiKey: string,
	apiSecret: string,
): string {
	return `${apiKey}${CREDENTIAL_SEPARATOR}${apiSecret}`;
}

function unpackClassmarkerCredentials(packed: string): {
	keyId: string;
	keySecret: string;
} {
	const separatorIndex = packed.indexOf(CREDENTIAL_SEPARATOR);
	if (separatorIndex <= 0 || separatorIndex >= packed.length - 1) {
		throw new ClassmarkerAPIError(
			'ClassMarker API key and API secret are required',
			'AUTH_ERROR',
		);
	}

	return {
		keyId: packed.slice(0, separatorIndex),
		keySecret: packed.slice(separatorIndex + 1),
	};
}

export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

async function signatureFor(
	keyId: string,
	keySecret: string,
	timestampSeconds: number,
): Promise<string> {
	const signaturePayload = new TextEncoder().encode(
		`${keyId}${keySecret}${timestampSeconds}`,
	);
	const digest = await webcrypto.subtle.digest('SHA-256', signaturePayload);
	return Buffer.from(digest).toString('hex');
}

async function authQuery(
	keyId: string,
	keySecret: string,
	timestampSeconds: number,
): Promise<Record<string, string | number>> {
	return {
		api_key: keyId,
		signature: await signatureFor(keyId, keySecret, timestampSeconds),
		timestamp: timestampSeconds,
	};
}

function maybeThrowClassmarkerError(response: unknown): void {
	if (!response || typeof response !== 'object') {
		return;
	}

	const parsed = response as ClassmarkerErrorResponse;
	if (parsed.status !== 'error') {
		return;
	}

	const code = parsed.error?.error_code;
	const message =
		parsed.error?.error_message ?? 'ClassMarker API returned an error response';

	throw new ClassmarkerAPIError(message, code, {
		nextRequestAfter: parsed.error?.next_request_after,
		retryAfter: parsed.error?.next_request_after
			? Math.max(0, parsed.error.next_request_after * 1000 - Date.now())
			: undefined,
	});
}

export async function makeClassmarkerRequest<T>(
	endpoint: string,
	packedCredentials: string,
	options: {
		method?: RequestMethod;
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { keyId, keySecret } = unpackClassmarkerCredentials(packedCredentials);
	const { method = 'GET', body, query } = options;
	const timestampSeconds = Math.floor(Date.now() / 1000);
	const authParams = await authQuery(keyId, keySecret, timestampSeconds);

	const config: OpenAPIConfig = {
		BASE: CLASSMARKER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: '',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		query: {
			...(query ?? {}),
			...authParams,
		},
	};

	try {
		const response = await request<T>(config, requestOptions);
		maybeThrowClassmarkerError(response);
		return response;
	} catch (error) {
		if (error instanceof ClassmarkerAPIError) {
			throw error;
		}

		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof Error) {
			throw new ClassmarkerAPIError(error.message, undefined, {
				cause: error,
			});
		}

		throw new ClassmarkerAPIError('Unknown error');
	}
}
