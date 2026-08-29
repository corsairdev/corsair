import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class MailcheckAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MailcheckAPIError';
	}
}

const MAILCHECK_API_BASE = 'https://api.mailcheck.co';

export async function makeMailcheckRequest<T>(
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
		BASE: MAILCHECK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
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
		// ApiError carries status and retryAfter that error-handlers.ts
		// needs for rate-limit and auth matching. Re-throw as-is.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new MailcheckAPIError(error.message);
		}
		throw new MailcheckAPIError('Unknown error');
	}
}

export type MailcheckOperationMetadata = {
	totalCount?: number;
	processedCount?: number;
	freeLimitReached?: boolean;
	createTime?: string;
};

export type MailcheckOperation = {
	name: string;
	done: boolean;
	metadata?: MailcheckOperationMetadata;
	response?: { url?: string };
	error?: { code?: number; message?: string };
};

const OPERATION_POLL_INTERVAL_MS = 2000;
const OPERATION_POLL_TIMEOUT_MS = 90_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mailcheck runs one batch operation at a time per account; submitting
// another while one is running returns 400 "wait for the running operation
// to finish" (google.rpc code 9, FAILED_PRECONDITION).
const BUSY_MESSAGE = 'wait for the running operation';

function isOperationBusy(error: unknown): boolean {
	if (!(error instanceof ApiError) || error.status !== 400) return false;
	// ApiError.message may be the plain 'Bad Request' status text while the
	// response body carries the real google.rpc error message.
	const haystack = `${error.message} ${String(error.body ?? '')}`;
	return haystack.toLowerCase().includes(BUSY_MESSAGE);
}

async function waitForOperation(
	operationId: string,
	apiKey: string,
	deadline: number,
): Promise<MailcheckOperation> {
	let current = await makeMailcheckRequest<MailcheckOperation>(
		`/v1/emails/operations/${operationId}`,
		apiKey,
		{ method: 'GET' },
	);

	while (!current.done) {
		if (Date.now() > deadline) {
			throw new MailcheckAPIError(
				`Mailcheck operation ${operationId} did not complete within ${OPERATION_POLL_TIMEOUT_MS}ms`,
				'OPERATION_TIMEOUT',
			);
		}
		await sleep(OPERATION_POLL_INTERVAL_MS);
		current = await makeMailcheckRequest<MailcheckOperation>(
			`/v1/emails/operations/${operationId}`,
			apiKey,
			{ method: 'GET' },
		);
	}

	return current;
}

/**
 * Mailcheck has no synchronous single-email endpoint. Verification is a
 * batch job: POST /v1/emails:check creates a long-running operation, and
 * GET /v1/emails/operations/{id} exposes a signed results URL on
 * response.url once done. This helper runs that whole flow for one email.
 *
 * Only one operation can run at a time per account, so a 400 "wait for the
 * running operation to finish" response triggers a wait-and-retry loop.
 */
export async function checkSingleEmail<T>(
	email: string,
	apiKey: string,
): Promise<T> {
	const deadline = Date.now() + OPERATION_POLL_TIMEOUT_MS;

	let operation: MailcheckOperation | undefined;
	while (!operation) {
		if (Date.now() > deadline) {
			throw new MailcheckAPIError(
				`Mailcheck stayed busy with another operation for ${OPERATION_POLL_TIMEOUT_MS}ms`,
				'OPERATION_BUSY_TIMEOUT',
			);
		}
		try {
			operation = await makeMailcheckRequest<MailcheckOperation>(
				'/v1/emails:check',
				apiKey,
				{ method: 'POST', body: { emails: [email] } },
			);
		} catch (error) {
			if (!isOperationBusy(error)) throw error;
			await sleep(OPERATION_POLL_INTERVAL_MS);
		}
	}

	const operationId = operation.name.replace(/^operations\//, '');
	const current = operation.done
		? operation
		: await waitForOperation(operationId, apiKey, deadline);

	if (current.error) {
		throw new MailcheckAPIError(
			current.error.message ?? 'Mailcheck operation failed',
			current.error.code !== undefined ? String(current.error.code) : undefined,
		);
	}

	const resultsUrl = current.response?.url;
	if (!resultsUrl) {
		throw new MailcheckAPIError(
			'Mailcheck operation completed without a results URL',
			'MISSING_RESULTS',
		);
	}

	// The signed URL points to a JSON document on Google Cloud Storage.
	// A single-email check returns an object; multi-email checks return an
	// array, which we do not produce here but tolerate defensively.
	const raw: unknown = await request<unknown>(
		{
			BASE: resultsUrl,
			VERSION: '1.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		},
		{ method: 'GET', url: '' },
	);

	const results = Array.isArray(raw) ? raw : [raw];
	const result = results.find(
		(item): item is Record<string, unknown> =>
			typeof item === 'object' &&
			item !== null &&
			(item as Record<string, unknown>).email === email,
	);

	if (!result) {
		throw new MailcheckAPIError(
			`Mailcheck results did not include ${email}`,
			'MISSING_RESULT',
		);
	}

	return result as T;
}
