import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class MailboxLayerAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly apiCode?: number;
	public readonly apiType?: string;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			apiCode?: number;
			apiType?: string;
		},
	) {
		super(message, options);
		this.name = 'MailboxLayerAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
		this.apiCode = options?.apiCode;
		this.apiType = options?.apiType;
	}
}

export const MAILBOXLAYER_API_BASE = 'https://apilayer.net/api';
export const MAILBOXLAYER_API_BASE_HTTP = 'http://apilayer.net/api';

export function mailboxLayerApiBase(useHttps = true): string {
	return useHttps === false
		? MAILBOXLAYER_API_BASE_HTTP
		: MAILBOXLAYER_API_BASE;
}

const NO_DEK_ERROR_PATTERN = /no dek found/i;

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

export function redactEmail(email: string): string {
	const atIndex = email.indexOf('@');
	if (atIndex <= 0) return '***';
	return `${email[0]}***${email.slice(atIndex)}`;
}

interface MailboxLayerErrorBody {
	success: false;
	error: {
		code: number;
		type: string;
		info: string;
	};
}

function isMailboxLayerErrorBody(
	value: unknown,
): value is MailboxLayerErrorBody {
	return (
		typeof value === 'object' &&
		value !== null &&
		'success' in value &&
		(value as { success: unknown }).success === false
	);
}

export async function makeMailboxLayerRequest<T>(
	endpoint: string,
	accessKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
		useHttps?: boolean;
	} = {},
): Promise<T> {
	const { query = {}, useHttps } = options;

	const config: OpenAPIConfig = {
		BASE: mailboxLayerApiBase(useHttps !== false),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		access_key: accessKey,
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: queryWithAuth,
	};

	let raw: T | MailboxLayerErrorBody;
	try {
		raw = await request<T | MailboxLayerErrorBody>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MailboxLayerAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new MailboxLayerAPIError(error.message, { cause: error });
		}
		throw new MailboxLayerAPIError('Unknown error');
	}

	if (isMailboxLayerErrorBody(raw)) {
		throw new MailboxLayerAPIError(raw.error.info, {
			apiCode: raw.error.code,
			apiType: raw.error.type,
		});
	}

	return raw;
}
