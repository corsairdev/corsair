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

// Batch delete bodies use plural id arrays (e.g. taskIds on POST /tasks/batch-delete).
const BATCH_DELETE_ID_KEYS = [
	'taskIds',
	'leadIds',
	'customerIds',
	'ids',
] as const;

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

function cacheDeleteEntityIds(
	input: Record<string, unknown>,
	rule: CacheRule,
): string[] {
	// Explicit `{ body: { taskIds } }` shape from the request factory.
	const deleteInput = isRecord(input.body)
		? { ...input, ...input.body }
		: input;

	for (const key of BATCH_DELETE_ID_KEYS) {
		const value = deleteInput[key];
		if (!Array.isArray(value)) continue;
		return value.flatMap((entry) => {
			if (typeof entry === 'string' && entry.length > 0) return [entry];
			if (typeof entry === 'number') return [String(entry)];
			return [];
		});
	}

	for (const key of rule.deleteInputKeys ?? rule.idKeys) {
		const value = deleteInput[key];
		if (typeof value === 'string' && value.length > 0) return [value];
		if (typeof value === 'number') return [String(value)];
	}
	return [];
}

export async function syncAgencyZoomOperationCache(
	ctx: AgencyZoomContext,
	route: Pick<AgencyZoomRoute, 'method' | 'group' | 'riskLevel'>,
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
		// AgencyZoom batch deletes are POST + destructive (e.g. batchDeleteTask).
		const isDelete =
			route.method === 'DELETE' || route.riskLevel === 'destructive';
		if (isDelete) {
			if (!client.deleteByEntityId) return;
			for (const entityId of cacheDeleteEntityIds(input, rule)) {
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
