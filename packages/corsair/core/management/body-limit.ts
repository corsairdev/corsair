// ─────────────────────────────────────────────────────────────────────────────
// Shared inbound body-size ceiling and stream-stall watchdog for the
// management/delivery surface.
//
// The Node bridge drains raw streams that no framework parser ever capped
// (express.json()/bodyLimit normally enforce this), so without a limit any
// client that can reach the mount path could buffer unbounded bytes in memory
// before routing or signature checks run. 1 MiB matches Fastify's default
// `bodyLimit`. The cap is enforced in resolveBody for EVERY body source —
// drained streams AND host-captured buffers (registerCorsairRawBodyParser,
// express.raw(), NestJS rawBody) — and by BYTE-COUNTING every Web Request
// read in managementHandler/hub delivery, so chunked bodies without a
// declared content-length are bounded on Web-native runtimes too (the
// advisory content-length gate alone cannot see those).
//
// A slowloris twin exists beyond size: a sender trickling chunks just under
// the cap pins the connection forever on hosts without their own deadline
// (Fastify ships requestTimeout: 0). drainRawBody and every Web Request read
// therefore race each chunk against an idle-gap watchdog (default 30s,
// between-chunks like nginx client_body_timeout) and answer 408 when it fires.
// ─────────────────────────────────────────────────────────────────────────────

import { ManagementApiError } from './errors';

export const DEFAULT_MAX_BODY_BYTES = 1024 * 1024;
export const DEFAULT_BODY_STALL_TIMEOUT_MS = 30_000;

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

/**
 * Resolves the idle-gap watchdog for body reads. Unlike the byte cap, `0` is a
 * meaningful value here — it DISABLES the watchdog for operators whose hosts
 * already enforce their own deadlines — so only undefined / non-finite /
 * negative inputs fall back to the default.
 */
export function resolveBodyStallTimeoutMs(bodyStallTimeoutMs?: number): number {
	if (
		bodyStallTimeoutMs !== undefined &&
		Number.isFinite(bodyStallTimeoutMs) &&
		bodyStallTimeoutMs >= 0
	) {
		return bodyStallTimeoutMs;
	}
	return DEFAULT_BODY_STALL_TIMEOUT_MS;
}

export function bodyTooLargeError(maxBytes: number): ManagementApiError {
	return new ManagementApiError(
		413,
		'payload_too_large',
		`Request body exceeds the ${maxBytes}-byte limit`,
	);
}

export function bodyStalledError(timeoutMs: number): ManagementApiError {
	return new ManagementApiError(
		408,
		'request_timeout',
		`Request body stalled: no bytes received for ${timeoutMs}ms`,
	);
}

/**
 * Races one stream-read against the idle-gap watchdog. Every body read corsair
 * performs goes through this, so a stalled or trickling upload can never hold
 * a connection open longer than one gap between chunks. `0` disables.
 */
export async function withBodyStallTimeout<T>(
	op: () => Promise<T>,
	stallTimeoutMs: number,
): Promise<T> {
	if (!(stallTimeoutMs > 0)) return op();
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		return await Promise.race([
			op(),
			new Promise<never>((_, reject) => {
				timer = setTimeout(
					() => reject(bodyStalledError(stallTimeoutMs)),
					stallTimeoutMs,
				);
			}),
		]);
	} finally {
		clearTimeout(timer);
	}
}

export type CappedReadOptions = {
	maxBodyBytes: number;
	bodyStallTimeoutMs: number;
};

/**
 * Reads a Web Request body to text under the byte-counting cap and the stall
 * watchdog — the Web-runtime counterpart of the Node bridge's drainRawBody,
 * which such adapters bypass entirely. Byte counting (rather than trusting
 * content-length) is what bounds chunked bodies that declare no length at
 * all; reader.cancel() on overflow mirrors discardRequestBody so the
 * connection is released instead of pinned until the sender finishes.
 */
export async function readRequestBodyTextCapped(
	req: Request,
	limits: CappedReadOptions,
): Promise<string> {
	if (req.body === null) return '';
	const reader = req.body.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	for (;;) {
		const { done, value } = await withBodyStallTimeout(
			() => reader.read(),
			limits.bodyStallTimeoutMs,
		);
		if (done) break;
		total += value.byteLength;
		if (total > limits.maxBodyBytes) {
			try {
				await reader.cancel();
			} catch {
				// The stream may already be closed or errored — cancel is hygiene
				// here, not control flow; the 413 below is the real answer.
			}
			throw bodyTooLargeError(limits.maxBodyBytes);
		}
		chunks.push(value);
	}
	// Decode once over the concatenated bytes: per-chunk decoding would split
	// multi-byte UTF-8 characters across chunk boundaries.
	const full = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		full.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return new TextDecoder().decode(full);
}
