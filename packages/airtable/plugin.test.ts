import { airtable } from './index';

const operations = [
	'bases.getMany',
	'bases.getSchema',
	'records.create',
	'records.createOrUpdate',
	'records.delete',
	'records.get',
	'records.search',
	'records.update',
	'webhooks.getPayloads',
];

describe('airtable plugin definition', () => {
	const plugin = airtable();

	it('registers every endpoint at its runtime path', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...operations].sort());
	});

	it('exposes input and output schemas for every endpoint path', () => {
		const schemas = plugin.endpointSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual([...operations].sort());
		for (const operation of operations) {
			const schema = schemas[operation as keyof typeof schemas];
			expect(schema?.input).toBeDefined();
			expect(schema?.output).toBeDefined();
		}
	});

	it('declares meta with a risk level for every endpoint path', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...operations].sort());
		for (const operation of operations) {
			const entry = meta[operation as keyof typeof meta];
			expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			expect((entry?.description ?? '').length).toBeGreaterThan(10);
		}
	});

	it('webhooks.getPayloads schema validates the real input shape', () => {
		const schemas = plugin.endpointSchemas ?? {};
		const schema = schemas['webhooks.getPayloads' as keyof typeof schemas];
		expect(
			schema?.input?.parse({ baseId: 'appExample', webhookId: 'achExample' }),
		).toEqual({
			baseId: 'appExample',
			webhookId: 'achExample',
		});
	});
});
