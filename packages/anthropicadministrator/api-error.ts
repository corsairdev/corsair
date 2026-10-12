import { ApiError } from 'corsair/http';
import { z } from 'zod';
import type { AnthropicAdministratorMethod } from './client';

/**
 * Error thrown by every Admin API call.
 *
 * The transport status and rate-limit metadata are copied off the underlying
 * `ApiError` so `error-handlers.ts` can match on them — a wrapper that only
 * carried `message` would make the 429 policy unreachable, because corsair
 * throws a 429 with the message "Too Many Requests" (no status in the text).
 */
export class AnthropicAdministratorAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	/** Admin API error bodies are `{ type: "error", error: { type, message } }`. */
	// Safe: the body is only read through `readErrorType`, which validates it with zod.
	// A narrower type is not practical because gateways and proxies can return non-Anthropic error bodies.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	/** HTTP method of the failed request, so retries can tell reads from writes. */
	public readonly method?: AnthropicAdministratorMethod;
	/** Anthropic error type, e.g. `authentication_error`, `not_found_error`. */
	public readonly errorType?: string;

	constructor(
		message: string,
		options?: { cause?: Error; method?: AnthropicAdministratorMethod },
	) {
		super(message, options);
		this.name = 'AnthropicAdministratorAPIError';
		this.method = options?.method;

		const cause = options?.cause;
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.statusText = cause.statusText;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
			this.errorType = readErrorType(cause.body);
		}
	}
}

const ErrorEnvelopeSchema = z.object({ error: z.object({ type: z.string() }) });

/** Pulls `error.type` out of an Anthropic error envelope when present. */
// Safe: the value is validated with `ErrorEnvelopeSchema` before any field is read.
// A narrower type is not practical because the body comes straight off the wire.
export function readErrorType(body: unknown): string | undefined {
	return ErrorEnvelopeSchema.safeParse(body).data?.error.type;
}
