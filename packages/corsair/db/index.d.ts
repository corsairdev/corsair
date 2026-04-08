import { z } from 'zod';
export declare const CorsairIntegrationsSchema: z.ZodObject<{
    id: z.ZodString;
    created_at: z.ZodDate;
    updated_at: z.ZodDate;
    name: z.ZodString;
    config: z.ZodEffects<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | null>;
    dek: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
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
export type CorsairIntegration = z.infer<typeof CorsairIntegrationsSchema>;
export declare const CorsairAccountsSchema: z.ZodObject<{
    id: z.ZodString;
    created_at: z.ZodDate;
    updated_at: z.ZodDate;
    tenant_id: z.ZodString;
    integration_id: z.ZodString;
    config: z.ZodEffects<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | null>;
    dek: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
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
export type CorsairAccount = z.infer<typeof CorsairAccountsSchema>;
export declare const CorsairEntitiesSchema: z.ZodObject<{
    id: z.ZodString;
    created_at: z.ZodDate;
    updated_at: z.ZodDate;
    account_id: z.ZodString;
    entity_id: z.ZodString;
    entity_type: z.ZodString;
    version: z.ZodString;
    data: z.ZodEffects<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | null>;
}, "strip", z.ZodTypeAny, {
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
export type CorsairEntity = z.infer<typeof CorsairEntitiesSchema>;
export declare const CorsairEventsSchema: z.ZodObject<{
    id: z.ZodString;
    created_at: z.ZodDate;
    updated_at: z.ZodDate;
    account_id: z.ZodString;
    event_type: z.ZodString;
    payload: z.ZodEffects<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>, Record<string, unknown>, Record<string, unknown> | null>;
    status: z.ZodOptional<z.ZodEnum<["pending", "processing", "completed", "failed"]>>;
}, "strip", z.ZodTypeAny, {
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
export type CorsairEvent = z.infer<typeof CorsairEventsSchema>;
export declare const CorsairPermissionsSchema: z.ZodObject<{
    id: z.ZodString;
    created_at: z.ZodDate;
    updated_at: z.ZodDate;
    /** 32-byte hex-encoded secure random token, single-use. Embedded in the review URL. */
    token: z.ZodString;
    /** Plugin identifier, e.g. 'github' */
    plugin: z.ZodString;
    /** Dot-notation endpoint path, e.g. 'repositories.delete' */
    endpoint: z.ZodString;
    /** JSON-encoded args that will be forwarded to the endpoint upon approval */
    args: z.ZodString;
    /**
     * Tenant ID for multi-tenant corsair instances. Stored so executePermission
     * can scope the corsair instance correctly when executing the approved action.
     * Defaults to 'default' for single-tenant instances.
     */
    tenant_id: z.ZodString;
    /** Current state of the approval request */
    status: z.ZodDefault<z.ZodEnum<["pending", "approved", "executing", "completed", "denied", "expired", "failed"]>>;
    /** ISO8601 timestamp — when this request becomes invalid */
    expires_at: z.ZodString;
    /** Stringified error captured when status transitions to 'failed'. Null otherwise. */
    error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    token: string;
    id: string;
    created_at: Date;
    updated_at: Date;
    status: "pending" | "completed" | "failed" | "approved" | "executing" | "denied" | "expired";
    tenant_id: string;
    plugin: string;
    endpoint: string;
    args: string;
    expires_at: string;
    error?: string | null | undefined;
}, {
    token: string;
    id: string;
    created_at: Date;
    updated_at: Date;
    tenant_id: string;
    plugin: string;
    endpoint: string;
    args: string;
    expires_at: string;
    status?: "pending" | "completed" | "failed" | "approved" | "executing" | "denied" | "expired" | undefined;
    error?: string | null | undefined;
}>;
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
    status?: 'pending' | 'approved' | 'executing' | 'completed' | 'denied' | 'expired' | 'failed';
    expires_at: string;
    error?: string | null;
};
export type CorsairTableName = 'corsair_integrations' | 'corsair_accounts' | 'corsair_entities' | 'corsair_events' | 'corsair_permissions' | (string & {});
export type CorsairTableRow = {
    corsair_integrations: CorsairIntegration;
    corsair_accounts: CorsairAccount;
    corsair_entities: CorsairEntity;
    corsair_events: CorsairEvent;
};
export type TableRowType<T extends CorsairTableName> = T extends keyof CorsairTableRow ? CorsairTableRow[T] : Record<string, unknown>;
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
export type TableInsertType<T extends CorsairTableName> = T extends keyof CorsairTableInsert ? CorsairTableInsert[T] : Record<string, unknown>;
export type CorsairIntegrationUpdate = Partial<Omit<CorsairIntegration, 'id' | 'created_at'>>;
export type CorsairAccountUpdate = Partial<Omit<CorsairAccount, 'id' | 'created_at'>>;
export type CorsairEntityUpdate = Partial<Omit<CorsairEntity, 'id' | 'created_at'>>;
export type CorsairEventUpdate = Partial<Omit<CorsairEvent, 'id' | 'created_at'>>;
export type CorsairTableUpdate = {
    corsair_integrations: CorsairIntegrationUpdate;
    corsair_accounts: CorsairAccountUpdate;
    corsair_entities: CorsairEntityUpdate;
    corsair_events: CorsairEventUpdate;
};
export type TableUpdateType<T extends CorsairTableName> = T extends keyof CorsairTableUpdate ? CorsairTableUpdate[T] : Record<string, unknown>;
//# sourceMappingURL=index.d.ts.map