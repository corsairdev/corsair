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
	});
});
