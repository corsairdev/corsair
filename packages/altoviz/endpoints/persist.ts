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
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[ALTOVIZ] failed to cache ${what}:`, error);
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
	await safely(() => remove(String(id)), `${what} ${id}`);
}

/**
 * Creating a customer, supplier or colleague auto-creates a contact from its
 * name fields (confirmed live: `GET .../contacts` returns it with
 * `isMain: true`), and deleting the parent does NOT delete that contact.
 * Deleting a customer or supplier therefore fetches its contacts and evicts
 * their cached rows here, before the parent delete - the contacts route
 * (`.../{id}/contacts`) disappears once the parent is gone, so the lookup has
 * to happen while it still exists. Best-effort: a failed lookup here must not
 * block or fail the parent delete itself.
 */
export async function evictContactsForParent(
	store: DeletableStore | undefined,
	fetchContacts: () => Promise<Array<{ id: number }>>,
	what: string,
) {
	if (!store?.deleteByEntityId) return;
	try {
		const contacts = await fetchContacts();
		for (const contact of contacts) {
			await evictEntity(store, contact.id, `${what} contact`);
		}
	} catch (error) {
		console.warn(`[ALTOVIZ] failed to evict contacts for ${what}:`, error);
	}
}
