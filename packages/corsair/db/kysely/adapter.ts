import type { Kysely } from 'kysely';
import type { ZodTypeAny } from 'zod';
import { generateUUID } from '../../core/utils';
import type {
	CorsairPermission,
	CorsairPermissionInsert,
} from '../index';
import type { CorsairDatabaseAdapter, CorsairPermissionOps } from '../adapter';
import type { CorsairOrm, PluginEntityClient } from '../orm';
import { createCorsairOrm } from '../orm';
import type { CorsairKyselyDatabase } from './database';
import { createKyselyEntityClient } from './orm';

/**
 * Kysely/SQL implementation of `CorsairDatabaseAdapter`.
 *
 * Wraps a `Kysely<CorsairKyselyDatabase>` instance and delegates to the
 * existing ORM helpers (`createCorsairOrm`, `createKyselyEntityClient`).
 * This is a pure refactor of the code that previously lived inline in
 * `core/client/index.ts`, `core/auth/key-manager.ts`, etc.
 */
export class KyselyDatabaseAdapter implements CorsairDatabaseAdapter {
	/** The raw Kysely instance — exposed only for the adapter internals. */
	readonly db: Kysely<CorsairKyselyDatabase>;

	private _orm: CorsairOrm | undefined;
	private _permissions: CorsairPermissionOps | undefined;

	constructor(db: Kysely<CorsairKyselyDatabase>) {
		this.db = db;
	}

	createEntityClient<DataSchema extends ZodTypeAny>(
		getAccountId: () => Promise<string>,
		entityTypeName: string,
		version: string,
		dataSchema: DataSchema,
	): PluginEntityClient<DataSchema> {
		return createKyselyEntityClient(
			this.db,
			getAccountId,
			entityTypeName,
			version,
			dataSchema,
		);
	}

	get orm(): CorsairOrm {
		if (!this._orm) {
			this._orm = createCorsairOrm(this);
		}
		return this._orm;
	}

	get permissions(): CorsairPermissionOps {
		if (!this._permissions) {
			this._permissions = buildKyselyPermissionOps(this.db);
		}
		return this._permissions;
	}

	async introspect(): Promise<{ tables: string[] }> {
		const tables = await this.db.introspection.getTables();
		return { tables: tables.map((t) => t.name) };
	}
}

function buildKyselyPermissionOps(
	db: Kysely<CorsairKyselyDatabase>,
): CorsairPermissionOps {
	return {
		async findById(id: string) {
			return db
				.selectFrom('corsair_permissions')
				.selectAll()
				.where('id', '=', id)
				.executeTakeFirst() as Promise<CorsairPermission | undefined>;
		},

		async findByToken(token: string) {
			return db
				.selectFrom('corsair_permissions')
				.selectAll()
				.where('token', '=', token)
				.executeTakeFirst() as Promise<CorsairPermission | undefined>;
		},

		async create(data: CorsairPermissionInsert) {
			const now = new Date();
			const row = {
				id: data.id ?? generateUUID(),
				created_at: data.created_at ?? now,
				updated_at: data.updated_at ?? now,
				token: data.token,
				plugin: data.plugin,
				endpoint: data.endpoint,
				args: data.args,
				tenant_id: data.tenant_id ?? 'default',
				status: data.status ?? 'pending',
				expires_at: data.expires_at,
				error: data.error ?? null,
			};
			await db.insertInto('corsair_permissions').values(row).execute();
			return row as unknown as CorsairPermission;
		},

		async updateStatus(
			id: string,
			status: string,
			extra?: { error?: string | null },
		) {
			const set: Record<string, unknown> = {
				status,
				updated_at: new Date(),
			};
			if (extra?.error !== undefined) {
				set.error = extra.error;
			}
			await db
				.updateTable('corsair_permissions')
				.set(set)
				.where('id', '=', id)
				.execute();
		},

		async findActiveForEndpoint(opts) {
			return db
				.selectFrom('corsair_permissions')
				.selectAll()
				.where('plugin', '=', opts.plugin)
				.where('endpoint', '=', opts.endpoint)
				.where('args', '=', opts.args)
				.where('tenant_id', '=', opts.tenantId)
				.where('expires_at', '>', opts.now)
				.where('status', 'in', ['pending', 'approved', 'executing'])
				.orderBy('created_at', 'desc')
				.limit(1)
				.executeTakeFirst() as Promise<CorsairPermission | undefined>;
		},
	};
}
