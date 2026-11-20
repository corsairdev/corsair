import { AuthMissingError } from 'corsair/core';
import { docparser } from './index';

// The plugin's typed maps are cast to plain records to iterate them in tests.
type Meta = Record<string, { riskLevel: string }>;
type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

describe('Docparser plugin', () => {
	it('marks imports, reparse and reintegrate destructive, the rest read', () => {
		const meta = docparser().endpointMeta as unknown as Meta;
		expect(Object.keys(meta)).toHaveLength(10);
		expect(
			Object.keys(meta)
				.filter((op) => meta[op]?.riskLevel !== 'read')
				.sort(),
		).toEqual([
			'documents.fetch',
			'documents.reintegrate',
			'documents.reparse',
			'documents.upload',
		]);
		for (const op of Object.keys(meta).filter(
			(o) => !o.startsWith('documents.') || o === 'documents.status',
		)) {
			expect(meta[op]?.riskLevel).toBe('read');
		}
	});

	it('raises AuthMissingError when no key is stored', async () => {
		const keyBuilder = docparser().keyBuilder as unknown as KeyBuilder;
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
