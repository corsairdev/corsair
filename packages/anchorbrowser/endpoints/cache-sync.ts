import type { AnchorBrowserContext } from '../index';
import type { AnchorBrowserRoute } from './routes';
import type { AnchorBrowserEndpointInput } from './types';

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	deleteInputKeys?: string[];
};

const GROUP_CACHE_RULES: Record<string, CacheRule> = {
	sessions: {
		entity: 'sessions',
		idKeys: ['session_id', 'sessionId', 'id'],
		listKeys: ['data', 'items', 'sessions', 'results'],
		deleteInputKeys: ['session_id', 'sessionId', 'id'],
	},
	tasks: {
		entity: 'tasks',
		idKeys: ['taskId', 'task_id', 'id'],
		listKeys: ['data', 'items', 'tasks', 'results'],
		deleteInputKeys: ['taskId', 'task_id', 'id'],
	},
	profiles: {
		entity: 'profiles',
		idKeys: ['name', 'profile_id', 'id'],
		listKeys: ['data', 'items', 'profiles', 'results'],
		deleteInputKeys: ['name', 'profile_id', 'id'],
	},
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Anchor Browser wraps almost every response in a `data` envelope
 * (`{ data: { sessions: [...] } }`, `{ data: { session_id, ... } }`), while a
 * few legacy routes return the collection bare (`{ tasks: [...] }`). Unwrap the
 * envelope first so both shapes reach the same list/entity extraction below.
 */
function unwrapEnvelope(response: unknown): unknown {
	if (!isRecord(response)) return response;
	const data = response.data;
	if (Array.isArray(data) || isRecord(data)) return data;
	return response;
}

function cacheItems(response: unknown, rule: CacheRule) {
	const payload = unwrapEnvelope(response);
	if (Array.isArray(payload)) return payload.filter(isRecord);
	if (!isRecord(payload)) return [];

	for (const key of rule.listKeys ?? []) {
		const value = payload[key];
		if (Array.isArray(value)) return value.filter(isRecord);
	}

	return [payload];
}

function cacheEntityId(item: Record<string, unknown>, rule: CacheRule) {
	for (const key of rule.idKeys) {
		const value = item[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

function cacheDeleteEntityId(input: Record<string, unknown>, rule: CacheRule) {
	for (const key of rule.deleteInputKeys ?? rule.idKeys) {
		const value = input[key];
		if (typeof value === 'string' && value.length > 0) return value;
		if (typeof value === 'number') return String(value);
	}
	return undefined;
}

export async function syncAnchorBrowserOperationCache(
	ctx: AnchorBrowserContext,
	route: Pick<AnchorBrowserRoute, 'method' | 'group' | 'pathParams'>,
	input: AnchorBrowserEndpointInput,
	response: unknown,
) {
	const rule = GROUP_CACHE_RULES[route.group];
	if (!rule) return;

	const db = ctx.db as
		| Record<
				string,
				| {
						upsertByEntityId?: (
							entityId: string,
							data: Record<string, unknown>,
						) => Promise<unknown>;
						deleteByEntityId?: (entityId: string) => Promise<boolean>;
						/** Used to drop every cached row on a collection-level delete. */
						list?: () => Promise<Array<{ entity_id: string }>>;
				  }
				| undefined
		  >
		| undefined;
	const client = db?.[rule.entity];
	if (!client) return;

	try {
		if (route.method === 'DELETE') {
			const entityId = cacheDeleteEntityId(input, rule);
			if (entityId && client.deleteByEntityId) {
				await client.deleteByEntityId(entityId);
				return;
			}

			// Collection-level delete such as `endAllSessions`
			// (DELETE /sessions/all): there is no identifier to target, so every
			// cached row for the group is now stale and must be dropped.
			if (!route.pathParams?.length && client.list && client.deleteByEntityId) {
				for (const row of await client.list()) {
					await client.deleteByEntityId(row.entity_id);
				}
			}
			return;
		}

		if (!client.upsertByEntityId) return;

		for (const item of cacheItems(response, rule)) {
			const entityId = cacheEntityId(item, rule);
			if (!entityId) continue;
			await client.upsertByEntityId(entityId, item);
		}
	} catch (error) {
		console.warn(`[anchorbrowser] Failed to sync ${rule.entity} cache:`, error);
	}
}
