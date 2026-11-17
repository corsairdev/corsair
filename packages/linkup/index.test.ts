import { AuthMissingError } from 'corsair/core';
import { linkup } from './index';

// The plugin's typed maps are cast to plain records to iterate them in tests.
type Meta = Record<string, { riskLevel: string }>;
type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

describe('Linkup plugin', () => {
	it('marks generation jobs destructive and lookups read', () => {
		const meta = linkup().endpointMeta as unknown as Meta;
		expect(Object.keys(meta)).toHaveLength(12);
		expect(
			Object.keys(meta)
				.filter((op) => meta[op]?.riskLevel === 'destructive')
				.sort(),
		).toEqual(['research.create', 'responses.create', 'tasks.create']);
		expect(
			Object.keys(meta).filter(
				(op) => !['read', 'destructive'].includes(meta[op]?.riskLevel ?? ''),
			),
		).toEqual([]);
	});

	it('raises AuthMissingError when no key is available', async () => {
		const keyBuilder = linkup().keyBuilder as unknown as KeyBuilder;
		await expect(
			keyBuilder(
				{ authType: 'api_key', keys: { get_api_key: async () => null } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(keyBuilder({}, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
