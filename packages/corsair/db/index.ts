import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Integrations
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairIntegrationsSchema = z.object({
	id: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),

	name: z.string(),
	// Coerce DB null to empty object
	config: z
		.record(z.string(), z.unknown())
		.nullable()
		.transform((v) => v ?? {}),
	dek: z.string().nullish(),
});

export type CorsairIntegration = z.infer<typeof CorsairIntegrationsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Accounts
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairAccountsSchema = z.object({
	id: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),

	tenant_id: z.string(),
	// references integrations.id
	integration_id: z.string(),

	// Coerce DB null to empty object
	config: z
		.record(z.string(), z.unknown())
		.nullable()
		.transform((v) => v ?? {}),
	dek: z.string().nullish(),
});

export type CorsairAccount = z.infer<typeof CorsairAccountsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Entities
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairEntitiesSchema = z.object({
	id: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),

	// references accounts.id (which provides tenant scoping)
	account_id: z.string(),

	entity_id: z.string(),
	entity_type: z.string(),

	version: z.string(),

	// Coerce DB null to empty object
	data: z
		.record(z.string(), z.unknown())
		.nullable()
		.transform((v) => v ?? {}),
});

export type CorsairEntity = z.infer<typeof CorsairEntitiesSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Events
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairEventsSchema = z.object({
	id: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),

	// references accounts.id (which provides tenant scoping)
	account_id: z.string(),
	event_type: z.string(),

	// Coerce DB null to empty object
	payload: z
		.record(z.string(), z.unknown())
		.nullable()
		.transform((v) => v ?? {}),

	status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
});

export type CorsairEvent = z.infer<typeof CorsairEventsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Permissions (approval queue)
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairPermissionsSchema = z.object({
	id: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),

	/** 32-byte hex-encoded secure random token, single-use. Embedded in the review URL. */
	token: z.string(),
	/** Plugin identifier, e.g. 'github' */
	plugin: z.string(),
	/** Dot-notation endpoint path, e.g. 'repositories.delete' */
	endpoint: z.string(),
	/** JSON-encoded args that will be forwarded to the endpoint upon approval */
	args: z.string(),
	/**
	 * Tenant ID for multi-tenant corsair instances. Stored so executePermission
	 * can scope the corsair instance correctly when executing the approved action.
	 * Defaults to 'default' for single-tenant instances.
	 */
	tenant_id: z.string(),
	/** Current state of the approval request */
	status: z
		.enum([
			'pending',
			'approved',
			'executing',
			'completed',
			'denied',
			'expired',
			'failed',
		])
		.default('pending'),
	/** ISO8601 timestamp — when this request becomes invalid */
	expires_at: z.string(),
	/** Stringified error captured when status transitions to 'failed'. Null otherwise. */
	error: z.string().nullable().optional(),
});

export type CorsairPermission = z.infer<typeof CorsairPermissionsSchema>;

export type CorsairPermissionInsert = {
	id?: string;
	created_at?: Date;
	updated_at?: Date;
	token: string;
	plugin: string;
	endpoint: string;
	args: string;
	tenant_id?: string;
	status?:
		| 'pending'
		| 'approved'
		| 'executing'
		| 'completed'
		| 'denied'
		| 'expired'
		| 'failed';
	expires_at: string;
	error?: string | null;
};

// A short-lived record that a tenant hit a wall and must connect a plugin —
// written when a tool call raises auth-missing, read on-demand by the client to
// drive the connect dialog. One row per tenant (latest wins).
export type CorsairConnectRequest = {
	tenant_id: string;
	plugin: string;
	connect_url: string;
	/** ISO8601 timestamp the request was recorded; the store enforces the TTL on read. */
	requested_at: string;
};

export type CorsairConnectRequestInsert = {
	tenant_id: string;
	plugin: string;
	connect_url: string;
	requested_at: string;
};

// Registered in setup's REQUIRED_TABLES so a deploy missing this table gets a
// clear "run your migrations" warning instead of a 500 on the first connect.
export const CorsairConnectRequestsSchema = z.object({
	tenant_id: z.string(),
	plugin: z.string(),
	connect_url: z.string(),
	requested_at: z.string(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Table Names
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairTableName =
	| 'corsair_integrations'
	| 'corsair_accounts'
	| 'corsair_entities'
	| 'corsair_events'
	| 'corsair_permissions'
	| 'corsair_connect_requests'
	| (string & {});

// ─────────────────────────────────────────────────────────────────────────────
// Table Row Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairTableRow = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
	corsair_connect_requests: CorsairConnectRequest;
};

export type TableRowType<T extends CorsairTableName> =
	T extends keyof CorsairTableRow
		? CorsairTableRow[T]
		: Record<string, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Insert Data Types (without auto-generated fields)
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairIntegrationInsert = {
	id?: string;
	created_at?: Date;
	updated_at?: Date;
	name: string;
	config: Record<string, unknown>;
	dek?: string;
};

export type CorsairAccountInsert = {
	id?: string;
	created_at?: Date;
	updated_at?: Date;
	tenant_id: string;
	integration_id: string;
	config: Record<string, unknown>;
	dek?: string;
};

export type CorsairEntityInsert = {
	id?: string;
	created_at?: Date;
	updated_at?: Date;
	account_id: string;
	entity_id: string;
	entity_type: string;
	version: string;
	data: Record<string, unknown>;
};

export type CorsairEventInsert = {
	id?: string;
	created_at?: Date;
	updated_at?: Date;
	account_id: string;
	event_type: string;
	payload: Record<string, unknown>;
	status?: 'pending' | 'processing' | 'completed' | 'failed';
};

export type CorsairTableInsert = {
	corsair_integrations: CorsairIntegrationInsert;
	corsair_accounts: CorsairAccountInsert;
	corsair_entities: CorsairEntityInsert;
	corsair_events: CorsairEventInsert;
	corsair_connect_requests: CorsairConnectRequestInsert;
};

export type TableInsertType<T extends CorsairTableName> =
	T extends keyof CorsairTableInsert
		? CorsairTableInsert[T]
		: Record<string, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Update Data Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairIntegrationUpdate = Partial<
	Omit<CorsairIntegration, 'id' | 'created_at'>
>;

export type CorsairAccountUpdate = Partial<
	Omit<CorsairAccount, 'id' | 'created_at'>
>;

export type CorsairEntityUpdate = Partial<
	Omit<CorsairEntity, 'id' | 'created_at'>
>;

export type CorsairEventUpdate = Partial<
	Omit<CorsairEvent, 'id' | 'created_at'>
>;

export type CorsairTableUpdate = {
	corsair_integrations: CorsairIntegrationUpdate;
	corsair_accounts: CorsairAccountUpdate;
	corsair_entities: CorsairEntityUpdate;
	corsair_events: CorsairEventUpdate;
};

export type TableUpdateType<T extends CorsairTableName> =
	T extends keyof CorsairTableUpdate
		? CorsairTableUpdate[T]
		: Record<string, unknown>;
