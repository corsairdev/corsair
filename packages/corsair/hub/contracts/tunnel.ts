// Shared tunnel envelope types used by the remote hub and corsair delivery endpoint.

export type TunnelType =
	| 'oauth.callback'
	| 'oauth.tokens'
	| 'webhook'
	| 'permission.approve'
	| 'permission.deny'
	| 'auth.credentials'
	| 'connect.status'
	| 'run';

export type TunnelEnvelope<TPayload = unknown> = {
	type: TunnelType;
	payload: TPayload;
};

export type BrowserDeliveryMode =
	| 'oauth.callback'
	| 'oauth.tokens'
	| 'permission.approve'
	| 'permission.deny'
	| 'connect.status'
	| 'auth.credentials';

export type BrowserDeliveryPayload = {
	jti: string;
	connectJti: string;
	projectId: string;
	plugin: string;
	tenantId: string;
	hubSuccessUrl: string;
	exp: number;
	iat: number;
	deliveryMode?: BrowserDeliveryMode;
	code?: string;
	state?: string;
	redirectUri?: string;
	accessToken?: string;
	refreshToken?: string;
	expiresIn?: number;
	scope?: string;
	permissionToken?: string;
	/** Hub page origin for iframe postMessage replies (client bridge). */
	hubOrigin?: string;
	requestId?: string;
	statusPlugins?: string[];
	credentials?: Record<string, string>;
};

export const BROWSER_DELIVERY_TTL_MS = 60 * 1000;
export const SIGNED_TUNNEL_REPLAY_WINDOW_MS = 5 * 60 * 1000;
