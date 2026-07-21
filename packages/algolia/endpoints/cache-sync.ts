import type { AlgoliaContext } from '../index';
import type { AlgoliaRoute } from './routes';
import type { AlgoliaEndpointInput } from './types';

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	deleteInputKeys?: string[];
};

const GROUP_CACHE_RULES: Record<string, CacheRule> = {
	indices: {
		entity: 'indices',
		idKeys: ['name', 'indexName', 'index'],
		listKeys: ['data', 'items', 'indices', 'results'],
		deleteInputKeys: ['name', 'indexName', 'index'],
	},
	tasks: {
		entity: 'tasks',
		idKeys: ['taskID', 'task_id', 'id'],
		listKeys: ['data', 'items', 'tasks', 'results'],
		deleteInputKeys: ['taskID', 'task_id', 'id'],
	},
	search: {
		entity: 'records',
		idKeys: ['objectID', 'object_id', 'id'],
		listKeys: ['hits', 'items', 'results'],
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

export async function syncAlgoliaOperationCache(
	ctx: AlgoliaContext,
	route: Pick<AlgoliaRoute, 'method' | 'group'>,
	input: AlgoliaEndpointInput,
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
		console.warn(`[algolia] Failed to sync ${rule.entity} cache:`, error);
	}
}
