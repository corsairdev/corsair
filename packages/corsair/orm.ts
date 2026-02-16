/**
 * Corsair ORM - Type-safe database operations for Corsair integrations
 *
 * This module provides ORM functionality for Corsair with support for:
 * - Base tables (integrations, accounts, entities, events)
 * - Plugin-specific entity types with typed data schemas
 * - Tenant-scoped operations
 * - Transaction support
 *
 * @example
 * ```ts
 * import { createPluginOrm } from 'corsair/orm';
 *
 * const slackOrm = createPluginOrm({
 *   database,
 *   integrationName: 'slack',
 *   schema: SlackSchema,
 *   tenantId: 'tenant-123',
 * });
 *
 * await slackOrm.messages.upsertByEntityId('1234567890.123456', {
 *   text: 'Hello world',
 *   channel: 'C123',
 * });
 * ```
 */

// Database row types (re-exported with different names to avoid conflicts with core types)
export type {
	CorsairAccount,
	CorsairAccount as CorsairAccountRow,
	CorsairEntity,
	CorsairEntity as CorsairEntityRow,
	CorsairEvent,
	CorsairEvent as CorsairEventRow,
	CorsairIntegration,
	CorsairIntegration as CorsairIntegrationRow,
} from './db';
export {
	CorsairAccountsSchema,
	CorsairEntitiesSchema,
	CorsairEventsSchema,
	CorsairIntegrationsSchema,
} from './db';
export type {
	CorsairAccountsClient,
	CorsairEntitiesClient,
	CorsairEventsClient,
	CorsairIntegrationsClient,
	CorsairOrm,
	CorsairOrmDatabase,
	CorsairOrmTableName,
	CorsairPluginOrm,
	CorsairPluginSchema,
	CorsairTableClient,
	PluginContext,
	PluginEntityClient,
	PluginEntityClients,
	TenantContext,
	TenantScopedOrm,
	TypedEntity,
} from './db/orm';
export {
	createCorsairOrm,
	createPluginOrm,
	createPluginOrmFactory,
	createTenantScopedOrm,
} from './db/orm';
