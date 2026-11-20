/**
 * Corsair HTTP - HTTP client utilities for building Corsair plugin clients
 *
 * This module exports the shared HTTP infrastructure that plugins use
 * to make API requests, handle errors, and verify webhook signatures.
 *
 * @example
 * ```ts
 * import { request, ApiError } from 'corsair/http';
 * import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
 * ```
 */

export { ApiError } from './async-core/ApiError';
export type {
	ApiRequestOptions,
	BinaryResponse,
} from './async-core/ApiRequestOptions';
export type { ApiResult } from './async-core/ApiResult';
export type {
	FileInput,
	FileOutput,
	FileSink,
	FileSinkOptions,
	ResolvedFile,
	ResolveFileOptions,
} from './async-core/files';
export {
	FILE_OUTPUT_MAX_BYTES,
	FileInputSchema,
	FileOutputSchema,
	resolveFileInput,
	setFileSink,
	toFileOutput,
} from './async-core/files';
export type { OpenAPIConfig } from './async-core/OpenAPI';
export type {
	DownloadDeps,
	DownloadOptions,
	PublicDownload,
} from './async-core/public-download';
export {
	downloadPublicFile,
	isBlockedAddress,
	UnsafeUrlError,
} from './async-core/public-download';
export type { RateLimitConfig } from './async-core/rate-limit';
export { request } from './async-core/request';
export type {
	BaseHandleWebhookResult,
	WebhookEventHandler,
} from './async-core/webhook-handler';
export { BaseWebhookHandler } from './async-core/webhook-handler';
export {
	verifyHmacSha256Signature,
	verifyHmacSignature,
	verifyHmacSignatureWithPrefix,
	verifySlackSignature,
} from './async-core/webhook-utils';
