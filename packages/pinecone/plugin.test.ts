import { AuthMissingError } from 'corsair/core';
import type { PineconeKeyBuilderContext } from './index';
import { pinecone, pineconeAuthConfig, pineconeEndpointSchemas } from './index';

function flatten(endpoints: Record<string, unknown>): string[] {
	return Object.entries(endpoints)
		.flatMap(([group, members]) =>
			Object.keys(members as Record<string, unknown>).map(
				(name) => `${group}.${name}`,
			),
		)
		.sort();
}

describe('Pinecone plugin', () => {
	const plugin = pinecone();

	it('registers a schema and description for every endpoint', () => {
		const operations = flatten(plugin.endpoints as Record<string, unknown>);
		expect(operations).toHaveLength(48);
		expect(Object.keys(pineconeEndpointSchemas).sort()).toEqual(operations);

		for (const operation of operations) {
			const meta = (
				plugin.endpointMeta as Record<string, { description: string }>
			)[operation];
			expect(meta?.description.length).toBeGreaterThan(20);
			expect(meta?.description).not.toMatch(/example resource|TODO/i);
		}
	});

	it('offers only the API-key auth used by the implemented surfaces', () => {
		expect(Object.keys(pineconeAuthConfig)).toEqual(['api_key']);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
	});

	it('fails closed when an API key is unavailable', async () => {
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('Expected keyBuilder');
		const context = {
			keys: { get_api_key: async () => undefined },
		} as unknown as PineconeKeyBuilderContext;

		await expect(keyBuilder(context, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		await expect(keyBuilder(context, 'webhook')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
