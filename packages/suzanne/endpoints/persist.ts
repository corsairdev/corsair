import type { SuzanneContext } from '../index';
import { SuzanneSchema } from '../schema';
import type { Job, JobWrite } from '../schema/database';
import { JobStatus, mergeJob } from '../schema/database';

const chains = new Map<string, Promise<void>>();
const SAVE_ATTEMPTS = 5;

type JobRow = Awaited<
	ReturnType<SuzanneContext['db']['jobs']['findByEntityId']>
>;

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

function matches(data: Job | null, merged: Job): boolean {
	if (!data) return false;
	return (
		data.status === merged.status &&
		JSON.stringify(data.outputs ?? null) ===
			JSON.stringify(merged.outputs ?? null) &&
		(data.updatedAt ?? null) === (merged.updatedAt ?? null) &&
		(data.billableAmountCents ?? null) === (merged.billableAmountCents ?? null)
	);
}

// upsertByEntityId replaces the row. Two processes can both read "running",
// and the later write wins. Update only when updated_at is still the value
// we read. SQLite returns that column as a string, so this must not call
// Date methods on it. Zero rows means someone else wrote; merge again.
async function replaceIfUnchanged(
	ctx: SuzanneContext,
	row: NonNullable<JobRow>,
	merged: Job,
): Promise<boolean> {
	const database = ctx.database;
	if (!database) return false;
	const result = await database.db
		.updateTable('corsair_entities')
		.set({
			version: SuzanneSchema.version,
			// The entity data column is an open JSON object.
			data: merged as Record<string, unknown>,
			updated_at: new Date(),
		})
		.where('id', '=', row.id)
		.where('account_id', '=', row.account_id)
		.where('entity_type', '=', row.entity_type)
		.where('entity_id', '=', row.entity_id)
		.where('updated_at', '=', row.updated_at)
		.executeTakeFirst();
	return Number(result.numUpdatedRows ?? 0) > 0;
}

async function writeJob(
	ctx: SuzanneContext,
	incoming: JobWrite,
): Promise<void> {
	for (let attempt = 0; attempt < SAVE_ATTEMPTS; attempt++) {
		const row = await ctx.db.jobs.findByEntityId(incoming.jobId);
		const merged = mergeJob(toStored(row?.data), incoming);
		if (!row) {
			await ctx.db.jobs.upsertByEntityId(incoming.jobId, merged);
			const after = await ctx.db.jobs.findByEntityId(incoming.jobId);
			if (matches(toStored(after?.data), merged)) return;
			continue;
		}
		if (await replaceIfUnchanged(ctx, row, merged)) return;
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
	const run = prev.catch(() => undefined).then(() => writeJob(ctx, incoming));
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
