import { CoinmarketcalSchema } from './schema';

describe('Coinmarketcal schema', () => {
	it('declares a semver version', () => {
		expect(CoinmarketcalSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers coin, event and category entities', () => {
		expect(Object.keys(CoinmarketcalSchema.entities).sort()).toEqual([
			'categories',
			'coins',
			'events',
		]);
	});

	it('parses a real v2 event and coin payload', () => {
		const event = CoinmarketcalSchema.entities.events.parse({
			id: '97726',
			slug: 'susdd-incentives-launch-81239181-1',
			title: 'sUSDD Incentives Launch',
			description: null,
			date: '2026-08-27T00:00:00Z',
			dateEnd: '2026-11-27T00:00:00Z',
			dateType: 'date',
			isEstimated: false,
			displayedDate: '27 Aug → 27 Nov',
			coins: [{ slug: 'pendle', symbol: 'pendle', name: 'Pendle' }],
			impact: null,
			impactSummary: null,
			sourceUrl: null,
			snapshotUrl: null,
			lastVerifiedAt: null,
			createdAt: '2026-08-27T00:04:17Z',
			updatedAt: '2026-09-01T14:30:02Z',
		});
		expect(event.id).toBe('97726');
		const coin = CoinmarketcalSchema.entities.coins.parse({
			slug: 'bitcoin',
			symbol: 'btc',
			name: 'Bitcoin',
			rank: 1,
			tracked: true,
			iconUrl: 'https://example.com/bitcoin.png',
			upcomingCount: 0,
			majorCount: null,
			peakImpact: null,
		});
		expect(coin.rank).toBe(1);
	});
});
