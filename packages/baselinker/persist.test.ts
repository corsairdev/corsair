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

afterEach(() => {
	jest.restoreAllMocks();
});

describe('BaseLinker reference mirrors', () => {
	it('mirrors array-shaped collections by natural provider id', async () => {
		const couriers = store();
		await mirrorOperationResult({ couriers }, 'getCouriersList', {
			status: 'SUCCESS',
			couriers: [{ code: 'dpd', name: 'DPD' }],
		});
		expect(couriers.upsertByEntityId).toHaveBeenCalledWith(
			'dpd',
			expect.objectContaining({ name: 'DPD' }),
		);
	});

	it('mirrors return reasons from the return_reasons envelope by return_reason_id', async () => {
		const returnReasons = store();
		await mirrorOperationResult(
			{ returnReasons },
			'getOrderReturnReasonsList',
			{
				status: 'SUCCESS',
				return_reasons: [{ return_reason_id: 7, name: 'Damaged' }],
			},
		);
		expect(returnReasons.upsertByEntityId).toHaveBeenCalledWith(
			'7',
			expect.objectContaining({ name: 'Damaged' }),
		);
	});

	it('mirrors return product statuses from the order_return_product_statuses envelope', async () => {
		const returnProductStatuses = store();
		await mirrorOperationResult(
			{ returnProductStatuses },
			'getOrderReturnProductStatuses',
			{
				status: 'SUCCESS',
				order_return_product_statuses: [{ status_id: 3, name: 'Accepted' }],
			},
		);
		expect(returnProductStatuses.upsertByEntityId).toHaveBeenCalledWith(
			'3',
			expect.objectContaining({ name: 'Accepted' }),
		);
	});

	it('flattens Connect integrations nested under own/connected arrays', async () => {
		const connectIntegrations = store();
		await mirrorOperationResult(
			{ connectIntegrations },
			'getConnectIntegrations',
			{
				status: 'SUCCESS',
				integrations: {
					own_integrations: [{ connect_integration_id: 5, name: 'Own' }],
					connected_integrations: [
						{ connect_integration_id: 9, name: 'Linked' },
					],
				},
			},
		);
		expect(connectIntegrations.upsertByEntityId).toHaveBeenCalledWith(
			'5',
			expect.objectContaining({ name: 'Own' }),
		);
		expect(connectIntegrations.upsertByEntityId).toHaveBeenCalledWith(
			'9',
			expect.objectContaining({ name: 'Linked' }),
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
