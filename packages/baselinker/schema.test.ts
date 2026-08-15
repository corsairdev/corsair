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
			returnReasons: { id: 1 },
			returnProductStatuses: { id: 1 },
			couriers: { courier_code: 'courier' },
			externalStorages: { storage_id: 'shop_1' },
			connectIntegrations: { integration_id: 1 },
		};

		for (const [name, schema] of Object.entries(BaseLinkerSchema.entities)) {
			expect(
				schema.safeParse(fixtures[name as keyof typeof fixtures]).success,
			).toBe(true);
		}
	});
});
