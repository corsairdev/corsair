import { logEventFromContext } from 'corsair/core';
import type { AnthropicAdministratorRequestOptions } from '../client';
import { makeAnthropicAdministratorRequest } from '../client';
import type { AnthropicAdministratorContext } from '../index';

/** Entities mirrored into the plugin's local cache. */
export type CacheEntity =
	| 'users'
	| 'invites'
	| 'workspaces'
	| 'workspaceMembers'
	| 'apiKeys';

type EntityClient = {
	upsertByEntityId?: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<boolean>;
};

function entityClient(
	ctx: AnthropicAdministratorContext,
	entity: CacheEntity,
): EntityClient | undefined {
	// `ctx.db` exposes a per-entity client whose `upsert` argument is narrowed to
	// that entity's schema. This helper is deliberately entity-agnostic, so the
	// map is widened through `unknown`; the caller supplies an already-validated
	// API response for the matching entity.
	const db = ctx.db as unknown as
		| Record<string, EntityClient | undefined>
		| undefined;
	return db?.[entity];
}

/** Composite cache key for workspace members, which have no standalone ID. */
export function workspaceMemberKey(
	workspaceId: string,
	userId: string,
): string {
	return `${workspaceId}:${userId}`;
}

export async function cacheEntity(
	ctx: AnthropicAdministratorContext,
	entity: CacheEntity,
	entityId: string | undefined,
	data: unknown,
): Promise<void> {
	if (!entityId || typeof data !== 'object' || data === null) return;
	const client = entityClient(ctx, entity);
	if (!client?.upsertByEntityId) return;

	try {
		await client.upsertByEntityId(entityId, data as Record<string, unknown>);
	} catch (error) {
		console.warn(
			`[anthropicadministrator] failed to cache ${entity} ${entityId}:`,
			error,
		);
	}
}

/**
 * Mirrors a `{ data: [...] }` list page into the cache. Tolerates a missing or
 * malformed `data` field so a caching concern can never fail the API call.
 */
export async function cacheList<T>(
	ctx: AnthropicAdministratorContext,
	entity: CacheEntity,
	items: readonly T[] | undefined,
	idOf: (item: T) => string | undefined,
): Promise<void> {
	if (!Array.isArray(items)) return;
	for (const item of items) {
		await cacheEntity(ctx, entity, idOf(item), item);
	}
}

export async function evictEntity(
	ctx: AnthropicAdministratorContext,
	entity: CacheEntity,
	entityId: string,
): Promise<void> {
	const client = entityClient(ctx, entity);
	if (!client?.deleteByEntityId) return;

	try {
		await client.deleteByEntityId(entityId);
	} catch (error) {
		console.warn(
			`[anthropicadministrator] failed to evict ${entity} ${entityId}:`,
			error,
		);
	}
}

/**
 * Issues an Admin API request and records the operation. Logging happens after
 * a successful response so a failed call is never recorded as `completed`.
 */
export async function callAdminApi<T>(
	ctx: AnthropicAdministratorContext,
	operation: string,
	path: string,
	options: AnthropicAdministratorRequestOptions = {},
	logPayload: Record<string, unknown> = {},
): Promise<T> {
	const response = await makeAnthropicAdministratorRequest<T>(path, ctx.key, {
		...options,
		authType: ctx.options?.authType,
	});

	// The remote call already succeeded; a telemetry failure must not turn that
	// into a thrown error for the caller.
	try {
		await logEventFromContext(
			ctx,
			`anthropicadministrator.${operation}`,
			logPayload,
			'completed',
		);
	} catch (error) {
		console.warn(`[anthropicadministrator] failed to log ${operation}:`, error);
	}

	return response;
}

/** Drops undefined values so optional fields are never sent as `null` keys. */
export function compact(
	fields: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
}
