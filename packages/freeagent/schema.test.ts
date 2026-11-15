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
				invoice: { status: 'Open' },
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
	});
});
