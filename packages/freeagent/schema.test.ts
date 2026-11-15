import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './endpoints/types';
import { FreeAgentSchema } from './schema';

describe('FreeAgent schemas', () => {
	it('declares a semver schema with no persisted entities', () => {
		expect(FreeAgentSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(FreeAgentSchema.entities).toEqual({});
	});

	it('rejects undocumented top-level request fields on every operation', () => {
		for (const schema of Object.values(FreeAgentEndpointInputSchemas)) {
			expect(schema.safeParse({ unexpected: true }).success).toBe(false);
		}
	});

	it('validates documented response envelopes', () => {
		expect(
			FreeAgentEndpointOutputSchemas.contactsList.safeParse({
				contacts: [],
				pagination: { link: null, total_count: '0' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.contactsList.safeParse({
				contacts: 'not-an-array',
				pagination: { link: null, total_count: null },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointOutputSchemas.contactsList.safeParse({
				contacts: [],
				pagination: { link: null, total_count: 'not-a-count' },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesGet.safeParse({
				invoice: {
					status: 'Open',
					invoice_items: [
						{
							url: 'https://api.freeagent.com/v2/invoice_items/1',
							price: '125.50',
							quantity: '2.0',
							sales_tax_rate: '20.0',
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesGet.safeParse({ invoices: [] })
				.success,
		).toBe(false);
		expect(
			FreeAgentEndpointOutputSchemas.companyBusinessCategories.safeParse({
				business_categories: ['Accounting & Bookkeeping'],
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.companyTaxTimeline.safeParse({
				timeline_items: [
					{
						description: 'VAT Return',
						nature: 'Payment Due',
						dated_on: '2025-03-31',
						amount_due: '100.00',
						is_personal: false,
					},
				],
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesPdf.safeParse({
				pdf: { content: 'JVBERi0xLjQ=' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesConvertToCreditNote.safeParse({
				credit_note: { status: 'Draft', total_value: '-120.00' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesTimeline.safeParse({
				invoice_timeline_items: [
					{
						reference: '001',
						summary: 'Invoice paid',
						description: 'Payment received',
						dated_on: '2025-03-31',
						amount: '10.00',
					},
				],
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.invoicesDirectDebit.safeParse(undefined)
				.success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.contactsDelete.safeParse(undefined)
				.success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.emailAddressesList.safeParse({
				email_addresses: ['Example Sender <sender@example.test>'],
				pagination: { link: null, total_count: '1' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.trackingGroupsGet.safeParse({
				tracking_group: {
					url: 'https://api.freeagent.com/v2/tracking_groups/1',
					name: 'Region',
					status: 'active',
					labels: [],
					created_at: '2026-10-01T09:15:00.000Z',
					updated_at: '2026-10-14T11:42:03.000Z',
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointOutputSchemas.recurringInvoicesList.safeParse({
				recurring_invoices: [
					{
						url: 'https://api.freeagent.com/v2/recurring_invoices/1',
						contact: 'https://api.freeagent.com/v2/contacts/1',
						dated_on: '2026-10-01',
						frequency: 'Monthly',
						next_recurs_on: '2026-11-01',
						recurring_end_date: '',
						recurring_status: 'Active',
					},
				],
				pagination: { link: null, total_count: '1' },
			}).success,
		).toBe(true);
	});

	it('validates documented pagination bounds and dates', () => {
		expect(
			FreeAgentEndpointInputSchemas.contactsList.safeParse({
				query: { per_page: 100, page: 1 },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.contactsList.safeParse({
				query: { per_page: 101 },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.contactsList.safeParse({
				query: { from_date: '2025-02-30' },
			}).success,
		).toBe(false);
	});

	it('requires documented operation identifiers and resource envelopes', () => {
		expect(
			FreeAgentEndpointInputSchemas.contactsGet.safeParse({ id: '' }).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.contactsCreate.safeParse({
				contact: { organisation_name: 'Example Ltd' },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.contactsCreate.safeParse({
				contact: { first_name: 'A' },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.projectsCreate.safeParse({
				project: { name: 'Missing required data' },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					dated_on: '2025-01-15',
				},
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					dated_on: '2025-01-15',
					payment_terms_in_days: 30,
					invoice_items: [
						{ description: 'Consulting services', price: 125.5, quantity: 2 },
					],
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					dated_on: '2025-01-15',
					payment_terms_in_days: 30,
					invoice_items: [
						{
							url: 'https://api.freeagent.com/v2/invoice_items/1',
							description: 'Consulting services',
							price: '125.50',
						},
					],
				},
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: { undocumented: true },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesSendEmail.safeParse({
				id: '1',
				email: {
					attachments: [
						{
							content_type: 'text/plain',
							data: 'dGVzdA==',
							file_name: 'note.txt',
						},
					],
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.invoicesSendEmail.safeParse({
				id: '1',
				email: {
					attachments: [
						{
							content_type: 'text/plain',
							data: 'A'.repeat(7_000_000),
							file_name: 'large.txt',
						},
					],
				},
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.recurringInvoicesList.safeParse({
				query: { view: 'active', page: 2, per_page: 50 },
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.recurringInvoicesList.safeParse({
				query: { view: 'pending' },
			}).success,
		).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.trackingGroupsList.safeParse({
				query: {
					include_hidden: true,
					order_by: 'labels_count',
					reverse: true,
				},
			}).success,
		).toBe(true);
		expect(
			FreeAgentEndpointInputSchemas.trackingGroupsList.safeParse({
				query: { order_by: 'count' },
			}).success,
		).toBe(false);
	});
});
