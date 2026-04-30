import type { AnyCorsairInstance } from 'corsair';
import { findTimedOutInstances } from '../db/instances.js';
import type { AgentKysely } from '../db/schema.js';
import { resumeInstance } from '../executor/run-instance.js';
import type { CorsairAgentOptions } from '../types.js';

const POLL_INTERVAL_MS = 10_000;

/**
 * Background poller that checks for paused instances whose timeout_at has elapsed.
 * Resumes them with a system message so the agent knows why it woke up.
 */
export class TimeoutPoller {
	private intervalId: ReturnType<typeof setInterval> | null = null;

	constructor(
		private readonly db: AgentKysely,
		private readonly corsair: AnyCorsairInstance,
		private readonly options: CorsairAgentOptions,
	) {}

	start() {
		if (this.intervalId !== null) return;
		this.intervalId = setInterval(() => {
			void this.poll().catch((err: unknown) => {
				console.error('[CorsairAgent] Timeout poller error:', err);
			});
		}, POLL_INTERVAL_MS);
	}

	private async poll() {
		const timedOut = await findTimedOutInstances(this.db);
		for (const instance of timedOut) {
			await resumeInstance(
				this.db,
				this.corsair,
				this.options,
				instance.id,
				`Timer expired at ${new Date().toISOString()}. Continue with the next step.`,
			).catch((err: unknown) => {
				console.error(
					`[CorsairAgent] Failed to resume timed-out instance ${instance.id}:`,
					err,
				);
			});
		}
	}

	stop() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}
