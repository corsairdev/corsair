import type {
	BetterstackHeartbeatGroups,
	BetterstackHeartbeats,
	BetterstackMonitorGroups,
	BetterstackMonitors,
	BetterstackOnCallSchedules,
	BetterstackPolicies,
	BetterstackStatusPages,
	BetterstackUrgencies,
} from '../schema/database';
import type { BetterstackResource } from './shared';

/**
 * Minimal structural view of a Corsair entity store, generic in the row type so
 * each helper stays assignable from the concrete typed store Corsair builds
 * from the zod schema. Only the two operations the endpoints need are declared.
 */
export type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

/**
 * Caching is best-effort: a plugin call must not fail because the local mirror
 * could not be written.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[BETTERSTACK] failed to cache ${what}:`, error);
	}
}

/**
 * Flattens the JSON:API envelope into a row. The id is promoted out of the
 * envelope; `created_at`/`updated_at` are coerced to Date where present.
 */
function toRow(resource: BetterstackResource): Record<string, unknown> {
	const attributes = (resource.attributes ?? {}) as Record<string, unknown>;
	const row: Record<string, unknown> = {
		...attributes,
		id: String(resource.id),
	};
	for (const key of ['created_at', 'updated_at']) {
		// An absent key must not overwrite a previously mirrored timestamp with null.
		if (!(key in attributes)) continue;
		const value = attributes[key];
		row[key] = typeof value === 'string' ? new Date(value) : null;
	}
	return row;
}

/** Mirrors a monitors row into the local cache. */
export async function cacheMonitors(
	store: EntityStore<BetterstackMonitors> | undefined,
	resource: BetterstackResource | undefined | null,
) {
	if (!store || !resource?.id) return;
	const row = toRow(resource) as BetterstackMonitors;
	await safely(
		() => store.upsertByEntityId(String(resource.id), row),
		'monitors ' + resource.id,
	);
}

/** Mirrors every monitors row in a list response. */
export async function cacheMonitorsList(
	store: EntityStore<BetterstackMonitors> | undefined,
	resources: BetterstackResource[] | undefined | null,
) {
	if (!store || !resources?.length) return;
	for (const resource of resources) {
		await cacheMonitors(store, resource);
	}
}

/** Evicts a monitors row after the provider deleted it. */
export async function evictMonitors(
	store: EntityStore<BetterstackMonitors> | undefined,
	id: string | number | undefined,
) {
	const remove = store?.deleteByEntityId;
	if (!store || !remove || id === undefined || id === null) return;
	await safely(() => remove.call(store, String(id)), 'monitors ' + id);
}

/** Mirrors a monitor-groups row into the local cache. */
export async function cacheMonitorGroups(
	store: EntityStore<BetterstackMonitorGroups> | undefined,
	resource: BetterstackResource | undefined | null,
) {
	if (!store || !resource?.id) return;
	const row = toRow(resource) as BetterstackMonitorGroups;
	await safely(
		() => store.upsertByEntityId(String(resource.id), row),
		'monitor-groups ' + resource.id,
	);
}

/** Mirrors every monitor-groups row in a list response. */
export async function cacheMonitorGroupsList(
	store: EntityStore<BetterstackMonitorGroups> | undefined,
	resources: BetterstackResource[] | undefined | null,
) {
	if (!store || !resources?.length) return;
	for (const resource of resources) {
		await cacheMonitorGroups(store, resource);
	}
}

/** Evicts a monitor-groups row after the provider deleted it. */
export async function evictMonitorGroups(
	store: EntityStore<BetterstackMonitorGroups> | undefined,
	id: string | number | undefined,
) {
	const remove = store?.deleteByEntityId;
	if (!store || !remove || id === undefined || id === null) return;
	await safely(() => remove.call(store, String(id)), 'monitor-groups ' + id);
}

/** Mirrors a heartbeats row into the local cache. */
export async function cacheHeartbeats(
	store: EntityStore<BetterstackHeartbeats> | undefined,
	resource: BetterstackResource | undefined | null,
) {
	if (!store || !resource?.id) return;
	const row = toRow(resource) as BetterstackHeartbeats;
	await safely(
		() => store.upsertByEntityId(String(resource.id), row),
		'heartbeats ' + resource.id,
	);
}

/** Mirrors every heartbeats row in a list response. */
export async function cacheHeartbeatsList(
	store: EntityStore<BetterstackHeartbeats> | undefined,
	resources: BetterstackResource[] | undefined | null,
) {
	if (!store || !resources?.length) return;
	for (const resource of resources) {
		await cacheHeartbeats(store, resource);
	}
}

/** Evicts a heartbeats row after the provider deleted it. */
export async function evictHeartbeats(
	store: EntityStore<BetterstackHeartbeats> | undefined,
	id: string | number | undefined,
) {
	const remove = store?.deleteByEntityId;
	if (!store || !remove || id === undefined || id === null) return;
	await safely(() => remove.call(store, String(id)), 'heartbeats ' + id);
}

/** Mirrors a heartbeat-groups row into the local cache. */
export async function cacheHeartbeatGroups(
	store: EntityStore<BetterstackHeartbeatGroups> | undefined,
	resource: BetterstackResource | undefined | null,
) {
	if (!store || !resource?.id) return;
	const row = toRow(resource) as BetterstackHeartbeatGroups;
	await safely(
		() => store.upsertByEntityId(String(resource.id), row),
		'heartbeat-groups ' + resource.id,
	);
}

/** Mirrors every heartbeat-groups row in a list response. */
export async function cacheHeartbeatGroupsList(
	store: EntityStore<BetterstackHeartbeatGroups> | undefined,
	resources: BetterstackResource[] | undefined | null,
) {
	if (!store || !resources?.length) return;
	for (const resource of resources) {
		await cacheHeartbeatGroups(store, resource);
	}
}

/** Evicts a heartbeat-groups row after the provider deleted it. */
export async function evictHeartbeatGroups(
	store: EntityStore<BetterstackHeartbeatGroups> | undefined,
	id: string | number | undefined,
) {
	const remove = store?.deleteByEntityId;
	if (!store || !remove || id === undefined || id === null) return;
	await safely(() => remove.call(store, String(id)), 'heartbeat-groups ' + id);
}

/** Mirrors a policies row into the local cache. */
export async function cachePolicies(
	store: EntityStore<BetterstackPolicies> | undefined,
	resource: BetterstackResource | undefined | null,
) {
	if (!store || !resource?.id) return;
	const row = toRow(resource) as BetterstackPolicies;
	await safely(
		() => store.upsertByEntityId(String(resource.id), row),
		'policies ' + resource.id,
	);
}

/** Mirrors every policies row in a list response. */
export async function cachePoliciesList(
	store: EntityStore<BetterstackPolicies> | undefined,
	resources: BetterstackResource[] | undefined | null,
) {
	if (!store || !resources?.length) return;
	for (const resource of resources) {
		await cachePolicies(store, resource);
	}
}

/** Evicts a policies row after the provider deleted it. */
export async function evictPolicies(
	store: EntityStore<BetterstackPolicies> | undefined,
	id: string | number | undefined,
) {
	const remove = store?.deleteByEntityId;
	if (!store || !remove || id === undefined || id === null) return;
	await safely(() => remove.call(store, String(id)), 'policies ' + id);
}

/** Mirrors a urgencies row into the local cache. */
export async function cacheUrgencies(
	store: EntityStore<BetterstackUrgencies> | undefined,
	resource: BetterstackResource | undefined | null,
) {
	if (!store || !resource?.id) return;
	const row = toRow(resource) as BetterstackUrgencies;
	await safely(
		() => store.upsertByEntityId(String(resource.id), row),
		'urgencies ' + resource.id,
	);
}

/** Mirrors every urgencies row in a list response. */
export async function cacheUrgenciesList(
	store: EntityStore<BetterstackUrgencies> | undefined,
	resources: BetterstackResource[] | undefined | null,
) {
	if (!store || !resources?.length) return;
	for (const resource of resources) {
		await cacheUrgencies(store, resource);
	}
}

/** Evicts a urgencies row after the provider deleted it. */
export async function evictUrgencies(
	store: EntityStore<BetterstackUrgencies> | undefined,
	id: string | number | undefined,
) {
	const remove = store?.deleteByEntityId;
	if (!store || !remove || id === undefined || id === null) return;
	await safely(() => remove.call(store, String(id)), 'urgencies ' + id);
}

/** Mirrors a status-pages row into the local cache. */
export async function cacheStatusPages(
	store: EntityStore<BetterstackStatusPages> | undefined,
	resource: BetterstackResource | undefined | null,
) {
	if (!store || !resource?.id) return;
	const row = toRow(resource) as BetterstackStatusPages;
	await safely(
		() => store.upsertByEntityId(String(resource.id), row),
		'status-pages ' + resource.id,
	);
}

/** Mirrors every status-pages row in a list response. */
export async function cacheStatusPagesList(
	store: EntityStore<BetterstackStatusPages> | undefined,
	resources: BetterstackResource[] | undefined | null,
) {
	if (!store || !resources?.length) return;
	for (const resource of resources) {
		await cacheStatusPages(store, resource);
	}
}

/** Evicts a status-pages row after the provider deleted it. */
export async function evictStatusPages(
	store: EntityStore<BetterstackStatusPages> | undefined,
	id: string | number | undefined,
) {
	const remove = store?.deleteByEntityId;
	if (!store || !remove || id === undefined || id === null) return;
	await safely(() => remove.call(store, String(id)), 'status-pages ' + id);
}

/** Mirrors a on-call-schedules row into the local cache. */
export async function cacheOnCallSchedules(
	store: EntityStore<BetterstackOnCallSchedules> | undefined,
	resource: BetterstackResource | undefined | null,
) {
	if (!store || !resource?.id) return;
	const row = toRow(resource) as BetterstackOnCallSchedules;
	await safely(
		() => store.upsertByEntityId(String(resource.id), row),
		'on-call-schedules ' + resource.id,
	);
}

/** Mirrors every on-call-schedules row in a list response. */
export async function cacheOnCallSchedulesList(
	store: EntityStore<BetterstackOnCallSchedules> | undefined,
	resources: BetterstackResource[] | undefined | null,
) {
	if (!store || !resources?.length) return;
	for (const resource of resources) {
		await cacheOnCallSchedules(store, resource);
	}
}

/** Evicts a on-call-schedules row after the provider deleted it. */
export async function evictOnCallSchedules(
	store: EntityStore<BetterstackOnCallSchedules> | undefined,
	id: string | number | undefined,
) {
	const remove = store?.deleteByEntityId;
	if (!store || !remove || id === undefined || id === null) return;
	await safely(() => remove.call(store, String(id)), 'on-call-schedules ' + id);
}
