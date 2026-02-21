import { exec } from 'child_process';
import { and, eq, lte, ne } from 'drizzle-orm';
import { unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import type { AgentResult } from './agent';
import { db, workflowExecutions, workflows } from './db';

const execAsync = promisify(exec);

// ─────────────────────────────────────────────────────────────────────────────
// Script execution (one-off tasks)
// ─────────────────────────────────────────────────────────────────────────────

export async function executeScript(
	code: string,
): Promise<{ success: boolean; output?: string; error?: string }> {
	// Create a temporary TypeScript file
	const tmpPath = join(process.cwd(), `.tmp-script-${Date.now()}.ts`);

	// Wrap code with corsair import
	// Temp files are in project root, corsair is in src/
	const wrappedCode = `
import { corsair } from './src/corsair';

${code}
`;

	try {
		writeFileSync(tmpPath, wrappedCode, 'utf8');

		// Execute using tsx
		const { stdout, stderr } = await execAsync(`npx tsx "${tmpPath}"`, {
			cwd: process.cwd(),
			env: { ...process.env },
		});

		const output = stdout || stderr || '';
		return { success: true, output };
	} catch (e: unknown) {
		const err = e as { stdout?: string; stderr?: string; message?: string };
		const error = [err.stdout, err.stderr, err.message]
			.filter(Boolean)
			.join('\n');
		return { success: false, error };
	} finally {
		try {
			unlinkSync(tmpPath);
		} catch {
			// ignore cleanup errors
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow execution
// ─────────────────────────────────────────────────────────────────────────────

export async function executeWorkflow(
	workflowId: string,
	code: string,
	eventPayload?: unknown,
): Promise<{ success: boolean; output?: string; error?: string }> {
	// Create a temporary TypeScript file
	const tmpPath = join(process.cwd(), `.tmp-workflow-${Date.now()}.ts`);

	// Wrap code with corsair import and call the workflow function.
	// __event is injected so webhook-triggered workflow code can access the payload.
	const wrappedCode = `
import { corsair } from './src/corsair';
const __event: unknown = ${JSON.stringify(eventPayload ?? null)};

${code}

// Execute the workflow
${workflowId}().catch(console.error);
`;

	try {
		writeFileSync(tmpPath, wrappedCode, 'utf8');

		// Execute using tsx
		const { stdout, stderr } = await execAsync(`npx tsx "${tmpPath}"`, {
			cwd: process.cwd(),
			env: { ...process.env },
		});

		const output = stdout || stderr || '';
		return { success: true, output };
	} catch (e: unknown) {
		const err = e as { stdout?: string; stderr?: string; message?: string };
		const error = [err.stdout, err.stderr, err.message]
			.filter(Boolean)
			.join('\n');
		return { success: false, error };
	} finally {
		try {
			unlinkSync(tmpPath);
		} catch {
			// ignore cleanup errors
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Store workflow in database
// ─────────────────────────────────────────────────────────────────────────────

export async function storeWorkflow(
	result: AgentResult & { cronSchedule?: string },
) {
	if (result.type !== 'workflow' || !result.workflowId) {
		throw new Error('Cannot store non-workflow result');
	}

	let triggerType: 'manual' | 'cron' | 'webhook' = 'manual';
	let triggerConfig: Record<string, unknown> = {};
	let nextRunAt: Date | null = null;

	if (result.webhookTrigger) {
		triggerType = 'webhook';
		triggerConfig = {
			plugin: result.webhookTrigger.plugin,
			action: result.webhookTrigger.action,
		};
	} else if (result.cronSchedule) {
		triggerType = 'cron';
		triggerConfig = { cron: result.cronSchedule };
		nextRunAt = calculateNextRunTime(result.cronSchedule);
	}

	const [workflow] = await db
		.insert(workflows)
		.values({
			name: result.workflowId,
			description: result.description || '',
			code: result.code,
			triggerType,
			triggerConfig,
			nextRunAt,
			status: 'active',
		})
		.returning();

	return workflow;
}

// ─────────────────────────────────────────────────────────────────────────────
// Calculate next run time from cron schedule
// ─────────────────────────────────────────────────────────────────────────────

function calculateNextRunTime(cronSchedule: string): Date {
	const parts = cronSchedule.trim().split(/\s+/);
	if (parts.length !== 5) {
		throw new Error(
			`Invalid cron schedule: ${cronSchedule}. Expected format: "* * * * *"`,
		);
	}

	const [minute, hour, day, month, dayOfWeek] = parts;
	const now = new Date();
	const next = new Date(now);

	// Simple implementation: if all are *, run at the start of the next minute.
	// Important: zero seconds/ms so the next cron tick (start of minute) qualifies as nextRunAt <= now.
	if (
		minute === '*' &&
		hour === '*' &&
		day === '*' &&
		month === '*' &&
		dayOfWeek === '*'
	) {
		next.setSeconds(0);
		next.setMilliseconds(0);
		next.setMinutes(next.getMinutes() + 1);
		return next;
	}

	// For more complex schedules, we'll use a simple approach:
	// Parse the schedule and find the next matching time
	// This is a simplified version - for production, use a proper cron parser
	next.setSeconds(0);
	next.setMilliseconds(0);

	// If minute is specified and not *, set it
	if (minute !== '*') {
		const min = parseInt(minute, 10);
		if (!isNaN(min)) {
			next.setMinutes(min);
			if (next <= now) {
				next.setHours(next.getHours() + 1);
			}
		}
	} else {
		next.setSeconds(0);
		next.setMilliseconds(0);
		next.setMinutes(next.getMinutes() + 1);
	}

	// If hour is specified and not *, set it
	if (hour !== '*') {
		const h = parseInt(hour, 10);
		if (!isNaN(h)) {
			next.setHours(h);
			if (next <= now) {
				next.setDate(next.getDate() + 1);
			}
		}
	}

	return next;
}

// ─────────────────────────────────────────────────────────────────────────────
// Get workflows that need to run now
// ─────────────────────────────────────────────────────────────────────────────

export async function getWorkflowsToRun() {
	const now = new Date();

	const activeWorkflows = await db
		.select()
		.from(workflows)
		.where(
			and(
				eq(workflows.status, 'active'),
				eq(workflows.triggerType, 'cron'),
				lte(workflows.nextRunAt, now),
			),
		);

	return activeWorkflows.map((w) => ({
		id: w.id,
		code: w.code,
		workflowId: w.name,
		name: w.name,
	}));
}

// ─────────────────────────────────────────────────────────────────────────────
// Get webhook-triggered workflows that match a plugin + action
// ─────────────────────────────────────────────────────────────────────────────

export async function getWebhookWorkflows(plugin: string, action: string) {
	const activeWebhookWorkflows = await db
		.select()
		.from(workflows)
		.where(
			and(eq(workflows.status, 'active'), eq(workflows.triggerType, 'webhook')),
		);

	// Filter by plugin + action in JS since JSONB equality across engines varies
	return activeWebhookWorkflows
		.filter((w) => {
			const config = w.triggerConfig as {
				plugin?: string;
				action?: string;
			} | null;
			return config?.plugin === plugin && config?.action === action;
		})
		.map((w) => ({
			id: w.id,
			code: w.code,
			workflowId: w.name,
			name: w.name,
		}));
}

// ─────────────────────────────────────────────────────────────────────────────
// Update workflow's next run time
// ─────────────────────────────────────────────────────────────────────────────

export async function updateWorkflowNextRun(
	workflowId: string,
	cronSchedule: string,
) {
	const nextRunAt = calculateNextRunTime(cronSchedule);

	await db
		.update(workflows)
		.set({
			nextRunAt,
			lastRunAt: new Date(),
		})
		.where(eq(workflows.id, workflowId));
}

// ─────────────────────────────────────────────────────────────────────────────
// Create execution record
// ─────────────────────────────────────────────────────────────────────────────

export async function createExecution(
	workflowId: string,
	triggeredBy: 'cron' | 'webhook' | 'manual',
	status: 'running' | 'success' | 'failed',
	error?: string,
) {
	const [execution] = await db
		.insert(workflowExecutions)
		.values({
			workflowId,
			status,
			triggeredBy,
			error,
		})
		.returning();

	return execution;
}

export async function updateExecution(
	executionId: string,
	status: 'success' | 'failed',
	result?: unknown,
	error?: string,
) {
	await db
		.update(workflowExecutions)
		.set({
			status,
			result: result ? JSON.parse(JSON.stringify(result)) : null,
			error,
			finishedAt: new Date(),
		})
		.where(eq(workflowExecutions.id, executionId));
}

// ─────────────────────────────────────────────────────────────────────────────
// Workflow management (list / update / archive)
// ─────────────────────────────────────────────────────────────────────────────

export async function listWorkflows(
	triggerType?: 'cron' | 'webhook' | 'manual' | 'all',
) {
	const rows = await db
		.select()
		.from(workflows)
		.where(
			and(
				ne(workflows.status, 'archived'),
				triggerType && triggerType !== 'all'
					? eq(workflows.triggerType, triggerType)
					: undefined,
			),
		)
		.orderBy(workflows.createdAt);

	return rows.map((w) => ({
		id: w.id,
		name: w.name,
		description: w.description,
		triggerType: w.triggerType,
		triggerConfig: w.triggerConfig,
		status: w.status,
		nextRunAt: w.nextRunAt,
		lastRunAt: w.lastRunAt,
		createdAt: w.createdAt,
	}));
}

export async function findWorkflowByNameOrId(nameOrId: string) {
	const byName = await db
		.select()
		.from(workflows)
		.where(eq(workflows.name, nameOrId))
		.limit(1);
	if (byName[0]) return byName[0];

	const byId = await db
		.select()
		.from(workflows)
		.where(eq(workflows.id, nameOrId))
		.limit(1);
	return byId[0] ?? null;
}

export async function updateWorkflowRecord(
	nameOrId: string,
	updates: {
		code?: string;
		description?: string;
		cronSchedule?: string;
		webhookTrigger?: { plugin: string; action: string };
		status?: 'active' | 'paused' | 'archived';
	},
) {
	const existing = await findWorkflowByNameOrId(nameOrId);
	if (!existing) return null;

	const setFields: Parameters<typeof db.update>[0] extends infer T
		? Record<string, unknown>
		: Record<string, unknown> = { updatedAt: new Date() };

	if (updates.code !== undefined) setFields.code = updates.code;
	if (updates.description !== undefined)
		setFields.description = updates.description;
	if (updates.status !== undefined) setFields.status = updates.status;

	if (updates.cronSchedule !== undefined) {
		setFields.triggerType = 'cron';
		setFields.triggerConfig = { cron: updates.cronSchedule };
		setFields.nextRunAt = calculateNextRunTime(updates.cronSchedule);
	} else if (updates.webhookTrigger !== undefined) {
		setFields.triggerType = 'webhook';
		setFields.triggerConfig = {
			plugin: updates.webhookTrigger.plugin,
			action: updates.webhookTrigger.action,
		};
		setFields.nextRunAt = null;
	}

	const [updated] = await db
		.update(workflows)
		.set(setFields)
		.where(eq(workflows.id, existing.id))
		.returning();

	return updated ?? null;
}

export async function archiveWorkflow(nameOrId: string) {
	const existing = await findWorkflowByNameOrId(nameOrId);
	if (!existing) return null;

	const [updated] = await db
		.update(workflows)
		.set({ status: 'archived', updatedAt: new Date() })
		.where(eq(workflows.id, existing.id))
		.returning();

	return updated ?? null;
}
