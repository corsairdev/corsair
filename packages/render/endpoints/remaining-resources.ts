import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';
import { renderPathParameter } from './path';

type Context = { key: string };
type Input = Record<string, unknown>;

const request = <T>(
	ctx: Context,
	template: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	input: Input,
) => {
	const { id, body, ...values } = input;
	const path = template.includes('{id}')
		? renderPathParameter(template, 'id', id)
		: template;
	const requestBody =
		body ??
		(Object.keys(values).length > 0
			? (values as Record<string, unknown>)
			: undefined);
	return makeRenderRequest<T>(path, ctx.key, {
		method,
		body:
			method === 'GET' || method === 'DELETE'
				? undefined
				: (requestBody as Record<string, unknown> | unknown[] | undefined),
		query:
			method === 'GET'
				? (values as Record<
						string,
						string | number | boolean | string[] | undefined
					>)
				: undefined,
	});
};

export const validateBlueprint: RenderEndpoints['validateBlueprint'] = (
	ctx,
	input,
) => request(ctx, '/v1/blueprints/validate', 'POST', input);
export const retrieveBlueprint: RenderEndpoints['retrieveBlueprint'] = (
	ctx,
	input,
) => request(ctx, '/v1/blueprints/{id}', 'GET', input);
export const updateBlueprint: RenderEndpoints['updateBlueprint'] = (
	ctx,
	input,
) => request(ctx, '/v1/blueprints/{id}', 'PATCH', input);

export const listDedicatedIps: RenderEndpoints['listDedicatedIps'] = (
	ctx,
	input,
) => request(ctx, '/v1/dedicated-ips', 'GET', input);
export const createDedicatedIp: RenderEndpoints['createDedicatedIp'] = (
	ctx,
	input,
) => request(ctx, '/v1/dedicated-ips', 'POST', input);
export const retrieveDedicatedIp: RenderEndpoints['retrieveDedicatedIp'] = (
	ctx,
	input,
) => request(ctx, '/v1/dedicated-ips/{id}', 'GET', input);
export const updateDedicatedIp: RenderEndpoints['updateDedicatedIp'] = (
	ctx,
	input,
) => request(ctx, '/v1/dedicated-ips/{id}', 'PATCH', input);
export const deleteDedicatedIp: RenderEndpoints['deleteDedicatedIp'] = (
	ctx,
	input,
) => request(ctx, '/v1/dedicated-ips/{id}', 'DELETE', input);

export const deletePostgres: RenderEndpoints['deletePostgres'] = (ctx, input) =>
	request(ctx, '/v1/postgres/{id}', 'DELETE', input);
export const createPostgresExport: RenderEndpoints['createPostgresExport'] = (
	ctx,
	input,
) => request(ctx, '/v1/postgres/{id}/export', 'POST', input);
export const createPostgresUser: RenderEndpoints['createPostgresUser'] = (
	ctx,
	input,
) => request(ctx, '/v1/postgres/{id}/credentials', 'POST', input);
export const listPostgresProcesses: RenderEndpoints['listPostgresProcesses'] = (
	ctx,
	input,
) => request(ctx, '/v1/postgres/{id}/query/processes', 'GET', input);
export const listPostgresTopQueries: RenderEndpoints['listPostgresTopQueries'] =
	(ctx, input) =>
		request(ctx, '/v1/postgres/{id}/query/top-queries', 'GET', input);
export const listPostgresSizes: RenderEndpoints['listPostgresSizes'] = (
	ctx,
	input,
) => request(ctx, '/v1/postgres/{id}/query/sizes', 'GET', input);
export const listPostgresTableScans: RenderEndpoints['listPostgresTableScans'] =
	(ctx, input) =>
		request(ctx, '/v1/postgres/{id}/query/table-scans', 'GET', input);

export const createWorkflow: RenderEndpoints['createWorkflow'] = (ctx, input) =>
	request(ctx, '/v1/workflows', 'POST', input);
export const retrieveWorkflow: RenderEndpoints['retrieveWorkflow'] = (
	ctx,
	input,
) => request(ctx, '/v1/workflows/{id}', 'GET', input);
export const updateWorkflow: RenderEndpoints['updateWorkflow'] = (ctx, input) =>
	request(ctx, '/v1/workflows/{id}', 'PATCH', input);
export const deleteWorkflow: RenderEndpoints['deleteWorkflow'] = (ctx, input) =>
	request(ctx, '/v1/workflows/{id}', 'DELETE', input);
export const createWorkflowVersion: RenderEndpoints['createWorkflowVersion'] = (
	ctx,
	input,
) => request(ctx, '/v1/workflowversions', 'POST', input);
export const retrieveWorkflowVersion: RenderEndpoints['retrieveWorkflowVersion'] =
	(ctx, input) => request(ctx, '/v1/workflowversions/{id}', 'GET', input);
export const retrieveTask: RenderEndpoints['retrieveTask'] = (ctx, input) =>
	request(ctx, '/v1/tasks/{id}', 'GET', input);
export const createTaskRun: RenderEndpoints['createTaskRun'] = (ctx, input) =>
	request(ctx, '/v1/task-runs', 'POST', input);
export const retrieveTaskRun: RenderEndpoints['retrieveTaskRun'] = (
	ctx,
	input,
) => request(ctx, '/v1/task-runs/{id}', 'GET', input);
export const cancelTaskRun: RenderEndpoints['cancelTaskRun'] = (ctx, input) =>
	request(ctx, '/v1/task-runs/{id}', 'DELETE', input);
