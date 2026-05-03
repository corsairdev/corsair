import type { Kysely } from 'kysely';
import type { AgentHook, AgentJob, AgentJobInstance } from '../types.js';
import type { CoreMessage } from 'ai';

// ─────────────────────────────────────────────────────────────────────────────
// Kysely raw row types (what the DB actually stores)
//
// JSON fields are stored as TEXT. The agent ORM layer parses them with the
// parse* functions below before returning — same pattern Corsair uses.
// timeout_at is stored as INTEGER (unix ms) for efficient numeric comparison.
// ─────────────────────────────────────────────────────────────────────────────

export type AgentJobsRow = {
	id: string;
	name: string;
	description: string | null;
	trigger: string; // JSON → JobTrigger
	instructions: string;
	status: string; // JobStatus
	created_at: string;
	updated_at: string;
};

export type AgentHooksRow = {
	id: string;
	job_id: string;
	path: string;
	status: string; // HookStatus
	created_at: string;
};

export type AgentJobInstancesRow = {
	id: string;
	job_id: string;
	status: string; // InstanceStatus
	messages: string; // JSON → CoreMessage[]
	triggered_by: string; // JSON → Record<string, unknown>
	correlation_id: string | null;
	timeout_at: number | null; // unix ms
	started_at: string;
	updated_at: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Kysely database type
// ─────────────────────────────────────────────────────────────────────────────

export type AgentDatabase = {
	agent_jobs: AgentJobsRow;
	agent_hooks: AgentHooksRow;
	agent_job_instances: AgentJobInstancesRow;
};

export type FullDatabase = AgentDatabase;
export type AgentKysely = Kysely<FullDatabase>;

// ─────────────────────────────────────────────────────────────────────────────
// Row → Domain type parsers
// ─────────────────────────────────────────────────────────────────────────────

function parseJson<T>(value: string | null | undefined, fallback: T): T {
	if (value == null) return fallback;
	if (typeof value !== 'string') return value as unknown as T;
	try {
		return JSON.parse(value) as T;
	} catch {
		return fallback;
	}
}

function parseDate(value: string | number | null | undefined) {
	if (value == null) return new Date(0);
	return new Date(value);
}

export function parseJobRow(row: AgentJobsRow): AgentJob {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		trigger: parseJson(row.trigger, {} as AgentJob['trigger']),
		instructions: row.instructions,
		status: row.status as AgentJob['status'],
		created_at: parseDate(row.created_at),
		updated_at: parseDate(row.updated_at),
	};
}

export function parseHookRow(row: AgentHooksRow): AgentHook {
	return {
		id: row.id,
		job_id: row.job_id,
		path: row.path,
		status: row.status as AgentHook['status'],
		created_at: parseDate(row.created_at),
	};
}

export function parseInstanceRow(row: AgentJobInstancesRow): AgentJobInstance {
	return {
		id: row.id,
		job_id: row.job_id,
		status: row.status as AgentJobInstance['status'],
		messages: parseJson(row.messages, [] as CoreMessage[]),
		triggered_by: parseJson(row.triggered_by, {}),
		correlation_id: row.correlation_id,
		timeout_at: row.timeout_at,
		started_at: parseDate(row.started_at),
		updated_at: parseDate(row.updated_at),
	};
}
