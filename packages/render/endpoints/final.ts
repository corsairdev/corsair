import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';

type Context = { key: string };
// Stricter typing is not feasible for this shared adapter because final
// operations use different provider-specific request bodies.
// unknown: the operation schemas validate each final operation payload.
type Input = Record<string, unknown>;

const replacePathParameter = (
	template: string,
	name: 'id' | 'key' | 'serviceId',
	value: unknown,
) => {
	if (typeof value !== 'string' || value.length === 0 || value === '.' || value === '..' || /[\\/]/.test(value)) {
		throw new Error(`Invalid Render ${name}`);
	}
	return template.replace(`{${name}}`, encodeURIComponent(value));
};

const call = <T>(
	ctx: Context,
	template: string,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	input: Input,
) => {
	const { id, key, serviceId, ...values } = input;
	let path = template;
	if (path.includes('{id}')) path = replacePathParameter(path, 'id', id);
	if (path.includes('{key}')) path = replacePathParameter(path, 'key', key);
	if (path.includes('{serviceId}')) {
		path = replacePathParameter(path, 'serviceId', serviceId);
	}
	const body =
		'body' in values
			? (values.body as Record<string, unknown> | unknown[])
			: values;
	return makeRenderRequest<T>(path, ctx.key, {
		method,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		query:
			method === 'GET'
				? (values as Record<
						string,
						string | number | boolean | string[] | undefined
					>)
				: undefined,
	});
};

export const addHeaders: RenderEndpoints['addHeaders'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/headers', 'POST', input);
export const addOrUpdateSecretFile: RenderEndpoints['addOrUpdateSecretFile'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{id}/secret-files/{key}', 'PUT', input);
export const addResourcesToEnvironment: RenderEndpoints['addResourcesToEnvironment'] =
	(ctx, input) => call(ctx, '/v1/environments/{id}/resources', 'POST', input);
export const addRoute: RenderEndpoints['addRoute'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/routes', 'POST', input);
export const createCustomDomain: RenderEndpoints['createCustomDomain'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{id}/custom-domains', 'POST', input);
export const deleteEnvGroupEnvVar: RenderEndpoints['deleteEnvGroupEnvVar'] = (
	ctx,
	input,
) => call(ctx, '/v1/env-groups/{id}/env-vars/{key}', 'DELETE', input);
export const deleteEnvGroupSecretFile: RenderEndpoints['deleteEnvGroupSecretFile'] =
	(ctx, input) =>
		call(ctx, '/v1/env-groups/{id}/secret-files/{key}', 'DELETE', input);
export const deleteKeyValue: RenderEndpoints['deleteKeyValue'] = (ctx, input) =>
	call(ctx, '/v1/key-value/{id}', 'DELETE', input);
export const deleteSecretFile: RenderEndpoints['deleteSecretFile'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{id}/secret-files/{key}', 'DELETE', input);
export const disconnectBlueprint: RenderEndpoints['disconnectBlueprint'] = (
	ctx,
	input,
) => call(ctx, '/v1/blueprints/{id}', 'DELETE', input);
export const linkServiceToEnvGroup: RenderEndpoints['linkServiceToEnvGroup'] = (
	ctx,
	input,
) => call(ctx, '/v1/env-groups/{id}/services/{serviceId}', 'POST', input);
export const listBlueprints: RenderEndpoints['listBlueprints'] = (ctx, input) =>
	call(ctx, '/v1/blueprints', 'GET', input);
export const listInstances: RenderEndpoints['listInstances'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/instances', 'GET', input);
export const listKeyValue: RenderEndpoints['listKeyValue'] = (ctx, input) =>
	call(ctx, '/v1/key-value', 'GET', input);
export const listNotificationOverrides: RenderEndpoints['listNotificationOverrides'] =
	(ctx, input) =>
		call(ctx, '/v1/notification-settings/overrides', 'GET', input);
export const listPostgresExport: RenderEndpoints['listPostgresExport'] = (
	ctx,
	input,
) => call(ctx, '/v1/postgres/{id}/export', 'GET', input);
export const listPostgresUsers: RenderEndpoints['listPostgresUsers'] = (
	ctx,
	input,
) => call(ctx, '/v1/postgres/{id}/credentials', 'GET', input);
export const listRoutes: RenderEndpoints['listRoutes'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/routes', 'GET', input);
export const listSecretFiles: RenderEndpoints['listSecretFiles'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{id}/secret-files', 'GET', input);
export const retrieveCustomDomain: RenderEndpoints['retrieveCustomDomain'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{id}/custom-domains/{key}', 'GET', input);
export const retrieveDeploy: RenderEndpoints['retrieveDeploy'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/deploys/{key}', 'GET', input);
export const retrieveEnvGroupEnvVar: RenderEndpoints['retrieveEnvGroupEnvVar'] =
	(ctx, input) => call(ctx, '/v1/env-groups/{id}/env-vars/{key}', 'GET', input);
export const retrieveEnvGroupSecretFile: RenderEndpoints['retrieveEnvGroupSecretFile'] =
	(ctx, input) =>
		call(ctx, '/v1/env-groups/{id}/secret-files/{key}', 'GET', input);
export const retrieveEnvVar: RenderEndpoints['retrieveEnvVar'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/env-vars/{key}', 'GET', input);
export const retrieveOwnerNotificationSettings: RenderEndpoints['retrieveOwnerNotificationSettings'] =
	(ctx, input) =>
		call(ctx, '/v1/notification-settings/owners/{id}', 'GET', input);
export const retrieveSecretFile: RenderEndpoints['retrieveSecretFile'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{id}/secret-files/{key}', 'GET', input);
export const updateEnvGroupEnvVar: RenderEndpoints['updateEnvGroupEnvVar'] = (
	ctx,
	input,
) => call(ctx, '/v1/env-groups/{id}/env-vars/{key}', 'PUT', input);
export const updateEnvGroupSecretFile: RenderEndpoints['updateEnvGroupSecretFile'] =
	(ctx, input) =>
		call(ctx, '/v1/env-groups/{id}/secret-files/{key}', 'PUT', input);
export const updateEnvVar: RenderEndpoints['updateEnvVar'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/env-vars/{key}', 'PUT', input);
export const updateEnvVarsForService: RenderEndpoints['updateEnvVarsForService'] =
	(ctx, input) => call(ctx, '/v1/services/{id}/env-vars', 'PUT', input);
export const updateHeaders: RenderEndpoints['updateHeaders'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/headers', 'PUT', input);
export const updateResourceLogStream: RenderEndpoints['updateResourceLogStream'] =
	(ctx, input) => call(ctx, '/v1/logs/streams/resource/{id}', 'PUT', input);
export const updateSecretFilesForService: RenderEndpoints['updateSecretFilesForService'] =
	(ctx, input) => call(ctx, '/v1/services/{id}/secret-files', 'PUT', input);
export const verifyCustomDomain: RenderEndpoints['verifyCustomDomain'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{id}/custom-domains/{key}/verify', 'POST', input);
export const deleteOwnerMetricsStream: RenderEndpoints['deleteOwnerMetricsStream'] =
	(ctx, input) => call(ctx, '/v1/metrics-stream/{id}', 'DELETE', input);
export const updateOwnerNotificationSettings: RenderEndpoints['updateOwnerNotificationSettings'] =
	(ctx, input) =>
		call(ctx, '/v1/notification-settings/owners/{id}', 'PATCH', input);
export const updateRoutes: RenderEndpoints['updateRoutes'] = (ctx, input) =>
	call(ctx, '/v1/services/{id}/routes', 'PUT', input);
