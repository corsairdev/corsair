import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';
import { renderPathParameter } from './path';

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

const request = <T>(
	ctx: Context,
	template: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	input: Input,
) => {
	const { id, ...values } = input;
	const path = template.includes('{id}')
		? renderPathParameter(template, 'id', id)
		: template;
	return makeRenderRequest<T>(path, ctx.key, {
		method,
		body: method === 'GET' || method === 'DELETE' ? undefined : values,
		query:
			method === 'GET'
				? (values as Record<
						string,
						string | number | boolean | string[] | undefined
					>)
				: undefined,
	});
};

// Render lifecycle triggers return 202 with no request body.
const postWithoutBody = (ctx: Context, template: string, input: Input) => {
	const { id } = input;
	return makeRenderRequest(renderPathParameter(template, 'id', id), ctx.key, {
		method: 'POST',
		body: undefined,
	});
};

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
) =>
	makeRenderRequest<string>('/v1/task-runs/events', ctx.key, {
		method: 'GET',
		query: input as Record<
			string,
			string | number | boolean | string[] | undefined
		>,
		headers: { Accept: 'text/event-stream' },
		mediaType: 'text/event-stream',
	}).then((data) => ({ data }));
export const listWorkflows: RenderEndpoints['listWorkflows'] = (ctx, input) =>
	get(ctx, '/v1/workflows', input);
export const listWorkflowVersions: RenderEndpoints['listWorkflowVersions'] = (
	ctx,
	input,
) => get(ctx, '/v1/workflowversions', input);
export const listWebhooks: RenderEndpoints['listWebhooks'] = (ctx, input) =>
	get(ctx, '/v1/webhooks', input);
export const createDisk: RenderEndpoints['createDisk'] = (ctx, input) =>
	request(ctx, '/v1/disks', 'POST', input);
export const retrieveDisk: RenderEndpoints['retrieveDisk'] = (ctx, input) =>
	request(ctx, '/v1/disks/{id}', 'GET', input);
export const updateDisk: RenderEndpoints['updateDisk'] = (ctx, input) =>
	request(ctx, '/v1/disks/{id}', 'PATCH', input);
export const deleteDisk: RenderEndpoints['deleteDisk'] = (ctx, input) =>
	request(ctx, '/v1/disks/{id}', 'DELETE', input);
export const listDiskSnapshots: RenderEndpoints['listDiskSnapshots'] = (
	ctx,
	input,
) => request(ctx, '/v1/disks/{id}/snapshots', 'GET', input);
export const restoreDiskSnapshot: RenderEndpoints['restoreDiskSnapshot'] = (
	ctx,
	input,
) => request(ctx, '/v1/disks/{id}/snapshots/restore', 'POST', input);
export const retrieveMaintenance: RenderEndpoints['retrieveMaintenance'] = (
	ctx,
	input,
) => request(ctx, '/v1/maintenance/{id}', 'GET', input);
export const updateMaintenance: RenderEndpoints['updateMaintenance'] = (
	ctx,
	input,
) => request(ctx, '/v1/maintenance/{id}', 'PATCH', input);
export const triggerMaintenance: RenderEndpoints['triggerMaintenance'] = (
	ctx,
	input,
) => postWithoutBody(ctx, '/v1/maintenance/{id}/trigger', input);
export const triggerCronJobRun: RenderEndpoints['triggerCronJobRun'] = (
	ctx,
	input,
) => postWithoutBody(ctx, '/v1/cron-jobs/{id}/runs', input);
