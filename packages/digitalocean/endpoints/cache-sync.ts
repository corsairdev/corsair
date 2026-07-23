import type { DigitalOceanContext } from '../index';
import type { DigitalOceanRoute } from './routes';
import type { DigitalOceanEndpointInput } from './types';

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	nestedKeys?: string[];
	deleteInputKeys?: string[];
};

const GROUP_CACHE_RULES: Record<string, CacheRule> = {
	droplets: {
		entity: 'droplets',
		idKeys: ['id', 'droplet_id', 'dropletId'],
		listKeys: ['droplets', 'data', 'items', 'results'],
		nestedKeys: ['droplet'],
		deleteInputKeys: ['droplet_id', 'dropletId', 'id'],
	},
	volumes: {
		entity: 'volumes',
		idKeys: ['id', 'volume_id', 'volumeId'],
		listKeys: ['volumes', 'data', 'items', 'results'],
		nestedKeys: ['volume'],
		deleteInputKeys: ['volume_id', 'volumeId', 'id'],
	},
	databases: {
		entity: 'databases',
		idKeys: ['id', 'uuid', 'cluster_uuid', 'clusterUuid'],
		listKeys: ['databases', 'data', 'items', 'results'],
		nestedKeys: ['database', 'cluster'],
		deleteInputKeys: ['uuid', 'cluster_uuid', 'clusterUuid', 'id'],
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

	for (const key of rule.nestedKeys ?? []) {
		const value = response[key];
		if (isRecord(value)) return [value];
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

export async function syncDigitalOceanOperationCache(
	ctx: DigitalOceanContext,
	route: Pick<DigitalOceanRoute, 'method' | 'group'>,
	input: DigitalOceanEndpointInput,
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
		console.warn(`[digitalocean] Failed to sync ${rule.entity} cache:`, error);
	}
}
