export type TunnelType =
	| 'oauth.callback'
	| 'webhook'
	| 'permission.approve'
	| 'permission.deny'
	| 'auth.credentials'
	| 'run';

export type TargetEnvironment = 'dev' | 'staging' | 'production';

export interface ProjectTargets {
	dev?: string;
	staging?: string;
	production?: string;
}

export interface HubKey {
	key: string;
	createdAt: string;
	revokedAt?: string;
}

export interface TenantHubKey extends HubKey {
	tenantId: string;
}

export interface Project {
	id: string;
	name: string;
	apiKey: string;
	signingSecret: string;
	targets: ProjectTargets;
	preferredEnvironment: TargetEnvironment;
	hubKeys: HubKey[];
	webhookHubKeys: HubKey[];
	tenantHubKeys: TenantHubKey[];
	createdAt: string;
	updatedAt: string;
}

export interface AuditEvent {
	id: string;
	projectId: string;
	type: TunnelType;
	timestamp: string;
	status: 'success' | 'failed';
	environment?: TargetEnvironment;
	targetUrl?: string;
	tenantId?: string;
	plugin?: string;
	statusCode?: number;
	error?: string;
}

export interface TunnelEnvelope<TPayload = unknown> {
	type: TunnelType;
	payload: TPayload;
}

export interface TunnelAck {
	status: 'ok' | 'failed';
	retryable?: boolean;
	error?: string;
	webhookResponse?: {
		status?: number;
		body?: unknown;
		headers?: Record<string, string>;
	};
}

export interface CreateProjectInput {
	name: string;
	targets?: ProjectTargets;
	preferredEnvironment?: TargetEnvironment;
}
