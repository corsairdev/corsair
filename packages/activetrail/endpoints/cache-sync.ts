import type { ActiveTrailContext } from '../index';
import type { ActiveTrailRoute } from './routes';
import type { ActiveTrailEndpointInput } from './types';

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	deleteInputKeys?: string[];
};

const GROUP_CACHE_RULES: Record<string, CacheRule> = {
	contacts: {
		entity: 'contacts',
		idKeys: ['id', 'contact_id', 'contactId'],
		listKeys: ['data', 'items', 'contacts', 'results'],
		deleteInputKeys: ['id', 'contact_id', 'contactId'],
	},
	campaigns: {
		entity: 'campaigns',
		idKeys: ['id', 'campaign_id', 'campaignId'],
		listKeys: ['data', 'items', 'campaigns', 'results'],
		deleteInputKeys: ['id', 'campaign_id', 'campaignId'],
	},
	groups: {
		entity: 'groups',
		idKeys: ['id', 'group_id', 'groupId'],
		listKeys: ['data', 'items', 'groups', 'results'],
		deleteInputKeys: ['id', 'group_id', 'groupId'],
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

export async function syncActiveTrailOperationCache(
	ctx: ActiveTrailContext,
	route: Pick<ActiveTrailRoute, 'method' | 'group'>,
	input: ActiveTrailEndpointInput,
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
		console.warn(`[activetrail] Failed to sync ${rule.entity} cache:`, error);
	}
}
