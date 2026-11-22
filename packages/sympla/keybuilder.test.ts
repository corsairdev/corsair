import { AuthMissingError } from 'corsair/core';
import { sympla } from './index';

describe('Sympla keyBuilder and risk levels', () => {
	const plugin = sympla();
	// unknown: the test calls keyBuilder with a minimal context double.
	const build = plugin.keyBuilder as unknown as (
		ctx: unknown,
		source: string,
	) => Promise<string>;

	it('returns the stored API token', async () => {
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

	it('marks the three check-ins destructive and everything else read', () => {
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(Object.keys(meta)).toHaveLength(15);
		const destructive = Object.entries(meta)
			.filter(([, m]) => m.riskLevel === 'destructive')
			.map(([k]) => k)
			.sort();
		expect(destructive).toEqual([
			'participants.checkIn',
			'participants.checkInByQrCode',
			'participants.checkInByTicketNumber',
		]);
		expect(
			Object.values(meta).filter((m) => m.riskLevel === 'read'),
		).toHaveLength(12);
	});
});
