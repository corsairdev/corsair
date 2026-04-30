import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Trigger Filter Types
// ─────────────────────────────────────────────────────────────────────────────

/** Zero-cost rule predicate: JS expression evaluated against the event payload. */
export const RuleTriggerFilterSchema = z.object({
	type: z.literal('rule'),
	/** JS expression with `event` in scope. E.g. 'event.from.includes("bob")'. */
	predicate: z.string(),
});
export type RuleTriggerFilter = z.infer<typeof RuleTriggerFilterSchema>;

/** LLM-based filter: Haiku (system1) evaluates each event with a stored prompt. */
export const LLMTriggerFilterSchema = z.object({
	type: z.literal('llm'),
	model: z.enum(['system1', 'system2']),
	/** Prompt template with {{event.*}} interpolation. Must produce a 'yes'/'no' answer. */
	prompt: z.string(),
	/** The answer that passes the filter. Typically 'yes'. */
	passIf: z.string(),
});
export type LLMTriggerFilter = z.infer<typeof LLMTriggerFilterSchema>;

export const TriggerFilterSchema = z.discriminatedUnion('type', [
	RuleTriggerFilterSchema,
	LLMTriggerFilterSchema,
]);
export type TriggerFilter = z.infer<typeof TriggerFilterSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Trigger Types
// ─────────────────────────────────────────────────────────────────────────────

export const WebhookTriggerSchema = z.object({
	type: z.literal('webhook'),
	plugin: z.string(),
	/** Webhook event path, e.g. 'pull_request.opened', 'deal.stage_changed'. */
	event: z.string(),
	filter: TriggerFilterSchema.optional(),
});
export type WebhookTrigger = z.infer<typeof WebhookTriggerSchema>;

export const HeartbeatConditionSchema = z.object({
	/** Plugin used for condition evaluation. */
	plugin: z.string(),
	/** Operation to call, e.g. 'api.events.list'. */
	action: z.string(),
	/** Params — may contain {{now+Nm}} time tokens. */
	params: z.record(z.unknown()),
	/** If true, fire the workflow only when the operation returns a non-empty result. */
	fireIfResultNonEmpty: z.boolean(),
});
export type HeartbeatCondition = z.infer<typeof HeartbeatConditionSchema>;

export const HeartbeatTriggerSchema = z.object({
	type: z.literal('heartbeat'),
	/** How often to tick, e.g. '5m', '30s', '1h'. */
	interval: z.string(),
	condition: HeartbeatConditionSchema.optional(),
});
export type HeartbeatTrigger = z.infer<typeof HeartbeatTriggerSchema>;

export const CronTriggerSchema = z.object({
	type: z.literal('cron'),
	/** Standard 5-part cron expression, e.g. '0 9 * * *'. */
	schedule: z.string(),
});
export type CronTrigger = z.infer<typeof CronTriggerSchema>;

export const JobTriggerSchema = z.discriminatedUnion('type', [
	WebhookTriggerSchema,
	HeartbeatTriggerSchema,
	CronTriggerSchema,
]);
export type JobTrigger = z.infer<typeof JobTriggerSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Job & Instance Status
// ─────────────────────────────────────────────────────────────────────────────

export type JobStatus = 'active' | 'paused' | 'broken';
export type InstanceStatus = 'running' | 'paused' | 'completed' | 'failed';
export type HookStatus = 'active' | 'inactive';

// ─────────────────────────────────────────────────────────────────────────────
// Domain Types
// ─────────────────────────────────────────────────────────────────────────────

export type AgentJob = {
	id: string;
	name: string;
	description: string | null;
	trigger: JobTrigger;
	/** Natural language instructions for what the agent should do when triggered. */
	instructions: string;
	status: JobStatus;
	created_at: Date;
	updated_at: Date;
};

export type AgentHook = {
	id: string;
	job_id: string;
	/** Dot-path for webhook events, e.g. 'github.pull_request.opened'. */
	path: string;
	status: HookStatus;
	created_at: Date;
};

export type AgentJobInstance = {
	id: string;
	job_id: string;
	status: InstanceStatus;
	/** Full AI SDK message history — the agent's complete conversation for this run. */
	messages: CoreMessage[];
	/** The raw event payload that spawned this instance. */
	triggered_by: Record<string, unknown>;
	/**
	 * Used to correlate incoming Slack/email reply events with this paused instance.
	 * Set to the Slack message ts when ask_and_wait sends a message.
	 */
	correlation_id: string | null;
	/** Unix ms timestamp after which the timeout poller resumes this instance. */
	timeout_at: number | null;
	started_at: Date;
	updated_at: Date;
};

// ─────────────────────────────────────────────────────────────────────────────
// LLM Configuration
// ─────────────────────────────────────────────────────────────────────────────

import type { LanguageModel } from 'ai';
export type { LanguageModel };

/**
 * LLM tier configuration.
 * Pass a LanguageModel from any AI SDK provider (e.g. anthropic('claude-haiku-4-5-20251001')).
 */
export type LLMTierConfig = LanguageModel;

// ─────────────────────────────────────────────────────────────────────────────
// Custom Tool Registration
// ─────────────────────────────────────────────────────────────────────────────

import type { CoreMessage, Tool } from 'ai';

/** A named collection of AI SDK tools available to the executor during job runs. */
export type AgentToolRegistry = Record<string, Tool>;

// ─────────────────────────────────────────────────────────────────────────────
// createCorsairAgent Options
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairAgentOptions = {
	/** System 1 (cheap, fast) model — used for trigger filter evaluation. */
	system1: LLMTierConfig;
	/** System 2 (reasoning) model — used for job execution. */
	system2: LLMTierConfig;
	/** Optional: additional tools available to the executor during job runs. */
	tools?: AgentToolRegistry;
};

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Event (passed to agent.handleWebhookEvent)
// ─────────────────────────────────────────────────────────────────────────────

export type WebhookEventPayload = {
	/** Dot-path matching the hook registration, e.g. 'github.pull_request.opened'. */
	path: string;
	/** Raw event data from the plugin webhook. */
	event: Record<string, unknown>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Chat Result
// ─────────────────────────────────────────────────────────────────────────────

export type ChatResult =
	| { type: 'job_created'; job: AgentJob; message: string }
	| { type: 'job_updated'; job: AgentJob; message: string }
	| { type: 'job_deleted'; jobId: string; message: string }
	| { type: 'message'; text: string };
