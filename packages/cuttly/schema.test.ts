import {
	CuttlyEndpointInputSchemas,
	CuttlyEndpointOutputSchemas,
} from './endpoints/types';
import { CuttlySchema } from './schema';
import { CuttlyLinkEntity } from './schema/database';

describe('Cuttly schema', () => {
	it('declares a semver version', () => {
		expect(CuttlySchema.version).toBeDefined();
		expect(CuttlySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CuttlySchema.entities).toBe('object');
		expect(CuttlySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CuttlySchema.entities))).toBe(true);
		for (const entity of Object.values(CuttlySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates the official link entity shape', () => {
		const parsed = CuttlyLinkEntity.parse({
			status: 7,
			date: '2026-01-01',
			shortLink: 'https://cutt.ly/launch',
			fullLink: 'https://example.com/launch',
			title: 'Launch',
		});

		expect(parsed.status).toBe(7);
		expect(parsed.shortLink).toBe('https://cutt.ly/launch');
		expect(() => CuttlyLinkEntity.parse({ status: 9 })).toThrow();
	});

	it('rejects non-URL link fields', () => {
		expect(
			CuttlyLinkEntity.safeParse({ status: 7, shortLink: 'not-a-url' }).success,
		).toBe(false);
		expect(
			CuttlyLinkEntity.safeParse({ status: 7, fullLink: 'not-a-url' }).success,
		).toBe(false);
	});
});

describe('shorten schemas', () => {
	it('accepts the documented shortening options', () => {
		const parsed = CuttlyEndpointInputSchemas.shorten.parse({
			url: 'https://example.com/launch',
			alias: 'launch',
			useCustomDomain: true,
			publicStats: true,
			noTitle: true,
		});

		expect(parsed.url).toBe('https://example.com/launch');
		expect(parsed.alias).toBe('launch');
	});

	it('rejects invalid destination URLs', () => {
		expect(
			CuttlyEndpointInputSchemas.shorten.safeParse({ url: 'not-a-url' })
				.success,
		).toBe(false);
	});

	it('parses a successful shorten response including the QR code URL', () => {
		const parsed = CuttlyEndpointOutputSchemas.shorten.parse({
			url: {
				status: 7,
				shortLink: 'https://cutt.ly/launch',
				fullLink: 'https://example.com/launch',
				qrCode: 'https://cutt.ly/qr/launch.png',
			},
		});

		expect(parsed.url.status).toBe(7);
		expect(parsed.url.qrCode).toBe('https://cutt.ly/qr/launch.png');
	});
});

describe('update schemas', () => {
	it('accepts a destination-only or alias-only update', () => {
		expect(
			CuttlyEndpointInputSchemas.update.safeParse({
				shortUrl: 'https://cutt.ly/launch',
				url: 'https://example.com/new-launch',
			}).success,
		).toBe(true);
		expect(
			CuttlyEndpointInputSchemas.update.safeParse({
				shortUrl: 'https://cutt.ly/launch',
				alias: 'new-launch',
			}).success,
		).toBe(true);
	});

	it('requires a destination URL or alias', () => {
		expect(
			CuttlyEndpointInputSchemas.update.safeParse({
				shortUrl: 'https://cutt.ly/launch',
			}).success,
		).toBe(false);
	});

	it('parses a successful edit response', () => {
		const parsed = CuttlyEndpointOutputSchemas.update.parse({
			url: { status: 1, shortLink: 'https://cutt.ly/new-launch' },
		});

		expect(parsed.url.status).toBe(1);
	});
});

describe('analytics schemas', () => {
	it('accepts an optional YYYY-MM-DD date range', () => {
		const parsed = CuttlyEndpointInputSchemas.analytics.parse({
			shortUrl: 'https://cutt.ly/launch',
			dateFrom: '2026-01-01',
			dateTo: '2026-01-31',
		});

		expect(parsed.dateFrom).toBe('2026-01-01');
		expect(parsed.dateTo).toBe('2026-01-31');
	});

	it('rejects malformed date filters', () => {
		expect(
			CuttlyEndpointInputSchemas.analytics.safeParse({
				shortUrl: 'https://cutt.ly/launch',
				dateFrom: 'tomorrow',
			}).success,
		).toBe(false);
	});

	it('parses click analytics including the social breakdown', () => {
		const parsed = CuttlyEndpointOutputSchemas.analytics.parse({
			stats: {
				status: 1,
				clicks: 42,
				shortLink: 'https://cutt.ly/launch',
				facebook: 10,
				twitter: 5,
				linkedin: 2,
				rest: 20,
				bots: 5,
			},
		});

		expect(parsed.stats.status).toBe(1);
		expect(parsed.stats.clicks).toBe(42);
	});

	it('parses the live stats shape including gated bot stats', () => {
		// Fixture mirrors a real 2026-10-13 Regular API response: counts are
		// numbers, plan-gated extras arrive as notice strings, and unknown
		// provider fields (pinterest, devices, refs) must not break parsing.
		const parsed = CuttlyEndpointOutputSchemas.analytics.parse({
			stats: {
				status: 1,
				clicks: 0,
				date: '2026-10-13',
				title: 'Example Domain',
				fullLink: 'https://example.com/corsair-cuttly-probe',
				shortLink: 'https://cutt.ly/kyWZWAmk',
				facebook: 0,
				twitter: 0,
				pinterest: 0,
				instagram: 0,
				googlePlus: 0,
				linkedin: 0,
				rest: 0,
				devices: {},
				refs: {},
				bots: 'Insufficient subscription level',
			},
		});

		expect(parsed.stats.status).toBe(1);
		expect(parsed.stats.clicks).toBe(0);
		expect(parsed.stats.bots).toBe('Insufficient subscription level');
	});
});
