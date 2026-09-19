import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheWorkspace, evictEntity } from './persist';
import {
	botpressCall,
	compactBody,
	compactQuery,
	resolveWorkspaceId,
} from './shared';
import type {
	BotpressEndpointOutputs,
	BotpressQuotaCompletionMap,
	BotpressWorkspace,
} from './types';

/** Creates a workspace under the authenticated account. */
export const create: BotpressEndpoints['workspacesCreate'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<BotpressWorkspace>(
		ctx,
		'/v1/admin/workspaces',
		{
			method: 'POST',
			body: compactBody({
				name: input.name,
				billingVersion: input.billingVersion,
			}),
		},
	);

	await cacheWorkspace(ctx.db?.workspaces, result);

	await logEventFromContext(
		ctx,
		'botpress.workspaces.create',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** Gets a workspace by id. */
export const get: BotpressEndpoints['workspacesGet'] = async (ctx, input) => {
	const result = await botpressCall<BotpressWorkspace>(
		ctx,
		`/v1/admin/workspaces/${encodeURIComponent(input.id)}`,
	);

	await cacheWorkspace(ctx.db?.workspaces, result);

	await logEventFromContext(
		ctx,
		'botpress.workspaces.get',
		auditPayload(input, ['id']),
		'completed',
	);
	return result;
};

/** Updates workspace settings (name, spending limit, profile, visibility). */
export const update: BotpressEndpoints['workspacesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<BotpressWorkspace>(
		ctx,
		`/v1/admin/workspaces/${encodeURIComponent(input.id)}`,
		{
			method: 'PUT',
			body: compactBody({
				name: input.name,
				spendingLimit: input.spendingLimit,
				about: input.about,
				profilePicture: input.profilePicture,
				contactEmail: input.contactEmail,
				website: input.website,
				socialAccounts: input.socialAccounts,
				isPublic: input.isPublic,
				handle: input.handle,
			}),
		},
	);

	await cacheWorkspace(ctx.db?.workspaces, result);

	await logEventFromContext(
		ctx,
		'botpress.workspaces.update',
		auditPayload(input, ['id']),
		'completed',
	);
	return result;
};

/**
 * Permanently deletes a workspace and evicts it from the cache. [DESTRUCTIVE]
 *
 * The audit event is logged immediately once the API confirms the delete,
 * before the (best-effort, non-throwing) cache eviction - it asserts "the
 * remote record is gone", which is true the moment the DELETE call returns,
 * independent of whether the local mirror is cleaned up afterward.
 */
export const remove: BotpressEndpoints['workspacesDelete'] = async (
	ctx,
	input,
) => {
	await botpressCall(
		ctx,
		`/v1/admin/workspaces/${encodeURIComponent(input.id)}`,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'botpress.workspaces.delete',
		auditPayload(input, ['id']),
		'completed',
	);

	await evictEntity(ctx.db?.workspaces, input.id, 'workspace');

	return {};
};

/**
 * Lists workspaces owned by the authenticated account.
 *
 * Returns the provider's `nextToken` alongside the page: dropping it would
 * strand a caller on the first page with no way to reach the rest of a
 * result set larger than `pageSize`.
 */
export const list: BotpressEndpoints['workspacesList'] = async (ctx, input) => {
	const result = await botpressCall<{
		workspaces?: BotpressWorkspace[];
		meta?: { nextToken?: string };
	}>(ctx, '/v1/admin/workspaces', {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
			handle: input.handle,
		}),
	});

	const workspaces = result.workspaces ?? [];
	await Promise.all(
		workspaces.map((workspace) =>
			cacheWorkspace(ctx.db?.workspaces, workspace),
		),
	);

	await logEventFromContext(
		ctx,
		'botpress.workspaces.list',
		auditPayload(input, ['handle']),
		'completed',
	);
	return { workspaces, nextToken: result.meta?.nextToken };
};

/** Lists workspaces that opted into public visibility. */
export const listPublic: BotpressEndpoints['workspacesListPublic'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		workspaces?: BotpressWorkspace[];
		meta?: { nextToken?: string };
	}>(ctx, '/v1/admin/workspaces/public', {
		method: 'GET',
		query: compactQuery({
			nextToken: input.nextToken,
			pageSize: input.pageSize,
			workspaceIds: input.workspaceIds,
			search: input.search,
		}),
	});

	await logEventFromContext(
		ctx,
		'botpress.workspaces.listPublic',
		auditPayload(input, ['search']),
		'completed',
	);
	return {
		workspaces: result.workspaces ?? [],
		nextToken: result.meta?.nextToken,
	};
};

/** Checks whether a workspace handle is available, with suggestions if not. */
export const checkHandleAvailability: BotpressEndpoints['workspacesCheckHandleAvailability'] =
	async (ctx, input) => {
		const result = await botpressCall<
			BotpressEndpointOutputs['workspacesCheckHandleAvailability']
		>(ctx, '/v1/admin/workspaces/handle-availability', {
			method: 'PUT',
			body: { handle: input.handle },
		});

		await logEventFromContext(
			ctx,
			'botpress.workspaces.checkHandleAvailability',
			auditPayload(input, ['handle']),
			'completed',
		);
		return result;
	};

/**
 * Sets a workspace preference by key.
 *
 * No workspace id in the path (confirmed live), so the acting workspace comes
 * from `x-workspace-id`, resolved and required here.
 */
export const setPreference: BotpressEndpoints['workspacesSetPreference'] =
	async (ctx, input) => {
		const workspaceId = await resolveWorkspaceId(ctx);

		await botpressCall(
			ctx,
			`/v1/admin/workspaces/preferences/${encodeURIComponent(input.key)}`,
			{ method: 'POST', body: { value: input.value }, workspaceId },
		);

		await logEventFromContext(
			ctx,
			'botpress.workspaces.setPreference',
			auditPayload(input, ['key']),
			'completed',
		);
		return {};
	};

/** Gets a workspace's usage against a single quota type. */
export const getQuota: BotpressEndpoints['workspacesGetQuota'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{
		quota: BotpressEndpointOutputs['workspacesGetQuota'];
	}>(ctx, `/v1/admin/workspaces/${encodeURIComponent(input.id)}/quota`, {
		method: 'GET',
		query: compactQuery({ type: input.type, period: input.period }),
	});

	await logEventFromContext(
		ctx,
		'botpress.workspaces.getQuota',
		auditPayload(input, ['id', 'type']),
		'completed',
	);
	return result.quota;
};

/** Gets the highest quota completion rate for every workspace the account can see. */
export const getAllQuotaCompletion: BotpressEndpoints['workspacesGetAllQuotaCompletion'] =
	async (ctx) => {
		const result = await botpressCall<BotpressQuotaCompletionMap>(
			ctx,
			'/v1/admin/workspaces/usages/quota-completion',
		);

		await logEventFromContext(
			ctx,
			'botpress.workspaces.getAllQuotaCompletion',
			{},
			'completed',
		);
		return result;
	};

/** Breaks down a workspace's usage of a quota type by bot. */
export const breakDownUsageByBot: BotpressEndpoints['workspacesBreakDownUsageByBot'] =
	async (ctx, input) => {
		const result = await botpressCall<{
			data: BotpressEndpointOutputs['workspacesBreakDownUsageByBot'];
		}>(
			ctx,
			`/v1/admin/workspaces/${encodeURIComponent(input.id)}/usages/by-bot`,
			{
				method: 'GET',
				query: compactQuery({ type: input.type, period: input.period }),
			},
		);

		await logEventFromContext(
			ctx,
			'botpress.workspaces.breakDownUsageByBot',
			auditPayload(input, ['id', 'type']),
			'completed',
		);
		return result.data ?? [];
	};
