import { kalshi } from './index';

describe('Kalshi operation risk levels', () => {
	const meta = kalshi().endpointMeta ?? {};
	const level = (op: string) =>
		(meta as Record<string, { riskLevel?: string }>)[op]?.riskLevel;

	it('marks every order write destructive: each one can move real money', () => {
		for (const op of [
			'orders.create',
			'orders.batchCreate',
			'orders.amend',
			'orders.cancel',
		]) {
			expect(level(op)).toBe('destructive');
		}
	});

	it('keeps everything else read', () => {
		const others = Object.entries(meta)
			.filter(([op]) => !op.startsWith('orders.') || /\.(list|get)$/.test(op))
			.map(([, entry]) => (entry as { riskLevel?: string }).riskLevel);
		expect(others.length).toBe(16);
		expect(new Set(others)).toEqual(new Set(['read']));
	});
});
