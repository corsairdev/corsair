import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './endpoints/types';
import { freeagent } from './index';
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

	it('documents invoice item request and response shapes separately', () => {
		const apiDocs = readFileSync(
			join(__dirname, '../../docs/plugins/freeagent/api.mdx'),
			'utf8',
		);
		for (const operation of [
			'invoices.create',
			'invoices.duplicate',
			'invoices.get',
			'invoices.list',
		]) {
			const snippetStart = apiDocs.indexOf(
				`await corsair.freeagent.api.${operation}(`,
			);
			const inputStart = apiDocs.indexOf('**Input**', snippetStart);
			const outputStart = apiDocs.indexOf('**Output**', inputStart);
			const operationEnd = apiDocs.indexOf('\n---', outputStart);
			const inputDocs = apiDocs.slice(inputStart, outputStart);
			const outputDocs = apiDocs.slice(outputStart, operationEnd);

			expect(snippetStart).toBeGreaterThanOrEqual(0);
			expect(inputStart).toBeGreaterThan(snippetStart);
			expect(outputStart).toBeGreaterThan(inputStart);
			expect(operationEnd).toBeGreaterThan(outputStart);
			expect(outputDocs).toContain('url?: string');
			expect(outputDocs).toContain('description?: string');
			expect(outputDocs).toContain('price?: string | number');
			expect(outputDocs).toContain('quantity?: string | number');
			expect(outputDocs).toContain('sales_tax_rate?: string | number');
			if (operation === 'invoices.create') {
				expect(inputDocs).toContain('description: string');
				expect(inputDocs).toContain('price?: number');
				expect(inputDocs).not.toContain('price?: string | number');
			}
		}
	});
});

describe('FreeAgent shapes seen on the live sandbox API (11-16)', () => {
	it('reads project decimals as strings and a nested contact object', () => {
		const project = {
			url: 'https://api.sandbox.freeagent.com/v2/projects/1',
			name: 'corsair-plugin-test project',
			currency: 'GBP',
			budget: 10,
			status: 'Active',
			budget_units: 'Hours',
			normal_billing_rate: '50.0',
			hours_per_day: '8.0',
			uses_project_invoice_sequence: false,
			billing_period: 'hour',
			include_unbilled_time_in_profitability: true,
			contact: { url: 'https://api.sandbox.freeagent.com/v2/contacts/1' },
		};
		expect(() =>
			FreeAgentEndpointOutputSchemas.projectsGet.parse({ project }),
		).not.toThrow();
		expect(() =>
			FreeAgentEndpointOutputSchemas.projectsList.parse({
				projects: [project],
				pagination: { link: null, total_count: '1' },
			}),
		).not.toThrow();
	});

	it('reads an empty default additional text', () => {
		expect(
			FreeAgentEndpointOutputSchemas.invoicesDefaultAdditionalTextGet.parse({}),
		).toEqual({});
	});

	it('accepts invoice line ids on update, and _destroy to remove a line', () => {
		// `unknown[]`: the cases include shapes the schema must reject.
		const parse = (items: unknown[]) =>
			FreeAgentEndpointInputSchemas.invoicesUpdate.safeParse({
				id: '7',
				invoice: { invoice_items: items },
			}).success;
		expect(parse([{ id: '12', description: 'Revised', price: 60 }])).toBe(true);
		expect(parse([{ id: 12, _destroy: 1 }])).toBe(true);
		expect(parse([{ description: 'New line', price: 5 }])).toBe(true);
		expect(parse([{ id: 12, _destroy: 1, price: 5 }])).toBe(false);
		expect(
			FreeAgentEndpointInputSchemas.invoicesCreate.safeParse({
				invoice: {
					contact: 'https://api.freeagent.com/v2/contacts/1',
					dated_on: '2026-11-16',
					payment_terms_in_days: 30,
					invoice_items: [{ id: '12', description: 'x' }],
				},
			}).success,
		).toBe(false);
	});
});

describe('FreeAgent OAuth', () => {
	it('declares the OAuth app URLs, production by default and sandbox on request', () => {
		expect(freeagent().oauthConfig).toMatchObject({
			authUrl: 'https://api.freeagent.com/v2/approve_app',
			tokenUrl: 'https://api.freeagent.com/v2/token_endpoint',
			tokenAuthMethod: 'basic',
		});
		expect(freeagent({ sandbox: true }).oauthConfig).toMatchObject({
			authUrl: 'https://api.sandbox.freeagent.com/v2/approve_app',
			tokenUrl: 'https://api.sandbox.freeagent.com/v2/token_endpoint',
		});
	});

	it('refreshes an expired access token instead of returning it', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					access_token: 'fresh-token',
					refresh_token: 'refresh-token',
					expires_in: 3600,
					token_type: 'bearer',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } },
			),
		);
		const stored: Record<string, string | null> = {
			access: 'expired-token',
			refresh: 'refresh-token',
			expires: '1',
		};
		try {
			const plugin = freeagent();
			const token = await plugin.keyBuilder?.(
				{
					authType: 'oauth_2',
					tenantId: 'tenant-test',
					options: plugin.options,
					keys: {
						get_integration_credentials: async () => ({
							client_id: 'client-id',
							client_secret: 'client-secret',
							redirect_url: null,
						}),
						get_access_token: async () => stored.access ?? null,
						set_access_token: async (value: string | null) => {
							stored.access = value;
						},
						get_refresh_token: async () => stored.refresh ?? null,
						set_refresh_token: async (value: string | null) => {
							stored.refresh = value;
						},
						get_expires_at: async () => stored.expires ?? null,
						set_expires_at: async (value: string | null) => {
							stored.expires = value;
						},
						get_scope: async () => null,
						set_scope: async () => {},
					},
					// `unknown` cast: a minimal key manager stands in for core's full one.
				} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0],
				'endpoint',
			);
			expect(token).toBe('fresh-token');
			expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
				'https://api.freeagent.com/v2/token_endpoint',
			);
		} finally {
			fetchMock.mockRestore();
		}
	});
});
