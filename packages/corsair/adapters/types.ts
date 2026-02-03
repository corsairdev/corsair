import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairIntegration,
} from '../db';

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

/**
 * Maps table names to their row types.
 */
export type CorsairTableRow = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
};

/**
 * Gets the row type for a specific table name.
 */
export type TableRowType<T extends CorsairTableName> =
	T extends keyof CorsairTableRow
		? CorsairTableRow[T]
		: Record<string, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Insert Data Types (without auto-generated fields)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input type for creating a new integration.
 */
export type CorsairIntegrationInsert = {
	id?: string;
	created_at?: Date;
	updated_at?: Date;
	name: string;
	config: Record<string, unknown>;
	dek?: string;
};

/**
 * Input type for creating a new account.
 */
export type CorsairAccountInsert = {
	id?: string;
	created_at?: Date;
	updated_at?: Date;
	tenant_id: string;
	integration_id: string;
	config: Record<string, unknown>;
	dek?: string;
};

/**
 * Input type for creating a new entity.
 */
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

/**
 * Input type for creating a new event.
 */
export type CorsairEventInsert = {
	id?: string;
	created_at?: Date;
	updated_at?: Date;
	account_id: string;
	event_type: string;
	payload: Record<string, unknown>;
	status?: 'pending' | 'processing' | 'completed' | 'failed';
};

/**
 * Maps table names to their insert types.
 */
export type CorsairTableInsert = {
	corsair_integrations: CorsairIntegrationInsert;
	corsair_accounts: CorsairAccountInsert;
	corsair_entities: CorsairEntityInsert;
	corsair_events: CorsairEventInsert;
};

/**
 * Gets the insert type for a specific table name.
 */
export type TableInsertType<T extends CorsairTableName> =
	T extends keyof CorsairTableInsert
		? CorsairTableInsert[T]
		: Record<string, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Update Data Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Input type for updating an integration.
 */
export type CorsairIntegrationUpdate = Partial<
	Omit<CorsairIntegration, 'id' | 'created_at'>
>;

/**
 * Input type for updating an account.
 */
export type CorsairAccountUpdate = Partial<
	Omit<CorsairAccount, 'id' | 'created_at'>
>;

/**
 * Input type for updating an entity.
 */
export type CorsairEntityUpdate = Partial<
	Omit<CorsairEntity, 'id' | 'created_at'>
>;

/**
 * Input type for updating an event.
 */
export type CorsairEventUpdate = Partial<
	Omit<CorsairEvent, 'id' | 'created_at'>
>;

/**
 * Maps table names to their update types.
 */
export type CorsairTableUpdate = {
	corsair_integrations: CorsairIntegrationUpdate;
	corsair_accounts: CorsairAccountUpdate;
	corsair_entities: CorsairEntityUpdate;
	corsair_events: CorsairEventUpdate;
};

/**
 * Gets the update type for a specific table name.
 */
export type TableUpdateType<T extends CorsairTableName> =
	T extends keyof CorsairTableUpdate
		? CorsairTableUpdate[T]
		: Record<string, unknown>;

// ─────────────────────────────────────────────────────────────────────────────
// Query Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairWhereOperator = '=' | 'in' | 'like';

export type CorsairWhere = {
	field: string;
	value: unknown;
	operator?: CorsairWhereOperator | undefined;
};

export type CorsairSortBy = {
	field: string;
	direction: 'asc' | 'desc';
};

// ─────────────────────────────────────────────────────────────────────────────
// Adapter Types
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairTransactionAdapter = Omit<CorsairDbAdapter, 'transaction'>;

export type CorsairDbAdapter = {
	/**
	 * Unique identifier for the adapter instance.
	 */
	id: string;

	findOne: <T extends CorsairTableName>(args: {
		table: T;
		where: CorsairWhere[];
		select?: string[] | undefined;
	}) => Promise<TableRowType<T> | null>;

	findMany: <T extends CorsairTableName>(args: {
		table: T;
		where?: CorsairWhere[] | undefined;
		limit?: number | undefined;
		offset?: number | undefined;
		sortBy?: CorsairSortBy | undefined;
		select?: string[] | undefined;
	}) => Promise<TableRowType<T>[]>;

	insert: <T extends CorsairTableName>(args: {
		table: T;
		data: TableInsertType<T>;
		select?: string[] | undefined;
	}) => Promise<TableRowType<T>>;

	/**
	 * Updates rows and returns one updated row when possible.
	 *
	 * Note: Some ORMs can't reliably return the updated row for non-unique filters,
	 * in which case adapters may do a follow-up `findOne`.
	 */
	update: <T extends CorsairTableName>(args: {
		table: T;
		where: CorsairWhere[];
		data: TableUpdateType<T>;
		select?: string[] | undefined;
	}) => Promise<TableRowType<T> | null>;

	deleteMany: (args: {
		table: CorsairTableName;
		where: CorsairWhere[];
	}) => Promise<number>;

	count: (args: {
		table: CorsairTableName;
		where?: CorsairWhere[] | undefined;
	}) => Promise<number>;

	transaction?: <R>(
		fn: (trx: CorsairTransactionAdapter) => Promise<R>,
	) => Promise<R>;
};
