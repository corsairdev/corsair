import type { z } from 'zod';

/**
 * Minimal structural view of a Corsair entity store. `data` is typed - it is
 * always the schema-validated, entity-specific shape by the time it reaches
 * here. The `Promise<unknown>` return is deliberately untyped: this module
 * never reads a store write's resolved value, only whether it rejected (see
 * `safely` below), so there is nothing to gain from typing a value that is
 * always discarded.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

/** The eviction half of the same store, needed only by the delete operations. Same reasoning on `Promise<unknown>` as `EntityStore` above. */
type EntityEvictor = {
	deleteByEntityId: (entityId: string) => Promise<unknown>;
};

/** Mirroring is best-effort: a plugin call must not fail because the local copy could not be written or removed. */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[DOPPLER] ${what}:`, error);
	}
}

const defaultEntityId = <T>(parsed: T): string | undefined => {
	const id = (parsed as { id?: unknown }).id;
	return typeof id === 'string' || typeof id === 'number'
		? String(id)
		: undefined;
};

/**
 * Some Doppler entities key by a field other than `id` - a config by its
 * `name` (unique only per-project, so callers must pass a composite entityId
 * for configs), a workplace by its singleton `id`. Kept overridable per call
 * site rather than assumed.
 */
type EntityIdOf<T> = (parsed: T) => string | undefined;

/**
 * Mirrors one record. Skips (with a warning) anything the schema rejects.
 *
 * `record` is `unknown`, not `z.infer<Schema>`, on purpose: the caller
 * passes a raw API response object here, not something already known to
 * match the entity shape - `schema.safeParse` below is what establishes
 * that, and is the only place in this function that trusts the value's
 * shape. Narrowing the parameter type would just move an unsafe cast to
 * every call site instead of parsing it once here.
 */
export async function cacheEntity<Schema extends z.ZodType>(
	store: EntityStore<z.infer<Schema>> | undefined,
	schema: Schema,
	record: unknown,
	options: { label: string; entityId?: EntityIdOf<z.infer<Schema>> },
): Promise<void> {
	if (!store || record == null) return;

	const parsed = schema.safeParse(record);
	if (!parsed.success) {
		console.warn(
			`[DOPPLER] skipped caching a ${options.label} that does not match its schema:`,
			parsed.error.issues,
		);
		return;
	}

	const entityId = (options.entityId ?? defaultEntityId)(parsed.data);
	if (!entityId) return;

	await safely(
		() => store.upsertByEntityId(entityId, parsed.data),
		`failed to cache ${options.label} ${entityId}`,
	);
}

/**
 * Mirrors many records, skipping any the schema rejects or that have no key.
 * `records` is `unknown[]`, not `z.infer<Schema>[]`, for the same reason
 * `cacheEntity`'s `record` param is - each element is validated individually
 * by the `cacheEntity` call below, not assumed to already match.
 */
export async function cacheEntities<Schema extends z.ZodType>(
	store: EntityStore<z.infer<Schema>> | undefined,
	schema: Schema,
	records: readonly unknown[] | undefined | null,
	options: { label: string; entityId?: EntityIdOf<z.infer<Schema>> },
): Promise<void> {
	if (!store || !records || records.length === 0) return;
	for (const record of records) {
		await cacheEntity(store, schema, record, options);
	}
}

/**
 * Drops a record from the local mirror after Doppler has deleted it.
 *
 * Pass `required: true` when leaving the row behind would breach something
 * the plugin promises rather than merely leave the cache stale.
 */
export async function evictEntity(
	store: EntityEvictor | undefined,
	entityId: string | undefined | null,
	label: string,
	options: { required?: boolean } = {},
): Promise<void> {
	if (!store || entityId == null) return;

	if (!options.required) {
		await safely(
			() => store.deleteByEntityId(entityId),
			`failed to evict ${label} ${entityId}`,
		);
		return;
	}

	try {
		await store.deleteByEntityId(entityId);
	} catch (error) {
		console.error(
			`[DOPPLER] required eviction of ${label} ${entityId} failed - the local mirror still holds it:`,
			error,
		);
		throw error;
	}
}
