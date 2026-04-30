import type { CoreMessage } from 'ai';
import { v7 as uuidv7 } from 'uuid';
import type { InstanceStatus } from '../types.js';
import type { AgentJobInstancesRow, AgentKysely } from './schema.js';
import { parseInstanceRow } from './schema.js';

function now() {
	return new Date().toISOString();
}

export type CreateInstanceInput = {
	job_id: string;
	triggered_by: Record<string, unknown>;
};

export async function createInstance(
	db: AgentKysely,
	input: CreateInstanceInput,
) {
	const id = uuidv7();
	const ts = now();
	const row: AgentJobInstancesRow = {
		id,
		job_id: input.job_id,
		status: 'running',
		messages: '[]',
		triggered_by: JSON.stringify(input.triggered_by),
		correlation_id: null,
		timeout_at: null,
		started_at: ts,
		updated_at: ts,
	};
	await db.insertInto('agent_job_instances').values(row).execute();
	return parseInstanceRow(row);
}

export async function getInstanceById(db: AgentKysely, id: string) {
	const row = await db
		.selectFrom('agent_job_instances')
		.selectAll()
		.where('id', '=', id)
		.executeTakeFirst();
	return row ? parseInstanceRow(row) : null;
}

export async function listInstances(
	db: AgentKysely,
	filter?: { job_id?: string; status?: InstanceStatus },
) {
	let q = db.selectFrom('agent_job_instances').selectAll();
	if (filter?.job_id) q = q.where('job_id', '=', filter.job_id);
	if (filter?.status) q = q.where('status', '=', filter.status);
	const rows = await q.orderBy('started_at', 'desc').execute();
	return rows.map(parseInstanceRow);
}

export type UpdateInstanceInput = Partial<{
	status: InstanceStatus;
	messages: CoreMessage[];
	correlation_id: string | null;
	timeout_at: number | null;
}>;

export async function updateInstance(
	db: AgentKysely,
	id: string,
	input: UpdateInstanceInput,
) {
	const updates: Partial<AgentJobInstancesRow> = { updated_at: now() };
	if (input.status !== undefined) updates.status = input.status;
	if (input.messages !== undefined)
		updates.messages = JSON.stringify(input.messages);
	if ('correlation_id' in input)
		updates.correlation_id = input.correlation_id ?? null;
	if ('timeout_at' in input) updates.timeout_at = input.timeout_at ?? null;

	if (Object.keys(updates).length === 1) return getInstanceById(db, id); // only updated_at

	await db
		.updateTable('agent_job_instances')
		.set(updates)
		.where('id', '=', id)
		.execute();
	return getInstanceById(db, id);
}

/** Find the paused instance waiting on a specific correlation_id. */
export async function findPausedInstanceByCorrelationId(
	db: AgentKysely,
	correlationId: string,
) {
	const row = await db
		.selectFrom('agent_job_instances')
		.selectAll()
		.where('correlation_id', '=', correlationId)
		.where('status', '=', 'paused')
		.executeTakeFirst();
	return row ? parseInstanceRow(row) : null;
}

/** Return all paused instances whose timeout has elapsed. */
export async function findTimedOutInstances(db: AgentKysely) {
	const cutoff = Date.now();
	const rows = await db
		.selectFrom('agent_job_instances')
		.selectAll()
		.where('status', '=', 'paused')
		.where('timeout_at', 'is not', null)
		.where('timeout_at', '<=', cutoff)
		.execute();
	return rows.map(parseInstanceRow);
}
