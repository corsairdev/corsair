import type { OrbitContext } from '../index';
import { OrbitSchema } from '../schema';
import type {
	BulkRecord,
	EnrichRecord,
	SearchRecord,
} from '../schema/database';
import {
	BulkRecord as BulkSchema,
	EnrichRecord as EnrichSchema,
	mergeBulk,
	mergeEnrich,
	mergeSearch,
	SearchRecord as SearchSchema,
} from '../schema/database';

const chains = new Map<string, Promise<void>>();
const ATTEMPTS = 5;

type EntityName = 'searches' | 'enrichments' | 'bulkJobs';
type Stored = SearchRecord | EnrichRecord | BulkRecord;

export function pendingOrbitSaves(): number {
	return chains.size;
}

function parseStored(entity: EntityName, data: unknown): Stored | null {
	let value = data;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return null;
		}
	}
	const schema =
		entity === 'searches'
			? SearchSchema
			: entity === 'enrichments'
				? EnrichSchema
				: BulkSchema;
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : null;
}

function merge(
	entity: EntityName,
	existing: Stored | null,
	incoming: Stored,
): Stored {
	if (entity === 'searches') {
		return mergeSearch(
			existing as SearchRecord | null,
			incoming as SearchRecord,
		);
	}
	if (entity === 'enrichments') {
		return mergeEnrich(
			existing as EnrichRecord | null,
			incoming as EnrichRecord,
		);
	}
	return mergeBulk(existing as BulkRecord | null, incoming as BulkRecord);
}

function entityId(entity: EntityName, record: Stored): string {
	if (entity === 'searches') return (record as SearchRecord).searchId;
	if (entity === 'enrichments') return (record as EnrichRecord).requestId;
	return (record as BulkRecord).jobId;
}

async function runStatement(
	db: NonNullable<OrbitContext['database']>['db'],
	statement: string,
): Promise<void> {
	// One fixed statement. This package does not depend on Kysely's raw helper.
	await db.executeQuery({
		sql: statement,
		parameters: [],
	} as unknown as Parameters<
		NonNullable<OrbitContext['database']>['db']['executeQuery']
	>[0]);
}

async function replaceIfUnchanged(
	db: NonNullable<OrbitContext['database']>['db'],
	row: { id: string; updated_at: Date },
	data: Stored,
): Promise<boolean> {
	const result = await db
		.updateTable('corsair_entities')
		.set({
			version: OrbitSchema.version,
			// The entity column stores the record as JSON.
			data: data as unknown as Record<string, unknown>,
			updated_at: new Date(),
		})
		.where('id', '=', row.id)
		.where('updated_at', '=', row.updated_at)
		.executeTakeFirst();
	return Number(result.numUpdatedRows ?? 0) > 0;
}

async function saveOn(
	db: NonNullable<OrbitContext['database']>['db'],
	accountId: string,
	entity: EntityName,
	incoming: Stored,
	existing: { id: string; updated_at: Date; data: unknown } | undefined,
): Promise<boolean> {
	const merged = merge(entity, parseStored(entity, existing?.data), incoming);
	const id = entityId(entity, incoming);
	if (!existing) {
		const now = new Date();
		const inserted = await db
			.insertInto('corsair_entities')
			.values({
				id: crypto.randomUUID(),
				created_at: now,
				updated_at: now,
				account_id: accountId,
				entity_id: id,
				entity_type: entity,
				version: OrbitSchema.version,
				data: merged as unknown as Record<string, unknown>,
			})
			.executeTakeFirst();
		return Number(inserted.numInsertedOrUpdatedRows ?? 1) > 0;
	}
	return replaceIfUnchanged(db, existing, merged);
}

async function readRow(
	db: NonNullable<OrbitContext['database']>['db'],
	accountId: string,
	entity: EntityName,
	id: string,
) {
	return db
		.selectFrom('corsair_entities')
		.selectAll()
		.where('account_id', '=', accountId)
		.where('entity_type', '=', entity)
		.where('entity_id', '=', id)
		.executeTakeFirst();
}

async function writeOnce(
	ctx: OrbitContext,
	accountId: string,
	entity: EntityName,
	incoming: Stored,
): Promise<boolean> {
	const database = ctx.database;
	if (!database) return false;
	const id = entityId(entity, incoming);
	if (database.isPg === false) {
		return database.db.connection().execute(async (reserved) => {
			await runStatement(reserved, 'begin immediate');
			try {
				const existing = await readRow(reserved, accountId, entity, id);
				const saved = await saveOn(
					reserved,
					accountId,
					entity,
					incoming,
					existing,
				);
				await runStatement(reserved, 'commit');
				return saved;
			} catch (error) {
				await runStatement(reserved, 'rollback').catch(() => undefined);
				throw error;
			}
		});
	}
	return database.db.transaction().execute(async (trx) => {
		await trx
			.selectFrom('corsair_accounts')
			.select('id')
			.where('id', '=', accountId)
			.forUpdate()
			.executeTakeFirst();
		const existing = await readRow(trx, accountId, entity, id);
		return saveOn(trx, accountId, entity, incoming, existing);
	});
}

export async function rememberOperation(
	ctx: OrbitContext,
	entity: EntityName,
	incoming: Stored,
): Promise<void> {
	if (!ctx.database) return;
	let accountId = '';
	try {
		accountId = await ctx.$getAccountId();
	} catch {
		return;
	}
	const key = `${accountId}:${entity}:${entityId(entity, incoming)}`;
	const prev = chains.get(key) ?? Promise.resolve();
	const run = prev
		.catch(() => undefined)
		.then(async () => {
			for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
				if (await writeOnce(ctx, accountId, entity, incoming)) return;
			}
			console.warn(
				'orbit save lost a race',
				entity,
				entityId(entity, incoming),
			);
		});
	const settled = run.catch((error: unknown) => {
		console.warn(
			'orbit save failed',
			entity,
			entityId(entity, incoming),
			error,
		);
	});
	chains.set(key, settled);
	void settled.finally(() => {
		if (chains.get(key) === settled) chains.delete(key);
	});
	await settled;
}
