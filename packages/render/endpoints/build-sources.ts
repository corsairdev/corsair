import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';
import { renderPathParameter } from './path';

type Context = { key: string };
// Stricter typing is not feasible because Build Source operations accept
// provider-defined object and replacement-array bodies. Endpoint schemas
// validate each operation before this shared adapter receives the input.
type Input = Record<string, unknown>;

const request = <T>(
	ctx: Context,
	template: string,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	input: Input,
) => {
	const { buildSourceId, buildId, envVarKey, envGroupId, body, ...values } =
		input;
	let path = template;
	if (path.includes('{buildSourceId}')) {
		path = renderPathParameter(path, 'buildSourceId', buildSourceId);
	}
	if (path.includes('{buildId}')) {
		path = renderPathParameter(path, 'buildId', buildId);
	}
	if (path.includes('{envVarKey}')) {
		path = renderPathParameter(path, 'envVarKey', envVarKey);
	}
	if (path.includes('{envGroupId}')) {
		path = renderPathParameter(path, 'envGroupId', envGroupId);
	}
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

export const createBuildSource: RenderEndpoints['createBuildSource'] = (
	ctx,
	input,
) => request(ctx, '/v1/build-sources', 'POST', input);
export const listBuildSources: RenderEndpoints['listBuildSources'] = (
	ctx,
	input,
) => request(ctx, '/v1/build-sources', 'GET', input);
export const retrieveBuildSource: RenderEndpoints['retrieveBuildSource'] = (
	ctx,
	input,
) => request(ctx, '/v1/build-sources/{buildSourceId}', 'GET', input);
export const updateBuildSource: RenderEndpoints['updateBuildSource'] = (
	ctx,
	input,
) => request(ctx, '/v1/build-sources/{buildSourceId}', 'PATCH', input);
export const deleteBuildSource: RenderEndpoints['deleteBuildSource'] = (
	ctx,
	input,
) => request(ctx, '/v1/build-sources/{buildSourceId}', 'DELETE', input);
export const listBuildSourceBuilds: RenderEndpoints['listBuildSourceBuilds'] = (
	ctx,
	input,
) => request(ctx, '/v1/build-sources/{buildSourceId}/builds', 'GET', input);
export const triggerBuildSourceBuild: RenderEndpoints['triggerBuildSourceBuild'] =
	(ctx, input) =>
		request(ctx, '/v1/build-sources/{buildSourceId}/builds', 'POST', input);
export const retrieveBuildSourceBuild: RenderEndpoints['retrieveBuildSourceBuild'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/builds/{buildId}',
			'GET',
			input,
		);
export const listBuildSourceEnvVars: RenderEndpoints['listBuildSourceEnvVars'] =
	(ctx, input) =>
		request(ctx, '/v1/build-sources/{buildSourceId}/env-vars', 'GET', input);
export const updateBuildSourceEnvVars: RenderEndpoints['updateBuildSourceEnvVars'] =
	(ctx, input) =>
		request(ctx, '/v1/build-sources/{buildSourceId}/env-vars', 'PUT', input);
export const retrieveBuildSourceEnvVar: RenderEndpoints['retrieveBuildSourceEnvVar'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/env-vars/{envVarKey}',
			'GET',
			input,
		);
export const updateBuildSourceEnvVar: RenderEndpoints['updateBuildSourceEnvVar'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/env-vars/{envVarKey}',
			'PUT',
			input,
		);
export const deleteBuildSourceEnvVar: RenderEndpoints['deleteBuildSourceEnvVar'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/env-vars/{envVarKey}',
			'DELETE',
			input,
		);
export const listBuildSourceSecretFiles: RenderEndpoints['listBuildSourceSecretFiles'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/secret-files',
			'GET',
			input,
		);
export const updateBuildSourceSecretFiles: RenderEndpoints['updateBuildSourceSecretFiles'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/secret-files',
			'PUT',
			input,
		);
export const retrieveBuildSourceSecretFile: RenderEndpoints['retrieveBuildSourceSecretFile'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/secret-files/{envVarKey}',
			'GET',
			input,
		);
export const updateBuildSourceSecretFile: RenderEndpoints['updateBuildSourceSecretFile'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/secret-files/{envVarKey}',
			'PUT',
			input,
		);
export const deleteBuildSourceSecretFile: RenderEndpoints['deleteBuildSourceSecretFile'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/secret-files/{envVarKey}',
			'DELETE',
			input,
		);
export const linkEnvGroupToBuildSource: RenderEndpoints['linkEnvGroupToBuildSource'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/env-groups/{envGroupId}',
			'POST',
			input,
		);
export const unlinkEnvGroupFromBuildSource: RenderEndpoints['unlinkEnvGroupFromBuildSource'] =
	(ctx, input) =>
		request(
			ctx,
			'/v1/build-sources/{buildSourceId}/env-groups/{envGroupId}',
			'DELETE',
			input,
		);
