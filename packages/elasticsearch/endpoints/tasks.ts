import type { ElasticsearchEndpoints } from '..';
import { call, pickQuery } from './call';

// actions/nodes take a string-or-list; the wire form is comma-joined.
const joinList = (value: string | string[]): string =>
	Array.isArray(value) ? value.join(',') : value;

export const list: ElasticsearchEndpoints['tasksList'] = (ctx, input) =>
	call(ctx, 'tasksList', 'tasks.list', input, {
		path: () => '/_tasks',
		query: (parsed) => ({
			...pickQuery(parsed, [
				'parent_task_id',
				'detailed',
				'group_by',
				'wait_for_completion',
				'timeout',
			]),
			actions:
				parsed.actions === undefined ? undefined : joinList(parsed.actions),
			nodes: parsed.nodes === undefined ? undefined : joinList(parsed.nodes),
		}),
	});

export const get: ElasticsearchEndpoints['tasksGet'] = (ctx, input) =>
	call(ctx, 'tasksGet', 'tasks.get', input, {
		path: (parsed) => `/_tasks/${encodeURIComponent(parsed.task_id)}`,
		query: (parsed) => pickQuery(parsed, ['wait_for_completion', 'timeout']),
	});

export const cancel: ElasticsearchEndpoints['tasksCancel'] = (ctx, input) =>
	call(ctx, 'tasksCancel', 'tasks.cancel', input, {
		method: 'POST',
		path: (parsed) => `/_tasks/${encodeURIComponent(parsed.task_id)}/_cancel`,
		query: (parsed) => ({
			...pickQuery(parsed, ['parent_task_id', 'wait_for_completion']),
			actions:
				parsed.actions === undefined ? undefined : joinList(parsed.actions),
			nodes: parsed.nodes === undefined ? undefined : joinList(parsed.nodes),
		}),
	});
