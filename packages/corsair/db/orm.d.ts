import type { ZodTypeAny, z } from 'zod';
import type { CorsairAccount, CorsairEntity, CorsairEvent, CorsairIntegration } from './';
import type { CorsairDatabase } from './kysely/database';
export type CorsairOrmDatabase = {
    corsair_integrations: CorsairIntegration;
    corsair_accounts: CorsairAccount;
    corsair_entities: CorsairEntity;
    corsair_events: CorsairEvent;
};
export type CorsairOrmTableName = keyof CorsairOrmDatabase;
export type CorsairWhereOperator = '=' | 'in' | 'like';
export type CorsairWhere<TField extends string = string> = {
    field: TField;
    value: unknown;
    operator?: CorsairWhereOperator | undefined;
};
export declare const TABLE_SCHEMAS: {
    readonly corsair_integrations: z.ZodObject<{
        id: z.ZodString;
        created_at: z.ZodDate;
        updated_at: z.ZodDate;
        name: z.ZodString;
        config: z.ZodEffects<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | null>;
        dek: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", ZodTypeAny, {
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        config: Record<string, unknown>;
        dek?: string | null | undefined;
    }, {
        id: string;
        created_at: Date;
        updated_at: Date;
        name: string;
        config: Record<string, unknown> | null;
        dek?: string | null | undefined;
    }>;
    readonly corsair_accounts: z.ZodObject<{
        id: z.ZodString;
        created_at: z.ZodDate;
        updated_at: z.ZodDate;
        tenant_id: z.ZodString;
        integration_id: z.ZodString;
        config: z.ZodEffects<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | null>;
        dek: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", ZodTypeAny, {
        id: string;
        created_at: Date;
        updated_at: Date;
        config: Record<string, unknown>;
        tenant_id: string;
        integration_id: string;
        dek?: string | null | undefined;
    }, {
        id: string;
        created_at: Date;
        updated_at: Date;
        config: Record<string, unknown> | null;
        tenant_id: string;
        integration_id: string;
        dek?: string | null | undefined;
    }>;
    readonly corsair_entities: z.ZodObject<{
        id: z.ZodString;
        created_at: z.ZodDate;
        updated_at: z.ZodDate;
        account_id: z.ZodString;
        entity_id: z.ZodString;
        entity_type: z.ZodString;
        version: z.ZodString;
        data: z.ZodEffects<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | null>;
    }, "strip", ZodTypeAny, {
        id: string;
        created_at: Date;
        updated_at: Date;
        account_id: string;
        entity_id: string;
        entity_type: string;
        version: string;
        data: Record<string, unknown>;
    }, {
        id: string;
        created_at: Date;
        updated_at: Date;
        account_id: string;
        entity_id: string;
        entity_type: string;
        version: string;
        data: Record<string, unknown> | null;
    }>;
    readonly corsair_events: z.ZodObject<{
        id: z.ZodString;
        created_at: z.ZodDate;
        updated_at: z.ZodDate;
        account_id: z.ZodString;
        event_type: z.ZodString;
        payload: z.ZodEffects<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | null>;
        status: z.ZodOptional<z.ZodEnum<["pending", "processing", "completed", "failed"]>>;
    }, "strip", ZodTypeAny, {
        id: string;
        created_at: Date;
        updated_at: Date;
        account_id: string;
        event_type: string;
        payload: Record<string, unknown>;
        status?: "pending" | "processing" | "completed" | "failed" | undefined;
    }, {
        id: string;
        created_at: Date;
        updated_at: Date;
        account_id: string;
        event_type: string;
        payload: Record<string, unknown> | null;
        status?: "pending" | "processing" | "completed" | "failed" | undefined;
    }>;
};
/**
 * Input type for creating a new row (without auto-generated fields).
 */
type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
};
/**
 * Input type for updating an existing row.
 */
type UpdateInput<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>;
/**
 * Where clause builder for type-safe filtering.
 */
type WhereClause<T> = {
    [K in keyof T]?: T[K] | {
        in: T[K][];
    } | {
        like: string;
    };
};
/**
 * Base table ORM client with common CRUD operations.
 */
export type CorsairTableClient<T> = {
    findById: (id: string) => Promise<T | null>;
    findOne: (where: WhereClause<T>) => Promise<T | null>;
    findMany: (options?: {
        where?: WhereClause<T>;
        limit?: number;
        offset?: number;
    }) => Promise<T[]>;
    create: (data: CreateInput<T>) => Promise<T>;
    update: (id: string, data: UpdateInput<T>) => Promise<T | null>;
    updateMany: (where: WhereClause<T>, data: UpdateInput<T>) => Promise<number>;
    delete: (id: string) => Promise<boolean>;
    deleteMany: (where: WhereClause<T>) => Promise<number>;
    count: (where?: WhereClause<T>) => Promise<number>;
};
export type CorsairIntegrationsClient = CorsairTableClient<CorsairIntegration> & {
    findByName: (name: string) => Promise<CorsairIntegration | null>;
    upsertByName: (name: string, data: Omit<CreateInput<CorsairIntegration>, 'name'>) => Promise<CorsairIntegration>;
};
export type CorsairAccountsClient = CorsairTableClient<CorsairAccount> & {
    findByTenantAndIntegration: (tenantId: string, integrationName: string) => Promise<CorsairAccount | null>;
    listByTenant: (tenantId: string, options?: {
        limit?: number;
        offset?: number;
    }) => Promise<CorsairAccount[]>;
    upsertByTenantAndIntegration: (tenantId: string, integrationId: string, data: Omit<CreateInput<CorsairAccount>, 'tenant_id' | 'integration_id'>) => Promise<CorsairAccount>;
};
export type CorsairEntitiesClient = CorsairTableClient<CorsairEntity> & {
    findByEntityId: (options: {
        accountId: string;
        entityType: string;
        entityId: string;
    }) => Promise<CorsairEntity | null>;
    findManyByEntityIds: (options: {
        accountId: string;
        entityType: string;
        entityIds: string[];
    }) => Promise<CorsairEntity[]>;
    listByScope: (options: {
        accountId: string;
        entityType: string;
        limit?: number;
        offset?: number;
    }) => Promise<CorsairEntity[]>;
    searchByEntityId: (options: {
        accountId: string;
        entityType: string;
        query: string;
        limit?: number;
        offset?: number;
    }) => Promise<CorsairEntity[]>;
    upsertByEntityId: (options: {
        accountId: string;
        entityType: string;
        entityId: string;
        version: string;
        data: Record<string, unknown>;
    }) => Promise<CorsairEntity>;
    deleteByEntityId: (options: {
        accountId: string;
        entityType: string;
        entityId: string;
    }) => Promise<boolean>;
};
export type CorsairEventsClient = CorsairTableClient<CorsairEvent> & {
    listByAccount: (accountId: string, options?: {
        limit?: number;
        offset?: number;
    }) => Promise<CorsairEvent[]>;
    listByStatus: (status: 'pending' | 'processing' | 'completed' | 'failed', options?: {
        accountId?: string;
        limit?: number;
        offset?: number;
    }) => Promise<CorsairEvent[]>;
    listPending: (options?: {
        accountId?: string;
        limit?: number;
    }) => Promise<CorsairEvent[]>;
    updateStatus: (id: string, status: 'pending' | 'processing' | 'completed' | 'failed') => Promise<CorsairEvent | null>;
};
export type CorsairOrm = {
    integrations: CorsairIntegrationsClient;
    accounts: CorsairAccountsClient;
    entities: CorsairEntitiesClient;
    events: CorsairEventsClient;
};
/**
 * Creates the base Corsair ORM with all table clients.
 */
export declare function createCorsairOrm(database: CorsairDatabase | undefined): CorsairOrm;
/**
 * Plugin schema definition - maps entity type names to their Zod data schemas.
 */
export type CorsairPluginSchema<Entities extends Record<string, ZodTypeAny>> = {
    version: string;
    entities: Entities;
};
/**
 * Typed entity with plugin-specific data type.
 */
export type TypedEntity<DataSchema extends ZodTypeAny> = Omit<CorsairEntity, 'data'> & {
    data: z.infer<DataSchema>;
};
/**
 * Filter value for entity table columns (e.g., entity_id, version).
 * Supports exact matches, string operations (for string fields), and array membership.
 *
 * @example
 * // Exact match (shorthand)
 * { entity_id: "C0123456789" }
 *
 * @example
 * // Explicit equals
 * { entity_id: { equals: "C0123456789" } }
 *
 * @example
 * // String contains (LIKE '%value%')
 * { entity_id: { contains: "C012" } }
 *
 * @example
 * // String starts with (LIKE 'value%')
 * { entity_id: { startsWith: "C012" } }
 *
 * @example
 * // String ends with (LIKE '%value')
 * { entity_id: { endsWith: "6789" } }
 *
 * @example
 * // Match any value in array (IN clause)
 * { entity_id: { in: ["C0123456789", "C9876543210"] } }
 */
export type SearchFilterValue<T> = T | {
    /** Exact match. Equivalent to passing the value directly. */
    equals?: T;
    /** String contains (LIKE '%value%'). Only available for string fields. */
    contains?: T extends string ? string : never;
    /** String starts with (LIKE 'value%'). Only available for string fields. */
    startsWith?: T extends string ? string : never;
    /** String ends with (LIKE '%value'). Only available for string fields. */
    endsWith?: T extends string ? string : never;
    /** Match any value in array (IN clause). */
    in?: T[];
};
/**
 * Filter for string fields in JSONB data.
 * Supports exact matches, substring search, prefix/suffix matching, and array membership.
 *
 * @example
 * // Exact match (shorthand)
 * { data: { name: "general" } }
 *
 * @example
 * // Explicit equals
 * { data: { name: { equals: "general" } } }
 *
 * @example
 * // Contains substring (LIKE '%value%')
 * { data: { name: { contains: "gen" } } }
 *
 * @example
 * // Starts with prefix (LIKE 'value%')
 * { data: { name: { startsWith: "gen" } } }
 *
 * @example
 * // Ends with suffix (LIKE '%value')
 * { data: { name: { endsWith: "eral" } } }
 *
 * @example
 * // Match any value in array (IN clause)
 * { data: { name: { in: ["general", "random", "announcements"] } } }
 */
export type StringDataFilter = string | {
    /** Exact match. Equivalent to passing the string directly. */
    equals?: string;
    /** Contains substring (LIKE '%value%'). Case-sensitive. */
    contains?: string;
    /** Starts with prefix (LIKE 'value%'). Case-sensitive. */
    startsWith?: string;
    /** Ends with suffix (LIKE '%value'). Case-sensitive. */
    endsWith?: string;
    /** Match any value in array (IN clause). */
    in?: string[];
};
/**
 * Filter for number fields in JSONB data.
 * Supports exact matches, range comparisons, and array membership.
 *
 * @example
 * // Exact match (shorthand)
 * { data: { count: 42 } }
 *
 * @example
 * // Explicit equals
 * { data: { count: { equals: 42 } } }
 *
 * @example
 * // Greater than
 * { data: { count: { gt: 10 } } }
 *
 * @example
 * // Greater than or equal
 * { data: { count: { gte: 10 } } }
 *
 * @example
 * // Less than
 * { data: { count: { lt: 100 } } }
 *
 * @example
 * // Less than or equal
 * { data: { count: { lte: 100 } } }
 *
 * @example
 * // Match any value in array (IN clause)
 * { data: { count: { in: [10, 20, 30] } } }
 */
export type NumberDataFilter = number | {
    /** Exact match. Equivalent to passing the number directly. */
    equals?: number;
    /** Greater than (>). */
    gt?: number;
    /** Greater than or equal (>=). */
    gte?: number;
    /** Less than (<). */
    lt?: number;
    /** Less than or equal (<=). */
    lte?: number;
    /** Match any value in array (IN clause). */
    in?: number[];
};
/**
 * Filter for boolean fields in JSONB data.
 * Supports exact matches only.
 *
 * @example
 * // Exact match (shorthand)
 * { data: { is_private: true } }
 *
 * @example
 * // Explicit equals
 * { data: { is_private: { equals: false } } }
 */
export type BooleanDataFilter = boolean | {
    /** Exact match. Equivalent to passing the boolean directly. */
    equals?: boolean;
};
/**
 * Filter for date fields in JSONB data.
 * Supports exact matches, before/after comparisons, and date ranges.
 *
 * @example
 * // Exact match (shorthand)
 * { data: { created_at: new Date("2024-01-01") } }
 *
 * @example
 * // Explicit equals
 * { data: { created_at: { equals: new Date("2024-01-01") } } }
 *
 * @example
 * // Before date (<)
 * { data: { created_at: { before: new Date("2024-12-31") } } }
 *
 * @example
 * // After date (>)
 * { data: { created_at: { after: new Date("2024-01-01") } } }
 *
 * @example
 * // Between two dates (inclusive)
 * { data: { created_at: { between: [new Date("2024-01-01"), new Date("2024-12-31")] } } }
 */
export type DateDataFilter = Date | {
    /** Exact match. Equivalent to passing the Date directly. */
    equals?: Date;
    /** Before date (<). */
    before?: Date;
    /** After date (>). */
    after?: Date;
    /** Between two dates (inclusive). First element is start, second is end. */
    between?: [Date, Date];
};
/**
 * Filter value for JSONB data fields, automatically selected based on field type.
 * Supports different filter operations depending on the data type:
 * - String: exact match, contains, startsWith, endsWith, in
 * - Number: exact match, gt, gte, lt, lte, in
 * - Boolean: exact match only
 * - Date: exact match, before, after, between
 *
 * @example
 * // String field
 * { data: { name: { contains: "test" } } }
 *
 * @example
 * // Number field
 * { data: { count: { gt: 10 } } }
 *
 * @example
 * // Boolean field
 * { data: { is_private: true } }
 *
 * @example
 * // Date field
 * { data: { created_at: { after: new Date("2024-01-01") } } }
 */
export type DataFilterValue<T> = T extends Date ? DateDataFilter : T extends number ? NumberDataFilter : T extends boolean ? BooleanDataFilter : T extends string ? StringDataFilter : never;
/**
 * Fields that are automatically filtered by the ORM (not user-searchable).
 */
type AutoFilteredFields = 'account_id' | 'entity_type';
/**
 * Fields that require special handling (pagination, data).
 */
type SpecialFields = 'data' | 'created_at' | 'updated_at';
/**
 * Searchable entity fields derived from CorsairEntity.
 * Excludes auto-filtered fields and special fields.
 */
type SearchableEntityFields = Omit<CorsairEntity, AutoFilteredFields | SpecialFields>;
/**
 * Search filter for entity table columns (derived from CorsairEntity).
 * Maps each searchable field to SearchFilterValue.
 */
type EntityFieldsFilter = {
    [K in keyof SearchableEntityFields]?: SearchFilterValue<SearchableEntityFields[K]>;
};
/**
 * Search filter for JSONB data fields.
 * Only supports top-level fields. Nested objects (like topic, purpose) are excluded.
 * Each field uses the appropriate filter type based on its data type.
 *
 * @example
 * // Filter by multiple data fields
 * {
 *   data: {
 *     name: { contains: "general" },
 *     is_private: false,
 *     member_count: { gte: 10 }
 *   }
 * }
 *
 * @example
 * // String field with contains
 * {
 *   data: {
 *     name: { contains: "test" }
 *   }
 * }
 *
 * @example
 * // Number field with range
 * {
 *   data: {
 *     count: { gt: 5, lt: 100 }
 *   }
 * }
 *
 * @example
 * // Date field with range
 * {
 *   data: {
 *     created_at: { between: [new Date("2024-01-01"), new Date("2024-12-31")] }
 *   }
 * }
 */
export type DataSearchFilter<DataSchema extends ZodTypeAny> = {
    [K in keyof z.infer<DataSchema>]?: z.infer<DataSchema>[K] extends string | number | boolean | Date | null | undefined ? DataFilterValue<NonNullable<z.infer<DataSchema>[K]>> : never;
};
/**
 * Search options for querying entities.
 * Supports filtering by entity table columns (entity_id, version, etc.) and JSONB data fields.
 * All filters are combined with AND logic.
 *
 * @example
 * // Search by entity_id (exact match)
 * await tenant.slack.db.channels.search({
 *   entity_id: "C0123456789"
 * });
 *
 * @example
 * // Search by entity_id with contains
 * await tenant.slack.db.channels.search({
 *   entity_id: { contains: "C012" }
 * });
 *
 * @example
 * // Search by JSONB data field (exact match)
 * await tenant.slack.db.channels.search({
 *   data: { name: "general" }
 * });
 *
 * @example
 * // Search by JSONB data field with contains
 * await tenant.slack.db.channels.search({
 *   data: { name: { contains: "gen" } }
 * });
 *
 * @example
 * // Search with multiple filters
 * await tenant.slack.db.channels.search({
 *   entity_id: { startsWith: "C" },
 *   data: {
 *     name: { contains: "test" },
 *     is_private: false,
 *     member_count: { gte: 10 }
 *   },
 *   limit: 20,
 *   offset: 0
 * });
 *
 * @example
 * // Search with number range
 * await tenant.slack.db.channels.search({
 *   data: {
 *     member_count: { gt: 5, lt: 100 }
 *   }
 * });
 *
 * @example
 * // Search with date range
 * await tenant.slack.db.channels.search({
 *   data: {
 *     created_at: { between: [new Date("2024-01-01"), new Date("2024-12-31")] }
 *   }
 * });
 *
 * @example
 * // Search with pagination
 * await tenant.slack.db.channels.search({
 *   data: { name: { contains: "test" } },
 *   limit: 50,
 *   offset: 100
 * });
 */
export type EntitySearchOptions<DataSchema extends ZodTypeAny> = EntityFieldsFilter & {
    /**
     * Filter by JSONB data fields.
     * Supports top-level fields only. Each field type has specific filter options.
     *
     * @example
     * { data: { name: { contains: "test" } } }
     *
     * @example
     * { data: { count: { gt: 10 } } }
     *
     * @example
     * { data: { is_private: false } }
     */
    data?: DataSearchFilter<DataSchema>;
    /**
     * Maximum number of results to return.
     *
     * @example
     * { limit: 50 }
     */
    limit?: number;
    /**
     * Number of results to skip (for pagination).
     *
     * @example
     * { offset: 100 }
     */
    offset?: number;
};
/**
 * Entity client for a specific plugin entity type (e.g., slack.messages).
 * Provides typed access to entities with the entity type's data schema.
 */
export type PluginEntityClient<DataSchema extends ZodTypeAny> = {
    /** Find by external entity ID (e.g., Slack message ts). */
    findByEntityId: (entityId: string) => Promise<TypedEntity<DataSchema> | null>;
    /** Find by internal UUID. */
    findById: (id: string) => Promise<TypedEntity<DataSchema> | null>;
    /** Find multiple by external entity IDs. */
    findManyByEntityIds: (entityIds: string[]) => Promise<TypedEntity<DataSchema>[]>;
    /** List all entities for this entity type. */
    list: (options?: {
        limit?: number;
        offset?: number;
    }) => Promise<TypedEntity<DataSchema>[]>;
    /**
     * Search entities with typed filters.
     * Supports filtering by entity table columns and JSONB data fields with various operators.
     * All filters are combined with AND logic.
     *
     * @example
     * // Search by entity_id (exact match)
     * await tenant.slack.db.channels.search({
     *   entity_id: "C0123456789"
     * });
     *
     * @example
     * // Search by entity_id with contains (LIKE '%value%')
     * await tenant.slack.db.channels.search({
     *   entity_id: { contains: "C012" }
     * });
     *
     * @example
     * // Search by entity_id with startsWith (LIKE 'value%')
     * await tenant.slack.db.channels.search({
     *   entity_id: { startsWith: "C" }
     * });
     *
     * @example
     * // Search by JSONB data field (exact match)
     * await tenant.slack.db.channels.search({
     *   data: { name: "general" }
     * });
     *
     * @example
     * // Search by JSONB string field with contains
     * await tenant.slack.db.channels.search({
     *   data: { name: { contains: "gen" } }
     * });
     *
     * @example
     * // Search by JSONB number field with range
     * await tenant.slack.db.channels.search({
     *   data: { member_count: { gt: 10, lt: 100 } }
     * });
     *
     * @example
     * // Search by JSONB boolean field
     * await tenant.slack.db.channels.search({
     *   data: { is_private: false }
     * });
     *
     * @example
     * // Search by JSONB date field with range
     * await tenant.slack.db.channels.search({
     *   data: { created_at: { between: [new Date("2024-01-01"), new Date("2024-12-31")] } }
     * });
     *
     * @example
     * // Search with multiple filters and pagination
     * await tenant.slack.db.channels.search({
     *   entity_id: { startsWith: "C" },
     *   data: {
     *     name: { contains: "test" },
     *     is_private: false,
     *     member_count: { gte: 10 }
     *   },
     *   limit: 20,
     *   offset: 0
     * });
     */
    search: (options: EntitySearchOptions<DataSchema>) => Promise<TypedEntity<DataSchema>[]>;
    /** Create or update by external entity ID. */
    upsertByEntityId: (entityId: string, data: z.input<DataSchema>) => Promise<TypedEntity<DataSchema>>;
    /** Delete by internal UUID. */
    deleteById: (id: string) => Promise<boolean>;
    /** Delete by external entity ID. */
    deleteByEntityId: (entityId: string) => Promise<boolean>;
    /** Count entities for this entity type. */
    count: () => Promise<number>;
};
/**
 * Maps a plugin schema to its typed entity clients.
 */
export type PluginEntityClients<Entities extends Record<string, ZodTypeAny>> = {
    [K in keyof Entities]: PluginEntityClient<Entities[K]>;
};
/**
 * Context for tenant-scoped operations.
 * This is set synchronously and used to filter all subsequent operations.
 */
export type TenantContext = {
    tenantId: string;
};
/**
 * Context for plugin operations.
 * Includes tenant and integration info for account-scoped filtering.
 */
export type PluginContext = {
    tenantId: string;
    integrationName: string;
};
/**
 * Full plugin ORM with typed entity clients + access to base tables.
 */
export type CorsairPluginOrm<Entities extends Record<string, ZodTypeAny>> = PluginEntityClients<Entities> & {
    /** Access to the base ORM for raw table operations. */
    $orm: CorsairOrm;
    /** The integration name this ORM is scoped to. */
    $integrationName: string;
    /** The tenant ID this ORM is scoped to. */
    $tenantId: string;
    /** Get the account ID (async, fetches from DB). */
    $getAccountId: () => Promise<string>;
};
/**
 * Tenant-scoped ORM that filters all operations by tenant.
 */
export type TenantScopedOrm = {
    /** The tenant ID this ORM is scoped to. */
    $tenantId: string;
    /** Access to the base ORM. */
    $orm: CorsairOrm;
    /** List all accounts for this tenant. */
    listAccounts: (options?: {
        limit?: number;
        offset?: number;
    }) => Promise<CorsairAccount[]>;
    /** Find an account by integration name for this tenant. */
    findAccountByIntegration: (integrationName: string) => Promise<CorsairAccount | null>;
    /** List all entities for this tenant (across all accounts). */
    listEntities: (options?: {
        entityType?: string;
        limit?: number;
        offset?: number;
    }) => Promise<CorsairEntity[]>;
    /** List all events for this tenant (across all accounts). */
    listEvents: (options?: {
        status?: 'pending' | 'processing' | 'completed' | 'failed';
        limit?: number;
        offset?: number;
    }) => Promise<CorsairEvent[]>;
    /** Create a plugin ORM scoped to this tenant and an integration. */
    forIntegration: <Entities extends Record<string, ZodTypeAny>>(config: {
        integrationName: string;
        schema: CorsairPluginSchema<Entities>;
    }) => CorsairPluginOrm<Entities>;
};
/**
 * Creates a plugin ORM with typed entity clients.
 *
 * @example
 * ```ts
 * const SlackSchema = {
 *   version: '1.0.0',
 *   entities: {
 *     messages: SlackMessageSchema,
 *     channels: SlackChannelSchema,
 *     users: SlackUserSchema,
 *   },
 * } as const;
 *
 * const slackOrm = createPluginOrm(database, {
 *   integrationName: 'slack',
 *   schema: SlackSchema,
 *   tenantId: 'tenant-123',
 * });
 *
 * // Typed entity access
 * const message = await slackOrm.messages.findByEntityId('1234567890.123456');
 * // message.data is typed as SlackMessage
 *
 * await slackOrm.channels.upsertByEntityId('C123', {
 *   id: 'C123',
 *   name: 'general',
 *   is_private: false,
 * });
 *
 * // Access base ORM for raw operations
 * const allAccounts = await slackOrm.$orm.accounts.listByTenant('tenant-123');
 * ```
 */
export declare function createPluginOrm<Entities extends Record<string, ZodTypeAny>>(config: {
    database: CorsairDatabase | undefined;
    integrationName: string;
    schema: CorsairPluginSchema<Entities>;
    tenantId: string;
}): CorsairPluginOrm<Entities>;
/**
 * Creates a tenant-scoped ORM that filters all operations by tenant.
 * This is a synchronous operation - the tenant context is just stored
 * and used when actual database operations are performed.
 *
 * @example
 * ```ts
 * const tenantOrm = createTenantScopedOrm(database, 'tenant-123');
 *
 * // List all accounts for this tenant
 * const accounts = await tenantOrm.listAccounts();
 *
 * // Create a plugin ORM for a specific integration
 * const slackOrm = tenantOrm.forIntegration({
 *   integrationName: 'slack',
 *   schema: SlackSchema,
 * });
 *
 * // All operations are scoped to tenant-123 and the slack integration
 * const messages = await slackOrm.messages.list();
 * ```
 */
export declare function createTenantScopedOrm(database: CorsairDatabase | undefined, tenantId: string): TenantScopedOrm;
/**
 * Creates a plugin ORM factory for a specific integration.
 * Useful when you need to switch tenants frequently.
 *
 * @example
 * ```ts
 * const slackOrmFactory = createPluginOrmFactory(database, {
 *   integrationName: 'slack',
 *   schema: SlackSchema,
 * });
 *
 * const tenant1Orm = slackOrmFactory.forTenant('tenant-1');
 * const tenant2Orm = slackOrmFactory.forTenant('tenant-2');
 * ```
 */
export declare function createPluginOrmFactory<Entities extends Record<string, ZodTypeAny>>(database: CorsairDatabase | undefined, config: {
    integrationName: string;
    schema: CorsairPluginSchema<Entities>;
}): {
    forTenant: (tenantId: string) => CorsairPluginOrm<Entities>;
};
export {};
//# sourceMappingURL=orm.d.ts.map