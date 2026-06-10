import type {
	ConnectionStatus,
	CreateTenantInput,
	ManagementOk,
	PermissionRecord,
	PluginInfo,
	Tenant,
} from '../core/management/types';

// ─────────────────────────────────────────────────────────────────────────────
// Client types for the management control plane.
// Phase 1a ships a static client shape. Plugin-extensible inference lands in
// Phase 2 once routes vary per plugin.
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairClientOptions = {
	/** Origin + base path of the mounted handler, e.g. 'https://api.example.com/api/corsair'. */
	baseURL: string;
	/** Optional fetch override. Defaults to globalThis.fetch. */
	fetch?: typeof fetch;
};

export type CorsairManagementClient = {
	ok: () => Promise<ManagementOk>;
	tenants: {
		list: () => Promise<Tenant[]>;
		create: (input: CreateTenantInput) => Promise<Tenant>;
		get: (id: string) => Promise<Tenant>;
	};
	plugins: {
		list: () => Promise<PluginInfo[]>;
		get: (id: string) => Promise<PluginInfo>;
	};
	connectionStatus: {
		get: (query?: { tenantId?: string }) => Promise<ConnectionStatus>;
	};
	permissions: {
		get: (id: string) => Promise<PermissionRecord>;
		getByToken: (token: string) => Promise<PermissionRecord>;
	};
};

export class CorsairClientError extends Error {
	readonly status: number;
	readonly code: string;
	readonly extra: Record<string, unknown>;

	constructor(
		status: number,
		code: string,
		message: string,
		extra: Record<string, unknown> = {},
	) {
		super(message);
		this.name = 'CorsairClientError';
		this.status = status;
		this.code = code;
		this.extra = extra;
	}
}
