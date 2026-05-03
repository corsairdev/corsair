import type { AnyCorsairInstance } from 'corsair';
import { listJobs } from '../db/jobs.js';
import type { AgentKysely } from '../db/schema.js';
import { startJobInstance } from '../executor/run-instance.js';
import type { CorsairAgentOptions, HeartbeatTrigger } from '../types.js';

type HeartbeatHandle = {
	intervalId: ReturnType<typeof setInterval>;
};

/**
 * Manages heartbeat-triggered jobs.
 * Each heartbeat job gets a setInterval that fires at the configured interval.
 * When a condition is present, it is evaluated each tick before starting an instance.
 */
export class HeartbeatScheduler {
	private handles = new Map<string, HeartbeatHandle>();

	constructor(
		private readonly db: AgentKysely,
		private readonly corsair: AnyCorsairInstance,
		private readonly options: CorsairAgentOptions,
	) {}

	async start() {
		await this.refreshJobs();
	}

	async refreshJobs() {
		const jobs = await listJobs(this.db, { status: 'active' });

		const seen = new Set<string>();
		for (const job of jobs) {
			if (job.trigger.type !== 'heartbeat') continue;
			seen.add(job.id);
			if (this.handles.has(job.id)) continue;

			let intervalMs: number;
			try {
				intervalMs = parseDuration(job.trigger.interval);
			} catch {
				console.warn(
					`[CorsairAgent] Invalid heartbeat interval for job ${job.id}: "${job.trigger.interval}"`,
				);
				continue;
			}

			const trigger = job.trigger as HeartbeatTrigger;
			const jobId = job.id;

			const intervalId = setInterval(async () => {
				try {
					if (trigger.condition) {
						const passed = await this.evaluateCondition(trigger);
						if (!passed) return;
					}

					await startJobInstance(this.db, this.corsair, this.options, jobId, {
						source: 'heartbeat',
						interval: trigger.interval,
						firedAt: new Date().toISOString(),
					});
				} catch (err) {
					console.error(`[CorsairAgent] Heartbeat job ${jobId} failed:`, err);
				}
			}, intervalMs);

			this.handles.set(jobId, { intervalId });
		}

		for (const [jobId, handle] of this.handles) {
			if (!seen.has(jobId)) {
				clearInterval(handle.intervalId);
				this.handles.delete(jobId);
			}
		}
	}

	private async evaluateCondition(trigger: HeartbeatTrigger) {
		const { condition } = trigger;
		if (!condition) return true;

		const resolvedParams = resolveTimeTokensInParams(condition.params);

		try {
			let current: unknown = (this.corsair as Record<string, unknown>)[
				condition.plugin
			];
			for (const part of condition.action.split('.')) {
				if (current == null || typeof current !== 'object') return false;
				current = (current as Record<string, unknown>)[part];
			}
			if (typeof current !== 'function') return false;

			const result = await (current as (p: unknown) => Promise<unknown>)(
				resolvedParams,
			);

			if (condition.fireIfResultNonEmpty) {
				if (Array.isArray(result)) return result.length > 0;
				if (result && typeof result === 'object')
					return Object.keys(result as object).length > 0;
				return result != null;
			}
			return true;
		} catch {
			return false;
		}
	}

	stop() {
		for (const handle of this.handles.values()) {
			clearInterval(handle.intervalId);
		}
		this.handles.clear();
	}

	stopJob(jobId: string) {
		const handle = this.handles.get(jobId);
		if (handle) {
			clearInterval(handle.intervalId);
			this.handles.delete(jobId);
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function parseDuration(duration: string) {
	const match = /^(\d+)([smhd])$/.exec(duration);
	if (!match) throw new Error(`Invalid duration: "${duration}"`);
	const units: Record<string, number> = {
		s: 1_000,
		m: 60_000,
		h: 3_600_000,
		d: 86_400_000,
	};
	return parseInt(match[1] ?? '0', 10) * (units[match[2] ?? 'm'] ?? 60_000);
}

/** Replaces {{now+Nm}} / {{now-Nm}} tokens in params with ISO date strings. */
function resolveTimeTokensInParams(
	params: Record<string, unknown>,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(params)) {
		if (typeof value === 'string') {
			out[key] = resolveTimeToken(value);
		} else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			out[key] = resolveTimeTokensInParams(value as Record<string, unknown>);
		} else {
			out[key] = value;
		}
	}
	return out;
}

function resolveTimeToken(token: string) {
	const match = /^now([+-])(\d+)([smhd])$/.exec(token);
	if (!match) return token;
	const units: Record<string, number> = {
		s: 1_000,
		m: 60_000,
		h: 3_600_000,
		d: 86_400_000,
	};
	const sign = match[1] === '+' ? 1 : -1;
	const ms =
		parseInt(match[2] ?? '0', 10) * (units[match[3] ?? 'm'] ?? 60_000);
	return new Date(Date.now() + sign * ms).toISOString();
}
