import {
	BaseLinkerEndpointInputSchemas,
	BaseLinkerEndpointOutputSchemas,
} from './endpoints/types';
import { BaseLinkerSchema } from './schema';

describe('BaseLinker endpoint schemas', () => {
	it('declares one input and output schema per requested method', () => {
		expect(Object.keys(BaseLinkerEndpointInputSchemas)).toHaveLength(106);
		expect(Object.keys(BaseLinkerEndpointOutputSchemas)).toHaveLength(106);
		expect(Object.keys(BaseLinkerEndpointOutputSchemas)).toEqual(
			Object.keys(BaseLinkerEndpointInputSchemas),
		);
	});

	it('accepts documented successful response envelopes and preserves provider fields', () => {
		const parsed = BaseLinkerEndpointOutputSchemas.getInventories.parse({
			status: 'SUCCESS',
			inventories: [{ inventory_id: 1, name: 'Main' }],
			provider_extension: true,
		});
		expect(parsed.status).toBe('SUCCESS');
		expect(parsed.inventories).toHaveLength(1);
		expect(parsed.provider_extension).toBe(true);
	});

	it('rejects an ERROR envelope at the output boundary', () => {
		const result = BaseLinkerEndpointOutputSchemas.getInventories.safeParse({
			status: 'ERROR',
			error_code: 'ERROR_AUTH_TOKEN',
		});
		expect(result.success).toBe(false);
	});
});

describe('BaseLinker partial-update and filter inputs', () => {
	it('accepts a setOrderFields edit that changes only one field', () => {
		const parsed = BaseLinkerEndpointInputSchemas.setOrderFields.safeParse({
			order_id: 42,
			admin_comments: 'note',
		});
		expect(parsed.success).toBe(true);
	});

	it('still requires the target order_id on setOrderFields', () => {
		const parsed = BaseLinkerEndpointInputSchemas.setOrderFields.safeParse({
			admin_comments: 'note',
		});
		expect(parsed.success).toBe(false);
	});

	it('accepts setOrderProductFields with only its identifiers and quantity', () => {
		const parsed =
			BaseLinkerEndpointInputSchemas.setOrderProductFields.safeParse({
				order_id: 1,
				order_product_id: 2,
				quantity: 5,
			});
		expect(parsed.success).toBe(true);
	});

	it('accepts setOrderReturnProductFields with only its identifiers and a price', () => {
		const parsed =
			BaseLinkerEndpointInputSchemas.setOrderReturnProductFields.safeParse({
				return_id: 1,
				order_return_product_id: 2,
				price_brutto: 9.99,
			});
		expect(parsed.success).toBe(true);
	});

	it('lists order returns without requiring order_id', () => {
		const parsed = BaseLinkerEndpointInputSchemas.getOrderReturns.safeParse({
			date_from: 1_700_000_000,
		});
		expect(parsed.success).toBe(true);
	});

	it('creates a price group without a source group and a product without text fields', () => {
		expect(
			BaseLinkerEndpointInputSchemas.addInventoryPriceGroup.safeParse({
				name: 'Retail',
				currency: 'EUR',
			}).success,
		).toBe(true);
		expect(
			BaseLinkerEndpointInputSchemas.addInventoryProduct.safeParse({
				inventory_id: 1,
				sku: 'ABC',
			}).success,
		).toBe(true);
	});

	it('requests a parcel pickup by package_ids alone', () => {
		const parsed =
			BaseLinkerEndpointInputSchemas.runRequestParcelPickup.safeParse({
				courier_code: 'dpd',
				account_id: 1,
				package_ids: [10],
				fields: [],
			});
		expect(parsed.success).toBe(true);
	});
});

describe('BaseLinker persistence schema', () => {
	it('mirrors broad reference data but no transactional orders or invoices', () => {
		const names = Object.keys(BaseLinkerSchema.entities);
		expect(names).toHaveLength(16);
		expect(names).toContain('inventories');
		expect(names).toContain('couriers');
		expect(names).not.toContain('orders');
		expect(names).not.toContain('invoices');
	});

	it('allows key-only rows for every mirrored entity', () => {
		const fixtures: Record<
			keyof typeof BaseLinkerSchema.entities,
			Record<string, unknown>
		> = {
			inventories: { inventory_id: 1 },
			categories: { category_id: 1 },
			manufacturers: { manufacturer_id: 1 },
			priceGroups: { price_group_id: 1 },
			warehouses: { warehouse_id: 'bl_1' },
			suppliers: { supplier_id: 1 },
			payers: { payer_id: 1 },
			tags: { tag_id: 1 },
			inventoryExtraFields: { extra_field_id: 1 },
			orderStatuses: { id: 1 },
			returnStatuses: { id: 1 },
			returnReasons: { return_reason_id: 1 },
			returnProductStatuses: { status_id: 1 },
			couriers: { code: 'courier' },
			externalStorages: { storage_id: 'shop_1' },
			connectIntegrations: { connect_integration_id: 1 },
		};

		for (const [name, schema] of Object.entries(BaseLinkerSchema.entities)) {
			expect(
				schema.safeParse(fixtures[name as keyof typeof fixtures]).success,
			).toBe(true);
		}
	});
});
