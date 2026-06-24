/**
 * Server (production) delivery — hub POSTs a signed JSON envelope to the app's public delivery URL.
 *
 * Used when the app has a reachable `deliveryUrl` (non-loopback). The hub signs the body with
 * HMAC-SHA256 and sends standard `x-corsair-*` headers. The app verifies via
 * {@link verifySignedTunnelDelivery} before handling the payload.
 */

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { TunnelEnvelope, TunnelType } from '../contracts/tunnel';
import { SIGNED_TUNNEL_REPLAY_WINDOW_MS } from '../contracts/tunnel';

/**
 * HTTP headers attached to every server-side delivery POST from the hub.
 */
export type SignedDeliveryHeaders = {
	/** HMAC-SHA256 signature of the raw request body, prefixed with `sha256=`. */
	'x-corsair-signature': string;
	/** Unix timestamp (seconds) when the envelope was signed; used for replay protection. */
	'x-corsair-timestamp': string;
	/** Corsair project id (`proj_*`) the delivery belongs to. */
	'x-corsair-project': string;
	/** Unique nonce for this delivery attempt (one envelope per request). */
	'x-corsair-nonce': string;
	/** Always `application/json`. */
	'content-type': string;
};

/**
 * Result of {@link deliverSignedEnvelope} after the hub POSTs to the app's delivery URL.
 */
export type SignedEnvelopeDeliveryResult = {
	/** Whether the HTTP response was in the 2xx range. */
	ok: boolean;
	/** HTTP status code, or `0` if the request failed to reach the server (network error). */
	status: number;
	/** Raw response body text from the app. */
	body: string;
};

/**
 * Parsed JSON body the app returns to acknowledge a server delivery.
 *
 * Success is indicated by HTTP 204, `{ "status": "ok" }`, or `{ "ok": true }`.
 */
export type ServerDeliveryAckBody = {
	/** Alternative success flag used by some delivery handlers. */
	ok?: boolean;
	/** Primary success indicator: `"ok"` means the payload was applied. */
	status?: string;
	/** Human-readable error when delivery was rejected by the app. */
	error?: string;
};

function parseSignatureHeader(
	value: string | null | undefined,
): string | undefined {
	if (!value) return undefined;
	return value.startsWith('sha256=') ? value.slice('sha256='.length) : value;
}

/**
 * Signs a tunnel envelope for server POST delivery.
 *
 * @param input.projectId - Project that owns this delivery.
 * @param input.signingSecret - Per-project signing secret.
 * @param input.type - Envelope discriminator (e.g. `oauth.callback`, `permission.approve`).
 * @param input.payload - Type-specific payload object serialized into the envelope body.
 */
export function signDeliveryEnvelope(input: {
	projectId: string;
	signingSecret: string;
	type: TunnelType;
	payload: unknown;
}): { body: string; headers: SignedDeliveryHeaders } {
	const body = JSON.stringify({
		type: input.type,
		payload: input.payload,
	} satisfies TunnelEnvelope);
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const signature = createHmac('sha256', input.signingSecret.trim())
		.update(body)
		.digest('hex');

	return {
		body,
		headers: {
			'content-type': 'application/json',
			'x-corsair-signature': `sha256=${signature}`,
			'x-corsair-timestamp': timestamp,
			'x-corsair-project': input.projectId,
			'x-corsair-nonce': randomUUID(),
		},
	};
}

/**
 * Verifies the HMAC signature and timestamp window of an incoming server delivery request.
 *
 * Returns a boolean for low-level checks. Prefer {@link verifySignedTunnelDelivery} in
 * application code for structured error messages.
 */
export function verifyDeliveryEnvelope(input: {
	body: string;
	signatureHeader: string | null | undefined;
	timestampHeader: string | null | undefined;
	signingSecret: string;
}): boolean {
	const signingSecret = input.signingSecret.trim();
	if (!signingSecret) return false;

	const signature = parseSignatureHeader(input.signatureHeader);
	if (!signature) return false;

	const timestamp = Number(input.timestampHeader);
	if (!Number.isFinite(timestamp)) return false;

	const ageMs = Math.abs(Date.now() - timestamp * 1000);
	if (ageMs > SIGNED_TUNNEL_REPLAY_WINDOW_MS) return false;

	const expected = createHmac('sha256', signingSecret)
		.update(input.body)
		.digest('hex');

	try {
		return timingSafeEqual(
			Buffer.from(expected, 'utf8'),
			Buffer.from(signature, 'utf8'),
		);
	} catch {
		return false;
	}
}

/**
 * Verifies an incoming server delivery POST from the app side (`processCorsair` / tunnel handler).
 *
 * Checks signing secret presence, HMAC validity, and timestamp replay window. Returns structured
 * errors suitable for HTTP 401/400 responses.
 */
export function verifySignedTunnelDelivery(input: {
	body: string;
	signatureHeader: string | undefined;
	timestampHeader: string | undefined;
	signingSecret: string;
}): { ok: true } | { ok: false; error: string } {
	const signingSecret = input.signingSecret.trim();
	if (!signingSecret) {
		return { ok: false, error: 'Tunnel signing secret is required' };
	}

	const signature = parseSignatureHeader(input.signatureHeader);
	if (!signature) {
		return { ok: false, error: 'Invalid tunnel signature' };
	}

	const timestamp = Number(input.timestampHeader);
	if (!Number.isFinite(timestamp)) {
		return { ok: false, error: 'Invalid or missing tunnel timestamp' };
	}

	const ageMs = Math.abs(Date.now() - timestamp * 1000);
	if (ageMs > SIGNED_TUNNEL_REPLAY_WINDOW_MS) {
		return {
			ok: false,
			error: 'Tunnel request timestamp is outside the allowed window',
		};
	}

	const expected = createHmac('sha256', signingSecret)
		.update(input.body)
		.digest('hex');

	try {
		if (
			!timingSafeEqual(
				Buffer.from(expected, 'utf8'),
				Buffer.from(signature, 'utf8'),
			)
		) {
			return { ok: false, error: 'Invalid tunnel signature' };
		}
	} catch {
		return { ok: false, error: 'Invalid tunnel signature' };
	}

	return { ok: true };
}

/**
 * Parses the app's JSON acknowledgment body after a server delivery POST.
 */
export function parseServerDeliveryAckBody(
	body: string,
): ServerDeliveryAckBody {
	if (!body) return {};
	try {
		return JSON.parse(body) as ServerDeliveryAckBody;
	} catch {
		return {};
	}
}

/**
 * Determines whether the app accepted a server delivery based on HTTP status and body.
 */
export function isServerDeliveryAckSuccessful(input: {
	httpOk: boolean;
	status: number;
	body: ServerDeliveryAckBody;
}): boolean {
	return (
		input.httpOk &&
		(input.status === 204 ||
			input.body.status === 'ok' ||
			input.body.ok === true)
	);
}

/**
 * Formats a user-facing error when server delivery fails (network, HTTP error, or app rejection).
 */
export function formatServerDeliveryError(input: {
	deliveryUrl: string;
	status: number;
	body: string;
	ack: ServerDeliveryAckBody;
}): string {
	if (input.status === 0) {
		return `Could not reach delivery URL (${input.deliveryUrl}): ${input.ack.error ?? input.body}`;
	}
	return input.ack.error ?? input.body ?? `HTTP ${input.status}`;
}

/**
 * Signs and POSTs a tunnel envelope to the app's delivery URL (hub-side server delivery).
 *
 * Used by the hub for production credential transfer, OAuth callbacks, permission decisions,
 * and connect status introspection.
 */
export async function deliverSignedEnvelope(input: {
	deliveryUrl: string;
	projectId: string;
	signingSecret: string;
	type: TunnelType;
	payload: unknown;
}): Promise<SignedEnvelopeDeliveryResult> {
	const { body, headers } = signDeliveryEnvelope(input);

	try {
		const response = await fetch(input.deliveryUrl, {
			method: 'POST',
			headers,
			body,
		});

		const text = await response.text();
		return { ok: response.ok, status: response.status, body: text };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Delivery request failed';
		return { ok: false, status: 0, body: message };
	}
}
