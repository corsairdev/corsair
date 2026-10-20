import type { TinyFishContext } from './index';
import type { TinyFishAgentRun } from './schema/database';

export type StoredRun = {
	run_id: string | null;
	status: string;
	goal?: string | null;
	created_at?: string | null;
	started_at?: string | null;
	finished_at?: string | null;
	num_of_steps?: number | null;
	// Goal-dependent provider JSON. Only the docs examples fix keys, so a
	// stricter type is not practical.
	result?: Record<string, unknown> | null;
	error?: { code?: string | null; message?: string | null } | null;
	profile_id?: string | null;
};

/** A finished run can only move to another terminal state, never back. */
const TERMINAL_RUN_STATUSES = new Set(['COMPLETED', 'FAILED', 'CANCELLED']);

// The guard below reads then writes, so concurrent saves of one run could both
// read the pre-state and last-write-wins past it. Chains per run id make the
// read-guard-write atomic against other in-process callers; separate processes
// still serialize only at the database.
const persistChains = new Map<string, Promise<void>>();

/** A run without an ID is a failed creation and is not stored. */
export async function persistRun(
	ctx: TinyFishContext,
	run: StoredRun,
): Promise<void> {
	if (!run.run_id) return;
	// The db clients exist even without a database, but their writes throw.
	if (!ctx.database) return;
	const runs = ctx.db.agentRuns;

	const runId: string = run.run_id;
	const previous = persistChains.get(runId) ?? Promise.resolve();
	// The catch is load-bearing: without it one rejected save poisons every
	// save queued behind it. Each link still rejects to its own caller.
	const current = previous
		// A rejected promise is untyped. unknown is as narrow as that gets,
		// and a stricter Error is not guaranteed.
		.catch((error: unknown) => {
			console.error(
				`[TINYFISH:persistRun] queued save failed for run ${runId}: ${
					error instanceof Error ? error.message : String(error)
				}`,
			);
		})
		.then(() => persistNow(runs, runId, run));
	persistChains.set(runId, current);
	try {
		await current;
	} finally {
		if (persistChains.get(runId) === current) {
			persistChains.delete(runId);
		}
	}
}

function suppliedDate(value: string | null | undefined): Date | null {
	return value ? new Date(value) : null;
}

/**
 * Upsert replaces the whole object. Copy the stored row, then overlay only
 * keys this patch actually carries. A missing key keeps the stored value; an
 * explicit null clears it.
 */
function mergeStoredRun(
	stored: TinyFishAgentRun | undefined,
	run: StoredRun,
): TinyFishAgentRun {
	const next: TinyFishAgentRun = {
		...stored,
		status: run.status,
		updatedAt: new Date(),
	};

	if (Object.hasOwn(run, 'goal')) next.goal = run.goal ?? null;
	if (Object.hasOwn(run, 'created_at')) {
		next.createdAt = suppliedDate(run.created_at);
	}
	if (Object.hasOwn(run, 'started_at')) {
		next.startedAt = suppliedDate(run.started_at);
	}
	if (Object.hasOwn(run, 'finished_at')) {
		next.finishedAt = suppliedDate(run.finished_at);
	}
	if (Object.hasOwn(run, 'num_of_steps')) {
		next.numOfSteps = run.num_of_steps ?? null;
	}
	if (Object.hasOwn(run, 'result')) next.result = run.result ?? null;
	if (Object.hasOwn(run, 'profile_id')) next.profileId = run.profile_id ?? null;
	if (Object.hasOwn(run, 'error')) {
		if (run.error == null) {
			next.errorCode = null;
			next.errorMessage = null;
		} else {
			if (Object.hasOwn(run.error, 'code')) {
				next.errorCode = run.error.code ?? null;
			}
			if (Object.hasOwn(run.error, 'message')) {
				next.errorMessage = run.error.message ?? null;
			}
		}
	}

	return next;
}

async function persistNow(
	runs: TinyFishContext['db']['agentRuns'],
	runId: string,
	run: StoredRun,
): Promise<void> {
	const stored = (await runs.findByEntityId(runId))?.data;
	// A late poll or a stale acknowledgement must not rewind a finished run.
	if (
		stored?.status &&
		TERMINAL_RUN_STATUSES.has(stored.status) &&
		!TERMINAL_RUN_STATUSES.has(run.status)
	) {
		return;
	}

	await runs.upsertByEntityId(runId, mergeStoredRun(stored, run));
}
