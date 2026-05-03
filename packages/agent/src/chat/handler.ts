import type { CorsairToolDef } from '@corsair-dev/mcp';
import { buildCorsairToolDefs } from '@corsair-dev/mcp';
import type { CoreMessage } from 'ai';
import { generateText, tool } from 'ai';
import type { AnyCorsairInstance } from 'corsair';
import { z } from 'zod';
import { createHook, deactivateHooksForJob } from '../db/hooks.js';
import { createJob, getJobById, listJobs, updateJob } from '../db/jobs.js';
import type { AgentKysely } from '../db/schema.js';
import type { CronScheduler } from '../scheduler/cron.js';
import type { HeartbeatScheduler } from '../scheduler/heartbeat.js';
import type {
	AgentJob,
	ChatResult,
	CorsairAgentOptions,
	JobStatus,
} from '../types.js';
import { JobTriggerSchema } from '../types.js';

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

export type ChatHandlerContext = {
	db: AgentKysely;
	corsair: AnyCorsairInstance;
	options: CorsairAgentOptions;
	cronScheduler: CronScheduler;
	heartbeatScheduler: HeartbeatScheduler;
};

// ─────────────────────────────────────────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are a Corsair workflow agent. You help users automate their work by creating persistent background jobs against their connected tools.

## Job trigger types
- webhook: fires when a plugin event occurs. Use list_operations(type="webhooks") to find real event paths.
  plugin = first segment of the webhook path (e.g. "googlecalendar")
  event = remaining segments joined by "." (e.g. "webhooks.onEventChanged")
- cron: fires on a cron schedule (e.g. "0 9 * * *" for 9am daily)
- heartbeat: polls on an interval (e.g. "5m", "1h")

## Job instructions
Instructions are natural language descriptions of what the job should do when triggered.
They are executed by a reasoning agent that has access to all connected tools.

Good instructions include:
- What data to work with (e.g. "the event data", "emails from the last 24 hours")
- What actions to take and in what order
- Any conditions or branching logic
- When to pause and wait (e.g. "send a Slack message to #team-alerts and wait for approval")
- When to sleep until a future time (e.g. "sleep until 1 hour before the meeting starts")

## Trigger filters (for webhook triggers)
- rule: zero-cost JS predicate on event payload, e.g. event.from.includes("bob")
- llm: system1 (haiku) evaluates every incoming event with a stored prompt and answers yes/no

## Rules
- plugin and event in webhook triggers MUST come from list_operations(type="webhooks") output — never invent them
- Always call list_operations before writing instructions that reference specific API actions
- For webhook triggers, plugin and event must come from list_operations(type="webhooks") output
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
// Public chat handler
// ─────────────────────────────────────────────────────────────────────────────

export async function handleChat(
	prompt: string,
	ctx: ChatHandlerContext,
	history: CoreMessage[] = [],
): Promise<ChatResult> {
	let result: ChatResult | null = null;

	const corsairTools = Object.fromEntries(
		buildCorsairToolDefs({ corsair: ctx.corsair }).map((def) => [
			def.name,
			toAiSdkTool(def),
		]),
	);

	const inputMessages: CoreMessage[] = [
		...history,
		{ role: 'user', content: prompt },
	];

	const { text } = await generateText({
		model: ctx.options.system2,
		system: SYSTEM_PROMPT,
		messages: inputMessages,
		maxSteps: 15,
		onStepFinish: ({ toolCalls, toolResults }) => {
			for (const call of toolCalls) {
				process.stdout.write(
					`\n  [tool call]  ${call.toolName}(${JSON.stringify(call.args)})\n`,
				);
			}
			for (const res of toolResults) {
				const raw =
					typeof res.result === 'string'
						? res.result
						: JSON.stringify(res.result);
				const preview = raw.length > 300 ? `${raw.slice(0, 300)}…` : raw;
				process.stdout.write(`  [tool result] ${res.toolName}: ${preview}\n`);
			}
		},
		tools: {
			...corsairTools,

			list_jobs: tool({
				description:
					'List existing agent jobs. Useful before updating or deleting a job.',
				parameters: z.object({
					status: z.enum(['active', 'paused', 'broken']).optional(),
				}),
				execute: async ({ status }) => {
					const jobs = await listJobs(ctx.db, {
						status: status as JobStatus | undefined,
					});
					return jobs.map((j) => ({
						id: j.id,
						name: j.name,
						trigger: j.trigger,
						status: j.status,
						instructions_preview: j.instructions.slice(0, 100),
					}));
				},
			}),

			get_job: tool({
				description:
					'Get the full definition of a job including its instructions. Use this before updating.',
				parameters: z.object({ job_id: z.string() }),
				execute: async ({ job_id }) => {
					const job = await getJobById(ctx.db, job_id);
					return job ?? `Job "${job_id}" not found.`;
				},
			}),

			save_job: tool({
				description:
					'Persist a new persistent job to the database. Always call list_operations first to verify correct event paths and available API actions.',
				parameters: z.object({
					name: z.string().describe('Short, descriptive job name'),
					description: z.string().optional(),
					trigger: JobTriggerSchema,
					instructions: z
						.string()
						.describe(
							'Natural language instructions for what the agent should do when this job is triggered. Include what data to use, what actions to take, any conditions, and when to sleep or wait for human input.',
						),
				}),
				execute: async ({ name, description, trigger, instructions }) => {
					const job = await createJob(ctx.db, {
						name,
						description,
						trigger,
						instructions,
						status: 'active',
					});

					if (job.trigger.type === 'webhook') {
						await createHook(ctx.db, {
							job_id: job.id,
							path: `${job.trigger.plugin}.${job.trigger.event}`,
							status: 'active',
						});
					}
					if (job.trigger.type === 'cron')
						await ctx.cronScheduler.refreshJobs();
					if (job.trigger.type === 'heartbeat')
						await ctx.heartbeatScheduler.refreshJobs();

					result = {
						type: 'job_created',
						job,
						message: `I've created the job "${job.name}" (ID: ${job.id}). It will ${describeTrigger(job.trigger)}.`,
					};

					return { job_id: job.id, name: job.name, message: 'Job created.' };
				},
			}),

			update_job: tool({
				description:
					'Update an existing job. Call get_job first to see the current definition.',
				parameters: z.object({
					job_id: z.string(),
					name: z.string().optional(),
					trigger: JobTriggerSchema.optional(),
					instructions: z.string().optional(),
				}),
				execute: async ({ job_id, name, trigger, instructions }) => {
					const updated = await updateJob(ctx.db, job_id, {
						name,
						trigger,
						instructions,
					});
					if (!updated) return `Job "${job_id}" not found.`;

					if (trigger?.type === 'cron') await ctx.cronScheduler.refreshJobs();
					if (trigger?.type === 'heartbeat')
						await ctx.heartbeatScheduler.refreshJobs();

					result = {
						type: 'job_updated',
						job: updated,
						message: `Updated job "${updated.name}".`,
					};
					return { job_id: updated.id, name: updated.name, message: 'Job updated.' };
				},
			}),

			delete_job: tool({
				description:
					'Deactivate a job and deregister its hooks. Call list_jobs first if you need to find the job ID.',
				parameters: z.object({ job_id: z.string() }),
				execute: async ({ job_id }) => {
					const job = await getJobById(ctx.db, job_id);
					if (!job) return `Job "${job_id}" not found.`;

					await deactivateHooksForJob(ctx.db, job.id);
					ctx.cronScheduler.stopJob(job.id);
					ctx.heartbeatScheduler.stopJob(job.id);
					await updateJob(ctx.db, job.id, { status: 'broken' });

					result = {
						type: 'job_deleted',
						jobId: job.id,
						message: `Deleted job "${job.name}". Historical data is preserved.`,
					};
					return { message: `Job "${job.name}" deactivated.` };
				},
			}),
		},
	});

	return result ?? { type: 'message', text };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function describeTrigger(trigger: AgentJob['trigger']): string {
	if (trigger.type === 'cron') return `run on schedule: ${trigger.schedule}`;
	if (trigger.type === 'heartbeat') return `poll every ${trigger.interval}`;
	return `fire when ${trigger.plugin}.${trigger.event} occurs`;
}

function toAiSdkTool(def: CorsairToolDef) {
	return tool({
		description: def.description,
		parameters: z.object(def.shape),
		execute: async (args: Record<string, unknown>) => {
			const result = await def.handler(args);
			const text = result.content
				.filter((c): c is { type: 'text'; text: string } => c.type === 'text')
				.map((c) => c.text)
				.join('\n');
			return result.isError ? `Error: ${text}` : text;
		},
	});
}
