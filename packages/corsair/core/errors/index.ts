import type { AllErrors } from '../constants';

export type RetryStrategies =
	| 'linear_1s'
	| 'linear_2s'
	| 'linear_3s'
	| 'linear_4s'
	| 'exponential_backoff'
	| 'exponential_backoff_jitter';

export type ErrorContext = {
	pluginId: string;
	operation: string;
	input: Record<string, unknown>;
	originalError: Error;
};

/**
 * Retry Strategy type
 *
 * @param maxRetries Maximum number of times to retry
 * @param retryStrategy Enum for generic retry strategies
 * @param headersRetryAfterMs Respect retryAfter from custom API error headers (in milliseconds)
 */
export type RetryStrategy = {
	maxRetries?: number;
	retryStrategy?: RetryStrategies;
	headersRetryAfterMs?: number;
};

export type ErrorMatcher = (error: Error, context: ErrorContext) => boolean;

export type ErrorHandler = (
	error: Error,
	context: ErrorContext,
) => Promise<RetryStrategy>;

export type ErrorHandlerAndMatchFunction = {
	match: ErrorMatcher;
	handler: ErrorHandler;
};

export type CorsairErrorHandler = {
	[K in AllErrors]?: ErrorHandlerAndMatchFunction;
};
