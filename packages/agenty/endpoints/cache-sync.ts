import { logEventFromContext } from 'corsair/core';
import type { AgentyContext } from '../index';
import type { AgentyRoute } from './routes';
import type { AgentyEndpointInput } from './types';

type CacheRule = {
	entity: string;
	idKeys: string[];
	listKeys?: string[];
	deleteInputKeys?: string[];
};

// Cache core developer-facing resources; ephemeral browser/input ops log only.
const GROUP_CACHE_RULES: Record<string, CacheRule> = {
	agents: {
		entity: 'agents',
		idKeys: ['agent_id', 'id'],
		listKeys: ['data', 'items', 'agents', 'results'],
		deleteInputKeys: ['agent_id', 'id'],
	},
	jobs: {
		entity: 'jobs',
		idKeys: ['job_id', 'id'],
		listKeys: ['data', 'items', 'jobs', 'results'],
		deleteInputKeys: ['job_id', 'id'],
	},
	lists: {
		entity: 'lists',
		idKeys: ['list_id', 'id'],
		listKeys: ['data', 'items', 'lists', 'results'],
		deleteInputKeys: ['list_id', 'id'],
	},
};

// Sub-resource / result payloads must not upsert or delete parent entities.
const CACHE_OPT_OUT_ROUTES = new Set([
	'listsGetRowsById',
	'getJobResult',
	'getAgentResult',
	'jobsGetLogsById',
	'deleteListRow',
	'deleteListRows',
	'listsClearRows',
]);

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

	const hasId = rule.idKeys.some((key) => response[key] !== undefined);
	return hasId ? [response] : [];
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

export async function syncAgentyOperationCache(
	ctx: AgentyContext,
	route: Pick<AgentyRoute, 'method' | 'group' | 'name'>,
	input: AgentyEndpointInput,
	response: unknown,
) {
	if (CACHE_OPT_OUT_ROUTES.has(route.name)) return;

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
		await logEventFromContext(
			ctx,
			`agenty.cache.${rule.entity}.failed`,
			{
				message: `[agenty] Failed to sync ${rule.entity} cache`,
				entity: rule.entity,
				error: error instanceof Error ? error.message : String(error),
			},
			'failed',
		);
	}
}
