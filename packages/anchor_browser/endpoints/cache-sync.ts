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

function cacheItems(response: unknown, rule: CacheRule) {
	if (Array.isArray(response)) return response.filter(isRecord);
	if (!isRecord(response)) return [];

	for (const key of rule.listKeys ?? []) {
		const value = response[key];
		if (Array.isArray(value)) return value.filter(isRecord);
	}

	return [response];
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
	route: Pick<AnchorBrowserRoute, 'method' | 'group'>,
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
		console.warn(`[anchor_browser] Failed to sync ${rule.entity} cache:`, error);
	}
}
