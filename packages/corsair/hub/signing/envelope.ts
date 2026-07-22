/**
 * Server (production) delivery — hub POSTs a signed JSON envelope to the app's public delivery URL.
 *
 * Used when the app has a reachable `deliveryUrl` (non-loopback). The hub signs the body with
 * HMAC-SHA256 and sends standard `x-corsair-*` headers. The app verifies via
 * {@link verifySignedTunnelDelivery} before handling the payload.
 */

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { ConnectCreateLinkDeliveryResult } from '../connect-link-delivery';
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
	/** Hosted connect URL returned by connect.create_link deliveries. */
	connectUrl?: string;
	/** ISO expiry for connect.create_link deliveries. */
	expiresAt?: string;
	/** Encrypted tenant/plugin manifest returned by connections.sync deliveries. */
	sync?: {
		encrypted: string;
	};
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
 * Reads the encrypted connections.sync payload from a parsed delivery ack body.
 */
export function extractSyncFromDeliveryAck(
	body: ServerDeliveryAckBody,
): { encrypted: string } | null {
	const encrypted = body.sync?.encrypted;
	if (typeof encrypted !== 'string' || !encrypted.trim()) {
		return null;
	}
	return { encrypted: encrypted.trim() };
}

export function extractConnectLinkFromDeliveryAck(
	body: ServerDeliveryAckBody,
): ConnectCreateLinkDeliveryResult | null {
	const connectUrl = body.connectUrl?.trim();
	if (!connectUrl) {
		return null;
	}

	return { connectUrl, expiresAt: body.expiresAt };
}

/**
 * Parses connect link payload from a raw delivery HTTP body.
 */
export function parseConnectLinkFromDeliveryBody(
	body: string,
): ConnectCreateLinkDeliveryResult | null {
	return extractConnectLinkFromDeliveryAck(parseServerDeliveryAckBody(body));
}

/**
 * POSTs a connect.create_link envelope to the app's delivery URL.
 */
export async function deliverConnectCreateLink(input: {
	deliveryUrl: string;
	projectId: string;
	signingSecret: string;
	tenantId: string;
	plugins: string[];
}): Promise<ConnectCreateLinkDeliveryResult> {
	const delivery = await deliverSignedEnvelope({
		deliveryUrl: input.deliveryUrl,
		projectId: input.projectId,
		signingSecret: input.signingSecret,
		type: 'connect.create_link',
		payload: {
			tenantId: input.tenantId,
			plugins: input.plugins,
		},
	});

	const ack = parseServerDeliveryAckBody(delivery.body);
	const ok = isServerDeliveryAckSuccessful({
		httpOk: delivery.ok,
		status: delivery.status,
		body: ack,
	});
	const result = extractConnectLinkFromDeliveryAck(ack);

	if (!ok || !result) {
		throw new Error(
			formatServerDeliveryError({
				deliveryUrl: input.deliveryUrl,
				status: delivery.status,
				body: delivery.body,
				ack,
			}),
		);
	}

	return result;
}

/**
 * Parses sync payload from a raw delivery HTTP body using the standard ack contract.
 */
export function parseSyncFromDeliveryBody(
	body: string,
): { encrypted: string } | null {
	return extractSyncFromDeliveryAck(parseServerDeliveryAckBody(body));
}

function getErrorCauseCode(error: unknown): string | undefined {
	let current: unknown = error;
	while (current) {
		if (current instanceof Error) {
			const code = (current as NodeJS.ErrnoException).code;
			if (typeof code === 'string') return code;
			current = current.cause;
			continue;
		}
		if (typeof current === 'object' && current !== null && 'code' in current) {
			const code = (current as { code?: unknown }).code;
			if (typeof code === 'string') return code;
		}
		break;
	}
	return undefined;
}

function truncateDeliveryBody(body: string, max = 200): string {
	const trimmed = body.trim();
	if (trimmed.length <= max) return trimmed;
	return `${trimmed.slice(0, max)}…`;
}

const SIGNING_SECRET_REMEDIATION =
	'Verify hub.signingSecret in your app matches the signing secret shown in Hub project settings.';

const DELIVERY_URL_REMEDIATION =
	'Check the delivery URL configured for this environment.';

function formatAuthDeliveryError(input: {
	deliveryUrl: string;
	status: number;
	ack: ServerDeliveryAckBody;
}): string {
	const base = input.ack.error
		? `${input.ack.error} (HTTP ${input.status} from ${input.deliveryUrl})`
		: `App rejected the signed delivery (HTTP ${input.status} from ${input.deliveryUrl})`;
	return `${base}. ${SIGNING_SECRET_REMEDIATION}`;
}

function formatNotFoundDeliveryError(input: {
	deliveryUrl: string;
	ack: ServerDeliveryAckBody;
}): string {
	const base = input.ack.error
		? `${input.ack.error} (HTTP 404 from ${input.deliveryUrl})`
		: `Delivery endpoint not found at ${input.deliveryUrl} (HTTP 404)`;
	return `${base}. ${DELIVERY_URL_REMEDIATION}`;
}

/**
 * Formats a fetch/network failure into a user-facing delivery reachability error.
 */
export function describeDeliveryNetworkError(
	deliveryUrl: string,
	error: unknown,
): string {
	const code = getErrorCauseCode(error);
	const rootMessage =
		error instanceof Error ? error.message : 'Delivery request failed';

	let detail: string;
	switch (code) {
		case 'ECONNREFUSED':
			detail =
				'connection refused — nothing accepted a TCP connection on that host and port';
			break;
		case 'ENOTFOUND':
			detail = 'host not found — DNS could not resolve the hostname';
			break;
		case 'ETIMEDOUT':
		case 'UND_ERR_CONNECT_TIMEOUT':
			detail = 'connection timed out before the app responded';
			break;
		case 'ECONNRESET':
			detail = 'connection reset while talking to the app';
			break;
		case 'CERT_HAS_EXPIRED':
		case 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':
		case 'DEPTH_ZERO_SELF_SIGNED_CERT':
			detail = `TLS certificate error (${code})`;
			break;
		default:
			detail =
				rootMessage === 'fetch failed' && code
					? `${rootMessage} (${code})`
					: rootMessage;
	}

	const message = [`Could not reach ${deliveryUrl}`, detail];
	return message.join('. ');
}

/**
 * Input to {@link formatServerDeliveryError}.
 */
export type FormatServerDeliveryErrorInput = {
	deliveryUrl: string;
	status: number;
	body: string;
	ack: ServerDeliveryAckBody;
};

/**
 * Formats a user-facing error when server delivery fails (network, HTTP error, or app rejection).
 */
export function formatServerDeliveryError(
	input: FormatServerDeliveryErrorInput,
): string {
	if (input.status === 0) {
		if (input.ack.error) {
			return input.ack.error;
		}
		if (input.body.startsWith('Could not reach')) {
			return input.body;
		}
		return describeDeliveryNetworkError(
			input.deliveryUrl,
			new Error(input.body || 'Delivery request failed'),
		);
	}

	if (input.status === 401 || input.status === 403) {
		return formatAuthDeliveryError(input);
	}

	if (input.status === 404) {
		return formatNotFoundDeliveryError(input);
	}

	if (input.ack.error) {
		return `${input.ack.error} (HTTP ${input.status} from ${input.deliveryUrl})`;
	}

	if (input.status >= 500) {
		const body = input.body.trim();
		return body
			? `App failed while processing the delivery (HTTP ${input.status} from ${input.deliveryUrl}): ${truncateDeliveryBody(body)}`
			: `App failed while processing the delivery (HTTP ${input.status} from ${input.deliveryUrl})`;
	}

	const body = input.body.trim();
	if (body) {
		return `${truncateDeliveryBody(body)} (HTTP ${input.status} from ${input.deliveryUrl})`;
	}

	return `Delivery failed with HTTP ${input.status} from ${input.deliveryUrl}`;
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
		return {
			ok: false,
			status: 0,
			body: describeDeliveryNetworkError(input.deliveryUrl, error),
		};
	}
}
