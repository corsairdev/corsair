import type { ZodTypeAny } from 'zod';
import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairIntegration,
	CorsairPermission,
	CorsairPermissionInsert,
} from './index';
import type {
	CorsairOrm,
	PluginEntityClient,
} from './orm';

/**
 * Operations on the `corsair_permissions` table.
 * Extracted so that each database adapter can implement them
 * without leaking query-builder types.
 */
export type CorsairPermissionOps = {
	findById(id: string): Promise<CorsairPermission | undefined>;
	findByToken(token: string): Promise<CorsairPermission | undefined>;
	create(data: CorsairPermissionInsert): Promise<CorsairPermission>;
	updateStatus(
		id: string,
		status: string,
		extra?: { error?: string | null },
	): Promise<void>;
	findActiveForEndpoint(opts: {
		plugin: string;
		endpoint: string;
		args: string;
		tenantId: string;
		now: string;
	}): Promise<CorsairPermission | undefined>;
};

/**
 * Backend-agnostic database adapter that every storage implementation
 * (Kysely/SQL, MongoDB, Convex, …) must satisfy.
 *
 * The rest of Corsair only depends on this interface — never on a specific
 * query builder or driver. Plugins interact exclusively through the
 * `PluginEntityClient` returned by `createEntityClient`, so they are
 * entirely unaffected by the choice of backend.
 */
export interface CorsairDatabaseAdapter {
	/**
	 * Creates a typed entity client for a specific plugin entity type.
	 * This is the primary interface plugins use (via `ctx.db.<entity>.*`).
	 */
	createEntityClient<DataSchema extends ZodTypeAny>(
		getAccountId: () => Promise<string>,
		entityTypeName: string,
		version: string,
		dataSchema: DataSchema,
	): PluginEntityClient<DataSchema>;

	/**
	 * Core table ORM — typed CRUD clients for integrations, accounts,
	 * entities, and events.
	 */
	readonly orm: CorsairOrm;

	/**
	 * Permission table operations (create, find, status transitions).
	 */
	readonly permissions: CorsairPermissionOps;

	/**
	 * Optional introspection hook used by `setupCorsair` to verify that
	 * required tables/collections exist. NoSQL backends that don't need
	 * pre-created collections can omit this.
	 */
	introspect?(): Promise<{ tables: string[] }>;
}
