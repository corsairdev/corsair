/**
 * Shared wire-format types for hub ↔ app delivery (browser and server transports).
 */

/**
 * Discriminator for server POST envelope bodies (`{ type, payload }`).
 *
 * Each value maps to a handler in the app's tunnel/delivery endpoint.
 */
export type TunnelType =
	| 'oauth.callback'
	| 'oauth.tokens'
	| 'webhook'
	| 'permission.approve'
	| 'permission.deny'
	| 'auth.credentials'
	| 'connect.status'
	| 'run';

/**
 * JSON body of a server-side delivery POST from the hub.
 *
 * @typeParam TPayload - Shape of `payload` for a given {@link TunnelType}.
 */
export type TunnelEnvelope<TPayload = unknown> = {
	/** Handler discriminator; must match a supported tunnel type. */
	type: TunnelType;
	/** Type-specific data (OAuth code, credentials, permission token, etc.). */
	payload: TPayload;
};

/**
 * Discriminator inside a browser delivery token (`?d=`).
 *
 * Subset of {@link TunnelType} — values delivered via browser redirect rather than POST.
 */
export type BrowserDeliveryMode =
	| 'oauth.callback'
	| 'oauth.tokens'
	| 'permission.approve'
	| 'permission.deny'
	| 'connect.status'
	| 'auth.credentials';

/**
 * Decoded payload inside a browser delivery token (`?d=` query param).
 *
 * Signed by the hub with {@link signBrowserDeliveryToken}; verified by the app with
 * {@link verifyBrowserDeliveryToken}. After applying the payload, the app redirects the
 * user to `hubSuccessUrl`.
 */
export type BrowserDeliveryPayload = {
	/** Unique id for this delivery attempt; used for replay protection. */
	jti: string;
	/** Session or OAuth row id tying this delivery back to hub DB state. */
	connectJti: string;
	/** Corsair project id (`proj_*`). */
	projectId: string;
	/** Plugin this delivery applies to. */
	plugin: string;
	/** Tenant receiving credentials or status. */
	tenantId: string;
	/** URL to redirect the user after the app applies this delivery. */
	hubSuccessUrl: string;
	/** Unix expiry (seconds); browser tokens have a short TTL (~60s). */
	exp: number;
	/** Unix issued-at (seconds). */
	iat: number;
	/** Which kind of payload is included; determines which optional fields are set. */
	deliveryMode?: BrowserDeliveryMode;
	/** BYO OAuth authorization code (`deliveryMode: oauth.callback`). */
	code?: string;
	/** OAuth state echoed from the provider (`deliveryMode: oauth.callback`). */
	state?: string;
	/** OAuth redirect URI used in the authorization request. */
	redirectUri?: string;
	/** Managed OAuth access token (`deliveryMode: oauth.tokens`). */
	accessToken?: string;
	/** Managed OAuth refresh token. */
	refreshToken?: string;
	/** Managed OAuth access token lifetime in seconds. */
	expiresIn?: number;
	/** OAuth scopes granted. */
	scope?: string;
	/** SDK permission token to approve or deny (`deliveryMode: permission.*`). */
	permissionToken?: string;
	/** Hub page origin for iframe postMessage replies (legacy client bridge). */
	hubOrigin?: string;
	/** Optional correlation id for debugging. */
	requestId?: string;
	/** Plugins to include in a connect status introspection response. */
	statusPlugins?: string[];
	/** API key / bot token fields (`deliveryMode: auth.credentials`). */
	credentials?: Record<string, string>;
};

/** Max age of a browser delivery token (60 seconds). */
export const BROWSER_DELIVERY_TTL_MS = 60 * 1000;

/** Max age of a server delivery request timestamp (5 minutes). */
export const SIGNED_TUNNEL_REPLAY_WINDOW_MS = 5 * 60 * 1000;
