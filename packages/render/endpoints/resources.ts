import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';

type Context = { key: string };
// Resource operations share identifiers while preserving provider-specific fields.
type Input = Record<string, unknown>;

const request = <T>(
	ctx: Context,
	template: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	input: Input,
) => {
	const { id, ...values } = input;
	const path = template.replace('{id}', encodeURIComponent(String(id ?? '')));
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
