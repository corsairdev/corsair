import { ManagementApiError } from '../../management/errors';

/** An error response from Corsair Cloud. Extends `ManagementApiError`, so one
 *  `catch` covers both the management API and the runtime. */
export class CloudApiError extends ManagementApiError {
	/** Error family: `invalid_request_error`, `conflict`, `api_error`, … */
	readonly type: string;
	/** Safe to send the same request again. True for 5xx, 429 and timeouts. */
	readonly retryable: boolean;
	/** The request field that was rejected, when one field was at fault. */
	readonly param?: string;
	/** Documentation for this error code. */
	readonly docUrl?: string;
	/** Quote this when reporting a failure. */
	readonly requestId?: string;

	constructor(
		status: number,
		fields: {
			type?: string;
			code: string;
			message?: string;
			retryable?: boolean;
			param?: string;
			doc_url?: string;
			request_id?: string;
		},
	) {
		super(status, fields.code, fields.message, { ...fields });
		this.name = 'CloudApiError';
		this.type = fields.type ?? 'api_error';
		// Status 0 means the server never answered, so nothing was committed.
		this.retryable = fields.retryable ?? (status === 0 || status >= 500);
		this.param = fields.param;
		this.docUrl = fields.doc_url;
		this.requestId = fields.request_id;
	}
}

type V1Envelope = {
	error?: { code?: unknown; [key: string]: unknown } | string;
};

/**
 * Builds a `CloudApiError` from a response.
 *
 * `error` is an object on the management API and a bare code string on the
 * runtime. The `Request-Id` header is the fallback for `requestId`: a gateway
 * failure has no envelope to carry it, which is exactly when it is the only
 * diagnostic there is.
 */
export function mapV1Error(
	status: number,
	body: unknown,
	headers?: Headers,
): CloudApiError {
	const requestId = headers?.get('request-id')?.trim() || undefined;
	const envelope = (body ?? {}) as V1Envelope;
	const err = envelope.error;
	if (typeof err === 'string') {
		const message = (body as { message?: unknown }).message;
		return new CloudApiError(status, {
			code: err,
			message: typeof message === 'string' ? message : undefined,
			request_id: requestId,
		});
	}
	if (err && typeof err === 'object' && typeof err.code === 'string') {
		return new CloudApiError(status, {
			request_id: requestId,
			...(err as { code: string }),
		});
	}
	return new CloudApiError(status, {
		code: status === 0 ? 'request_failed' : 'internal_error',
		message: `Corsair Cloud returned ${status} with no error body`,
		request_id: requestId,
	});
}
