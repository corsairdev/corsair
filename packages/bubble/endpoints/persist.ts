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

/** The eviction half of the same store, needed only by the delete operation. Same reasoning on `Promise<unknown>` as `EntityStore` above. */
type EntityEvictor = {
	deleteByEntityId: (entityId: string) => Promise<unknown>;
};

/** Mirroring is best-effort: a plugin call must not fail because the local copy could not be written or removed. */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[BUBBLE] ${what}:`, error);
	}
}

/** Every Bubble thing keys on its document `_id`, always present on reads. */
const defaultEntityId = <T>(parsed: T): string | undefined => {
	const id = (parsed as { _id?: unknown })._id;
	return typeof id === 'string' ? id : undefined;
};

/**
 * Mirrors one record. Skips (with a warning) anything the schema rejects.
 *
 * `record` is `unknown`, not `z.infer<Schema>`, on purpose: the caller
 * passes a raw API response object here, not something already known to
 * match the entity shape - `schema.safeParse` below is what establishes
 * that, and is the only place in this function that trusts the value's
 * shape.
 */
export async function cacheEntity<Schema extends z.ZodType>(
	store: EntityStore<z.infer<Schema>> | undefined,
	schema: Schema,
	record: unknown,
	options: { label: string },
): Promise<void> {
	if (!store || record == null) return;

	const parsed = schema.safeParse(record);
	if (!parsed.success) {
		console.warn(
			`[BUBBLE] skipped caching a ${options.label} that does not match its schema:`,
			parsed.error.issues,
		);
		return;
	}

	const entityId = defaultEntityId(parsed.data);
	if (!entityId) return;

	await safely(
		() => store.upsertByEntityId(entityId, parsed.data),
		`failed to cache ${options.label} ${entityId}`,
	);
}

/** Mirrors many records, skipping any the schema rejects or that have no key. */
export async function cacheEntities<Schema extends z.ZodType>(
	store: EntityStore<z.infer<Schema>> | undefined,
	schema: Schema,
	records: readonly unknown[] | undefined | null,
	options: { label: string },
): Promise<void> {
	if (!store || !records || records.length === 0) return;
	for (const record of records) {
		await cacheEntity(store, schema, record, options);
	}
}

/** Drops a record from the local mirror after Bubble has deleted or rewritten it. */
export async function evictEntity(
	store: EntityEvictor | undefined,
	entityId: string | undefined | null,
	label: string,
): Promise<void> {
	if (!store || entityId == null) return;

	await safely(
		() => store.deleteByEntityId(entityId),
		`failed to evict ${label} ${entityId}`,
	);
}
