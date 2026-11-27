import { paypalEndpointMeta, paypalEndpointSchemas } from './endpoints/catalog';
import {
	PaypalManifestSchema,
	paypalDefinitions,
	paypalManifest,
	paypalOperations,
	paypalWebhookDefinitions,
} from './endpoints/manifest';
import {
	getPaypalInputSchema,
	getPaypalOutputSchema,
	getPaypalWebhookPayloadSchema,
	paypalInputFields,
} from './endpoints/openapi-schema';
import { PAYPAL_OPERATION_IDS } from './endpoints/operation-types';

const ids = paypalOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = paypalOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

describe('paypal-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			PaypalManifestSchema.safeParse(paypalManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 114 operations from the 13 specs, one per id and route', () => {
		expect(ids).toHaveLength(114);
		expect(new Set(ids).size).toBe(114);
		expect([...PAYPAL_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			paypalOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(114);
		expect(new Set(paypalOperations.map((o) => o.tag)).size).toBe(13);
	});

	it('covers every PayPal REST product', () => {
		for (const id of [
			'orders.create',
			'orders.capture',
			'payments.captures.refund',
			'payments.authorizations.void',
			'invoices.send',
			'invoices.templates.list',
			'subscriptions.create',
			'plans.create',
			'products.list',
			'disputes.provideEvidence',
			'payouts.create',
			'webhooks.create',
			'webhooks.verifySignature',
			'vault.paymentTokens.create',
			'transactions.list',
			'balances.get',
			'trackers.createBatch',
			'partnerReferrals.create',
			'webProfiles.list',
		]) {
			expect(ids).toContain(id);
		}
		expect(operation('payments.captures.refund').path).toBe(
			'/v2/payments/captures/{capture_id}/refund',
		);
	});

	it('references only definitions it has', () => {
		const text = JSON.stringify(paypalOperations);
		for (const [, name] of text.matchAll(/"\$ref":"([^"]+)"/g)) {
			expect(paypalDefinitions[name as string]).toBeDefined();
		}
	});
});

describe('schemas', () => {
	it('builds every input, output and webhook schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getPaypalInputSchema(id);
				getPaypalOutputSchema(id);
			} catch {
				failed.push(id);
			}
		}
		for (const webhook of paypalWebhookDefinitions) {
			getPaypalWebhookPayloadSchema(webhook.id);
		}
		expect(failed).toEqual([]);
		expect(Object.keys(paypalEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(paypalEndpointSchemas).sort()).toEqual([...ids].sort());
	});

	it('checks inputs and keeps responses lenient', () => {
		const create = getPaypalInputSchema('orders.create');
		expect(create.safeParse({}).success).toBe(false);
		expect(
			create.safeParse({
				intent: 'CAPTURE',
				purchase_units: [{ amount: { currency_code: 'USD', value: '1.00' } }],
			}).success,
		).toBe(true);
		expect(
			create.safeParse({ intent: 'SELL', purchase_units: [] }).success,
		).toBe(false);
		const out = getPaypalOutputSchema('orders.get');
		expect(
			out.safeParse({ id: 'X', status: 'SOMETHING_NEW', extra: 1 }).success,
		).toBe(true);
		expect(out.safeParse({ purchase_units: 'one' }).success).toBe(false);
		expect(
			getPaypalOutputSchema('orders.update').safeParse({ success: true })
				.success,
		).toBe(true);
	});

	it('routes headers, path, query and body', () => {
		const where = (id: string) =>
			Object.fromEntries(
				paypalInputFields(id).map((f) => [f.name, `${f.in}:${f.wire}`]),
			);
		expect(where('orders.create')).toMatchObject({
			paypal_request_id: 'header:PayPal-Request-Id',
			prefer: 'header:Prefer',
			intent: 'body:intent',
		});
		expect(where('payments.captures.refund')).toMatchObject({
			capture_id: 'path:capture_id',
		});
		expect(operation('orders.update').request).toBe('json-array');
		expect(operation('disputes.provideEvidence').request).toBe('multipart');
	});
});

describe('risk levels', () => {
	it('marks every money move, email and dispute action destructive', () => {
		const risk = (id: string) =>
			paypalEndpointMeta[id as keyof typeof paypalEndpointMeta].riskLevel;
		for (const id of ids.filter((i) => operation(i).method === 'DELETE')) {
			expect(risk(id)).toBe('destructive');
		}
		for (const id of [
			'orders.capture',
			'orders.authorize',
			'payments.captures.refund',
			'payments.authorizations.capture',
			'payouts.create',
			'invoices.send',
			'subscriptions.cancel',
			'disputes.acceptClaim',
		]) {
			expect(risk(id)).toBe('destructive');
		}
		expect(risk('orders.create')).toBe('write');
		expect(risk('invoices.search')).toBe('read');
		expect(risk('transactions.list')).toBe('read');
	});
});
