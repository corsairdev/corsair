/**
 * Conversion Tools' official Node client uses a five-minute request timeout.
 * Keep transfer calls configurable, with a ten-minute upper bound matching the
 * provider's published Python upload/download examples.
 */
export const DEFAULT_TRANSFER_TIMEOUT_MS = 300_000;
export const MIN_TRANSFER_TIMEOUT_MS = 20_000;
export const MAX_TRANSFER_TIMEOUT_MS = 600_000;

/** Base64 JSON responses amplify file size and require additional allocations. */
export const MAX_BINARY_DOWNLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_BINARY_DOWNLOAD_SIZE_LABEL = '10 MiB';

/**
 * Most bytes a link or base64 upload is read into. Conversion Tools caps the
 * file size per plan and reports it in `x-ratelimit-limit-filesize` instead of
 * documenting one number (https://conversiontools.io/llms-full.txt §4), so a
 * multipart upload is held to core's 25 MB download default and the
 * large-file session route to 100 MB. A Blob is sent as given, unchecked.
 */
export const MAX_UPLOAD_LINK_BYTES = 25 * 1024 * 1024;
export const MAX_SESSION_UPLOAD_LINK_BYTES = 100 * 1024 * 1024;
