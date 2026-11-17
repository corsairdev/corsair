import { AuthMissingError } from 'corsair/core';
import { parsehub } from './index';

describe('ParseHub keyBuilder and risk levels', () => {
	const plugin = parsehub();
	// unknown: the test calls keyBuilder with a minimal context double.
	const build = plugin.keyBuilder as unknown as (
		ctx: unknown,
		source: string,
	) => Promise<string>;

	it('returns the stored API key', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored' },
		};
		await expect(build(ctx, 'endpoint')).resolves.toBe('stored');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		};
		await expect(build(ctx, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('marks run, cancel and delete destructive', () => {
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(Object.keys(meta)).toHaveLength(8);
		expect(meta['runs.cancel']?.riskLevel).toBe('destructive');
		expect(meta['runs.delete']?.riskLevel).toBe('destructive');
		expect(meta['projects.run']?.riskLevel).toBe('destructive');
		expect(meta['runs.getData']?.riskLevel).toBe('read');
	});
});
