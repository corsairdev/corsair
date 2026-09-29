import {
	AirtableEndpointInputSchemas,
	AirtableEndpointOutputSchemas,
} from './endpoints/types';
import { airtable } from './index';

function flattenEndpointPaths(
	// Endpoint trees are nested records of functions, so values stay unknown here
	tree: Record<string, unknown>,
	prefix = '',
): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		return typeof value === 'function'
			? [path]
			: flattenEndpointPaths(value as Record<string, unknown>, path);
	});
}

describe('Airtable plugin registration', () => {
	const plugin = airtable({});
	const endpointPaths = flattenEndpointPaths(
		plugin.endpoints as Record<string, unknown>,
	).sort();

	it('registers webhooks.getPayloads as a runtime endpoint', () => {
		expect(endpointPaths).toContain('webhooks.getPayloads');
	});

	it('declares a schema entry for every runtime endpoint', () => {
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			endpointPaths,
		);
	});

	it('declares a metadata entry for every runtime endpoint', () => {
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			endpointPaths,
		);
	});

	it('resolves webhooks.getPayloads schemas by the runtime path', () => {
		const schemas = plugin.endpointSchemas?.['webhooks.getPayloads'];
		expect(schemas?.input).toBe(
			AirtableEndpointInputSchemas.webhooksGetPayloads,
		);
		expect(schemas?.output).toBe(
			AirtableEndpointOutputSchemas.webhooksGetPayloads,
		);
	});

	it('keys the schema maps with the plural webhooks prefix', () => {
		expect(AirtableEndpointInputSchemas).toHaveProperty('webhooksGetPayloads');
		expect(AirtableEndpointOutputSchemas).toHaveProperty('webhooksGetPayloads');
		expect(AirtableEndpointInputSchemas).not.toHaveProperty(
			'webhookGetPayloads',
		);
		expect(AirtableEndpointOutputSchemas).not.toHaveProperty(
			'webhookGetPayloads',
		);
	});
});
