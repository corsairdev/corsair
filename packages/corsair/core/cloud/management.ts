// Hub v1 REST management API (/project, /keys, /instances, /connections,
// /grants) — a separate contract from the VM-local manage.ts (tenants,
// connect, connectionStatus, disconnect). Tenant management is deliberately
// NOT built here: hub v1 also exposes /tenants, but reconciling it with the
// existing runtime-targeted manage.tenants is a published-contract decision,
// deferred.
import { ManagementApiError } from '../management/errors';
import type { CloudTransport } from './http';
import { cloudRequest } from './http';

export type CloudProject = {
	id: string;
	status: string;
	instances: number;
	mcpOauthUrl: string;
	created: string;
};

export type CloudKeys = { projectKey: string };

export type CloudInstance = {
	id: string;
	instanceKey: string;
	writable: boolean;
	credentialSource: string;
	quotaLimit: number | null;
	quotaWindow: string | null;
};

export type CloudInstanceList = {
	data: CloudInstance[];
	hasMore: boolean;
	nextCursor: string | null;
};

export type CloudConnection = {
	instance: string;
	tenant: string;
	integration: string;
	status: string;
};

export type CloudGrantInstance = {
	instance: string;
	tenant?: string;
	permission: string;
};

export type CloudGrant = {
	id: string;
	recipient: string | null;
	tenant: string | null;
	instances: CloudGrantInstance[];
	url: string | null;
	created: string;
};

export type MintGrantInput = {
	recipient?: string;
	instances: { instance: string; permission: string; tenant?: string }[];
	/** Passed through as the Idempotency-Key header when set. */
	idempotencyKey?: string;
};

export type UpdateGrantInput = {
	instances: { instance: string; permission: string; tenant?: string }[];
	recipient?: string;
};

export type RevokeGrantResult = { id: string; revoked: boolean };

// v1's error envelope nests ({error:{type,code,message,param?}}), unlike the
// flat runtime shape mapCloudError expects — same ManagementApiError type,
// different wire shape to parse.
function mapV1Error(status: number, body: unknown): ManagementApiError {
	const envelope = (
		body as
			| {
					error?: {
						type?: string;
						code?: string;
						message?: string;
						param?: string;
					};
			  }
			| undefined
	)?.error;
	if (!envelope)
		return new ManagementApiError(status, 'internal_error', 'Internal error');
	const { code, type, message, param } = envelope;
	return new ManagementApiError(
		status,
		code ?? type ?? 'internal_error',
		message,
		{
			...(type ? { type } : {}),
			...(param ? { param } : {}),
		},
	);
}

function queryString(params: Record<string, string | undefined>): string {
	const entries = Object.entries(params).filter(([, v]) => !!v);
	if (!entries.length) return '';
	return `?${entries.map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`).join('&')}`;
}

// Raw snake_case wire payloads from the hub, parsed into the typed shapes above.
type Raw = any;

function mapProject(raw: Raw): CloudProject {
	return {
		id: raw.id,
		status: raw.status,
		instances: raw.instances,
		mcpOauthUrl: raw.mcp_oauth_url,
		created: raw.created,
	};
}

function mapKeys(raw: Raw): CloudKeys {
	return { projectKey: raw.project_key };
}

function mapInstance(raw: Raw): CloudInstance {
	return {
		id: raw.id,
		instanceKey: raw.instance_key,
		writable: raw.writable,
		credentialSource: raw.credential_source,
		quotaLimit: raw.quota_limit ?? null,
		quotaWindow: raw.quota_window ?? null,
	};
}

function mapConnection(raw: Raw): CloudConnection {
	return {
		instance: raw.instance,
		tenant: raw.tenant,
		integration: raw.integration,
		status: raw.status,
	};
}

function mapGrantInstance(raw: Raw): CloudGrantInstance {
	return {
		instance: raw.instance,
		tenant: raw.tenant,
		permission: raw.permission,
	};
}

function mapGrant(raw: Raw): CloudGrant {
	return {
		id: raw.id,
		recipient: raw.recipient ?? null,
		tenant: raw.tenant ?? null,
		instances: (raw.instances ?? []).map(mapGrantInstance),
		url: raw.url ?? null,
		created: raw.created,
	};
}

export function buildCloudV1Management(transport: CloudTransport) {
	const request = <T>(
		method: string,
		path: string,
		body?: unknown,
		headers?: Record<string, string>,
	) =>
		cloudRequest<T>(transport, method, path, body, {
			headers,
			mapError: mapV1Error,
		});

	return {
		project: {
			get: () => request<Raw>('GET', '/project').then(mapProject),
		},
		keys: {
			get: () => request<Raw>('GET', '/keys').then(mapKeys),
		},
		instances: {
			list: () =>
				request<{ data: Raw[]; has_more: boolean; next_cursor: string | null }>(
					'GET',
					'/instances',
				).then((res) => ({
					data: res.data.map(mapInstance),
					hasMore: res.has_more,
					nextCursor: res.next_cursor ?? null,
				})) as Promise<CloudInstanceList>,
			get: (key: string) =>
				request<Raw>('GET', `/instances/${encodeURIComponent(key)}`).then(
					mapInstance,
				),
		},
		connections: {
			list: (filters?: {
				instance?: string;
				tenant?: string;
				integration?: string;
			}) =>
				request<Raw[]>(
					'GET',
					`/connections${queryString({
						instance: filters?.instance,
						tenant: filters?.tenant,
						integration: filters?.integration,
					})}`,
				).then((rows) => rows.map(mapConnection)),
		},
		grants: {
			list: (opts?: { tenant?: string }) =>
				request<Raw[]>(
					'GET',
					`/grants${queryString({ tenant: opts?.tenant })}`,
				).then((rows) => rows.map(mapGrant)),
			get: (id: string) =>
				request<Raw>('GET', `/grants/${encodeURIComponent(id)}`).then(mapGrant),
			mint: (input: MintGrantInput) => {
				const { idempotencyKey, ...body } = input;
				return request<Raw>(
					'POST',
					'/grants',
					body,
					idempotencyKey ? { 'idempotency-key': idempotencyKey } : undefined,
				).then(mapGrant);
			},
			update: (id: string, input: UpdateGrantInput) =>
				request<Raw>('PATCH', `/grants/${encodeURIComponent(id)}`, input).then(
					mapGrant,
				),
			revoke: (id: string) =>
				request<Raw>('DELETE', `/grants/${encodeURIComponent(id)}`).then(
					(raw): RevokeGrantResult => ({ id: raw.id, revoked: raw.revoked }),
				),
		},
	};
}

export type CloudV1Management = ReturnType<typeof buildCloudV1Management>;
