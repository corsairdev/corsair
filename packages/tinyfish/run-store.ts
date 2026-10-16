import type { TinyFishContext } from './index';

export type StoredRun = {
	run_id: string | null;
	status: string;
	goal?: string | null;
	created_at?: string | null;
	started_at?: string | null;
	finished_at?: string | null;
	num_of_steps?: number | null;
	result?: Record<string, unknown> | null;
	error?: { code?: string | null; message?: string | null } | null;
	profile_id?: string | null;
};

/** A run without an ID is a failed creation and is not stored. */
export async function persistRun(
	ctx: TinyFishContext,
	run: StoredRun,
): Promise<void> {
	if (!run.run_id) return;
	const runs = ctx.db.agentRuns;
	if (!runs) return;

	await runs.upsertByEntityId(run.run_id, {
		status: run.status,
		goal: run.goal ?? undefined,
		createdAt: run.created_at ? new Date(run.created_at) : undefined,
		startedAt: run.started_at ? new Date(run.started_at) : undefined,
		finishedAt: run.finished_at ? new Date(run.finished_at) : undefined,
		numOfSteps: run.num_of_steps ?? undefined,
		result: run.result ?? undefined,
		errorCode: run.error?.code ?? undefined,
		errorMessage: run.error?.message ?? undefined,
		profileId: run.profile_id ?? undefined,
		updatedAt: new Date(),
	});
}
