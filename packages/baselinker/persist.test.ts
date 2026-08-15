import {
	evictOperationResult,
	mirrorOperationResult,
} from './endpoints/persist';

function store() {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

describe('BaseLinker reference mirrors', () => {
	it('mirrors array-shaped collections by natural provider id', async () => {
		const couriers = store();
		await mirrorOperationResult({ couriers }, 'getCouriersList', {
			status: 'SUCCESS',
			couriers: [{ courier_code: 'dpd', name: 'DPD' }],
		});
		expect(couriers.upsertByEntityId).toHaveBeenCalledWith(
			'dpd',
			expect.objectContaining({ name: 'DPD' }),
		);
	});

	it('mirrors object-shaped collections using their map keys', async () => {
		const categories = store();
		await mirrorOperationResult({ categories }, 'getInventoryCategories', {
			status: 'SUCCESS',
			categories: { '42': { name: 'Accessories' } },
		});
		expect(categories.upsertByEntityId).toHaveBeenCalledWith(
			'42',
			expect.objectContaining({ name: 'Accessories' }),
		);
	});

	it('evicts a mirrored record only after its delete operation succeeds', async () => {
		const warehouses = store();
		await evictOperationResult({ warehouses }, 'deleteInventoryWarehouse', {
			warehouse_id: 42,
		});
		expect(warehouses.deleteByEntityId).toHaveBeenCalledWith('42');
	});

	it('does not fail provider calls when best-effort cache writes fail', async () => {
		const inventories = store();
		inventories.upsertByEntityId.mockRejectedValueOnce(new Error('offline'));
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		await expect(
			mirrorOperationResult({ inventories }, 'getInventories', {
				status: 'SUCCESS',
				inventories: [{ inventory_id: 1 }],
			}),
		).resolves.toBeUndefined();
		expect(console.warn).toHaveBeenCalled();
	});
});
