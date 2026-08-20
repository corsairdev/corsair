/**
 * Covers schema fidelity.
 *
 * The key lists below are the field names enumerated from live responses on
 * 2026-08-13. The first block asserts that every one of them is declared, so an
 * entity cannot silently lose a field the API actually returns - that was the
 * gap the Alpha Vantage review found.
 *
 * All values are fictional: placeholder ids, `@example.com` addresses and the
 * reserved `+1555xxxx` phone range.
 */
import { LoyverseEndpointInputSchemas } from './endpoints/types';
import { LoyverseSchema } from './schema';
import {
	LoyverseCategoryEntity,
	LoyverseCustomerEntity,
	LoyverseDiscountEntity,
	LoyverseEmployeeEntity,
	LoyverseItemEntity,
	LoyverseMerchantEntity,
	LoyverseModifierEntity,
	LoyversePaymentTypeEntity,
	LoyversePosDeviceEntity,
	LoyverseStoreEntity,
	LoyverseSupplierEntity,
	LoyverseTaxEntity,
	LoyverseVariantEntity,
} from './schema/database';

/** Field names observed on live responses, per entity. */
const CAPTURED_KEYS = {
	items: [
		'category_id',
		'color',
		'components',
		'created_at',
		'deleted_at',
		'description',
		'form',
		'handle',
		'id',
		'image_url',
		'is_composite',
		'item_name',
		'modifier_ids',
		'option1_name',
		'option2_name',
		'option3_name',
		'primary_supplier_id',
		'reference_id',
		'sold_by_weight',
		'tax_ids',
		'track_stock',
		'updated_at',
		'use_production',
		'variants',
	],
	variants: [
		'barcode',
		'cost',
		'created_at',
		'default_price',
		'default_pricing_type',
		'deleted_at',
		'item_id',
		'option1_value',
		'option2_value',
		'option3_value',
		'purchase_cost',
		'reference_variant_id',
		'sku',
		'stores',
		'updated_at',
		'variant_id',
	],
	categories: ['color', 'created_at', 'deleted_at', 'id', 'name'],
	modifiers: [
		'created_at',
		'deleted_at',
		'id',
		'modifier_options',
		'name',
		'position',
		'stores',
		'updated_at',
	],
	discounts: [
		'created_at',
		'deleted_at',
		'discount_percent',
		'id',
		'name',
		'restricted_access',
		'stores',
		'type',
		'updated_at',
	],
	taxes: [
		'created_at',
		'deleted_at',
		'id',
		'name',
		'rate',
		'stores',
		'type',
		'updated_at',
	],
	customers: [
		'address',
		'city',
		'country_code',
		'created_at',
		'customer_code',
		'deleted_at',
		'email',
		'first_visit',
		'id',
		'last_visit',
		'name',
		'note',
		'permanent_deletion_at',
		'phone_number',
		'postal_code',
		'region',
		'total_points',
		'total_spent',
		'total_visits',
		'updated_at',
	],
	suppliers: [
		'address_1',
		'address_2',
		'city',
		'contact',
		'country_code',
		'created_at',
		'deleted_at',
		'email',
		'id',
		'name',
		'note',
		'phone_number',
		'postal_code',
		'region',
		'updated_at',
		'website',
	],
	// `state` and `country` are declared on the entity but are documented-only
	// spellings, never observed, so they are deliberately absent here - this table
	// records what the API actually returned.
	stores: [
		'address',
		'city',
		'country_code',
		'created_at',
		'deleted_at',
		'description',
		'id',
		'name',
		'phone_number',
		'postal_code',
		'region',
		'updated_at',
	],
	employees: [
		'created_at',
		'deleted_at',
		'email',
		'id',
		'is_owner',
		'name',
		'phone_number',
		'stores',
		'updated_at',
	],
	paymentTypes: [
		'created_at',
		'deleted_at',
		'id',
		'name',
		'stores',
		'type',
		'updated_at',
	],
	posDevices: ['activated', 'deleted_at', 'id', 'name', 'store_id'],
	merchant: [
		'business_name',
		'country',
		'created_at',
		'currency',
		'email',
		'id',
	],
} as const;

const ENTITIES = {
	items: LoyverseItemEntity,
	variants: LoyverseVariantEntity,
	categories: LoyverseCategoryEntity,
	modifiers: LoyverseModifierEntity,
	discounts: LoyverseDiscountEntity,
	taxes: LoyverseTaxEntity,
	customers: LoyverseCustomerEntity,
	suppliers: LoyverseSupplierEntity,
	stores: LoyverseStoreEntity,
	employees: LoyverseEmployeeEntity,
	paymentTypes: LoyversePaymentTypeEntity,
	posDevices: LoyversePosDeviceEntity,
	merchant: LoyverseMerchantEntity,
} as const;

describe('captured fields are declared', () => {
	/**
	 * Guards the guard: if the two tables ever diverge the loop below would
	 * quietly stop covering an entity, so the pairing is asserted first.
	 */
	it('covers every registered entity', () => {
		expect(Object.keys(CAPTURED_KEYS).sort()).toEqual(
			Object.keys(ENTITIES).sort(),
		);
		expect(Object.keys(ENTITIES)).toHaveLength(13);
	});

	for (const [name, entity] of Object.entries(ENTITIES)) {
		it(`declares every captured ${name} field`, () => {
			const declared = Object.keys(entity.shape);
			const captured = CAPTURED_KEYS[name as keyof typeof CAPTURED_KEYS];

			expect(captured.length).toBeGreaterThan(0);
			for (const key of captured) {
				expect(declared).toContain(key);
			}
		});
	}
});

describe('only the primary key is required', () => {
	/**
	 * Loyverse nulls or omits most fields depending on which features an account
	 * has enabled, so a record carrying nothing but its key has to parse. A
	 * stricter schema rejects valid rows, and a rejected row is a lost row.
	 */
	const KEY_ONLY: Array<
		[string, { safeParse: (v: unknown) => { success: boolean } }, unknown]
	> = [
		['items', LoyverseItemEntity, { id: 'item-1' }],
		['variants', LoyverseVariantEntity, { variant_id: 'variant-1' }],
		['categories', LoyverseCategoryEntity, { id: 'category-1' }],
		['modifiers', LoyverseModifierEntity, { id: 'modifier-1' }],
		['discounts', LoyverseDiscountEntity, { id: 'discount-1' }],
		['taxes', LoyverseTaxEntity, { id: 'tax-1' }],
		['customers', LoyverseCustomerEntity, { id: 'customer-1' }],
		['suppliers', LoyverseSupplierEntity, { id: 'supplier-1' }],
		['stores', LoyverseStoreEntity, { id: 'store-1' }],
		['employees', LoyverseEmployeeEntity, { id: 'employee-1' }],
		['paymentTypes', LoyversePaymentTypeEntity, { id: 'payment-type-1' }],
		['posDevices', LoyversePosDeviceEntity, { id: 'pos-device-1' }],
		['merchant', LoyverseMerchantEntity, { id: 'merchant-1' }],
	];

	it('covers all 13 entities', () => {
		expect(KEY_ONLY).toHaveLength(13);
	});

	for (const [name, entity, record] of KEY_ONLY) {
		it(`parses a ${name} record carrying only its key`, () => {
			expect(entity.safeParse(record).success).toBe(true);
		});
	}

	it('rejects a record with no key at all', () => {
		expect(
			LoyverseItemEntity.safeParse({ item_name: 'Espresso' }).success,
		).toBe(false);
		expect(LoyverseVariantEntity.safeParse({ sku: 'ESP-001' }).success).toBe(
			false,
		);
	});

	/**
	 * Variants are the one entity keyed on something other than `id`. An `id`
	 * alone must not satisfy them, or the cache would key rows on the wrong
	 * field.
	 */
	it('does not accept id in place of variant_id', () => {
		expect(LoyverseVariantEntity.safeParse({ id: 'variant-1' }).success).toBe(
			false,
		);
	});
});

describe('entities tolerate unrecognised fields', () => {
	/**
	 * `.loose()` everywhere, so a field Loyverse adds later survives instead of
	 * being dropped. The webhook response already returns a `deleted_at` the
	 * published spec does not declare, which is why this is not hypothetical.
	 */
	it('keeps a field the schema does not declare', () => {
		const parsed = LoyverseCategoryEntity.parse({
			id: 'category-1',
			name: 'Beverages',
			a_field_added_later: 'kept',
		});

		expect(parsed).toMatchObject({ a_field_added_later: 'kept' });
	});

	it('accepts null in place of any non-key field', () => {
		const parsed = LoyverseCustomerEntity.safeParse({
			id: 'customer-1',
			name: null,
			email: null,
			phone_number: null,
			total_spent: null,
			deleted_at: null,
		});

		expect(parsed.success).toBe(true);
	});
});

describe('full records parse', () => {
	it('parses an item with its variants nested inline', () => {
		const parsed = LoyverseItemEntity.safeParse({
			id: 'item-1',
			handle: 'espresso',
			item_name: 'Espresso',
			description: 'Seeded item',
			reference_id: null,
			category_id: 'category-1',
			track_stock: true,
			sold_by_weight: false,
			is_composite: false,
			use_production: false,
			components: [],
			primary_supplier_id: 'supplier-1',
			tax_ids: ['tax-1'],
			modifier_ids: ['modifier-1'],
			form: 'SQUARE',
			color: 'GREEN',
			image_url: null,
			option1_name: null,
			option2_name: null,
			option3_name: null,
			variants: [
				{
					variant_id: 'variant-1',
					item_id: 'item-1',
					sku: 'ESP-001',
					reference_variant_id: null,
					option1_value: null,
					option2_value: null,
					option3_value: null,
					barcode: '5550000000017',
					cost: 1.2,
					purchase_cost: 1.2,
					default_pricing_type: 'FIXED',
					default_price: 3.5,
					stores: [
						{
							store_id: 'store-1',
							pricing_type: 'FIXED',
							price: 3.5,
							available_for_sale: true,
							optimal_stock: null,
							low_stock: null,
						},
					],
					created_at: '2026-08-13T00:00:00.000Z',
					updated_at: '2026-08-13T00:00:00.000Z',
					deleted_at: null,
				},
			],
			created_at: '2026-08-13T00:00:00.000Z',
			updated_at: '2026-08-13T00:00:00.000Z',
			deleted_at: null,
		});

		expect(parsed.success).toBe(true);
	});

	it('parses a customer with every personal field populated', () => {
		const parsed = LoyverseCustomerEntity.safeParse({
			id: 'customer-1',
			name: 'Test Customer',
			email: 'customer@example.com',
			phone_number: '+15550101',
			address: '2 Example Avenue',
			city: 'Springfield',
			region: null,
			postal_code: '00000',
			country_code: null,
			customer_code: null,
			note: 'Fixture record',
			first_visit: '2026-08-13T00:00:00.000Z',
			last_visit: '2026-08-13T00:00:00.000Z',
			total_visits: 1,
			total_spent: 17.96,
			total_points: 0,
			permanent_deletion_at: null,
			created_at: '2026-08-13T00:00:00.000Z',
			updated_at: '2026-08-13T00:00:00.000Z',
			deleted_at: null,
		});

		expect(parsed.success).toBe(true);
	});

	/**
	 * The spec and the live API disagree on two store field names. Both spellings
	 * parse, so neither a doc-driven caller nor the actual response is rejected.
	 */
	it('accepts both the live and documented store field spellings', () => {
		const live = LoyverseStoreEntity.safeParse({
			id: 'store-1',
			region: 'Example Region',
			country_code: 'us',
		});
		const documented = LoyverseStoreEntity.safeParse({
			id: 'store-1',
			state: 'Example State',
			country: 'us',
		});

		expect(live.success).toBe(true);
		expect(documented.success).toBe(true);
	});

	it('parses the merchant singleton with its nested currency', () => {
		const parsed = LoyverseMerchantEntity.safeParse({
			id: 'merchant-1',
			business_name: 'Example Retail',
			email: 'owner@example.com',
			country: 'us',
			currency: { code: 'USD', decimal_places: 2 },
			created_at: '2026-08-13T00:00:00.000Z',
		});

		expect(parsed.success).toBe(true);
		expect(parsed.success && parsed.data.currency?.decimal_places).toBe(2);
	});
});

describe('the schema registry', () => {
	it('registers 13 entities and nothing transactional', () => {
		const names = Object.keys(LoyverseSchema.entities);

		expect(names).toHaveLength(13);
		// Transactional and keyless records are deliberately absent.
		expect(names).not.toContain('receipts');
		expect(names).not.toContain('shifts');
		expect(names).not.toContain('inventoryLevels');
		expect(names).not.toContain('webhooks');
	});
});

describe('conditional input validation', () => {
	/**
	 * Loyverse reads an absent `variants` on an item update as "remove every
	 * variant" and answers 400. Encoded so the failure is explained here rather
	 * than by an opaque API error.
	 */
	const itemsUpsert = LoyverseEndpointInputSchemas.itemsUpsert;

	it('requires variants when updating an item', () => {
		const result = itemsUpsert.safeParse({
			id: 'item-1',
			item_name: 'Espresso',
		});

		expect(result.success).toBe(false);
		expect(
			result.success === false &&
				result.error.issues.some((issue) => issue.path.includes('variants')),
		).toBe(true);
	});

	it('accepts an item update that restates its variants', () => {
		expect(
			itemsUpsert.safeParse({
				id: 'item-1',
				item_name: 'Espresso',
				variants: [{ variant_id: 'variant-1', default_price: 3.5 }],
			}).success,
		).toBe(true);
	});

	it('does not require variants when creating an item', () => {
		expect(itemsUpsert.safeParse({ item_name: 'Espresso' }).success).toBe(true);
	});

	const discountsUpsert = LoyverseEndpointInputSchemas.discountsUpsert;

	it('requires discount_percent for a FIXED_PERCENT discount', () => {
		expect(
			discountsUpsert.safeParse({ name: 'Staff', type: 'FIXED_PERCENT' })
				.success,
		).toBe(false);
		expect(
			discountsUpsert.safeParse({
				name: 'Staff',
				type: 'FIXED_PERCENT',
				discount_percent: 10,
			}).success,
		).toBe(true);
	});

	it('requires discount_amount for a FIXED_AMOUNT discount', () => {
		expect(
			discountsUpsert.safeParse({ name: 'Voucher', type: 'FIXED_AMOUNT' })
				.success,
		).toBe(false);
		expect(
			discountsUpsert.safeParse({
				name: 'Voucher',
				type: 'FIXED_AMOUNT',
				discount_amount: 5,
			}).success,
		).toBe(true);
	});

	it('accepts a variable discount with neither amount field', () => {
		expect(
			discountsUpsert.safeParse({
				name: 'Manager override',
				type: 'VARIABLE_PERCENT',
			}).success,
		).toBe(true);
	});

	/**
	 * `status` is required despite the published spec listing only `url`;
	 * omitting it is answered with MISSING_REQUIRED_PARAMETER.
	 */
	it('requires status on a webhook write', () => {
		const webhooksUpsert = LoyverseEndpointInputSchemas.webhooksUpsert;

		expect(
			webhooksUpsert.safeParse({
				url: 'https://example.com/hook',
				type: 'items.update',
			}).success,
		).toBe(false);
		expect(
			webhooksUpsert.safeParse({
				url: 'https://example.com/hook',
				type: 'items.update',
				status: 'ENABLED',
			}).success,
		).toBe(true);
	});

	it('rejects a webhook event Loyverse does not publish', () => {
		expect(
			LoyverseEndpointInputSchemas.webhooksUpsert.safeParse({
				url: 'https://example.com/hook',
				type: 'items.deleted',
				status: 'ENABLED',
			}).success,
		).toBe(false);
	});

	/**
	 * The API enforces the 250 cap with a 400 rather than clamping, so the bound
	 * is enforced before the request is made.
	 */
	it('rejects a limit above the documented maximum', () => {
		expect(
			LoyverseEndpointInputSchemas.itemsList.safeParse({ limit: 250 }).success,
		).toBe(true);
		expect(
			LoyverseEndpointInputSchemas.itemsList.safeParse({ limit: 251 }).success,
		).toBe(false);
		expect(
			LoyverseEndpointInputSchemas.itemsList.safeParse({ limit: 0 }).success,
		).toBe(false);
	});

	it('rejects a malformed customer email', () => {
		const customersUpsert = LoyverseEndpointInputSchemas.customersUpsert;

		expect(
			customersUpsert.safeParse({
				name: 'Test Customer',
				email: 'not-an-email',
			}).success,
		).toBe(false);
		expect(
			customersUpsert.safeParse({
				name: 'Test Customer',
				email: 'customer@example.com',
			}).success,
		).toBe(true);
	});

	it('requires at least one modifier option', () => {
		const modifiersUpsert = LoyverseEndpointInputSchemas.modifiersUpsert;

		expect(
			modifiersUpsert.safeParse({ name: 'Extra shot', modifier_options: [] })
				.success,
		).toBe(false);
		expect(
			modifiersUpsert.safeParse({
				name: 'Extra shot',
				modifier_options: [{ name: 'Double', price: 1 }],
			}).success,
		).toBe(true);
	});

	/**
	 * Loyverse accepts exactly one payment per receipt POST, which is its
	 * restriction rather than a modelling choice here.
	 */
	it('accepts one payment on a receipt and rejects two', () => {
		const receiptsCreate = LoyverseEndpointInputSchemas.receiptsCreate;
		const line = { variant_id: 'variant-1', quantity: 1 };
		const payment = { payment_type_id: 'payment-type-1', money_amount: 3.5 };

		expect(
			receiptsCreate.safeParse({
				store_id: 'store-1',
				line_items: [line],
				payments: [payment],
			}).success,
		).toBe(true);
		expect(
			receiptsCreate.safeParse({
				store_id: 'store-1',
				line_items: [line],
				payments: [payment, payment],
			}).success,
		).toBe(false);
	});

	/**
	 * A refund line has to name the line id from the original receipt; a
	 * variant id alone is answered with MISSING_REQUIRED_PARAMETER.
	 */
	it('requires the original line id on a refund', () => {
		const receiptsRefund = LoyverseEndpointInputSchemas.receiptsRefund;
		const payment = { payment_type_id: 'payment-type-1', money_amount: 3.5 };

		expect(
			receiptsRefund.safeParse({
				receipt_number: '0001',
				store_id: 'store-1',
				line_items: [{ variant_id: 'variant-1', quantity: 1 }],
				payments: [payment],
			}).success,
		).toBe(false);
		expect(
			receiptsRefund.safeParse({
				receipt_number: '0001',
				store_id: 'store-1',
				line_items: [{ id: 'line-1', quantity: 1 }],
				payments: [payment],
			}).success,
		).toBe(true);
	});

	/**
	 * Creating a variant needs a parent item that already declares option names,
	 * and the schema cannot see the parent - so it enforces the part it can.
	 */
	it('requires item_id when creating a variant', () => {
		const variantsUpsert = LoyverseEndpointInputSchemas.variantsUpsert;

		expect(variantsUpsert.safeParse({ sku: 'ESP-001' }).success).toBe(false);
		expect(
			variantsUpsert.safeParse({ item_id: 'item-1', sku: 'ESP-001' }).success,
		).toBe(true);
		// An update names the variant instead, so no item_id is needed.
		expect(
			variantsUpsert.safeParse({ variant_id: 'variant-1', cost: 2 }).success,
		).toBe(true);
	});

	it('accepts the two image media types the catalog names', () => {
		const upload = LoyverseEndpointInputSchemas.itemsUploadImage;
		const base = { item_id: 'item-1', image_base64: 'a'.repeat(64) };

		expect(upload.safeParse({ ...base, media_type: 'image/png' }).success).toBe(
			true,
		);
		expect(
			upload.safeParse({ ...base, media_type: 'image/jpeg' }).success,
		).toBe(true);
		expect(upload.safeParse({ ...base, media_type: 'image/gif' }).success).toBe(
			false,
		);
	});

	it('rejects a malformed customer email filter on a list', () => {
		const customersList = LoyverseEndpointInputSchemas.customersList;

		expect(customersList.safeParse({ email: 'nope' }).success).toBe(false);
		expect(
			customersList.safeParse({ email: 'customer@example.com' }).success,
		).toBe(true);
	});

	/**
	 * Shifts have no `updated_at` bounds and no `show_deleted`, unlike the other
	 * collections - a closed shift is never revised. Asserted so the shared filter
	 * set is not pasted in later by habit.
	 */
	it('does not offer updated_at or show_deleted on the shifts list', () => {
		const shape = Object.keys(LoyverseEndpointInputSchemas.shiftsList.shape);

		expect(shape).toContain('created_at_min');
		expect(shape).toContain('store_ids');
		expect(shape).not.toContain('updated_at_min');
		expect(shape).not.toContain('show_deleted');
	});

	it('offers no query parameters on the webhook list', () => {
		expect(
			Object.keys(LoyverseEndpointInputSchemas.webhooksList.shape),
		).toHaveLength(0);
	});

	it('rejects an empty image payload', () => {
		const upload = LoyverseEndpointInputSchemas.itemsUploadImage;

		expect(
			upload.safeParse({ item_id: 'item-1', image_base64: '' }).success,
		).toBe(false);
		expect(
			upload.safeParse({
				item_id: 'item-1',
				image_base64: 'a'.repeat(64),
			}).success,
		).toBe(true);
	});
});
