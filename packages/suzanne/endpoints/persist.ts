import type { SuzanneContext } from '../index';
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

function versionOf(row: JobRow): string {
	if (!row) return '';
	const clock = row.updated_at.getTime();
	const data = row.data;
	return `${clock}:${data?.status ?? ''}:${data?.updatedAt ?? ''}:${JSON.stringify(data?.outputs ?? null)}`;
}

function matches(data: Job | null, merged: Job): boolean {
	if (!data) return false;
	return (
		data.status === merged.status &&
		JSON.stringify(data.outputs ?? null) ===
			JSON.stringify(merged.outputs ?? null) &&
		(data.updatedAt ?? null) === (merged.updatedAt ?? null)
	);
}

// upsertByEntityId replaces the row and has no conditional update, so two
// processes can both read "running" and the later write wins. Re-read until
// the row is stable, write, then retry when a later read disagrees.
async function writeJob(
	ctx: SuzanneContext,
	incoming: JobWrite,
): Promise<void> {
	for (let attempt = 0; attempt < SAVE_ATTEMPTS; attempt++) {
		const first = await ctx.db.jobs.findByEntityId(incoming.jobId);
		const merged = mergeJob(toStored(first?.data), incoming);
		const second = await ctx.db.jobs.findByEntityId(incoming.jobId);
		if (versionOf(first) !== versionOf(second)) continue;
		await ctx.db.jobs.upsertByEntityId(incoming.jobId, merged);
		const after = await ctx.db.jobs.findByEntityId(incoming.jobId);
		if (matches(toStored(after?.data), merged)) return;
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
