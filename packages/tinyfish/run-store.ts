import type { TinyFishContext } from './index';

export type StoredRun = {
	run_id: string | null;
	status: string;
	goal?: string | null;
	created_at?: string | null;
	started_at?: string | null;
	finished_at?: string | null;
	num_of_steps?: number | null;
	// Run results are provider-defined JSON; only the docs examples fix keys.
	result?: Record<string, unknown> | null;
	error?: { code?: string | null; message?: string | null } | null;
	profile_id?: string | null;
};

/** A finished run can only move to another terminal state, never back. */
const TERMINAL_RUN_STATUSES = new Set(['COMPLETED', 'FAILED', 'CANCELLED']);

/** A run without an ID is a failed creation and is not stored. */
export async function persistRun(
	ctx: TinyFishContext,
	run: StoredRun,
): Promise<void> {
	if (!run.run_id) return;
	// The db clients exist even without a database, but their writes throw.
	if (!ctx.database) return;
	const runs = ctx.db.agentRuns;

	const stored = (await runs.findByEntityId(run.run_id))?.data;
	// A late poll or a stale acknowledgement must not rewind a finished run.
	if (
		stored?.status &&
		TERMINAL_RUN_STATUSES.has(stored.status) &&
		!TERMINAL_RUN_STATUSES.has(run.status)
	) {
		return;
	}

	// Upsert replaces the whole row, so each absent patch key falls back to
	// the stored value instead of erasing it; a real value still overwrites.
	await runs.upsertByEntityId(run.run_id, {
		status: run.status,
		goal: run.goal ?? stored?.goal,
		createdAt: run.created_at ? new Date(run.created_at) : stored?.createdAt,
		startedAt: run.started_at ? new Date(run.started_at) : stored?.startedAt,
		finishedAt: run.finished_at
			? new Date(run.finished_at)
			: stored?.finishedAt,
		numOfSteps: run.num_of_steps ?? stored?.numOfSteps,
		result: run.result ?? stored?.result,
		errorCode: run.error?.code ?? stored?.errorCode,
		errorMessage: run.error?.message ?? stored?.errorMessage,
		profileId: run.profile_id ?? stored?.profileId,
		updatedAt: new Date(),
	});
}
