import {
	ZohoInvoiceEndpointInputSchemas,
	ZohoInvoiceEndpointOutputSchemas,
} from './endpoints/types';
import { zohoinvoice } from './index';
import { verifyZohoInvoiceWebhookSignature } from './webhooks/types';

describe('Zoho Invoice endpoint contracts', () => {
	it('rejects incomplete create inputs', () => {
		expect(
			ZohoInvoiceEndpointInputSchemas.customersCreate.safeParse({
				organizationId: 'org-1',
				body: {},
			}).success,
		).toBe(false);
		expect(
			ZohoInvoiceEndpointInputSchemas.invoicesCreate.safeParse({
				organizationId: 'org-1',
				body: { customer_id: 'customer-1', date: '2026-01-01' },
			}).success,
		).toBe(false);
	});

	it('accepts pagination and validates the documented maximum page size', () => {
		expect(
			ZohoInvoiceEndpointInputSchemas.itemsList.safeParse({
				organizationId: 'org-1',
				page: 2,
				perPage: 200,
			}).success,
		).toBe(true);
		expect(
			ZohoInvoiceEndpointInputSchemas.itemsList.safeParse({
				organizationId: 'org-1',
				perPage: 201,
			}).success,
		).toBe(false);
	});

	it('registers the supported resource operations', () => {
		const plugin = zohoinvoice();
		const endpoints = plugin.endpoints;
		const webhooks = plugin.webhooks;
		expect(endpoints).toBeDefined();
		expect(webhooks).toBeDefined();
		if (!endpoints || !webhooks) return;
		expect(endpoints.customers.list).toBeDefined();
		expect(endpoints.invoices.create).toBeDefined();
		expect(endpoints.items.update).toBeDefined();
		expect(endpoints.payments.get).toBeDefined();
		expect(endpoints.estimates.list).toBeDefined();
		expect(Object.keys(webhooks)).toHaveLength(0);
		expect(ZohoInvoiceEndpointOutputSchemas.invoicesGet).toBeDefined();
	});

	it('does not claim unsupported webhook signature verification', () => {
		const result = verifyZohoInvoiceWebhookSignature(
			{ body: {}, headers: {} } as never,
			'test-secret',
		);
		expect(result.valid).toBe(false);
	});
});
