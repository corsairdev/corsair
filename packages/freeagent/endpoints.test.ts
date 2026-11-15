import { freeAgentEndpointSchemas, freeagent } from './index';

describe('FreeAgent endpoint registry', () => {
	const plugin = freeagent();

	it('keeps endpoint handlers, schemas, and metadata aligned', () => {
		const schemaNames = Object.keys(freeAgentEndpointSchemas).sort();
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			schemaNames,
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(schemaNames);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('oauth_2');
	});

	it('exposes the verified route set with required request shapes', () => {
		const routeInputs = new Map<string, object>(
			Object.entries({
				'company.get': {},
				'company.businessCategories': {},
				'company.taxTimeline': {},
				'contacts.list': {},
				'contacts.get': { id: '1' },
				'contacts.create': { contact: { organisation_name: 'Example Ltd' } },
				'contacts.update': {
					id: '1',
					contact: { organisation_name: 'Example Ltd' },
				},
				'contacts.delete': { id: '1' },
				'projects.list': {},
				'projects.get': { id: '1' },
				'projects.create': {
					project: {
						contact: 'https://api.freeagent.com/v2/contacts/1',
						name: 'Example',
						status: 'Active',
						currency: 'GBP',
						budget_units: 'Hours',
					},
				},
				'projects.update': { id: '1', project: { name: 'Example' } },
				'projects.delete': { id: '1' },
				'invoices.list': {},
				'invoices.get': { id: '1' },
				'invoices.create': {
					invoice: {
						contact: 'https://api.freeagent.com/v2/contacts/1',
						dated_on: '2025-01-15',
						payment_terms_in_days: 30,
					},
				},
				'invoices.update': { id: '1', invoice: { comments: 'Updated' } },
				'invoices.delete': { id: '1' },
				'invoices.markSent': { id: '1' },
				'invoices.sendEmail': { id: '1', email: { use_template: true } },
				'invoices.duplicate': { id: '1' },
				'invoices.markScheduled': { id: '1' },
				'invoices.markDraft': { id: '1' },
				'invoices.markCancelled': { id: '1' },
				'invoices.directDebit': { id: '1' },
				'invoices.timeline': {},
				'invoices.getDefaultAdditionalText': {},
				'invoices.updateDefaultAdditionalText': {
					default_additional_text: 'Pay within 7 days',
				},
				'invoices.deleteDefaultAdditionalText': {},
				'invoices.pdf': { id: '1' },
				'invoices.convertToCreditNote': { id: '1' },
			}),
		);
		for (const [name, schema] of Object.entries(freeAgentEndpointSchemas)) {
			expect(schema.input.safeParse(routeInputs.get(name)).success).toBe(true);
		}
	});

	it('marks financial document actions as destructive', () => {
		expect(plugin.endpointMeta?.['invoices.sendEmail']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['invoices.markSent']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['invoices.create']?.riskLevel).toBe('write');
		expect(plugin.endpointMeta?.['invoices.directDebit']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta?.['invoices.markCancelled']?.riskLevel).toBe(
			'destructive',
		);
		expect(
			plugin.endpointMeta?.['invoices.convertToCreditNote']?.riskLevel,
		).toBe('destructive');
	});

	it('keeps new company and invoice operations registered', () => {
		expect(plugin.endpoints?.company).toHaveProperty('businessCategories');
		expect(plugin.endpoints?.company).toHaveProperty('taxTimeline');
		expect(plugin.endpoints?.invoices).toHaveProperty('duplicate');
		expect(plugin.endpoints?.invoices).toHaveProperty('directDebit');
		expect(plugin.endpoints?.invoices).toHaveProperty('pdf');
		expect(plugin.endpoints?.invoices).toHaveProperty('convertToCreditNote');
	});
});
