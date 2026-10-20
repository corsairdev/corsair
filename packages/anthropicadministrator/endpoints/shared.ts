import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { AnthropicAdministratorRequestOptions } from '../client';
import { makeAnthropicAdministratorRequest } from '../client';
import type { AnthropicAdministratorContext } from '../index';
import type {
	ApiKey,
	Invite,
	User,
	Workspace,
	WorkspaceMember,
} from './types/index';

/** Scalar fields recorded with each completed operation. */
type LogPayload = Record<string, string | number | boolean | undefined>;

const ADMIN_KEY_MISSING =
	'An Admin API credential is required for this endpoint.';

async function resolveAdminKey(
	ctx: AnthropicAdministratorContext,
): Promise<string> {
	if (ctx.options?.key) return ctx.options.key;

	const authType = ctx.options?.authType ?? 'api_key';
	const key =
		authType === 'oauth_2'
			? await ctx.keys?.get_access_token()
			: await ctx.keys?.get_api_key();
	if (key) return key;

	throw new AuthMissingError(
		'anthropicadministrator',
		authType,
		ADMIN_KEY_MISSING,
	);
}

/** Entities mirrored into the plugin's local cache, keyed by entity name. */
type CachedEntities = {
	users: User;
	invites: Invite;
	workspaces: Workspace;
	workspaceMembers: WorkspaceMember;
	apiKeys: ApiKey;
};

export type CacheEntity = keyof CachedEntities;

type Db = AnthropicAdministratorContext['db'];

/**
 * One typed writer per entity. Indexing this mapped table with a generic key
 * keeps each entity's payload type tied to its own client.
 */
const cacheWriters: {
	[K in CacheEntity]: {
		// Safe: the stored row is never read back; only completion matters.
		// A narrower type is not practical because each entity client returns its own row type.
		upsert: (db: Db, id: string, data: CachedEntities[K]) => Promise<unknown>;
		remove: (db: Db, id: string) => Promise<boolean>;
	};
} = {
	users: {
		upsert: (db, id, data) => db.users.upsertByEntityId(id, data),
		remove: (db, id) => db.users.deleteByEntityId(id),
	},
	invites: {
		upsert: (db, id, data) => db.invites.upsertByEntityId(id, data),
		remove: (db, id) => db.invites.deleteByEntityId(id),
	},
	workspaces: {
		upsert: (db, id, data) => db.workspaces.upsertByEntityId(id, data),
		remove: (db, id) => db.workspaces.deleteByEntityId(id),
	},
	workspaceMembers: {
		upsert: (db, id, data) => db.workspaceMembers.upsertByEntityId(id, data),
		remove: (db, id) => db.workspaceMembers.deleteByEntityId(id),
	},
	apiKeys: {
		upsert: (db, id, data) => db.apiKeys.upsertByEntityId(id, data),
		remove: (db, id) => db.apiKeys.deleteByEntityId(id),
	},
};

/** Composite cache key for workspace members, which have no standalone ID. */
export function workspaceMemberKey(
	workspaceId: string,
	userId: string,
): string {
	return `${workspaceId}:${userId}`;
}

/**
 * Mirrors an API response into the cache. A missing database or a failed
 * write is logged and swallowed so caching can never fail the API call.
 */
export async function cacheEntity<K extends CacheEntity>(
	ctx: AnthropicAdministratorContext,
	entity: K,
	entityId: string,
	data: CachedEntities[K],
): Promise<void> {
	const db: Db | undefined = ctx.db;
	if (!db) return;
	try {
		await cacheWriters[entity].upsert(db, entityId, data);
	} catch (error) {
		console.warn(
			`[anthropicadministrator] failed to cache ${entity} ${entityId}:`,
			error,
		);
	}
}

/** Mirrors every item of a `{ data: [...] }` list page into the cache. */
export async function cacheList<K extends CacheEntity>(
	ctx: AnthropicAdministratorContext,
	entity: K,
	items: readonly CachedEntities[K][],
	idOf: (item: CachedEntities[K]) => string,
): Promise<void> {
	for (const item of items) {
		await cacheEntity(ctx, entity, idOf(item), item);
	}
}

export async function evictEntity(
	ctx: AnthropicAdministratorContext,
	entity: CacheEntity,
	entityId: string,
): Promise<void> {
	const db: Db | undefined = ctx.db;
	if (!db) return;
	try {
		await cacheWriters[entity].remove(db, entityId);
	} catch (error) {
		console.warn(
			`[anthropicadministrator] failed to evict ${entity} ${entityId}:`,
			error,
		);
	}
}

/** Records a completed operation; telemetry failures never reach the caller. */
async function logCompleted(
	ctx: AnthropicAdministratorContext,
	operation: string,
	logPayload: LogPayload,
): Promise<void> {
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
}

/**
 * Issues an Admin API request, validates the response against `schema` and
 * records the operation. Logging happens after a successful response so a
 * failed call is never recorded as `completed`.
 */
export async function callAdminApi<S extends z.ZodType>(
	ctx: AnthropicAdministratorContext,
	operation: string,
	schema: S,
	path: string,
	options: AnthropicAdministratorRequestOptions = {},
	logPayload: LogPayload = {},
): Promise<z.output<S>> {
	const raw = await makeAnthropicAdministratorRequest(
		path,
		await resolveAdminKey(ctx),
		{ ...options, authType: ctx.options?.authType },
	);
	const response = schema.parse(raw);
	await logCompleted(ctx, operation, logPayload);
	return response;
}
