import { AuthMissingError } from 'corsair/core';
import type { QdrantKeyBuilderContext } from './index';
import { qdrant, qdrantEndpointSchemas } from './index';

const plugin = qdrant();
const keyContext = (key?: string) =>
	({
		keys: { get_api_key: async () => key },
	}) as unknown as QdrantKeyBuilderContext;
const keyBuilder = (options: Parameters<typeof qdrant>[0]) =>
	qdrant(options).keyBuilder as unknown as NonNullable<
		typeof plugin.keyBuilder
	>;

describe('Qdrant plugin', () => {
	it('registers schemas and metadata for all 29 endpoints', () => {
		const operations = Object.entries(plugin.endpoints ?? {})
			.flatMap(([group, members]) =>
				Object.keys(members as object).map((n) => `${group}.${n}`),
			)
			.sort();
		expect(operations).toHaveLength(29);
		expect(Object.keys(qdrantEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(operations);
	});

	it('marks operations that remove data as destructive', () => {
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		for (const op of [
			'collections.delete',
			'points.delete',
			'points.overwritePayload',
			'snapshots.delete',
		]) {
			expect(meta[op]?.riskLevel).toBe('destructive');
		}
	});

	it('uses the explicit key, then the stored one, and fails closed', async () => {
		await expect(
			keyBuilder({ key: 'explicit' })(keyContext('stored'), 'endpoint'),
		).resolves.toBe('explicit');
		await expect(
			keyBuilder({})(keyContext('stored'), 'endpoint'),
		).resolves.toBe('stored');
		await expect(
			keyBuilder({})(keyContext(), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilder({})(keyContext('stored'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('sends no key only when the server is marked unauthenticated', async () => {
		await expect(
			keyBuilder({ unauthenticated: true })(keyContext(), 'endpoint'),
		).resolves.toBe('');
	});
});
