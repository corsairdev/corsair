import { makeRenderRequest } from '../client';
import type { RenderContext, RenderEndpoints } from '../index';
import { RenderOwnerSchema } from '../schema/database';
import { renderPathParameter } from './path';

type Context = { key: string };
// Render's generated operation inputs vary by endpoint; the shared adapter
// preserves those provider-specific fields until the endpoint schema validates them.
// Stricter typing is not feasible because observability filters vary across
// Render resources and remain open until schema validation.
// unknown: the operation schemas validate the provider-specific filters.
type Input = Record<string, unknown>;
// unknown: owner records are provider-defined (the list wraps each in
// { cursor, owner }); saveOwners parses them with RenderOwnerSchema.
type OwnerRecord = Record<string, unknown>;

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
		query: method === 'GET' ? query : undefined,
	});
};

/**
 * Keeps a local copy of each workspace (owner) the API key can see, keyed by
 * owner ID. Render returns the full owner on both list and retrieve, so a
 * save replaces the row. A failed save never fails the API call.
 * unknown: entries come from a loose list schema; RenderOwnerSchema parses
 * each one before it is stored.
 */
const saveOwners = async (ctx: RenderContext, owners: unknown[]) => {
	if (!ctx.database) return;
	try {
		for (const owner of owners) {
			const parsed = RenderOwnerSchema.safeParse(owner);
			if (!parsed.success) continue;
			await ctx.db.renderOwner.upsertByEntityId(parsed.data.id, parsed.data);
		}
	} catch (error) {
		console.warn('Failed to save Render owners to database:', error);
	}
};

// Path checks in call() throw synchronously, like every other operation;
// the save runs once Render answers.
export const listOwners: RenderEndpoints['listOwners'] = (ctx, input) =>
	call<OwnerRecord[]>(ctx, '/v1/owners', 'GET', input).then(
		async (response) => {
			if (Array.isArray(response)) {
				await saveOwners(
					ctx,
					response.map((entry) => entry.owner),
				);
			}
			return response;
		},
	);
export const retrieveOwner: RenderEndpoints['retrieveOwner'] = (ctx, input) =>
	call<OwnerRecord>(ctx, '/v1/owners/{id}', 'GET', input).then(
		async (response) => {
			await saveOwners(ctx, [response]);
			return response;
		},
	);
export const listOwnerMembers: RenderEndpoints['listOwnerMembers'] = (
	ctx,
	input,
) => call(ctx, '/v1/owners/{id}/members', 'GET', input);
export const updateWorkspaceMember: RenderEndpoints['updateWorkspaceMember'] = (
	ctx,
	input,
) => {
	const { ownerId, userId, ...body } = input;
	const path = renderPathParameter(
		renderPathParameter(
			'/v1/owners/{ownerId}/members/{userId}',
			'ownerId',
			ownerId,
		),
		'userId',
		userId,
	);
	return makeRenderRequest(path, ctx.key, { method: 'PATCH', body });
};
export const removeWorkspaceMember: RenderEndpoints['removeWorkspaceMember'] = (
	ctx,
	input,
) => {
	const path = renderPathParameter(
		renderPathParameter(
			'/v1/owners/{ownerId}/members/{userId}',
			'ownerId',
			input.ownerId,
		),
		'userId',
		input.userId,
	);
	return makeRenderRequest(path, ctx.key, { method: 'DELETE' });
};
export const retrieveOwnerLogStream: RenderEndpoints['retrieveOwnerLogStream'] =
	(ctx, input) =>
		makeRenderRequest(
			renderPathParameter(
				'/v1/logs/streams/owner/{ownerId}',
				'ownerId',
				input.ownerId,
			),
			ctx.key,
			{ method: 'GET' },
		);
export const retrieveResourceLogStream: RenderEndpoints['retrieveResourceLogStream'] =
	(ctx, input) =>
		makeRenderRequest(
			renderPathParameter(
				'/v1/logs/streams/resource/{resourceId}',
				'resourceId',
				input.resourceId,
			),
			ctx.key,
			{ method: 'GET' },
		);
export const deleteResourceLogStream: RenderEndpoints['deleteResourceLogStream'] =
	(ctx, input) =>
		makeRenderRequest(
			renderPathParameter(
				'/v1/logs/streams/resource/{resourceId}',
				'resourceId',
				input.resourceId,
			),
			ctx.key,
			{ method: 'DELETE' },
		);
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
