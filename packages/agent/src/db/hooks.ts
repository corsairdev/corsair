import { v7 as uuidv7 } from 'uuid';
import type { HookStatus } from '../types.js';
import type { AgentHooksRow, AgentKysely } from './schema.js';
import { parseHookRow } from './schema.js';

function now() {
	return new Date().toISOString();
}

export type CreateHookInput = {
	job_id: string;
	path: string;
	status?: HookStatus;
};

export async function createHook(db: AgentKysely, input: CreateHookInput) {
	const id = uuidv7();
	const row: AgentHooksRow = {
		id,
		job_id: input.job_id,
		path: input.path,
		status: input.status ?? 'active',
		created_at: now(),
	};
	await db.insertInto('agent_hooks').values(row).execute();
	return parseHookRow(row);
}

export async function getActiveHooksForPath(db: AgentKysely, path: string) {
	const rows = await db
		.selectFrom('agent_hooks')
		.selectAll()
		.where('path', '=', path)
		.where('status', '=', 'active')
		.execute();
	return rows.map(parseHookRow);
}

export async function deactivateHooksForJob(db: AgentKysely, jobId: string) {
	await db
		.updateTable('agent_hooks')
		.set({ status: 'inactive' })
		.where('job_id', '=', jobId)
		.execute();
}
