import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class MailboxLayerAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	/** mailboxlayer's own 3-digit error code (e.g. 101 invalid_access_key), distinct from HTTP status */
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

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists
// for this state, so message matching is the only handle available; kept
// narrow on purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored access_key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only
 * ever configure the key via plugin options and never touch the key
 * manager — and must resolve to "no stored key" rather than abort the
 * request. Anything else thrown (decryption failure, database error, ...)
 * is a real operational problem, not an absent key, and must propagate.
 */
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

/**
 * Redacts an email address for event logs (`logEventFromContext` persists
 * its payload to `corsair_events`) — keeps the first character and domain
 * for debugging/correlation without storing the full address in plaintext.
 */
export function redactEmail(email: string): string {
	const atIndex = email.indexOf('@');
	if (atIndex <= 0) return '***';
	return `${email[0]}***${email.slice(atIndex)}`;
}

/**
 * mailboxlayer's error shape, returned with an HTTP 200 status (not a 4xx/5xx)
 * for every documented failure — invalid key, exhausted quota, bad input, etc.
 * all come back as `{ success: false, error: {...} }` on a 200 response, so
 * the only way to detect them is to check `success` in the parsed body.
 */
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

/**
 * Performs a request against the mailboxlayer API.
 *
 * Auth: API key passed as the `access_key` query parameter (the only
 * supported method). All endpoints are GET-only.
 */
export async function makeMailboxLayerRequest<T>(
	endpoint: string,
	accessKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { query = {} } = options;

	const config: OpenAPIConfig = {
		BASE: MAILBOXLAYER_API_BASE,
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
