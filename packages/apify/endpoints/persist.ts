import type { PluginEntityClients } from 'corsair/orm';
import type { ApifyContext } from '..';
import { ApifySchema } from '../schema';
import type { ApifyWebhookPayload } from '../webhooks/types';

export type ApifyEntityKey = keyof typeof ApifySchema.entities;

type ApifyDbClients = PluginEntityClients<typeof ApifySchema.entities>;

function apifyDb(ctx: ApifyContext): ApifyDbClients {
	return ctx.db as ApifyDbClients;
}

type PersistMode =
	| { mode: 'upsert'; entity: ApifyEntityKey }
	| { mode: 'list'; entity: ApifyEntityKey }
	| {
			mode: 'delete';
			entity: ApifyEntityKey;
			pathKey: string;
	  }
	| {
			mode: 'deleteComposite';
			entity: ApifyEntityKey;
			keys: [string, string];
			joiner: string;
	  };

/** Apify v2 wraps most JSON payloads as `{ data: T }`; lists use `{ data: { items: [...] } }`. */
export function unwrapApifyResponse(response: unknown): {
	singles: Record<string, unknown>[];
	lists: Record<string, unknown>[][];
} {
	const singles: Record<string, unknown>[] = [];
	const lists: Record<string, unknown>[][] = [];

	if (response === null || response === undefined) return { singles, lists };
	if (typeof response !== 'object') return { singles, lists };

	const root = response as Record<string, unknown>;
	if (!('data' in root)) {
		if (root.id !== undefined && typeof (root as { id?: unknown }).id === 'string') {
			singles.push(root as Record<string, unknown>);
		}
		return { singles, lists };
	}

	const data = root.data;
	if (data === null || data === undefined) return { singles, lists };

	if (Array.isArray(data)) {
		lists.push(data as Record<string, unknown>[]);
		return { singles, lists };
	}

	if (typeof data === 'object') {
		const d = data as Record<string, unknown>;
		if (Array.isArray(d.items)) {
			lists.push(d.items as Record<string, unknown>[]);
			return { singles, lists };
		}
		if (typeof d.id === 'string') {
			singles.push(d);
			return { singles, lists };
		}
	}

	return { singles, lists };
}

const MODULE_ENTITY: Record<string, ApifyEntityKey> = {
	actorBuilds: 'actorBuilds',
	actorRuns: 'actorRuns',
	actorTasks: 'actorTasks',
	actors: 'actors',
	actorsActorBuilds: 'actorBuilds',
	actorsActorRuns: 'actorRuns',
	actorsActorVersions: 'actorVersions',
	actorsWebhookCollection: 'webhooks',
	schedules: 'schedules',
	storageDatasets: 'datasets',
	storageKeyValueStores: 'keyValueStores',
	storageRequestQueues: 'requestQueues',
	store: 'actors',
	users: 'users',
	webhooksWebhookDispatches: 'webhookDispatches',
	webhooksWebhooks: 'webhooks',
};

const SKIP_MODULES = new Set(['logs', 'tools', 'storageRequestQueuesRequests', 'storageRequestQueuesRequestsLocks']);

const SKIP_METHODS = new Set([
	'actorbuildLogGet',
	'actorbuildOpenapiJsonGet',
	'actOpenapiJsonGet',
	'scheduleLogGet',
	'datasetItemsGet',
	'datasetItemsHead',
	'datasetItemsPost',
	'datasetStatisticsGet',
	'keyvaluestoreKeysGet',
	'keyvaluestoreRecordDelete',
	'keyvaluestoreRecordGet',
	'keyvaluestoreRecordHead',
	'keyvaluestoreRecordPost',
	'keyvaluestoreRecordPut',
	'keyvaluestoreRecordsGet',
	'requestqueueRequestsBatchDelete',
	'requestqueueRequestsBatchPost',
	'requestqueueRequestDelete',
	'requestqueueRequestGet',
	'requestqueueRequestPut',
	'requestqueueRequestsGet',
	'requestqueueRequestsPost',
	'requestqueueHeadGet',
	'requestqueueHeadLockPost',
	'requestqueueRequestLockDelete',
	'requestqueueRequestLockPut',
	'requestqueueRequestsUnlockPost',
	'toolsBrowserInfoDelete',
	'toolsBrowserInfoGet',
	'toolsBrowserInfoPost',
	'toolsBrowserInfoPut',
	'toolsDecodeAndVerifyPost',
	'toolsEncodeAndSignPost',
	'logGet',
	'actortaskInputGet',
	'actortaskInputPut',
	'usersMeLimitsGet',
	'usersMeLimitsPut',
	'usersMeUsageMonthlyGet',
	'webhookTestPost',
	'actVersionEnvvarDelete',
]);

/** Methods that return a list of resources (not `*sGet` naming). */
const LIST_METHOD_OVERRIDES = new Set([
	'actortaskRunsGet',
	'actRunsGet',
	'webhookWebhookdispatchesGet',
	'webhookdispatchesGet',
]);

function isListMethod(method: string): boolean {
	if (LIST_METHOD_OVERRIDES.has(method)) return true;
	return method.endsWith('sGet');
}

const DELETE_COMPOSITE: Record<string, { keys: [string, string]; joiner: string }> = {
	'actorsActorVersions.actVersionDelete': {
		keys: ['actorId', 'versionNumber'],
		joiner: ':',
	},
};

const DELETE_BY_MODULE: Record<string, { pathKey: string }> = {
	actorBuilds: { pathKey: 'buildId' },
	actorRuns: { pathKey: 'runId' },
	actorTasks: { pathKey: 'actorTaskId' },
	actors: { pathKey: 'actorId' },
	schedules: { pathKey: 'scheduleId' },
	storageDatasets: { pathKey: 'datasetId' },
	storageKeyValueStores: { pathKey: 'storeId' },
	storageRequestQueues: { pathKey: 'queueId' },
	webhooksWebhooks: { pathKey: 'webhookId' },
	webhooksWebhookDispatches: { pathKey: 'dispatchId' },
};

/** Per-endpoint entity override for upsert/list when module default is wrong. */
const ENTITY_OVERRIDE: Record<string, ApifyEntityKey> = {
	'actorTasks.actortaskRunsGet': 'actorRuns',
	'actorTasks.actortaskRunsLastGet': 'actorRuns',
	'actorsActorRuns.actRunsGet': 'actorRuns',
	'actorsActorRuns.actRunsLastGet': 'actorRuns',
	'actorsActorRuns.actRunGet': 'actorRuns',
	'actorsActorRuns.actRunAbortPost': 'actorRuns',
	'actorsActorRuns.actRunMetamorphPost': 'actorRuns',
	'actorsActorRuns.actRunResurrectPost': 'actorRuns',
	'actorsActorRuns.actRunsPost': 'actorRuns',
	'actorsActorRuns.actRunsyncGet': 'actorRuns',
	'actorsActorRuns.actRunsyncPost': 'actorRuns',
	'actorsActorRuns.actRunsyncgetdatasetitemsGet': 'actorRuns',
	'actorsActorRuns.actRunsyncgetdatasetitemsPost': 'actorRuns',
	'actorRuns.actorrunAbortPost': 'actorRuns',
	'actorRuns.actorrunMetamorphPost': 'actorRuns',
	'actorRuns.actorrunPut': 'actorRuns',
	'actorRuns.actorrunRebootPost': 'actorRuns',
	'actorRuns.postchargerun': 'actorRuns',
	'actorRuns.postresurrectrun': 'actorRuns',
	'actorTasks.actortaskRunsPost': 'actorRuns',
	'actorTasks.actortaskRunsyncGet': 'actorRuns',
	'actorTasks.actortaskRunsyncPost': 'actorRuns',
	'actorTasks.actortaskRunsyncgetdatasetitemsGet': 'actorRuns',
	'actorTasks.actortaskRunsyncgetdatasetitemsPost': 'actorRuns',
};

function persistModeForEvent(eventName: string): PersistMode | undefined {
	if (!eventName.startsWith('apify.')) return undefined;
	const rest = eventName.slice(6);
	const dot = rest.indexOf('.');
	if (dot === -1) return undefined;
	const mod = rest.slice(0, dot);
	const method = rest.slice(dot + 1);

	if (SKIP_MODULES.has(mod)) return undefined;
	if (SKIP_METHODS.has(method)) return undefined;

	const entityBase = MODULE_ENTITY[mod];
	if (!entityBase) return undefined;

	const key = `${mod}.${method}`;

	if (method.endsWith('Delete')) {
		const composite = DELETE_COMPOSITE[key];
		if (composite) {
			return {
				mode: 'deleteComposite',
				entity: 'actorVersions',
				keys: composite.keys,
				joiner: composite.joiner,
			};
		}
		const del = DELETE_BY_MODULE[mod];
		if (!del) return undefined;
		return { mode: 'delete', entity: entityBase, pathKey: del.pathKey };
	}

	const entity = ENTITY_OVERRIDE[key] ?? entityBase;

	if (isListMethod(method)) {
		return { mode: 'list', entity };
	}

	return { mode: 'upsert', entity };
}

function stableIdForUser(row: Record<string, unknown>): string | undefined {
	if (typeof row.id === 'string' && row.id.length > 0) return row.id;
	if (typeof row.username === 'string' && row.username.length > 0) return row.username;
	return undefined;
}

function stableIdForVersion(row: Record<string, unknown>, path?: Record<string, string>): string | undefined {
	if (typeof row.id === 'string' && row.id.length > 0) return row.id;
	const actorId =
		(typeof row.actorId === 'string' && row.actorId) || (path?.actorId ?? '');
	const vn = row.versionNumber ?? path?.versionNumber;
	if (actorId && vn !== undefined && String(vn).length > 0) {
		return `${actorId}:${String(vn)}`;
	}
	return undefined;
}

async function upsertRow(
	ctx: ApifyContext,
	entity: ApifyEntityKey,
	row: Record<string, unknown>,
	path?: Record<string, string>,
): Promise<void> {
	const client = apifyDb(ctx)[entity];
	if (!client) return;

	let entityId: string | undefined;
	if (entity === 'users') {
		entityId = stableIdForUser(row);
	} else if (entity === 'actorVersions') {
		entityId = stableIdForVersion(row, path);
	} else if (typeof row.id === 'string') {
		entityId = row.id;
	}

	if (!entityId) return;

	try {
		await client.upsertByEntityId(entityId, row as never);
	} catch (error) {
		console.warn(`Failed to persist Apify entity "${entity}" (${entityId}):`, error);
	}
}

async function deleteByPath(
	ctx: ApifyContext,
	entity: ApifyEntityKey,
	pathKey: string,
	path?: Record<string, string>,
): Promise<void> {
	const client = apifyDb(ctx)[entity];
	if (!client || !path) return;
	const id = path[pathKey];
	if (!id) return;
	try {
		await client.deleteByEntityId(id);
	} catch (error) {
		console.warn(`Failed to delete Apify entity "${entity}" (${id}):`, error);
	}
}

async function deleteComposite(
	ctx: ApifyContext,
	entity: ApifyEntityKey,
	keys: [string, string],
	joiner: string,
	path?: Record<string, string>,
): Promise<void> {
	const client = apifyDb(ctx)[entity];
	if (!client || !path) return;
	const a = path[keys[0]];
	const b = path[keys[1]];
	if (!a || b === undefined) return;
	try {
		await client.deleteByEntityId(`${a}${joiner}${b}`);
	} catch (error) {
		console.warn(`Failed to delete Apify entity "${entity}" composite:`, error);
	}
}

/**
 * Persists successful API responses into the Corsair entity store for data freshness.
 */
export async function persistApifyEndpointResult(
	ctx: ApifyContext,
	eventName: string,
	response: unknown,
	path?: Record<string, string>,
): Promise<void> {
	const mode = persistModeForEvent(eventName);
	if (!mode) return;

	if (mode.mode === 'delete') {
		await deleteByPath(ctx, mode.entity, mode.pathKey, path);
		return;
	}

	if (mode.mode === 'deleteComposite') {
		await deleteComposite(ctx, mode.entity, mode.keys, mode.joiner, path);
		return;
	}

	const { singles, lists } = unwrapApifyResponse(response);

	if (mode.mode === 'list') {
		for (const list of lists) {
			for (const row of list) {
				await upsertRow(ctx, mode.entity, row, path);
			}
		}
		// Some endpoints return a single object where we expected a list
		if (lists.length === 0 && singles.length > 0) {
			for (const row of singles) {
				await upsertRow(ctx, mode.entity, row, path);
			}
		}
		return;
	}

	// upsert
	for (const row of singles) {
		await upsertRow(ctx, mode.entity, row, path);
	}
	for (const list of lists) {
		for (const row of list) {
			await upsertRow(ctx, mode.entity, row, path);
		}
	}
}

function webhookEntityForEvent(eventType: string): ApifyEntityKey | undefined {
	if (eventType.startsWith('ACTOR.RUN.')) return 'actorRuns';
	if (eventType.startsWith('ACTOR.BUILD.')) return 'actorBuilds';
	if (eventType.startsWith('ACTOR.TASK.')) return 'actorTasks';
	if (eventType.startsWith('ACTOR.')) return 'actors';
	if (eventType.startsWith('SCHEDULE.')) return 'schedules';
	if (eventType.startsWith('DATASET.')) return 'datasets';
	return undefined;
}

/**
 * Updates the entity store from webhook payloads when the resource includes an id.
 */
export async function persistApifyWebhookPayload(
	ctx: ApifyContext,
	payload: ApifyWebhookPayload,
): Promise<void> {
	const entity = webhookEntityForEvent(payload.eventType);
	if (!entity) return;

	const resource = payload.resource;
	if (!resource || typeof resource !== 'object') return;

	const row = resource as Record<string, unknown>;
	await upsertRow(ctx, entity, row, undefined);
}
