import { isRenderJsonBody, makeRenderRequest } from '../client';
import type { RenderEndpoints } from '../index';
import { renderPathParameter } from './path';

type Context = { key: string };
// Stricter typing is not feasible for this shared adapter because the
// sub-resource operations use different provider-specific request bodies.
// unknown: each operation's schema validates its payload before this point.
type Input = Record<string, unknown>;

/**
 * Fills every `{name}` in the template from the input field of the same name
 * (encoded and checked by renderPathParameter). The remaining fields become
 * the query (GET) or the JSON body; a `body` field is sent as the raw body.
 * `commaSeparated` lists the query filters Render declares as
 * `style: form, explode: false`, which take one comma-separated value.
 */
const call = <T>(
	ctx: Context,
	template: string,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	input: Input,
	commaSeparated: readonly string[] = [],
) => {
	const pathNames = [...template.matchAll(/\{(\w+)\}/g)].map(
		([, name]) => name ?? '',
	);
	const path = pathNames.reduce(
		(current, name) => renderPathParameter(current, name, input[name]),
		template,
	);
	const values = Object.fromEntries(
		Object.entries(input)
			.filter(([name]) => !pathNames.includes(name))
			.map(([name, value]) => [
				name,
				commaSeparated.includes(name) && Array.isArray(value)
					? value.join(',')
					: value,
			]),
	);
	const body = 'body' in values ? values.body : values;
	return makeRenderRequest<T>(path, ctx.key, {
		method,
		body:
			method === 'GET' || method === 'DELETE' || !isRenderJsonBody(body)
				? undefined
				: body,
		query: method === 'GET' ? values : undefined,
	});
};

export const addHeaders: RenderEndpoints['addHeaders'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/headers', 'POST', input);
export const addOrUpdateSecretFile: RenderEndpoints['addOrUpdateSecretFile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'/v1/services/{serviceId}/secret-files/{secretFileName}',
		'PUT',
		input,
	);
export const addResourcesToEnvironment: RenderEndpoints['addResourcesToEnvironment'] =
	(ctx, input) =>
		call(ctx, '/v1/environments/{environmentId}/resources', 'POST', input);
export const addRoute: RenderEndpoints['addRoute'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/routes', 'POST', input);
export const createCustomDomain: RenderEndpoints['createCustomDomain'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{serviceId}/custom-domains', 'POST', input);
export const deleteEnvGroupEnvVar: RenderEndpoints['deleteEnvGroupEnvVar'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'/v1/env-groups/{envGroupId}/env-vars/{envVarKey}',
		'DELETE',
		input,
	);
export const deleteEnvGroupSecretFile: RenderEndpoints['deleteEnvGroupSecretFile'] =
	(ctx, input) =>
		call(
			ctx,
			'/v1/env-groups/{envGroupId}/secret-files/{secretFileName}',
			'DELETE',
			input,
		);
export const deleteKeyValue: RenderEndpoints['deleteKeyValue'] = (ctx, input) =>
	call(ctx, '/v1/key-value/{id}', 'DELETE', input);
export const deleteSecretFile: RenderEndpoints['deleteSecretFile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'/v1/services/{serviceId}/secret-files/{secretFileName}',
		'DELETE',
		input,
	);
export const disconnectBlueprint: RenderEndpoints['disconnectBlueprint'] = (
	ctx,
	input,
) => call(ctx, '/v1/blueprints/{id}', 'DELETE', input);
export const listBlueprintSyncs: RenderEndpoints['listBlueprintSyncs'] = (
	ctx,
	input,
) => call(ctx, '/v1/blueprints/{id}/syncs', 'GET', input);
// Render Key Value lifecycle triggers return 202 with no request body.
export const suspendKeyValue: RenderEndpoints['suspendKeyValue'] = (
	ctx,
	input,
) =>
	makeRenderRequest(
		renderPathParameter('/v1/key-value/{id}/suspend', 'id', input.id),
		ctx.key,
		{ method: 'POST', body: undefined },
	);
export const resumeKeyValue: RenderEndpoints['resumeKeyValue'] = (ctx, input) =>
	makeRenderRequest(
		renderPathParameter('/v1/key-value/{id}/resume', 'id', input.id),
		ctx.key,
		{ method: 'POST', body: undefined },
	);
export const retrieveKeyValueConnectionInfo: RenderEndpoints['retrieveKeyValueConnectionInfo'] =
	(ctx, input) => call(ctx, '/v1/key-value/{id}/connection-info', 'GET', input);
export const linkServiceToEnvGroup: RenderEndpoints['linkServiceToEnvGroup'] = (
	ctx,
	input,
) =>
	call(ctx, '/v1/env-groups/{envGroupId}/services/{serviceId}', 'POST', input);
export const listBlueprints: RenderEndpoints['listBlueprints'] = (ctx, input) =>
	call(ctx, '/v1/blueprints', 'GET', input, ['ownerId']);
export const listInstances: RenderEndpoints['listInstances'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/instances', 'GET', input);
export const listKeyValue: RenderEndpoints['listKeyValue'] = (ctx, input) =>
	call(ctx, '/v1/key-value', 'GET', input, [
		'name',
		'region',
		'ownerId',
		'environmentId',
	]);
export const createKeyValue: RenderEndpoints['createKeyValue'] = (ctx, input) =>
	makeRenderRequest('/v1/key-value', ctx.key, { method: 'POST', body: input });
export const retrieveKeyValue: RenderEndpoints['retrieveKeyValue'] = (
	ctx,
	input,
) =>
	makeRenderRequest(
		renderPathParameter('/v1/key-value/{redisId}', 'redisId', input.redisId),
		ctx.key,
		{ method: 'GET' },
	);
export const updateKeyValue: RenderEndpoints['updateKeyValue'] = (
	ctx,
	input,
) => {
	const { redisId, ...body } = input;
	return makeRenderRequest(
		renderPathParameter('/v1/key-value/{redisId}', 'redisId', redisId),
		ctx.key,
		{ method: 'PATCH', body },
	);
};
export const listNotificationOverrides: RenderEndpoints['listNotificationOverrides'] =
	(ctx, input) =>
		call(ctx, '/v1/notification-settings/overrides', 'GET', input, ['ownerId']);
export const retrieveServiceNotificationOverrides: RenderEndpoints['retrieveServiceNotificationOverrides'] =
	(ctx, input) =>
		call(
			ctx,
			'/v1/notification-settings/overrides/services/{serviceId}',
			'GET',
			input,
		);
export const listPostgresExport: RenderEndpoints['listPostgresExport'] = (
	ctx,
	input,
) => call(ctx, '/v1/postgres/{id}/export', 'GET', input);
export const listPostgresUsers: RenderEndpoints['listPostgresUsers'] = (
	ctx,
	input,
) => call(ctx, '/v1/postgres/{id}/credentials', 'GET', input);
export const listRoutes: RenderEndpoints['listRoutes'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/routes', 'GET', input, [
		'type',
		'source',
		'destination',
	]);
export const listSecretFiles: RenderEndpoints['listSecretFiles'] = (
	ctx,
	input,
) => call(ctx, '/v1/services/{serviceId}/secret-files', 'GET', input);
export const retrieveCustomDomain: RenderEndpoints['retrieveCustomDomain'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'/v1/services/{serviceId}/custom-domains/{customDomainNameOrID}',
		'GET',
		input,
	);
export const retrieveDeploy: RenderEndpoints['retrieveDeploy'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/deploys/{deployId}', 'GET', input);
export const retrieveEnvGroupEnvVar: RenderEndpoints['retrieveEnvGroupEnvVar'] =
	(ctx, input) =>
		call(ctx, '/v1/env-groups/{envGroupId}/env-vars/{envVarKey}', 'GET', input);
export const retrieveEnvGroupSecretFile: RenderEndpoints['retrieveEnvGroupSecretFile'] =
	(ctx, input) =>
		call(
			ctx,
			'/v1/env-groups/{envGroupId}/secret-files/{secretFileName}',
			'GET',
			input,
		);
export const retrieveEnvVar: RenderEndpoints['retrieveEnvVar'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/env-vars/{envVarKey}', 'GET', input);
export const retrieveOwnerNotificationSettings: RenderEndpoints['retrieveOwnerNotificationSettings'] =
	(ctx, input) =>
		call(ctx, '/v1/notification-settings/owners/{ownerId}', 'GET', input);
export const retrieveSecretFile: RenderEndpoints['retrieveSecretFile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'/v1/services/{serviceId}/secret-files/{secretFileName}',
		'GET',
		input,
	);
export const updateEnvGroupEnvVar: RenderEndpoints['updateEnvGroupEnvVar'] = (
	ctx,
	input,
) =>
	call(ctx, '/v1/env-groups/{envGroupId}/env-vars/{envVarKey}', 'PUT', input);
export const updateEnvGroupSecretFile: RenderEndpoints['updateEnvGroupSecretFile'] =
	(ctx, input) =>
		call(
			ctx,
			'/v1/env-groups/{envGroupId}/secret-files/{secretFileName}',
			'PUT',
			input,
		);
export const updateEnvVar: RenderEndpoints['updateEnvVar'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/env-vars/{envVarKey}', 'PUT', input);
export const updateEnvVarsForService: RenderEndpoints['updateEnvVarsForService'] =
	(ctx, input) => call(ctx, '/v1/services/{serviceId}/env-vars', 'PUT', input);
export const updateHeaders: RenderEndpoints['updateHeaders'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/headers', 'PUT', input);
export const updateResourceLogStream: RenderEndpoints['updateResourceLogStream'] =
	(ctx, input) =>
		call(ctx, '/v1/logs/streams/resource/{resourceId}', 'PUT', input);
export const updateSecretFilesForService: RenderEndpoints['updateSecretFilesForService'] =
	(ctx, input) =>
		call(ctx, '/v1/services/{serviceId}/secret-files', 'PUT', input);
export const verifyCustomDomain: RenderEndpoints['verifyCustomDomain'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'/v1/services/{serviceId}/custom-domains/{customDomainNameOrID}/verify',
		'POST',
		input,
	);
export const deleteOwnerMetricsStream: RenderEndpoints['deleteOwnerMetricsStream'] =
	(ctx, input) => call(ctx, '/v1/metrics-stream/{ownerId}', 'DELETE', input);
export const retrieveOwnerMetricsStream: RenderEndpoints['retrieveOwnerMetricsStream'] =
	(ctx, input) =>
		makeRenderRequest(
			renderPathParameter(
				'/v1/metrics-stream/{ownerId}',
				'ownerId',
				input.ownerId,
			),
			ctx.key,
			{ method: 'GET' },
		);
export const upsertOwnerMetricsStream: RenderEndpoints['upsertOwnerMetricsStream'] =
	(ctx, input) => {
		const { ownerId, ...body } = input;
		return makeRenderRequest(
			renderPathParameter('/v1/metrics-stream/{ownerId}', 'ownerId', ownerId),
			ctx.key,
			{ method: 'PUT', body },
		);
	};
export const updateOwnerNotificationSettings: RenderEndpoints['updateOwnerNotificationSettings'] =
	(ctx, input) =>
		call(ctx, '/v1/notification-settings/owners/{ownerId}', 'PATCH', input);
export const updateServiceNotificationOverrides: RenderEndpoints['updateServiceNotificationOverrides'] =
	(ctx, input) =>
		call(
			ctx,
			'/v1/notification-settings/overrides/services/{serviceId}',
			'PATCH',
			input,
		);
export const updateRoutes: RenderEndpoints['updateRoutes'] = (ctx, input) =>
	call(ctx, '/v1/services/{serviceId}/routes', 'PUT', input);
