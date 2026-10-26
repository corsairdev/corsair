import type { RenderEndpoints } from '..';
import { makeRenderRequest } from '../client';
import { renderPathParameter } from './path';

type Context = { key: string };
// Render's generated operation inputs vary by endpoint; the shared adapter
// preserves those provider-specific fields until the endpoint schema validates them.
// Stricter typing is not feasible because observability filters vary across
// Render resources and remain open until schema validation.
// unknown: the operation schemas validate the provider-specific filters.
type Input = Record<string, unknown>;

const call = <T>(
	ctx: Context,
	template: string,
	method: 'GET' | 'PUT' | 'DELETE',
	input: Input,
) => {
	const { id, ...query } = input;
	const path = template.includes('{id}')
		? renderPathParameter(template, 'id', id)
		: template;
	return makeRenderRequest<T>(path, ctx.key, {
		method,
		body: method === 'PUT' ? query : undefined,
		query:
			method === 'GET'
				? (query as Record<
						string,
						string | number | boolean | string[] | undefined
					>)
				: undefined,
	});
};

export const listOwners: RenderEndpoints['listOwners'] = (ctx, input) =>
	call(ctx, '/v1/owners', 'GET', input);
export const retrieveOwner: RenderEndpoints['retrieveOwner'] = (ctx, input) =>
	call(ctx, '/v1/owners/{id}', 'GET', input);
export const listOwnerMembers: RenderEndpoints['listOwnerMembers'] = (
	ctx,
	input,
) => call(ctx, '/v1/owners/{id}/members', 'GET', input);
export const listOwnerAuditLogs: RenderEndpoints['listOwnerAuditLogs'] = (
	ctx,
	input,
) => call(ctx, '/v1/owners/{id}/audit-logs', 'GET', input);
export const listOrganizationAuditLogs: RenderEndpoints['listOrganizationAuditLogs'] =
	(ctx, input) => call(ctx, '/v1/organizations/{id}/audit-logs', 'GET', input);
export const getUser: RenderEndpoints['getUser'] = (ctx, input) =>
	call(ctx, '/v1/users', 'GET', input);
export const listLogs: RenderEndpoints['listLogs'] = (ctx, input) =>
	call(ctx, '/v1/logs', 'GET', input);
export const listLogsValues: RenderEndpoints['listLogsValues'] = (ctx, input) =>
	call(ctx, '/v1/logs/values', 'GET', input);
export const subscribeLogs: RenderEndpoints['subscribeLogs'] = (ctx, input) =>
	call(ctx, '/v1/logs/subscribe', 'GET', input);
export const listResourceLogStreams: RenderEndpoints['listResourceLogStreams'] =
	(ctx, input) => call(ctx, '/v1/logs/streams/resource', 'GET', input);
export const deleteOwnerLogStream: RenderEndpoints['deleteOwnerLogStream'] = (
	ctx,
	input,
) => call(ctx, '/v1/logs/streams/owner/{id}', 'DELETE', input);
export const updateOwnerLogStream: RenderEndpoints['updateOwnerLogStream'] = (
	ctx,
	input,
) => call(ctx, '/v1/logs/streams/owner/{id}', 'PUT', input);
