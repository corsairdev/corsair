import { logEventFromContext } from 'corsair/core';
import { makeTimecampRequest } from '../client';
import type { TimecampEndpoints } from '../index';
import type { TimecampProject } from './types';

/**
 * TimeCamp's task payload is loosely typed — ids arrive as strings in some
 * places and numbers in others, and flags arrive as "0"/"1". These coercions
 * keep that inconsistency inside the plugin instead of leaking it to callers.
 */
function toStringOrNull(value: unknown): string | null {
	if (typeof value === 'string') return value.length > 0 ? value : null;
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	return null;
}

function toBoolean(value: unknown): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value !== 0;
	if (typeof value === 'string') return value !== '' && value !== '0';
	return false;
}

function toNumberOrNull(value: unknown): number | null {
	if (typeof value === 'number') return Number.isFinite(value) ? value : null;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

/**
 * `users` comes back either as an object keyed by user id or as an array,
 * depending on the endpoint and plan. Both collapse to a list of user ids.
 */
function toUserIds(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map(toStringOrNull).filter((v): v is string => v !== null);
	}
	if (value && typeof value === 'object') {
		return Object.keys(value as Record<string, unknown>);
	}
	return [];
}

/**
 * A project is a task with no parent. TimeCamp signals "no parent" as null, an
 * empty string, or the string/number zero depending on the record, so all four
 * are treated as root.
 */
function isRootLevel(parentId: unknown): boolean {
	const normalised = toStringOrNull(parentId);
	return normalised === null || normalised === '0';
}

/**
 * TimeCamp returns tasks as an object keyed by task id, but some responses use
 * a plain array. Accepting both avoids an empty result on an otherwise valid
 * payload.
 */
function toTaskList(payload: unknown): Record<string, unknown>[] {
	if (Array.isArray(payload)) {
		return payload.filter(
			(t): t is Record<string, unknown> => t !== null && typeof t === 'object',
		);
	}
	if (payload && typeof payload === 'object') {
		return Object.values(payload as Record<string, unknown>).filter(
			(t): t is Record<string, unknown> => t !== null && typeof t === 'object',
		);
	}
	return [];
}

function toProject(task: Record<string, unknown>): TimecampProject | null {
	const taskId = toStringOrNull(task.task_id);
	if (!taskId) return null;

	return {
		task_id: taskId,
		name: toStringOrNull(task.name) ?? '',
		archived: toBoolean(task.archived),
		color: toStringOrNull(task.color),
		billable: task.billable === undefined ? null : toBoolean(task.billable),
		budgeted: toNumberOrNull(task.budgeted),
		budget_unit: toStringOrNull(task.budget_unit),
		note: toStringOrNull(task.note),
		add_date: toStringOrNull(task.add_date),
		edit_date: toStringOrNull(task.edit_date),
		root_group_id: toStringOrNull(task.root_group_id),
		assigned_users: toUserIds(task.users),
	};
}

/**
 * Lists TimeCamp projects — the root-level tasks in the account.
 *
 * TimeCamp has no projects endpoint; `/tasks` returns the whole task tree and
 * projects are the entries without a parent, so the filtering happens here.
 */
export const getList: TimecampEndpoints['getProjectsList'] = async (
	ctx,
	input,
) => {
	const raw = await makeTimecampRequest<unknown>('tasks', ctx.key);

	const projects = toTaskList(raw)
		.filter((task) => isRootLevel(task.parent_id))
		.map(toProject)
		.filter((project): project is TimecampProject => project !== null)
		.filter((project) => input.include_archived || !project.archived);

	if (ctx.db.projects) {
		for (const project of projects) {
			try {
				await ctx.db.projects.upsertByEntityId(project.task_id, {
					id: project.task_id,
					name: project.name,
					archived: project.archived,
					color: project.color ?? undefined,
					billable: project.billable ?? undefined,
					budgeted: project.budgeted ?? undefined,
					budget_unit: project.budget_unit ?? undefined,
					root_group_id: project.root_group_id ?? undefined,
					assigned_users: project.assigned_users,
				});
			} catch (error) {
				// Caching is best-effort; it must not fail the read it mirrors.
				console.warn('Failed to cache TimeCamp project:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'timecamp.projects.getList',
		{ ...input },
		'completed',
	);

	return { projects, count: projects.length };
};
