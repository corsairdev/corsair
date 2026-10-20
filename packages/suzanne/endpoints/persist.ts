import type { SuzanneContext } from '../index';
import { SuzanneSchema } from '../schema';
import type { JobWrite } from '../schema/database';
import { Job, JobStatus, mergeJob } from '../schema/database';

const chains = new Map<string, Promise<void>>();
const SAVE_ATTEMPTS = 5;
const JOB_ENTITY = 'jobs';

type JobRow = Awaited<
	ReturnType<SuzanneContext['db']['jobs']['findByEntityId']>
>;
type Database = NonNullable<SuzanneContext['database']>;
type DatabaseExecutor = Database['db'];

export function pendingJobSaves(): number {
	return chains.size;
}

function toStored(data: Job | null | undefined): Job | null {
	if (!data) return null;
	const parsed = JobStatus.safeParse(data.status);
	return {
		...data,
		status: parsed.success ? parsed.data : undefined,
	};
}

function jobFromColumn(data: unknown): Job | null {
	// SQLite stores this column as text and returns that string. Postgres returns the object.
	let value = data;
	if (typeof value === 'string') {
		try {
			value = JSON.parse(value);
		} catch {
			return null;
		}
	}
	const parsed = Job.safeParse(value);
	return parsed.success ? toStored(parsed.data) : null;
}

// upsertByEntityId replaces the row. Two processes can both read "running",
// and the later write wins. Update only when updated_at is still the value
// we read. SQLite returns that column as a string, so this must not call
// Date methods on it. Zero rows means someone else wrote; merge again.
async function replaceIfUnchanged(
	db: DatabaseExecutor,
	row: { id: string; updated_at: Date },
	merged: Job,
): Promise<boolean> {
	const result = await db
		.updateTable('corsair_entities')
		.set({
			version: SuzanneSchema.version,
			// The entity data column is an open JSON object.
			data: merged as Record<string, unknown>,
			updated_at: new Date(),
		})
		.where('id', '=', row.id)
		.where('updated_at', '=', row.updated_at)
		.executeTakeFirst();
	return Number(result.numUpdatedRows ?? 0) > 0;
}

// A plain insert races with another process's first save, and upsert would
// replace the row that won. One statement inserts only while the job is absent.
async function insertIfAbsent(
	db: DatabaseExecutor,
	accountId: string,
	merged: Job,
): Promise<boolean> {
	const now = new Date();
	const absent = db
		.selectNoFrom((eb) => [
			eb.val(crypto.randomUUID()).as('id'),
			eb.val(now).as('created_at'),
			eb.val(now).as('updated_at'),
			eb.val(accountId).as('account_id'),
			eb.val(merged.jobId).as('entity_id'),
			eb.val(JOB_ENTITY).as('entity_type'),
			eb.val(SuzanneSchema.version).as('version'),
			// The entity data column is an open JSON object.
			eb
				.val(merged as Record<string, unknown>)
				.as('data'),
		])
		.where((eb) =>
			eb.not(
				eb.exists(
					eb
						.selectFrom('corsair_entities')
						.select('id')
						.where('account_id', '=', accountId)
						.where('entity_type', '=', JOB_ENTITY)
						.where('entity_id', '=', merged.jobId),
				),
			),
		);
	const result = await db
		.insertInto('corsair_entities')
		.columns([
			'id',
			'created_at',
			'updated_at',
			'account_id',
			'entity_id',
			'entity_type',
			'version',
			'data',
		])
		.expression(absent)
		.executeTakeFirst();
	return Number(result.numInsertedOrUpdatedRows ?? 0) > 0;
}

async function runStatement(
	db: DatabaseExecutor,
	statement: string,
): Promise<void> {
	// One fixed statement and no parameters. This package does not depend on Kysely's raw helper,
	// so the compiled-query fields Kysely does not read for this statement stay untyped.
	await db.executeQuery({
		sql: statement,
		parameters: [],
	} as unknown as Parameters<DatabaseExecutor['executeQuery']>[0]);
}

// The SQLite driver has one connection. begin on the shared client releases
// it before commit, so a second job's begin is nested and the save is dropped.
// connection() keeps that connection until the callback returns. Reads go
// through it too, or they wait on the same connection and deadlock.
async function saveSqlite(
	ctx: SuzanneContext,
	accountId: string,
	incoming: JobWrite,
): Promise<boolean> {
	const database = ctx.database;
	if (!database) return false;
	return database.db.connection().execute(async (reserved) => {
		await runStatement(reserved, 'begin immediate');
		try {
			const existing = await reserved
				.selectFrom('corsair_entities')
				.selectAll()
				.where('account_id', '=', accountId)
				.where('entity_type', '=', JOB_ENTITY)
				.where('entity_id', '=', incoming.jobId)
				.executeTakeFirst();
			const merged = mergeJob(jobFromColumn(existing?.data), incoming);
			const saved = existing
				? await replaceIfUnchanged(reserved, existing, merged)
				: await insertIfAbsent(reserved, accountId, merged);
			await runStatement(reserved, 'commit');
			return saved;
		} catch (error) {
			await runStatement(reserved, 'rollback').catch(() => undefined);
			throw error;
		}
	});
}

// Postgres has no unique key on entity_id, so lock the account row and do the
// read, merge, and write in that transaction. The other process waits.
async function savePostgres(
	ctx: SuzanneContext,
	accountId: string,
	incoming: JobWrite,
): Promise<boolean> {
	const database = ctx.database;
	if (!database) return false;
	return database.db.transaction().execute(async (trx) => {
		await trx
			.selectFrom('corsair_accounts')
			.select('id')
			.where('id', '=', accountId)
			.forUpdate()
			.executeTakeFirst();
		const existing = await trx
			.selectFrom('corsair_entities')
			.selectAll()
			.where('account_id', '=', accountId)
			.where('entity_type', '=', JOB_ENTITY)
			.where('entity_id', '=', incoming.jobId)
			.executeTakeFirst();
		const merged = mergeJob(jobFromColumn(existing?.data), incoming);
		if (!existing) {
			const now = new Date();
			await trx
				.insertInto('corsair_entities')
				.values({
					id: crypto.randomUUID(),
					created_at: now,
					updated_at: now,
					account_id: accountId,
					entity_id: incoming.jobId,
					entity_type: JOB_ENTITY,
					version: SuzanneSchema.version,
					// The entity data column is an open JSON object.
					data: merged as Record<string, unknown>,
				})
				.execute();
			return true;
		}
		return replaceIfUnchanged(trx, existing, merged);
	});
}

async function writeJob(
	ctx: SuzanneContext,
	accountId: string,
	incoming: JobWrite,
): Promise<void> {
	const sqlite = ctx.database?.isPg === false;
	for (let attempt = 0; attempt < SAVE_ATTEMPTS; attempt++) {
		const saved = sqlite
			? await saveSqlite(ctx, accountId, incoming)
			: await savePostgres(ctx, accountId, incoming);
		if (saved) return;
	}
	console.warn('suzanne job save lost a race', incoming.jobId);
}

export async function rememberJob(
	ctx: SuzanneContext,
	incoming: JobWrite,
): Promise<void> {
	if (!ctx.database) return;
	let accountId = '';
	try {
		accountId = await ctx.$getAccountId();
	} catch {
		return;
	}
	const chainKey = `${accountId}:${incoming.jobId}`;
	const prev = chains.get(chainKey) ?? Promise.resolve();
	const run = prev
		.catch(() => undefined)
		.then(() => writeJob(ctx, accountId, incoming));
	// A database rejection is untyped. Log it and leave the endpoint successful.
	const settled = run.catch((error: unknown) => {
		console.warn('suzanne job save failed', incoming.jobId, error);
	});
	chains.set(chainKey, settled);
	void settled.finally(() => {
		if (chains.get(chainKey) === settled) chains.delete(chainKey);
	});
	await settled;
}
