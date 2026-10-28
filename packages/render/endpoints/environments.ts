import { makeRenderRequest } from '../client';
import type { RenderEndpoints } from '../index';
import { renderPathParameter } from './path';

type ResourceContext = { key: string };
// Stricter typing is not feasible for this shared adapter because Render
// environment operations use different request and query fields.
// unknown: the operation schemas validate each environment payload.
type ResourceInput = Record<string, unknown>;

const request = <T>(
	ctx: ResourceContext,
	path: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	input: ResourceInput,
) => {
	const { id, ...values } = input;
	const resolvedPath = path.includes('{id}')
		? renderPathParameter(path, 'id', id)
		: path;
	return makeRenderRequest<T>(resolvedPath, ctx.key, {
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

export const listEnvironments: RenderEndpoints['listEnvironments'] = (
	ctx,
	input,
) => request(ctx, '/v1/environments', 'GET', input);
export const createEnvironment: RenderEndpoints['createEnvironment'] = (
	ctx,
	input,
) => request(ctx, '/v1/environments', 'POST', input);
export const retrieveEnvironment: RenderEndpoints['retrieveEnvironment'] = (
	ctx,
	input,
) => request(ctx, '/v1/environments/{id}', 'GET', input);
export const updateEnvironment: RenderEndpoints['updateEnvironment'] = (
	ctx,
	input,
) => request(ctx, '/v1/environments/{id}', 'PATCH', input);
export const deleteEnvironment: RenderEndpoints['deleteEnvironment'] = (
	ctx,
	input,
) => request(ctx, '/v1/environments/{id}', 'DELETE', input);
export const removeResourcesFromEnvironment: RenderEndpoints['removeResourcesFromEnvironment'] =
	(ctx, input) => {
		const { environmentId, resourceIds } = input;
		return makeRenderRequest(
			renderPathParameter(
				'/v1/environments/{environmentId}/resources',
				'environmentId',
				environmentId,
			),
			ctx.key,
			{ method: 'DELETE', query: { resourceIds } },
		);
	};
export const listEnvGroups: RenderEndpoints['listEnvGroups'] = (ctx, input) =>
	request(ctx, '/v1/env-groups', 'GET', input);
export const createEnvGroup: RenderEndpoints['createEnvGroup'] = (ctx, input) =>
	request(ctx, '/v1/env-groups', 'POST', input);
export const retrieveEnvGroup: RenderEndpoints['retrieveEnvGroup'] = (
	ctx,
	input,
) => request(ctx, '/v1/env-groups/{id}', 'GET', input);
export const updateEnvGroup: RenderEndpoints['updateEnvGroup'] = (ctx, input) =>
	request(ctx, '/v1/env-groups/{id}', 'PATCH', input);
export const deleteEnvGroup: RenderEndpoints['deleteEnvGroup'] = (ctx, input) =>
	request(ctx, '/v1/env-groups/{id}', 'DELETE', input);
export const unlinkServiceFromEnvGroup: RenderEndpoints['unlinkServiceFromEnvGroup'] =
	(ctx, input) => {
		const path = renderPathParameter(
			renderPathParameter(
				'/v1/env-groups/{envGroupId}/services/{serviceId}',
				'envGroupId',
				input.envGroupId,
			),
			'serviceId',
			input.serviceId,
		);
		return makeRenderRequest(path, ctx.key, { method: 'DELETE' });
	};
