import {
	woocommerceEndpointMeta,
	woocommerceEndpointSchemas,
} from './endpoints/catalog';
import {
	WoocommerceManifestSchema,
	woocommerceDefinitions,
	woocommerceManifest,
	woocommerceOperations,
	woocommerceWebhookDefinitions,
} from './endpoints/manifest';
import {
	getWoocommerceInputSchema,
	getWoocommerceOutputSchema,
	getWoocommerceWebhookPayloadSchema,
	woocommerceInputFields,
} from './endpoints/openapi-schema';
import { WOOCOMMERCE_OPERATION_IDS } from './endpoints/operation-types';

const ids = woocommerceOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = woocommerceOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

describe('woocommerce-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			WoocommerceManifestSchema.safeParse(woocommerceManifest).error?.issues ??
				[],
		).toEqual([]);
	});

	it('has 155 operations, one per id and route', () => {
		expect(ids).toHaveLength(155);
		expect(new Set(ids).size).toBe(155);
		expect([...WOOCOMMERCE_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			woocommerceOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(155);
		expect(woocommerceManifest.version).toBe('11.3.1');
		expect(
			woocommerceOperations.every((o) => o.path.startsWith('/wc/v3/')),
		).toBe(true);
	});

	it('covers the documented REST v3 groups', () => {
		for (const id of [
			'products.list',
			'products.create',
			'products.variations.create',
			'products.attributes.terms.list',
			'products.categories.list',
			'products.reviews.list',
			'products.shippingClasses.list',
			'products.batch',
			'orders.list',
			'orders.create',
			'orders.notes.create',
			'orders.refunds.create',
			'customers.create',
			'coupons.create',
			'reports.sales',
			'reports.topSellers',
			'settings.update',
			'shipping.zones.methods.create',
			'taxes.classes.list',
			'paymentGateways.list',
			'webhooks.create',
			'systemStatus.get',
			'data.countries.list',
		]) {
			expect(ids).toContain(id);
		}
		// The marketplace and PayPal callback routes stay out.
		expect(ids.some((id) => id.startsWith('marketplace.'))).toBe(false);
		expect(ids.some((id) => id.startsWith('paypal'))).toBe(false);
		expect(operation('orders.refunds.create').path).toBe(
			'/wc/v3/orders/{order_id}/refunds',
		);
	});

	it('references only definitions it has', () => {
		const text = JSON.stringify([
			...woocommerceOperations,
			...woocommerceWebhookDefinitions,
		]);
		for (const [, name] of text.matchAll(/"\$ref":"([^"]+)"/g)) {
			expect(woocommerceDefinitions[name as string]).toBeDefined();
		}
	});
});

describe('schemas', () => {
	it('builds every input, output and webhook schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getWoocommerceInputSchema(id);
				getWoocommerceOutputSchema(id);
			} catch {
				failed.push(id);
			}
		}
		for (const webhook of woocommerceWebhookDefinitions) {
			getWoocommerceWebhookPayloadSchema(webhook.id);
		}
		expect(failed).toEqual([]);
		expect(Object.keys(woocommerceEndpointMeta).sort()).toEqual(
			[...ids].sort(),
		);
		expect(Object.keys(woocommerceEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('checks inputs and keeps responses lenient', () => {
		const list = getWoocommerceInputSchema('orders.list');
		expect(list.safeParse({ status: ['processing'] }).success).toBe(true);
		expect(list.safeParse({ per_page: 101 }).success).toBe(false);
		expect(getWoocommerceInputSchema('orders.get').safeParse({}).success).toBe(
			false,
		);
		const out = getWoocommerceOutputSchema('orders.get');
		const parsed = out.safeParse({
			id: 1,
			status: 'a-custom-status',
			meta_data: [],
			billing: [],
			extension_field: 1,
		});
		expect(parsed.success).toBe(true);
		// PHP's empty map `[]` reads as an empty object.
		expect(parsed.data).toMatchObject({ billing: {}, extension_field: 1 });
		// Scalars may come as string or number (WooCommerce mixes them), but
		// never as an object or list.
		expect(out.safeParse({ id: '1', total: 12.5 }).success).toBe(true);
		expect(out.safeParse({ id: { nested: 1 } }).success).toBe(false);
		expect(out.safeParse({ total: ['1'] }).success).toBe(false);
	});

	it('wraps batches and paged lists', () => {
		expect(
			getWoocommerceOutputSchema('products.batch').safeParse({
				create: [{ id: 1 }],
				delete: [{ id: 2 }],
			}).success,
		).toBe(true);
		expect(
			getWoocommerceOutputSchema('products.list').safeParse({
				items: [],
				next_page: null,
			}).success,
		).toBe(true);
		expect(
			getWoocommerceOutputSchema('settings.list').safeParse([{ id: 'x' }])
				.success,
		).toBe(true);
	});

	it('routes fields to path, query and body', () => {
		const where = (id: string) =>
			Object.fromEntries(woocommerceInputFields(id).map((f) => [f.name, f.in]));
		expect(where('orders.refunds.create')).toMatchObject({
			order_id: 'path',
			amount: 'body',
		});
		expect(where('orders.list')).toMatchObject({ status: 'query' });
	});
});

describe('risk levels', () => {
	it('marks deletes, refunds, emails, batches and tools destructive', () => {
		const risk = (id: string) =>
			woocommerceEndpointMeta[id as keyof typeof woocommerceEndpointMeta]
				.riskLevel;
		for (const id of ids.filter((i) => operation(i).method === 'DELETE')) {
			expect(risk(id)).toBe('destructive');
		}
		for (const id of [
			'orders.refunds.create',
			'orders.sendEmail',
			'orders.sendOrderDetails',
			'products.batch',
			'settings.batch',
			'systemStatus.tools.run',
			'paymentGateways.update',
		]) {
			expect(risk(id)).toBe('destructive');
		}
		expect(risk('orders.create')).toBe('write');
		expect(risk('orders.refunds.preview')).toBe('read');
		expect(risk('reports.sales')).toBe('read');
	});
});
