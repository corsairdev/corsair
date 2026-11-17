import { AuthMissingError } from 'corsair/core';
import { sensibo } from './index';

describe('Sensibo keyBuilder', () => {
	const plugin = sensibo();
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

	it('declares a risk level for every operation and marks deletes destructive', () => {
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(Object.keys(meta)).toHaveLength(19);
		expect(meta['timer.delete']?.riskLevel).toBe('destructive');
		expect(meta['schedules.delete']?.riskLevel).toBe('destructive');
		expect(meta['devices.list']?.riskLevel).toBe('read');
		expect(meta['acStates.set']?.riskLevel).toBe('write');
	});
});
