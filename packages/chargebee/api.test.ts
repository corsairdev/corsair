import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import manifestJson from './chargebee-manifest.json';
import { chargebeeOperations } from './endpoints/manifest';
import { chargebee } from './index';

/**
 * Live run against a Chargebee TEST site. Skipped unless the key and site
 * are set (CI never runs files named api.test.ts):
 *
 *   CHARGEBEE_API_KEY=test_... CHARGEBEE_SITE=acme-test npx jest api.test.ts
 *
 * The site must be a test site (its name ends in -test). The run reads every
 * list route and one record of each, then builds its own catalog (item
 * family, items, prices, a feature, coupons, a coupon set), a customer with a
 * subscription, invoices, a credit note, a quote, hosted pages, a portal
 * session, a webhook endpoint and an export, with auto collection off (no
 * gateway is charged) and `chargebee-event-email: all-disabled` on every
 * write (no emails). It deletes, voids or archives everything it made at the
 * end and never writes to records it did not create.
 *
 * Errors the site itself causes (a Product Catalog 1.0 route on a 2.0 site, a
 * feature the test site has not turned on) count as expected; any other
 * failure fails the run. CHARGEBEE_LIVE_REPORT=<file> writes each step as JSON.
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
const NOW = Math.floor(Date.now() / 1000);

type ManifestOp = {
	id: string;
	method: string;
	path: string;
	input: {
		properties?: Record<string, { 'x-corsair-in'?: string }>;
		required?: string[];
	};
};
const manifestOps = (manifestJson as unknown as { operations: ManifestOp[] })
	.operations;
const opById = new Map(manifestOps.map((o) => [o.id, o]));

/**
 * Errors the test site causes, not the plugin. Each pattern is matched
 * against `<status> <api_error_code>: <message>`.
 */
const SITE_LIMITS: Array<{ why: string; pattern: RegExp }> = [
	{
		why: 'Product Catalog 1.0 route on a 2.0 site',
		pattern: /incompatible with the product catalog version/,
	},
	{
		why: 'subscription pause is off in the test site settings',
		pattern: /pause feature is currently disabled/,
	},
	{
		why: 'feature not turned on for the test site',
		pattern:
			/not enabled for this site|to enable this api|is disabled for your site|access via API is disabled|entitlements are not enabled/i,
	},
];
/** Per-operation expected errors found on the live run, with the reason. */
const EXPECTED: Record<string, { why: string; pattern: RegExp }> = {
	'fullExports.getStatus': {
		why: 'no full export has run on the site',
		pattern: /^404 /,
	},
	'currencies.get': {
		why: 'single-currency site: the base currency has no site currency record',
		pattern: /^404 /,
	},
	'comments.get': {
		why: 'the comments list lags: it still shows comments deleted moments ago',
		pattern: /^404 /,
	},
	'subscriptions.removeCoupons': {
		why: 'the subscription carries no coupon (see customers.createSubscriptionForItems)',
		pattern: /^404 .*No coupons have been applied/,
	},
	'subscriptions.resume': {
		why: 'pause is off on the site, so the subscription is never paused',
		pattern: /^409 .*Only Paused subscriptions/,
	},
	'subscriptions.resumeSubscriptionEstimate': {
		why: 'pause is off on the site, so the subscription is never paused',
		pattern: /^409 .*Only Paused subscriptions/,
	},
	'invoices.getPaymentSchedules': {
		why: 'the invoice has no payment schedule',
		pattern: /^404 .*Payment schedules/,
	},
	'features.upsertItemEntitlements': {
		why: 'site uses grandfathering: entitlements go through POST /entitlements',
		pattern: /grandfather enabled sites/,
	},
	'items.upsertItemEntitlements': {
		why: 'site uses grandfathering: entitlements go through POST /entitlements',
		pattern: /grandfather enabled sites/,
	},
};
/**
 * List routes the sweep leaves out: they need a filter the spec does not
 * mark required, so they are called with one further down.
 */
const SWEEP_LATER = new Set(['invoices.listPaymentReferenceNumbers']);

type Step = {
	id: string;
	ok: boolean;
	expected?: string;
	status?: number;
	note?: string;
};

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: Array<string | number>): unknown {
	let node = value;
	for (const part of path) {
		if (typeof node !== 'object' || node === null) return undefined;
		node = (node as Record<string | number, unknown>)[part];
	}
	return node;
}

function pathParams(id: string): string[] {
	const props = opById.get(id)?.input.properties ?? {};
	return Object.keys(props).filter(
		(k) => props[k]?.['x-corsair-in'] === 'path',
	);
}

describeIfKey('chargebee live', () => {
	jest.setTimeout(1_800_000);
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	let api: Record<string, unknown> = {};
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = api;
		for (const part of id.split('.'))
			node = (node as Record<string, unknown>)[part];
		if (typeof node !== 'function') throw new Error(`no operation ${id}`);
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];
	const ids: Record<string, string> = {};

	function withNoEmail(id: string, input: Record<string, unknown>) {
		const props = opById.get(id)?.input.properties ?? {};
		return 'eventEmail' in props
			? { eventEmail: 'all-disabled', ...input }
			: input;
	}

	async function run(
		id: string,
		input: Record<string, unknown> = {},
	): Promise<unknown> {
		try {
			const value = await op(id)(withNoEmail(id, input));
			steps.push({ id, ok: true });
			return value;
		} catch (error) {
			const status = error instanceof ApiError ? error.status : undefined;
			const note = (error instanceof Error ? error.message : String(error))
				.replace(/\s+/g, ' ')
				.slice(0, 300);
			const text = `${status} ${note}`;
			const known =
				(EXPECTED[id]?.pattern.test(text) ? EXPECTED[id] : undefined) ??
				SITE_LIMITS.find((limit) => limit.pattern.test(text));
			steps.push({ id, ok: false, expected: known?.why, status, note });
			return undefined;
		}
	}

	/** Runs `id` once; later calls with the same id are skipped. */
	const called = new Set<string>();
	async function once(id: string, input: Record<string, unknown> = {}) {
		if (called.has(id)) return undefined;
		called.add(id);
		return run(id, input);
	}

	function later(what: string, fn: () => Promise<unknown>) {
		cleanups.push({ what, run: fn });
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
				steps.push({ id: `cleanup:${cleanup.what}`, ok: true });
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
		const calls = steps.filter((s) => !s.id.startsWith('cleanup:'));
		const failed = steps.filter((s) => !s.ok && !s.expected);
		console.log(
			[
				`chargebee live: ${calls.length} calls, ${calls.filter((s) => s.ok).length} ok, ${calls.filter((s) => s.expected).length} expected errors, ${failed.length} failed`,
				`${new Set(calls.map((s) => s.id)).size} of ${chargebeeOperations.length} operations called; ${new Set(calls.filter((s) => s.ok).map((s) => s.id)).size} answered 2xx`,
				`cleanup: ${steps.filter((s) => s.id.startsWith('cleanup:') && s.ok).length} of ${cleanups.length} ok`,
				...failed.map((s) => `  FAILED ${s.id} ${s.status ?? ''} ${s.note}`),
			].join('\n'),
		);
		// Every cleanup has run by now; one that failed left a record behind.
		expect(
			steps
				.filter((s) => s.id.startsWith('cleanup:') && !s.ok)
				.map((s) => `${s.id}: ${s.note}`),
		).toEqual([]);
	});

	it('reads every list route and one record from each', async () => {
		const firstIds: Record<string, string> = {};
		const lists = manifestOps.filter(
			(o) =>
				o.method === 'GET' &&
				!o.path.includes('{') &&
				!(o.input.required ?? []).length &&
				!SWEEP_LATER.has(o.id),
		);
		const listed: Record<string, unknown> = {};
		for (const list of lists) {
			const takesLimit = 'limit' in (list.input.properties ?? {});
			const value = await once(list.id, takesLimit ? { limit: 3 } : {});
			listed[list.id] = value;
			const first = pick(value, 'list', 0);
			if (first && typeof first === 'object') {
				const record = Object.values(first as Record<string, unknown>)[0];
				const id = pick(record, 'id');
				if (typeof id === 'string' || typeof id === 'number')
					firstIds[list.id.replace(/\.list$/, '')] = String(id);
			}
		}
		ids.demoCustomer = firstIds.customers ?? '';
		ids.demoSubscription = firstIds.subscriptions ?? '';
		ids.demoInvoice = firstIds.invoices ?? '';
		ids.demoCreditNote = firstIds.creditNotes ?? '';
		ids.demoQuote = firstIds.quotes ?? '';
		ids.siteCurrency = firstIds.currencies ?? '';
		// One get per list that returned a record (reads only: these are the
		// site's own demo records).
		for (const [group, id] of Object.entries(firstIds)) {
			const get = `${group}.get`;
			const params = pathParams(get);
			if (opById.has(get) && params.length === 1)
				await once(get, { [params[0] as string]: id });
		}
		const currency = listed['currencies.getList'];
		// next_offset comes back as a string offset takes (Chargebee sends an
		// array here): the second page starts after the first.
		const first = listed['customers.list'];
		const offset = pick(first, 'next_offset');
		if (typeof offset === 'string') {
			const page2 = await run('customers.list', { limit: 3, offset });
			const firstIds = new Set(
				((pick(first, 'list') as unknown[]) ?? []).map((r) =>
					pick(r, 'customer', 'id'),
				),
			);
			const next = ((pick(page2, 'list') as unknown[]) ?? []).map((r) =>
				pick(r, 'customer', 'id'),
			);
			expect(next.length).toBeGreaterThan(0);
			expect(next.some((id) => firstIds.has(id))).toBe(false);
		}
		ids.currency = String(
			pick(currency, 'list', 0, 'currency', 'currency_code') ?? 'USD',
		);
		const currencyId = pick(currency, 'list', 0, 'currency', 'id');
		if (currencyId)
			await once('currencies.get', { siteCurrencyId: currencyId });
		await once('timeMachines.get', { timeMachineName: 'delorean' });
		await once('fullExports.getStatus', {
			table: 'customers',
			date: new Date().toISOString().slice(0, 10),
		});
		if (ids.demoCustomer) {
			for (const id of [
				'customers.listContacts',
				'customers.listEmailLogs',
				'customers.listEntitlements',
				'customers.listPaymentVouchers',
			])
				await once(id, { customerId: ids.demoCustomer });
		}
		if (ids.demoSubscription) {
			for (const id of [
				'subscriptions.getScheduledChanges',
				'subscriptions.getUsageCharges',
				'subscriptions.listContractTerms',
				'subscriptions.listEntitlements',
				'subscriptions.listEntitlementOverrides',
				'subscriptions.listAlertStatuses',
				'subscriptions.listApplicableAlerts',
				'subscriptions.getAdvanceInvoiceSchedule',
			])
				await once(id, { subscriptionId: ids.demoSubscription });
			for (const id of [
				'grantBlocks.list',
				'ledgerAccountBalances.list',
				'ledgerOperations.list',
				'ramps.list',
			])
				await once(id, {
					subscription_id: { is: ids.demoSubscription },
					limit: 3,
				});
		}
		if (ids.demoInvoice) {
			for (const id of [
				'invoices.listPaymentVouchers',
				'invoices.getPaymentSchedules',
			])
				await once(id, { invoiceId: ids.demoInvoice });
			await once('invoices.listPaymentReferenceNumbers', {
				id: { is: ids.demoInvoice },
				limit: 3,
			});
		}
		if (ids.demoQuote) {
			await once('quotes.listLineGroups', { quoteId: ids.demoQuote });
			await once('quotes.listEntitlements', { quoteId: ids.demoQuote });
		}
		expect(steps.filter((s) => s.ok).length).toBeGreaterThan(30);
	});

	it('builds a catalog: family, items, prices, feature, coupons', async () => {
		const cur = ids.currency;
		ids.family = `cf-${STAMP}`;
		await once('itemFamilies.create', {
			id: ids.family,
			name: `Corsair test ${STAMP}`,
		});
		later('item family', () =>
			op('itemFamilies.delete')({ itemFamilyId: ids.family }),
		);
		await once('itemFamilies.get', { itemFamilyId: ids.family });
		await once('itemFamilies.update', {
			itemFamilyId: ids.family,
			description: 'Live test family',
		});

		ids.plan = `plan-${STAMP}`;
		ids.addon = `addon-${STAMP}`;
		ids.charge = `charge-${STAMP}`;
		for (const [itemId, type] of [
			[ids.plan, 'plan'],
			[ids.addon, 'addon'],
			[ids.charge, 'charge'],
		] as const) {
			await run('items.create', {
				id: itemId,
				name: `${type} ${STAMP}`,
				type,
				item_family_id: ids.family,
			});
			later(`${type} item`, () => op('items.delete')({ itemId }));
		}
		await once('items.get', { itemId: ids.plan });
		await once('items.update', { itemId: ids.plan, description: 'Live test' });

		ids.price = `${ids.plan}-${cur}-monthly`;
		ids.addonPrice = `${ids.addon}-${cur}-monthly`;
		ids.chargePrice = `${ids.charge}-${cur}`;
		await run('itemPrices.create', {
			id: ids.price,
			item_id: ids.plan,
			name: `Plan ${STAMP} monthly`,
			// per_unit so the subscription can carry a quantity: Chargebee
			// refuses quantity[] for a flat_fee price ("should not be sent for
			// on_off addon type", whatever the item type).
			pricing_model: 'per_unit',
			price: 1500,
			currency_code: cur,
			period: 1,
			period_unit: 'month',
		});
		await run('itemPrices.create', {
			id: ids.addonPrice,
			item_id: ids.addon,
			name: `Addon ${STAMP} monthly`,
			// flat_fee: no quantity on the subscription.
			pricing_model: 'flat_fee',
			price: 300,
			currency_code: cur,
			period: 1,
			period_unit: 'month',
		});
		await run('itemPrices.create', {
			id: ids.chargePrice,
			item_id: ids.charge,
			name: `Charge ${STAMP}`,
			pricing_model: 'flat_fee',
			price: 700,
			currency_code: cur,
		});
		for (const priceId of [ids.chargePrice, ids.addonPrice, ids.price])
			later(`item price ${priceId}`, () =>
				op('itemPrices.delete')({ itemPriceId: priceId }),
			);
		await once('itemPrices.get', { itemPriceId: ids.price });
		await once('itemPrices.update', {
			itemPriceId: ids.price,
			description: 'Live test',
		});
		await once('itemPrices.listApplicableItems', {
			itemPriceId: ids.price,
			limit: 5,
		});
		await once('itemPrices.listApplicableItemPrices', {
			itemPriceId: ids.price,
			limit: 5,
		});

		// The addon attached to the plan, and a differential price for it.
		const attached = await once('items.createAttachedItem', {
			itemId: ids.plan,
			item_id: ids.addon,
			type: 'optional',
		});
		ids.attached = String(pick(attached, 'attached_item', 'id') ?? '');
		await once('items.listAttachedItems', { itemId: ids.plan, limit: 5 });
		if (ids.attached) {
			await once('attachedItems.get', {
				attachedItemId: ids.attached,
				parent_item_id: ids.plan,
			});
			await once('attachedItems.update', {
				attachedItemId: ids.attached,
				parent_item_id: ids.plan,
				type: 'recommended',
			});
			later('attached item', () =>
				op('attachedItems.delete')({
					attachedItemId: ids.attached,
					parent_item_id: ids.plan,
				}),
			);
		}
		const diff = await once('itemPrices.createDifferentialPrice', {
			itemPriceId: ids.addonPrice,
			parent_item_id: ids.plan,
			price: 250,
		});
		ids.differential = String(pick(diff, 'differential_price', 'id') ?? '');
		if (ids.differential) {
			await once('differentialPrices.get', {
				differentialPriceId: ids.differential,
				item_price_id: ids.addonPrice,
			});
			await once('differentialPrices.update', {
				differentialPriceId: ids.differential,
				item_price_id: ids.addonPrice,
				parent_item_id: ids.plan,
				price: 200,
			});
			later('differential price', () =>
				op('differentialPrices.delete')({
					differentialPriceId: ids.differential,
					item_price_id: ids.addonPrice,
				}),
			);
		}

		// A switch feature, entitled on the plan.
		ids.feature = `feat-${STAMP}`;
		await once('features.create', {
			id: ids.feature,
			name: `Feature ${STAMP}`,
			type: 'switch',
			status: 'draft',
		});
		// A site that refuses features (an expected error) made nothing to delete.
		if (!steps.at(-1)?.expected)
			later('feature', () => op('features.delete')({ featureId: ids.feature }));
		await once('features.get', { featureId: ids.feature });
		await once('features.update', {
			featureId: ids.feature,
			// Chargebee answers 400 "Feature Name cannot be empty" without it.
			name: `Feature ${STAMP}`,
			description: 'Live test feature',
		});
		await once('features.activate', { featureId: ids.feature });
		await once('features.upsertItemEntitlements', {
			featureId: ids.feature,
			action: 'upsert',
			item_entitlements: { item_id: [ids.plan], item_type: ['plan'] },
		});
		await once('entitlements.create', {
			action: 'upsert',
			entitlements: {
				entity_id: [ids.plan],
				entity_type: ['plan'],
				feature_id: [ids.feature],
				// A switch feature's value is "true"; without it Chargebee answers
				// 400 "Entitlement is invalid".
				value: ['true'],
			},
		});
		await once('entitlements.list', {
			feature_id: { is: ids.feature },
			limit: 5,
		});
		await once('features.listItemEntitlements', {
			featureId: ids.feature,
			limit: 5,
		});
		await once('items.listItemEntitlements', { itemId: ids.plan, limit: 5 });
		await once('items.upsertItemEntitlements', {
			itemId: ids.plan,
			action: 'remove',
			item_entitlements: { feature_id: [ids.feature] },
		});
		await run('entitlements.create', {
			action: 'remove',
			entitlements: {
				entity_id: [ids.plan],
				entity_type: ['plan'],
				feature_id: [ids.feature],
			},
		});
		await once('features.archive', { featureId: ids.feature });
		await once('features.reactivate', { featureId: ids.feature });
		await run('features.archive', { featureId: ids.feature });

		// Coupons and a coupon set with one code.
		ids.coupon = `C${STAMP}`.toUpperCase();
		await once('coupons.createForItems', {
			id: ids.coupon,
			name: `Coupon ${STAMP}`,
			discount_type: 'percentage',
			discount_percentage: 10,
			apply_on: 'invoice_amount',
			duration_type: 'one_time',
		});
		later('coupon', () => op('coupons.delete')({ couponId: ids.coupon }));
		await once('coupons.get', { couponId: ids.coupon });
		await once('coupons.updateForItems', {
			couponId: ids.coupon,
			name: `Coupon 2 ${STAMP}`,
		});
		ids.couponSet = `cs-${STAMP}`;
		await once('couponSets.create', {
			id: ids.couponSet,
			coupon_id: ids.coupon,
			name: `Set ${STAMP}`,
		});
		later('coupon set', () =>
			op('couponSets.delete')({ couponSetId: ids.couponSet }),
		);
		await once('couponSets.get', { couponSetId: ids.couponSet });
		await once('couponSets.update', {
			couponSetId: ids.couponSet,
			name: `Set 2 ${STAMP}`,
		});
		ids.couponCode = `CODE${STAMP}`.toUpperCase();
		await once('couponSets.addCouponCodes', {
			couponSetId: ids.couponSet,
			code: [ids.couponCode],
		});
		await once('couponCodes.get', { couponCodeCode: ids.couponCode });
		// couponCodes.archive is not called: a set holding an archived code
		// can never be deleted ("Coupon Set with redeemed/archived coupon
		// codes cannot be deleted"), so the run would leave it behind.
		await once('couponSets.deleteUnusedCouponCodes', {
			couponSetId: ids.couponSet,
		});
		// Comments outlive the record they are on, so this one is deleted.
		const familyComment = await once('comments.create', {
			entity_type: 'item_family',
			entity_id: ids.family,
			notes: 'Live test comment',
		});
		const familyCommentId = pick(familyComment, 'comment', 'id');
		if (familyCommentId)
			later('item family comment', () =>
				op('comments.delete')({ commentId: familyCommentId }),
			);
	});

	it('runs a customer through a subscription', async () => {
		const customer = await once('customers.create', {
			first_name: 'Ada',
			last_name: `Test ${STAMP}`,
			email: `ada.${STAMP}@example.com`,
			auto_collection: 'off',
			billing_address: { first_name: 'Ada', city: 'Pune', country: 'IN' },
			meta_data: { source: 'corsair-live-test' },
		});
		ids.customer = String(pick(customer, 'customer', 'id') ?? '');
		expect(ids.customer).not.toBe('');
		later('customer', () =>
			op('customers.delete')({ customerId: ids.customer }),
		);
		const customerId = ids.customer;
		await once('customers.get', { customerId });
		await once('customers.update', { customerId, company: 'Northpeak Test' });
		await once('customers.updateBillingInfo', {
			customerId,
			billing_address: { line1: '1 Main St', city: 'Pune', country: 'IN' },
		});
		const withContact = await once('customers.addContact', {
			customerId,
			contact: { email: `billing.${STAMP}@example.com`, first_name: 'Billing' },
		});
		const contactId = pick(withContact, 'customer', 'contacts', 0, 'id');
		await run('customers.listContacts', { customerId });
		if (contactId) {
			await once('customers.updateContact', {
				customerId,
				contact: { id: contactId, last_name: 'Contact' },
			});
			await once('customers.deleteContact', {
				customerId,
				contact: { id: contactId },
			});
		}
		const comment = await run('comments.create', {
			entity_type: 'customer',
			entity_id: customerId,
			notes: 'Live test comment',
		});
		const commentId = pick(comment, 'comment', 'id');
		if (commentId) {
			await once('comments.get', { commentId });
			await once('comments.delete', { commentId });
		}
		await once('promotionalCredits.add', {
			customer_id: customerId,
			amount: 200,
			description: 'Live test credit',
		});
		await once('promotionalCredits.deduct', {
			customer_id: customerId,
			amount: 50,
			description: 'Live test deduct',
		});
		await once('promotionalCredits.set', {
			customer_id: customerId,
			amount: 0,
			description: 'Live test reset',
		});

		const items = { item_price_id: [ids.price], quantity: [1] };
		await once('estimates.createSubscriptionForItems', {
			customer: { id: `est-${STAMP}` },
			subscription_items: items,
			coupon_ids: [ids.coupon],
		});
		await once('customers.createSubscriptionForItemsEstimate', {
			customerId,
			subscription_items: items,
		});
		const sub = await once('customers.createSubscriptionForItems', {
			customerId,
			subscription_items: {
				// The plan's quantity only: the addon is on/off.
				item_price_id: [ids.price, ids.addonPrice],
				quantity: [2],
			},
			// No coupon here: a coupon that was ever applied to a subscription
			// is only archived by coupons.delete, never removed. The estimate
			// above carries it instead.
			auto_collection: 'off',
		});
		ids.subscription = String(pick(sub, 'subscription', 'id') ?? '');
		ids.invoice = String(pick(sub, 'invoice', 'id') ?? '');
		expect(ids.subscription).not.toBe('');
		const subscriptionId = ids.subscription;
		later('subscription', () => op('subscriptions.delete')({ subscriptionId }));
		await once('customers.getUpcomingInvoicesEstimate', { customerId });
		for (const id of [
			'subscriptions.get',
			'subscriptions.listDiscounts',
			'subscriptions.renewalEstimate',
			'subscriptions.listEntitlements',
			'subscriptions.getScheduledChanges',
		])
			await run(id, { subscriptionId });
		await once('estimates.updateSubscriptionForItems', {
			subscription: { id: subscriptionId },
			subscription_items: { item_price_id: [ids.price], quantity: [3] },
		});
		// A change at term end, read back and dropped, then one made now.
		await once('subscriptions.updateForItems', {
			subscriptionId,
			subscription_items: { item_price_id: [ids.price], quantity: [4] },
			change_option: 'end_of_term',
		});
		await once('subscriptions.getWithScheduledChanges', { subscriptionId });
		await once('subscriptions.removeScheduledChanges', { subscriptionId });
		await run('subscriptions.updateForItems', {
			subscriptionId,
			subscription_items: { item_price_id: [ids.price], quantity: [3] },
			prorate: false,
			invoice_immediately: false,
		});
		await once('subscriptions.removeCoupons', { subscriptionId });
		await once('subscriptions.addChargeAtTermEnd', {
			subscriptionId,
			amount: 100,
			description: 'Live test charge at term end',
		});
		const unbilled = await once('unbilledCharges.list', {
			subscription_id: { is: subscriptionId },
			limit: 5,
		});
		await once('unbilledCharges.invoiceNowEstimate', {
			subscription_id: subscriptionId,
		});
		const unbilledId = pick(unbilled, 'list', 0, 'unbilled_charge', 'id');
		if (unbilledId)
			await once('unbilledCharges.delete', { unbilledChargeId: unbilledId });
		await once('unbilledCharges.createForItems', {
			subscription_id: subscriptionId,
			charges: { amount: [100], description: ['Live test unbilled'] },
		});
		await once('subscriptions.advanceInvoiceEstimate', {
			subscriptionId,
			terms_to_charge: 1,
		});
		const termEnd = NOW + 40 * 86400;
		await once('subscriptions.changeTermEndEstimate', {
			subscriptionId,
			term_ends_at: termEnd,
		});
		await once('subscriptions.changeTermEnd', {
			subscriptionId,
			term_ends_at: termEnd,
			prorate: false,
			invoice_immediately: false,
		});
		await once('subscriptions.pauseSubscriptionEstimate', {
			subscriptionId,
			pause_option: 'immediately',
		});
		await once('subscriptions.pause', {
			subscriptionId,
			pause_option: 'immediately',
		});
		await once('subscriptions.resumeSubscriptionEstimate', {
			subscriptionId,
			resume_option: 'immediately',
		});
		await once('subscriptions.resume', {
			subscriptionId,
			resume_option: 'immediately',
		});
		await once('subscriptions.cancelSubscriptionForItemsEstimate', {
			subscriptionId,
			end_of_term: true,
		});
		await once('subscriptions.cancelForItems', {
			subscriptionId,
			end_of_term: true,
		});
		await once('subscriptions.removeScheduledCancellation', {
			subscriptionId,
		});
		await run('subscriptions.cancelForItems', {
			subscriptionId,
			end_of_term: false,
		});
		await once('subscriptions.reactivate', { subscriptionId });
		await run('subscriptions.cancelForItems', {
			subscriptionId,
			end_of_term: false,
		});
	});

	it('invoices, credit notes, quotes, hosted pages, webhooks, exports', async () => {
		const customerId = ids.customer;
		if (ids.invoice) {
			const invoiceId = ids.invoice;
			await once('invoices.get', { invoiceId });
			await once('invoices.getPdf', { invoiceId });
			await once('invoices.listPayments', { invoiceId });
			await once('invoices.updateDetails', {
				invoiceId,
				po_number: `PO-${STAMP}`,
			});
		}
		const pending = await once('invoices.createForChargeItemsAndCharges', {
			customer_id: customerId,
			charges: { amount: [500], description: [`Setup ${STAMP}`] },
			item_prices: { item_price_id: [ids.chargePrice], quantity: [1] },
			auto_collection: 'off',
		});
		const invoiceId = String(pick(pending, 'invoice', 'id') ?? '');
		if (invoiceId) {
			await once('invoices.applyCredits', { invoiceId });
			await once('invoices.recordPayment', {
				invoiceId,
				transaction: { amount: 500, payment_method: 'cash', date: NOW },
			});
			const paid = await run('invoices.get', { invoiceId });
			const txn = pick(paid, 'invoice', 'linked_payments', 0, 'txn_id');
			if (txn) await run('transactions.get', { transactionId: txn });
			const note = await once('creditNotes.create', {
				reference_invoice_id: invoiceId,
				type: 'refundable',
				total: 100,
				create_reason_code: 'Product Unsatisfactory',
			});
			const creditNoteId = String(pick(note, 'credit_note', 'id') ?? '');
			if (creditNoteId) {
				await once('creditNotes.get', { creditNoteId });
				await once('creditNotes.getPdf', { creditNoteId });
				// The refund date must be after the credit note's own date.
				await new Promise((done) => setTimeout(done, 1500));
				const refund = await once('creditNotes.recordRefund', {
					creditNoteId,
					transaction: {
						amount: 100,
						payment_method: 'cash',
						date: Math.floor(Date.now() / 1000),
					},
					comment: 'Live test refund',
				});
				// Undo in reverse: Chargebee refuses to void a refunded credit
				// note or a paid invoice, so the offline refund and payment are
				// deleted first.
				const refundTxn = pick(refund, 'transaction', 'id');
				if (refundTxn)
					await once('transactions.deleteOfflineTransaction', {
						transactionId: refundTxn,
						comment: 'Live test cleanup',
					});
				await once('creditNotes.void', { creditNoteId });
				await once('creditNotes.delete', { creditNoteId });
			}
			if (txn) {
				// The payment comes off the invoice before it can be deleted.
				await once('invoices.removePayment', {
					invoiceId,
					transaction: { id: txn },
				});
				await run('transactions.deleteOfflineTransaction', {
					transactionId: txn,
					comment: 'Live test cleanup',
				});
			}
			await once('invoices.void', { invoiceId });
			await once('invoices.delete', { invoiceId });
		}
		if (ids.invoice) {
			// The subscription's unpaid invoice: an adjustment credit note that
			// is voided and deleted, then the invoice itself.
			const adjustment = await run('creditNotes.create', {
				reference_invoice_id: ids.invoice,
				type: 'adjustment',
				total: 100,
				create_reason_code: 'Product Unsatisfactory',
			});
			const adjustmentId = pick(adjustment, 'credit_note', 'id');
			if (adjustmentId) {
				await once('creditNotes.update', {
					creditNoteId: adjustmentId,
					comment: 'Live test',
				});
				await run('creditNotes.void', { creditNoteId: adjustmentId });
				await run('creditNotes.delete', { creditNoteId: adjustmentId });
			}
		}
		if (ids.invoice) {
			await run('invoices.void', { invoiceId: ids.invoice });
			await run('invoices.delete', { invoiceId: ids.invoice });
		}
		await once('estimates.createInvoiceForItems', {
			invoice: { customer_id: customerId },
			charges: { amount: [300], description: ['Estimate charge'] },
		});

		const quote = await once('quotes.createForChargeItemsAndCharges', {
			customer_id: customerId,
			charges: { amount: [900], description: [`Quote ${STAMP}`] },
		});
		const quoteId = String(pick(quote, 'quote', 'id') ?? '');
		if (quoteId) {
			await once('quotes.get', { quoteId });
			await once('quotes.listLineGroups', { quoteId });
			await once('quotes.getPdf', { quoteId });
			await once('quotes.extendExpiryDate', {
				quoteId,
				valid_till: NOW + 20 * 86400,
			});
			await once('quotes.updateStatus', { quoteId, status: 'declined' });
			await once('quotes.delete', { quoteId });
		}

		const page = await once('hostedPages.checkoutNewForItems', {
			subscription_items: { item_price_id: [ids.price], quantity: [1] },
			customer: { id: `hp-${STAMP}` },
		});
		const hostedPageId = pick(page, 'hosted_page', 'id');
		if (hostedPageId) await run('hostedPages.get', { hostedPageId });
		await once('hostedPages.managePaymentSources', {
			customer: { id: customerId },
		});
		const portal = await once('portalSessions.create', {
			customer: { id: customerId },
		});
		const portalSessionId = pick(portal, 'portal_session', 'id');
		if (portalSessionId) {
			await once('portalSessions.get', { portalSessionId });
			await once('portalSessions.logout', { portalSessionId });
		}

		const hook = await once('webhookEndpoints.create', {
			name: `corsair-${STAMP}`,
			url: `https://example.com/corsair-live-${STAMP}`,
			api_version: 'v2',
			disabled: true,
			enabled_events: ['customer_created'],
		});
		const webhookEndpointId = pick(hook, 'webhook_endpoint', 'id');
		if (webhookEndpointId) {
			later('webhook endpoint', () =>
				op('webhookEndpoints.delete')({ webhookEndpointId }),
			);
			await run('webhookEndpoints.get', { webhookEndpointId });
			await once('webhookEndpoints.update', {
				webhookEndpointId,
				name: `corsair-${STAMP}-2`,
			});
		}

		const exportJob = await once('exports.customers', {
			customer: { id: { is: customerId } },
		});
		const exportId = pick(exportJob, 'export', 'id');
		if (exportId) await once('exports.get', { exportId: String(exportId) });
		await once('exports.items', { item: { id: { is: ids.plan } } });
		await once('exports.itemPrices', {
			item_price: { id: { is: ids.price } },
		});

		const excess = await once('customers.recordExcessPayment', {
			customerId,
			transaction: { amount: 100, payment_method: 'cash', date: NOW },
		});
		const excessTxn = pick(excess, 'transaction', 'id');
		if (excessTxn)
			await run('transactions.deleteOfflineTransaction', {
				transactionId: excessTxn,
				comment: 'Live test cleanup',
			});

		const failed = steps.filter((s) => !s.ok && !s.expected);
		expect(failed.map((s) => `${s.id}: ${s.note}`)).toEqual([]);
	});
});
