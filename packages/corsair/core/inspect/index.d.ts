import type { CorsairPlugin } from '../plugins';
type DbFieldType = 'string' | 'number' | 'boolean' | 'date';
export type EndpointSchemaResult = {
    /** Human-readable description of what this endpoint does. */
    description?: string;
    /** Risk classification: 'read' | 'write' | 'destructive' */
    riskLevel?: 'read' | 'write' | 'destructive';
    /** Whether this action cannot be undone. */
    irreversible?: boolean;
    /** JSON Schema representation of the input arguments object. */
    input?: unknown;
    /** JSON Schema representation of the response object. */
    output?: unknown;
    /**
     * Present when the requested method was not found.
     * Lists all available full-form paths so the caller can pick a valid one.
     */
    availableMethods?: Record<string, string[]>;
};
export type WebhookSchemaResult = {
    /** Human-readable description of what triggers this webhook. */
    description?: string;
    /** JSON Schema for the webhook payload — the type of `request.payload` in the before hook. */
    payload?: unknown;
    /** JSON Schema for the webhook response data — the type of `response.data` in the after hook. */
    response?: unknown;
    /**
     * Ready-to-copy code example showing exactly how to configure this webhook,
     * including response.data type as an inline comment.
     */
    usage?: string;
    /**
     * Present when the requested webhook path was not found.
     * Lists all available webhook dot-paths per plugin so the caller can self-correct.
     */
    availableWebhooks?: Record<string, string[]>;
};
export type DbSearchSchemaResult = {
    /**
     * What this entity type represents and how to search it.
     * Pass `limit` and `offset` as numbers for pagination.
     */
    description: string;
    /**
     * Filterable fields for the search() call.
     * All active filters are AND-combined. Omit a field to skip filtering on it.
     *
     * Each operator shorthand: passing a raw value (string/number/boolean/Date) is
     * equivalent to `{ equals: value }`.
     */
    filters: {
        /** Filter by the entity's external platform ID (e.g. a Slack channel ID). */
        entity_id: {
            type: 'string';
            operators: string[];
        };
        /**
         * Filter by fields inside the entity's data payload.
         * Only flat primitive fields are listed — nested objects are not filterable.
         */
        data: Record<string, {
            type: DbFieldType;
            operators: string[];
        }>;
    };
};
export type ListOperationsOptions = {
    /**
     * Filter to a specific plugin by its ID (e.g. 'slack', 'github').
     * - If the plugin is known but not added to the Corsair instance, a plain string message is returned.
     * - If the string is completely unrecognised, returns all API endpoints as a fallback.
     */
    plugin?: string;
    /**
     * Whether to list API endpoints, webhooks, or database entities.
     * - 'api' (default) — lists callable API endpoint paths
     * - 'webhooks' — lists receivable webhook event paths
     * - 'db' — lists searchable database entity paths (one .search per entity type)
     */
    type?: 'api' | 'webhooks' | 'db';
};
export type CorsairInspectMethods = {
    /**
     * Lists available operations (API endpoints, webhooks, or database entities) for the configured plugins.
     *
     * - No options → all API endpoint paths across every plugin, keyed by plugin ID
     * - `{ type: 'webhooks' }` → all webhook paths across every plugin, keyed by plugin ID
     * - `{ type: 'db' }` → all searchable DB entity paths across every plugin, keyed by plugin ID
     * - `{ plugin: 'slack' }` → Slack API endpoint paths as a flat array
     * - `{ plugin: 'slack', type: 'webhooks' }` → Slack webhook paths as a flat array
     * - `{ plugin: 'slack', type: 'db' }` → Slack DB entity search paths as a flat array
     * - If the plugin is known but not configured, returns a plain string message.
     * - If the plugin string is completely unrecognised, returns all API endpoints (same as no options).
     *
     * API paths use the format `plugin.api.group.method` (e.g. `slack.api.messages.post`).
     * Webhook paths use the format `plugin.webhooks.group.event` (e.g. `slack.webhooks.messages.message`).
     * DB paths use the format `plugin.db.entityType.search` (e.g. `slack.db.messages.search`).
     * All paths can be passed directly to `get_schema()`.
     *
     * @example
     * corsair.list_operations()
     * // { slack: ['slack.api.channels.list', 'slack.api.messages.post', ...], ... }
     *
     * corsair.list_operations({ plugin: 'slack' })
     * // ['slack.api.channels.list', 'slack.api.messages.post', ...]
     *
     * corsair.list_operations({ plugin: 'slack', type: 'webhooks' })
     * // ['slack.webhooks.messages.message', 'slack.webhooks.channels.created', ...]
     *
     * corsair.list_operations({ plugin: 'slack', type: 'db' })
     * // ['slack.db.messages.search', 'slack.db.channels.search', 'slack.db.users.search', ...]
     *
     * corsair.list_operations({ plugin: 'unknown' })
     * // "unknown isn't configured in the Corsair instance."
     */
    list_operations(options?: ListOperationsOptions): Record<string, string[]> | string[] | string;
    /**
     * Returns schema and metadata for a specific API endpoint, webhook, or database entity search.
     * The path format determines which kind of schema is returned:
     * - API path (`plugin.api.group.method`) → `EndpointSchemaResult`
     * - Webhook path (`plugin.webhooks.group.event`) → `WebhookSchemaResult`
     * - DB path (`plugin.db.entityType.search`) → `DbSearchSchemaResult`
     *
     * Casing is ignored — the path is lowercased before lookup.
     * If the path is not found, returns an object with available paths for self-correction.
     *
     * @example
     * corsair.get_schema('slack.api.channels.list')
     * // { description: '...', riskLevel: 'read', input: { type: 'object', ... }, output: { ... } }
     *
     * corsair.get_schema('slack.webhooks.messages.message')
     * // { description: '...', usage: '...', payload: { ... }, response: { ... } }
     *
     * corsair.get_schema('slack.db.messages.search')
     * // { description: '...', filters: { entity_id: { ... }, data: { text: { type: 'string', operators: [...] }, ... } } }
     *
     * corsair.get_schema('slack.api.invalid')
     * // { availableMethods: { slack: ['slack.api.channels.list', ...], ... } }
     */
    get_schema(path: string): EndpointSchemaResult | WebhookSchemaResult | DbSearchSchemaResult;
};
/**
 * Creates the list_operations / get_schema functions bound to a specific plugin list.
 * Used by both single-tenant and multi-tenant client builders.
 */
export declare function buildInspectMethods(plugins: readonly CorsairPlugin[]): CorsairInspectMethods;
export {};
//# sourceMappingURL=index.d.ts.map