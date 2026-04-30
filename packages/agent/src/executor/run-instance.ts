import type { CorsairToolDef } from '@corsair-dev/mcp';
import { buildCorsairToolDefs } from '@corsair-dev/mcp';
import type { CoreMessage } from 'ai';
import { generateText, tool } from 'ai';
import type { AnyCorsairInstance } from 'corsair';
import { z } from 'zod';
import {
	createInstance,
	getInstanceById,
	updateInstance,
} from '../db/instances.js';
import { getJobById } from '../db/jobs.js';
import type { AgentKysely } from '../db/schema.js';
import type { CorsairAgentOptions } from '../types.js';

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export async function startJobInstance(
	db: AgentKysely,
	corsair: AnyCorsairInstance,
	options: CorsairAgentOptions,
	jobId: string,
	triggeredBy: Record<string, unknown>,
) {
	const job = await getJobById(db, jobId);
	if (!job || job.status !== 'active') return;

	const instance = await createInstance(db, {
		job_id: jobId,
		triggered_by: triggeredBy,
	});

	const triggerMsg = [
		`Trigger event: ${JSON.stringify(triggeredBy)}`,
		'',
		`Instructions: ${job.instructions}`,
	].join('\n');

	await runInstance(db, corsair, options, instance.id, triggerMsg);
}

/**
 * Resume a paused instance after a Slack/email reply or a timeout expiry.
 * resumeContent is either the reply text from the user or a system message like
 * "Timer expired at <datetime>" injected by the timeout poller.
 */
export async function resumeInstance(
	db: AgentKysely,
	corsair: AnyCorsairInstance,
	options: CorsairAgentOptions,
	instanceId: string,
	resumeContent: unknown,
) {
	const instance = await getInstanceById(db, instanceId);
	if (!instance || instance.status !== 'paused') return;

	await updateInstance(db, instanceId, {
		status: 'running',
		correlation_id: null,
		timeout_at: null,
	});

	const content =
		typeof resumeContent === 'string'
			? resumeContent
			: JSON.stringify(resumeContent);

	await runInstance(db, corsair, options, instanceId, content);
}

// ─────────────────────────────────────────────────────────────────────────────
// Agentic execution loop
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a Corsair automation agent executing a background job.
You have access to all connected integrations as tools. Execute the given instructions completely.

Two special tools control execution pauses:
- sleep_until: pause until a specific ISO 8601 datetime, then resume automatically
- ask_and_wait: send a message to a human and pause until they reply (or timeout)

When you call sleep_until or ask_and_wait, stop immediately — output one sentence confirming what you are waiting for, then stop. Do not call any other tools afterwards.`;

type PauseState = {
	timeout_at: number;
	correlation_id: string | null;
};

async function runInstance(
	db: AgentKysely,
	corsair: AnyCorsairInstance,
	options: CorsairAgentOptions,
	instanceId: string,
	newUserContent: string,
) {
	const instance = await getInstanceById(db, instanceId);
	if (!instance) return;

	const inputMessages: CoreMessage[] = [
		...instance.messages,
		{ role: 'user', content: newUserContent },
	];

	const pause = { state: null as PauseState | null };

	const corsairTools = Object.fromEntries(
		buildCorsairToolDefs({ corsair }).map((def) => [
			def.name,
			toAiSdkTool(def, () => pause.state !== null),
		]),
	);

	try {
		const { response } = await generateText({
			model: options.system2,
			system: SYSTEM_PROMPT,
			messages: inputMessages,
			maxSteps: 30,
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
					const preview = raw.length > 200 ? `${raw.slice(0, 200)}…` : raw;
					process.stdout.write(`  [tool result] ${res.toolName}: ${preview}\n`);
				}
			},
			tools: {
				...corsairTools,
				...(options.tools ?? {}),

				sleep_until: tool({
					description:
						'Pause execution until a specific datetime. The job will automatically resume when the time arrives.',
					parameters: z.object({
						datetime: z
							.string()
							.describe('ISO 8601 datetime to resume at, e.g. "2024-01-15T09:00:00Z"'),
					}),
					execute: async ({ datetime }) => {
						if (pause.state) return 'Already pausing; skipping.';
						const ts = Date.parse(datetime);
						if (Number.isNaN(ts))
							return `Invalid datetime: "${datetime}" — use ISO 8601 format.`;
						pause.state = { timeout_at: ts, correlation_id: null };
						return `Sleeping until ${datetime}.`;
					},
				}),

				ask_and_wait: tool({
					description:
						'Send a message to a human and pause until they reply. Use for confirmations and user input.',
					parameters: z.object({
						channel: z.enum(['slack', 'email']),
						channel_id: z
							.string()
							.describe('Slack channel/user ID or email address'),
						message: z.string(),
						timeout: z
							.string()
							.describe('How long to wait for a reply, e.g. "10m", "1h", "3d"'),
					}),
					execute: async ({ channel, channel_id, message, timeout }) => {
						if (pause.state) return 'Already pausing; skipping.';

						let correlationId: string | null = null;

						try {
							if (channel === 'slack') {
								const result = (await callPlugin(
									corsair,
									'slack',
									'api.messages.post',
									{ channel: channel_id, text: message },
								)) as Record<string, unknown>;
								correlationId = (result?.ts as string) ?? null;
							}
						} catch (err) {
							return `Failed to send ${channel} message: ${String(err)}`;
						}

						const timeoutMs = parseDuration(timeout);
						pause.state = {
							timeout_at: Date.now() + timeoutMs,
							correlation_id: correlationId,
						};
						return `Message sent. Waiting for reply (timeout: ${timeout}).`;
					},
				}),
			},
		});

		const finalMessages: CoreMessage[] = [...inputMessages, ...response.messages];

		if (pause.state) {
			await updateInstance(db, instanceId, {
				status: 'paused',
				messages: finalMessages,
				correlation_id: pause.state.correlation_id,
				timeout_at: pause.state.timeout_at,
			});
		} else {
			await updateInstance(db, instanceId, {
				status: 'completed',
				messages: finalMessages,
			});
		}
	} catch (err) {
		const errorMsg = `Error: ${err instanceof Error ? err.message : String(err)}`;
		const finalMessages: CoreMessage[] = [
			...inputMessages,
			{ role: 'assistant', content: errorMsg },
		];
		await updateInstance(db, instanceId, {
			status: 'failed',
			messages: finalMessages,
		});
		console.error(`[CorsairAgent] Instance ${instanceId} failed:`, err);
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function callPlugin(
	corsair: AnyCorsairInstance,
	plugin: string,
	action: string,
	params: unknown,
) {
	let current: unknown = (corsair as Record<string, unknown>)[plugin];
	for (const part of action.split('.')) {
		if (current == null || typeof current !== 'object')
			throw new Error(`Plugin path ${plugin}.${action} not found`);
		current = (current as Record<string, unknown>)[part];
	}
	if (typeof current !== 'function')
		throw new Error(`${plugin}.${action} is not a function`);
	return (current as (p: unknown) => Promise<unknown>)(params);
}

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

function toAiSdkTool(def: CorsairToolDef, isPaused: () => boolean) {
	return tool({
		description: def.description,
		parameters: z.object(def.shape),
		execute: async (args: Record<string, unknown>) => {
			if (isPaused()) return 'Job is pausing; skipping this action.';
			const result = await def.handler(args);
			const text = result.content
				.filter((c): c is { type: 'text'; text: string } => c.type === 'text')
				.map((c) => c.text)
				.join('\n');
			return result.isError ? `Error: ${text}` : text;
		},
	});
}
