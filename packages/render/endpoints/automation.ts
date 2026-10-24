import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';

type Context = { key: string };
// Stricter typing is not feasible for this shared adapter because each Render
// automation operation has different provider-specific query filters.
// unknown: the operation schemas validate these provider-specific fields.
type Input = Record<string, unknown>;

const get = <T>(ctx: Context, path: string, input: Input) =>
	makeRenderRequest<T>(path, ctx.key, {
		method: 'GET',
		query: input as Record<
			string,
			string | number | boolean | string[] | undefined
		>,
	});

export const listDisks: RenderEndpoints['listDisks'] = (ctx, input) =>
	get(ctx, '/v1/disks', input);
export const listMaintenance: RenderEndpoints['listMaintenance'] = (
	ctx,
	input,
) => get(ctx, '/v1/maintenance', input);
export const listTaskRuns: RenderEndpoints['listTaskRuns'] = (ctx, input) =>
	get(ctx, '/v1/task-runs', input);
export const listTasks: RenderEndpoints['listTasks'] = (ctx, input) =>
	get(ctx, '/v1/tasks', input);
export const streamTaskRunsEvents: RenderEndpoints['streamTaskRunsEvents'] = (
	ctx,
	input,
) => get(ctx, '/v1/task-runs/events', input);
export const listWorkflows: RenderEndpoints['listWorkflows'] = (ctx, input) =>
	get(ctx, '/v1/workflows', input);
export const listWorkflowVersions: RenderEndpoints['listWorkflowVersions'] = (
	ctx,
	input,
) => get(ctx, '/v1/workflowversions', input);
export const listWebhooks: RenderEndpoints['listWebhooks'] = (ctx, input) =>
	get(ctx, '/v1/webhooks', input);
