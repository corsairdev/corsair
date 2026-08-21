import type { AffindaContext } from '../index';
import type { AffindaRoute } from './routes';
import type { AffindaEndpointInput } from './types';

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	deleteInputKeys?: string[];
};

const GROUP_CACHE_RULES: Record<string, CacheRule> = {
	documents: {
		entity: 'documents',
		idKeys: ['identifier', 'document_id', 'id'],
		listKeys: ['data', 'items', 'documents', 'results'],
		deleteInputKeys: ['identifier', 'document_id', 'id'],
	},
	collections: {
		entity: 'collections',
		idKeys: ['identifier', 'collection_id', 'id'],
		listKeys: ['data', 'items', 'collections', 'results'],
		deleteInputKeys: ['identifier', 'collection_id', 'id'],
	},
	workspaces: {
		entity: 'workspaces',
		idKeys: ['identifier', 'workspace_id', 'id'],
		listKeys: ['data', 'items', 'workspaces', 'results'],
		deleteInputKeys: ['identifier', 'workspace_id', 'id'],
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

export async function syncAffindaOperationCache(
	ctx: AffindaContext,
	route: Pick<AffindaRoute, 'method' | 'group'>,
	input: AffindaEndpointInput,
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
		console.warn(`[affinda] Failed to sync ${rule.entity} cache:`, error);
	}
}
