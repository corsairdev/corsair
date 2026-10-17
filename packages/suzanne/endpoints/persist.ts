import type { SuzanneContext } from '../index';
import type { Job, JobWrite } from '../schema/database';
import { JobStatus, mergeJob } from '../schema/database';

const chains = new Map<string, Promise<void>>();

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
		.then(async () => {
			const existing = await ctx.db.jobs.findByEntityId(incoming.jobId);
			const data = existing?.data;
			const parsed = data ? JobStatus.safeParse(data.status) : undefined;
			const stored: Job | null = data
				? {
						...data,
						status: parsed?.success ? parsed.data : undefined,
					}
				: null;
			const merged = mergeJob(stored, incoming);
			await ctx.db.jobs.upsertByEntityId(incoming.jobId, merged);
		});
	chains.set(
		chainKey,
		run.catch(() => undefined),
	);
	try {
		await run;
	} catch {
		// A database miss must not fail a generation that already succeeded.
	}
}
