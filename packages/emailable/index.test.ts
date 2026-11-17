import { AuthMissingError } from 'corsair/core';
import { emailable } from './index';

// The plugin's typed maps are cast to plain records to iterate them in tests.
type Meta = Record<string, { riskLevel: string }>;
type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

describe('Emailable plugin', () => {
	it('marks only the bulk batch job destructive', () => {
		const meta = emailable().endpointMeta as unknown as Meta;
		expect(meta['batches.create']?.riskLevel).toBe('destructive');
		for (const op of ['account.get', 'verifications.verify', 'batches.get']) {
			expect(meta[op]?.riskLevel).toBe('read');
		}
	});

	it('raises AuthMissingError when no key is available', async () => {
		const keyBuilder = emailable().keyBuilder as unknown as KeyBuilder;
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
