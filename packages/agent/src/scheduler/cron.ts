import type { AnyCorsairInstance } from 'corsair';
import nodeCron from 'node-cron';
import { listJobs } from '../db/jobs.js';
import type { AgentKysely } from '../db/schema.js';
import { startJobInstance } from '../executor/run-instance.js';
import type { CorsairAgentOptions } from '../types.js';

type ScheduledTask = ReturnType<typeof nodeCron.schedule>;

/**
 * Manages cron job scheduling for agent_jobs with trigger.type === 'cron'.
 * On start(), scans active jobs and schedules each with node-cron.
 * Re-scans when refreshJobs() is called (e.g. after a new job is created).
 */
export class CronScheduler {
	private tasks = new Map<string, ScheduledTask>();

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
			if (job.trigger.type !== 'cron') continue;
			seen.add(job.id);

			if (this.tasks.has(job.id)) continue; // already scheduled

			const { schedule } = job.trigger;
			if (!nodeCron.validate(schedule)) {
				console.warn(
					`[CorsairAgent] Invalid cron expression for job ${job.id}: "${schedule}"`,
				);
				continue;
			}

			const task = nodeCron.schedule(schedule, async () => {
				await startJobInstance(this.db, this.corsair, this.options, job.id, {
					source: 'cron',
					schedule,
					firedAt: new Date().toISOString(),
				}).catch((err: unknown) => {
					console.error(`[CorsairAgent] Cron job ${job.id} failed:`, err);
				});
			});
			this.tasks.set(job.id, task);
		}

		// Stop tasks for jobs that are no longer active.
		for (const [jobId, task] of this.tasks) {
			if (!seen.has(jobId)) {
				task.stop();
				this.tasks.delete(jobId);
			}
		}
	}

	stop() {
		for (const task of this.tasks.values()) {
			task.stop();
		}
		this.tasks.clear();
	}

	/** Stop the cron task for a specific job (e.g. after deletion). */
	stopJob(jobId: string) {
		const task = this.tasks.get(jobId);
		if (task) {
			task.stop();
			this.tasks.delete(jobId);
		}
	}
}
