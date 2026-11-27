import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { woocommerceOperations } from './endpoints/manifest';
import { woocommerce } from './index';

/**
 * Live run against a throwaway store: the Docker WordPress of the wordpress
 * plugin's live suite with WooCommerce installed (`wp plugin install
 * woocommerce --activate`) and a Read/Write REST API key pair.
 *
 *   WOOCOMMERCE_SITE_URL=http://localhost:8093 WOOCOMMERCE_CONSUMER_KEY=ck_... \
 *     WOOCOMMERCE_CONSUMER_SECRET=cs_... npx jest api.test.ts
 *
 * Over plain HTTP the plugin signs with OAuth 1.0a, so this also checks the
 * signing against WooCommerce itself. Skipped unless the three are set (CI
 * never runs files named api.test.ts). The run creates and deletes products,
 * orders, customers, coupons, taxes, zones and webhooks, flips the bacs
 * gateway and one setting and puts them back, and runs the clear_transients
 * tool. Only point it at a store you can throw away: order emails are sent
 * (a Docker site without mail delivers none).
 *
 * With WOOCOMMERCE_HOOK_URL (a listener the store can reach, such as a small
 * container on the store's Docker network) and WOOCOMMERCE_HOOK_DIR (where
 * that listener writes each delivery as { headers, body } JSON, `body` the raw
 * request body, since the signature covers its exact bytes), the run also
 * registers signed webhooks and feeds every delivery through processWebhook.
 * The store must allow private delivery URLs and deliver synchronously
 * (filters http_request_host_is_external and woocommerce_webhook_deliver_async
 * in an mu-plugin on the test site). WOOCOMMERCE_LIVE_REPORT=<file> writes
 * every operation's result.
 */
const siteUrl = process.env.WOOCOMMERCE_SITE_URL;
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const hookUrl = process.env.WOOCOMMERCE_HOOK_URL;
const hookDir = process.env.WOOCOMMERCE_HOOK_DIR;
const ready = Boolean(siteUrl && consumerKey && consumerSecret);
const describeIfLive = ready ? describe : describe.skip;
if (!ready) {
	console.warn(
		'Skipping WooCommerce live run: set WOOCOMMERCE_SITE_URL, WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET (a throwaway store).',
	);
}

const STAMP = Date.now().toString(36);
const HOOK_SECRET = `hook-${STAMP}-secret`;
const MISSING = 987654321;

type Result = { ok: boolean; expected?: string; error?: string };
// `any` because the live run walks responses of 155 operations by field name.
type Json = any;
type Delivery = { headers: Record<string, string>; body: string };

describeIfLive('woocommerce live', () => {
	jest.setTimeout(600_000);
	const results: Record<string, Result> = {};

	function fn(api: Json, id: string): (input: object) => Promise<Json> {
		let node = api;
		for (const part of id.split('.')) node = node?.[part];
		if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
		return node;
	}

	it('runs every operation against the store', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'woocommerce', 'default');
		const corsair = createCorsair({
			plugins: [
				woocommerce({
					key: consumerSecret,
					siteUrl,
					consumerKey,
					webhookSecret: HOOK_SECRET,
				}),
			],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		const api = corsair.woocommerce.api;
		const r = async (id: string, input: object = {}, expected?: RegExp) => {
			try {
				const out = await fn(api, id)(input);
				// A later success never hides an earlier failure of the same operation.
				if (results[id]?.ok !== false) results[id] = { ok: true };
				return out;
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				if (!expected?.test(message)) {
					// Any unexpected failure is kept, whatever ran before or after.
					results[id] = { ok: false, error: message.slice(0, 300) };
				} else if (results[id]?.ok !== false) {
					results[id] = { ok: true, expected: message.slice(0, 160) };
				}
				return undefined;
			}
		};

		// Signed webhooks to the listener.
		const startedAt = Date.now();
		const hookIds: number[] = [];
		if (hookUrl && hookDir) {
			for (const topic of [
				'order.created',
				'order.updated',
				'order.deleted',
				'product.created',
				'product.updated',
				'product.deleted',
				'customer.created',
				'customer.deleted',
				'coupon.created',
				'coupon.deleted',
				'action.woocommerce_order_note_added',
			]) {
				const hook = await r('webhooks.create', {
					name: `live ${topic} ${STAMP}`,
					topic,
					status: 'active',
					secret: HOOK_SECRET,
					delivery_url: hookUrl,
				});
				if (hook?.id) hookIds.push(hook.id);
			}
		}

		// Store data, settings, gateways.
		await r('data.index');
		await r('data.continents.list');
		await r('data.continents.get', { location: 'eu' });
		await r('data.countries.list');
		await r('data.countries.get', { location: 'us' });
		await r('data.currencies.list');
		await r('data.currencies.get', { currency: 'eur' });
		await r('data.currencies.current');
		await r('settings.groups');
		await r('settings.list', { group_id: 'general' });
		const address = await r('settings.get', {
			group_id: 'general',
			id: 'woocommerce_store_address',
		});
		await r('settings.update', {
			group_id: 'general',
			id: 'woocommerce_store_address',
			value: `1 Live St ${STAMP}`,
		});
		await r('settings.batch', {
			group_id: 'general',
			update: [
				{ id: 'woocommerce_store_address', value: address?.value ?? '' },
			],
		});
		await r('settings.batchAll', {
			update: [
				{
					group_id: 'general',
					id: 'woocommerce_store_city',
					value: 'Live City',
				},
			],
		});
		await r('paymentGateways.list');
		const bacs = await r('paymentGateways.get', { id: 'bacs' });
		await r('paymentGateways.update', { id: 'bacs', enabled: true });
		await fn(
			api,
			'paymentGateways.update',
		)({ id: 'bacs', enabled: Boolean(bacs?.enabled) }).catch(() => undefined);
		await r('shippingMethods.list');
		await r('shippingMethods.get', { id: 'flat_rate' });
		await r('systemStatus.get');
		await r('systemStatus.tools.list');
		await r('systemStatus.tools.get', { id: 'clear_transients' });
		await r('systemStatus.tools.run', { id: 'clear_transients' });

		// Taxonomies and attributes.
		const cat = await r('products.categories.create', {
			name: `Apparel ${STAMP}`,
		});
		await r('products.categories.get', { id: cat?.id });
		await r('products.categories.list', { search: STAMP });
		await r('products.categories.update', {
			id: cat?.id,
			description: 'Clothes',
		});
		const tag = await r('products.tags.create', { name: `sale-${STAMP}` });
		await r('products.tags.get', { id: tag?.id });
		await r('products.tags.list');
		await r('products.tags.update', { id: tag?.id, description: 'On sale' });
		const brand = await r('products.brands.create', { name: `Brand ${STAMP}` });
		await r('products.brands.get', { id: brand?.id });
		await r('products.brands.list');
		await r('products.brands.update', { id: brand?.id, description: 'Ours' });
		const sclass = await r('products.shippingClasses.create', {
			name: `Bulky ${STAMP}`,
		});
		await r('products.shippingClasses.get', { id: sclass?.id });
		await r('products.shippingClasses.list');
		await r('products.shippingClasses.update', {
			id: sclass?.id,
			description: 'Big boxes',
		});
		await r('products.shippingClasses.suggestSlug', { name: `Bulky ${STAMP}` });
		const attr = await r('products.attributes.create', {
			name: `Size${STAMP}`,
			slug: `size${STAMP}`,
		});
		await r('products.attributes.get', { id: attr?.id });
		await r('products.attributes.list');
		await r('products.attributes.update', { id: attr?.id, order_by: 'name' });
		const term = await r('products.attributes.terms.create', {
			attribute_id: attr?.id,
			name: 'Large',
		});
		await r('products.attributes.terms.get', {
			attribute_id: attr?.id,
			id: term?.id,
		});
		await r('products.attributes.terms.list', { attribute_id: attr?.id });
		await r('products.attributes.terms.update', {
			attribute_id: attr?.id,
			id: term?.id,
			description: 'L',
		});
		await r('products.attributes.terms.batch', {
			attribute_id: attr?.id,
			create: [{ name: 'Small' }],
		});

		// Products, variations, reviews.
		const simple = await r('products.create', {
			name: `Live Hoodie ${STAMP}`,
			type: 'simple',
			regular_price: '49.00',
			sku: `HOODIE-${STAMP}`,
			categories: [{ id: cat?.id }],
			tags: [{ id: tag?.id }],
			brands: brand?.id ? [{ id: brand.id }] : undefined,
			manage_stock: true,
			stock_quantity: 10,
			meta_data: [{ key: 'live_run', value: STAMP }],
		});
		await r('products.get', { id: simple?.id });
		await r('products.list', { search: STAMP, per_page: 5 });
		await r('products.update', { id: simple?.id, sale_price: '39.00' });
		const copy = await r('products.duplicate', { id: simple?.id });
		await r('products.related', { id: simple?.id });
		await r('products.suggested', { categories: [cat?.id] });
		await r('products.customFieldNames');
		const variable = await r('products.create', {
			name: `Live Tee ${STAMP}`,
			type: 'variable',
			attributes: [
				{
					id: attr?.id,
					variation: true,
					visible: true,
					options: ['Large', 'Small'],
				},
			],
		});
		const variation = await r('products.variations.create', {
			product_id: variable?.id,
			regular_price: '20.00',
			attributes: [{ id: attr?.id, option: 'Large' }],
		});
		await r('products.variations.get', {
			product_id: variable?.id,
			id: variation?.id,
		});
		await r('products.variations.list', { product_id: variable?.id });
		await r('products.variations.update', {
			product_id: variable?.id,
			id: variation?.id,
			regular_price: '21.00',
		});
		await r('products.variations.generate', { product_id: variable?.id });
		await r('products.variations.batch', {
			product_id: variable?.id,
			update: [{ id: variation?.id, sale_price: '18.00' }],
		});
		await r('variations.list', { per_page: 5 });
		const review = await r('products.reviews.create', {
			product_id: simple?.id,
			review: 'Warm and comfy.',
			reviewer: 'Ada',
			reviewer_email: 'ada@example.com',
			rating: 5,
		});
		await r('products.reviews.get', { id: review?.id });
		await r('products.reviews.list', { product: [simple?.id] });
		await r('products.reviews.update', { id: review?.id, rating: 4 });
		await r('products.reviews.batch', {
			update: [{ id: review?.id, review: 'Still comfy.' }],
		});

		// Customers, coupons, taxes.
		const customer = await r('customers.create', {
			email: `ada-${STAMP}@example.com`,
			first_name: 'Ada',
			last_name: 'Lovelace',
			billing: {
				first_name: 'Ada',
				email: `ada-${STAMP}@example.com`,
				country: 'GB',
			},
		});
		await r('customers.get', { id: customer?.id });
		await r('customers.list', { search: STAMP });
		await r('customers.update', { id: customer?.id, last_name: 'King' });
		await r('customers.downloads', { customer_id: customer?.id });
		const coupon = await r('coupons.create', {
			code: `live${STAMP}`,
			discount_type: 'percent',
			amount: '10',
		});
		await r('coupons.get', { id: coupon?.id });
		await r('coupons.list', { search: STAMP });
		await r('coupons.update', { id: coupon?.id, amount: '15' });
		const taxClass = await r('taxes.classes.create', { name: `Live ${STAMP}` });
		await r('taxes.classes.list');
		await r('taxes.classes.get', { slug: taxClass?.slug });
		// `class` is an enum of the store's classes when the index was read, so
		// the live run uses a built-in class.
		const tax = await r('taxes.create', {
			country: 'GB',
			rate: '20.0000',
			name: 'VAT',
			class: 'reduced-rate',
		});
		await r('taxes.get', { id: tax?.id });
		await r('taxes.list', { class: 'reduced-rate' });
		await r('taxes.update', { id: tax?.id, rate: '19.0000' });

		// Orders, notes, refunds, emails, receipts.
		const order = await r('orders.create', {
			customer_id: customer?.id,
			payment_method: 'bacs',
			set_paid: true,
			billing: {
				first_name: 'Ada',
				last_name: 'King',
				email: `ada-${STAMP}@example.com`,
			},
			line_items: [{ product_id: simple?.id, quantity: 2 }],
			coupon_lines: coupon ? [{ code: coupon.code }] : undefined,
		});
		await r('orders.get', { id: order?.id });
		await r('orders.list', { search: STAMP, per_page: 5 });
		await r('orders.update', { id: order?.id, status: 'completed' });
		await r('orders.statuses');
		const note = await r('orders.notes.create', {
			order_id: order?.id,
			note: 'Packed.',
		});
		await r('orders.notes.get', { order_id: order?.id, id: note?.id });
		await r('orders.notes.list', { order_id: order?.id });
		const item = order?.line_items?.[0];
		await r(
			'orders.refunds.preview',
			{
				order_id: order?.id,
				line_items: [{ line_item_id: item?.id, quantity: 1 }],
			},
			/woocommerce_rest|rest_|400|404/,
		);
		const refund = await r('orders.refunds.create', {
			order_id: order?.id,
			amount: '5.00',
			reason: 'Live run',
			api_refund: false,
		});
		await r('orders.refunds.get', { order_id: order?.id, id: refund?.id });
		await r('orders.refunds.list', { order_id: order?.id });
		await r('refunds.list', { per_page: 5 });
		await r('orders.emailTemplates', { id: order?.id });
		await r(
			'orders.sendOrderDetails',
			{ id: order?.id },
			/woocommerce_rest|rest_|500/,
		);
		await r(
			'orders.sendEmail',
			{ id: order?.id, template_id: 'customer_invoice' },
			/woocommerce_rest|rest_|500/,
		);
		await r(
			'orders.receipt.create',
			{ id: order?.id },
			/woocommerce_rest|rest_|404|500/,
		);
		await r(
			'orders.receipt.get',
			{ id: order?.id },
			/woocommerce_rest|rest_|404/,
		);
		await r('orders.batch', {
			update: [{ id: order?.id, customer_note: 'Batch note' }],
		});

		// Reports.
		await r('reports.list');
		await r('reports.sales', { period: 'month' });
		await r('reports.topSellers', { period: 'month' });
		await r('reports.couponTotals');
		await r('reports.customerTotals');
		await r('reports.orderTotals');
		await r('reports.productTotals');
		await r('reports.reviewTotals');

		// Shipping zones.
		const zone = await r('shipping.zones.create', {
			name: `Live zone ${STAMP}`,
		});
		await r('shipping.zones.get', { id: zone?.id });
		await r('shipping.zones.list');
		await r('shipping.zones.update', { id: zone?.id, order: 1 });
		await r(
			'shipping.zones.locations.replace',
			{ id: zone?.id, body: [{ code: 'GB', type: 'country' }] },
			/rest_|400/,
		);
		await r('shipping.zones.locations.list', { id: zone?.id });
		const method = await r('shipping.zones.methods.create', {
			zone_id: zone?.id,
			method_id: 'flat_rate',
		});
		await r('shipping.zones.methods.get', {
			zone_id: zone?.id,
			instance_id: method?.instance_id,
		});
		await r('shipping.zones.methods.list', { zone_id: zone?.id });
		await r('shipping.zones.methods.update', {
			zone_id: zone?.id,
			instance_id: method?.instance_id,
			settings: { cost: '5.00' },
		});

		// Batches over the other resources.
		await r('products.batch', { update: [{ id: simple?.id, featured: true }] });
		await r('products.categories.batch', {
			update: [{ id: cat?.id, description: 'Batch' }],
		});
		await r('products.tags.batch', {
			update: [{ id: tag?.id, description: 'Batch' }],
		});
		await r('products.brands.batch', {
			update: [{ id: brand?.id, description: 'Batch' }],
		});
		await r('products.shippingClasses.batch', {
			update: [{ id: sclass?.id, description: 'Batch' }],
		});
		await r('products.attributes.batch', {
			update: [{ id: attr?.id, has_archives: false }],
		});
		await r('customers.batch', {
			update: [{ id: customer?.id, first_name: 'Ada B' }],
		});
		await r('coupons.batch', {
			update: [{ id: coupon?.id, description: 'Batch' }],
		});
		await r('taxes.batch', { update: [{ id: tax?.id, name: 'VAT B' }] });

		// Webhooks CRUD.
		const spare = await r('webhooks.create', {
			name: `spare ${STAMP}`,
			topic: 'coupon.updated',
			status: 'paused',
			delivery_url: 'https://example.com/hooks/corsair',
		});
		await r('webhooks.get', { id: spare?.id });
		await r('webhooks.list', { search: STAMP });
		await r('webhooks.update', { id: spare?.id, name: `spare ${STAMP} v2` });
		await r('webhooks.batch', {
			update: [{ id: spare?.id, status: 'disabled' }],
		});
		await r('webhooks.delete', { id: spare?.id, force: true });

		// Deletes (cleanup).
		await r('shipping.zones.methods.delete', {
			zone_id: zone?.id,
			instance_id: method?.instance_id,
			force: true,
		});
		await r('shipping.zones.delete', { id: zone?.id, force: true });
		await r('orders.refunds.delete', {
			order_id: order?.id,
			id: refund?.id,
			force: true,
		});
		await r('orders.notes.delete', {
			order_id: order?.id,
			id: note?.id,
			force: true,
		});
		await r('orders.delete', { id: order?.id, force: true });
		await r('products.reviews.delete', { id: review?.id, force: true });
		await r('products.variations.delete', {
			product_id: variable?.id,
			id: variation?.id,
			force: true,
		});
		await r('products.delete', { id: simple?.id, force: true });
		for (const id of [variable?.id, copy?.id]) {
			if (id)
				await fn(
					api,
					'products.delete',
				)({ id, force: true }).catch(() => undefined);
		}
		await r('products.attributes.terms.delete', {
			attribute_id: attr?.id,
			id: term?.id,
			force: true,
		});
		await r('products.attributes.delete', { id: attr?.id, force: true });
		await r('products.categories.delete', { id: cat?.id, force: true });
		await r('products.tags.delete', { id: tag?.id, force: true });
		await r('products.brands.delete', { id: brand?.id, force: true });
		await r('products.shippingClasses.delete', { id: sclass?.id, force: true });
		await r('coupons.delete', { id: coupon?.id, force: true });
		await r('customers.delete', { id: customer?.id, force: true });
		await r('taxes.delete', { id: tax?.id, force: true });
		await r('taxes.classes.delete', {
			slug: taxClass?.slug ?? `x${MISSING}`,
			force: true,
		});
		for (const id of hookIds)
			await fn(
				api,
				'webhooks.delete',
			)({ id, force: true }).catch(() => undefined);

		// Every delivery through processWebhook; a wrong secret must be refused.
		const seen: Record<string, number> = {};
		if (hookUrl && hookDir) {
			const deliveries: Delivery[] = readdirSync(hookDir)
				.filter(
					(name) =>
						name.endsWith('.json') && Number(name.split('-')[0]) >= startedAt,
				)
				.sort()
				.map((name) => JSON.parse(readFileSync(join(hookDir, name), 'utf8')));
			const forged = createCorsair({
				plugins: [
					woocommerce({
						key: 'x',
						siteUrl,
						consumerKey,
						webhookSecret: 'wrong',
					}),
				],
				database: testDb.db,
				kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
			});
			for (const delivery of deliveries) {
				const topic = delivery.headers['x-wc-webhook-topic'] ?? 'ping';
				if (topic === 'ping') {
					// The creation ping: a `webhook_id=<id>` form body, not an event.
					seen.ping = (seen.ping ?? 0) + 1;
					continue;
				}
				const result = await processWebhook(
					corsair,
					delivery.headers,
					delivery.body,
				);
				const key = `webhook:${result.action ?? topic}`;
				if (result.plugin !== 'woocommerce' || !result.response?.success) {
					results[key] = {
						ok: false,
						error: `${topic}: ${result.response?.error ?? 'not matched'}`,
					};
					continue;
				}
				seen[topic] = (seen[topic] ?? 0) + 1;
				if (!results[key]) results[key] = { ok: true };
				const refused = await processWebhook(
					forged,
					delivery.headers,
					delivery.body,
				);
				if (refused.response?.statusCode !== 401) {
					results[`${key}:forged`] = {
						ok: false,
						error: 'a wrong secret was accepted',
					};
				}
			}
			console.log(
				`WooCommerce webhook deliveries: ${deliveries.length} ${JSON.stringify(seen)}`,
			);
			// With a listener configured, every webhook must have seen a delivery.
			const routed = Object.keys(results).filter((k) =>
				k.startsWith('webhook:'),
			);
			expect(routed).toEqual(
				expect.arrayContaining([
					'webhook:action',
					'webhook:coupon',
					'webhook:customer',
					'webhook:order',
					'webhook:product',
				]),
			);
		}
		await testDb.cleanup?.();

		const missing = woocommerceOperations
			.map((o) => o.id)
			.filter((id) => !(id in results));
		const failed = Object.entries(results).filter(([, v]) => !v.ok);
		const report = {
			site: siteUrl,
			operations: woocommerceOperations.length,
			ran: Object.keys(results).filter((k) => !k.startsWith('webhook:')).length,
			ok: Object.values(results).filter((v) => v.ok && !v.expected).length,
			expected: Object.values(results).filter((v) => v.expected).length,
			failed: failed.length,
			deliveries: seen,
			missing,
			results,
		};
		if (process.env.WOOCOMMERCE_LIVE_REPORT) {
			writeFileSync(
				process.env.WOOCOMMERCE_LIVE_REPORT,
				JSON.stringify(report, null, 2),
			);
		}
		console.log(
			`WooCommerce live: ${report.ok} ok, ${report.expected} expected errors, ${report.failed} failed, ${missing.length} not run`,
		);
		expect(failed.map(([id, v]) => `${id}: ${v.error}`)).toEqual([]);
	});
});
