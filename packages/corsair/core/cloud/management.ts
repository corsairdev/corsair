// Hub v1 REST management API — the control plane. A separate contract from the
// VM-local manage.ts (connect, connectionStatus, disconnect), which talks to a
// running instance instead. The transport's baseUrl already carries
// /v1/projects/<slug>, so every path here is relative to one project.
import { ManagementApiError } from '../management/errors';
import type { CloudTransport } from './http';
import { cloudRequest } from './http';

/** readonly < readwrite < admin. A union so an invalid tier is a compile
 *  error here rather than a 400 at runtime. */
export type CloudPermission = 'readonly' | 'readwrite' | 'admin';

export type CloudAuthType = 'managed' | 'oauth_2' | 'api_key' | 'bot_token';

export type CloudCredentialSource = 'app_owned' | 'user_owned';

export type CloudPage<T> = {
	data: T[];
	hasMore: boolean;
	nextCursor: string | null;
};

export type CloudListOptions = { limit?: number; startingAfter?: string };

export type CloudDeleted = { id: string; deleted: boolean };

export type CloudProject = {
	id: string;
	status: string;
	instanceCount: number;
	/** The plan's ceiling on managed-OAuth integrations and how many are in
	 *  use. `limit: null` is unlimited. */
	managedIntegrations: { limit: number | null; used: number };
	mcpOauthUrl: string;
	created: string;
	/** Capped previews, so one call can render a dashboard. `hasMore` means
	 *  "page the collection endpoint" — these carry no cursor of their own. */
	instances: CloudPage<CloudInstance>;
	tenants: CloudPage<CloudTenant>;
	access: CloudPage<CloudAccess>;
	connections: CloudPage<CloudConnection>;
	links: CloudPage<CloudLink>;
};

export type CloudKeys = { projectKey: string };

export type CloudInstance = {
	id: string;
	instanceKey: string;
	description: string | null;
	writable: boolean;
	credentialSource: CloudCredentialSource | null;
	quotaLimit: number | null;
	quotaWindow: string | null;
	/** Where calls for this instance execute. Null until it is deployed. */
	url: string | null;
};

// Create takes the key and the credential model only; description and
// writable are policy, set afterwards with update().
export type CreateInstanceInput = {
	instanceKey: string;
	credentialSource?: CloudCredentialSource;
	/** Passed through as the Idempotency-Key header when set. */
	idempotencyKey?: string;
};

export type UpdateInstanceInput = {
	description?: string | null;
	writable?: boolean;
	credentialSource?: CloudCredentialSource;
};

export type CloudIntegration = {
	id: string;
	instance: string;
	integration: string;
	authType: CloudAuthType;
	/** Whether credentials are on file. The values are write-only. */
	hasCredentials: boolean;
};

export type CloudCatalogIntegration = {
	id: string;
	name: string;
	authTypes: CloudAuthType[];
	/** A Corsair-owned OAuth app exists for it, not merely that the plugin
	 *  speaks OAuth. */
	managedAvailable: boolean;
};

export type SetIntegrationInput = {
	authType?: CloudAuthType;
	/** Write-only; reads back as `hasCredentials`. */
	credentials?: Record<string, string>;
};

export type CloudTenant = {
	id: string;
	email: string | null;
	label: string | null;
	created: string;
};

export type CreateTenantInput = {
	tenantId: string;
	email?: string;
	label?: string;
};

export type UpdateTenantInput = { email?: string; label?: string };

export type CloudConnection = {
	id: string;
	instance: string;
	tenant: string;
	integration: string;
	status: string;
};

export type CloudConnectionFilters = {
	instance?: string;
	tenant?: string;
	integration?: string;
};

export type CloudConnectSession = {
	url: string;
	expiresAt: string;
	instance: string;
	tenant: string;
	/** The integrations the session actually offers — the hub narrows a bad
	 *  request rather than failing it, so this is not always what was asked. */
	integrations: string[];
};

export type CreateConnectSessionInput = {
	instance: string;
	tenant: string;
	/** One link for these integrations rather than the whole bundle, so one
	 *  unconfigured plugin can't break the rest. */
	integrations?: string[];
	deliveryUrl?: string;
	/** Passed through as the Idempotency-Key header when set. */
	idempotencyKey?: string;
};

/** A membership of (instance, tenant) at a permission — the only thing that
 *  grants reach. A link names lines but can never create one. */
export type CloudAccess = {
	id: string;
	instance: string;
	tenant: string;
	label: string | null;
	permission: CloudPermission;
	connected: string[];
	expired: string[];
};

export type SetAccessInput = {
	permission: CloudPermission;
	/** Sets the tenant's own fields, creating it if absent — so one call can
	 *  register a user and grant them access. */
	email?: string;
	label?: string;
};

export type CloudLinkInstance = {
	instance: string;
	tenant: string;
	permission: CloudPermission;
	/** The access line behind this entry is gone, so it is dead at the door. */
	lostAccess: boolean;
};

export type CloudLink = {
	id: string;
	recipient: string | null;
	instances: CloudLinkInstance[];
	url: string;
	created: string;
};

export type MintLinkInput = {
	recipient?: string;
	instances: {
		instance: string;
		tenant: string;
		permission: CloudPermission;
	}[];
	/** Passed through as the Idempotency-Key header when set. */
	idempotencyKey?: string;
};

export type UpdateLinkInput = {
	recipient?: string | null;
	/** Absent leaves the lines alone, so renaming a link is just `recipient`. */
	instances?: {
		instance: string;
		tenant: string;
		permission: CloudPermission;
	}[];
};

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

function queryString(
	params: Record<string, string | number | undefined>,
): string {
	const entries = Object.entries(params).filter(
		([, v]) => v !== undefined && v !== '',
	);
	if (!entries.length) return '';
	return `?${entries
		.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
		.join('&')}`;
}

// Paging and filters share one query string, so a list that gained a filter
// can't quietly stop forwarding the cursor.
const listQuery = (
	opts?: CloudListOptions,
	filters: Record<string, string | undefined> = {},
) =>
	queryString({
		...filters,
		limit: opts?.limit,
		starting_after: opts?.startingAfter,
	});

// Raw snake_case wire payloads from the hub, parsed into the typed shapes above.
type Raw = any;

const seg = (value: string) => encodeURIComponent(value);

function mapProject(raw: Raw): CloudProject {
	return {
		id: raw.id,
		status: raw.status,
		instanceCount: raw.instance_count,
		managedIntegrations: {
			limit: raw.managed_integrations?.limit ?? null,
			used: raw.managed_integrations?.used ?? 0,
		},
		mcpOauthUrl: raw.mcp_oauth_url,
		created: raw.created,
		instances: embedded(raw.instances, mapInstance),
		tenants: embedded(raw.tenants, mapTenant),
		access: embedded(raw.access, mapAccess),
		connections: embedded(raw.connections, mapConnection),
		links: embedded(raw.links, mapLink),
	};
}

// An embedded list uses the same envelope as a collection endpoint, minus the
// cursor.
function embedded<T>(raw: Raw, map: (r: Raw) => T): CloudPage<T> {
	return {
		data: (raw?.data ?? []).map(map),
		hasMore: Boolean(raw?.has_more),
		nextCursor: null,
	};
}

function mapKeys(raw: Raw): CloudKeys {
	return { projectKey: raw.project_key };
}

function mapInstance(raw: Raw): CloudInstance {
	return {
		id: raw.id,
		instanceKey: raw.instance_key,
		description: raw.description ?? null,
		writable: raw.writable,
		credentialSource: raw.credential_source ?? null,
		quotaLimit: raw.quota_limit ?? null,
		quotaWindow: raw.quota_window ?? null,
		url: raw.url ?? null,
	};
}

function mapIntegration(raw: Raw): CloudIntegration {
	return {
		id: raw.id,
		instance: raw.instance,
		integration: raw.integration,
		authType: raw.auth_type,
		hasCredentials: raw.has_credentials,
	};
}

function mapCatalogIntegration(raw: Raw): CloudCatalogIntegration {
	return {
		id: raw.id,
		name: raw.name,
		authTypes: raw.auth_types ?? [],
		managedAvailable: raw.managed_available,
	};
}

function mapTenant(raw: Raw): CloudTenant {
	return {
		id: raw.id,
		email: raw.email ?? null,
		label: raw.label ?? null,
		created: raw.created,
	};
}

function mapConnection(raw: Raw): CloudConnection {
	return {
		id: raw.id,
		instance: raw.instance,
		tenant: raw.tenant,
		integration: raw.integration,
		status: raw.status,
	};
}

function mapConnectSession(raw: Raw): CloudConnectSession {
	return {
		url: raw.url,
		expiresAt: raw.expires_at,
		instance: raw.instance,
		tenant: raw.tenant,
		integrations: raw.integrations ?? [],
	};
}

function mapAccess(raw: Raw): CloudAccess {
	return {
		id: raw.id,
		instance: raw.instance,
		tenant: raw.tenant,
		label: raw.label ?? null,
		permission: raw.permission,
		connected: raw.connected ?? [],
		expired: raw.expired ?? [],
	};
}

function mapLink(raw: Raw): CloudLink {
	return {
		id: raw.id,
		recipient: raw.recipient ?? null,
		instances: (raw.instances ?? []).map((i: Raw) => ({
			instance: i.instance,
			tenant: i.tenant,
			permission: i.permission,
			lostAccess: Boolean(i.lost_access),
		})),
		url: raw.url,
		created: raw.created,
	};
}

const mapDeleted = (raw: Raw): CloudDeleted => ({
	id: raw.id,
	deleted: Boolean(raw.deleted),
});

function mapLinkInstances(
	instances: {
		instance: string;
		tenant: string;
		permission: CloudPermission;
	}[],
) {
	return instances.map((i) => ({
		instance: i.instance,
		tenant: i.tenant,
		permission: i.permission,
	}));
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

	const idempotent = (key?: string) =>
		key ? { 'idempotency-key': key } : undefined;

	// Every list shares one envelope, so paging is mapped once rather than per
	// resource.
	const page = <T>(path: string, map: (raw: Raw) => T): Promise<CloudPage<T>> =>
		request<{ data: Raw[]; has_more: boolean; next_cursor: string | null }>(
			'GET',
			path,
		).then((res) => ({
			data: (res.data ?? []).map(map),
			hasMore: Boolean(res.has_more),
			nextCursor: res.next_cursor ?? null,
		}));

	return {
		project: {
			get: () => request<Raw>('GET', '/project').then(mapProject),
		},

		keys: {
			get: () => request<Raw>('GET', '/keys').then(mapKeys),
		},

		instances: {
			list: (opts?: CloudListOptions) =>
				page(`/instances${listQuery(opts)}`, mapInstance),
			get: (key: string) =>
				request<Raw>('GET', `/instances/${seg(key)}`).then(mapInstance),
			/** Idempotent by key: the same key twice returns the existing instance
			 *  rather than erroring, so a retry is safe even without a header. */
			create: ({
				instanceKey,
				credentialSource,
				idempotencyKey,
			}: CreateInstanceInput) =>
				request<Raw>(
					'POST',
					'/instances',
					{
						instance_key: instanceKey,
						...(credentialSource
							? { credential_source: credentialSource }
							: {}),
					},
					idempotent(idempotencyKey),
				).then(mapInstance),
			update: (key: string, input: UpdateInstanceInput) =>
				request<Raw>('PATCH', `/instances/${seg(key)}`, {
					...(input.description !== undefined
						? { description: input.description }
						: {}),
					...(input.writable !== undefined ? { writable: input.writable } : {}),
					...(input.credentialSource !== undefined
						? { credential_source: input.credentialSource }
						: {}),
				}).then(mapInstance),
			delete: (key: string) =>
				request<Raw>('DELETE', `/instances/${seg(key)}`).then(mapDeleted),
		},

		integrations: {
			list: (opts?: CloudListOptions & { instance?: string }) =>
				page(
					`/integrations${listQuery(opts, { instance: opts?.instance })}`,
					mapIntegration,
				),
			/** Every plugin Corsair ships, with the auth types it supports. */
			catalog: (opts?: CloudListOptions) =>
				page(`/integrations/catalog${listQuery(opts)}`, mapCatalogIntegration),
			get: (ref: string) =>
				request<Raw>('GET', `/integrations/${seg(ref)}`).then(mapIntegration),
			/** `ref` is `instance:integration`. */
			set: (ref: string, input: SetIntegrationInput) =>
				request<Raw>('PUT', `/integrations/${seg(ref)}`, {
					...(input.authType ? { auth_type: input.authType } : {}),
					...(input.credentials ? { credentials: input.credentials } : {}),
				}).then(mapIntegration),
			delete: (ref: string) =>
				request<Raw>('DELETE', `/integrations/${seg(ref)}`).then(mapDeleted),
		},

		tenants: {
			list: (opts?: CloudListOptions) =>
				page(`/tenants${listQuery(opts)}`, mapTenant),
			get: (id: string) =>
				request<Raw>('GET', `/tenants/${seg(id)}`).then(mapTenant),
			/** A tenant id that already exists is a 409, so this is not a
			 *  call-on-every-login primitive — access.set() is (it upserts). */
			create: (input: CreateTenantInput) =>
				request<Raw>('POST', '/tenants', {
					tenant_id: input.tenantId,
					...(input.email ? { email: input.email } : {}),
					...(input.label ? { label: input.label } : {}),
				}).then(mapTenant),
			update: (id: string, input: UpdateTenantInput) =>
				request<Raw>('PATCH', `/tenants/${seg(id)}`, {
					...(input.email !== undefined ? { email: input.email } : {}),
					...(input.label !== undefined ? { label: input.label } : {}),
				}).then(mapTenant),
			delete: (id: string) =>
				request<Raw>('DELETE', `/tenants/${seg(id)}`).then(mapDeleted),
		},

		connections: {
			list: (opts?: CloudListOptions & CloudConnectionFilters) =>
				page(
					`/connections${listQuery(opts, {
						instance: opts?.instance,
						tenant: opts?.tenant,
						integration: opts?.integration,
					})}`,
					mapConnection,
				),
			/** `ref` is `instance:integration:tenant`. */
			get: (ref: string) =>
				request<Raw>('GET', `/connections/${seg(ref)}`).then(mapConnection),
			/** Drops the stored credential. The tenant reconnects through a new
			 *  connect session. */
			delete: (ref: string) =>
				request<Raw>('DELETE', `/connections/${seg(ref)}`).then(mapDeleted),
		},

		connect: {
			/** A hosted OAuth URL for one tenant. Redirect them to it; it expires. */
			sessions: {
				create: (input: CreateConnectSessionInput) => {
					const { idempotencyKey, deliveryUrl, ...rest } = input;
					return request<Raw>(
						'POST',
						'/connect/sessions',
						{
							...rest,
							...(deliveryUrl ? { delivery_url: deliveryUrl } : {}),
						},
						idempotent(idempotencyKey),
					).then(mapConnectSession);
				},
			},
		},

		access: {
			list: (
				opts?: CloudListOptions & { instance?: string; tenant?: string },
			) =>
				page(
					`/access${listQuery(opts, { instance: opts?.instance, tenant: opts?.tenant })}`,
					mapAccess,
				),
			/** `ref` is `instance:tenant`. */
			get: (ref: string) =>
				request<Raw>('GET', `/access/${seg(ref)}`).then(mapAccess),
			set: (ref: string, input: SetAccessInput) =>
				request<Raw>('PUT', `/access/${seg(ref)}`, input).then(mapAccess),
			delete: (ref: string) =>
				request<Raw>('DELETE', `/access/${seg(ref)}`).then(mapDeleted),
		},

		mcp: {
			links: {
				list: (opts?: CloudListOptions & { tenant?: string }) =>
					page(
						`/mcp/links${listQuery(opts, { tenant: opts?.tenant })}`,
						mapLink,
					),
				get: (id: string) =>
					request<Raw>('GET', `/mcp/links/${seg(id)}`).then(mapLink),
				/** Every (instance, tenant) named must already hold an access line.
				 *  Minting one that doesn't 400s rather than returning a dead URL. */
				mint: (input: MintLinkInput) => {
					const { idempotencyKey, recipient, instances } = input;
					return request<Raw>(
						'POST',
						'/mcp/links',
						{
							...(recipient ? { recipient } : {}),
							instances: mapLinkInstances(instances),
						},
						idempotent(idempotencyKey),
					).then(mapLink);
				},
				update: (id: string, input: UpdateLinkInput) =>
					request<Raw>('PATCH', `/mcp/links/${seg(id)}`, {
						...(input.recipient !== undefined
							? { recipient: input.recipient }
							: {}),
						...(input.instances
							? { instances: mapLinkInstances(input.instances) }
							: {}),
					}).then(mapLink),
				/** New URL, same access. What to do with a leaked link. */
				rotate: (id: string, opts?: { idempotencyKey?: string }) =>
					request<Raw>(
						'POST',
						`/mcp/links/${seg(id)}/rotate`,
						undefined,
						idempotent(opts?.idempotencyKey),
					).then(mapLink),
				revoke: (id: string) =>
					request<Raw>('DELETE', `/mcp/links/${seg(id)}`).then(mapDeleted),
			},
		},
	};
}
