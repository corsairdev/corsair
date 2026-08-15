import type { BaseLinkerMethod } from './operations';

type EntityStore = {
	upsertByEntityId: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

type StoreMap = Record<string, EntityStore | undefined>;
type MirrorSpec = {
	store: string;
	responseField: string;
	idFields: readonly string[];
};

const MIRROR_SPECS: Partial<Record<BaseLinkerMethod, MirrorSpec>> = {
	getInventories: {
		store: 'inventories',
		responseField: 'inventories',
		idFields: ['inventory_id', 'id'],
	},
	getInventoryCategories: {
		store: 'categories',
		responseField: 'categories',
		idFields: ['category_id', 'id'],
	},
	getInventoryManufacturers: {
		store: 'manufacturers',
		responseField: 'manufacturers',
		idFields: ['manufacturer_id', 'id'],
	},
	getInventoryPriceGroups: {
		store: 'priceGroups',
		responseField: 'price_groups',
		idFields: ['price_group_id', 'id'],
	},
	getInventoryWarehouses: {
		store: 'warehouses',
		responseField: 'warehouses',
		idFields: ['warehouse_id', 'id'],
	},
	getInventorySuppliers: {
		store: 'suppliers',
		responseField: 'suppliers',
		idFields: ['supplier_id', 'id'],
	},
	getInventoryPayers: {
		store: 'payers',
		responseField: 'payers',
		idFields: ['payer_id', 'id'],
	},
	getInventoryTags: {
		store: 'tags',
		responseField: 'tags',
		idFields: ['tag_id', 'id'],
	},
	getInventoryExtraFields: {
		store: 'inventoryExtraFields',
		responseField: 'extra_fields',
		idFields: ['extra_field_id', 'id'],
	},
	getOrderStatusList: {
		store: 'orderStatuses',
		responseField: 'statuses',
		idFields: ['id', 'status_id'],
	},
	getOrderReturnStatusList: {
		store: 'returnStatuses',
		responseField: 'statuses',
		idFields: ['id', 'status_id'],
	},
	getOrderReturnReasonsList: {
		store: 'returnReasons',
		responseField: 'reasons',
		idFields: ['id', 'reason_id'],
	},
	getOrderReturnProductStatuses: {
		store: 'returnProductStatuses',
		responseField: 'statuses',
		idFields: ['id', 'status_id'],
	},
	getCouriersList: {
		store: 'couriers',
		responseField: 'couriers',
		idFields: ['courier_code', 'code', 'id'],
	},
	getExternalStoragesList: {
		store: 'externalStorages',
		responseField: 'storages',
		idFields: ['storage_id', 'id'],
	},
	getConnectIntegrations: {
		store: 'connectIntegrations',
		responseField: 'integrations',
		idFields: ['connect_integration_id', 'integration_id', 'id'],
	},
};

const EVICT_SPECS: Partial<
	Record<BaseLinkerMethod, { store: string; inputField: string }>
> = {
	deleteInventory: { store: 'inventories', inputField: 'inventory_id' },
	deleteInventoryCategory: { store: 'categories', inputField: 'category_id' },
	deleteInventoryManufacturer: {
		store: 'manufacturers',
		inputField: 'manufacturer_id',
	},
	deleteInventoryPayer: { store: 'payers', inputField: 'payer_id' },
	deleteInventoryPriceGroup: {
		store: 'priceGroups',
		inputField: 'price_group_id',
	},
	deleteInventoryWarehouse: { store: 'warehouses', inputField: 'warehouse_id' },
};

function rowsOf(
	value: unknown,
): Array<{ key?: string; row: Record<string, unknown> }> {
	if (Array.isArray(value)) {
		return value
			.filter(
				(row): row is Record<string, unknown> =>
					row !== null && typeof row === 'object' && !Array.isArray(row),
			)
			.map((row) => ({ row }));
	}
	if (value !== null && typeof value === 'object') {
		return Object.entries(value).flatMap(([key, row]) =>
			row !== null && typeof row === 'object' && !Array.isArray(row)
				? [{ key, row: row as Record<string, unknown> }]
				: [],
		);
	}
	return [];
}

async function safely(operation: () => Promise<unknown>, label: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[BASELINKER] failed to update local ${label} cache:`, error);
	}
}

export async function mirrorOperationResult(
	db: unknown,
	method: BaseLinkerMethod,
	response: Record<string, unknown>,
) {
	const spec = MIRROR_SPECS[method];
	if (!spec || db === null || typeof db !== 'object') return;
	const store = (db as StoreMap)[spec.store];
	if (!store) return;

	for (const { key, row } of rowsOf(response[spec.responseField])) {
		const id =
			spec.idFields
				.map((field) => row[field])
				.find(
					(value) => typeof value === 'string' || typeof value === 'number',
				) ?? key;
		if (id === undefined) continue;
		await safely(
			() => store.upsertByEntityId(String(id), row),
			`${spec.store} ${String(id)}`,
		);
	}
}

export async function evictOperationResult(
	db: unknown,
	method: BaseLinkerMethod,
	input: Record<string, unknown>,
) {
	const spec = EVICT_SPECS[method];
	if (!spec || db === null || typeof db !== 'object') return;
	const id = input[spec.inputField];
	if (typeof id !== 'string' && typeof id !== 'number') return;
	const remove = (db as StoreMap)[spec.store]?.deleteByEntityId;
	if (!remove) return;
	await safely(() => remove(String(id)), `${spec.store} ${String(id)}`);
}
