import { makeRenderRequest } from '../client';
import type { RenderEndpoints } from '../index';
import { renderPathParameter } from './path';

type Context = { key: string };
// Stricter typing is not feasible because resource operations share identifiers
// while preserving different provider-specific request fields.
// unknown: the operation schemas validate the concrete resource payloads.
type Input = Record<string, unknown>;

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

export const listProjects: RenderEndpoints['listProjects'] = (ctx, input) =>
	request(ctx, '/v1/projects', 'GET', input);
export const createProject: RenderEndpoints['createProject'] = (ctx, input) =>
	request(ctx, '/v1/projects', 'POST', input);
export const retrieveProject: RenderEndpoints['retrieveProject'] = (
	ctx,
	input,
) => request(ctx, '/v1/projects/{id}', 'GET', input);
export const updateProject: RenderEndpoints['updateProject'] = (ctx, input) =>
	request(ctx, '/v1/projects/{id}', 'PATCH', input);
export const deleteProject: RenderEndpoints['deleteProject'] = (ctx, input) =>
	request(ctx, '/v1/projects/{id}', 'DELETE', input);

export const listPostgres: RenderEndpoints['listPostgres'] = (ctx, input) =>
	request(ctx, '/v1/postgres', 'GET', input);
export const createPostgres: RenderEndpoints['createPostgres'] = (ctx, input) =>
	request(ctx, '/v1/postgres', 'POST', input);
export const retrievePostgres: RenderEndpoints['retrievePostgres'] = (
	ctx,
	input,
) => request(ctx, '/v1/postgres/{id}', 'GET', input);
export const updatePostgres: RenderEndpoints['updatePostgres'] = (ctx, input) =>
	request(ctx, '/v1/postgres/{id}', 'PATCH', input);

// Render Postgres lifecycle triggers return 202 with no request body.
const postWithoutBody = (ctx: Context, template: string, input: Input) =>
	makeRenderRequest(renderPathParameter(template, 'id', input.id), ctx.key, {
		method: 'POST',
		body: undefined,
	});

export const restartPostgres: RenderEndpoints['restartPostgres'] = (
	ctx,
	input,
) => postWithoutBody(ctx, '/v1/postgres/{id}/restart', input);
export const suspendPostgres: RenderEndpoints['suspendPostgres'] = (
	ctx,
	input,
) => postWithoutBody(ctx, '/v1/postgres/{id}/suspend', input);
export const resumePostgres: RenderEndpoints['resumePostgres'] = (ctx, input) =>
	postWithoutBody(ctx, '/v1/postgres/{id}/resume', input);
export const failoverPostgres: RenderEndpoints['failoverPostgres'] = (
	ctx,
	input,
) => postWithoutBody(ctx, '/v1/postgres/{id}/failover', input);
export const retrievePostgresConnectionInfo: RenderEndpoints['retrievePostgresConnectionInfo'] =
	(ctx, input) =>
		request(ctx, '/v1/postgres/{id}/connection-info', 'GET', input);
export const retrievePostgresRecoveryInfo: RenderEndpoints['retrievePostgresRecoveryInfo'] =
	(ctx, input) => request(ctx, '/v1/postgres/{id}/recovery', 'GET', input);
export const recoverPostgres: RenderEndpoints['recoverPostgres'] = (
	ctx,
	input,
) => request(ctx, '/v1/postgres/{id}/recovery', 'POST', input);
export const deletePostgresUser: RenderEndpoints['deletePostgresUser'] = (
	ctx,
	input,
) => {
	const path = renderPathParameter(
		'/v1/postgres/{id}/credentials/{username}',
		'username',
		input.username,
	);
	return makeRenderRequest(renderPathParameter(path, 'id', input.id), ctx.key, {
		method: 'DELETE',
		body: undefined,
	});
};

export const listRegistryCredentials: RenderEndpoints['listRegistryCredentials'] =
	(ctx, input) => request(ctx, '/v1/registrycredentials', 'GET', input);
export const createRegistryCredential: RenderEndpoints['createRegistryCredential'] =
	(ctx, input) => request(ctx, '/v1/registrycredentials', 'POST', input);
export const retrieveRegistryCredential: RenderEndpoints['retrieveRegistryCredential'] =
	(ctx, input) => request(ctx, '/v1/registrycredentials/{id}', 'GET', input);
export const updateRegistryCredential: RenderEndpoints['updateRegistryCredential'] =
	(ctx, input) => request(ctx, '/v1/registrycredentials/{id}', 'PATCH', input);
export const deleteRegistryCredential: RenderEndpoints['deleteRegistryCredential'] =
	(ctx, input) => request(ctx, '/v1/registrycredentials/{id}', 'DELETE', input);
