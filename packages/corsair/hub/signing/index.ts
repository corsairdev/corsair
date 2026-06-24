/**
 * Hub signing module — shared crypto between the Corsair hub server and Corsair apps.
 *
 * Three layers:
 * - **Session URL tokens** — authenticate hub UI pages (`/connect/[token]`, `/approve/[token]`).
 * - **Browser delivery** — short-lived `?d=` tokens for localhost credential transfer.
 * - **Server envelopes** — HMAC-signed POST bodies for production delivery.
 *
 * All tokens use the per-project `signingSecret` (`csec_*`) created when a hub project is registered.
 */

export {
	BROWSER_DELIVERY_TTL_MS,
	type BrowserDeliveryPayload,
	buildBrowserDeliveryRedirectUrl,
	signBrowserDeliveryToken,
	verifyBrowserDeliveryToken,
} from './browser-delivery';
export {
	type ConnectSessionTokenPayload,
	createConnectSessionJti,
	decodeConnectSessionTokenFromPath,
	getConnectSessionExpiryMs,
	signConnectSessionToken,
	verifyConnectSessionToken,
} from './connect-session-token';
export {
	type ConnectTokenPayload,
	createConnectTokenJti,
	decodeConnectTokenFromPath,
	encodeConnectTokenForPath,
	getConnectTokenExpiryMs,
	signConnectToken,
	verifyConnectToken,
} from './connect-token';
export {
	deliverSignedEnvelope,
	formatServerDeliveryError,
	isServerDeliveryAckSuccessful,
	parseServerDeliveryAckBody,
	type ServerDeliveryAckBody,
	type SignedDeliveryHeaders,
	type SignedEnvelopeDeliveryResult,
	signDeliveryEnvelope,
	verifyDeliveryEnvelope,
	verifySignedTunnelDelivery,
} from './envelope';
export {
	createPermissionSessionJti,
	decodePermissionTokenFromPath,
	type PermissionTokenPayload,
	signPermissionToken,
	verifyPermissionToken,
} from './permission-token';
export {
	createSignedTokenJti,
	decodeTokenFromPath,
	type ExpiringTokenPayload,
	encodeTokenForPath,
	signPayloadBase64,
	signTokenWithExpiry,
	signTokenWithTtl,
	verifySignedToken,
} from './signed-token';
