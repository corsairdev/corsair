import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { chargebeeOperations } from './endpoints/manifest';
import { chargebee } from './index';

/**
 * Live run against a Chargebee TEST site. Skipped unless the key and site
 * are set (CI never runs files named api.test.ts):
 *
 *   CHARGEBEE_API_KEY=test_... CHARGEBEE_SITE=acme-test npx jest api.test.ts
 *
 * The site must be a test site (its name ends in -test): the run creates an
 * item family, items and prices, a coupon, a customer with a subscription,
 * invoices, a credit note and an export, works through them with auto
 * collection off (no gateway is charged), and deletes or voids everything it
 * made at the end. CHARGEBEE_LIVE_REPORT=<file> writes each step as JSON.
 */
const key = process.env.CHARGEBEE_API_KEY;
const site = process.env.CHARGEBEE_SITE;
const ready = Boolean(key && site);
const describeIfKey = ready ? describe : describe.skip;
if (!ready) {
	console.warn(
		'Skipping Chargebee live run: set CHARGEBEE_API_KEY and CHARGEBEE_SITE (a test site).',
	);
} else if (!site?.endsWith('-test')) {
	throw new Error(
		'CHARGEBEE_SITE must be a test site (its name ends in -test)',
	);
}

const STAMP = Date.now().toString(36);

type Step = { id: string; ok: boolean; status?: number; note?: string };

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: Array<string | number>): unknown {
	let node = value;
	for (const part of path) {
		if (typeof node !== 'object' || node === null) return undefined;
		node = (node as Record<string | number, unknown>)[part];
	}
	return node;
}

describeIfKey('chargebee live', () => {
	jest.setTimeout(900_000);
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	let api: Record<string, unknown> = {};
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = api;
		for (const part of id.split('.'))
			node = (node as Record<string, unknown>)[part];
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];
	const ids: Record<string, string> = {};

	async function run(
		id: string,
		input: Record<string, unknown>,
	): Promise<unknown> {
		try {
			const value = await op(id)(input);
			steps.push({ id, ok: true });
			return value;
		} catch (error) {
			steps.push({
				id,
				ok: false,
				status: error instanceof ApiError ? error.status : undefined,
				note: (error instanceof Error ? error.message : String(error)).slice(
					0,
					300,
				),
			});
			return undefined;
		}
	}

	beforeAll(async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'chargebee', 'default');
		const corsair = createCorsair({
			plugins: [chargebee({ key, site })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		api = (
			corsair as unknown as { chargebee: { api: Record<string, unknown> } }
		).chargebee.api;
	});

	afterAll(async () => {
		for (const cleanup of cleanups.reverse()) {
			try {
				await cleanup.run();
			} catch (error) {
				steps.push({
					id: `cleanup:${cleanup.what}`,
					ok: false,
					note: String(error).slice(0, 200),
				});
			}
		}
		const report = process.env.CHARGEBEE_LIVE_REPORT;
		if (report) writeFileSync(report, JSON.stringify({ ids, steps }, null, 1));
		console.log(
			`chargebee live: ${steps.length} steps, ${steps.filter((s) => s.ok).length} ok, ${steps.filter((s) => !s.ok).length} failed; ${new Set(steps.map((s) => s.id)).size} of ${chargebeeOperations.length} operations called`,
		);
	});

	it('reads site settings and lists', async () => {
		await run('configurations.list', {});
		for (const id of [
			'customers.list',
			'subscriptions.list',
			'invoices.list',
			'creditNotes.list',
			'items.list',
			'itemPrices.list',
			'itemFamilies.list',
			'coupons.list',
			'transactions.list',
			'events.list',
			'paymentSources.list',
			'currencies.list',
			'quotes.list',
			'orders.list',
			'features.list',
		]) {
			await run(id, { limit: 5 });
		}
		expect(steps.filter((s) => s.ok).length).toBeGreaterThan(5);
	});

	it('builds a catalog and a customer with a subscription', async () => {
		ids.family = `cf-${STAMP}`;
		await run('itemFamilies.create', {
			id: ids.family,
			name: `Corsair test ${STAMP}`,
		});
		cleanups.push({
			what: 'item family',
			run: () => op('itemFamilies.delete')({ itemFamilyId: ids.family }),
		});
		ids.plan = `plan-${STAMP}`;
		await run('items.create', {
			id: ids.plan,
			name: `Plan ${STAMP}`,
			type: 'plan',
			item_family_id: ids.family,
		});
		cleanups.push({
			what: 'plan item',
			run: () => op('items.delete')({ itemId: ids.plan }),
		});
		ids.price = `${ids.plan}-USD-monthly`;
		await run('itemPrices.create', {
			id: ids.price,
			item_id: ids.plan,
			name: `Plan ${STAMP} monthly`,
			pricing_model: 'flat_fee',
			price: 1500,
			currency_code: 'USD',
			period: 1,
			period_unit: 'month',
		});
		cleanups.push({
			what: 'item price',
			run: () => op('itemPrices.delete')({ itemPriceId: ids.price }),
		});
		await run('items.get', { itemId: ids.plan });
		await run('itemPrices.get', { itemPriceId: ids.price });
		await run('items.update', { itemId: ids.plan, description: 'Live test' });
		await run('itemPrices.update', {
			itemPriceId: ids.price,
			description: 'Live test',
		});
		await run('itemPrices.listApplicableItems', {
			itemPriceId: ids.price,
			limit: 5,
		});

		ids.coupon = `C${STAMP}`.toUpperCase();
		await run('coupons.createForItems', {
			id: ids.coupon,
			name: `Coupon ${STAMP}`,
			discount_type: 'percentage',
			discount_percentage: 10,
			apply_on: 'invoice_amount',
			duration_type: 'one_time',
		});
		cleanups.push({
			what: 'coupon',
			run: () => op('coupons.delete')({ couponId: ids.coupon }),
		});
		await run('coupons.get', { couponId: ids.coupon });
		await run('coupons.updateForItems', {
			couponId: ids.coupon,
			name: `Coupon 2 ${STAMP}`,
		});

		const customer = await run('customers.create', {
			first_name: 'Ada',
			last_name: `Test ${STAMP}`,
			email: `ada.${STAMP}@example.com`,
			auto_collection: 'off',
			billing_address: { first_name: 'Ada', city: 'Pune', country: 'IN' },
			meta_data: { source: 'corsair-live-test' },
		});
		ids.customer = String(pick(customer, 'customer', 'id') ?? '');
		expect(ids.customer).not.toBe('');
		cleanups.push({
			what: 'customer',
			run: () => op('customers.delete')({ customerId: ids.customer }),
		});
		await run('customers.get', { customerId: ids.customer });
		await run('customers.update', {
			customerId: ids.customer,
			company: 'Northpeak Test',
		});
		await run('customers.updateBillingInfo', {
			customerId: ids.customer,
			billing_address: { line1: '1 Main St', city: 'Pune', country: 'IN' },
		});
		await run('customers.listContacts', { customerId: ids.customer });
		await run('customers.addContact', {
			customerId: ids.customer,
			contact: { email: `billing.${STAMP}@example.com`, first_name: 'Billing' },
		});

		await run('estimates.createSubscriptionForItems', {
			customer: { id: `est-${STAMP}` },
			subscription_items: { item_price_id: [ids.price], quantity: [1] },
		});
		const sub = await run('customers.createSubscriptionForItems', {
			customerId: ids.customer,
			subscription_items: { item_price_id: [ids.price], quantity: [2] },
			coupon_ids: [ids.coupon],
			auto_collection: 'off',
		});
		ids.subscription = String(pick(sub, 'subscription', 'id') ?? '');
		ids.invoice = String(pick(sub, 'invoice', 'id') ?? '');
		await run('subscriptions.get', { subscriptionId: ids.subscription });
		await run('subscriptions.getWithScheduledChanges', {
			subscriptionId: ids.subscription,
		});
		await run('subscriptions.listDiscounts', {
			subscriptionId: ids.subscription,
		});
		await run('subscriptions.renewalEstimate', {
			subscriptionId: ids.subscription,
		});
		await run('subscriptions.updateForItems', {
			subscriptionId: ids.subscription,
			subscription_items: { item_price_id: [ids.price], quantity: [3] },
			prorate: false,
			invoice_immediately: false,
		});
		await run('subscriptions.pause', {
			subscriptionId: ids.subscription,
			pause_option: 'immediately',
		});
		await run('subscriptions.resume', {
			subscriptionId: ids.subscription,
			resume_option: 'immediately',
		});
		await run('subscriptions.cancelForItems', {
			subscriptionId: ids.subscription,
			end_of_term: false,
		});
	});

	it('invoices, credits and exports', async () => {
		if (ids.invoice) {
			await run('invoices.get', { invoiceId: ids.invoice });
			await run('invoices.getPdf', { invoiceId: ids.invoice });
			await run('invoices.listPayments', { invoiceId: ids.invoice });
			await run('invoices.addCharge', {
				invoiceId: ids.invoice,
				amount: 100,
				description: 'Live test charge',
			});
		}
		const oneOff = await run('invoices.createForChargeItemsAndCharges', {
			customer_id: ids.customer,
			charges: { amount: [500], description: [`Setup ${STAMP}`] },
			auto_collection: 'off',
		});
		const oneOffId = String(pick(oneOff, 'invoice', 'id') ?? '');
		if (oneOffId) {
			await run('invoices.recordPayment', {
				invoiceId: oneOffId,
				transaction: {
					amount: 500,
					payment_method: 'cash',
					date: Math.floor(Date.now() / 1000),
				},
			});
			const note = await run('creditNotes.create', {
				reference_invoice_id: oneOffId,
				type: 'refundable',
				total: 100,
				create_reason_code: 'Product Unsatisfactory',
			});
			const noteId = String(pick(note, 'credit_note', 'id') ?? '');
			if (noteId) {
				await run('creditNotes.get', { creditNoteId: noteId });
				await run('creditNotes.void', { creditNoteId: noteId });
				await run('creditNotes.delete', { creditNoteId: noteId });
			}
		}
		if (ids.invoice) {
			await run('invoices.void', { invoiceId: ids.invoice });
			await run('invoices.delete', { invoiceId: ids.invoice });
		}
		const exportJob = await run('exports.customers', {
			customer: { id: { is: ids.customer } },
		});
		const exportId = pick(exportJob, 'export', 'id');
		if (exportId) await run('exports.get', { exportId: String(exportId) });
		if (ids.subscription) {
			cleanups.push({
				what: 'subscription',
				run: () =>
					op('subscriptions.delete')({ subscriptionId: ids.subscription }),
			});
		}
	});
});
