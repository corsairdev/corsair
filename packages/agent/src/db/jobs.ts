import { v7 as uuidv7 } from 'uuid';
import type { JobStatus, JobTrigger } from '../types.js';
import type { AgentJobsRow, AgentKysely } from './schema.js';
import { parseJobRow } from './schema.js';

function now() {
	return new Date().toISOString();
}

export type CreateJobInput = {
	name: string;
	description?: string;
	trigger: JobTrigger;
	instructions: string;
	status?: JobStatus;
};

export type UpdateJobInput = Partial<{
	name: string;
	description: string | null;
	trigger: JobTrigger;
	instructions: string;
	status: JobStatus;
}>;

export async function createJob(db: AgentKysely, input: CreateJobInput) {
	const id = uuidv7();
	const ts = now();
	const row: AgentJobsRow = {
		id,
		name: input.name,
		description: input.description ?? null,
		trigger: JSON.stringify(input.trigger),
		instructions: input.instructions,
		status: input.status ?? 'active',
		created_at: ts,
		updated_at: ts,
	};
	await db.insertInto('agent_jobs').values(row).execute();
	return parseJobRow(row);
}

export async function getJobById(db: AgentKysely, id: string) {
	const row = await db
		.selectFrom('agent_jobs')
		.selectAll()
		.where('id', '=', id)
		.executeTakeFirst();
	return row ? parseJobRow(row) : null;
}

export async function listJobs(
	db: AgentKysely,
	filter?: { status?: JobStatus },
) {
	let q = db.selectFrom('agent_jobs').selectAll();
	if (filter?.status) q = q.where('status', '=', filter.status);
	const rows = await q.orderBy('created_at', 'desc').execute();
	return rows.map(parseJobRow);
}

export async function updateJob(
	db: AgentKysely,
	id: string,
	input: UpdateJobInput,
) {
	const updates: Partial<AgentJobsRow> = { updated_at: now() };
	if (input.name !== undefined) updates.name = input.name;
	if ('description' in input) updates.description = input.description ?? null;
	if (input.trigger !== undefined)
		updates.trigger = JSON.stringify(input.trigger);
	if (input.instructions !== undefined)
		updates.instructions = input.instructions;
	if (input.status !== undefined) updates.status = input.status;

	await db.updateTable('agent_jobs').set(updates).where('id', '=', id).execute();
	return getJobById(db, id);
}
