import { createHmac, randomBytes } from 'node:crypto';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ETERMIN_API_BASE = 'https://www.etermin.net';

export class ETerminAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'ETerminAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

export type ETerminCredentials = { publicKey: string; privateKey: string };

export function createETerminSignature(
	salt: string,
	privateKey: string,
): string {
	return createHmac('sha256', privateKey).update(salt, 'utf8').digest('base64');
}

function createSalt(): string {
	return randomBytes(32).toString('base64url');
}

const noTransportRetries: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export async function makeETerminRequest<T>(
	path: string,
	credentials: ETerminCredentials,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		query?: Record<string, string | number | boolean | undefined>;
	},
): Promise<T> {
	const salt = createSalt();
	const config: OpenAPIConfig = {
		BASE: ETERMIN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			publickey: credentials.publicKey,
			salt,
			signature: createETerminSignature(salt, credentials.privateKey),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: options.query,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: noTransportRetries,
		});
	} catch (error) {
		if (error instanceof Error)
			throw new ETerminAPIError(error.message, { cause: error });
		throw new ETerminAPIError('Unknown eTermin request failure');
	}
}
