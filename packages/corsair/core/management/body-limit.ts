// ─────────────────────────────────────────────────────────────────────────────
// Shared inbound body-size ceiling for the management/delivery surface.
//
// The Node bridge drains raw streams that no framework parser ever capped
// (express.json()/bodyLimit normally enforce this), so without a limit any
// client that can reach the mount path could buffer unbounded bytes in memory
// before routing or signature checks run. 1 MiB matches Fastify's default
// `bodyLimit`. The cap is enforced in resolveBody for EVERY body source —
// drained streams AND host-captured buffers (registerCorsairRawBodyParser,
// express.raw(), NestJS rawBody) — and as an advisory content-length gate in
// managementHandler before any routing or body read happens on Web runtimes.
// ─────────────────────────────────────────────────────────────────────────────

import { ManagementApiError } from './errors';

export const DEFAULT_MAX_BODY_BYTES = 1024 * 1024;

export function resolveMaxBodyBytes(maxBodyBytes?: number): number {
	// A non-finite value would silently disable every comparison-based cap
	// (`x > NaN` is always false → unlimited buffering) and a non-positive one
	// would reject every body — fall back to the default instead of trusting it.
	if (
		maxBodyBytes !== undefined &&
		Number.isFinite(maxBodyBytes) &&
		maxBodyBytes > 0
	) {
		return maxBodyBytes;
	}
	return DEFAULT_MAX_BODY_BYTES;
}

export function bodyTooLargeError(maxBytes: number): ManagementApiError {
	return new ManagementApiError(
		413,
		'payload_too_large',
		`Request body exceeds the ${maxBytes}-byte limit`,
	);
}
