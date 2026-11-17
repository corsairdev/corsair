import { AuthMissingError } from 'corsair/core';
import { draftable } from './index';

describe('Draftable keyBuilder and risk levels', () => {
	const plugin = draftable();
	// unknown: the test calls keyBuilder with a minimal context double.
	const build = plugin.keyBuilder as unknown as (
		ctx: unknown,
		source: string,
	) => Promise<string>;

	it('returns the stored auth token', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored' },
		};
		await expect(build(ctx, 'endpoint')).resolves.toBe('stored');
	});

	it('throws AuthMissingError when no token is stored', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => null },
		};
		await expect(build(ctx, 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('marks create and delete destructive', () => {
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(Object.keys(meta)).toHaveLength(7);
		expect(meta['comparisons.create']?.riskLevel).toBe('destructive');
		expect(meta['comparisons.delete']?.riskLevel).toBe('destructive');
		expect(meta['exports.create']?.riskLevel).toBe('write');
		expect(meta['comparisons.getViewerUrl']?.riskLevel).toBe('read');
	});
});
