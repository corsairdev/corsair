import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Integrations
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairIntegrationsSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	name: z.string(),
	// Coerce DB null to empty object
	config: z
		.record(z.unknown())
		.nullable()
		.transform((v) => v ?? {}),
	dek: z.string().optional(),
});

export type CorsairIntegration = z.infer<typeof CorsairIntegrationsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Accounts
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairAccountsSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	tenant_id: z.string(),
	// references integrations.id
	integration_id: z.string(),

	// Coerce DB null to empty object
	config: z
		.record(z.unknown())
		.nullable()
		.transform((v) => v ?? {}),
	dek: z.string().optional(),
});

export type CorsairAccount = z.infer<typeof CorsairAccountsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Entities
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairEntitiesSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	// references accounts.id (which provides tenant scoping)
	account_id: z.string(),

	entity_id: z.string(),
	entity_type: z.string(),

	version: z.string(),

	// Coerce DB null to empty object
	data: z
		.record(z.unknown())
		.nullable()
		.transform((v) => v ?? {}),
});

export type CorsairEntity = z.infer<typeof CorsairEntitiesSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Events
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairEventsSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	// references accounts.id (which provides tenant scoping)
	account_id: z.string(),
	event_type: z.string(),

	// Coerce DB null to empty object
	payload: z
		.record(z.unknown())
		.nullable()
		.transform((v) => v ?? {}),

	status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
});

export type CorsairEvent = z.infer<typeof CorsairEventsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Table Names
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairTableName =
	| 'corsair_integrations'
	| 'corsair_accounts'
	| 'corsair_entities'
	| 'corsair_events'
	| (string & {});

// ─────────────────────────────────────────────────────────────────────────────
// Table Row Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairTableRow = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
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
