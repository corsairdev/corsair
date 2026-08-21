import type { ZodType } from 'zod';
import {
	AltovizClassificationEntity,
	AltovizContactEntity,
	AltovizCustomerEntity,
	AltovizCustomerFamilyEntity,
	AltovizProductEntity,
	AltovizProductFamilyEntity,
	AltovizUnitEntity,
	AltovizVatEntity,
} from '../schema/database';

/**
 * Minimal structural view of a Corsair entity store - only the operations
 * these helpers need, so they stay usable whatever else the concrete store
 * exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

/** Caching is best-effort: a plugin call must not fail because the local mirror could not be written. */
function describeError(error: unknown): string {
	if (error instanceof Error) return `${error.name}: ${error.message}`;
	return 'unknown';
}

async function safely(
	operation: () => Promise<unknown>,
	action: 'cache' | 'evict',
	what: string,
) {
	try {
		await operation();
	} catch (error) {
		console.warn(
			`[ALTOVIZ] failed to ${action} ${what}: ${describeError(error)}`,
		);
	}
}

async function cacheParsed<T extends { id: number }>(
	store: EntityStore<T> | undefined,
	schema: ZodType<T>,
	row: unknown,
	what: string,
) {
	if (!store || row == null) return;
	const parsed = schema.safeParse(row);
	if (!parsed.success) return;
	await safely(
		() => store.upsertByEntityId(String(parsed.data.id), parsed.data),
		'cache',
		`${what} ${parsed.data.id}`,
	);
}

export async function cacheUnit(
	store: EntityStore<AltovizUnitEntity> | undefined,
	unit: unknown,
) {
	await cacheParsed(store, AltovizUnitEntity, unit, 'unit');
}

export async function cacheVat(
	store: EntityStore<AltovizVatEntity> | undefined,
	vat: unknown,
) {
	await cacheParsed(store, AltovizVatEntity, vat, 'vat');
}

export async function cacheClassification(
	store: EntityStore<AltovizClassificationEntity> | undefined,
	classification: unknown,
) {
	await cacheParsed(
		store,
		AltovizClassificationEntity,
		classification,
		'classification',
	);
}

export async function cacheCustomerFamily(
	store: EntityStore<AltovizCustomerFamilyEntity> | undefined,
	family: unknown,
) {
	await cacheParsed(
		store,
		AltovizCustomerFamilyEntity,
		family,
		'customer family',
	);
}

export async function cacheProductFamily(
	store: EntityStore<AltovizProductFamilyEntity> | undefined,
	family: unknown,
) {
	await cacheParsed(
		store,
		AltovizProductFamilyEntity,
		family,
		'product family',
	);
}

export async function cacheProduct(
	store: EntityStore<AltovizProductEntity> | undefined,
	product: unknown,
) {
	await cacheParsed(store, AltovizProductEntity, product, 'product');
}

export async function cacheCustomer(
	store: EntityStore<AltovizCustomerEntity> | undefined,
	customer: unknown,
) {
	await cacheParsed(store, AltovizCustomerEntity, customer, 'customer');
}

export async function cacheContact(
	store: EntityStore<AltovizContactEntity> | undefined,
	contact: unknown,
) {
	await cacheParsed(store, AltovizContactEntity, contact, 'contact');
}

/**
 * Drops a cached record after the provider confirmed the delete. Takes only
 * the delete half of the store signature so the parameter stays covariant
 * across the different concrete per-entity clients.
 */
type DeletableStore = {
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

export async function evictEntity(
	store: DeletableStore | undefined,
	id: number,
	what: string,
) {
	const remove = store?.deleteByEntityId;
	if (!remove) return;
	await safely(() => remove(String(id)), 'evict', `${what} ${id}`);
}

/**
 * Creating a customer or supplier auto-creates a contact from its name fields
 * (confirmed live: `GET .../contacts` returns it with `isMain: true`), and
 * deleting the parent does NOT delete that contact. Fetch the list while the
 * parent still exists, then evict after the delete succeeds. Best-effort: a
 * failed lookup must not block the parent delete.
 */
export async function fetchContactsForParent(
	fetchContacts: () => Promise<Array<{ id: number }>>,
	what: string,
): Promise<Array<{ id: number }>> {
	try {
		return await fetchContacts();
	} catch (error) {
		console.warn(
			`[ALTOVIZ] failed to list contacts for ${what}: ${describeError(error)}`,
		);
		return [];
	}
}

export async function evictContacts(
	store: DeletableStore | undefined,
	contacts: Array<{ id: number }>,
	what: string,
) {
	for (const contact of contacts) {
		await evictEntity(store, contact.id, `${what} contact`);
	}
}
