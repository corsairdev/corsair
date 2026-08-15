import type {
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

export async function cacheUnit(
	store: EntityStore<AltovizUnitEntity> | undefined,
	unit:
		| {
				id: number;
				code?: string | null;
				name?: string | null;
				type?: string | null;
				conversion?: number | null;
				decimals?: number | null;
		  }
		| undefined
		| null,
) {
	if (!store || !unit) return;
	await safely(
		() =>
			store.upsertByEntityId(String(unit.id), {
				id: unit.id,
				code: unit.code ?? null,
				name: unit.name ?? null,
				type: unit.type ?? null,
				conversion: unit.conversion ?? null,
				decimals: unit.decimals ?? null,
			}),
		`unit ${unit.id}`,
	);
}

export async function cacheVat(
	store: EntityStore<AltovizVatEntity> | undefined,
	vat:
		| {
				id: number;
				rate?: number | null;
				region?: string | null;
				label?: string | null;
				default?: boolean | null;
		  }
		| undefined
		| null,
) {
	if (!store || !vat) return;
	await safely(
		() =>
			store.upsertByEntityId(String(vat.id), {
				id: vat.id,
				rate: vat.rate ?? null,
				region: vat.region ?? null,
				label: vat.label ?? null,
				default: vat.default ?? null,
			}),
		`vat ${vat.id}`,
	);
}

export async function cacheClassification(
	store: EntityStore<AltovizClassificationEntity> | undefined,
	classification:
		| {
				id: number;
				label?: string | null;
				type?: string | null;
				accountNumber?: string | null;
				isProduct?: boolean | null;
				isService?: boolean | null;
		  }
		| undefined
		| null,
) {
	if (!store || !classification) return;
	await safely(
		() =>
			store.upsertByEntityId(String(classification.id), {
				id: classification.id,
				label: classification.label ?? null,
				type: classification.type ?? null,
				accountNumber: classification.accountNumber ?? null,
				isProduct: classification.isProduct ?? null,
				isService: classification.isService ?? null,
			}),
		`classification ${classification.id}`,
	);
}

export async function cacheCustomerFamily(
	store: EntityStore<AltovizCustomerFamilyEntity> | undefined,
	family:
		| {
				id: number;
				label?: string | null;
				number?: string | null;
				internalId?: string | null;
		  }
		| undefined
		| null,
) {
	if (!store || !family) return;
	await safely(
		() =>
			store.upsertByEntityId(String(family.id), {
				id: family.id,
				label: family.label ?? null,
				number: family.number ?? null,
				internalId: family.internalId ?? null,
			}),
		`customer family ${family.id}`,
	);
}

export async function cacheProductFamily(
	store: EntityStore<AltovizProductFamilyEntity> | undefined,
	family:
		| { id: number; label?: string | null; number?: string | null }
		| undefined
		| null,
) {
	if (!store || !family) return;
	await safely(
		() =>
			store.upsertByEntityId(String(family.id), {
				id: family.id,
				label: family.label ?? null,
				number: family.number ?? null,
			}),
		`product family ${family.id}`,
	);
}

/** `imageUrl`, `internalNotes` etc. are omitted from the mirror deliberately - this is a lookup cache, not a full replica. */
export async function cacheProduct(
	store: EntityStore<AltovizProductEntity> | undefined,
	product:
		| {
				id: number;
				name?: string | null;
				number?: string | null;
				internalId?: string | null;
				type?: string | null;
				active?: boolean | null;
				unitPrice?: number | null;
				unit?: { code?: string | null } | null;
				vat?: { rate?: number | null; region?: string | null } | null;
				family?: { id?: number | null } | null;
		  }
		| undefined
		| null,
) {
	if (!store || !product) return;
	await safely(
		() =>
			store.upsertByEntityId(String(product.id), {
				id: product.id,
				name: product.name ?? null,
				number: product.number ?? null,
				internalId: product.internalId ?? null,
				type: product.type ?? null,
				active: product.active ?? null,
				unitPrice: product.unitPrice ?? null,
				unit_code: product.unit?.code ?? null,
				vat_rate: product.vat?.rate ?? null,
				vat_region: product.vat?.region ?? null,
				family_id: product.family?.id ?? null,
			}),
		`product ${product.id}`,
	);
}

export async function cacheCustomer(
	store: EntityStore<AltovizCustomerEntity> | undefined,
	customer:
		| {
				id: number;
				type?: string | null;
				companyName?: string | null;
				firstName?: string | null;
				lastName?: string | null;
				number?: string | null;
				internalId?: string | null;
				email?: string | null;
				active?: boolean | null;
		  }
		| undefined
		| null,
) {
	if (!store || !customer) return;
	await safely(
		() =>
			store.upsertByEntityId(String(customer.id), {
				id: customer.id,
				type: customer.type ?? null,
				companyName: customer.companyName ?? null,
				firstName: customer.firstName ?? null,
				lastName: customer.lastName ?? null,
				number: customer.number ?? null,
				internalId: customer.internalId ?? null,
				email: customer.email ?? null,
				active: customer.active ?? null,
			}),
		`customer ${customer.id}`,
	);
}

export async function cacheContact(
	store: EntityStore<AltovizContactEntity> | undefined,
	contact:
		| {
				id: number;
				displayName?: string | null;
				firstName?: string | null;
				lastName?: string | null;
				companyName?: string | null;
				email?: string | null;
				internalId?: string | null;
		  }
		| undefined
		| null,
) {
	if (!store || !contact) return;
	await safely(
		() =>
			store.upsertByEntityId(String(contact.id), {
				id: contact.id,
				displayName: contact.displayName ?? null,
				firstName: contact.firstName ?? null,
				lastName: contact.lastName ?? null,
				companyName: contact.companyName ?? null,
				email: contact.email ?? null,
				internalId: contact.internalId ?? null,
			}),
		`contact ${contact.id}`,
	);
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
 * Deleting a customer or supplier therefore fetches its contacts first - the
 * only way to know which cached contact rows belong to it - and evicts each
 * one after the parent delete succeeds. Best-effort: a failed lookup here
 * must not block or fail the parent delete itself.
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
