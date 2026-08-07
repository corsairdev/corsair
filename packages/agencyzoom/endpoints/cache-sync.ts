import type { AgencyZoomContext } from '../index';
import type { AgencyZoomRoute } from './routes';
import type { AgencyZoomEndpointInput } from './types';

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	deleteInputKeys?: string[];
};

const GROUP_CACHE_RULES: Record<string, CacheRule> = {
	leads: {
		entity: 'leads',
		idKeys: ['id', 'lead_id', 'leadId'],
		listKeys: ['data', 'items', 'leads', 'results'],
		deleteInputKeys: ['id', 'lead_id', 'leadId'],
	},
	customers: {
		entity: 'customers',
		idKeys: ['id', 'customer_id', 'customerId'],
		listKeys: ['data', 'items', 'customers', 'results'],
		deleteInputKeys: ['id', 'customer_id', 'customerId'],
	},
	tasks: {
		entity: 'tasks',
		idKeys: ['id', 'task_id', 'taskId'],
		listKeys: ['data', 'items', 'tasks', 'results'],
		deleteInputKeys: ['id', 'task_id', 'taskId'],
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

export async function syncAgencyZoomOperationCache(
	ctx: AgencyZoomContext,
	route: Pick<AgencyZoomRoute, 'method' | 'group'>,
	input: AgencyZoomEndpointInput,
	// response is unknown: AgencyZoom payloads vary by endpoint; items narrowed via isRecord.
	response: unknown,
) {
	const rule = GROUP_CACHE_RULES[route.group];
	if (!rule) return;

	// ctx.db entity clients are dynamically keyed; assert to the upsert/delete shape used here.
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
		console.warn(`[agencyzoom] Failed to sync ${rule.entity} cache:`, error);
	}
}
