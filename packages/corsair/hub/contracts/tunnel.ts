// Shared tunnel envelope types used by the remote hub and corsair delivery endpoint.

export type TunnelType =
	| 'oauth.callback'
	| 'oauth.tokens'
	| 'webhook'
	| 'permission.approve'
	| 'permission.deny'
	| 'auth.credentials'
	| 'run';

export type TunnelEnvelope<TPayload = unknown> = {
	type: TunnelType;
	payload: TPayload;
};

export type BrowserDeliveryMode =
	| 'oauth.callback'
	| 'oauth.tokens'
	| 'permission.approve'
	| 'permission.deny';
