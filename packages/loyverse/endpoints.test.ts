/**
 * Covers every operation: the method and path it calls, what it writes to the
 * local mirror, what it evicts, and exactly what reaches the event log.
 *
 * The coverage sweep at the end asserts that the operations exercised here are
 * precisely the operations registered, so an operation cannot be added without a
 * test.
 *
 * All ids and values are fictional.
 */
import { readFileSync } from 'node:fs';
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	Categories,
	Customers,
	Discounts,
	Employees,
	Inventory,
	Items,
	Merchant,
	Modifiers,
	Oidc,
	PaymentTypes,
	PosDevices,
	Receipts,
	Shifts,
	Stores,
	Suppliers,
	Taxes,
	Variants,
	Webhooks,
} from './endpoints';
import { LoyverseMirrorEvictionError } from './endpoints/persist';
import { errorHandlers, isNonIdempotent } from './error-handlers';
import { loyverseEndpointMeta } from './index';

// The event-log payload is asserted directly further down: it is the one place
// caller-supplied text could leak into durable storage, so it needs to be
// inspected rather than inferred.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const BASE = 'https://api.loyverse.com/v1.0';
const ROOT = 'https://api.loyverse.com';

const ITEM = 'item-1';
const VARIANT = 'variant-1';
const CATEGORY = 'category-1';
const MODIFIER = 'modifier-1';
const DISCOUNT = 'discount-1';
const TAX = 'tax-1';
const CUSTOMER = 'customer-1';
const SUPPLIER = 'supplier-1';
const STORE = 'store-1';
const EMPLOYEE = 'employee-1';
const PAYMENT_TYPE = 'payment-type-1';
const POS_DEVICE = 'pos-device-1';
const WEBHOOK = 'webhook-1';
const MERCHANT = 'merchant-1';
const RECEIPT = '0001';
const SHIFT = 'shift-1';

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Items.list>[0];

function makeCtx() {
	const db = {
		items: makeStore(),
		variants: makeStore(),
		categories: makeStore(),
		modifiers: makeStore(),
		discounts: makeStore(),
		taxes: makeStore(),
		customers: makeStore(),
		suppliers: makeStore(),
		stores: makeStore(),
		employees: makeStore(),
		paymentTypes: makeStore(),
		posDevices: makeStore(),
		merchant: makeStore(),
	};
	const ctx = { key: 'test-token', db } as unknown as Ctx;
	return { ctx, db };
}

let captured:
	| {
			url: string;
			method: string;
			body?: string;
			headers: Record<string, string>;
			rawBody?: unknown;
	  }
	| undefined;

/** Answers every request with `payload`, recording what was asked for. */
function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		// `request` may hand fetch a plain object or a `Headers` instance. Both are
		// normalised to lower-cased keys, because asserting against the raw object
		// silently passes on the other shape.
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
			rawBody: init?.body,
			headers,
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

/* -------------------------------------------------------------------------- */
/*                            Canned response bodies                          */
/* -------------------------------------------------------------------------- */

const itemRecord = {
	id: ITEM,
	item_name: 'Espresso',
	category_id: CATEGORY,
	variants: [{ variant_id: VARIANT, item_id: ITEM, sku: 'ESP-001' }],
};
const variantRecord = { variant_id: VARIANT, item_id: ITEM, sku: 'ESP-001' };
const categoryRecord = { id: CATEGORY, name: 'Beverages' };
const modifierRecord = {
	id: MODIFIER,
	name: 'Extra shot',
	modifier_options: [{ id: 'option-1', name: 'Double', price: 1 }],
};
const discountRecord = {
	id: DISCOUNT,
	name: 'Staff discount',
	type: 'FIXED_PERCENT',
	discount_percent: 10,
};
const taxRecord = { id: TAX, name: 'Sales tax', type: 'ADDED', rate: 5 };
const customerRecord = {
	id: CUSTOMER,
	name: 'Test Customer',
	email: 'customer@example.com',
};
const supplierRecord = { id: SUPPLIER, name: 'Example Supply Co' };
const storeRecord = { id: STORE, name: 'Example Store' };
const employeeRecord = {
	id: EMPLOYEE,
	name: 'Test Employee',
	email: 'employee@example.com',
};
const paymentTypeRecord = { id: PAYMENT_TYPE, name: 'Cash', type: 'CASH' };
const posDeviceRecord = { id: POS_DEVICE, name: 'POS 1', store_id: STORE };
const webhookRecord = {
	id: WEBHOOK,
	url: 'https://example.com/hook',
	type: 'items.update',
	status: 'ENABLED',
};
const merchantRecord = {
	id: MERCHANT,
	business_name: 'Example Retail',
	currency: { code: 'USD', decimal_places: 2 },
};
const receiptRecord = {
	receipt_number: RECEIPT,
	receipt_type: 'SALE',
	store_id: STORE,
	line_items: [{ id: 'line-1', variant_id: VARIANT, quantity: 1 }],
};
const refundRecord = {
	receipt_number: '0002',
	receipt_type: 'REFUND',
	refund_for: RECEIPT,
	store_id: STORE,
};
// Shifts have no single-read operation, so this only ever appears in a list.
const shiftRecord = { id: SHIFT, store_id: STORE };
const inventoryLevel = { variant_id: VARIANT, store_id: STORE, in_stock: 7 };
const deleted = (id: string) => ({ deleted_object_ids: [id] });

const listInput = {};
const upsertItemInput = { item_name: 'Espresso' };
const upsertVariantInput = { item_id: ITEM, sku: 'ESP-001' };
const upsertCategoryInput = { name: 'Beverages' };
const upsertModifierInput = {
	name: 'Extra shot',
	modifier_options: [{ name: 'Double', price: 1 }],
};
const upsertDiscountInput = {
	name: 'Staff discount',
	type: 'FIXED_PERCENT' as const,
	discount_percent: 10,
};
const upsertTaxInput = {
	name: 'Sales tax',
	type: 'ADDED' as const,
	rate: 5,
};
const upsertCustomerInput = { name: 'Test Customer' };
const upsertSupplierInput = { name: 'Example Supply Co' };
const upsertPosDeviceInput = { name: 'POS 1', store_id: STORE };
const upsertWebhookInput = {
	url: 'https://example.com/hook',
	type: 'items.update' as const,
	status: 'ENABLED' as const,
};
const receiptCreateInput = {
	store_id: STORE,
	line_items: [{ variant_id: VARIANT, quantity: 1 }],
	payments: [{ payment_type_id: PAYMENT_TYPE, money_amount: 3.5 }],
};
const receiptRefundInput = {
	receipt_number: RECEIPT,
	store_id: STORE,
	line_items: [{ id: 'line-1', quantity: 1 }],
	payments: [{ payment_type_id: PAYMENT_TYPE, money_amount: 3.5 }],
};

/**
 * Every registered operation, with the request it is expected to make.
 *
 * `path` is matched against the start of the request URL, after the base, so a
 * query string does not have to be restated.
 */
const OPERATIONS: Array<
	[
		op: string,
		method: string,
		path: string,
		run: (ctx: Ctx) => Promise<unknown>,
	]
> = [
	['items.list', 'GET', 'items', (c) => Items.list(c, listInput)],
	['items.get', 'GET', `items/${ITEM}`, (c) => Items.get(c, { item_id: ITEM })],
	['items.upsert', 'POST', 'items', (c) => Items.upsert(c, upsertItemInput)],
	[
		'items.delete',
		'DELETE',
		`items/${ITEM}`,
		(c) => Items.remove(c, { item_id: ITEM }),
	],
	[
		'items.uploadImage',
		'POST',
		`items/${ITEM}/image`,
		(c) =>
			Items.uploadImage(c, {
				item_id: ITEM,
				image_base64: Buffer.from('x'.repeat(64)).toString('base64'),
			}),
	],
	[
		'items.deleteImage',
		'DELETE',
		`items/${ITEM}/image`,
		(c) => Items.deleteImage(c, { item_id: ITEM }),
	],
	['variants.list', 'GET', 'variants', (c) => Variants.list(c, listInput)],
	[
		'variants.get',
		'GET',
		`variants/${VARIANT}`,
		(c) => Variants.get(c, { variant_id: VARIANT }),
	],
	[
		'variants.upsert',
		'POST',
		'variants',
		(c) => Variants.upsert(c, upsertVariantInput),
	],
	[
		'variants.delete',
		'DELETE',
		`variants/${VARIANT}`,
		(c) => Variants.remove(c, { variant_id: VARIANT }),
	],
	[
		'categories.list',
		'GET',
		'categories',
		(c) => Categories.list(c, listInput),
	],
	[
		'categories.get',
		'GET',
		`categories/${CATEGORY}`,
		(c) => Categories.get(c, { category_id: CATEGORY }),
	],
	[
		'categories.upsert',
		'POST',
		'categories',
		(c) => Categories.upsert(c, upsertCategoryInput),
	],
	[
		'categories.delete',
		'DELETE',
		`categories/${CATEGORY}`,
		(c) => Categories.remove(c, { category_id: CATEGORY }),
	],
	['modifiers.list', 'GET', 'modifiers', (c) => Modifiers.list(c, listInput)],
	[
		'modifiers.get',
		'GET',
		`modifiers/${MODIFIER}`,
		(c) => Modifiers.get(c, { modifier_id: MODIFIER }),
	],
	[
		'modifiers.upsert',
		'POST',
		'modifiers',
		(c) => Modifiers.upsert(c, upsertModifierInput),
	],
	[
		'modifiers.delete',
		'DELETE',
		`modifiers/${MODIFIER}`,
		(c) => Modifiers.remove(c, { modifier_id: MODIFIER }),
	],
	['discounts.list', 'GET', 'discounts', (c) => Discounts.list(c, listInput)],
	[
		'discounts.listFiltered',
		'GET',
		'discounts',
		(c) => Discounts.listFiltered(c, listInput),
	],
	[
		'discounts.get',
		'GET',
		`discounts/${DISCOUNT}`,
		(c) => Discounts.get(c, { discount_id: DISCOUNT }),
	],
	[
		'discounts.upsert',
		'POST',
		'discounts',
		(c) => Discounts.upsert(c, upsertDiscountInput),
	],
	[
		'discounts.delete',
		'DELETE',
		`discounts/${DISCOUNT}`,
		(c) => Discounts.remove(c, { discount_id: DISCOUNT }),
	],
	['taxes.list', 'GET', 'taxes', (c) => Taxes.list(c, listInput)],
	['taxes.get', 'GET', `taxes/${TAX}`, (c) => Taxes.get(c, { tax_id: TAX })],
	['taxes.upsert', 'POST', 'taxes', (c) => Taxes.upsert(c, upsertTaxInput)],
	[
		'taxes.delete',
		'DELETE',
		`taxes/${TAX}`,
		(c) => Taxes.remove(c, { tax_id: TAX }),
	],
	['customers.list', 'GET', 'customers', (c) => Customers.list(c, listInput)],
	[
		'customers.get',
		'GET',
		`customers/${CUSTOMER}`,
		(c) => Customers.get(c, { customer_id: CUSTOMER }),
	],
	[
		'customers.upsert',
		'POST',
		'customers',
		(c) => Customers.upsert(c, upsertCustomerInput),
	],
	[
		'customers.delete',
		'DELETE',
		`customers/${CUSTOMER}`,
		(c) => Customers.remove(c, { customer_id: CUSTOMER }),
	],
	['suppliers.list', 'GET', 'suppliers/', (c) => Suppliers.list(c, listInput)],
	[
		'suppliers.get',
		'GET',
		`suppliers/${SUPPLIER}`,
		(c) => Suppliers.get(c, { supplier_id: SUPPLIER }),
	],
	[
		'suppliers.upsert',
		'POST',
		'suppliers/',
		(c) => Suppliers.upsert(c, upsertSupplierInput),
	],
	[
		'suppliers.delete',
		'DELETE',
		`suppliers/${SUPPLIER}`,
		(c) => Suppliers.remove(c, { supplier_id: SUPPLIER }),
	],
	[
		'posDevices.list',
		'GET',
		'pos_devices',
		(c) => PosDevices.list(c, listInput),
	],
	[
		'posDevices.get',
		'GET',
		`pos_devices/${POS_DEVICE}`,
		(c) => PosDevices.get(c, { pos_device_id: POS_DEVICE }),
	],
	[
		'posDevices.upsert',
		'POST',
		'pos_devices',
		(c) => PosDevices.upsert(c, upsertPosDeviceInput),
	],
	[
		'posDevices.delete',
		'DELETE',
		`pos_devices/${POS_DEVICE}`,
		(c) => PosDevices.remove(c, { pos_device_id: POS_DEVICE }),
	],
	['webhooks.list', 'GET', 'webhooks/', (c) => Webhooks.list(c, listInput)],
	[
		'webhooks.get',
		'GET',
		`webhooks/${WEBHOOK}`,
		(c) => Webhooks.get(c, { webhook_id: WEBHOOK }),
	],
	[
		'webhooks.upsert',
		'POST',
		'webhooks/',
		(c) => Webhooks.upsert(c, upsertWebhookInput),
	],
	[
		'webhooks.delete',
		'DELETE',
		`webhooks/${WEBHOOK}`,
		(c) => Webhooks.remove(c, { webhook_id: WEBHOOK }),
	],
	['inventory.list', 'GET', 'inventory', (c) => Inventory.list(c, listInput)],
	[
		'inventory.update',
		'POST',
		'inventory',
		(c) =>
			Inventory.update(c, {
				inventory_levels: [
					{ variant_id: VARIANT, store_id: STORE, stock_after: 7 },
				],
			}),
	],
	['employees.list', 'GET', 'employees', (c) => Employees.list(c, listInput)],
	[
		'employees.get',
		'GET',
		`employees/${EMPLOYEE}`,
		(c) => Employees.get(c, { employee_id: EMPLOYEE }),
	],
	[
		'paymentTypes.list',
		'GET',
		'payment_types',
		(c) => PaymentTypes.list(c, listInput),
	],
	[
		'paymentTypes.get',
		'GET',
		`payment_types/${PAYMENT_TYPE}`,
		(c) => PaymentTypes.get(c, { payment_type_id: PAYMENT_TYPE }),
	],
	['stores.list', 'GET', 'stores', (c) => Stores.list(c, listInput)],
	[
		'stores.get',
		'GET',
		`stores/${STORE}`,
		(c) => Stores.get(c, { store_id: STORE }),
	],
	['shifts.list', 'GET', 'shifts', (c) => Shifts.list(c, listInput)],
	['receipts.list', 'GET', 'receipts', (c) => Receipts.list(c, listInput)],
	[
		'receipts.get',
		'GET',
		`receipts/${RECEIPT}`,
		(c) => Receipts.get(c, { receipt_number: RECEIPT }),
	],
	[
		'receipts.create',
		'POST',
		'receipts',
		(c) => Receipts.create(c, receiptCreateInput),
	],
	[
		'receipts.refund',
		'POST',
		`receipts/${RECEIPT}/refund`,
		(c) => Receipts.refund(c, receiptRefundInput),
	],
	['merchant.get', 'GET', 'merchant/', (c) => Merchant.get(c, {})],
	[
		'oidc.discovery',
		'GET',
		'.well-known/openid-configuration',
		(c) => Oidc.discovery(c, {}),
	],
	['oidc.jwks', 'GET', '.well-known/jwks.json', (c) => Oidc.jwks(c, {})],
];

/** A response body plausible enough for each operation to parse. */
function payloadFor(op: string): unknown {
	if (op.endsWith('.delete')) return deleted(op.split('.')[0] ?? 'x');
	if (op === 'items.list') return { items: [itemRecord] };
	if (op === 'variants.list') return { variants: [variantRecord] };
	if (op === 'categories.list') return { categories: [categoryRecord] };
	if (op === 'modifiers.list') return { modifiers: [modifierRecord] };
	if (op === 'discounts.list' || op === 'discounts.listFiltered')
		return { discounts: [discountRecord] };
	if (op === 'taxes.list') return { taxes: [taxRecord] };
	if (op === 'customers.list') return { customers: [customerRecord] };
	if (op === 'suppliers.list') return { suppliers: [supplierRecord] };
	if (op === 'posDevices.list') return { pos_devices: [posDeviceRecord] };
	if (op === 'webhooks.list') return { webhooks: [webhookRecord] };
	if (op === 'inventory.list') return { inventory_levels: [inventoryLevel] };
	if (op === 'inventory.update') return { inventory_levels: [inventoryLevel] };
	if (op === 'employees.list') return { employees: [employeeRecord] };
	if (op === 'paymentTypes.list') return { payment_types: [paymentTypeRecord] };
	if (op === 'stores.list') return { stores: [storeRecord] };
	if (op === 'shifts.list') return { shifts: [shiftRecord] };
	if (op === 'receipts.list') return { receipts: [receiptRecord] };
	if (op.startsWith('items')) return itemRecord;
	if (op.startsWith('variants')) return variantRecord;
	if (op.startsWith('categories')) return categoryRecord;
	if (op.startsWith('modifiers')) return modifierRecord;
	if (op.startsWith('discounts')) return discountRecord;
	if (op.startsWith('taxes')) return taxRecord;
	if (op.startsWith('customers')) return customerRecord;
	if (op.startsWith('suppliers')) return supplierRecord;
	if (op.startsWith('posDevices')) return posDeviceRecord;
	if (op.startsWith('webhooks')) return webhookRecord;
	if (op.startsWith('employees')) return employeeRecord;
	if (op.startsWith('paymentTypes')) return paymentTypeRecord;
	if (op.startsWith('stores')) return storeRecord;
	if (op.startsWith('shifts')) return shiftRecord;
	if (op === 'receipts.refund') return refundRecord;
	if (op.startsWith('receipts')) return receiptRecord;
	if (op === 'merchant.get') return merchantRecord;
	if (op === 'oidc.discovery') return { issuer: ROOT, jwks_uri: `${ROOT}/x` };
	if (op === 'oidc.jwks') return { keys: [] };
	return {};
}

beforeEach(() => {
	mockLogEvent.mockClear();
});

describe('routing', () => {
	for (const [op, method, path, run] of OPERATIONS) {
		it(`${op} calls ${method} ${path}`, async () => {
			mockFetch(payloadFor(op));
			const { ctx } = makeCtx();

			await run(ctx);

			expect(captured?.method).toBe(method);
			// OIDC operations are the only ones outside the versioned base.
			const expected = op.startsWith('oidc.')
				? `${ROOT}/${path}`
				: `${BASE}/${path}`;
			expect(captured?.url.startsWith(expected)).toBe(true);
		});
	}
});

describe('coverage', () => {
	/**
	 * The set exercised above must equal the set registered. Without this an
	 * operation could be added to the plugin and never tested.
	 */
	it('exercises every registered operation and no others', () => {
		const exercised = OPERATIONS.map(([op]) => op).sort();
		const registered = Object.keys(loyverseEndpointMeta).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(59);
	});

	it('has no duplicate entries in the routing table', () => {
		const ops = OPERATIONS.map(([op]) => op);
		expect(new Set(ops).size).toBe(ops.length);
	});
});

describe('risk levels', () => {
	it('marks every delete operation destructive', () => {
		const deletes = Object.entries(loyverseEndpointMeta).filter(([op]) =>
			op.toLowerCase().includes('delete'),
		);

		// Without this the loop below would pass trivially on an empty list.
		// Ten resource deletes plus the item image delete.
		expect(deletes).toHaveLength(11);
		for (const [, meta] of deletes) {
			expect(meta.riskLevel).toBe('destructive');
		}
	});

	it('marks the money-moving receipt writes destructive, not merely write', () => {
		expect(loyverseEndpointMeta['receipts.create'].riskLevel).toBe(
			'destructive',
		);
		expect(loyverseEndpointMeta['receipts.refund'].riskLevel).toBe(
			'destructive',
		);
	});

	it('marks every list and get operation read', () => {
		const reads = Object.entries(loyverseEndpointMeta).filter(
			([op]) => op.endsWith('.list') || op.endsWith('.get'),
		);

		// 16 collection reads and 15 single reads - there is no Get Shift.
		expect(reads).toHaveLength(31);
		for (const [, meta] of reads) {
			expect(meta.riskLevel).toBe('read');
		}
	});

	/**
	 * The two OIDC operations are reads but are not named `list` or `get`, so the
	 * sweep above would miss them. Counting all read-risk operations catches a
	 * write that was mislabelled as a read.
	 */
	it('accounts for every read-risk operation including the OIDC pair', () => {
		// 31 named list/get, plus discounts.listFiltered and the two OIDC reads.
		const reads = Object.entries(loyverseEndpointMeta).filter(
			([, meta]) => meta.riskLevel === 'read',
		);

		expect(reads).toHaveLength(34);
		expect(loyverseEndpointMeta['oidc.discovery'].riskLevel).toBe('read');
		expect(loyverseEndpointMeta['oidc.jwks'].riskLevel).toBe('read');
	});

	it('assigns every operation a risk level and a description', () => {
		const entries = Object.entries(loyverseEndpointMeta);

		expect(entries).toHaveLength(59);
		for (const [op, meta] of entries) {
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(meta.description.length).toBeGreaterThan(0);
			expect(op).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});
});

describe('retry safety', () => {
	/**
	 * The non-idempotent set must be exactly the POST operations minus
	 * `inventory.update`, whose body carries an absolute `stock_after` rather
	 * than a delta and so survives a replay unchanged.
	 */
	it('treats every POST except the absolute inventory write as unsafe to replay', () => {
		const posts = OPERATIONS.filter(([, method]) => method === 'POST')
			.map(([op]) => op)
			.sort();
		const nonIdempotent = OPERATIONS.map(([op]) => op)
			.filter(isNonIdempotent)
			.sort();

		expect(posts).toHaveLength(14);
		expect(nonIdempotent).toEqual(
			posts.filter((op) => op !== 'inventory.update'),
		);
		expect(nonIdempotent).toHaveLength(13);
	});

	it('never marks a read or a delete unsafe to replay', () => {
		const safe = OPERATIONS.filter(
			([, method]) => method === 'GET' || method === 'DELETE',
		).map(([op]) => op);

		expect(safe).toHaveLength(45);
		for (const op of safe) {
			expect(isNonIdempotent(op)).toBe(false);
		}
	});

	/**
	 * `customers.delete` is retryable on a 5xx, and that is only safe because the
	 * endpoint treats the replay's 404 as confirmation of absence and still clears
	 * the mirror. Asserted together so the two cannot drift apart: if the endpoint
	 * ever stops absorbing the 404, this pairing should be revisited.
	 */
	it('keeps customers.delete retryable, which the endpoint makes safe', () => {
		expect(isNonIdempotent('customers.delete')).toBe(false);
		const source = readFileSync(`${__dirname}/endpoints/customers.ts`, 'utf8');
		expect(source).toContain('error.status !== 404');
		expect(source).toContain('required: true');
	});

	it('does not match an operation name it does not know', () => {
		expect(isNonIdempotent('items.somethingElse')).toBe(false);
		expect(isNonIdempotent('upsert')).toBe(false);
	});
});

describe('caching', () => {
	it('mirrors a fetched item under its id', async () => {
		mockFetch(itemRecord);
		const { ctx, db } = makeCtx();

		await Items.get(ctx, { item_id: ITEM });

		expect(db.items.upsertByEntityId).toHaveBeenCalledWith(
			ITEM,
			expect.objectContaining({ id: ITEM }),
		);
	});

	/**
	 * An item carries its variants inline, so reading one should populate both -
	 * otherwise a variant only appears after a separate variants call, even
	 * though the data was already in hand.
	 */
	it('mirrors the variants nested inside an item', async () => {
		mockFetch(itemRecord);
		const { ctx, db } = makeCtx();

		await Items.get(ctx, { item_id: ITEM });

		expect(db.variants.upsertByEntityId).toHaveBeenCalledWith(
			VARIANT,
			expect.objectContaining({ variant_id: VARIANT }),
		);
	});

	it('keys a variant on variant_id rather than id', async () => {
		mockFetch(variantRecord);
		const { ctx, db } = makeCtx();

		await Variants.get(ctx, { variant_id: VARIANT });

		expect(db.variants.upsertByEntityId).toHaveBeenCalledWith(
			VARIANT,
			expect.objectContaining({ variant_id: VARIANT }),
		);
	});

	it('mirrors every row of a list page', async () => {
		mockFetch({
			categories: [categoryRecord, { id: 'category-2', name: 'Food' }],
		});
		const { ctx, db } = makeCtx();

		await Categories.list(ctx, listInput);

		expect(db.categories.upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	it('mirrors the merchant singleton under its id', async () => {
		mockFetch(merchantRecord);
		const { ctx, db } = makeCtx();

		await Merchant.get(ctx, {});

		expect(db.merchant.upsertByEntityId).toHaveBeenCalledWith(
			MERCHANT,
			expect.objectContaining({ business_name: 'Example Retail' }),
		);
	});

	/**
	 * Transactional and keyless records have no store, so nothing should be
	 * written for them - a mirrored receipt or stock level would be stale by
	 * design.
	 */
	it('writes nothing for receipts, shifts, inventory levels or webhooks', async () => {
		mockFetch({ receipts: [receiptRecord] });
		const { ctx, db } = makeCtx();
		await Receipts.list(ctx, listInput);

		mockFetch({ shifts: [shiftRecord] });
		await Shifts.list(ctx, listInput);

		mockFetch({ inventory_levels: [inventoryLevel] });
		await Inventory.list(ctx, listInput);

		mockFetch({ webhooks: [webhookRecord] });
		await Webhooks.list(ctx, listInput);

		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});

	it('skips a row the entity schema rejects rather than storing it', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		// No id, so the schema cannot accept it.
		mockFetch({ categories: [{ name: 'Nameless' }] });
		const { ctx, db } = makeCtx();

		await Categories.list(ctx, listInput);

		expect(db.categories.upsertByEntityId).not.toHaveBeenCalled();
		// Silence would turn a schema gap into a row that simply never appears.
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('does not fail the call when a cache write throws', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockFetch(categoryRecord);
		const { ctx, db } = makeCtx();
		db.categories.upsertByEntityId.mockRejectedValueOnce(
			new Error('database unavailable'),
		);

		await expect(
			Categories.get(ctx, { category_id: CATEGORY }),
		).resolves.toMatchObject({ id: CATEGORY });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

describe('eviction', () => {
	const EVICTING: Array<
		[
			string,
			keyof ReturnType<typeof makeCtx>['db'],
			(c: Ctx) => Promise<unknown>,
			string,
		]
	> = [
		['items.delete', 'items', (c) => Items.remove(c, { item_id: ITEM }), ITEM],
		[
			'variants.delete',
			'variants',
			(c) => Variants.remove(c, { variant_id: VARIANT }),
			VARIANT,
		],
		[
			'categories.delete',
			'categories',
			(c) => Categories.remove(c, { category_id: CATEGORY }),
			CATEGORY,
		],
		[
			'modifiers.delete',
			'modifiers',
			(c) => Modifiers.remove(c, { modifier_id: MODIFIER }),
			MODIFIER,
		],
		[
			'discounts.delete',
			'discounts',
			(c) => Discounts.remove(c, { discount_id: DISCOUNT }),
			DISCOUNT,
		],
		['taxes.delete', 'taxes', (c) => Taxes.remove(c, { tax_id: TAX }), TAX],
		[
			'customers.delete',
			'customers',
			(c) => Customers.remove(c, { customer_id: CUSTOMER }),
			CUSTOMER,
		],
		[
			'suppliers.delete',
			'suppliers',
			(c) => Suppliers.remove(c, { supplier_id: SUPPLIER }),
			SUPPLIER,
		],
		[
			'posDevices.delete',
			'posDevices',
			(c) => PosDevices.remove(c, { pos_device_id: POS_DEVICE }),
			POS_DEVICE,
		],
	];

	it('covers every delete that has a mirrored entity', () => {
		expect(EVICTING).toHaveLength(9);
	});

	for (const [op, storeName, run, id] of EVICTING) {
		it(`${op} drops the mirrored row`, async () => {
			mockFetch(deleted(id));
			const { ctx, db } = makeCtx();

			await run(ctx);

			expect(db[storeName].deleteByEntityId).toHaveBeenCalledWith(id);
		});
	}

	/**
	 * Deleting an item removes its variants too, so the ids the API reports as
	 * deleted are evicted rather than only the one that was asked for.
	 */
	it('evicts the variants reported alongside a deleted item', async () => {
		mockFetch({ deleted_object_ids: [ITEM, VARIANT] });
		const { ctx, db } = makeCtx();

		await Items.remove(ctx, { item_id: ITEM });

		expect(db.items.deleteByEntityId).toHaveBeenCalledWith(ITEM);
		expect(db.variants.deleteByEntityId).toHaveBeenCalledWith(VARIANT);
	});

	/**
	 * A read must not evict. Loyverse soft-deletes most records, so a row that
	 * has vanished from a plain list is still worth keeping to resolve
	 * historical references.
	 */
	it('never evicts on a read', async () => {
		mockFetch({ items: [itemRecord] });
		const { ctx, db } = makeCtx();

		await Items.list(ctx, listInput);
		mockFetch(itemRecord);
		await Items.get(ctx, { item_id: ITEM });

		for (const store of Object.values(db)) {
			expect(store.deleteByEntityId).not.toHaveBeenCalled();
		}
	});

	/**
	 * Customer eviction is the one that is allowed to fail loudly.
	 *
	 * Loyverse hard-deletes customers, so a mirrored row that survives the delete
	 * keeps answering reads with personal data the account has erased. Reporting
	 * that as a plain success would tell the caller the data is gone when half of it
	 * is not.
	 */
	it('raises when a customer cannot be evicted after deletion', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch(deleted(CUSTOMER));
		const { ctx, db } = makeCtx();
		db.customers.deleteByEntityId.mockRejectedValueOnce(
			new Error('database unavailable'),
		);

		await expect(
			Customers.remove(ctx, { customer_id: CUSTOMER }),
		).rejects.toBeInstanceOf(LoyverseMirrorEvictionError);

		// Logged as an error, not a warning: this is retained personal data.
		expect(error).toHaveBeenCalled();
		error.mockRestore();
	});

	it('names both halves of the outcome in the eviction error', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch(deleted(CUSTOMER));
		const { ctx, db } = makeCtx();
		db.customers.deleteByEntityId.mockRejectedValueOnce(new Error('disk full'));

		const thrown = await Customers.remove(ctx, {
			customer_id: CUSTOMER,
		}).catch((e: unknown) => e as Error);

		// The remote record is gone, so the message must not invite a retry of the
		// delete; it has to point at the mirror instead.
		expect(thrown.message).toContain('Loyverse deleted the customer');
		expect(thrown.message).toContain('local mirror');
		expect(thrown.message).toContain('does not need deleting again');
		expect(thrown.message).toContain('disk full');
		error.mockRestore();
	});

	/**
	 * The audit event is written before the eviction, so a failed mirror write
	 * cannot also erase the record that the deletion happened.
	 */
	it('still records the deletion event when the eviction fails', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch(deleted(CUSTOMER));
		const { ctx, db } = makeCtx();
		db.customers.deleteByEntityId.mockRejectedValueOnce(new Error('nope'));

		await Customers.remove(ctx, { customer_id: CUSTOMER }).catch(
			() => undefined,
		);

		// Recorded as failed, not completed: the remote delete happened but the
		// mirror still holds the customer, so the operation did not complete.
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.customers.delete',
			{
				customer_id: CUSTOMER,
				fields: ['customer_id'],
				already_absent: false,
				mirror_evicted: false,
			},
			'failed',
		);
		error.mockRestore();
	});

	/**
	 * The scenario this guards is the one a retry creates.
	 *
	 * A 5xx on a customer delete is ambiguous - Loyverse may have committed it
	 * before failing - and the replay's second DELETE answers 404. If that 404 were
	 * surfaced, the operation would end in a not-found error having deleted the
	 * customer remotely and left their personal data in the mirror.
	 */
	it('treats a 404 on a customer delete as confirmation of absence', async () => {
		mockFetch({ errors: [{ code: 'NOT_FOUND', details: 'not found' }] }, 404);
		const { ctx, db } = makeCtx();

		const result = await Customers.remove(ctx, { customer_id: CUSTOMER });

		// Nothing was removed by this call, so the result does not claim an id.
		expect(result.deleted_object_ids).toEqual([]);
		// The mirror is cleared anyway - the entire point of catching the 404.
		expect(db.customers.deleteByEntityId).toHaveBeenCalledWith(CUSTOMER);
	});

	it('records that the customer was already absent', async () => {
		mockFetch({ errors: [{ code: 'NOT_FOUND', details: 'not found' }] }, 404);
		const { ctx } = makeCtx();

		await Customers.remove(ctx, { customer_id: CUSTOMER });

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.customers.delete',
			{
				customer_id: CUSTOMER,
				fields: ['customer_id'],
				already_absent: true,
				mirror_evicted: true,
			},
			'completed',
		);
	});

	it('records already_absent as false on an ordinary delete', async () => {
		mockFetch(deleted(CUSTOMER));
		const { ctx } = makeCtx();

		await Customers.remove(ctx, { customer_id: CUSTOMER });

		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			already_absent: false,
		});
	});

	/**
	 * The 404 branch must not weaken the privacy guarantee: if the mirror still
	 * cannot be cleared, that has to be as loud as it is on the ordinary path.
	 */
	it('still raises when an already-absent customer cannot be evicted', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch({ errors: [{ code: 'NOT_FOUND', details: 'not found' }] }, 404);
		const { ctx, db } = makeCtx();
		db.customers.deleteByEntityId.mockRejectedValueOnce(
			new Error('unavailable'),
		);

		await expect(
			Customers.remove(ctx, { customer_id: CUSTOMER }),
		).rejects.toBeInstanceOf(LoyverseMirrorEvictionError);
		error.mockRestore();
	});

	/**
	 * Only a 404 is absorbed. Every other failure still propagates, so a 500 does
	 * not get quietly reported as a successful deletion.
	 */
	it('propagates a non-404 failure from a customer delete', async () => {
		for (const status of [500, 403, 429]) {
			mockFetch({ errors: [{ code: 'ERR', details: 'boom' }] }, status);
			const { ctx, db } = makeCtx();

			await expect(
				Customers.remove(ctx, { customer_id: CUSTOMER }),
			).rejects.toMatchObject({ status });
			// An ambiguous failure must not clear the mirror - the record may still
			// be there, and the retry will establish which.
			expect(db.customers.deleteByEntityId).not.toHaveBeenCalled();
		}
	});

	/**
	 * The 404 tolerance is deliberately limited to customers, whose mirror holds
	 * personal data. Elsewhere a delete of something absent is surfaced, because a
	 * stale reference row is explicitly acceptable.
	 */
	it('does not absorb a 404 on any other delete', async () => {
		const others: Array<[string, (c: Ctx) => Promise<unknown>]> = [
			['items.delete', (c) => Items.remove(c, { item_id: ITEM })],
			['variants.delete', (c) => Variants.remove(c, { variant_id: VARIANT })],
			[
				'categories.delete',
				(c) => Categories.remove(c, { category_id: CATEGORY }),
			],
			['taxes.delete', (c) => Taxes.remove(c, { tax_id: TAX })],
			[
				'suppliers.delete',
				(c) => Suppliers.remove(c, { supplier_id: SUPPLIER }),
			],
		];

		expect(others).toHaveLength(5);

		for (const [, run] of others) {
			mockFetch({ errors: [{ code: 'NOT_FOUND', details: 'not found' }] }, 404);
			const { ctx } = makeCtx();

			await expect(run(ctx)).rejects.toMatchObject({ status: 404 });
		}
	});

	/**
	 * The event status has to describe what actually happened. Logging 'completed'
	 * before an eviction that can raise would record a thrown operation as complete;
	 * skipping the log on failure would lose the record that a customer was deleted
	 * at Loyverse, which is irreversible. So it is emitted once, afterwards, with the
	 * status reflecting both halves.
	 */
	it('reports the event status according to the eviction outcome', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);

		mockFetch(deleted(CUSTOMER));
		const ok = makeCtx();
		await Customers.remove(ok.ctx, { customer_id: CUSTOMER });
		expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			mirror_evicted: true,
		});

		mockLogEvent.mockClear();
		mockFetch(deleted(CUSTOMER));
		const bad = makeCtx();
		bad.db.customers.deleteByEntityId.mockRejectedValueOnce(new Error('down'));
		await Customers.remove(bad.ctx, { customer_id: CUSTOMER }).catch(
			() => undefined,
		);
		expect(mockLogEvent.mock.calls[0]?.[3]).toBe('failed');
		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({
			mirror_evicted: false,
		});

		error.mockRestore();
	});

	it('emits exactly one event even when the eviction fails', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		mockFetch(deleted(CUSTOMER));
		const { ctx, db } = makeCtx();
		db.customers.deleteByEntityId.mockRejectedValueOnce(new Error('down'));

		await Customers.remove(ctx, { customer_id: CUSTOMER }).catch(
			() => undefined,
		);

		expect(mockLogEvent).toHaveBeenCalledTimes(1);
		error.mockRestore();
	});

	it('succeeds normally when the customer eviction works', async () => {
		mockFetch(deleted(CUSTOMER));
		const { ctx, db } = makeCtx();

		await expect(
			Customers.remove(ctx, { customer_id: CUSTOMER }),
		).resolves.toBeDefined();
		expect(db.customers.deleteByEntityId).toHaveBeenCalledWith(CUSTOMER);
	});

	/**
	 * Every other eviction stays best-effort. A plugin call should not fail because
	 * a local mirror could not be written when no promise depends on it.
	 */
	it('keeps every other eviction best-effort', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const cases: Array<
			[keyof ReturnType<typeof makeCtx>['db'], (c: Ctx) => Promise<unknown>]
		> = [
			['items', (c) => Items.remove(c, { item_id: ITEM })],
			['variants', (c) => Variants.remove(c, { variant_id: VARIANT })],
			['categories', (c) => Categories.remove(c, { category_id: CATEGORY })],
			['modifiers', (c) => Modifiers.remove(c, { modifier_id: MODIFIER })],
			['discounts', (c) => Discounts.remove(c, { discount_id: DISCOUNT })],
			['taxes', (c) => Taxes.remove(c, { tax_id: TAX })],
			['suppliers', (c) => Suppliers.remove(c, { supplier_id: SUPPLIER })],
			[
				'posDevices',
				(c) => PosDevices.remove(c, { pos_device_id: POS_DEVICE }),
			],
		];

		// Eight of the nine mirrored deletes; customers is the deliberate exception.
		expect(cases).toHaveLength(8);

		for (const [store, run] of cases) {
			mockFetch(deleted('x'));
			const { ctx, db } = makeCtx();
			db[store].deleteByEntityId.mockRejectedValueOnce(
				new Error('unavailable'),
			);

			await expect(run(ctx)).resolves.toBeDefined();
		}
		warn.mockRestore();
	});

	it('does not fail the call when an eviction throws', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockFetch(deleted(CATEGORY));
		const { ctx, db } = makeCtx();
		db.categories.deleteByEntityId.mockRejectedValueOnce(
			new Error('database unavailable'),
		);

		await expect(
			Categories.remove(ctx, { category_id: CATEGORY }),
		).resolves.toBeDefined();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

describe('request bodies', () => {
	it('omits unset fields rather than sending null', async () => {
		mockFetch(categoryRecord);
		const { ctx } = makeCtx();

		await Categories.upsert(ctx, { name: 'Beverages' });

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body).toEqual({ name: 'Beverages' });
		expect('color' in body).toBe(false);
		expect('id' in body).toBe(false);
	});

	/**
	 * An explicit null is a clear instruction and must survive compaction -
	 * Loyverse reads it as "clear this field", which is different from omitting
	 * it.
	 */
	it('keeps an explicit null', async () => {
		mockFetch(customerRecord);
		const { ctx } = makeCtx();

		await Customers.upsert(ctx, { name: 'Test Customer', note: null });

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body.note).toBeNull();
	});

	it('sends modifier_ids, the field name the API actually reads', async () => {
		mockFetch(itemRecord);
		const { ctx } = makeCtx();

		await Items.upsert(ctx, {
			item_name: 'Espresso',
			modifier_ids: [MODIFIER],
		});

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body.modifier_ids).toEqual([MODIFIER]);
		// The spec's `modifiers_ids` is accepted and then ignored, so it must not
		// be what this sends.
		expect('modifiers_ids' in body).toBe(false);
	});

	it('sends stock_after as supplied on an inventory update', async () => {
		mockFetch({ inventory_levels: [inventoryLevel] });
		const { ctx } = makeCtx();

		await Inventory.update(ctx, {
			inventory_levels: [
				{ variant_id: VARIANT, store_id: STORE, stock_after: 7 },
			],
		});

		const body = JSON.parse(captured?.body ?? '{}');
		expect(body.inventory_levels[0].stock_after).toBe(7);
	});

	it('passes list filters through as query parameters', async () => {
		mockFetch({ items: [] });
		const { ctx } = makeCtx();

		await Items.list(ctx, {
			limit: 250,
			cursor: 'next-page',
			show_deleted: true,
			updated_at_min: '2026-08-01T00:00:00.000Z',
		});

		expect(captured?.url).toContain('limit=250');
		expect(captured?.url).toContain('cursor=next-page');
		expect(captured?.url).toContain('show_deleted=true');
		expect(captured?.url).toContain('updated_at_min=');
	});

	it('joins variant_ids into one inventory query parameter', async () => {
		mockFetch({ inventory_levels: [] });
		const { ctx } = makeCtx();

		await Inventory.list(ctx, { variant_ids: [VARIANT, 'variant-2'] });

		expect(captured?.url).toContain(
			`variant_ids=${encodeURIComponent(`${VARIANT},variant-2`)}`,
		);
	});

	/**
	 * A wrong filter name fails silently on this API - Loyverse ignores an
	 * unrecognised query parameter and answers 200 with the whole collection - so
	 * each resource's exact parameter name is pinned here. The API is not
	 * consistent about pluralisation, which is what makes these worth asserting.
	 */
	const ID_FILTERS: Array<
		[op: string, param: string, run: (ctx: Ctx) => Promise<unknown>]
	> = [
		['items.list', 'items_ids', (c) => Items.list(c, { items_ids: [ITEM] })],
		[
			'variants.list',
			'variants_ids',
			(c) => Variants.list(c, { variants_ids: [VARIANT] }),
		],
		[
			'categories.list',
			'categories_ids',
			(c) => Categories.list(c, { categories_ids: [CATEGORY] }),
		],
		[
			'modifiers.list',
			'modifier_ids',
			(c) => Modifiers.list(c, { modifier_ids: [MODIFIER] }),
		],
		[
			'discounts.listFiltered',
			'discount_ids',
			(c) => Discounts.listFiltered(c, { discount_ids: [DISCOUNT] }),
		],
		['taxes.list', 'tax_ids', (c) => Taxes.list(c, { tax_ids: [TAX] })],
		[
			'customers.list',
			'customer_ids',
			(c) => Customers.list(c, { customer_ids: [CUSTOMER] }),
		],
		[
			'suppliers.list',
			'suppliers_ids',
			(c) => Suppliers.list(c, { suppliers_ids: [SUPPLIER] }),
		],
		[
			'employees.list',
			'employee_ids',
			(c) => Employees.list(c, { employee_ids: [EMPLOYEE] }),
		],
		[
			'paymentTypes.list',
			'payment_type_ids',
			(c) => PaymentTypes.list(c, { payment_type_ids: [PAYMENT_TYPE] }),
		],
		['stores.list', 'store_ids', (c) => Stores.list(c, { store_ids: [STORE] })],
		['shifts.list', 'store_ids', (c) => Shifts.list(c, { store_ids: [STORE] })],
		[
			'inventory.list',
			'store_ids',
			(c) => Inventory.list(c, { store_ids: [STORE] }),
		],
		[
			'posDevices.list',
			'store_id',
			(c) => PosDevices.list(c, { store_id: STORE }),
		],
		[
			'receipts.list',
			'receipt_numbers',
			(c) => Receipts.list(c, { receipt_numbers: [RECEIPT] }),
		],
	];

	it('covers an id filter for every collection that has one', () => {
		expect(ID_FILTERS).toHaveLength(15);
	});

	for (const [op, param, run] of ID_FILTERS) {
		it(`${op} sends its filter as ${param}`, async () => {
			mockFetch(payloadFor(op));
			const { ctx } = makeCtx();

			await run(ctx);

			expect(captured?.url).toContain(`${param}=`);
		});
	}

	it('sends inventory store filters as store_ids, not store_id', async () => {
		mockFetch({ inventory_levels: [] });
		const { ctx } = makeCtx();

		await Inventory.list(ctx, { store_ids: [STORE] });

		expect(captured?.url).toContain(`store_ids=${STORE}`);
		// The singular form is ignored by the API, so sending it would return
		// every store's levels while looking like a successful filtered call.
		expect(captured?.url).not.toContain(`store_id=${STORE}&`);
		expect(captured?.url.endsWith(`store_id=${STORE}`)).toBe(false);
	});

	it('drops an empty id array instead of sending an empty filter', async () => {
		mockFetch({ items: [] });
		const { ctx } = makeCtx();

		await Items.list(ctx, { items_ids: [] });

		expect(captured?.url).not.toContain('items_ids');
	});

	it('sends no query parameters at all on the webhook collection', async () => {
		mockFetch({ webhooks: [] });
		const { ctx } = makeCtx();

		await Webhooks.list(ctx, {});

		expect(captured?.url).toBe(`${BASE}/webhooks/`);
		expect(captured?.url).not.toContain('?');
	});

	/**
	 * The previous version of this test asserted only that the method was POST,
	 * which passed regardless of the media type and so proved nothing about the
	 * behaviour it was named for.
	 */
	it('sends the declared image media type when one is given', async () => {
		mockFetch({});
		const { ctx } = makeCtx();

		await Items.uploadImage(ctx, {
			item_id: ITEM,
			image_base64: Buffer.from('x'.repeat(64)).toString('base64'),
			media_type: 'image/jpeg',
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.headers['content-type']).toBe('image/jpeg');
	});

	it('defaults the image media type to PNG when none is given', async () => {
		mockFetch({});
		const { ctx } = makeCtx();

		await Items.uploadImage(ctx, {
			item_id: ITEM,
			image_base64: Buffer.from('x'.repeat(64)).toString('base64'),
		});

		expect(captured?.headers['content-type']).toBe('image/png');
	});

	/**
	 * Loyverse answers a multipart upload with 500, so the body has to reach fetch
	 * as raw bytes with no boundary anywhere near the content type.
	 */
	it('uploads the image as a raw binary body, never multipart', async () => {
		mockFetch({});
		const { ctx } = makeCtx();

		await Items.uploadImage(ctx, {
			item_id: ITEM,
			image_base64: Buffer.from('x'.repeat(64)).toString('base64'),
		});

		expect(captured?.rawBody).toBeInstanceOf(Blob);
		expect(captured?.headers['content-type']).not.toContain('multipart');
		expect(captured?.headers['content-type']).not.toContain('boundary');
	});
});

describe('server errors', () => {
	/**
	 * A 5xx arrives as an ApiError with a status, not as a transport failure, so
	 * before this handler existed it fell through to DEFAULT and was never retried.
	 * It is retried on exactly the operations a replay cannot duplicate - the same
	 * test the network handler applies.
	 */
	const context = (operation: string) =>
		({ operation }) as unknown as Parameters<
			typeof errorHandlers.SERVER_ERROR.handler
		>[1];

	const apiError = (status: number) =>
		Object.assign(new ApiError({} as never, {} as never, 'boom'), { status });

	it('matches a 5xx and not a 4xx', () => {
		const ctx = context('items.list');
		expect(errorHandlers.SERVER_ERROR.match(apiError(500), ctx)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(503), ctx)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(404), ctx)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(apiError(429), ctx)).toBe(false);
	});

	it('retries a 5xx on a read but not on a write', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);

		const read = await errorHandlers.SERVER_ERROR.handler(
			apiError(500),
			context('items.list'),
		);
		const del = await errorHandlers.SERVER_ERROR.handler(
			apiError(500),
			context('items.delete'),
		);
		const write = await errorHandlers.SERVER_ERROR.handler(
			apiError(500),
			context('receipts.create'),
		);
		const upload = await errorHandlers.SERVER_ERROR.handler(
			apiError(500),
			context('items.uploadImage'),
		);

		expect(read.maxRetries).toBe(3);
		expect(del.maxRetries).toBe(3);
		expect(write.maxRetries).toBe(0);
		expect(upload.maxRetries).toBe(0);
		warn.mockRestore();
	});

	it('never retries a mirror eviction failure', async () => {
		const error = jest
			.spyOn(console, 'error')
			.mockImplementation(() => undefined);
		const evictionError = new LoyverseMirrorEvictionError(
			'customer',
			CUSTOMER,
			new Error('disk full'),
		);
		const ctx = context('customers.delete');

		expect(errorHandlers.MIRROR_EVICTION_ERROR.match(evictionError, ctx)).toBe(
			true,
		);
		expect(errorHandlers.MIRROR_EVICTION_ERROR.match(apiError(500), ctx)).toBe(
			false,
		);

		const strategy = await errorHandlers.MIRROR_EVICTION_ERROR.handler(
			evictionError,
			ctx,
		);
		expect(strategy.maxRetries).toBe(0);
		error.mockRestore();
	});
});

describe('event payloads', () => {
	/**
	 * These assertions are the point of the file. `logEventFromContext` persists
	 * whatever it is handed, so anything personal reaching it inherits the event
	 * log's retention.
	 */
	it('records only the id when a customer is written', async () => {
		mockFetch(customerRecord);
		const { ctx } = makeCtx();

		await Customers.upsert(ctx, {
			name: 'Test Customer',
			email: 'customer@example.com',
			phone_number: '+15550101',
			address: '2 Example Avenue',
			note: 'a private remark',
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.customers.upsert',
			{ customer_id: CUSTOMER, created: true },
			'completed',
		);
	});

	it('records no customer field names at all, not even as keys', async () => {
		mockFetch(customerRecord);
		const { ctx } = makeCtx();

		await Customers.upsert(ctx, {
			name: 'Test Customer',
			email: 'customer@example.com',
		});

		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain('Test Customer');
		expect(payload).not.toContain('example.com');
		expect(payload).not.toContain('name');
		expect(payload).not.toContain('email');
	});

	it('records a receipt as counts, never its line contents', async () => {
		mockFetch(receiptRecord);
		const { ctx } = makeCtx();

		await Receipts.create(ctx, {
			store_id: STORE,
			note: 'customer asked for extra napkins',
			line_items: [
				{ variant_id: VARIANT, quantity: 2, line_note: 'to stay' },
				{ variant_id: 'variant-2', quantity: 1 },
			],
			payments: [{ payment_type_id: PAYMENT_TYPE, money_amount: 17.05 }],
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.receipts.create',
			{
				receipt_number: RECEIPT,
				store_id: STORE,
				line_item_count: 2,
				payment_count: 1,
			},
			'completed',
		);
		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain('napkins');
		expect(payload).not.toContain('to stay');
	});

	it('records a refund against the receipt it reverses', async () => {
		mockFetch(refundRecord);
		const { ctx } = makeCtx();

		await Receipts.refund(ctx, receiptRefundInput);

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.receipts.refund',
			{
				receipt_number: '0002',
				refund_for: RECEIPT,
				store_id: STORE,
				line_item_count: 1,
			},
			'completed',
		);
	});

	it('records an image upload as a byte count, never the image', async () => {
		mockFetch({});
		const { ctx } = makeCtx();
		const image = Buffer.from('x'.repeat(100)).toString('base64');

		await Items.uploadImage(ctx, { item_id: ITEM, image_base64: image });

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.items.uploadImage',
			{ item_id: ITEM, bytes: 100 },
			'completed',
		);
		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain(image);
	});

	it('records a modifier as an option count, not its option names', async () => {
		mockFetch(modifierRecord);
		const { ctx } = makeCtx();

		await Modifiers.upsert(ctx, {
			name: 'Extra shot',
			modifier_options: [
				{ name: 'Single', price: 0.5 },
				{ name: 'Double', price: 1 },
			],
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.modifiers.upsert',
			{ modifier_id: MODIFIER, created: true, option_count: 2 },
			'completed',
		);
	});

	it('records only the id when a supplier is written', async () => {
		mockFetch(supplierRecord);
		const { ctx } = makeCtx();

		await Suppliers.upsert(ctx, {
			name: 'Example Supply Co',
			email: 'supplier@example.com',
			contact: 'A Person',
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.suppliers.upsert',
			{ supplier_id: SUPPLIER, created: true },
			'completed',
		);
	});

	/**
	 * A webhook URL can carry a token in its path or query, so it is recorded by
	 * type and status only.
	 */
	it('does not record a webhook URL', async () => {
		mockFetch(webhookRecord);
		const { ctx } = makeCtx();

		await Webhooks.upsert(ctx, {
			url: 'https://example.com/hook?secret=do-not-log-me',
			type: 'items.update',
			status: 'ENABLED',
		});

		const payload = JSON.stringify(mockLogEvent.mock.calls[0]?.[2]);
		expect(payload).not.toContain('do-not-log-me');
		expect(payload).not.toContain('example.com');
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'loyverse.webhooks.upsert',
			{
				webhook_id: WEBHOOK,
				type: 'items.update',
				status: 'ENABLED',
				created: true,
			},
			'completed',
		);
	});

	it('distinguishes a create from an update on an upsert', async () => {
		mockFetch(categoryRecord);
		const { ctx } = makeCtx();

		await Categories.upsert(ctx, { name: 'Beverages' });
		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({ created: true });

		mockLogEvent.mockClear();
		await Categories.upsert(ctx, { id: CATEGORY, name: 'Drinks' });
		expect(mockLogEvent.mock.calls[0]?.[2]).toMatchObject({ created: false });
	});

	it('logs every operation exactly once', async () => {
		for (const [op, , , run] of OPERATIONS) {
			mockLogEvent.mockClear();
			mockFetch(payloadFor(op));
			const { ctx } = makeCtx();

			await run(ctx);

			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(`loyverse.${op}`);
		}
	});
});
