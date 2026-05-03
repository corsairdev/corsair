import type { CorsairToolDef } from '@corsair-dev/mcp';
import type { AnyCorsairInstance } from 'corsair';
import type { CorsairInternalConfig } from 'corsair/core';
import { CORSAIR_INTERNAL } from 'corsair/core';
import { handleChat } from './chat/handler.js';
import { getActiveHooksForPath } from './db/hooks.js';
import {
	findPausedInstanceByCorrelationId,
	listInstances,
} from './db/instances.js';
import { getJobById, listJobs } from './db/jobs.js';
import { runAgentMigrations } from './db/migrate.js';
import type { AgentKysely } from './db/schema.js';
import { resumeInstance, startJobInstance } from './executor/run-instance.js';
import { buildAgentMcpTools } from './mcp/tools.js';
import { CronScheduler } from './scheduler/cron.js';
import { HeartbeatScheduler } from './scheduler/heartbeat.js';
import { TimeoutPoller } from './scheduler/timeout.js';
import { evaluateLLMFilter, evaluateRuleFilter } from './system1/filter.js';
import type {
	AgentJob,
	AgentJobInstance,
	ChatResult,
	CorsairAgentOptions,
	JobStatus,
	WebhookEventPayload,
} from './types.js';

// ─────────────────────────────────────────────────────────────────────────────
// CorsairAgent public interface
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairAgent = {
	/**
	 * Start the agent runtime.
	 * - Runs DB migrations (creates agent tables if they don't exist).
	 * - Starts the cron scheduler, heartbeat scheduler, and timeout poller.
	 * Must be called once before using the agent.
	 */
	start(): Promise<void>;

	/** Stop all background schedulers cleanly. */
	stop(): void;

	/**
	 * Handle a natural-language message.
	 * Routes to job creation, mutation, deletion, or general conversation.
	 */
	chat(prompt: string): Promise<ChatResult>;

	/**
	 * Forward a Corsair webhook event to the agent.
	 * Checks for paused instances waiting on a reply, then checks for job-level
	 * hooks that should start new instances.
	 */
	handleWebhookEvent(payload: WebhookEventPayload): Promise<void>;

	/**
	 * The agent MCP tools (includes `agent_chat`).
	 * Merge into your MCP server alongside the core Corsair tools.
	 */
	readonly mcpTools: CorsairToolDef[];

	jobs: {
		list(filter?: { status?: JobStatus }): Promise<AgentJob[]>;
		get(jobId: string): Promise<AgentJob | null>;
	};

	instances: {
		list(filter?: {
			job_id?: string;
			status?: AgentJobInstance['status'];
		}): Promise<AgentJobInstance[]>;
	};
};

// ─────────────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────────────

export function createCorsairAgent(
	corsair: AnyCorsairInstance,
	options: CorsairAgentOptions,
): CorsairAgent {
	const internal = (corsair as unknown as Record<symbol, unknown>)[
		CORSAIR_INTERNAL
	] as CorsairInternalConfig | undefined;

	if (!internal?.database) {
		throw new Error(
			'createCorsairAgent: corsair instance has no database configured. ' +
				'Pass `database` to createCorsair() before creating an agent.',
		);
	}

	const db = internal.database.db as unknown as AgentKysely;

	const cronScheduler = new CronScheduler(db, corsair, options);
	const heartbeatScheduler = new HeartbeatScheduler(db, corsair, options);
	const timeoutPoller = new TimeoutPoller(db, corsair, options);

	const mcpTools = buildAgentMcpTools({
		db,
		corsair,
		options,
		cronScheduler,
		heartbeatScheduler,
	});

	const chatCtx = { db, corsair, options, cronScheduler, heartbeatScheduler };

	return {
		async start() {
			await runAgentMigrations(db);
			await cronScheduler.start();
			await heartbeatScheduler.start();
			timeoutPoller.start();
		},

		stop() {
			cronScheduler.stop();
			heartbeatScheduler.stop();
			timeoutPoller.stop();
		},

		async chat(prompt: string) {
			return handleChat(prompt, chatCtx);
		},

		async handleWebhookEvent(payload: WebhookEventPayload) {
			const { path, event } = payload;

			// 1. Check for paused instances waiting on a Slack/email reply.
			const correlationId =
				(event['thread_ts'] as string | undefined) ??
				(event['ts'] as string | undefined) ??
				(event['message_id'] as string | undefined);

			if (correlationId) {
				const paused = await findPausedInstanceByCorrelationId(
					db,
					correlationId,
				);
				if (paused) {
					await resumeInstance(
						db,
						corsair,
						options,
						paused.id,
						(event['text'] as string | undefined) ??
							(event['body'] as string | undefined) ??
							JSON.stringify(event),
					);
					return;
				}
			}

			// 2. Check for job-level hooks that start new instances.
			const hooks = await getActiveHooksForPath(db, path);

			for (const hook of hooks) {
				const job = await getJobById(db, hook.job_id);
				if (!job || job.status !== 'active') continue;

				const trigger = job.trigger;
				if (trigger.type !== 'webhook') continue;

				const passed = await evaluateTriggerFilter(
					trigger.filter,
					event,
					options,
				);
				if (!passed) continue;

				await startJobInstance(db, corsair, options, job.id, event);
			}
		},

		mcpTools,

		jobs: {
			list: (filter) => listJobs(db, filter),
			get: (jobId) => getJobById(db, jobId),
		},

		instances: {
			list: (filter) => listInstances(db, filter),
		},
	} as CorsairAgent;
}

// ─────────────────────────────────────────────────────────────────────────────
// Trigger filter evaluation
// ─────────────────────────────────────────────────────────────────────────────

async function evaluateTriggerFilter(
	filter: { type: string; [key: string]: unknown } | undefined,
	event: Record<string, unknown>,
	options: CorsairAgentOptions,
) {
	if (!filter) return true;

	if (filter.type === 'rule') {
		return evaluateRuleFilter(filter['predicate'] as string, event);
	}

	if (filter.type === 'llm') {
		const model =
			filter['model'] === 'system2' ? options.system2 : options.system1;
		return evaluateLLMFilter(
			filter as Parameters<typeof evaluateLLMFilter>[0],
			model,
			event,
		);
	}

	return true;
}
