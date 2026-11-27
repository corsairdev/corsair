import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { paypalOperations } from './endpoints/manifest';
import { paypal } from './index';

/**
 * Live run against PayPal's sandbox: a sandbox app from developer.paypal.com
 * → Apps & Credentials (Sandbox tab).
 *
 *   PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... npx jest api.test.ts
 *
 * Skipped unless both are set (CI never runs files named api.test.ts). The
 * environment is forced to sandbox: no real money moves. The run creates an
 * order, a catalog product, a billing plan, a draft invoice and a webhook,
 * reads them back and cleans up what PayPal lets it delete, and reads
 * transactions, balances and the webhook event types. PAYPAL_LIVE_REPORT=<file>
 * writes every operation's result.
 */
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const ready = Boolean(clientId && clientSecret);
const describeIfLive = ready ? describe : describe.skip;
if (!ready) {
	console.warn(
		'Skipping PayPal live run: set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET (a sandbox app).',
	);
}

const STAMP = Date.now().toString(36);
type Result = { ok: boolean; expected?: string; error?: string };
// `any` because the live run walks responses of many operations by field name.
type Json = any;

describeIfLive('paypal sandbox live', () => {
	jest.setTimeout(300_000);
	const results: Record<string, Result> = {};

	it('runs the sandbox-safe operations', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'paypal', 'default');
		const corsair = createCorsair({
			plugins: [
				paypal({ key: clientSecret, clientId, environment: 'sandbox' }),
			],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		const api: Json = corsair.paypal.api;
		const r = async (id: string, input: object = {}, expected?: RegExp) => {
			let node = api;
			for (const part of id.split('.')) node = node?.[part];
			try {
				const out = await node(input);
				if (results[id]?.ok !== false) results[id] = { ok: true };
				return out;
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				results[id] = expected?.test(message)
					? { ok: true, expected: message.slice(0, 160) }
					: { ok: false, error: message.slice(0, 300) };
				return undefined;
			}
		};

		const order = await r('orders.create', {
			intent: 'CAPTURE',
			purchase_units: [
				{
					reference_id: `live-${STAMP}`,
					amount: { currency_code: 'USD', value: '7.47' },
				},
			],
			paypal_request_id: `order-${STAMP}`,
		});
		await r('orders.get', { id: order?.id });
		await r('orders.update', {
			id: order?.id,
			patch: [
				{
					op: 'add',
					path: `/purchase_units/@reference_id=='live-${STAMP}'/description`,
					value: 'Live run',
				},
			],
		});
		// Capturing needs the buyer's approval in a browser; PayPal refuses it here.
		await r('orders.capture', { id: order?.id }, /ORDER_NOT_APPROVED|422/);

		const product = await r('products.create', {
			name: `Corsair live ${STAMP}`,
			type: 'SERVICE',
			category: 'SOFTWARE',
		});
		await r('products.get', { product_id: product?.id });
		await r('products.list', { page_size: 5 });
		await r('products.update', {
			product_id: product?.id,
			patch: [
				{ op: 'replace', path: '/description', value: 'Live run product' },
			],
		});
		const plan = await r('plans.create', {
			product_id: product?.id,
			name: `Live plan ${STAMP}`,
			billing_cycles: [
				{
					frequency: { interval_unit: 'MONTH', interval_count: 1 },
					tenure_type: 'REGULAR',
					sequence: 1,
					total_cycles: 12,
					pricing_scheme: {
						fixed_price: { value: '9.00', currency_code: 'USD' },
					},
				},
			],
			payment_preferences: { auto_bill_outstanding: true },
		});
		await r('plans.get', { id: plan?.id });
		await r('plans.list', { product_id: product?.id });
		await r('plans.deactivate', { id: plan?.id });
		await r('plans.activate', { id: plan?.id });

		const invoice = await r('invoices.create', {
			detail: { currency_code: 'USD', invoice_number: `LIVE-${STAMP}` },
			items: [
				{
					name: 'Consulting',
					quantity: '1',
					unit_amount: { currency_code: 'USD', value: '10.00' },
				},
			],
		});
		const invoiceId = invoice?.id ?? invoice?.href?.split('/').pop();
		await r('invoices.get', { invoice_id: invoiceId });
		await r('invoices.list', { page_size: 5 });
		await r('invoices.search', { invoice_number: `LIVE-${STAMP}` });
		await r('invoices.nextNumber');
		await r(
			'invoices.generateQrCode',
			{ invoice_id: invoiceId },
			/422|INVALID|not/i,
		);
		await r('invoices.delete', { invoice_id: invoiceId });
		await r('invoices.templates.list');

		const hook = await r('webhooks.create', {
			url: `https://example.com/corsair/paypal/${STAMP}`,
			event_types: [{ name: 'PAYMENT.CAPTURE.COMPLETED' }],
		});
		await r('webhooks.get', { webhook_id: hook?.id });
		await r('webhooks.list');
		await r('webhooks.eventTypes', { webhook_id: hook?.id });
		await r('webhooks.availableEventTypes');
		await r('webhooks.events.list', { page_size: 5 });
		await r('webhooks.simulateEvent', {
			webhook_id: hook?.id,
			event_type: 'PAYMENT.CAPTURE.COMPLETED',
		});
		await r('webhooks.delete', { webhook_id: hook?.id });

		const end = new Date();
		const start = new Date(end.getTime() - 25 * 86_400_000);
		const iso = (d: Date) => `${d.toISOString().slice(0, 19)}Z`;
		await r('transactions.list', {
			start_date: iso(start),
			end_date: iso(end),
			fields: 'all',
		});
		await r('balances.get');
		await r('disputes.list', { page_size: 5 });
		await r('webProfiles.list', {}, /404|NOT_FOUND/);
		await testDb.cleanup?.();

		const failed = Object.entries(results).filter(([, v]) => !v.ok);
		const report = {
			operations: paypalOperations.length,
			ran: Object.keys(results).length,
			ok: Object.values(results).filter((v) => v.ok && !v.expected).length,
			expected: Object.values(results).filter((v) => v.expected).length,
			failed: failed.length,
			results,
		};
		if (process.env.PAYPAL_LIVE_REPORT) {
			writeFileSync(
				process.env.PAYPAL_LIVE_REPORT,
				JSON.stringify(report, null, 2),
			);
		}
		console.log(
			`PayPal sandbox: ${report.ok} ok, ${report.expected} expected errors, ${report.failed} failed of ${report.ran} run`,
		);
		expect(failed.map(([id, v]) => `${id}: ${v.error}`)).toEqual([]);
	});
});
